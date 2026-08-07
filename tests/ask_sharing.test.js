const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const AskShare = require("../netlify/functions/lib/ask-share.js");
const AskCard = require("../netlify/functions/lib/ask-card.js");
const PBAskShare = require("../public/ask_share.js");

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
    query: "project loupe",
    answer: [
      "Based on the PB archive, **Project Loupe** is an open-source, AI-assisted security-scanning initiative from Spiral and Block's security team [1].",
      "A later sentence supplies implementation detail [2].",
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
  return {
    values,
    writes,
    async setJSON(key, value, options) {
      writes.push({ key, value: structuredClone(value), options: structuredClone(options) });
      if (options?.onlyIfNew && values.has(key)) return { modified: false };
      values.set(key, structuredClone(value));
      return { modified: true };
    },
    async get(key) {
      const value = values.get(key);
      return value === undefined ? null : structuredClone(value);
    },
  };
}

test("recording provenance counts distinct YouTube recordings and handles singular and zero", () => {
  assert.equal(AskShare.recordingCount([
    source("video-a"),
    source("video-a", { id: "video-a:120" }),
    source(" video-b "),
    source(""),
    {},
  ]), 2);

  assert.equal(AskShare.provenanceLabel(2), "Based on 2 recordings");
  assert.equal(AskShare.provenanceLabel(1), "Based on 1 recording");
  assert.equal(AskShare.provenanceLabel(0), "Based on the PB archive");

  const singular = AskShare.createSnapshot(payload({ sources: [source("only-video")] }), {
    id: SNAPSHOT_ID,
    createdAt: "2026-08-06T12:00:00.000Z",
  });
  assert.equal(singular.card.recording_count, 1);
  assert.equal(singular.card.provenance, "Based on 1 recording");

  const empty = AskShare.createSnapshot(payload({ sources: [source(""), {}] }), {
    id: SNAPSHOT_ID,
    createdAt: "2026-08-06T12:00:00.000Z",
  });
  assert.equal(empty.card.recording_count, 0);
  assert.equal(empty.card.provenance, "Based on the PB archive");
});

test("snapshot title prefers an exact topic and teaser is clean, concise, and visibly continued", () => {
  const snapshot = AskShare.createSnapshot(payload(), {
    id: SNAPSHOT_ID,
    createdAt: "2026-08-06T12:00:00.000Z",
  });

  assert.equal(snapshot.card.title, "Project Loupe");
  assert.equal(
    snapshot.card.teaser,
    "Project Loupe is an open-source, AI-assisted security-scanning initiative from Spiral and Block's security team…",
  );
  assert.doesNotMatch(snapshot.card.teaser, /Based on the PB archive|\*\*|\[1\]/);

  const questionTitle = AskShare.createSnapshot(payload({
    query: "what is project loupe?",
    related_topics: ["Project Loupe"],
  }), { id: SNAPSHOT_ID });
  assert.equal(questionTitle.card.title, "What is Project Loupe?");

  assert.throws(
    () => AskShare.createSnapshot(payload({ answer: "x".repeat(AskShare.MAX_SNAPSHOT_BYTES) }), {
      id: SNAPSHOT_ID,
    }),
    /exceeds the storage limit/,
  );
});

test("snapshot persistence is create-only and remains unchanged in a fake store", async () => {
  const store = memoryStore();
  const original = payload();
  const env = { CONTEXT: "production" };
  const snapshot = await AskShare.persistGeneratedSnapshot(original, {
    id: SNAPSHOT_ID,
    createdAt: "2026-08-06T12:00:00.000Z",
    env,
    store,
  });

  assert.equal(store.writes.length, 1);
  assert.deepEqual(store.writes[0].options, { onlyIfNew: true });
  assert.equal(store.writes[0].key, `snapshots/${SNAPSHOT_ID}.json`);

  original.query = "mutated caller payload";
  original.sources[0].title = "mutated source";
  snapshot.answer = "mutated returned snapshot";

  const persisted = await AskShare.loadSnapshot(SNAPSHOT_ID, { env, store });
  assert.equal(persisted.query, "project loupe");
  assert.match(persisted.answer, /Project Loupe/);
  assert.equal(persisted.sources[0].title, "PBJ: Example recording");

  await assert.rejects(
    AskShare.persistGeneratedSnapshot(payload({ answer: "A replacement answer." }), {
      id: SNAPSHOT_ID,
      env,
      store,
    }),
    /Could not allocate a unique Ask PB snapshot ID/,
  );
  const stillPersisted = await AskShare.loadSnapshot(SNAPSHOT_ID, { env, store });
  assert.match(stillPersisted.answer, /Project Loupe/);
  assert.doesNotMatch(stillPersisted.answer, /replacement/i);
});

test("shared HTML emits canonical Open Graph and X metadata while escaping metadata and bootstrap JSON", () => {
  const malicious = AskShare.createSnapshot(payload({
    query: `Project \"Loupe\" <img src=x onerror=alert(1)>`,
    answer: `Based on the PB archive, a safe answer closes scripts: </script><script>alert("xss")</script>. More detail follows.`,
    related_topics: [],
    sources: [source("video-a", { title: `</script><script>alert("source")</script>` })],
  }), {
    id: SNAPSHOT_ID,
    createdAt: "2026-08-06T12:00:00.000Z",
  });
  const template = "<!doctype html><html><head><title>Ask PB</title></head><body><script src=\"./search_core.js\"></script></body></html>";
  const html = AskShare.renderSnapshotHtml(template, malicious, { origin: "https://pbarchive.ai" });
  const canonical = `https://pbarchive.ai/ask/shared/${SNAPSHOT_ID}`;
  const image = `${canonical}/card.png`;

  assert.match(html, new RegExp(`<link rel="canonical" href="${canonical}">`));
  assert.match(html, /<meta property="og:title" content="Project &quot;Loupe&quot; &lt;img src=x onerror=alert\(1\)&gt;">/);
  assert.match(html, /<meta property="og:url" content="https:\/\/pbarchive\.ai\/ask\/shared\/abcdefghijklmnopqrstuv">/);
  assert.match(html, new RegExp(`<meta property="og:image" content="${image.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}">`));
  assert.match(html, /<meta property="og:image:width" content="1200">/);
  assert.match(html, /<meta property="og:image:height" content="630">/);
  assert.match(html, /<meta name="robots" content="index,follow">/);
  assert.doesNotMatch(html, /noindex/i);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image">/);
  assert.match(html, /<meta name="twitter:title" content="Project &quot;Loupe&quot; &lt;img src=x onerror=alert\(1\)&gt;">/);
  assert.match(html, new RegExp(`<meta name="twitter:image" content="${image.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}">`));

  const bootstrapMatch = html.match(/<script>window\.__PB_ASK_SNAPSHOT__=([\s\S]*?);<\/script>/);
  assert.ok(bootstrapMatch, "shared page should contain an Ask PB snapshot bootstrap");
  assert.doesNotMatch(bootstrapMatch[1], /<|>|&|<\/script>/i);
  const bootstrap = JSON.parse(bootstrapMatch[1]);
  assert.equal(bootstrap.query, malicious.query);
  assert.equal(bootstrap.answer, malicious.answer);
  assert.equal(bootstrap.sources[0].title, malicious.sources[0].title);
  assert.equal(bootstrap.share_path, `/ask/shared/${SNAPSHOT_ID}`);
});

test("preview renderer returns a valid 1200 by 630 PNG", async () => {
  const snapshot = AskShare.createSnapshot(payload(), { id: SNAPSHOT_ID });
  const png = await AskCard.renderCardPng(snapshot);

  assert.ok(Buffer.isBuffer(png));
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(png.toString("ascii", 12, 16), "IHDR");
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  assert.equal(AskCard.WIDTH, 1200);
  assert.equal(AskCard.HEIGHT, 630);
});

test("address-bar replacement and Share use the same canonical snapshot URL", () => {
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
  assert.equal(location.href, addressBarUrl);
  assert.deepEqual(calls, [{
    state: { askSnapshot: SNAPSHOT_ID },
    title: "",
    url: addressBarUrl,
  }]);
  assert.equal(PBAskShare.shareUrl(addressBarUrl, location), addressBarUrl);
  assert.equal(PBAskShare.shareUrl("", location), addressBarUrl);
});

test("robots rules explicitly allow social preview crawlers", () => {
  const robots = fs.readFileSync("public/robots.txt", "utf8");
  for (const crawler of ["Twitterbot", "facebookexternalhit", "LinkedInBot", "Slackbot", "Discordbot"]) {
    assert.match(robots, new RegExp(`User-agent: ${crawler}\\nAllow: /`, "i"));
  }
  assert.doesNotMatch(robots, /Disallow:/i);
});

test("modern Netlify wrappers serve the frozen page and PNG through Lambda-compatible handlers", async () => {
  const store = memoryStore();
  AskShare.setStoreFactoryForTests(() => store);

  try {
    await AskShare.persistGeneratedSnapshot(payload(), {
      id: SNAPSHOT_ID,
      createdAt: "2026-08-06T12:00:00.000Z",
    });
    const [{ default: pageHandler }, { default: previewHandler }] = await Promise.all([
      import("../netlify/functions/ask-page.mjs"),
      import("../netlify/functions/ask-preview.mjs"),
    ]);
    const context = { requestId: "ask-sharing-test", params: { id: SNAPSHOT_ID } };
    const route = `https://pbarchive.ai/ask/shared/${SNAPSHOT_ID}`;

    const page = await pageHandler(new Request(route), context);
    assert.equal(page.status, 200);
    assert.match(page.headers.get("content-type"), /^text\/html/);
    assert.equal(page.headers.get("x-robots-tag"), null);
    const pageHtml = await page.text();
    assert.match(pageHtml, /window\.__PB_ASK_SNAPSHOT__/);
    assert.match(pageHtml, new RegExp(`<link rel="canonical" href="${route}">`));

    const preview = await previewHandler(new Request(`${route}/card.png`), context);
    assert.equal(preview.status, 200);
    assert.equal(preview.headers.get("content-type"), "image/png");
    assert.equal(preview.headers.get("x-robots-tag"), null);
    const png = Buffer.from(await preview.arrayBuffer());
    assert.equal(png.readUInt32BE(16), 1200);
    assert.equal(png.readUInt32BE(20), 630);
  } finally {
    AskShare.setStoreFactoryForTests(null);
  }
});
