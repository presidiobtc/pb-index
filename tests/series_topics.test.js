const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");

function loadScriptConstants(relativePath, names) {
  const source = fs.readFileSync(path.join(ROOT, relativePath), "utf8");
  const context = {};
  vm.createContext(context);
  vm.runInContext(
    `${source}\n;globalThis.__testExports = { ${names.join(", ")} };`,
    context,
    { filename: relativePath }
  );
  return context.__testExports;
}

test("Goose GDK Night follows the quantum readiness report in series order", () => {
  const { SERIES_ALL_ORDER } = loadScriptConstants("public/series_config.js", [
    "SERIES_ALL_ORDER",
  ]);
  const reportIndex = SERIES_ALL_ORDER.indexOf("bitcoin-quantum-readiness-report");

  assert.notEqual(reportIndex, -1);
  assert.equal(SERIES_ALL_ORDER[reportIndex + 1], "goose-gdk");
});

test("Goose GDK Night uses its event video as its topic scope", () => {
  const { SERIES_DEFS } = loadScriptConstants("public/series_config.js", [
    "SERIES_DEFS",
  ]);
  const goose = SERIES_DEFS.find(def => def.id === "goose-gdk");

  assert.ok(goose);
  assert.deepEqual(Array.from(goose.topicVideoIds), ["m7NGzb8m0nk"]);
});

test("Goose event video has indexed topic definitions to render", () => {
  const { TOPIC_DEFS } = loadScriptConstants("public/topics_config.js", [
    "TOPIC_DEFS",
  ]);
  const topicNames = TOPIC_DEFS
    .filter(def => def.picks?.some(pick => pick.youtube_id === "m7NGzb8m0nk"))
    .map(def => def.name);

  assert.ok(topicNames.length >= 10);
  assert.ok(topicNames.includes("Goose"));
  assert.ok(topicNames.includes("Goose Development Kit"));
  assert.ok(topicNames.includes("Agent Client Protocol"));
});

test("By series renderer supports video-scoped topic cards", () => {
  const topicsPage = fs.readFileSync(
    path.join(ROOT, "public/topics/index.html"),
    "utf8"
  );

  assert.match(topicsPage, /function renderTopicList\(defs, seriesName, videoIds = \[\]\)/);
  assert.match(topicsPage, /def\.topicVideoIds/);
  assert.match(topicsPage, /videoIsInScope\(p\.youtube_id\)/);
});
