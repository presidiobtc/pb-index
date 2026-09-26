const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const ROOT = path.join(__dirname, "..");
const INGESTED_VIDEO_IDS = [
  "X2nWtURNgt8",
  "4b5X88Hc8o4",
  "evBVXSD_gsg",
  "1iPvM0YCg_E",
  "FTTnx3st0AY",
  "Wsu5J5yJU4Q",
  "QW0Lo2T4pRc",
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
  assert.equal(result.stats.catalog_videos, 184);
  assert.equal(result.stats.transcripts_with_entries, result.stats.catalog_videos);
  assert.equal(result.stats.canonical_topics, 885);
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

test("September 18 PBJ preserves the full transcript, chapters, and curated explanations", () => {
  const youtubeId = "4b5X88Hc8o4";
  const entries = readPublicJson("index.json").filter(entry => entry.youtube_id === youtubeId);
  const raw = fs.readFileSync(path.join(ROOT, "transcripts_raw", `${youtubeId}.txt`), "utf8");
  const lines = raw.trim().split("\n");
  assert.equal(lines.length, 3168);
  assert.equal(entries.length, lines.length);
  assert.deepEqual(entries.map(entry => `[${entry.ts}] ${entry.text}`), lines);
  assert.equal(entries[0].t, 2);
  assert.equal(entries.at(-1).t, 5890);
  assert.ok(entries.every(entry => entry.published_date === "2026-09-18" && entry.series === "PBJ"));

  const description = fs.readFileSync(path.join(ROOT, "descriptions", `${youtubeId}.txt`), "utf8");
  assert.equal(description.match(/^\d+:\d+(?::\d+)? - /gm).length, 14);
  assert.match(description, /https:\/\/meshllm\.cloud\//);
  const chunks = readPublicJson("search_chunks.json").filter(chunk => chunk.youtube_id === youtubeId);
  assert.equal(chunks.find(chunk => chunk.type === "description").text, description.trim().replace(/\s+/g, " "));
  assert.equal(chunks.filter(chunk => chunk.type === "transcript").at(-1).end_t, 5890);
  const picks = chunks.filter(chunk => chunk.type === "topic");
  assert.equal(picks.length, 13);
  for (const pick of picks) {
    const words = pick.text.trim().split(/\s+/).length;
    assert.ok(words >= 33 && words <= 40, `${pick.topics[0]} has ${words} words`);
  }
});

test("September 25 PBJ preserves its transcript, official chapters, and curated explanations", () => {
  const youtubeId = "X2nWtURNgt8";
  const entries = readPublicJson("index.json").filter(entry => entry.youtube_id === youtubeId);
  assert.equal(entries.length, 5926);
  assert.equal(entries[0].t, 0);
  assert.equal(entries.at(-1).t, 6066);
  assert.ok(entries.every(entry => entry.published_date === "2026-09-25" && entry.series === "PBJ"));

  const description = fs.readFileSync(path.join(ROOT, "descriptions", `${youtubeId}.txt`), "utf8");
  assert.equal(description.match(/^\d+:\d+(?::\d+)? - /gm).length, 15);
  assert.match(description, /https:\/\/block\.xyz\/inside\/block-joins-the-x402-foundation/);
  const chunks = readPublicJson("search_chunks.json").filter(chunk => chunk.youtube_id === youtubeId);
  assert.equal(chunks.find(chunk => chunk.type === "description").text, description.trim().replace(/\s+/g, " "));
  const picks = chunks.filter(chunk => chunk.type === "topic");
  assert.equal(picks.length, 12);
  for (const pick of picks) {
    const words = pick.text.trim().split(/\s+/).length;
    assert.ok(words >= 33 && words <= 40, `${pick.topics[0]} has ${words} words`);
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
