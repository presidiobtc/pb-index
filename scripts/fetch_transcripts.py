import csv, time
from pathlib import Path
from youtube_transcript_api import YouTubeTranscriptApi

_api = YouTubeTranscriptApi()


def seconds_to_hms(seconds):
    s = int(seconds)
    h = s // 3600
    m = (s % 3600) // 60
    sec = s % 60
    return f"{h:02d}:{m:02d}:{sec:02d}"


def format_transcript(segments):
    parts = []
    for seg in segments:
        ts = seconds_to_hms(seg.start)
        text = seg.text.replace("\n", " ").strip()
        if text:
            parts.append(f"[{ts}] {text}")
    return " ".join(parts)


def video_id_from_url(url):
    if "watch?v=" in url:
        return url.split("watch?v=")[1].split("&")[0]
    return url


def main():
    root = Path(__file__).resolve().parents[1]
    catalog_path = root / "catalog.csv"
    transcripts_dir = root / "transcripts_raw"
    transcripts_dir.mkdir(exist_ok=True)

    with open(catalog_path, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f, skipinitialspace=True))

    fetched = skipped = failed = 0

    for row in rows:
        transcript_path = (root / row["transcript_file"].strip()).resolve()
        if transcript_path.exists():
            skipped += 1
            continue

        vid_id = video_id_from_url(row["youtube_url"].strip())
        title = row["title"]

        print(f"Fetching: {title[:70]}...")
        try:
            segments = _api.fetch(vid_id)
            text = format_transcript(segments)
            transcript_path.write_text(text, encoding="utf-8")
            fetched += 1
            print(f"  ✅ {len(segments)} segments → {transcript_path.name}")
            time.sleep(2)
        except Exception as e:
            print(f"  ❌ {e}")
            failed += 1

    print(f"\nDone — fetched: {fetched}, already existed: {skipped}, failed: {failed}")


if __name__ == "__main__":
    main()
