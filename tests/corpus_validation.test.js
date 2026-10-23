const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const ROOT = path.join(__dirname, "..");
const INGESTED_VIDEO_IDS = [
  "tCGqaEkb2iA",
  "SMeoVZjCmXs",
  "bj3e5Z8B7EI",
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
  assert.equal(result.stats.catalog_videos, 206);
  assert.equal(result.stats.transcripts_with_entries, result.stats.catalog_videos);
  assert.equal(result.stats.canonical_topics, 888);
  assert.ok(result.stats.video_topic_picks > result.stats.canonical_topics);
  assert.ok(result.stats.report_topic_picks > 0);
  assert.ok(result.stats.generated_chunks > result.stats.catalog_videos);
});

test("OSAIS recordings have complete search coverage on their official event dates", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", "osais_sessions.json"), "utf8"));
  const sessions = manifest.sessions.filter(session => session.youtube_id);
  const index = readPublicJson("index.json");
  const chunks = readPublicJson("search_chunks.json");
  const summitEntries = index.filter(entry => entry.series === manifest.series);
  assert.equal(sessions.length, 20);
  assert.equal(new Set(summitEntries.map(entry => entry.youtube_id)).size, sessions.length);

  for (const session of sessions) {
    const entries = summitEntries.filter(entry => entry.youtube_id === session.youtube_id);
    const raw = fs.readFileSync(path.join(ROOT, "transcripts_raw", `${session.youtube_id}.txt`), "utf8");
    const timestampCount = Array.from(raw.matchAll(/\[\d{2}:\d{2}:\d{2}\]/g)).length;
    assert.ok(entries.length > 0, `${session.youtube_id} has no indexed transcript`);
    assert.equal(entries.length, timestampCount, `${session.youtube_id} has incomplete transcript coverage`);
    assert.ok(entries.every(entry => entry.published_date === session.date));
    const videoChunks = chunks.filter(chunk => chunk.youtube_id === session.youtube_id);
    for (const type of ["transcript", "description"]) {
      assert.ok(videoChunks.some(chunk => chunk.type === type && chunk.text), `${session.youtube_id} has no ${type} chunks`);
    }
    assert.ok(videoChunks.every(chunk => chunk.date === session.date && chunk.series === manifest.series));
  }

  for (const video of manifest.excluded_videos) {
    assert.ok(!summitEntries.some(entry => entry.youtube_id === video.youtube_id));
  }
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

test("October 2 PBJ preserves the complete supplied transcript, chapters, and existing taxonomy", () => {
  const youtubeId = "bj3e5Z8B7EI";
  const entries = readPublicJson("index.json").filter(entry => entry.youtube_id === youtubeId);
  const raw = fs.readFileSync(path.join(ROOT, "transcripts_raw", `${youtubeId}.txt`), "utf8");
  const parsed = spawnSync("python3", ["-c", "import json,sys;sys.path.insert(0,'scripts');from build_index import parse_timestamp_entries;print(json.dumps(parse_timestamp_entries(sys.stdin.read())))"], {cwd: ROOT, input: raw, encoding: "utf8"});
  assert.equal(parsed.status, 0);
  assert.deepEqual(entries.map(entry => [entry.t, entry.ts, entry.text]), JSON.parse(parsed.stdout));
  assert.equal(entries.length, 5195);
  assert.equal(entries[0].t, 0);
  assert.equal(entries.at(-1).t, 5356);
  assert.ok(entries.every(entry => entry.published_date === "2026-10-02" && entry.series === "PBJ"));
  const description = fs.readFileSync(path.join(ROOT, "descriptions", `${youtubeId}.txt`), "utf8");
  assert.equal(description.match(/^\d+:\d+(?::\d+)? - /gm).length, 14);
  assert.match(description, /1:24:28 - Bitcoin for agent coordination and streaming inference payments/);
  const chunks = readPublicJson("search_chunks.json").filter(chunk => chunk.youtube_id === youtubeId);
  assert.equal(chunks.find(chunk => chunk.type === "description").text, description.trim().replace(/\s+/g, " "));
  assert.equal(chunks.filter(chunk => chunk.type === "transcript").at(-1).end_t, 5356);
  const picks = chunks.filter(chunk => chunk.type === "topic");
  assert.equal(picks.length, 14);
  assert.equal(new Set(picks.flatMap(pick => pick.topics)).size, 13);
  assert.ok(picks.some(pick => pick.topics.includes("Starlink") && pick.t === 2876));
  assert.ok(picks.some(pick => pick.topics.includes("SpaceX") && /unverified/.test(pick.text)));
  for (const pick of picks) {
    const words = pick.text.trim().split(/\s+/).length;
    assert.ok(words >= 33 && words <= 40, `${pick.topics[0]} has ${words} words`);
  }
});

test("October 9 PBJ preserves the supplied transcript, all chapters, and source caveats", () => {
  const youtubeId = "SMeoVZjCmXs";
  const entries = readPublicJson("index.json").filter(entry => entry.youtube_id === youtubeId);
  const raw = fs.readFileSync(path.join(ROOT, "transcripts_raw", `${youtubeId}.txt`), "utf8");
  const parsed = spawnSync("python3", ["-c", "import json,sys;sys.path.insert(0,'scripts');from build_index import parse_timestamp_entries;print(json.dumps(parse_timestamp_entries(sys.stdin.read())))"], {cwd: ROOT, input: raw, encoding: "utf8"});
  assert.equal(parsed.status, 0);
  assert.deepEqual(entries.map(entry => [entry.t, entry.ts, entry.text]), JSON.parse(parsed.stdout));
  assert.equal(entries.length, 5737);
  assert.equal(entries[0].t, 0);
  assert.equal(entries.at(-1).t, 5869);
  assert.ok(entries.every(entry => entry.published_date === "2026-10-09" && entry.series === "PBJ"));
  const description = fs.readFileSync(path.join(ROOT, "descriptions", `${youtubeId}.txt`), "utf8");
  assert.deepEqual(
    [...description.matchAll(/^(\d+:\d+(?::\d+)?) - /gm)].map(match => match[1]),
    ["0:00", "2:10", "5:53", "12:02", "19:50", "24:56", "31:55", "39:04", "49:52", "57:35", "1:02:57", "1:10:37", "1:14:30", "1:21:05", "1:33:23"],
  );
  const chunks = readPublicJson("search_chunks.json").filter(chunk => chunk.youtube_id === youtubeId);
  assert.equal(chunks.find(chunk => chunk.type === "description").text, description.trim().replace(/\s+/g, " "));
  assert.equal(chunks.filter(chunk => chunk.type === "transcript").at(-1).end_t, 5869);
  const picks = chunks.filter(chunk => chunk.type === "topic");
  assert.equal(picks.length, 16);
  assert.ok(picks.some(pick => pick.topics.includes("Cash App") && /has not launched/.test(pick.text)));
  assert.ok(picks.some(pick => pick.topics.includes("Supply-chain attacks") && /preliminary/.test(pick.text)));
  assert.ok(picks.some(pick => pick.topics.includes("AI and cryptography") && /without demonstrating a signature break/.test(pick.text)));
  for (const pick of picks) {
    assert.ok(pick.text.trim().split(/\s+/).length >= 33);
    assert.ok(pick.text.trim().split(/\s+/).length <= 40);
  }
});

test("October 23 PBJ includes the complete supplied transcript and official chapters", () => {
  const youtubeId = "tCGqaEkb2iA";
  const entries = readPublicJson("index.json").filter(entry => entry.youtube_id === youtubeId);
  assert.equal(entries.length, 5427);
  assert.equal(entries[0].t, 2);
  assert.equal(entries.at(-1).t, 5514);
  assert.ok(entries.every(entry => entry.published_date === "2026-10-23" && entry.series === "PBJ"));
  assert.ok(entries.every(entry => entry.title === "PBJ: Chamath's Bitcoin-to-Zero Warning, Bitcoin-Powered AI in Signal, Lending to Agents"));

  const description = fs.readFileSync(path.join(ROOT, "descriptions", `${youtubeId}.txt`), "utf8");
  assert.deepEqual(
    [...description.matchAll(/^(\d+:\d+(?::\d+)?) - /gm)].map(match => match[1]),
    ["0:00", "1:01", "4:48", "7:05", "16:14", "23:44", "28:15", "41:06", "46:09", "52:23", "1:04:14", "1:10:04", "1:16:16", "1:20:00", "1:24:05"],
  );
  assert.match(description, /https:\/\/www\.projectloupe\.org\//);
  const chunks = readPublicJson("search_chunks.json").filter(chunk => chunk.youtube_id === youtubeId);
  assert.equal(chunks.find(chunk => chunk.type === "description").text, description.trim().replace(/\s+/g, " "));
  assert.equal(chunks.filter(chunk => chunk.type === "transcript").at(-1).end_t, 5514);
  assert.ok(chunks.some(chunk => chunk.type === "topic" && chunk.topics.includes("Mesh-LLM")));
  assert.ok(chunks.some(chunk => chunk.type === "topic" && chunk.topics.includes("AI and cryptography")));
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
