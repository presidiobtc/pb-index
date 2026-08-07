const crypto = require("crypto");

const SNAPSHOT_SCHEMA_VERSION = 1;
const SNAPSHOT_STORE_NAME = "ask-pb-shares";
const SNAPSHOT_ID_PATTERN = /^[A-Za-z0-9_-]{22}$/;
const MAX_SNAPSHOT_BYTES = 384 * 1024;
const DEFAULT_PUBLIC_ORIGIN = "https://pbarchive.ai";

let testStoreFactory = null;

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value ?? null));
}

function normalizeWhitespace(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function normalizeForMatch(value) {
  return normalizeWhitespace(value)
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function plainAnswer(value) {
  return String(value || "")
    .replace(/\r\n?/g, "\n")
    .replace(/\*\*([^*\n]+?)\*\*/g, "$1")
    .replace(/__([^_\n]+?)__/g, "$1")
    .replace(/\[(\d+)\]/g, "")
    .replace(/^\s*(?:[-+*]|\d+[.)])\s+/gm, "")
    .replace(/^Based on the PB archive,\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function clampText(value, maxLength) {
  const text = normalizeWhitespace(value);
  if (text.length <= maxLength) return { text, truncated: false };
  const clipped = text.slice(0, maxLength + 1).replace(/\s+\S*$/, "").trim();
  return { text: clipped || text.slice(0, maxLength).trim(), truncated: true };
}

function answerTeaser(answer, maxLength = 145) {
  const full = plainAnswer(answer);
  if (!full) return "Explore an answer grounded in the Presidio Bitcoin archive.";

  const sentenceEnds = [...full.matchAll(/[.!?](?=\s|$)/g)];
  let candidate = full;
  if (sentenceEnds.length) {
    const firstEnd = sentenceEnds[0].index + 1;
    const secondEnd = sentenceEnds[1]?.index + 1;
    candidate = firstEnd >= 72 || !secondEnd ? full.slice(0, firstEnd) : full.slice(0, secondEnd);
  }

  const clamped = clampText(candidate, maxLength);
  const omitted = clamped.truncated || candidate.length < full.length;
  const clean = clamped.text.replace(/(?:\.{3}|…)+$/g, "").replace(/[.!?]+$/g, "").trim();
  return omitted ? `${clean}…` : clamped.text;
}

function recordingCount(sources) {
  return new Set((Array.isArray(sources) ? sources : [])
    .map(source => normalizeWhitespace(source?.youtube_id))
    .filter(Boolean)).size;
}

function provenanceLabel(count) {
  const safeCount = Number.isFinite(Number(count)) ? Math.max(0, Math.trunc(Number(count))) : 0;
  if (!safeCount) return "Based on the PB archive";
  return `Based on ${safeCount} recording${safeCount === 1 ? "" : "s"}`;
}

function displayTitle(query, relatedTopics = []) {
  const clean = normalizeWhitespace(query);
  const normalizedQuery = normalizeForMatch(clean);
  const topics = (Array.isArray(relatedTopics) ? relatedTopics : [])
    .map(normalizeWhitespace)
    .filter(Boolean);
  const exactTopic = topics.find(topic => normalizeForMatch(topic) === normalizedQuery);
  if (exactTopic) return exactTopic;
  if (!clean) return "Ask PB";
  let title = clean.charAt(0).toLocaleUpperCase() + clean.slice(1);
  for (const topic of topics.sort((left, right) => right.length - left.length)) {
    const escaped = topic.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(^|\\W)${escaped}(?=\\W|$)`, "i");
    if (pattern.test(title)) title = title.replace(pattern, (_, prefix) => `${prefix}${topic}`);
  }
  return title;
}

function createSnapshot(payload, options = {}) {
  const id = options.id || crypto.randomBytes(16).toString("base64url");
  if (!SNAPSHOT_ID_PATTERN.test(id)) throw new Error("Invalid Ask PB snapshot ID.");

  const sources = cloneJson(Array.isArray(payload?.sources) ? payload.sources : []);
  const relatedTopics = cloneJson(Array.isArray(payload?.related_topics) ? payload.related_topics : []);
  const count = recordingCount(sources);
  const query = normalizeWhitespace(payload?.query);
  const answer = String(payload?.answer || "").trim();
  if (!query || !answer) throw new Error("Ask PB snapshots require a question and answer.");

  const snapshot = {
    schema_version: SNAPSHOT_SCHEMA_VERSION,
    id,
    created_at: options.createdAt || new Date().toISOString(),
    query,
    answer,
    sources,
    related_topics: relatedTopics,
    suggested_questions: cloneJson(Array.isArray(payload?.suggested_questions) ? payload.suggested_questions : []),
    retrieval_context: cloneJson(payload?.retrieval_context && typeof payload.retrieval_context === "object"
      ? payload.retrieval_context
      : {}),
    mode: normalizeWhitespace(payload?.mode) || "retrieval_fallback",
    card: {
      title: displayTitle(query, relatedTopics),
      teaser: answerTeaser(answer),
      recording_count: count,
      provenance: provenanceLabel(count),
    },
  };
  if (Buffer.byteLength(JSON.stringify(snapshot), "utf8") > MAX_SNAPSHOT_BYTES) {
    throw new Error("Ask PB snapshot exceeds the storage limit.");
  }
  return snapshot;
}

function isSnapshotId(value) {
  return SNAPSHOT_ID_PATTERN.test(String(value || ""));
}

function snapshotPath(id) {
  if (!isSnapshotId(id)) throw new Error("Invalid Ask PB snapshot ID.");
  return `/ask/shared/${id}`;
}

function snapshotKey(id) {
  if (!isSnapshotId(id)) throw new Error("Invalid Ask PB snapshot ID.");
  return `snapshots/${id}.json`;
}

function snapshotsEnabled(env = process.env) {
  if (/^(?:1|true|yes|on)$/i.test(String(env.ASK_SNAPSHOTS_DISABLED || ""))) return false;
  if (testStoreFactory) return true;
  return Boolean(
    globalThis.netlifyBlobsContext
    || env.NETLIFY
    || env.NETLIFY_DEV
    || env.NETLIFY_BLOBS_CONTEXT
    || env.SITE_ID
    || /^(?:1|true|yes|on)$/i.test(String(env.ASK_SNAPSHOTS_FORCE || "")),
  );
}

function snapshotStore(options = {}) {
  if (options.store) return options.store;
  if (testStoreFactory) return testStoreFactory();
  const { getStore } = require("@netlify/blobs");
  return getStore({ name: SNAPSHOT_STORE_NAME, consistency: "strong" });
}

async function persistGeneratedSnapshot(payload, options = {}) {
  const env = options.env || process.env;
  if (!options.store && !snapshotsEnabled(env)) return null;
  const store = snapshotStore(options);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const snapshot = createSnapshot(payload, {
      id: options.id,
      createdAt: options.createdAt,
    });
    const result = await store.setJSON(snapshotKey(snapshot.id), snapshot, { onlyIfNew: true });
    if (result?.modified !== false) return snapshot;
    if (options.id) break;
  }
  throw new Error("Could not allocate a unique Ask PB snapshot ID.");
}

async function loadSnapshot(id, options = {}) {
  if (!isSnapshotId(id)) return null;
  const store = snapshotStore(options);
  const snapshot = await store.get(snapshotKey(id), { type: "json", consistency: "strong" });
  if (!snapshot || snapshot.schema_version !== SNAPSHOT_SCHEMA_VERSION || snapshot.id !== id) return null;
  return snapshot;
}

function trustedOrigin(env = process.env) {
  const configured = normalizeWhitespace(env.ASK_PUBLIC_ORIGIN);
  if (configured) {
    try {
      const url = new URL(configured);
      if (new Set(["http:", "https:"]).has(url.protocol)) return url.origin;
    } catch {}
  }

  if (normalizeWhitespace(env.CONTEXT).toLowerCase() !== "production") {
    for (const candidate of [env.DEPLOY_PRIME_URL, env.URL]) {
      try {
        const url = new URL(normalizeWhitespace(candidate));
        if (new Set(["http:", "https:"]).has(url.protocol)) return url.origin;
      } catch {}
    }
  }
  return DEFAULT_PUBLIC_ORIGIN;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;",
  })[character]);
}

function safeJson(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function snapshotForClient(snapshot) {
  return {
    ...cloneJson(snapshot),
    share_id: snapshot.id,
    share_path: snapshotPath(snapshot.id),
    recording_count: snapshot.card?.recording_count || 0,
    answer_teaser: snapshot.card?.teaser || "",
  };
}

function renderSnapshotHtml(template, snapshot, options = {}) {
  const origin = options.origin || trustedOrigin(options.env || process.env);
  const canonical = `${origin}${snapshotPath(snapshot.id)}`;
  const image = `${canonical}/card.png`;
  const title = snapshot.card?.title || displayTitle(snapshot.query, snapshot.related_topics);
  const teaser = snapshot.card?.teaser || answerTeaser(snapshot.answer);
  const provenance = snapshot.card?.provenance || provenanceLabel(snapshot.card?.recording_count);
  const pageTitle = `${title} — Ask PB | PB Media Archive`;
  const imageAlt = `Ask PB: ${title}. ${provenance}.`;
  const metadata = `
  <base href="/">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta name="description" content="${escapeHtml(teaser)}">
  <meta name="robots" content="index,follow">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="PB Media Archive">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(teaser)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:image" content="${escapeHtml(image)}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escapeHtml(imageAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(teaser)}">
  <meta name="twitter:image" content="${escapeHtml(image)}">
  <meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}">`;
  const bootstrap = `<script>window.__PB_ASK_SNAPSHOT__=${safeJson(snapshotForClient(snapshot))};</script>\n  `;

  let html = String(template || "");
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(pageTitle)}</title>`);
  html = html.replace(/<\/head>/i, `${metadata}\n</head>`);
  html = html.replace(/(<script\s+src=["']\.\/search_core\.js["'][^>]*><\/script>)/i, `${bootstrap}$1`);
  return html;
}

function setStoreFactoryForTests(factory) {
  testStoreFactory = factory || null;
}

module.exports = {
  DEFAULT_PUBLIC_ORIGIN,
  MAX_SNAPSHOT_BYTES,
  SNAPSHOT_ID_PATTERN,
  SNAPSHOT_SCHEMA_VERSION,
  SNAPSHOT_STORE_NAME,
  answerTeaser,
  createSnapshot,
  displayTitle,
  escapeHtml,
  isSnapshotId,
  loadSnapshot,
  persistGeneratedSnapshot,
  plainAnswer,
  provenanceLabel,
  recordingCount,
  renderSnapshotHtml,
  safeJson,
  setStoreFactoryForTests,
  snapshotForClient,
  snapshotKey,
  snapshotPath,
  snapshotsEnabled,
  trustedOrigin,
};
