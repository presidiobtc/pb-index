const assert = require("node:assert/strict");
const test = require("node:test");

const SearchCore = require("../public/search_core.js");
const archive = require("../public/search_chunks.json");

function chunk(id, overrides = {}) {
  return {
    id,
    type: "transcript",
    title: `Episode ${id}`,
    series: "PBJ",
    date: "2025-01-01",
    text: "",
    url: `https://www.youtube.com/watch?v=${id}`,
    youtube_id: id,
    t: 0,
    topics: [],
    ...overrides,
  };
}

test("series, calendar ranges, and chronological ordering compose", () => {
  const corpus = [
    chunk("pbj-jan", { date: "2025-01-12", text: "wallet security" }),
    chunk("pbj-mar", { date: "2025-03-20", text: "wallet security" }),
    chunk("pbj-apr", { date: "2025-04-01", text: "wallet security" }),
    chunk("builder-mar", { series: "Builder", date: "2025-03-10", text: "wallet security" }),
  ];
  const ranged = SearchCore.retrieve(corpus, "latest PBJ episodes between January and March 2025 about wallets", 10);
  assert.deepEqual(ranged.map(item => item.youtube_id), ["pbj-mar", "pbj-jan"]);
  assert.ok(ranged.every(item => item.series === "PBJ"));
});

test("standalone distinctive series names are filters, not scoring hints", () => {
  const corpus = [
    chunk("pbj", { text: "quantum migration" }),
    chunk("qbs", { series: "QBS", text: "quantum migration" }),
  ];
  assert.ok(SearchCore.retrieve(corpus, "What did PBJ say about quantum migration?").every(item => item.series === "PBJ"));
  assert.ok(SearchCore.retrieve(corpus, "What did QBS say about quantum migration?").every(item => item.series === "QBS"));
});

test("direct video and timecode lookup chooses the containing transcript", () => {
  const corpus = [
    chunk("abcdefghijk", { id: "desc", type: "description", text: "chapter overview", t: undefined }),
    chunk("abcdefghijk", { id: "early", text: "first passage", t: 100 }),
    chunk("abcdefghijk", { id: "later", text: "later passage", t: 200 }),
  ];
  const result = SearchCore.retrieve(corpus, "What happens at 2:50 in https://youtu.be/abcdefghijk?", 1);
  assert.equal(result[0]?.id, "early");
  assert.equal(result[0]?.type, "transcript");
});

test("direct video summaries retain an evidence bundle after task words are stripped", () => {
  const corpus = [
    chunk("abcdefghijk", { id: "desc", type: "description", text: "chapter overview", t: undefined }),
    chunk("abcdefghijk", { id: "one", text: "first subject", t: 10 }),
    chunk("abcdefghijk", { id: "two", text: "second subject", t: 100 }),
  ];
  const result = SearchCore.retrieve(corpus, "Summarize video abcdefghijk and give me the key points", 3);
  assert.equal(result.length, 3);
  assert.ok(result.every(item => item.youtube_id === "abcdefghijk"));
});

test("explicit phrases, boolean OR, and exclusions constrain evidence", () => {
  const corpus = [
    chunk("phrase-one", { text: "alpha beta appears with buzz" }),
    chunk("phrase-two", { text: "gamma delta appears with buzz and payments" }),
    chunk("loose", { text: "alpha then a lot of unrelated material then beta" }),
  ];
  const phraseOr = SearchCore.retrieve(corpus, '"alpha beta" OR "gamma delta"', 10);
  assert.deepEqual(new Set(phraseOr.map(item => item.youtube_id)), new Set(["phrase-one", "phrase-two"]));
  const excluded = SearchCore.retrieve(corpus, "buzz without payments", 10);
  assert.ok(excluded.length > 0);
  assert.ok(excluded.every(item => !/payments/i.test(item.text)));
});

test("comparison prompts retrieve balanced evidence even when subjects are in separate passages", () => {
  const corpus = [
    chunk("privacy", { text: "bitcoin privacy protects users" }),
    chunk("lightning", { text: "lightning improves payment speed" }),
    chunk("noise", { text: "bitcoin market update" }),
  ];
  const result = SearchCore.retrieve(corpus, "Compare bitcoin privacy versus lightning", 3);
  assert.ok(result.some(item => /privacy/i.test(item.text)));
  assert.ok(result.some(item => /lightning/i.test(item.text)));
  assert.equal(
    SearchCore.parseQueryIntent("Where did they compare privacy with lightning?", corpus).comparison,
    true,
  );
  assert.equal(
    SearchCore.parseQueryIntent("Where was privacy compared with lightning?", corpus).comparison,
    true,
  );
});

test("transposition typos are corrected only to vocabulary-backed entities", () => {
  const corpus = [
    chunk("target", { text: "bitkey river coinbase wallet comparison" }),
    chunk("bitkey-only", { text: "bitkey" }),
    chunk("river-only", { text: "river" }),
    chunk("coinbase-only", { text: "coinbase" }),
  ];
  const result = SearchCore.retrieve(corpus, "Which PBJ episode mentions BtiKey Rvier Coinbsae?", 1);
  assert.equal(result[0]?.youtube_id, "target");
});

test("episode retrieval returns complementary evidence without changing the array API", () => {
  const corpus = [
    chunk("best", { id: "best-desc", type: "description", text: "wallet custody overview", t: undefined }),
    chunk("best", { id: "best-passage", text: "wallet custody comparison details", t: 120 }),
    chunk("other", { id: "other-passage", date: "2024-01-01", text: "wallet custody" }),
  ];
  const result = SearchCore.retrieve(corpus, "Which PBJ episode compares wallet custody?", 3);
  assert.equal(result[0]?.youtube_id, "best");
  assert.equal(result[1]?.youtube_id, "best");
  assert.ok(result.every(item => typeof item === "object" && !Array.isArray(item)));
});

test("report sections have independent deduplication identities", () => {
  const corpus = Array.from({ length: 7 }, (_, index) => ({
    id: `report-${index}`,
    type: "report",
    title: "Report",
    section: `Section ${index}`,
    text: `quantum migration plan detail ${index}`,
    topics: [],
  }));
  assert.equal(SearchCore.retrieve(corpus, "quantum migration", 10).length, 5);
});

test("aggregate filler does not become required evidence", () => {
  const corpus = [
    chunk("stable", { text: "stablecoin adoption" }),
    chunk("other", { text: "wallet adoption" }),
  ];
  const result = SearchCore.retrieve(corpus, "How many PBJ episodes ever discuss stablecoins?", 10);
  assert.ok(result.length > 0);
  assert.ok(result.every(item => /stablecoin/i.test(item.text)));
});

test("count intent distinguishes episodes, mention frequency, and entity cardinality", () => {
  const corpus = [
    chunk("figma-episode", { id: "figma-1", title: "Figma episode", t: 10, text: "figma collaboration" }),
    chunk("figma-episode", { id: "figma-2", title: "Figma episode", t: 100, text: "figma multiplayer design" }),
    chunk("wallet-options", {
      text: "The self-custody wallet options analyzed were BitKey, River, and Coinbase.",
    }),
    chunk("stable-one", { text: "stablecoin adoption" }),
    chunk("stable-two", { text: "stablecoin payments" }),
  ];

  const mentionsIntent = SearchCore.parseQueryIntent("How many times was Figma mentioned?", corpus);
  assert.equal(mentionsIntent.countRequested, true);
  assert.equal(mentionsIntent.countTarget, "mentions");
  assert.equal(mentionsIntent.episodeMode, false);
  assert.equal(mentionsIntent.requiresFullScan, true);
  const mentions = SearchCore.retrieve(corpus, "How many times was Figma mentioned?", 10);
  assert.equal(mentions.filter(item => item.youtube_id === "figma-episode").length, 2);

  const entitiesIntent = SearchCore.parseQueryIntent(
    "How many self-custody wallet options did they analyze?",
    corpus,
  );
  assert.equal(entitiesIntent.countTarget, "entities");
  assert.equal(entitiesIntent.episodeMode, false);
  assert.equal(entitiesIntent.requiresFullScan, false);
  assert.equal(
    SearchCore.retrieve(corpus, "How many self-custody wallet options did they analyze?", 1)[0]?.youtube_id,
    "wallet-options",
  );

  const episodesIntent = SearchCore.parseQueryIntent("How many PBJ episodes discuss stablecoins?", corpus);
  assert.equal(episodesIntent.countTarget, "episodes");
  assert.equal(episodesIntent.episodeMode, true);
  assert.equal(episodesIntent.requiresFullScan, true);
  const episodes = SearchCore.retrieve(corpus, "How many PBJ episodes discuss stablecoins?", 10);
  assert.deepEqual(new Set(episodes.map(item => item.youtube_id)), new Set(["stable-one", "stable-two"]));
  assert.equal(
    SearchCore.parseQueryIntent("How many PBJ episodes mention Figma?", corpus).countTarget,
    "episodes",
  );
  assert.equal(
    SearchCore.parseQueryIntent("How many wallet options were mentioned?", corpus).countTarget,
    "entities",
  );
});

test("negation variants exclude evidence and expose unsafe complement counts", () => {
  const corpus = [
    chunk("paid", { id: "paid-buzz", title: "Paid", text: "buzz collaboration", t: 10 }),
    chunk("paid", { id: "paid-payments", title: "Paid", text: "payments integration", t: 100 }),
    chunk("clean", { title: "Clean", text: "buzz collaboration without commerce" }),
    chunk("unrelated", { title: "Unrelated", text: "quantum migration" }),
  ];

  for (const query of [
    "Which PBJ episodes never discuss payments?",
    "Which PBJ episodes never discusses payments?",
    "Which PBJ episodes never discussed payments?",
  ]) {
    const result = SearchCore.retrieve(corpus, query, 10);
    assert.ok(result.length > 0, query);
    assert.ok(result.every(item => item.youtube_id !== "paid"), query);
  }
  assert.equal(
    SearchCore.parseQueryIntent("Which PBJ episodes never discussed payments?", corpus).requiresFullScan,
    true,
  );

  for (const query of ["buzz but not payments", "buzz excluding payments", "buzz except payments"]) {
    const result = SearchCore.retrieve(corpus, query, 10);
    assert.ok(result.length > 0, query);
    assert.ok(result.every(item => !/payments/i.test(item.text)), query);
  }

  const intent = SearchCore.parseQueryIntent("How many PBJ episodes never discussed payments?", corpus);
  assert.equal(intent.countTarget, "episodes");
  assert.equal(intent.complementRequested, true);
  assert.equal(intent.negationScope, "episode");
  assert.equal(intent.requiresFullScan, true);
});

test("natural lowercase alternatives use OR semantics without matching common idioms", () => {
  const corpus = [
    chunk("figma", { text: "figma design" }),
    chunk("buzz", { text: "buzz collaboration" }),
    chunk("other", { text: "wallet custody" }),
  ];
  const intent = SearchCore.parseQueryIntent("Where was Figma or Buzz mentioned?", corpus);
  assert.equal(intent.booleanOr, true);
  const result = SearchCore.retrieve(corpus, "Where was Figma or Buzz mentioned?", 10);
  assert.ok(result.some(item => item.youtube_id === "figma"));
  assert.ok(result.some(item => item.youtube_id === "buzz"));
  assert.equal(SearchCore.parseQueryIntent("Was it more or less about bitcoin?", corpus).booleanOr, false);
  assert.equal(SearchCore.parseQueryIntent("Did they discuss it or not?", corpus).booleanOr, false);
});

test("numeric result cardinality is parsed and caps larger caller limits", () => {
  const corpus = Array.from({ length: 6 }, (_, index) => chunk(`buzz-${index}`, {
    date: `2025-0${index + 1}-01`,
    text: "buzz collaboration",
  }));
  const intent = SearchCore.parseQueryIntent("latest three PBJ episodes about Buzz", corpus);
  assert.equal(intent.requestedLimit, 3);
  const result = SearchCore.retrieve(corpus, "latest three PBJ episodes about Buzz", 10);
  assert.equal(result.length, 3);
  assert.deepEqual(result.map(item => item.youtube_id), ["buzz-5", "buzz-4", "buzz-3"]);
  assert.equal(SearchCore.retrieve(corpus, "latest 3 PBJ episodes about Buzz", 2).length, 2);
  assert.equal(new Set(SearchCore.retrieve(corpus, "three PBJ episodes about Buzz", 10)
    .map(item => item.youtube_id)).size, 3);
});

test("change-over-time questions return distinct episodes chronologically", () => {
  const corpus = [
    chunk("late", { date: "2026-06-01", text: "privacy tradeoffs" }),
    chunk("early", { date: "2024-02-01", text: "privacy tradeoffs" }),
    chunk("middle", { date: "2025-03-01", text: "privacy tradeoffs" }),
  ];
  const result = SearchCore.retrieve(corpus, "How did privacy tradeoffs change between 2024 and 2026?", 10);
  assert.deepEqual(result.map(item => item.youtube_id), ["early", "middle", "late"]);
});

test("comparative last-year language does not become a relative-date filter", () => {
  const comparative = SearchCore.parseQueryIntent(
    "Where do they compare bitcoin priced in gold and say it is roughly half of last year?",
    archive,
  );
  assert.deepEqual(comparative.date, { start: null, end: null });
  assert.equal(comparative.latest, false);
  assert.equal(comparative.temporal, false);

  const explicit = SearchCore.parseQueryIntent(
    "PBJ episodes from last year about bitcoin",
    archive,
  );
  assert.notEqual(explicit.date.start, null);
  assert.notEqual(explicit.date.end, null);
});

test("unsupported and reference-shaped stateless prompts fail closed", () => {
  assert.deepEqual(SearchCore.retrieve(archive, "purple elephant marmalade"), []);
  for (const query of [
    "Give me the exact timestamp.",
    "Give me the actual timestamp.",
    "Give me the correct timestamp.",
    "Give me the precise timestamp.",
    "Timestamps",
    "Give timestamps for those",
    "Give timestamps for these",
    "Give timestamps for them",
    "What did they say next?",
    "Which episode was that?",
    "Where did they mention it?",
    "And in 2025?",
    "What about that?",
  ]) {
    assert.deepEqual(SearchCore.retrieve(archive, query), [], query);
  }
  assert.equal(Object.hasOwn(SearchCore, "conversationTurnIntent"), false);
  assert.equal(Object.hasOwn(SearchCore, "contextualizeConversationQuery"), false);
});

test("specific future questions do not trigger the generic bitcoin-outlook collection", () => {
  const generic = SearchCore.retrieve(archive, "How does PB think broadly about bitcoins future?", 1)[0];
  const specific = SearchCore.retrieve(archive, "future of bitcoin mining firmware", 1)[0];
  assert.equal(generic?.topics?.[0], "Bitcoin as everyday money");
  assert.notEqual(specific?.topics?.[0], "Bitcoin as everyday money");
  assert.match(`${specific?.text || ""} ${(specific?.topics || []).join(" ")}`, /min|firmware/i);
});
