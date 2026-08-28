"""
Run the full pipeline:
  1. fetch_catalog.py  — pull PBJ playlist metadata into catalog.csv
  2. fetch_transcripts.py — download YouTube captions for any new videos
  3. fetch_descriptions.py — download descriptions for newly discovered videos
  4. build_index.py — build public/index.json from catalog + transcripts
  5. validate_search_corpus.py — fail before publishing invalid archive data
  6. build_search_chunks.py — build public/search_chunks.json for Ask PB
  7. build_topic_stats.py — build PBJ Topic Explorer data and diagnostics
  8. build_featured_topics.py — build public/featured_topics.json for the homepage
"""
import subprocess, sys
from pathlib import Path

scripts = Path(__file__).parent
steps = [
    "fetch_catalog.py",
    "fetch_transcripts.py",
    "fetch_descriptions.py",
    "build_index.py",
    "validate_search_corpus.py",
    "build_search_chunks.py",
    "build_topic_stats.py",
    "build_featured_topics.py",
]

for step in steps:
    print(f"\n{'='*60}\n▶ {step}\n{'='*60}")
    result = subprocess.run([sys.executable, scripts / step])
    if result.returncode != 0:
        print(f"\n❌ {step} failed — stopping.")
        sys.exit(1)

print("\n✅ Pipeline complete.")
