"""
Fetch transcripts and descriptions for the 21 in 21 playlist.
Playlist: https://www.youtube.com/playlist?list=PL8Qx0853DvlOXGd--RJ3cPTwWWbMv_sdo
"""
import csv, time, shutil, subprocess
from pathlib import Path
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound

PLAYLIST_URL = "https://www.youtube.com/playlist?list=PL8Qx0853DvlOXGd--RJ3cPTwWWbMv_sdo"
SERIES = "21 in 21"

_api = YouTubeTranscriptApi()
root = Path(__file__).resolve().parents[1]
catalog_path = root / "catalog.csv"
transcripts_dir = root / "transcripts_raw"
descriptions_dir = root / "descriptions"
transcripts_dir.mkdir(exist_ok=True)
descriptions_dir.mkdir(exist_ok=True)

ytdlp = shutil.which("yt-dlp") or "/opt/homebrew/bin/yt-dlp"


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


def fetch_playlist_ids():
    result = subprocess.run(
        [ytdlp, "--print", "%(id)s", "--no-warnings", PLAYLIST_URL],
        capture_output=True, text=True, check=True
    )
    return [line.strip() for line in result.stdout.strip().split("\n") if line.strip()]


def fetch_descriptions(video_ids):
    """Use yt-dlp to fetch descriptions for a batch of video IDs."""
    urls = [f"https://www.youtube.com/watch?v={vid}" for vid in video_ids]
    result = subprocess.run(
        [ytdlp, "--print", "%(id)s\t%(description)s", "--no-warnings"] + urls,
        capture_output=True, text=True
    )
    descs = {}
    for line in result.stdout.split("\n"):
        if "\t" in line:
            vid, desc = line.split("\t", 1)
            descs[vid.strip()] = desc.strip()
    return descs


def main():
    print("Fetching playlist video IDs...")
    playlist_ids = set(fetch_playlist_ids())
    print(f"Found {len(playlist_ids)} videos in playlist")

    # Load existing catalog
    with open(catalog_path, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f, skipinitialspace=True))

    # Identify which videos need work
    need_transcript, need_description = [], []
    for row in rows:
        url = row["youtube_url"].strip()
        if "watch?v=" not in url:
            continue
        vid = url.split("watch?v=")[1].split("&")[0]
        if vid not in playlist_ids:
            continue
        tx_path = transcripts_dir / f"{vid}.txt"
        desc_path = descriptions_dir / f"{vid}.txt"
        if not tx_path.exists():
            need_transcript.append(vid)
        if not desc_path.exists():
            need_description.append(vid)

    print(f"Need transcripts: {len(need_transcript)}")
    print(f"Need descriptions: {len(need_description)}")

    # Fetch missing descriptions in batch
    if need_description:
        print(f"\nFetching {len(need_description)} descriptions...")
        descs = fetch_descriptions(need_description)
        for vid, desc in descs.items():
            if desc:
                (descriptions_dir / f"{vid}.txt").write_text(desc, encoding="utf-8")
                print(f"  ✅ Description: {vid}")
            else:
                print(f"  ⚠️  Empty description: {vid}")

    # Fetch missing transcripts
    if need_transcript:
        print(f"\nFetching {len(need_transcript)} transcripts...")
        fetched = failed = 0
        for vid in need_transcript:
            print(f"  Fetching transcript: {vid}...")
            try:
                segments = _api.fetch(vid)
                text = format_transcript(segments)
                (transcripts_dir / f"{vid}.txt").write_text(text, encoding="utf-8")
                fetched += 1
                print(f"    ✅ {len(segments)} segments")
                time.sleep(1)
            except (TranscriptsDisabled, NoTranscriptFound) as e:
                print(f"    ❌ No transcript available: {e}")
                failed += 1
            except Exception as e:
                print(f"    ❌ {e}")
                failed += 1

        print(f"\nTranscripts — fetched: {fetched}, failed: {failed}")

    # Ensure catalog has description_file column for all playlist entries
    updated = False
    for row in rows:
        url = row["youtube_url"].strip()
        if "watch?v=" not in url:
            continue
        vid = url.split("watch?v=")[1].split("&")[0]
        if vid not in playlist_ids:
            continue
        expected_desc = f"descriptions/{vid}.txt"
        if row.get("description_file", "").strip() != expected_desc:
            row["description_file"] = expected_desc
            updated = True

    if updated:
        fieldnames = ["youtube_url", "title", "series", "published_date", "transcript_file", "description_file"]
        with open(catalog_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
            writer.writeheader()
            writer.writerows(rows)
        print("✅ catalog.csv updated with description_file paths")

    print("\nDone.")


if __name__ == "__main__":
    main()
