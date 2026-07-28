import csv, shutil, subprocess
from pathlib import Path

PLAYLIST_URL = "https://www.youtube.com/playlist?list=PL8Qx0853DvlP8_oFQQm3zPtTFNwK2wYDZ"
SERIES = "PBJ"


def fetch_playlist():
    ytdlp = shutil.which("yt-dlp") or "/opt/homebrew/bin/yt-dlp"
    result = subprocess.run(
        [ytdlp, "--print", "%(id)s\t%(upload_date)s\t%(title)s", "--no-warnings", PLAYLIST_URL],
        capture_output=True, text=True, check=True
    )
    entries = []
    for line in result.stdout.strip().split("\n"):
        parts = line.split("\t", 2)
        if len(parts) == 3:
            vid_id, upload_date, title = parts
            date = f"{upload_date[:4]}-{upload_date[4:6]}-{upload_date[6:]}" if upload_date != "NA" else ""
            entries.append({"id": vid_id, "title": title, "date": date})
    return entries


def clean_title(title):
    for prefix in ["PBJ: ", "PBJ - ", "PBJ:"]:
        if title.startswith(prefix):
            return title[len(prefix):]
    return title


def video_id_from_url(url):
    if "watch?v=" in url:
        return url.split("watch?v=")[1].split("&")[0]
    return url


def main():
    root = Path(__file__).resolve().parents[1]
    catalog_path = root / "catalog.csv"
    fieldnames = ["youtube_url", "title", "series", "published_date", "transcript_file", "description_file"]

    existing = {}
    if catalog_path.exists():
        with open(catalog_path, newline="", encoding="utf-8") as f:
            for row in csv.DictReader(f, skipinitialspace=True):
                vid_id = video_id_from_url(row["youtube_url"].strip())
                existing[vid_id] = row

    print("Fetching playlist metadata (this takes ~30–60s for a full playlist)...")
    entries = fetch_playlist()
    print(f"Found {len(entries)} videos in playlist")
    if not entries:
        print("❌ Playlist fetch returned no videos; leaving catalog.csv unchanged.")
        return

    new_count = 0
    for entry in entries:
        vid_id = entry["id"]
        if vid_id in existing:
            continue
        existing[vid_id] = {
            "youtube_url": f"https://www.youtube.com/watch?v={vid_id}",
            "title": clean_title(entry["title"]),
            "series": SERIES,
            "published_date": entry["date"],
            "transcript_file": f"transcripts_raw/{vid_id}.txt",
            "description_file": f"descriptions/{vid_id}.txt",
        }
        new_count += 1

    rows = sorted(existing.values(), key=lambda r: r.get("published_date", ""), reverse=True)

    with open(catalog_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)

    print(f"✅ Added {new_count} new entries. Catalog now has {len(rows)} videos.")


if __name__ == "__main__":
    main()
