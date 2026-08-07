const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const AskShare = require("../netlify/functions/lib/ask-share.js");
const AskHandler = require("../netlify/functions/lib/ask-handler.js");
const AskPage = require("../netlify/functions/lib/ask-page-handler.js");
const PBAskShare = require("../public/ask_share.js");

const ROOT = path.resolve(__dirname, "..");
const SNAPSHOT_ID = "abcdefghijklmnopqrstuv";

function source(youtubeId, overrides = {}) {
  return {
    id: `${youtubeId || "missing"}:0`,
    type: "transcript",
    title: "PBJ: Example recording",
    youtube_id: youtubeId,
    url: youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : "",
    text: "A timestamped transcript segment.",
    ...overrides,
  };
}

function payload(overrides = {}) {
  return {
    query: "what is project loupe?",
    answer: [
      "Based on the PB archive, **Project Loupe** is an open-source security-scanning initiative [1].",
      "A second sentence supplies implementation detail [2].",
    ].join(" "),
    sources: [source("video-a"), source("video-a", { id: "video-a:120" }), source("video-b")],
    related_topics: ["Project Loupe", "Open-source funding"],
    suggested_questions: ["What happened next?"],
    retrieval_context: { source_count: 3 },
    mode: "rag",
    ...overrides,
  };
}

function memoryStore() {
  const values = new Map();
  const writes = [];
  let reads = 0;
  return {
    values,
    writes,
    get reads() { return reads; },
    async setJSON(key, value, options) {
      writes.push({ key, value: structuredClone(value), options: structuredClone(options) });
      if (options?.onlyIfNew && values.has(key)) return { modified: false };
      values.set(key, structuredClone(value));
      return { modified: true };
    },
    async get(key) {
      reads += 1;
      const value = values.get(key);
      return value === undefined ? null : structuredClone(value);
    },
  };
}

async function withEnv(changes, fn) {
  const previous = new Map();
  for (const [name, value] of Object.entries(changes)) {
    previous.set(name, process.env[name]);
    if (value === undefined) delete process.env[name];
    else process.env[name] = String(value);
  }
  try {
    return await fn();
  } finally {
    for (const [name, value] of previous) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
}

test.afterEach(() => AskShare.setStoreFactoryForTests(null));

test("saved Ask PB answers are create-only frozen snapshots", async () => {
  const store = memoryStore();
  const original = payload();
  const snapshot = await AskShare.persistGeneratedSnapshot(original, {
    id: SNAPSHOT_ID,
    createdAt: "2026-08-06T12:00:00.000Z",
    store,
  });

  assert.equal(store.writes.length, 1);
  assert.equal(store.writes[0].key, `snapshots/${SNAPSHOT_ID}.json`);
  assert.deepEqual(store.writes[0].options, { onlyIfNew: true });

  original.query = "mutated question";
  original.answer = "mutated answer";
  original.sources[0].title = "mutated source";
  snapshot.answer = "mutated returned object";

  const frozen = await AskShare.loadSnapshot(SNAPSHOT_ID, { store });
  assert.equal(frozen.query, "what is project loupe?");
  assert.match(frozen.answer, /Project Loupe/);
  assert.equal(frozen.sources[0].title, "PBJ: Example recording");

  await assert.rejects(
    AskShare.persistGeneratedSnapshot(payload({ answer: "replacement" }), {
      id: SNAPSHOT_ID,
      store,
    }),
    /Could not allocate a unique Ask PB snapshot ID/,
  );
  assert.match((await AskShare.loadSnapshot(SNAPSHOT_ID, { store })).answer, /Project Loupe/);
});

test("schema-v1 snapshots created by the earlier card implementation remain readable", async () => {
  const store = memoryStore();
  const legacy = AskShare.createSnapshot(payload(), {
    id: SNAPSHOT_ID,
    createdAt: "2026-08-06T12:00:00.000Z",
  });
  legacy.card = {
    title: "Project Loupe",
    teaser: "A legacy social-card teaser.",
    recording_count: 2,
    provenance: "Based on 2 recordings",
  };
  store.values.set(AskShare.snapshotKey(SNAPSHOT_ID), structuredClone(legacy));

  const loaded = await AskShare.loadSnapshot(SNAPSHOT_ID, { store });
  assert.equal(loaded.query, legacy.query);
  assert.equal(loaded.answer, legacy.answer);
  assert.deepEqual(loaded.sources, legacy.sources);
  assert.equal(Object.hasOwn(loaded, "card"), false, "obsolete card data should not reach the client");
});

test("Ask API saves its returned answer and includes its canonical snapshot identity", async () => {
  const store = memoryStore();
  AskShare.setStoreFactoryForTests(() => store);

  await withEnv({ OPENAI_API_KEY: undefined, ASK_RATE_LIMIT_PER_MINUTE: 0 }, async () => {
    const response = await AskHandler.handler({
      httpMethod: "POST",
      body: JSON.stringify({ query: "project loupe", limit: 4 }),
    });
    const body = JSON.parse(response.body);

    assert.equal(response.statusCode, 200);
    assert.match(body.share_id, AskShare.SNAPSHOT_ID_PATTERN);
    assert.equal(body.share_path, `/ask/shared/${body.share_id}`);
    const saved = await AskShare.loadSnapshot(body.share_id, { store });
    assert.equal(saved.query, body.query);
    assert.equal(saved.answer, body.answer);
    assert.deepEqual(saved.sources, body.sources);
    assert.deepEqual(saved.related_topics, body.related_topics);
    assert.deepEqual(saved.suggested_questions, body.suggested_questions);
    assert.equal(saved.mode, body.mode);
  });
});

test("Ask API fails closed instead of returning an answer with a broken permalink", async () => {
  AskShare.setStoreFactoryForTests(() => ({
    async setJSON() { throw new Error("simulated snapshot write failure"); },
    async get() { return null; },
  }));

  await withEnv({ OPENAI_API_KEY: undefined, ASK_RATE_LIMIT_PER_MINUTE: 0 }, async () => {
    const originalError = console.error;
    console.error = () => {};
    try {
      const response = await AskHandler.handler({
        httpMethod: "POST",
        body: JSON.stringify({ query: "project loupe", limit: 2 }),
      });
      assert.equal(response.statusCode, 503);
      assert.deepEqual(JSON.parse(response.body), {
        error: "Ask PB could not save this answer. Please try again.",
      });
      assert.doesNotMatch(response.body, /"answer"|"share_path"|"share_id"/);
    } finally {
      console.error = originalError;
    }
  });
});

test("shared answer HTML bootstraps the exact frozen answer safely and remains unlisted", () => {
  const malicious = AskShare.createSnapshot(payload({
    query: `Project "Loupe" </title><script>alert("query")</script>`,
    answer: `Based on the PB archive, the saved answer contains </script><script>alert("answer")</script> exactly.`,
    sources: [source("video-a", { title: `</script><script>alert("source")</script>` })],
  }), {
    id: SNAPSHOT_ID,
    createdAt: "2026-08-06T12:00:00.000Z",
  });
  const template = fs.readFileSync(path.join(ROOT, "public", "ask.html"), "utf8");
  const html = AskShare.renderSnapshotHtml(template, malicious, { origin: "https://pbarchive.ai" });

  assert.match(html, new RegExp(`<link rel="canonical" href="https://pbarchive\\.ai/ask/shared/${SNAPSHOT_ID}">`));
  assert.match(html, /<base href="\/">/);
  assert.match(html, /<meta name="robots" content="noindex,nofollow">/);
  assert.doesNotMatch(html, /<meta[^>]+(?:property|name)=["'](?:og:|twitter:)/i);
  assert.doesNotMatch(html, /card\.png|ask-preview/i);

  const bootstrapMatch = html.match(/<script>window\.__PB_ASK_SNAPSHOT__=([\s\S]*?);<\/script>/);
  assert.ok(bootstrapMatch, "shared page should embed a frozen Ask PB payload");
  assert.doesNotMatch(bootstrapMatch[1], /<|>|&|<\/script>/i);
  const bootstrap = JSON.parse(bootstrapMatch[1]);
  assert.equal(bootstrap.query, malicious.query);
  assert.equal(bootstrap.answer, malicious.answer);
  assert.deepEqual(bootstrap.sources, malicious.sources);
  assert.equal(bootstrap.share_path, `/ask/shared/${SNAPSHOT_ID}`);
});

test("snapshot hydration wins over a query URL and never enters the API-running branch", () => {
  const snapshot = AskShare.snapshotForClient(AskShare.createSnapshot(payload(), { id: SNAPSHOT_ID }));

  assert.deepEqual(PBAskShare.initialView(snapshot, "a different live query"), {
    kind: "snapshot",
    data: snapshot,
  });
  assert.deepEqual(PBAskShare.initialView(null, " project loupe "), {
    kind: "query",
    query: "project loupe",
  });

  const page = fs.readFileSync(path.join(ROOT, "public", "ask.html"), "utf8");
  const snapshotBranch = page.match(/if \(initialView\.kind === "snapshot"\) \{([\s\S]*?)\} else if \(initialView\.kind === "query"\)/);
  assert.ok(snapshotBranch, "Ask PB should have a dedicated frozen-snapshot hydration branch");
  assert.match(snapshotBranch[1], /render\(initialView\.data\)/);
  assert.match(snapshotBranch[1], /applySnapshotUrl\(initialView\.data/);
  assert.doesNotMatch(snapshotBranch[1], /runAsk|askServer|fetch\(/);
});

test("shared answer handler rejects invalid and missing IDs without caching them", async () => {
  const store = memoryStore();
  AskShare.setStoreFactoryForTests(() => store);

  const malformed = await AskPage.handler({
    httpMethod: "GET",
    queryStringParameters: { id: "../not-a-snapshot" },
  });
  assert.equal(malformed.statusCode, 404);
  assert.equal(malformed.headers["cache-control"], "no-store");
  assert.equal(malformed.headers["x-robots-tag"], "noindex, nofollow");
  assert.equal(store.reads, 0, "malformed IDs should not reach snapshot storage");

  const missing = await AskPage.handler({
    httpMethod: "GET",
    queryStringParameters: { id: SNAPSHOT_ID },
  });
  assert.equal(missing.statusCode, 404);
  assert.equal(missing.headers["cache-control"], "no-store");
  assert.equal(store.reads, 1);
});

test("a valid shared answer response is noindex HTML with no social-card metadata", async () => {
  const store = memoryStore();
  AskShare.setStoreFactoryForTests(() => store);
  await AskShare.persistGeneratedSnapshot(payload(), {
    id: SNAPSHOT_ID,
    createdAt: "2026-08-06T12:00:00.000Z",
  });

  const response = await AskPage.handler({
    httpMethod: "GET",
    queryStringParameters: { id: SNAPSHOT_ID },
  });
  assert.equal(response.statusCode, 200);
  assert.match(response.headers["content-type"], /^text\/html/);
  assert.equal(response.headers["x-robots-tag"], "noindex, nofollow");
  assert.match(response.body, /window\.__PB_ASK_SNAPSHOT__/);
  assert.match(response.body, /<meta name="robots" content="noindex,nofollow">/);
  assert.doesNotMatch(response.body, /(?:og:|twitter:|card\.png|ask-preview)/i);
});

test("shared answer handler supports HEAD and rejects unsupported methods", async () => {
  const store = memoryStore();
  AskShare.setStoreFactoryForTests(() => store);
  await AskShare.persistGeneratedSnapshot(payload(), { id: SNAPSHOT_ID });

  const head = await AskPage.handler({
    httpMethod: "HEAD",
    queryStringParameters: { id: SNAPSHOT_ID },
  });
  assert.equal(head.statusCode, 200);
  assert.equal(head.body, "");
  assert.match(head.headers["content-type"], /^text\/html/);
  assert.equal(head.headers["x-robots-tag"], "noindex, nofollow");

  const post = await AskPage.handler({
    httpMethod: "POST",
    queryStringParameters: { id: SNAPSHOT_ID },
  });
  assert.equal(post.statusCode, 405);
  assert.equal(post.headers.allow, "GET, HEAD");
  assert.equal(post.headers["cache-control"], "no-store");
  assert.equal(post.headers["x-robots-tag"], "noindex, nofollow");
});

test("address-bar replacement and clipboard Share resolve to the same snapshot URL", () => {
  const data = {
    share_id: SNAPSHOT_ID,
    share_path: `/ask/shared/${SNAPSHOT_ID}`,
  };
  const location = {
    origin: "https://pbarchive.ai",
    href: "https://pbarchive.ai/ask.html?q=project+loupe#source-1",
  };
  const calls = [];
  const history = {
    replaceState(state, title, url) {
      calls.push({ state, title, url });
      location.href = url;
    },
  };

  const addressBarUrl = PBAskShare.applySnapshotUrl(data, { location, history });
  assert.equal(addressBarUrl, `https://pbarchive.ai/ask/shared/${SNAPSHOT_ID}`);
  assert.equal(PBAskShare.shareUrl(addressBarUrl, location), addressBarUrl);
  assert.deepEqual(calls, [{ state: { askSnapshot: SNAPSHOT_ID }, title: "", url: addressBarUrl }]);

  const page = fs.readFileSync(path.join(ROOT, "public", "ask.html"), "utf8");
  const handler = page.match(/shareAnswerButton\.addEventListener\("click", async \(\) => \{([\s\S]*?)\n    \}\);/);
  assert.ok(handler, "Share click handler should exist");
  assert.match(handler[1], /PBAskShare\.shareUrl\(currentShareUrl, location\)/);
  assert.match(handler[1], /await copyText\(url\)/);
  assert.match(handler[1], /flashAction\(shareAnswerButton, "Link copied"\)/);
  assert.doesNotMatch(handler[1], /navigator\.share|answerTextForCopying|currentAnswerText/);
});

test("Netlify configuration exposes only Ask API and frozen-page routes", () => {
  const netlify = fs.readFileSync(path.join(ROOT, "netlify.toml"), "utf8");
  assert.match(netlify, /\[functions\."ask-api"\]/);
  assert.match(netlify, /\[functions\."ask-page"\]/);
  assert.doesNotMatch(netlify, /ask-preview|card\.png/i);
  assert.equal(fs.existsSync(path.join(ROOT, "netlify", "functions", "ask-preview.mjs")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "netlify", "functions", "lib", "ask-preview-handler.js")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "netlify", "functions", "lib", "ask-card.js")), false);
});
