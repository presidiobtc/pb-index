"""
Fetches missing transcripts for any catalog entries that don't have one yet.
Run this after a YouTube IP block clears (usually a few hours).
"""
import csv, time
from pathlib import Path
from youtube_transcript_api import YouTubeTranscriptApi

ROOT = Path(__file__).resolve().parents[1]


def seconds_to_hms(seconds):
    s = int(seconds)
    return f"{s//3600:02d}:{(s%3600)//60:02d}:{s%60:02d}"


def format_transcript(segments):
    parts = []
    for seg in segments:
        text = seg.text.replace("\n", " ").strip()
        if text:
            parts.append(f"[{seconds_to_hms(seg.start)}] {text}")
    return " ".join(parts)


def main():
    catalog_path = ROOT / "catalog.csv"
    transcripts_dir = ROOT / "transcripts_raw"
    transcripts_dir.mkdir(exist_ok=True)

    with open(catalog_path, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f, skipinitialspace=True))

    missing = [
        r for r in rows
        if not (ROOT / r["transcript_file"].strip()).exists()
    ]
    print(f"{len(missing)} transcripts missing out of {len(rows)} total")

    if not missing:
        print("Nothing to do.")
        return

    api = YouTubeTranscriptApi()
    fetched = skipped = failed = 0

    for row in missing:
        url = row["youtube_url"].strip()
        vid_id = url.split("watch?v=")[1].split("&")[0] if "watch?v=" in url else url
        title = row["title"]
        path = transcripts_dir / f"{vid_id}.txt"

        if path.exists():
            skipped += 1
            continue

        print(f"Fetching: {title[:70]}...")
        try:
            segments = api.fetch(vid_id)
            path.write_text(format_transcript(segments), encoding="utf-8")
            fetched += 1
            print(f"  ✅ {len(segments)} segments")
            time.sleep(3)
        except Exception as e:
            short = str(e).split("\n")[0]
            print(f"  ❌ {short}")
            failed += 1
            time.sleep(3)

    print(f"\nDone — fetched: {fetched}, already existed: {skipped}, failed: {failed}")


if __name__ == "__main__":
    main()
