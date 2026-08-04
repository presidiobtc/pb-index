const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const ROOT = path.join(__dirname, "..");
const INGESTED_VIDEO_IDS = [
  "uGv-wH4UYkg",
  "WisO6hoeUb8",
  "ziJy4PuxBhc",
  "y2z-NATJC10",
  "Prdk7Mf2X0M",
  "E1RTjt8uPsw",
  "yN6ho-KQfh8",
  "cSXOmwI38Jo",
];

function readPublicJson(filename) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, "public", filename), "utf8"));
}

function runValidator() {
  const result = spawnSync(
    "python3",
    [path.join(ROOT, "scripts", "validate_search_corpus.py"), "--json"],
    { cwd: ROOT, encoding: "utf8", maxBuffer: 10 * 1024 * 1024 },
  );
  assert.equal(
    result.status,
    0,
    `corpus validator failed\nstdout: ${result.stdout}\nstderr: ${result.stderr}`,
  );
  return JSON.parse(result.stdout);
}

let cachedValidation;
function validation() {
  cachedValidation ||= runValidator();
  return cachedValidation;
}

test("source files, curated timestamps, and generated search coverage validate", () => {
  const result = validation();
  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
  assert.equal(result.stats.catalog_videos, 177);
  assert.equal(result.stats.transcripts_with_entries, result.stats.catalog_videos);
  assert.equal(result.stats.canonical_topics, 848);
  assert.ok(result.stats.video_topic_picks > result.stats.canonical_topics);
  assert.ok(result.stats.report_topic_picks > 0);
  assert.ok(result.stats.generated_chunks > result.stats.catalog_videos);
});

test("new videos have saved transcript, description, and topic coverage", () => {
  const index = readPublicJson("index.json");
  const searchChunks = readPublicJson("search_chunks.json");

  for (const youtubeId of INGESTED_VIDEO_IDS) {
    const indexEntries = index.filter(entry => entry.youtube_id === youtubeId);
    assert.ok(indexEntries.length > 0, `${youtubeId} is missing from public/index.json`);
    assert.ok(
      indexEntries.every(entry => entry.text && Number.isFinite(entry.t) && entry.ts),
      `${youtubeId} has an invalid saved transcript entry`,
    );

    const videoChunks = searchChunks.filter(chunk => chunk.youtube_id === youtubeId);
    for (const type of ["transcript", "description", "topic"]) {
      assert.ok(
        videoChunks.some(chunk => chunk.type === type && chunk.text),
        `${youtubeId} has no saved ${type} coverage in public/search_chunks.json`,
      );
    }
    assert.ok(
      videoChunks.some(chunk => chunk.type === "topic" && chunk.topics?.length),
      `${youtubeId} has no named topic coverage in public/search_chunks.json`,
    );
  }
});

test("new transcript windows overlap, link to neighbors, and preserve zero timestamps", () => {
  const result = validation();
  assert.ok(result.stats.overlapping_transcript_pairs > result.stats.catalog_videos);
  assert.ok(result.stats.zero_timestamp_chunks > 0);
  assert.ok(result.stats.zero_timestamp_picks > 0);
  const allowedWarnings = new Set(["empty_description", "missing_description_coverage"]);
  assert.ok(
    result.warnings.every(warning => allowedWarnings.has(warning.code)),
    `unexpected warnings: ${JSON.stringify(result.warnings)}`,
  );
});
