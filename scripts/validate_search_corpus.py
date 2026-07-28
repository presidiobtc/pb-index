#!/usr/bin/env python3
"""Validate the source corpus and the in-memory Ask PB search build.

This is intentionally independent of public/search_chunks.json so it catches a
stale generated artifact as a separate deployment concern and can validate a
new builder before overwriting the production index.
"""

import argparse
import csv
import json
import re
import sys
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from build_index import parse_timestamp_entries
from build_search_chunks import (
    CATALOG,
    ROOT,
    TOPICS_CONFIG,
    build_description_chunks,
    build_topic_chunks,
    build_transcript_chunks,
    clean_text,
    extract_topic_blocks,
    extract_topics,
    read_catalog,
)


YOUTUBE_ID_RE = re.compile(r"^[A-Za-z0-9_-]{11}$")
ISO_DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
YOUTUBE_HOSTS = {"youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"}


def issue(code, message, **context):
    return {"code": code, "message": message, **context}


def safe_repo_path(raw_path, field, youtube_id, errors):
    if not raw_path:
        errors.append(issue(f"missing_{field}", f"Catalog row has no {field}", youtube_id=youtube_id))
        return None
    path = (ROOT / raw_path).resolve()
    try:
        path.relative_to(ROOT.resolve())
    except ValueError:
        errors.append(issue(
            f"unsafe_{field}",
            f"{field} points outside the repository: {raw_path}",
            youtube_id=youtube_id,
        ))
        return None
    return path


def youtube_id_from_catalog_url(raw_url):
    try:
        parsed = urlparse(raw_url)
    except ValueError:
        return None
    host = parsed.netloc.lower().split(":", 1)[0]
    if parsed.scheme != "https" or host not in YOUTUBE_HOSTS:
        return None
    if host == "youtu.be":
        candidate = parsed.path.strip("/").split("/", 1)[0]
    elif parsed.path == "/watch":
        candidate = parse_qs(parsed.query).get("v", [None])[0]
    elif parsed.path.startswith("/live/"):
        candidate = parsed.path.split("/live/", 1)[1].split("/", 1)[0]
    else:
        return None
    return candidate if candidate and YOUTUBE_ID_RE.fullmatch(candidate) else None


def validate_catalog(errors, warnings, stats):
    with CATALOG.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle, skipinitialspace=True)
        required = {
            "youtube_url", "title", "series", "published_date",
            "transcript_file", "description_file",
        }
        missing_columns = sorted(required - set(reader.fieldnames or []))
        if missing_columns:
            errors.append(issue(
                "missing_catalog_columns",
                f"catalog.csv is missing columns: {', '.join(missing_columns)}",
            ))
            return [], {}, {}
        raw_rows = list(reader)

    seen_ids = {}
    transcript_entries = {}
    durations = {}
    transcript_paths = Counter()
    description_paths = Counter()

    for row_number, row in enumerate(raw_rows, start=2):
        raw_url = (row.get("youtube_url") or "").strip()
        youtube_id = youtube_id_from_catalog_url(raw_url)
        if youtube_id is None:
            errors.append(issue(
                "malformed_youtube_url",
                f"Malformed YouTube URL on catalog row {row_number}: {raw_url!r}",
                row=row_number,
            ))
            youtube_id = f"invalid-row-{row_number}"
        elif youtube_id in seen_ids:
            errors.append(issue(
                "duplicate_youtube_id",
                f"Duplicate YouTube ID {youtube_id} on rows {seen_ids[youtube_id]} and {row_number}",
                youtube_id=youtube_id,
            ))
        else:
            seen_ids[youtube_id] = row_number

        for field in ("title", "series"):
            if not (row.get(field) or "").strip():
                errors.append(issue(
                    f"missing_{field}",
                    f"Catalog row {row_number} has no {field}",
                    youtube_id=youtube_id,
                ))

        published = (row.get("published_date") or "").strip()
        try:
            parsed_date = date.fromisoformat(published)
            if not ISO_DATE_RE.fullmatch(published) or parsed_date.isoformat() != published:
                raise ValueError
        except ValueError:
            errors.append(issue(
                "malformed_published_date",
                f"Malformed published_date on row {row_number}: {published!r}",
                youtube_id=youtube_id,
            ))

        transcript_raw = (row.get("transcript_file") or "").strip()
        transcript_path = safe_repo_path(transcript_raw, "transcript_file", youtube_id, errors)
        if transcript_path:
            transcript_paths[transcript_path] += 1
            if not transcript_path.is_file():
                errors.append(issue(
                    "missing_transcript_file",
                    f"Missing transcript file: {transcript_raw}",
                    youtube_id=youtube_id,
                ))
            else:
                entries = parse_timestamp_entries(
                    transcript_path.read_text(encoding="utf-8", errors="ignore")
                )
                if not entries:
                    errors.append(issue(
                        "empty_transcript",
                        f"Transcript has no timestamped text: {transcript_raw}",
                        youtube_id=youtube_id,
                    ))
                else:
                    timestamps = [entry[0] for entry in entries]
                    if timestamps != sorted(timestamps):
                        errors.append(issue(
                            "nonmonotonic_transcript",
                            f"Transcript timestamps are not monotonic: {transcript_raw}",
                            youtube_id=youtube_id,
                        ))
                    transcript_entries[youtube_id] = entries
                    durations[youtube_id] = max(timestamps)

        description_raw = (row.get("description_file") or "").strip()
        description_path = safe_repo_path(description_raw, "description_file", youtube_id, errors)
        if description_path:
            description_paths[description_path] += 1
            if not description_path.is_file():
                errors.append(issue(
                    "missing_description_file",
                    f"Missing description file: {description_raw}",
                    youtube_id=youtube_id,
                ))
            elif not clean_text(description_path.read_text(encoding="utf-8", errors="ignore")):
                warnings.append(issue(
                    "empty_description",
                    f"Description is empty; transcript search remains available: {description_raw}",
                    youtube_id=youtube_id,
                ))

    for path, count in transcript_paths.items():
        if count > 1:
            errors.append(issue(
                "duplicate_transcript_path",
                f"Transcript path is used by {count} catalog rows: {path.relative_to(ROOT)}",
            ))
    for path, count in description_paths.items():
        if count > 1:
            errors.append(issue(
                "duplicate_description_path",
                f"Description path is used by {count} catalog rows: {path.relative_to(ROOT)}",
            ))

    stats["catalog_videos"] = len(raw_rows)
    stats["transcripts_with_entries"] = len(transcript_entries)
    stats["descriptions_expected"] = len(raw_rows)
    return raw_rows, transcript_entries, durations


def validate_topics(catalog_ids, durations, errors, warnings, stats):
    raw = TOPICS_CONFIG.read_text(encoding="utf-8")
    try:
        blocks = extract_topic_blocks(raw)
        topics = extract_topics(raw)
    except (ValueError, json.JSONDecodeError) as exc:
        errors.append(issue("topics_config_parse_error", str(exc)))
        return []

    for topic in topics:
        name = topic["name"]
        if not topic["keywords"]:
            errors.append(issue("topic_without_keywords", f"Topic has no keywords: {name}", topic=name))
        if not topic["video_picks"] and not topic["report_picks"]:
            errors.append(issue("topic_without_picks", f"Topic has no curated picks: {name}", topic=name))
        for pick in topic["video_picks"]:
            youtube_id = pick["youtube_id"]
            timestamp = pick["t"]
            if youtube_id not in catalog_ids:
                errors.append(issue(
                    "unknown_topic_youtube_id",
                    f"Topic {name!r} references YouTube ID absent from catalog: {youtube_id}",
                    topic=name,
                    youtube_id=youtube_id,
                ))
                continue
            if youtube_id not in durations:
                errors.append(issue(
                    "topic_video_without_transcript",
                    f"Topic {name!r} references a video without a usable transcript: {youtube_id}",
                    topic=name,
                    youtube_id=youtube_id,
                ))
                continue
            if timestamp < 0 or timestamp > durations[youtube_id]:
                errors.append(issue(
                    "topic_timestamp_out_of_range",
                    f"Topic {name!r} timestamp {timestamp}s exceeds transcript range 0-{durations[youtube_id]}s",
                    topic=name,
                    youtube_id=youtube_id,
                    timestamp=timestamp,
                    transcript_end=durations[youtube_id],
                ))
        for pick in topic["report_picks"]:
            parsed = urlparse(pick["url"])
            if parsed.scheme != "https" or parsed.netloc != "presidiobtc.github.io" or not parsed.fragment:
                errors.append(issue(
                    "malformed_report_url",
                    f"Topic {name!r} has malformed report URL: {pick['url']}",
                    topic=name,
                ))

    stats["topic_objects"] = len(blocks)
    stats["canonical_topics"] = len(topics)
    stats["video_topic_picks"] = sum(len(topic["video_picks"]) for topic in topics)
    stats["report_topic_picks"] = sum(len(topic["report_picks"]) for topic in topics)
    stats["zero_timestamp_picks"] = sum(
        pick["t"] == 0 for topic in topics for pick in topic["video_picks"]
    )
    return topics


def validate_in_memory_build(catalog_rows, topics, errors, warnings, stats):
    if not catalog_rows or not topics:
        return
    normalized_rows = read_catalog()
    catalog_by_id = {row["youtube_id"]: row for row in normalized_rows}
    topic_picks_by_video = defaultdict(list)
    for topic in topics:
        for pick in topic["video_picks"]:
            topic_picks_by_video[pick["youtube_id"]].append({"name": topic["name"], "t": pick["t"]})

    transcript_chunks = build_transcript_chunks(normalized_rows, topic_picks_by_video)
    description_chunks = build_description_chunks(normalized_rows)
    topic_chunks = build_topic_chunks(topics, catalog_by_id)
    chunks = [*transcript_chunks, *description_chunks, *topic_chunks]

    id_counts = Counter(chunk["id"] for chunk in chunks)
    duplicate_ids = sorted(chunk_id for chunk_id, count in id_counts.items() if count > 1)
    if duplicate_ids:
        errors.append(issue(
            "duplicate_chunk_ids",
            f"Generated search corpus has {len(duplicate_ids)} duplicate chunk IDs",
            examples=duplicate_ids[:10],
        ))

    expected_ids = set(catalog_by_id)
    transcript_ids = {chunk["youtube_id"] for chunk in transcript_chunks}
    description_ids = {chunk["youtube_id"] for chunk in description_chunks}
    for youtube_id in sorted(expected_ids - transcript_ids):
        errors.append(issue(
            "missing_transcript_coverage",
            f"Generated search corpus has no transcript chunk for {youtube_id}",
            youtube_id=youtube_id,
        ))
    for youtube_id in sorted(expected_ids - description_ids):
        already_reported = any(
            entry.get("youtube_id") == youtube_id
            and entry["code"] in {"missing_description_file", "empty_description"}
            for entry in [*errors, *warnings]
        )
        if not already_reported:
            warnings.append(issue(
                "missing_description_coverage",
                f"Generated search corpus has no description chunk for {youtube_id}; transcript coverage remains available",
                youtube_id=youtube_id,
            ))

    represented_topics = {name for chunk in topic_chunks for name in chunk.get("topics", [])}
    expected_topics = {topic["name"] for topic in topics}
    for name in sorted(expected_topics - represented_topics):
        errors.append(issue(
            "missing_topic_coverage",
            f"Generated search corpus has no curated chunk for topic {name!r}",
            topic=name,
        ))

    chunks_by_video = defaultdict(list)
    for chunk in transcript_chunks:
        chunks_by_video[chunk["youtube_id"]].append(chunk)
        if chunk.get("end_t", -1) < chunk.get("t", 0):
            errors.append(issue(
                "invalid_transcript_chunk_range",
                f"Transcript chunk ends before it starts: {chunk['id']}",
                chunk_id=chunk["id"],
            ))
    for chunk in topic_chunks:
        if chunk.get("t") == 0 and ("t" not in chunk or "&t=0s" not in chunk["url"]):
            errors.append(issue(
                "lost_zero_timestamp",
                f"Curated topic chunk lost its valid 00:00 timestamp: {chunk['id']}",
                chunk_id=chunk["id"],
            ))

    overlap_pairs = 0
    for youtube_id, episode_chunks in chunks_by_video.items():
        episode_chunks.sort(key=lambda chunk: chunk["chunk_index"])
        for index, chunk in enumerate(episode_chunks):
            if chunk["chunk_index"] != index:
                errors.append(issue(
                    "nonsequential_chunk_index",
                    f"Transcript chunks are not sequential for {youtube_id}",
                    youtube_id=youtube_id,
                ))
                break
            expected_prev = episode_chunks[index - 1]["id"] if index else None
            expected_next = episode_chunks[index + 1]["id"] if index + 1 < len(episode_chunks) else None
            if chunk.get("prev_id") != expected_prev or chunk.get("next_id") != expected_next:
                errors.append(issue(
                    "broken_neighbor_link",
                    f"Broken transcript neighbor metadata on {chunk['id']}",
                    chunk_id=chunk["id"],
                ))
            if expected_next and episode_chunks[index + 1]["t"] <= chunk["end_t"]:
                overlap_pairs += 1

    multi_chunk_videos = sum(len(video_chunks) > 1 for video_chunks in chunks_by_video.values())
    if multi_chunk_videos and overlap_pairs < multi_chunk_videos:
        errors.append(issue(
            "insufficient_transcript_overlap",
            "Not every multi-chunk transcript has an overlapping adjacent window",
            multi_chunk_videos=multi_chunk_videos,
            overlap_pairs=overlap_pairs,
        ))

    stats["transcript_chunks"] = len(transcript_chunks)
    stats["description_chunks"] = len(description_chunks)
    stats["topic_and_report_chunks"] = len(topic_chunks)
    stats["generated_chunks"] = len(chunks)
    stats["overlapping_transcript_pairs"] = overlap_pairs
    stats["zero_timestamp_chunks"] = sum(
        chunk.get("t") == 0 for chunk in transcript_chunks
    )


def validate():
    errors = []
    warnings = []
    stats = {}
    raw_rows, _transcript_entries, durations = validate_catalog(errors, warnings, stats)
    catalog_ids = {
        youtube_id
        for row in raw_rows
        if (youtube_id := youtube_id_from_catalog_url((row.get("youtube_url") or "").strip()))
    }
    topics = validate_topics(catalog_ids, durations, errors, warnings, stats)
    validate_in_memory_build(raw_rows, topics, errors, warnings, stats)
    return {
        "ok": not errors,
        "errors": errors,
        "warnings": warnings,
        "stats": stats,
    }


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--json", action="store_true", help="Print machine-readable JSON")
    args = parser.parse_args(argv)
    result = validate()
    if args.json:
        print(json.dumps(result, ensure_ascii=False, sort_keys=True))
    else:
        status = "PASS" if result["ok"] else "FAIL"
        print(f"[{status}] Ask PB corpus validation")
        for entry in result["errors"]:
            print(f"ERROR {entry['code']}: {entry['message']}")
        for entry in result["warnings"]:
            print(f"WARN  {entry['code']}: {entry['message']}")
        print("Stats: " + ", ".join(f"{key}={value}" for key, value in sorted(result["stats"].items())))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
