const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const AskShare = require("../netlify/functions/lib/ask-share.js");
const AskHandler = require("../netlify/functions/lib/ask-handler.js");
const AskPage = require("../netlify/functions/lib/ask-page-handler.js");
const AskCard = require("../netlify/functions/lib/ask-card.js");
const AskPreview = require("../netlify/functions/lib/ask-preview-handler.js");
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
  assert.deepEqual(Object.keys(legacy).sort(), [
    "answer",
    "created_at",
    "id",
    "mode",
    "query",
    "related_topics",
    "schema_version",
    "sources",
    "suggested_questions",
  ], "social previews must not change the durable snapshot schema");
  assert.equal(Object.hasOwn(legacy, "retrieval_context"), false);
  legacy.card = {
    title: "Incorrect legacy title",
    teaser: "A legacy social-card teaser.",
    recording_count: 99,
    provenance: "Based on 99 recordings",
  };
  store.values.set(AskShare.snapshotKey(SNAPSHOT_ID), structuredClone(legacy));

  const loaded = await AskShare.loadSnapshot(SNAPSHOT_ID, { store });
  assert.equal(loaded.query, legacy.query);
  assert.equal(loaded.answer, legacy.answer);
  assert.deepEqual(loaded.sources, legacy.sources);
  assert.equal(Object.hasOwn(loaded, "card"), false, "obsolete card data should not reach the client");
  const recomputed = AskShare.cardData(loaded);
  assert.equal(recomputed.title, "What is Project Loupe?");
  assert.equal(recomputed.recording_count, 2);
  assert.equal(recomputed.provenance, "Based on 2 recordings");
  assert.notEqual(recomputed.teaser, legacy.card.teaser,
    "preview copy should be recomputed from frozen answer fields, not trusted legacy card data");
});

test("social-card copy counts recordings and keeps omitted answer text visibly continued", () => {
  const repeated = AskShare.cardData(payload({
    answer: [
      "Based on the PB archive, **Project Loupe** is an open-source, AI-assisted security-scanning initiative from Spiral and Block's security team [1].",
      "Additional implementation detail follows in the full answer [2].",
    ].join(" "),
  }));
  assert.equal(repeated.recording_count, 2);
  assert.equal(repeated.provenance, "Based on 2 recordings");
  assert.doesNotMatch(repeated.teaser, /Based on the PB archive|\*\*|\[\d+\]/);
  assert.equal(repeated.teaser,
    "Project Loupe is an open-source, AI-assisted security-scanning initiative from Spiral and Block's security team…");
  assert.match(repeated.teaser, /…$/);
  assert.doesNotMatch(repeated.teaser, /……|\.\.\.…/);

  assert.equal(AskShare.cardData(payload({ sources: [source("only-video")] })).provenance, "Based on 1 recording");
  assert.equal(AskShare.cardData(payload({ sources: [source(""), {}] })).provenance, "Based on the PB archive");

  const longNatural = AskCard.cardViewModel(payload({
    query: "How should maintainers continuously evaluate AI-assisted security reports while preserving reproducibility, responsible disclosure, and independent technical review?",
    related_topics: [],
  }));
  assert.match(longNatural.title, /…$/);
  assert.ok(longNatural.typography.lineCount <= 3);
  assert.equal(longNatural.typography.truncated, true);

  const short = AskCard.cardViewModel(payload({ query: "Project Loupe", related_topics: ["Project Loupe"] }));
  assert.equal(short.typography.lineCount, 1);
  assert.ok(short.typography.fontSize > longNatural.typography.fontSize,
    "short prompts should retain a larger title treatment than long questions");

  const wide = AskCard.cardViewModel(payload({ query: "W".repeat(114), related_topics: [] }));
  const narrow = AskCard.cardViewModel(payload({ query: "i".repeat(114), related_topics: [] }));
  assert.ok(wide.typography.fontSize <= narrow.typography.fontSize,
    "title sizing should account for rendered glyph width, not only character count");
  assert.ok(wide.typography.lineCount >= narrow.typography.lineCount);
  assert.match(wide.title, /…$/);

  const longToken = AskCard.cardViewModel(payload({ query: "x".repeat(400), related_topics: [] }));
  assert.match(longToken.title, /…$/);
  assert.equal(longToken.typography.lineCount, 3);
  assert.equal(longToken.typography.truncated, true,
    "even an unbroken token should be visibly truncated within three measured lines");

  const wideTeaser = AskCard.cardViewModel(payload({
    query: "Project Loupe",
    related_topics: ["Project Loupe"],
    answer: `Based on the PB archive, ${"W".repeat(500)}`,
  }));
  assert.ok(wideTeaser.teaserTypography.lineCount <= 4);
  assert.equal(wideTeaser.teaserTypography.truncated, true);
  assert.match(wideTeaser.teaser, /…$/,
    "unbroken answer text should retain a visible ellipsis instead of overflowing the card");

  const expandedExcerpt = AskCard.cardExcerpt(
    "Based on the PB archive, The first sentence establishes the result. The second sentence adds useful context for the shared preview.",
    285,
  );
  assert.match(expandedExcerpt, /second sentence adds useful context/i,
    "short-title cards should use more than the opening sentence when space is available");

  const elementTree = JSON.stringify(AskCard.cardElement(payload(), {
    logo: "data:image/png;base64,",
    fonts: [],
  }));
  assert.match(elementTree, /PB MEDIA ARCHIVE/);
  assert.doesNotMatch(elementTree, /ASK PB|pbarchive\.ai/,
    "the simplified card should not repeat an Ask PB label or URL footer");
  assert.equal(AskShare.clampText("x".repeat(100), 70).text.length, 70,
    "metadata clamps must honor their hard character limit for unbroken text");
  assert.equal(AskShare.SOCIAL_CARD_VERSION, 2,
    "a visual redesign must use a new immutable social-card URL version");
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

test("Ask API still returns its answer when snapshot storage is temporarily unavailable", async () => {
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
      assert.equal(response.statusCode, 200);
      const body = JSON.parse(response.body);
      assert.match(body.answer, /^Based on the PB archive,/);
      assert.equal(body.share_unavailable, true);
      assert.equal(body.share_path, undefined);
      assert.equal(body.share_id, undefined);
    } finally {
      console.error = originalError;
    }
  });
});

test("shared answer HTML emits complete Open Graph and X metadata safely", () => {
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
  assert.match(html, /<meta name="robots" content="noindex,follow">/);
  assert.match(html, /<meta name="description" content="[^"]+">/);
  assert.match(html, /<meta property="og:type" content="website">/);
  assert.match(html, /<meta property="og:locale" content="en_US">/);
  assert.match(html, /<meta property="og:site_name" content="PB Media Archive">/);
  assert.match(html, /<meta property="og:title" content="[^"]+">/);
  assert.match(html, /<meta property="og:description" content="[^"]+">/);
  assert.match(html, new RegExp(`<meta property="og:url" content="https://pbarchive\\.ai/ask/shared/${SNAPSHOT_ID}">`));
  const image = `https://pbarchive.ai/ask/shared/${SNAPSHOT_ID}/card.png?v=${AskShare.SOCIAL_CARD_VERSION}`;
  const escapedImage = image.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  assert.match(html, new RegExp(`<meta property="og:image" content="${escapedImage}">`));
  assert.match(html, new RegExp(`<meta property="og:image:secure_url" content="${escapedImage}">`));
  assert.match(html, /<meta property="og:image:type" content="image\/png">/);
  assert.match(html, /<meta property="og:image:width" content="1200">/);
  assert.match(html, /<meta property="og:image:height" content="630">/);
  assert.match(html, /<meta property="og:image:alt" content="[^"]+">/);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image">/);
  assert.match(html, /<meta name="twitter:site" content="@PresidioBitcoin">/);
  assert.match(html, /<meta name="twitter:title" content="[^"]+">/);
  assert.match(html, /<meta name="twitter:description" content="[^"]+">/);
  assert.match(html, new RegExp(`<meta name="twitter:image" content="${escapedImage}">`));
  assert.match(html, /<meta name="twitter:image:alt" content="[^"]+">/);
  assert.doesNotMatch(html, /<\/title><script>|<\/script><script>/i);
  assert.match(html, /&lt;\/title&gt;&lt;script&gt;/i);
  assert.ok(html.indexOf("og:image") < html.indexOf("</head>"), "crawler metadata must be server-rendered in the head");

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

test("a valid shared answer response is unlisted HTML with crawlable social metadata", async () => {
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
  assert.equal(response.headers["x-robots-tag"], undefined, "valid unfurls must not be blocked by an HTTP robots header");
  assert.match(response.body, /window\.__PB_ASK_SNAPSHOT__/);
  assert.match(response.body, /<meta name="robots" content="noindex,follow">/);
  assert.match(response.body, /<meta property="og:image"/);
  assert.match(response.body, /<meta name="twitter:card" content="summary_large_image">/);
  assert.match(response.body, /card\.png\?v=\d+/);
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
  assert.equal(head.headers["x-robots-tag"], undefined);

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

test("preview handler serves an immutable 1200 by 630 PNG and handles HTTP boundaries", async () => {
  const store = memoryStore();
  AskShare.setStoreFactoryForTests(() => store);
  await AskShare.persistGeneratedSnapshot(payload(), { id: SNAPSHOT_ID });

  const malformed = await AskPreview.handler({
    httpMethod: "GET",
    queryStringParameters: { id: "../not-a-snapshot" },
  });
  assert.equal(malformed.statusCode, 404);
  assert.equal(malformed.headers["cache-control"], "no-store");
  assert.equal(malformed.headers["x-robots-tag"], "noindex");
  assert.equal(store.reads, 0, "malformed card IDs should not reach snapshot storage");

  const missing = await AskPreview.handler({
    httpMethod: "GET",
    queryStringParameters: { id: "zyxwvutsrqponmlkjihgfe" },
  });
  assert.equal(missing.statusCode, 404);
  assert.equal(store.reads, 1);

  const get = await AskPreview.handler({
    httpMethod: "GET",
    queryStringParameters: { id: SNAPSHOT_ID },
  });
  assert.equal(get.statusCode, 200);
  assert.equal(get.headers["content-type"], "image/png");
  assert.equal(get.headers["x-robots-tag"], undefined);
  assert.match(get.headers["cache-control"], /public.*max-age=31536000.*immutable/);
  assert.match(get.headers["netlify-cdn-cache-control"], /public.*durable.*max-age=31536000.*immutable/);
  assert.equal(get.isBase64Encoded, true);
  const png = Buffer.from(get.body, "base64");
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(png.toString("ascii", 12, 16), "IHDR");
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  assert.equal(Number(get.headers["content-length"]), png.length);
  assert.ok(png.length < 5 * 1024 * 1024, "social card should stay below cross-platform image limits");
  assert.equal(AskCard.WIDTH, 1200);
  assert.equal(AskCard.HEIGHT, 630);

  const head = await AskPreview.handler({
    httpMethod: "HEAD",
    queryStringParameters: { id: SNAPSHOT_ID },
  });
  assert.equal(head.statusCode, 200);
  assert.equal(head.headers["content-type"], "image/png");
  assert.equal(head.headers["x-robots-tag"], undefined);
  assert.equal(head.body, "");
  assert.equal(head.isBase64Encoded, false);
  assert.ok(Number(head.headers["content-length"]) > 0);

  const post = await AskPreview.handler({
    httpMethod: "POST",
    queryStringParameters: { id: SNAPSHOT_ID },
  });
  assert.equal(post.statusCode, 405);
  assert.equal(post.headers.allow, "GET, HEAD");
  assert.equal(post.headers["cache-control"], "no-store");
  assert.equal(post.headers["x-robots-tag"], "noindex");
});

test("Netlify preview wrapper maps the route parameter and returns PNG", async () => {
  const store = memoryStore();
  AskShare.setStoreFactoryForTests(() => store);
  await AskShare.persistGeneratedSnapshot(payload(), { id: SNAPSHOT_ID });
  const { handler: previewHandler, config } = await import("../netlify/functions/ask-preview.mjs");

  assert.equal(config.path, "/ask/shared/:id/card.png");
  const response = await previewHandler({
    httpMethod: "GET",
    path: `/ask/shared/${SNAPSHOT_ID}/card.png`,
    queryStringParameters: { v: String(AskShare.SOCIAL_CARD_VERSION) },
  });
  assert.equal(response.statusCode, 200);
  assert.equal(response.headers["content-type"], "image/png");
  assert.equal(response.headers["x-robots-tag"], undefined);
  const png = Buffer.from(response.body, "base64");
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});

test("Netlify configuration bundles preview assets and permits social crawlers", () => {
  const netlify = fs.readFileSync(path.join(ROOT, "netlify.toml"), "utf8");
  assert.match(netlify, /\[functions\."ask-api"\]/);
  assert.match(netlify, /\[functions\."ask-page"\]/);
  assert.match(netlify, /\[functions\."ask-preview"\]/);
  assert.match(
    netlify,
    /from = "\/api\/ask"[\s\S]*?\[redirects\.rate_limit\][\s\S]*?window_limit = 30[\s\S]*?window_size = 60/,
  );
  for (const asset of ["public/logo.png", "newsreader-latin-400-normal.woff", "inter-latin-400-normal.woff", "inter-latin-600-normal.woff"]) {
    assert.match(netlify, new RegExp(asset.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.equal(fs.existsSync(path.join(ROOT, "netlify", "functions", "ask-preview.mjs")), true);
  assert.equal(fs.existsSync(path.join(ROOT, "netlify", "functions", "lib", "ask-preview-handler.js")), true);
  assert.equal(fs.existsSync(path.join(ROOT, "netlify", "functions", "lib", "ask-card.js")), true);

  const robots = fs.readFileSync(path.join(ROOT, "public", "robots.txt"), "utf8");
  for (const crawler of ["Twitterbot", "facebookexternalhit", "Facebot", "LinkedInBot", "Slackbot", "Discordbot", "Applebot"]) {
    assert.match(robots, new RegExp(`User-agent: ${crawler}\\nAllow: /`, "i"));
  }
  assert.doesNotMatch(robots, /Disallow:/i);
});
