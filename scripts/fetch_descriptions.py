"""Fetch missing YouTube descriptions referenced by catalog.csv.

The transcript fetcher and description fetcher are intentionally separate so a
caption outage does not prevent metadata ingestion. Existing non-empty files are
left untouched; pass --refresh to update every description.
"""

import argparse
import csv
import shutil
import subprocess
import sys
import time
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "catalog.csv"


def fetch_description(ytdlp: str, url: str) -> str:
    result = subprocess.run(
        [ytdlp, "--skip-download", "--no-warnings", "--print", "description", url],
        capture_output=True,
        text=True,
        check=True,
    )
    return result.stdout.strip()


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--refresh", action="store_true", help="Refresh existing descriptions too")
    parser.add_argument("--delay", type=float, default=0.5, help="Delay between YouTube requests")
    args = parser.parse_args(argv)

    ytdlp = shutil.which("yt-dlp") or "/opt/homebrew/bin/yt-dlp"
    if not Path(ytdlp).is_file():
        print("yt-dlp is required to fetch YouTube descriptions.", file=sys.stderr)
        return 1

    with CATALOG.open(newline="", encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle, skipinitialspace=True))

    fetched = skipped = failed = 0
    for row in rows:
        relative_path = (row.get("description_file") or "").strip()
        if not relative_path:
            print(f"WARN: no description_file for {row.get('youtube_url', '')}")
            failed += 1
            continue
        path = (ROOT / relative_path).resolve()
        try:
            path.relative_to(ROOT.resolve())
        except ValueError:
            print(f"WARN: refusing description path outside repository: {relative_path}")
            failed += 1
            continue
        if not args.refresh and path.is_file() and path.read_text(encoding="utf-8", errors="ignore").strip():
            skipped += 1
            continue

        title = (row.get("title") or row.get("youtube_url") or "video").strip()
        print(f"Fetching description: {title[:72]}...")
        try:
            description = fetch_description(ytdlp, (row.get("youtube_url") or "").strip())
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(description, encoding="utf-8")
            fetched += 1
            if not description:
                print("  WARN: YouTube returned an empty description")
        except (OSError, subprocess.SubprocessError) as error:
            print(f"  WARN: {error}")
            failed += 1
        if args.delay > 0:
            time.sleep(args.delay)

    print(f"Descriptions complete — fetched: {fetched}, existing: {skipped}, failed: {failed}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())

