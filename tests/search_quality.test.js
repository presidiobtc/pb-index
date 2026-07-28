const assert = require("node:assert/strict");
const test = require("node:test");

const SearchCore = require("../public/search_core.js");
const chunks = require("../public/search_chunks.json");

function results(query, limit = 10) {
  return SearchCore.retrieve(chunks, query, limit);
}

function first(query) {
  return results(query, 1)[0];
}

test("explicit series intent is honored instead of being overridden by a topic", () => {
  const pbj = results("Which PBJ episode covers Bitcoin self-custody?");
  assert.ok(pbj.length > 0);
  assert.ok(pbj.every(source => source.series === "PBJ"));

  const builder = results("Which Builder episode discusses Goose?", 5);
  assert.ok(builder.length > 0);
  assert.equal(builder[0].series, "Builder");
  assert.ok(builder.every(source => source.series === "Builder"));
});

test("distinctive standalone series references are treated as constraints", () => {
  const pbj = results("What did PBJ say about quantum migration?", 5);
  assert.ok(pbj.length > 0);
  assert.ok(pbj.every(source => source.series === "PBJ"));

  const qbs = results("What did QBS say about Shor's algorithm?", 5);
  assert.ok(qbs.length > 0);
  assert.ok(qbs.every(source => source.series === "QBS"));
});

test("date ranges and before/after constraints are hard filters", () => {
  const ranged = results("Which PBJ episodes between January and March 2025 discuss wallets?");
  assert.ok(ranged.length > 0);
  assert.ok(ranged.every(source => source.date >= "2025-01-01" && source.date <= "2025-03-31"));

  const before = results("PBJ episodes before 2025 about stablecoins");
  assert.ok(before.length > 0);
  assert.ok(before.every(source => source.date < "2025-01-01"));
});

test("latest and earliest requests order matching episodes chronologically", () => {
  const latest = results("latest PBJ episode about Buzz", 5);
  assert.ok(latest.length > 0);
  for (let index = 1; index < latest.length; index += 1) {
    assert.ok(latest[index - 1].date >= latest[index].date);
  }

  const earliest = results("earliest PBJ episode about stablecoins", 5);
  assert.ok(earliest.length > 0);
  for (let index = 1; index < earliest.length; index += 1) {
    assert.ok(earliest[index - 1].date <= earliest[index].date);
  }
});

test("YouTube IDs, URLs, and explicit timecodes resolve directly", () => {
  for (const query of [
    "What did they say at 34:08 in f6WH9BbbavM?",
    "What happens at 34:08 in https://www.youtube.com/watch?v=f6WH9BbbavM?",
  ]) {
    const source = first(query);
    assert.equal(source?.youtube_id, "f6WH9BbbavM", query);
    assert.equal(source?.type, "transcript", query);
    assert.ok(Math.abs(Number(source?.t) - 2048) <= 90, query);
  }
});

test("direct-video summary requests return evidence from that video", () => {
  const found = results("Summarize video f6WH9BbbavM", 6);
  assert.ok(found.length >= 3);
  assert.ok(found.every(source => source.youtube_id === "f6WH9BbbavM"));
});

test("timestamp intent returns timestamped transcript evidence", () => {
  const source = first("Find the episode and timestamp for the hidden name problem");
  assert.equal(source?.type, "transcript");
  assert.equal(typeof source?.t, "number");
});

test("common entity typos retain the intended custody episode", () => {
  const source = first("Which PBJ episode compared BtiKey, Rvier, and Coinbsae self custody wallets?");
  assert.equal(source?.youtube_id, "OSanv5Z-DA4");
});

test("semantic-ish paraphrases retrieve the Figma and Buzz collaboration passage", () => {
  const top = results("Where did they compare multi-user software construction to a shared graphics editor?", 3);
  assert.ok(top.some(source => source.youtube_id === "f6WH9BbbavM"));
});

test("plausible but unsupported questions do not return incidental one-word matches", () => {
  assert.deepEqual(results("Martian cheese futures"), []);
  assert.deepEqual(results("purple elephant marmalade"), []);
});

test("exact episode titles resolve to that episode first", () => {
  const source = first("PBJ: Anthropic's Fable Drama, Personhood for AI, Bark Launches on Mainnet");
  assert.equal(source?.youtube_id, "f6WH9BbbavM");
});

test("generic PBJ episode discovery still returns PBJ episodes", () => {
  const found = results("Show me PBJ episodes about bitcoin", 5);
  assert.ok(found.length > 0);
  assert.ok(found.every(source => source.series === "PBJ"));
});

test("aggregate filler does not become a required search concept", () => {
  const counted = results("How many PBJ episodes discuss stablecoins?", 100);
  assert.ok(counted.length > 5);
  assert.ok(counted.every(source => source.series === "PBJ"));

  const ever = results("Does PBJ ever criticize bitcoin?", 20);
  assert.ok(ever.length > 0);
  assert.ok(ever.every(source => source.series === "PBJ"));
});

test("timeline questions retrieve evidence from multiple periods", () => {
  const found = results("How did PBJ discussion of quantum risk change between 2024 and 2026?", 12);
  assert.ok(found.length > 2);
  assert.ok(found.every(source => source.series === "PBJ"));
  assert.ok(new Set(found.map(source => source.date?.slice(0, 4))).size >= 2);
});

test("non-video report sections do not collapse to one synthetic moment", () => {
  const synthetic = Array.from({ length: 5 }, (_, index) => ({
    id: `r${index}`,
    type: "report",
    title: "Report",
    section: `Section ${index}`,
    text: `quantum migration plan evidence ${index}`,
    topics: [],
    url: `https://example.test/#${index}`,
  }));
  assert.equal(SearchCore.retrieve(synthetic, "quantum migration", 10).length, 5);
});
