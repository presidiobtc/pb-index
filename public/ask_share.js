(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.PBAskShare = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function snapshotPath(data) {
    if (/^\/ask\/shared\/[A-Za-z0-9_-]{22}$/.test(String(data?.share_path || ""))) {
      return data.share_path;
    }
    if (/^[A-Za-z0-9_-]{22}$/.test(String(data?.share_id || ""))) {
      return `/ask/shared/${data.share_id}`;
    }
    return "";
  }

  function canonicalUrl(data, origin) {
    const path = snapshotPath(data);
    if (!path) return "";
    const url = new URL(path, origin);
    url.hash = "";
    return url.href;
  }

  function applySnapshotUrl(data, environment = {}) {
    const location = environment.location || globalThis.location;
    const history = environment.history || globalThis.history;
    if (!location || !history?.replaceState) return "";
    const url = canonicalUrl(data, location.origin);
    if (!url) return "";
    history.replaceState({ askSnapshot: data.share_id || null }, "", url);
    return url;
  }

  function shareUrl(currentShareUrl, location = globalThis.location) {
    if (currentShareUrl) return String(currentShareUrl).split("#")[0];
    return String(location?.href || "").split("#")[0];
  }

  return { applySnapshotUrl, canonicalUrl, shareUrl, snapshotPath };
});
