import csv, json, re
from pathlib import Path

TIME_RE = re.compile(r"\[(\d{2}):(\d{2}):(\d{2})\]")

def youtube_id_from_url(url: str) -> str:
    url = (url or "").strip()
    if "watch?v=" in url:
        return url.split("watch?v=")[1].split("&")[0]
    if "youtu.be/" in url:
        return url.split("youtu.be/")[1].split("?")[0]
    if "/live/" in url:
        return url.split("/live/")[1].split("?")[0]
    return url  # allow raw ID

def hms_to_seconds(h: str, m: str, s: str) -> int:
    return int(h) * 3600 + int(m) * 60 + int(s)

def parse_timestamp_entries(raw_text: str):
    matches = list(TIME_RE.finditer(raw_text))
    out = []
    for i, m in enumerate(matches):
        start = m.end()
        end = matches[i+1].start() if i+1 < len(matches) else len(raw_text)
        t = hms_to_seconds(m.group(1), m.group(2), m.group(3))
        ts = f"{m.group(1)}:{m.group(2)}:{m.group(3)}"
        text = raw_text[start:end].strip()
        text = re.sub(r"\s+", " ", text)
        if text:
            out.append((t, ts, text))
    return out

def main():
    root = Path(__file__).resolve().parents[1]
    catalog_path = root / "catalog.csv"
    public_dir = root / "public"
    public_dir.mkdir(parents=True, exist_ok=True)

    index = []

    with open(catalog_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f, skipinitialspace=True)
        for row in reader:
            title = row["title"].strip()
            series = row.get("series", "").strip()
            youtube_url = row["youtube_url"].strip()
            transcript_file = row["transcript_file"].strip()

            youtube_id = youtube_id_from_url(youtube_url)
            published_date = row.get("published_date", "").strip()

            transcript_path = (root / transcript_file).resolve()
            if not transcript_path.exists():
                print(f"  ⚠️  Missing transcript, skipping: {title[:60]}")
                continue
            raw = transcript_path.read_text(encoding="utf-8", errors="ignore")

            for t, ts, text in parse_timestamp_entries(raw):
                index.append({
                    "youtube_id": youtube_id,
                    "youtube_url": f"https://www.youtube.com/watch?v={youtube_id}",
                    "title": title,
                    "series": series,
                    "published_date": published_date,
                    "t": t,      # seconds
                    "ts": ts,    # HH:MM:SS
                    "text": text
                })

    out_path = public_dir / "index.json"
    out_path.write_text(json.dumps(index, ensure_ascii=False), encoding="utf-8")
    print(f"✅ Wrote {len(index)} timestamp entries to {out_path}")

if __name__ == "__main__":
    main()
