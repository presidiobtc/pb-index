import csv
import json
import re
from pathlib import Path

from build_index import parse_timestamp_entries, youtube_id_from_url


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
CATALOG = ROOT / "catalog.csv"
TOPICS_CONFIG = PUBLIC / "topics_config.js"

# Transcript windows are deliberately a little redundant. A modest overlap keeps
# a sentence at a chunk boundary searchable without materially multiplying the
# browser index, while explicit neighbor IDs let retrieval expand the winning
# passage when it needs more context.
TRANSCRIPT_TARGET_CHARS = 950
TRANSCRIPT_MAX_SECONDS = 90
TRANSCRIPT_MIN_CHARS_FOR_TIME_BREAK = 450
TRANSCRIPT_OVERLAP_SECONDS = 10
TRANSCRIPT_OVERLAP_CHARS = 120
TRANSCRIPT_MAX_OVERLAP_SECONDS = 18
TRANSCRIPT_MAX_OVERLAP_CHARS = 200


def clean_text(value: str) -> str:
    value = re.sub(r"<[^>]+>", " ", value or "")
    value = value.replace("&gt;", ">").replace("&amp;", "&")
    return re.sub(r"\s+", " ", value).strip()


def slugify(value: str) -> str:
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "chunk"


def canonical_topic_name(name: str) -> str:
    aliases = {
        "ai data privacy": "AI privacy",
        "privacy first ai": "AI privacy",
        "bitcoin lending": "Bitcoin-backed loans",
    }
    normalized = re.sub(r"[-–—]", " ", name).lower()
    normalized = re.sub(r"\s+", " ", normalized).strip()
    return aliases.get(normalized, name)


def dedupe_video_picks(picks):
    seen = set()
    deduped = []
    for pick in picks:
        key = (pick.get("youtube_id"), pick.get("t"))
        if key in seen:
            continue
        seen.add(key)
        deduped.append(pick)
    return deduped


def dedupe_report_picks(picks):
    seen = set()
    deduped = []
    for pick in picks:
        key = pick.get("url")
        if key in seen:
            continue
        seen.add(key)
        deduped.append(pick)
    return deduped


def read_catalog():
    rows = []
    with CATALOG.open(newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f, skipinitialspace=True):
            youtube_id = youtube_id_from_url(row["youtube_url"])
            rows.append({
                "youtube_id": youtube_id,
                "youtube_url": f"https://www.youtube.com/watch?v={youtube_id}",
                "title": row["title"].strip(),
                "series": row.get("series", "").strip(),
                "date": row.get("published_date", "").strip(),
                "transcript_file": row.get("transcript_file", "").strip(),
                "description_file": row.get("description_file", "").strip(),
            })
    return rows


def extract_topic_blocks(raw: str):
    """Return topic object literals without evaluating the JavaScript config.

    TOPIC_DEFS is assembled from one declaration and several addTopicDefs calls.
    A small stateful scanner is safer than splitting on formatting: it ignores
    braces inside strings/comments and fails loudly on an unterminated array.
    """
    marker_re = re.compile(r"(?:const\s+TOPIC_DEFS\s*=|addTopicDefs\s*\()\s*\[")
    blocks = []

    for marker in marker_re.finditer(raw):
        array_start = raw.find("[", marker.start(), marker.end())
        array_depth = 0
        brace_depth = 0
        block_start = None
        quote = None
        escaped = False
        line_comment = False
        block_comment = False
        closed = False
        i = array_start

        while i < len(raw):
            ch = raw[i]
            nxt = raw[i + 1] if i + 1 < len(raw) else ""

            if line_comment:
                if ch == "\n":
                    line_comment = False
                i += 1
                continue
            if block_comment:
                if ch == "*" and nxt == "/":
                    block_comment = False
                    i += 2
                else:
                    i += 1
                continue
            if quote:
                if escaped:
                    escaped = False
                elif ch == "\\":
                    escaped = True
                elif ch == quote:
                    quote = None
                i += 1
                continue
            if ch == "/" and nxt == "/":
                line_comment = True
                i += 2
                continue
            if ch == "/" and nxt == "*":
                block_comment = True
                i += 2
                continue
            if ch in {'"', "'", "`"}:
                quote = ch
                i += 1
                continue

            if ch == "[":
                array_depth += 1
            elif ch == "]":
                array_depth -= 1
                if array_depth == 0:
                    closed = True
                    break
            elif ch == "{":
                if array_depth == 1 and brace_depth == 0:
                    block_start = i
                brace_depth += 1
            elif ch == "}":
                brace_depth -= 1
                if brace_depth < 0:
                    raise ValueError(f"Unexpected closing brace near byte {i} in topics_config.js")
                if brace_depth == 0 and block_start is not None:
                    blocks.append(raw[block_start:i + 1])
                    block_start = None
            i += 1

        if not closed or brace_depth != 0 or quote or block_comment:
            line = raw.count("\n", 0, marker.start()) + 1
            raise ValueError(f"Unterminated topic array beginning near line {line}")

    if not blocks:
        raise ValueError("No TOPIC_DEFS/addTopicDefs arrays found in topics_config.js")
    return blocks


def extract_topics(raw=None):
    raw = raw if raw is not None else TOPICS_CONFIG.read_text(encoding="utf-8")
    topics_by_name = {}
    blocks = extract_topic_blocks(raw)
    for block in blocks:
        name_match = re.search(r'\bname\s*:\s*"((?:\\.|[^"\\])*)"', block)
        if not name_match:
            raise ValueError(f"Topic object is missing a double-quoted name: {block[:120]!r}")
        name = canonical_topic_name(json.loads(f'"{name_match.group(1)}"'))
        keywords = []
        keyword_match = re.search(r"keywords:\s*\[([^\]]*)\]", block)
        if keyword_match:
            keywords = [
                json.loads(f'"{value}"')
                for value in re.findall(r'"((?:\\.|[^"\\])*)"', keyword_match.group(1))
            ]

        video_picks = []
        for pick in re.finditer(
            r'youtube_id:\s*"([^"\\]+)"\s*,\s*t:\s*(\d+)\s*,\s*label:\s*"((?:\\.|[^"\\])*)"',
            block,
        ):
            video_picks.append({
                "youtube_id": pick.group(1),
                "t": int(pick.group(2)),
                "label": clean_text(json.loads(f'"{pick.group(3)}"')),
            })

        video_pick_refs = len(re.findall(r'\byoutube_id\s*:', block))
        if video_pick_refs != len(video_picks):
            raise ValueError(
                f"Could not safely parse every video pick for topic {name!r}: "
                f"found {video_pick_refs} references but parsed {len(video_picks)}"
            )

        report_picks = []
        for pick in re.finditer(
            r'quantumReportPick\("((?:\\.|[^"\\])*)",\s*"((?:\\.|[^"\\])*)",\s*"((?:\\.|[^"\\])*)"\)',
            block,
        ):
            anchor, section, label = [json.loads(f'"{value}"') for value in pick.groups()]
            report_picks.append({
                "url": f"https://presidiobtc.github.io/bitcoin-quantum/{anchor}",
                "section": section,
                "label": label,
            })

        report_pick_refs = len(re.findall(r'\bquantumReportPick\s*\(', block))
        if report_pick_refs != len(report_picks):
            raise ValueError(
                f"Could not safely parse every report pick for topic {name!r}: "
                f"found {report_pick_refs} references but parsed {len(report_picks)}"
            )

        if keywords or video_picks or report_picks:
            if name not in topics_by_name:
                topics_by_name[name] = {
                    "name": name,
                    "keywords": [],
                    "video_picks": [],
                    "report_picks": [],
                }
            topic = topics_by_name[name]
            topic["keywords"] = sorted(set([*topic["keywords"], *keywords]))
            topic["video_picks"] = dedupe_video_picks([*topic["video_picks"], *video_picks])
            topic["report_picks"] = dedupe_report_picks([*topic["report_picks"], *report_picks])
    return list(topics_by_name.values())


def topic_names_for_window(topic_picks_by_video, youtube_id, start, end):
    names = []
    for pick in topic_picks_by_video.get(youtube_id, []):
        if start <= pick["t"] <= end and pick["name"] not in names:
            names.append(pick["name"])
    return names[:8]


def make_chunk(
    chunk_id,
    chunk_type,
    title,
    series,
    date,
    text,
    url,
    topics=None,
    keywords=None,
    youtube_id=None,
    t=None,
    ts=None,
    end_t=None,
    end_ts=None,
    chunk_index=None,
    prev_id=None,
    next_id=None,
    section=None,
):
    return {
        "id": chunk_id,
        "type": chunk_type,
        "title": title,
        "series": series,
        "date": date,
        "text": clean_text(text),
        "url": url,
        "topics": topics or [],
        **({"keywords": keywords} if keywords else {}),
        **({"youtube_id": youtube_id} if youtube_id else {}),
        **({"t": t} if t is not None else {}),
        **({"ts": ts} if ts is not None else {}),
        **({"end_t": end_t} if end_t is not None else {}),
        **({"end_ts": end_ts} if end_ts is not None else {}),
        **({"chunk_index": chunk_index} if chunk_index is not None else {}),
        **({"prev_id": prev_id} if prev_id is not None else {}),
        **({"next_id": next_id} if next_id is not None else {}),
        **({"section": section} if section else {}),
    }


def transcript_windows(entries):
    """Build overlapping inclusive entry-index windows for one transcript."""
    windows = []
    start = 0
    while start < len(entries):
        end = start
        text_chars = 0
        while end < len(entries):
            entry_text = clean_text(entries[end][2])
            text_chars += len(entry_text) + (1 if text_chars else 0)
            elapsed = entries[end][0] - entries[start][0]
            end += 1
            if text_chars >= TRANSCRIPT_TARGET_CHARS:
                break
            if elapsed >= TRANSCRIPT_MAX_SECONDS and text_chars >= TRANSCRIPT_MIN_CHARS_FOR_TIME_BREAK:
                break

        windows.append((start, end))
        if end >= len(entries):
            break

        overlap_start = end - 1
        overlap_chars = len(clean_text(entries[overlap_start][2]))
        while overlap_start > start + 1:
            candidate = overlap_start - 1
            candidate_chars = overlap_chars + 1 + len(clean_text(entries[candidate][2]))
            candidate_seconds = entries[end - 1][0] - entries[candidate][0]
            overlap_start = candidate
            overlap_chars = candidate_chars
            if (
                (overlap_chars >= TRANSCRIPT_OVERLAP_CHARS and candidate_seconds >= TRANSCRIPT_OVERLAP_SECONDS)
                or overlap_chars >= TRANSCRIPT_MAX_OVERLAP_CHARS
                or candidate_seconds >= TRANSCRIPT_MAX_OVERLAP_SECONDS
            ):
                break
        start = max(start + 1, overlap_start)

    # Keep a tiny trailing fragment searchable without creating a low-signal
    # standalone result. Expanding the preceding window is cheap and lossless.
    if len(windows) > 1:
        last_start, last_end = windows[-1]
        last_text = clean_text(" ".join(entry[2] for entry in entries[last_start:last_end]))
        if len(last_text) < 80:
            previous_start, _ = windows[-2]
            windows[-2] = (previous_start, last_end)
            windows.pop()
    return windows


def build_transcript_chunks(catalog_rows, topic_picks_by_video):
    chunks = []
    for row in catalog_rows:
        path = ROOT / row["transcript_file"]
        if not path.exists():
            continue
        entries = parse_timestamp_entries(path.read_text(encoding="utf-8", errors="ignore"))
        if not entries:
            continue

        episode_chunks = []
        for chunk_index, (start, end) in enumerate(transcript_windows(entries)):
            window_entries = entries[start:end]
            start_t, start_ts, _ = window_entries[0]
            end_t, end_ts, _ = window_entries[-1]
            text = clean_text(" ".join(entry[2] for entry in window_entries))
            chunk_id = f"{row['youtube_id']}:{start_t}"
            url = f"{row['youtube_url']}&t={start_t}s"
            topics = topic_names_for_window(topic_picks_by_video, row["youtube_id"], start_t, end_t)
            episode_chunks.append(make_chunk(
                chunk_id,
                "transcript",
                row["title"],
                row["series"],
                row["date"],
                text,
                url,
                topics=topics,
                youtube_id=row["youtube_id"],
                t=start_t,
                ts=start_ts,
                end_t=end_t,
                end_ts=end_ts,
                chunk_index=chunk_index,
            ))
        for index, chunk in enumerate(episode_chunks):
            if index:
                chunk["prev_id"] = episode_chunks[index - 1]["id"]
            if index + 1 < len(episode_chunks):
                chunk["next_id"] = episode_chunks[index + 1]["id"]
        chunks.extend(episode_chunks)
    return chunks


def build_description_chunks(catalog_rows):
    chunks = []
    for row in catalog_rows:
        path = ROOT / row["description_file"]
        if not path.exists():
            continue
        raw = clean_text(path.read_text(encoding="utf-8", errors="ignore"))
        if not raw:
            continue
        parts = re.split(r"(?<=\.)\s+|(?:\n\s*){2,}", raw)
        bucket = []
        index = 0
        for part in parts:
            if not part.strip():
                continue
            bucket.append(part.strip())
            if len(" ".join(bucket)) >= 1200:
                text = " ".join(bucket)
                chunks.append(make_chunk(
                    f"desc:{row['youtube_id']}:{index}",
                    "description",
                    row["title"],
                    row["series"],
                    row["date"],
                    text,
                    row["youtube_url"],
                    youtube_id=row["youtube_id"],
                ))
                index += 1
                bucket = []
        if bucket:
            chunks.append(make_chunk(
                f"desc:{row['youtube_id']}:{index}",
                "description",
                row["title"],
                row["series"],
                row["date"],
                " ".join(bucket),
                row["youtube_url"],
                youtube_id=row["youtube_id"],
            ))
    return chunks


def build_topic_chunks(topics, catalog_by_id):
    chunks = []
    for topic in topics:
        for i, pick in enumerate(topic["video_picks"]):
            row = catalog_by_id.get(pick["youtube_id"], {})
            title = row.get("title", topic["name"])
            series = row.get("series", "")
            date = row.get("date", "")
            url = f"https://www.youtube.com/watch?v={pick['youtube_id']}&t={pick['t']}s"
            chunks.append(make_chunk(
                f"topic:{slugify(topic['name'])}:{pick['youtube_id']}:{pick['t']}:{i}",
                "topic",
                title,
                series,
                date,
                pick["label"],
                url,
                topics=[topic["name"]],
                keywords=topic["keywords"],
                youtube_id=pick["youtube_id"],
                t=pick["t"],
            ))
        for i, pick in enumerate(topic["report_picks"]):
            chunks.append(make_chunk(
                f"report-topic:{slugify(topic['name'])}:{i}",
                "report",
                "Bitcoin's Quantum Readiness Report",
                "Bitcoin's Quantum Readiness Report",
                "v1.0 April 2026",
                pick["label"],
                pick["url"],
                topics=[topic["name"]],
                keywords=topic["keywords"],
                section=pick["section"],
            ))
    return chunks


def main():
    catalog_rows = read_catalog()
    catalog_by_id = {row["youtube_id"]: row for row in catalog_rows}
    topics = extract_topics()
    topic_picks_by_video = {}
    for topic in topics:
        for pick in topic["video_picks"]:
            topic_picks_by_video.setdefault(pick["youtube_id"], []).append({
                "name": topic["name"],
                "t": pick["t"],
            })

    chunks = []
    chunks.extend(build_transcript_chunks(catalog_rows, topic_picks_by_video))
    chunks.extend(build_description_chunks(catalog_rows))
    chunks.extend(build_topic_chunks(topics, catalog_by_id))

    seen = set()
    deduped = []
    for chunk in chunks:
        if not chunk["text"] or chunk["id"] in seen:
            continue
        seen.add(chunk["id"])
        deduped.append(chunk)

    out_path = PUBLIC / "search_chunks.json"
    out_path.write_text(json.dumps(deduped, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {len(deduped)} search chunks to {out_path}")


if __name__ == "__main__":
    main()
