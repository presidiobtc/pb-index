"""
One-time script to add Type I Summit playlist videos to catalog.csv,
fetch their transcripts, and save their YouTube descriptions.
"""
import csv, subprocess, shutil, time
from pathlib import Path
from youtube_transcript_api import YouTubeTranscriptApi

ROOT = Path(__file__).resolve().parents[1]

VIDEOS = [
    ("V1-KjT3brmQ", "2026-04-16", "21 in 21: Linn Bieske on Hack-Nation and Building Global AI Communities"),
    ("ysPxfA2922I", "2026-04-07", "21 in 21: Rainey Reitman on Transaction Denied and Financial Censorship"),
    ("PIVWyjihxnA", "2026-03-19", "21 in 21: Michael Saylor on Bitcoin, AI, and Advice for Builders"),
    ("9lcCIsy7uxg", "2026-03-17", "21 in 21: Andi Pitt on Bitcoin Venture, AI, and Cognitive Sovereignty"),
    ("uEddWDEw_gg", "2026-01-13", "21 in 21: Mark Suman on Privacy-First AI"),
    ("YmxDES6VfZY", "2025-12-17", "21 in 21: David Gumberg on the Chaincode ₿OSS Challenge and Becoming a Bitcoin Core Contributor"),
    ("-l-gvaZM5BM", "2025-12-11", "21 in 21: Rod Roudi on Bitcoin Park, Events, and Merchant Adoption"),
    ("WR-rnDP0MVg", "2025-10-30", "21 in 21: Joe Carlo on How Bitcoin Changed Pink Owl Coffee Forever"),
    ("hBYqHpTAvfw", "2025-10-28", "21 in 21, a Rapid-Fire Bitcoin Q&A Podcast: Kyle Olney"),
    ("WJl-b8jmK4A", "2025-10-21", "21 in 21, a Rapid-Fire Bitcoin Q&A Podcast: Nick Slaney"),
    ("1mDxk-P8uzA", "2025-10-15", "21 in 21, a Rapid-Fire Bitcoin Q&A Podcast: Erik Cativo"),
    ("NMSdRmyoMU8", "2025-10-07", "21 in 21, a Rapid-Fire Bitcoin Q&A Podcast: Kyle Fletcher"),
    ("c2cOGZWQHxg", "2025-09-24", "21 in 21, a Rapid-Fire Bitcoin Q&A Podcast: Christoph Ono"),
    ("6Gnd5qavyLg", "2025-09-05", "21 in 21, a Rapid-Fire Bitcoin Q&A Podcast: Conor Okus"),
    ("-1Ha6XCQiE4", "2025-08-28", "21 in 21, a Rapid-Fire Bitcoin Q&A Podcast: Mogashni Naidoo"),
    ("1afaot3nJ9Y", "2025-08-19", "21 in 21, a Rapid-Fire Bitcoin Q&A Podcast: Matthew Pines"),
    ("hRRZTX4D_iI", "2025-08-12", "21 in 21, a Rapid-Fire Bitcoin Q&A Podcast: Tadge Dryja"),
    ("NAXGVZLrCwc", "2025-08-07", "21 in 21, a Rapid-Fire Bitcoin Q&A Podcast: Jameson Lopp"),
    ("C8NLSPDgu2c", "2025-08-05", "21 in 21, a Rapid-Fire Bitcoin Q&A Podcast: Alex Pruden"),
    ("kva7Cp1zFjQ", "2025-07-31", "21 in 21, a Rapid-Fire Bitcoin Q&A Podcast: Alex Gladstein"),
    ("svN_Q71EsrI", "2025-07-15", "21 in 21, a Rapid-Fire Bitcoin Q&A Podcast: Ryan Loomba"),
    ("ZvlUoR-t6EA", "2025-07-10", "21 in 21: Alex Zukauskas"),
    ("ZC1BT2V2PNU", "2025-07-02", "21 in 21: Clara Shikhelman"),
    ("yQ-h5DjbePI", "2025-06-26", "21 in 21: Ben Carman"),
    ("efL8xPVdPUA", "2025-06-05", "21 in 21: Stephen DeLorme"),
    ("-TE7hLn_CRc", "2025-06-03", "21 in 21: Ella Hough"),
    ("DP0wGXlmmao", "2025-05-24", "21 in 21: Laolu Osuntokun"),
    ("Q-PaXGrRehs", "2025-05-13", "21 in 21: Daniel Nordh"),
    ("KsCREYVdawg", "2025-05-06", "21 in 21: Neha Narula"),
    ("RgB-sPf2B44", "2025-04-16", "21 in 21: Shehzan Maredia"),
    ("pjix9O2kQ3k", "2025-04-11", "21 in 21: Pierre Rochard"),
    ("M-KlLM-SNfY", "2025-04-08", "21 in 21: Niftynei"),
    ("0PaV_6vjkXI", "2025-04-01", "21 in 21: Jack Dorsey"),
    ("ZNZ-fSYETU8", "2025-03-27", "21 in 21: Rockstar Dev"),
]

SERIES = "21 in 21"


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


def update_catalog():
    catalog_path = ROOT / "catalog.csv"
    with open(catalog_path, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f, skipinitialspace=True))

    existing_ids = set()
    for row in rows:
        url = row["youtube_url"].strip()
        vid_id = url.split("watch?v=")[1].split("&")[0] if "watch?v=" in url else url
        existing_ids.add(vid_id)

    added = 0
    for vid_id, date, title in VIDEOS:
        if vid_id in existing_ids:
            print(f"  Already in catalog: {vid_id}")
            continue
        rows.append({
            "youtube_url": f"https://www.youtube.com/watch?v={vid_id}",
            "title": title,
            "series": SERIES,
            "published_date": date,
            "transcript_file": f"transcripts_raw/{vid_id}.txt",
            "description_file": f"descriptions/{vid_id}.txt",
        })
        added += 1

    rows.sort(key=lambda r: r.get("published_date", ""), reverse=True)

    fieldnames = ["youtube_url", "title", "series", "published_date", "transcript_file", "description_file"]
    with open(catalog_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"✅ Added {added} new entries to catalog.csv")


def fetch_transcripts():
    api = YouTubeTranscriptApi()
    transcripts_dir = ROOT / "transcripts_raw"
    transcripts_dir.mkdir(exist_ok=True)

    fetched = skipped = failed = 0
    for vid_id, _, title in VIDEOS:
        path = transcripts_dir / f"{vid_id}.txt"
        if path.exists():
            print(f"  Already exists: {vid_id}")
            skipped += 1
            continue
        print(f"Fetching transcript: {title[:70]}...")
        try:
            segments = api.fetch(vid_id)
            path.write_text(format_transcript(segments), encoding="utf-8")
            fetched += 1
            print(f"  ✅ {len(segments)} segments")
            time.sleep(2)
        except Exception as e:
            print(f"  ❌ {e}")
            failed += 1

    print(f"\nTranscripts — fetched: {fetched}, skipped: {skipped}, failed: {failed}")


def fetch_descriptions():
    ytdlp = shutil.which("yt-dlp") or "/opt/homebrew/bin/yt-dlp"
    desc_dir = ROOT / "descriptions"
    desc_dir.mkdir(exist_ok=True)

    fetched = skipped = failed = 0
    for vid_id, _, title in VIDEOS:
        path = desc_dir / f"{vid_id}.txt"
        if path.exists():
            print(f"  Already exists: {vid_id}")
            skipped += 1
            continue
        print(f"Fetching description: {title[:70]}...")
        try:
            result = subprocess.run(
                [ytdlp, "--skip-download", "--print", "description",
                 f"https://www.youtube.com/watch?v={vid_id}"],
                capture_output=True, text=True, check=True
            )
            path.write_text(result.stdout.strip(), encoding="utf-8")
            fetched += 1
            print(f"  ✅ {len(result.stdout.strip())} chars")
            time.sleep(1)
        except Exception as e:
            print(f"  ❌ {e}")
            failed += 1

    print(f"\nDescriptions — fetched: {fetched}, skipped: {skipped}, failed: {failed}")


if __name__ == "__main__":
    print("=== Step 1: Update catalog.csv ===")
    update_catalog()
    print("\n=== Step 2: Fetch transcripts ===")
    fetch_transcripts()
    print("\n=== Step 3: Fetch descriptions ===")
    fetch_descriptions()
    print("\n✅ Done.")
