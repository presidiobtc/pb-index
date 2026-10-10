"""Import verified OSAIS recordings using dates from the official event agenda.

Run this before build_index.py and build_search_chunks.py. The reviewed session
manifest keeps upload dates and the playlist's PBJ recap out of summit results.
Existing transcripts and descriptions are preserved. Sessions without public
recordings remain in the manifest but are not added to the catalog.
"""

import argparse
import csv
import io
import json
import shutil
import subprocess
import sys
import time
from pathlib import Path

from youtube_transcript_api import YouTubeTranscriptApi

from build_index import parse_timestamp_entries, youtube_id_from_url
from fetch_transcripts import format_transcript


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = Path(__file__).with_name("osais_sessions.json")


def read_catalog(path):
    # Preserve hand-edited CSV quoting and line endings on unchanged rows.
    raw_lines = path.read_bytes().decode("utf-8").splitlines(keepends=True)
    reader = csv.reader(raw_lines)
    fieldnames = next(reader)
    header = "".join(raw_lines[:reader.line_num])
    previous_line = reader.line_num
    rows = []
    original_records = {}
    for values in reader:
        raw = "".join(raw_lines[previous_line:reader.line_num])
        previous_line = reader.line_num
        rows.append(dict(zip(fieldnames, values)))
        original_records[tuple(values)] = raw
    return fieldnames, header, rows, original_records


def fetch_metadata(video_id, metadata_dir):
    cached = metadata_dir / f"{video_id}.info.json" if metadata_dir else None
    if cached and cached.is_file():
        metadata = json.loads(cached.read_text(encoding="utf-8"))
    else:
        ytdlp = shutil.which("yt-dlp") or "/opt/homebrew/bin/yt-dlp"
        result = subprocess.run(
            [ytdlp, "--no-update", "--skip-download", "--no-warnings",
             "--dump-single-json", f"https://www.youtube.com/watch?v={video_id}"],
            capture_output=True, text=True, check=True,
        )
        metadata = json.loads(result.stdout)
    if metadata.get("id") != video_id or not metadata.get("title"):
        raise ValueError(f"Invalid metadata for {video_id}")
    return metadata


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--metadata-dir", type=Path, help="Optional yt-dlp info JSON cache")
    parser.add_argument("--delay", type=float, default=2, help="Seconds between caption requests")
    args = parser.parse_args(argv)

    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    sessions = [session for session in manifest["sessions"] if session["youtube_id"]]
    ids = [session["youtube_id"] for session in sessions]
    if len(ids) != len(set(ids)):
        raise ValueError("Duplicate video IDs in the summit manifest")

    catalog_path = ROOT / "catalog.csv"
    fieldnames, header, rows, original_records = read_catalog(catalog_path)
    existing = {youtube_id_from_url(row["youtube_url"]): row for row in rows}
    if len(existing) != len(rows):
        raise ValueError("Duplicate video IDs in catalog.csv")

    api = YouTubeTranscriptApi()
    added = updated = fetched = failed = 0
    for session in sessions:
        video_id = session["youtube_id"]
        transcript_path = ROOT / "transcripts_raw" / f"{video_id}.txt"
        description_path = ROOT / "descriptions" / f"{video_id}.txt"
        print(f"{session['date']} | {session['title']} ({video_id})", flush=True)
        try:
            old = existing.get(video_id)
            if old and old["series"] != manifest["series"]:
                raise ValueError(f"Video already belongs to {old['series']}")
            metadata = None
            if not old or not description_path.is_file() or not description_path.stat().st_size:
                metadata = fetch_metadata(video_id, args.metadata_dir)
            if not transcript_path.is_file() or not transcript_path.stat().st_size:
                segments = api.fetch(video_id, languages=["en"])
                raw = format_transcript(segments)
                if not parse_timestamp_entries(raw):
                    raise ValueError("YouTube returned no timestamped captions")
                transcript_path.parent.mkdir(exist_ok=True)
                transcript_path.write_text(raw, encoding="utf-8")
                fetched += 1
                print(f"  Saved {len(segments)} caption segments", flush=True)
                if args.delay > 0:
                    time.sleep(args.delay)
            else:
                raw = transcript_path.read_text(encoding="utf-8")
                if not parse_timestamp_entries(raw):
                    raise ValueError("Existing transcript has no timestamped text")
            if not description_path.is_file() or not description_path.stat().st_size:
                description = "\n".join(
                    line.rstrip() for line in (metadata.get("description") or "").splitlines()
                ).strip()
                if not description:
                    raise ValueError("YouTube returned an empty description")
                description_path.parent.mkdir(exist_ok=True)
                description_path.write_text(description, encoding="utf-8")
            if old:
                if old["published_date"] != session["date"]:
                    old["published_date"] = session["date"]
                    updated += 1
            else:
                row = {
                    "youtube_url": f"https://www.youtube.com/watch?v={video_id}",
                    "title": metadata["title"],
                    "series": manifest["series"],
                    "published_date": session["date"],
                    "transcript_file": f"transcripts_raw/{video_id}.txt",
                    "description_file": f"descriptions/{video_id}.txt",
                }
                rows.append(row)
                existing[video_id] = row
                added += 1
        except Exception as error:
            print(f"  Failed: {type(error).__name__}: {error}", file=sys.stderr, flush=True)
            failed += 1

    if added or updated:
        rows.sort(key=lambda row: row["published_date"], reverse=True)
        output = [header]
        for row in rows:
            values = tuple(row[field] for field in fieldnames)
            if values in original_records:
                output.append(original_records[values])
            else:
                buffer = io.StringIO(newline="")
                csv.writer(buffer, lineterminator="\n").writerow(values)
                output.append(buffer.getvalue())
        with catalog_path.open("w", newline="", encoding="utf-8") as handle:
            handle.write("".join(output))
    unavailable = len(manifest["sessions"]) - len(sessions)
    print(f"OSAIS: {added} added, {updated} dates corrected, {fetched} transcripts fetched, "
          f"{failed} failed; {unavailable} agenda sessions have no published recording.")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
