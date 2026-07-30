const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const AskRender = require("../public/ask_render.js");

test("Ask PB renders Markdown bullets and bold lead-ins as semantic HTML", () => {
  const html = AskRender.renderAnswer([
    "Based on the PB archive, two effects stand out [1].",
    "",
    "- **Pressure on mining capacity:** Miners may move toward AI compute [2].",
    "- **A shift toward stranded power:** Mining may relocate [3].",
  ].join("\n"), 3);

  assert.match(html, /^<p>Based on the PB archive,/);
  assert.match(html, /<ul><li><strong>Pressure on mining capacity:<\/strong>/);
  assert.match(html, /<li><strong>A shift toward stranded power:<\/strong>/);
  assert.match(html, /class="citation-link"[^>]+>\[2\]<\/a>/);
  assert.doesNotMatch(html, /\*\*/);
});

test("Ask PB gives paragraphs and lists readable block structure", () => {
  const html = AskRender.renderAnswer("First paragraph.\nContinued sentence.\n\n1. First item\n2. Second item\n\nFinal paragraph.", 0);

  assert.equal(
    html,
    "<p>First paragraph. Continued sentence.</p><ol><li>First item</li><li>Second item</li></ol><p>Final paragraph.</p>",
  );
});

test("Ask PB answer rendering escapes HTML and strips malformed emphasis markers", () => {
  const html = AskRender.renderAnswer("<img src=x onerror=alert(1)> **unfinished", 0);

  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.doesNotMatch(html, /<img|\*\*/);
});

test("Ask PB links only citations that correspond to visible sources", () => {
  const html = AskRender.renderAnswer("Supported [1], invalid [4], and zero [0].", 2);

  assert.match(html, /href="#source-1"/);
  assert.match(html, /invalid \[4\]/);
  assert.doesNotMatch(html, /source-4|\[0\]/);
});

test("Ask PB separates adjacent citations in rendered and copied answers", () => {
  const html = AskRender.renderAnswer("A claim supported by two sources [1][2].", 2);
  const text = AskRender.toPlainText("A claim supported by two sources [1][2].");

  assert.match(html, /data-source-ref="1"[^>]*>\[1\]<\/a> <a class="citation-link"/);
  assert.equal(text, "A claim supported by two sources [1] [2].");
});

test("Ask PB copy and share text contains clean plain-text formatting", () => {
  const text = AskRender.toPlainText("Based on the archive:\n\n- **First point:** Evidence [1].\n- **Second point:** More evidence [2].");

  assert.equal(text, "Based on the archive:\n\n• First point: Evidence [1].\n• Second point: More evidence [2].");
  assert.doesNotMatch(text, /\*\*/);
});

test("Ask PB page loads and uses the restricted answer renderer", () => {
  const page = fs.readFileSync(path.join(__dirname, "..", "public", "ask.html"), "utf8");

  assert.match(page, /<script src="\.\/ask_render\.js"><\/script>/);
  assert.match(page, /PBAskRender\.renderAnswer\(currentAnswerText, sourceCount\)/);
  assert.match(page, /PBAskRender\.toPlainText\(currentAnswerText\)/);
  assert.match(page, /id="answer-title">Answer<\/h2>/);
  assert.match(page, /askPanel\.classList\.add\("has-result"\)/);
  assert.doesNotMatch(page, /white-space:\s*pre-wrap/);
});
