"use strict";

const { isSnapshotId, loadSnapshot } = require("./ask-share.js");
const { HEIGHT, WIDTH, renderCardPng } = require("./ask-card.js");

function response(statusCode, body = "", headers = {}, isBase64Encoded = false) {
  return {
    statusCode,
    headers: {
      "x-content-type-options": "nosniff",
      ...headers,
    },
    body,
    isBase64Encoded,
  };
}

function notFound() {
  return response(404, "Preview card not found.", {
    "content-type": "text/plain; charset=utf-8",
    "cache-control": "no-store",
    "x-robots-tag": "noindex",
  });
}

exports.handler = async function handler(event) {
  if (!new Set(["GET", "HEAD"]).has(event?.httpMethod)) {
    return response(405, "Method not allowed.", {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      allow: "GET, HEAD",
    });
  }

  const id = event?.queryStringParameters?.id;
  if (!isSnapshotId(id)) return notFound();

  try {
    const snapshot = await loadSnapshot(id);
    if (!snapshot) return notFound();
    const png = await renderCardPng(snapshot);
    return response(200, event.httpMethod === "HEAD" ? "" : png.toString("base64"), {
      "content-type": "image/png",
      "content-length": String(png.length),
      "cache-control": "public, max-age=31536000, immutable",
      "netlify-cdn-cache-control": "public, durable, max-age=31536000, immutable",
      "content-disposition": `inline; filename="ask-pb-${id}.png"`,
      "x-robots-tag": "noindex",
    }, event.httpMethod !== "HEAD");
  } catch (error) {
    console.error("Ask PB preview card failed", error);
    return response(503, "Preview card is temporarily unavailable.", {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex",
    });
  }
};

exports._test = { HEIGHT, WIDTH, notFound };
