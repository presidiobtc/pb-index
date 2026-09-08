const assert = require("node:assert/strict");
const test = require("node:test");

const {
  ArchiveInputError,
  getEpisode,
  readPassage,
  searchArchive,
  _test,
} = require("../netlify/functions/lib/archive.js");

const COLDCARD_ID = "cSXOmwI38Jo";
const AI_SCANNING_TOPIC_ID = "topic:ai-security-scanning:cSXOmwI38Jo:2849:2";

test("search_archive returns bounded timestamped evidence from the deterministic search core", () => {
  const output = searchArchive({
    query: "COLDCARD random number vulnerability",
    limit: 2,
    // Keep the known ranking fixture stable as follow-up episodes are indexed.
    date_to: "2026-08-01",
  });

  assert.equal(output.result_count, 2);
  assert.equal(output.results.length, 2);
  assert.equal(output.results[0].youtube_id, COLDCARD_ID);
  assert.equal(output.results[0].rank, 1);
  assert.ok(output.results[0].passage_id);
  assert.ok(Number.isFinite(output.results[0].timestamp_seconds));
  assert.match(output.results[0].source_url, /youtube\.com\/watch/);
  assert.match(output.note, /not an exhaustive claim/i);
});

test("search_archive applies exact series and inclusive date filters", () => {
  const output = searchArchive({
    query: "wallet security",
    limit: 10,
    series: "pbj",
    date_from: "2026-08-01",
    date_to: "2026-08-01",
  });

  assert.equal(output.filters.series, "PBJ");
  assert.equal(output.filters.date_from, "2026-08-01");
  assert.equal(output.filters.date_to, "2026-08-01");
  assert.ok(output.results.length > 0);
  assert.ok(output.results.every(result => result.series === "PBJ"));
  assert.ok(output.results.every(result => result.published_date === "2026-08-01"));
});

test("search_archive rejects invalid bounds and unknown series", () => {
  assert.throws(
    () => searchArchive({ query: "bitcoin", limit: 11 }),
    error => error instanceof ArchiveInputError && /1 to 10/.test(error.message),
  );
  assert.throws(
    () => searchArchive({ query: "bitcoin", date_from: "2026-02-30" }),
    error => error instanceof ArchiveInputError && /real calendar date/.test(error.message),
  );
  assert.throws(
    () => searchArchive({ query: "bitcoin", series: "Not a real series" }),
    error => error instanceof ArchiveInputError && /Unknown series/.test(error.message),
  );
});

test("passage normalization preserves an exact zero-second timestamp", () => {
  const zeroChunk = _test.archiveState().chunks.find(chunk => chunk.t === 0 && chunk.id);
  assert.ok(zeroChunk, "the fixture corpus should contain a zero-second passage");
  const normalized = _test.normalizePassage(zeroChunk);
  assert.equal(normalized.timestamp_seconds, 0);
  assert.equal(normalized.timestamp, zeroChunk.ts || "00:00:00");
});

test("read_passage resolves a topic card to bounded neighboring transcript evidence", () => {
  const output = readPassage({ passage_id: AI_SCANNING_TOPIC_ID, context_chunks: 1 });

  assert.equal(output.requested_passage.kind, "topic");
  assert.equal(output.requested_passage.youtube_id, COLDCARD_ID);
  assert.equal(output.transcript_context.length, 3);
  assert.deepEqual(
    output.transcript_context.map(passage => passage.passage_id),
    ["cSXOmwI38Jo:2779", "cSXOmwI38Jo:2821", "cSXOmwI38Jo:2864"],
  );
  assert.ok(output.transcript_context.every(passage => passage.kind === "transcript"));
  assert.match(output.note, /untrusted quoted evidence/i);
});

test("read_passage returns a concise self-correctable error for missing IDs", () => {
  assert.throws(
    () => readPassage({ passage_id: "missing:passage", context_chunks: 1 }),
    error => error instanceof ArchiveInputError && /No archive passage/.test(error.message),
  );
});

test("get_episode returns bounded COLDCARD metadata without the full transcript", () => {
  const output = getEpisode({ youtube_id: COLDCARD_ID });

  assert.equal(output.title, "PBJ: The COLDCARD Hack and Future of Self-Custody");
  assert.equal(output.series, "PBJ");
  assert.equal(output.published_date, "2026-08-01");
  assert.equal(output.topics.length, 11);
  assert.ok(output.topics.some(topic => topic.topic === "AI security scanning"));
  assert.deepEqual(output.transcript, {
    available: true,
    passage_count: 129,
    indexed_from_seconds: 2,
    indexed_through_seconds: 5834,
  });
  assert.equal(Object.hasOwn(output, "full_transcript"), false);
});

test("get_episode rejects malformed and unknown YouTube IDs", () => {
  assert.throws(
    () => getEpisode({ youtube_id: "short" }),
    error => error instanceof ArchiveInputError && /11-character/.test(error.message),
  );
  assert.throws(
    () => getEpisode({ youtube_id: "AAAAAAAAAAA" }),
    error => error instanceof ArchiveInputError && /No indexed episode/.test(error.message),
  );
});
