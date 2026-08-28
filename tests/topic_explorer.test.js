const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const TopicExplorer = require("../public/topic_explorer.js");

const ROOT = path.resolve(__dirname, "..");

test("topic shares accept percentage artifacts without turning 1% into 100%", () => {
  assert.equal(TopicExplorer.normalizeShare(25, 25, 100), 0.25);
  assert.equal(TopicExplorer.normalizeShare(0.25, 25, 100), 0.25);
  assert.equal(TopicExplorer.normalizeShare(1, 1, 100), 0.01);
  assert.equal(TopicExplorer.normalizeShare(1, 100, 100), 1);
  assert.equal(TopicExplorer.formatExactPercent(0.2504), "25.04%");
});

test("subtopic presentation collapses only the display tail and preserves its data", () => {
  const topics = Array.from({ length: 10 }, (_, index) => ({
    id: `topic-${index}`,
    name: `Topic ${index}`,
    count: 10 - index,
    share_of_cluster: (10 - index) / 55,
    share_overall: (10 - index) / 100,
    episodes: [{
      youtube_id: `video-${index}`,
      title: `Episode ${index}`,
      date: `2025-01-${String(index + 1).padStart(2, "0")}`,
      url: `https://www.youtube.com/watch?v=video-${index}`,
      mention_count: 10 - index,
    }],
  }));

  const displayed = TopicExplorer.collapseTopics(topics, 7);
  const tail = displayed.at(-1);

  assert.equal(displayed.length, 8);
  assert.equal(tail.id, TopicExplorer.OTHER_TOPIC_ID);
  assert.equal(tail.topic_count, 3);
  assert.equal(tail.count, 6);
  assert.equal(tail.episodes.length, 3);
  assert.equal(topics.length, 10, "underlying topic data remains intact");
});

test("the checked-in topic artifact normalizes to a complete reusable dataset", () => {
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, "public", "topic_stats.json"), "utf8"));
  const diagnostics = JSON.parse(
    fs.readFileSync(path.join(ROOT, "public", "topic_stats_diagnostics.json"), "utf8"),
  );
  const data = TopicExplorer.normalizeStats(raw);

  assert.equal(data.metadata.episode_count, diagnostics.included_episodes.length);
  assert.ok(data.metadata.episode_count > 0);
  assert.equal(data.metadata.display_episode_count, data.metadata.episode_count + 2);
  assert.equal(data.metadata.display_episode_count, 79);
  assert.equal(data.metadata.expected_episode_count, 79);
  assert.notEqual(
    data.metadata.episode_count,
    data.metadata.expected_episode_count,
    "the analyzed count and the separate reference total must not be conflated",
  );
  assert.match(data.metadata.metric_name, /transcript/i);
  assert.ok(data.quarters.length > 0);
  assert.deepEqual(
    data.overall.clusters.map(cluster => cluster.name),
    [
      "AI & Agents",
      "Payments, Lightning & Stablecoins",
      "Markets, Investing & Lending",
      "Custody, Wallets & Privacy",
      "Bitcoin Protocol & Security",
      "Mining, Energy & Compute",
      "Products, Builders & Open Source",
      "Policy, Geopolitics & Society",
    ],
  );
  assert.ok(data.overall.clusters.every(cluster => data.clusters[cluster.id]));
  assert.ok(data.overall.clusters.every(cluster => cluster.share >= 0 && cluster.share <= 1));
  assert.ok(Math.abs(data.overall.clusters.reduce((sum, cluster) => sum + cluster.share, 0) - 1) < 1e-9);
  assert.ok(data.quarters.every((quarter, index) => (
    index === 0 || quarter.id > data.quarters[index - 1].id
  )));
});

test("the mounted explorer renders both Overview and the full quarterly Trends view", async () => {
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, "public", "topic_stats.json"), "utf8"));
  const classes = new Set();
  const root = {
    dataset: {},
    innerHTML: "",
    classList: {
      add: value => classes.add(value),
      remove: value => classes.delete(value),
    },
    addEventListener() {},
    removeEventListener() {},
    setAttribute() {},
    removeAttribute() {},
    contains: () => true,
    querySelector: () => null,
    querySelectorAll: () => [],
  };

  const instance = TopicExplorer.mount(root, raw);
  await instance.ready;

  assert.ok(classes.has("pbj-topic-explorer"));
  assert.match(root.innerHTML, />PBJ Topic Explorer</);
  assert.match(root.innerHTML, />PBJ topic mix</);
  assert.match(root.innerHTML, /<strong>Based on 79 full PBJ episodes<\/strong>/);
  assert.doesNotMatch(
    root.innerHTML,
    new RegExp(`${raw.metadata.episode_count} full PBJ episodes`),
  );
  assert.match(root.innerHTML, />Headline view</);
  assert.doesNotMatch(root.innerHTML, /Bitcoin \/ AI headline view/);
  assert.match(root.innerHTML, /pbj-topic-explorer__subtopic-donut/);
  assert.match(root.innerHTML, /data-action="select-topic"/);
  assert.doesNotMatch(root.innerHTML, /How this is measured/);
  assert.doesNotMatch(root.innerHTML, /curated topic annotations/i);

  const secondCluster = instance.data.overall.clusters[1];
  instance.handleAction({
    dataset: {
      action: "select-cluster",
      clusterId: secondCluster.id,
      focusKey: "",
    },
  });
  assert.equal(instance.state.selectedClusterId, secondCluster.id);
  assert.ok(
    root.innerHTML.includes(`>${secondCluster.name.replaceAll("&", "&amp;")}<`),
    "the selected cluster heading is rendered",
  );

  const firstTopic = instance.visibleTopics()[0];
  assert.ok(firstTopic, "the selected cluster exposes a subtopic breakdown");
  instance.handleAction({
    dataset: {
      action: "select-topic",
      topicId: firstTopic.id,
      focusKey: "",
    },
  });
  assert.equal(instance.state.selectedTopicId, firstTopic.id);
  assert.match(root.innerHTML, /pbj-topic-explorer__episode-list/);

  instance.handleAction({ dataset: { action: "set-view", view: "trends", focusKey: "" } });
  assert.match(root.innerHTML, />Quarterly topic mix</);
  assert.match(root.innerHTML, new RegExp(`>${raw.quarters[0].label}<`));
  assert.match(root.innerHTML, new RegExp(`>${raw.quarters.at(-1).label}<`));
  assert.equal(
    (root.innerHTML.match(/pbj-topic-explorer__quarter-row/g) || []).length,
    raw.quarters.length,
  );
  assert.match(root.innerHTML, /data-action="toggle-trend-cluster"/);
  assert.match(root.innerHTML, /data-action="isolate-trend-cluster"/);

  instance.destroy();
});

test("Topics keeps Featured Now above every view while mounting the modular explorer", () => {
  const page = fs.readFileSync(path.join(ROOT, "public", "topics", "index.html"), "utf8");
  const source = fs.readFileSync(path.join(ROOT, "public", "topic_explorer.js"), "utf8");
  const runAll = fs.readFileSync(path.join(ROOT, "scripts", "run_all.py"), "utf8");
  const netlify = fs.readFileSync(path.join(ROOT, "netlify.toml"), "utf8");

  assert.match(page, /href="\.\/topic_explorer\.css"/);
  assert.match(page, /src="\.\/topic_explorer\.js"/);
  assert.match(page, /TopicExplorer\.mount\("#pbj-topic-explorer", "\.\/topic_stats\.json"\)/);
  assert.ok(page.indexOf('id="btn-visualization"') < page.indexOf('id="btn-alpha"'));
  assert.match(page, /id="btn-visualization"[^>]*class="sort-btn active"|class="sort-btn active"[^>]*id="btn-visualization"/);
  assert.match(page, /id="btn-visualization"[^>]*aria-selected="true"/s);
  assert.match(page, /class="sort-bar" role="tablist"/);
  assert.match(page, /id="visualization-panel" role="tabpanel"/);
  assert.match(page, /id="topic-browser-panel" role="tabpanel"[^>]*hidden/);
  assert.match(page, /let currentSort = "visualization"/);
  assert.match(page, /const modes = \["visualization", "alpha", "map", "date", "series"\]/);
  assert.equal((page.match(/id="featured-now"/g) || []).length, 1);
  assert.ok(page.indexOf('id="featured-now"') < page.indexOf('class="sort-bar"'));
  assert.ok(page.indexOf('id="featured-now"') < page.indexOf('id="visualization-panel"'));
  assert.ok(page.indexOf('id="featured-now"') < page.indexOf('id="topic-browser-panel"'));
  assert.ok(page.indexOf('id="visualization-panel"') < page.indexOf('id="pbj-topic-explorer"'));
  assert.doesNotMatch(page, /id="pbj-topic-explorer" aria-label=/);
  assert.match(source, /role="tab"/);
  assert.match(source, /role="button" tabindex="0"/);
  assert.match(source, /aria-pressed="\$\{cluster\.id === selected\?\.id\}"/);
  assert.match(source, /<title>\$\{escapeHtml\(tooltip\)\}<\/title>/);
  assert.match(source, /Other subtopics/);
  assert.match(source, /pbj-topic-explorer__subtopic-donut/);
  assert.match(source, /data-action="select-topic"/);
  assert.match(source, /transcript topic matches/);
  assert.doesNotMatch(source, /renderMethodology/);
  assert.doesNotMatch(source, />How this is measured</);
  assert.doesNotMatch(source, /curated topic annotations/);
  assert.doesNotMatch(source, /\b(?:d3|chart\.js|highcharts)\b/i);
  assert.match(runAll, /"build_topic_stats\.py"/);
  assert.match(netlify, /python3 scripts\/build_topic_stats\.py/);
});

test("invalid topic data fails inside the explorer without replacing the archive", async () => {
  const root = {
    dataset: {},
    innerHTML: "",
    classList: { add() {}, remove() {} },
    addEventListener() {},
    removeEventListener() {},
    setAttribute() {},
    removeAttribute() {},
    contains: () => true,
    querySelector: () => null,
    querySelectorAll: () => [],
  };

  const instance = TopicExplorer.mount(root, {});
  await instance.ready;

  assert.match(root.innerHTML, /PBJ Topic Explorer is temporarily unavailable/);
  assert.match(root.innerHTML, /topic archive remains available in the browsing tabs above/);
  instance.destroy();
});

test("episode links allow web destinations and reject executable protocols", () => {
  assert.equal(
    TopicExplorer.safeUrl("https://www.youtube.com/watch?v=abc"),
    "https://www.youtube.com/watch?v=abc",
  );
  assert.equal(TopicExplorer.safeUrl("javascript:alert(1)"), "");
  assert.equal(TopicExplorer.safeUrl("data:text/html,bad"), "");
});
