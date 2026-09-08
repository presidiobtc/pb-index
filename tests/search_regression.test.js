const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const SearchCore = require("../public/search_core.js");
const chunks = require("../public/search_chunks.json");

const TARGET_VIDEO = "OSanv5Z-DA4";

function idsFor(query, limit = 10) {
  return SearchCore.retrieve(chunks, query, limit).map(source => source.id);
}

function firstFor(query) {
  return SearchCore.retrieve(chunks, query, 1)[0];
}

function relatedFor(query, limit = 6) {
  const sources = SearchCore.retrieve(chunks, query, 10);
  return SearchCore.relatedTopicNames(chunks, query, sources, limit);
}

test("custody-survey queries retain recall and rank disambiguated requests first", () => {
  // Later custody episodes also discuss the original survey. Keep the broad
  // query's recall check, and disambiguate rank-one expectations by date or detail.
  const broadQuery = "Which PBJ episode surveyed different self-custody wallet options and analyzed them?";
  assert.ok(SearchCore.retrieve(chunks, broadQuery, 3).some(source => source.youtube_id === TARGET_VIDEO));
  const queries = [
    "Which PBJ episode surveyed different self-custody wallet options and analyzed them before 2026-01-01?",
    "Which PBJ episode surveyed different self-custody wallet options and analyzed them? The episode covered BitKey and River and Coinbase, among others.",
    "Which PBJ episode had a bitcoin custody survey?",
  ];
  for (const query of queries) {
    assert.equal(firstFor(query)?.youtube_id, TARGET_VIDEO, query);
  }
});

test("custody-survey related topics stay relevant instead of falling back to popular topics", () => {
  const query = "Which PBJ episode surveyed different self-custody wallet options and analyzed them? The episode covered BitKey and River and Coinbase, among others.";
  const related = relatedFor(query);

  for (const topic of ["Bitkey", "Bitcoin custody models", "Custody attack vectors"]) {
    assert.ok(related.includes(topic), `${topic} missing from ${related.join(", ")}`);
  }
  for (const topic of [
    "Vibe coding",
    "Cash App",
    "Bitchat",
    "OpenClaw",
    "Spiral",
    "Bitcoin merchant adoption",
    "Prediction markets",
    "Base",
  ]) {
    assert.ok(!related.includes(topic), `${topic} should not be related to the custody survey`);
  }
});

test("related-topic matching keeps Base distinct from Coinbase", () => {
  const baseOnly = [{
    id: "topic:base:synthetic",
    type: "topic",
    title: "Base",
    series: "PBJ",
    youtube_id: "base-video",
    date: "2026-01-01",
    text: "Base is a layer-two network.",
    topics: ["Base"],
    keywords: ["base network"],
  }];
  assert.deepEqual(
    SearchCore.relatedTopicNames(baseOnly, "Coinbase collateralized borrowing", [], 8),
    [],
  );
});

test("Figma/Buzz and quantum queries receive query-specific related topics", () => {
  const figma = relatedFor("Find the PB episode and time stamp for the Figma reference to Buzz.");
  assert.ok(figma.includes("Buzz"), `Buzz missing from ${figma.join(", ")}`);
  assert.ok(figma.includes("Multi-agent workflows"), `Multi-agent workflows missing from ${figma.join(", ")}`);

  const quantum = relatedFor("What does the archive say about quantum-resistant signatures and migration?");
  assert.ok(quantum.includes("Quantum migration"), `Quantum migration missing from ${quantum.join(", ")}`);
  assert.ok(quantum.includes("Quantum-resistant Bitcoin"), `Quantum-resistant Bitcoin missing from ${quantum.join(", ")}`);

  const unrelated = ["Vibe coding", "Cash App", "Bitchat", "OpenClaw", "Spiral", "Prediction markets"];
  for (const topic of unrelated) {
    assert.ok(!figma.includes(topic), `${topic} should not be related to Figma/Buzz`);
    assert.ok(!quantum.includes(topic), `${topic} should not be related to quantum migration`);
  }
});

test("related topics require subject overlap instead of one generic shared word", () => {
  const hardware = relatedFor("Compare hardware wallets and multisig.");
  assert.ok(hardware.includes("Hardware wallet security"), hardware.join(", "));
  assert.ok(hardware.includes("Multisig"), hardware.join(", "));
  for (const topic of ["Local AI hardware", "Personal agent hardware"]) {
    assert.ok(!hardware.includes(topic), `${topic} should not qualify from hardware alone`);
  }
  // Ask for the narrower subject explicitly; new wallet topics can legitimately
  // displace it from a broad query's six navigation suggestions.
  const supplyChain = relatedFor("Compare hardware wallets, multisig, and supply-chain attacks.");
  assert.ok(supplyChain.includes("Supply-chain attacks"), supplyChain.join(", "));

  const nostr = relatedFor("Find mentions of Nostr identity");
  assert.ok(nostr.includes("Nostr identity"), nostr.join(", "));
  assert.ok(!nostr.includes("Prediction markets"), "a same-episode Nostr mention is not enough");

  const treasury = relatedFor("What are arguments against bitcoin treasury companies?");
  assert.ok(treasury.includes("Bitcoin treasury companies"), treasury.join(", "));
  assert.ok(!treasury.includes("AI model risk"), "the generic word risk must not bridge unrelated topics");
});

test("repeated unrelated topic cards cannot outrank one exact related topic", () => {
  const source = {
    id: "custody:source",
    type: "transcript",
    title: "Custody survey",
    series: "PBJ",
    youtube_id: "custody-video",
    date: "2025-01-01",
    score: 100,
    text: "A survey compares self-custody wallet options including Bitkey, River, and Coinbase.",
    topics: [],
  };
  const exact = {
    id: "topic:bitcoin-custody-models:synthetic",
    type: "topic",
    title: "Custody survey",
    series: "PBJ",
    youtube_id: "custody-video",
    date: "2025-01-01",
    text: "Four approaches to holding bitcoin and choosing a custody setup.",
    topics: ["Bitcoin custody models"],
    keywords: ["bitcoin custody survey", "custody techniques", "wallet custody"],
  };
  const repeatedUnrelated = Array.from({ length: 10 }, (_, index) => ({
    id: `topic:vibe-coding:${index}`,
    type: "topic",
    title: "Vibe coding",
    series: "PBJ",
    youtube_id: `vibe-video-${index}`,
    date: "2026-01-01",
    text: `Vibe coding with autonomous software agents, example ${index}.`,
    topics: ["Vibe coding"],
    keywords: ["vibe coding", "coding agents"],
  }));

  assert.deepEqual(
    SearchCore.relatedTopicNames(
      [source, exact, ...repeatedUnrelated],
      "Which episode surveyed custody wallet options?",
      [source],
      8,
    ),
    ["Bitcoin custody models"],
  );
});

test("related topics do not pad weak or unsupported queries", () => {
  assert.deepEqual(relatedFor("purple elephant marmalade"), []);

  const narrow = relatedFor("Find the PB episode and time stamp for the Figma reference to Buzz.");
  assert.ok(narrow.length > 0);
  assert.ok(narrow.length < 6, `expected a short relevant list, received ${narrow.join(", ")}`);
});

test("episode lookup keeps whole-episode recall but returns the precise matching timestamp", () => {
  const query = "Find the PB episode and time stamp for the Figma reference to Buzz.";
  const source = firstFor(query);
  assert.equal(source?.youtube_id, "f6WH9BbbavM");
  assert.equal(source?.type, "transcript");
  assert.match(source?.text || "", /figma/i);
  assert.match(source?.text || "", /buzz/i);
  assert.ok(source?.t >= 1988 && source?.t <= 2048, `unexpected timestamp ${source?.t}`);
});

test("gold underperformance lookup returns the matching PBJ moment", () => {
  const source = firstFor("Find the PBJ episode and timestamp where bitcoin fell further behind gold.");
  assert.equal(source?.youtube_id, "WisO6hoeUb8");
  assert.ok(Number.isFinite(source?.t), `expected timestamped evidence, received ${source?.t}`);
  assert.ok(source.t >= 4180 && source.t <= 4330, `unexpected timestamp ${source.t}`);
  assert.ok((source.topics || []).includes("Bitcoin vs. gold"));
});

test("timestamp intent prefers 0xSero's timestamped local-AI privacy evidence", () => {
  const source = firstFor(
    "Find the timestamp where 0xSero gives the privacy case for running local models.",
  );
  assert.equal(source?.youtube_id, "uGv-wH4UYkg");
  assert.notEqual(source?.type, "description");
  assert.ok(Number.isFinite(source?.t), `expected timestamped evidence, received ${source?.t}`);
  assert.ok(source.t >= 400 && source.t <= 460, `unexpected timestamp ${source.t}`);
});

test("qualified Project Loupe lookup reaches the audit-prioritization discussion", () => {
  const source = firstFor(
    "Find the timestamp where Project Loupe debates which projects deserve audits.",
  );
  assert.equal(source?.youtube_id, "WisO6hoeUb8");
  assert.equal(source?.t, 2888);
  assert.ok((source?.topics || []).includes("Project Loupe"));
});

test("multi-concept passage searches prefer local co-occurrence over generic topic metadata", () => {
  const queries = [
    "Figma Buzz",
    "Where is Figma mentioned in relation to Buzz?",
  ];
  for (const query of queries) {
    const source = firstFor(query);
    assert.equal(source?.youtube_id, "f6WH9BbbavM", query);
    assert.equal(source?.type, "transcript", query);
    assert.match(source?.text || "", /figma/i, query);
    assert.match(source?.text || "", /buzz/i, query);
  }
});

test("standalone curated topics stay protected while explicit series intent wins", () => {
  for (const topic of ["Bitcoin self-custody", "Bitcoin custody models", "AI privacy", "bitcoin backed loans"]) {
    const source = firstFor(topic);
    assert.equal(source?.type, "topic", topic);
    assert.ok(
      (source?.topics || []).map(SearchCore.normalizeForMatch).includes(SearchCore.normalizeForMatch(topic)),
      topic,
    );
  }

  const qualified = SearchCore.retrieve(chunks, "Which PBJ episode covers Bitcoin self-custody?", 8);
  assert.ok(qualified.length > 0);
  assert.ok(qualified.every(source => source.series === "PBJ"));
});

test("every canonical topic name returns that exact topic at rank one", () => {
  const topics = [...new Set(chunks.flatMap(chunk => chunk.topics || []))];
  assert.equal(topics.length, 875, "topic count changed; review the exhaustive exact-topic guard");
  for (const topic of topics) {
    const source = firstFor(topic);
    const sourceTopics = (source?.topics || []).map(SearchCore.normalizeForMatch);
    assert.ok(
      sourceTopics.includes(SearchCore.normalizeForMatch(topic)),
      `${topic} returned ${source?.id || "no source"}`,
    );
  }
});

test("specific child topics beat overlapping parent topic names", () => {
  const cases = new Map([
    ["Open-source AI models", "Open-source AI"],
    ["Cash App Lightning", "Cash App"],
    ["Bitcoin Design Week", "Bitcoin design"],
  ]);
  for (const [query, parentTopic] of cases) {
    const sourceTopics = (firstFor(query)?.topics || []).map(SearchCore.normalizeForMatch);
    assert.ok(sourceTopics.includes(SearchCore.normalizeForMatch(query)), query);
    assert.ok(!sourceTopics.includes(SearchCore.normalizeForMatch(parentTopic)), query);
  }
});

test("established topic aliases remain protected", () => {
  assert.ok((firstFor("Bitcoin lending")?.topics || []).includes("Bitcoin-backed loans"));
  assert.ok((firstFor("quantum readiness report")?.topics || []).includes("Presidio Bitcoin's Quantum Readiness Report"));
});

test("broad bitcoin query keeps its curated topic prefix", () => {
  const found = SearchCore.retrieve(chunks, "How does PB think broadly about bitcoins future?", 8);
  assert.deepEqual(found.map(source => source.topics?.[0]), SearchCore.BROAD_BITCOIN_TOPICS);
});

test("episode scoring rewards concept coverage rather than repetition", () => {
  const synthetic = [
    {
      id: "repeat:0", type: "transcript", title: "Survey Survey Survey", series: "PBJ",
      youtube_id: "repeat", date: "2026-01-01", text: "survey ".repeat(200), url: "https://youtube.com/watch?v=repeat", topics: [],
    },
    {
      id: "coverage:0", type: "description", title: "A custody comparison", series: "PBJ",
      youtube_id: "coverage", date: "2025-01-01", text: "A survey evaluating several wallet custody techniques.",
      url: "https://youtube.com/watch?v=coverage", topics: [],
    },
    {
      id: "nonpbj:0", type: "description", title: "Perfect wallet custody survey analysis", series: "Other",
      youtube_id: "nonpbj", date: "2027-01-01", text: "survey evaluate wallet custody option bitkey",
      url: "https://youtube.com/watch?v=nonpbj", topics: [],
    },
  ];
  const result = SearchCore.retrieve(synthetic, "Which PBJ episode surveyed and analyzed custody wallet options?", 3);
  assert.equal(result[0]?.youtube_id, "coverage");
  assert.ok(result.every(source => source.series === "PBJ"));
});

test("server and browser use the same shared retrieval implementation", async () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "public", "ask.html"), "utf8");
  assert.match(html, /<script src="\.\/search_core\.js"><\/script>/);
  assert.match(html, /PBSearch\.parseQueryIntent\(query, localChunks\)/);
  assert.match(html, /PBSearch\.retrieve\(localChunks, query,/);
  assert.match(html, /PBSearch\.relatedTopicNames\(localChunks, query, selected, 6\)/);
  assert.doesNotMatch(html, /function relatedTopicsForQuery\(/);
  assert.doesNotMatch(html, /conversationHistory|contextualizeConversationQuery|source_ids/);
  assert.doesNotMatch(html, /\bhistory\s*:/);

  const previousKey = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  const { handler } = require("../netlify/functions/lib/ask-handler.js");
  const query = "Which PBJ episode surveyed different self-custody wallet options and analyzed them?";
  const response = await handler({ httpMethod: "POST", body: JSON.stringify({ query, limit: 10 }) });
  if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = previousKey;
  const body = JSON.parse(response.body);
  assert.equal(response.statusCode, 200);
  assert.deepEqual(body.sources.map(source => source.id), idsFor(query));
  assert.deepEqual(
    body.related_topics,
    SearchCore.relatedTopicNames(chunks, query, SearchCore.retrieve(chunks, query, 10), 6),
  );
});
