"use strict";

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

function validSnapshotShape(snapshot, expectedId) {
  if (!snapshot || Array.isArray(snapshot) || typeof snapshot !== "object") return false;
  if (snapshot.schema_version !== SNAPSHOT_SCHEMA_VERSION || snapshot.id !== expectedId) return false;
  if (typeof snapshot.query !== "string" || !snapshot.query.trim() || snapshot.query.length > 8000) return false;
  if (typeof snapshot.answer !== "string" || !snapshot.answer.trim() || snapshot.answer.length > 200000) return false;
  if (!Array.isArray(snapshot.sources) || snapshot.sources.length > 20 ||
      snapshot.sources.some(source => !source || Array.isArray(source) || typeof source !== "object")) return false;
  if (!Array.isArray(snapshot.related_topics) || snapshot.related_topics.length > 6 ||
      snapshot.related_topics.some(topic => typeof topic !== "string")) return false;
  if (!Array.isArray(snapshot.suggested_questions) || snapshot.suggested_questions.length > 3 ||
      snapshot.suggested_questions.some(question => typeof question !== "string")) return false;
  if (typeof snapshot.mode !== "string") return false;
  return Buffer.byteLength(JSON.stringify(snapshot), "utf8") <= MAX_SNAPSHOT_BYTES;
}

function createSnapshot(payload, options = {}) {
  const id = options.id || crypto.randomBytes(16).toString("base64url");
  if (!SNAPSHOT_ID_PATTERN.test(id)) throw new Error("Invalid Ask PB snapshot ID.");

  const snapshot = {
    schema_version: SNAPSHOT_SCHEMA_VERSION,
    id,
    created_at: options.createdAt || new Date().toISOString(),
    query: normalizeWhitespace(payload?.query),
    answer: String(payload?.answer || "").trim(),
    sources: cloneJson(Array.isArray(payload?.sources) ? payload.sources : []),
    related_topics: cloneJson(Array.isArray(payload?.related_topics) ? payload.related_topics : []),
    suggested_questions: cloneJson(Array.isArray(payload?.suggested_questions) ? payload.suggested_questions : []),
    mode: normalizeWhitespace(payload?.mode) || "retrieval_fallback",
  };
  if (!validSnapshotShape(snapshot, id)) {
    throw new Error("Ask PB snapshot has an invalid shape or exceeds the storage limit.");
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
  const stored = await store.get(snapshotKey(id), { type: "json", consistency: "strong" });
  if (!validSnapshotShape(stored, id)) return null;
  return {
    schema_version: stored.schema_version,
    id: stored.id,
    created_at: stored.created_at,
    query: stored.query,
    answer: stored.answer,
    sources: cloneJson(stored.sources),
    related_topics: cloneJson(stored.related_topics),
    suggested_questions: cloneJson(stored.suggested_questions),
    mode: stored.mode,
  };
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
    query: snapshot.query,
    answer: snapshot.answer,
    sources: cloneJson(snapshot.sources),
    related_topics: cloneJson(snapshot.related_topics),
    suggested_questions: cloneJson(snapshot.suggested_questions),
    mode: snapshot.mode,
    share_id: snapshot.id,
    share_path: snapshotPath(snapshot.id),
  };
}

function renderSnapshotHtml(template, snapshot, options = {}) {
  const origin = options.origin || trustedOrigin(options.env || process.env);
  const canonical = `${origin}${snapshotPath(snapshot.id)}`;
  const titleQuestion = normalizeWhitespace(snapshot.query).slice(0, 120);
  const pageTitle = `${titleQuestion} — Ask PB | PB Media Archive`;
  const metadata = `
  <base href="/">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta name="robots" content="noindex,nofollow">`;
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
  createSnapshot,
  escapeHtml,
  isSnapshotId,
  loadSnapshot,
  persistGeneratedSnapshot,
  renderSnapshotHtml,
  safeJson,
  setStoreFactoryForTests,
  snapshotForClient,
  snapshotKey,
  snapshotPath,
  snapshotsEnabled,
  trustedOrigin,
  validSnapshotShape,
};
