(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.PBAskRender = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" }[character]
    ));
  }

  function normalizeCitationSpacing(value) {
    return String(value ?? "").replace(/(\[\d+\])[ \t]*(?=\[\d+\])/g, "$1 ");
  }

  function renderInline(value, sourceCount) {
    let html = escapeHtml(normalizeCitationSpacing(value));

    // The answer is untrusted model output. Add only this deliberately small,
    // controlled subset of inline markup after escaping the source text.
    html = html
      .replace(/\*\*([^*\n]+?)\*\*/g, "<strong>$1</strong>")
      .replace(/__([^_\n]+?)__/g, "<strong>$1</strong>")
      .replace(/\s*\[0\]/g, "")
      .replace(/\[(\d+)\]/g, (match, number) => {
        const index = Number(number);
        if (!Number.isInteger(index) || index < 1 || index > sourceCount) return match;
        return `<a class="citation-link" href="#source-${index}" data-source-ref="${index}" aria-label="Jump to source ${index}">[${index}]</a>`;
      });

    // A malformed or unmatched emphasis marker should never leak into the UI.
    return html.replace(/\*\*/g, "").replace(/__/g, "");
  }

  function renderAnswer(value, sourceCount = 0) {
    const lines = String(value ?? "").replace(/\r\n?/g, "\n").split("\n");
    const blocks = [];
    let paragraph = [];
    let listType = null;
    let listItems = [];

    function flushParagraph() {
      if (!paragraph.length) return;
      blocks.push(`<p>${renderInline(paragraph.join(" "), sourceCount)}</p>`);
      paragraph = [];
    }

    function flushList() {
      if (!listType || !listItems.length) return;
      blocks.push(`<${listType}>${listItems.map(item => `<li>${renderInline(item, sourceCount)}</li>`).join("")}</${listType}>`);
      listType = null;
      listItems = [];
    }

    lines.forEach((line, lineIndex) => {
      const unordered = line.match(/^\s{0,3}[-+*]\s+(.+)$/);
      const ordered = line.match(/^\s{0,3}\d+[.)]\s+(.+)$/);
      const nextType = unordered ? "ul" : ordered ? "ol" : null;
      const item = unordered?.[1] || ordered?.[1];

      if (nextType) {
        flushParagraph();
        if (listType && listType !== nextType) flushList();
        listType = nextType;
        listItems.push(item.trim());
        return;
      }

      if (!line.trim()) {
        flushParagraph();
        const nextLine = lines.slice(lineIndex + 1).find(candidate => candidate.trim());
        const nextIsSameList = listType === "ul"
          ? /^\s{0,3}[-+*]\s+/.test(nextLine || "")
          : listType === "ol" && /^\s{0,3}\d+[.)]\s+/.test(nextLine || "");
        if (!nextIsSameList) flushList();
        return;
      }

      if (listType && /^\s{2,}\S/.test(line) && listItems.length) {
        listItems[listItems.length - 1] += ` ${line.trim()}`;
        return;
      }

      flushList();
      paragraph.push(line.trim());
    });

    flushParagraph();
    flushList();
    return blocks.join("");
  }

  function toPlainText(value) {
    return normalizeCitationSpacing(value)
      .replace(/\r\n?/g, "\n")
      .replace(/\*\*([^*\n]+?)\*\*/g, "$1")
      .replace(/__([^_\n]+?)__/g, "$1")
      .replace(/\*\*/g, "")
      .replace(/__/g, "")
      .split("\n")
      .map(line => line.replace(/^\s{0,3}[-+*]\s+/, "• "))
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  return { escapeHtml, renderAnswer, renderInline, toPlainText };
});
