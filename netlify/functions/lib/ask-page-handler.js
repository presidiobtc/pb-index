"use strict";

const fs = require("fs");
const path = require("path");
const {
  isSnapshotId,
  loadSnapshot,
  renderSnapshotHtml,
  trustedOrigin,
} = require("./ask-share.js");

function html(statusCode, body, headers = {}) {
  return {
    statusCode,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
      "x-robots-tag": "noindex, nofollow",
      ...headers,
    },
    body,
  };
}

function askTemplate() {
  const candidates = [
    path.join(process.cwd(), "public", "ask.html"),
    path.join(__dirname, "..", "..", "..", "public", "ask.html"),
    path.join(__dirname, "ask.html"),
  ];
  const file = candidates.find(candidate => fs.existsSync(candidate));
  if (!file) throw new Error("Ask PB page template is unavailable.");
  return fs.readFileSync(file, "utf8");
}

function notFound() {
  return html(404, `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Shared answer not found | PB Media Archive</title></head>
<body style="margin:0;background:#fbf8f2;color:#0d4b34;font:18px/1.5 Georgia,serif;display:grid;min-height:100vh;place-items:center">
<main style="max-width:620px;padding:40px"><p style="font:600 13px/1.2 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;letter-spacing:.16em">PB MEDIA ARCHIVE</p>
<h1 style="font-size:42px;font-weight:400">Shared answer not found</h1><p>This Ask PB link is invalid or no longer available.</p><p><a href="/ask.html" style="color:#0d4b34">Ask the archive a question</a></p></main></body></html>`, {
    "cache-control": "no-store",
  });
}

exports.handler = async function handler(event) {
  if (!new Set(["GET", "HEAD"]).has(event?.httpMethod)) {
    return html(405, "Method not allowed.", {
      "cache-control": "no-store",
      allow: "GET, HEAD",
    });
  }

  const id = event?.queryStringParameters?.id;
  if (!isSnapshotId(id)) return notFound();

  try {
    const snapshot = await loadSnapshot(id);
    if (!snapshot) return notFound();
    const body = renderSnapshotHtml(askTemplate(), snapshot, { origin: trustedOrigin() });
    return html(200, event.httpMethod === "HEAD" ? "" : body, {
      "cache-control": "public, max-age=300, stale-while-revalidate=86400",
      "netlify-cdn-cache-control": "public, durable, max-age=86400, stale-while-revalidate=604800",
    });
  } catch (error) {
    console.error("Ask PB shared page failed", error);
    return html(503, "Ask PB shared answer is temporarily unavailable.", {
      "cache-control": "no-store",
    });
  }
};

exports._test = { askTemplate, notFound };
