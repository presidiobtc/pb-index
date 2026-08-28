(function initTopicExplorer(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.TopicExplorer = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createTopicExplorer() {
  "use strict";

  const PALETTE = [
    "#1f4d2a",
    "#c96442",
    "#365f7d",
    "#9a6b27",
    "#675580",
    "#28756d",
    "#8d4b55",
    "#66713e",
    "#52606d",
    "#a55f32",
    "#496d48",
    "#795b3c",
  ];
  const HEADLINE_COLORS = {
    bitcoin: "#c96442",
    ai: "#1f4d2a",
    other: "#365f7d",
  };
  const SUBTOPIC_PALETTE = [
    "#365f7d",
    "#c96442",
    "#28756d",
    "#9a6b27",
    "#675580",
    "#8d4b55",
    "#66713e",
    "#52606d",
  ];
  const OTHER_TOPIC_ID = "__other-subtopics__";
  const INSTANCE_KEY = "__pbjTopicExplorerInstance";
  const DEFAULT_METHOD = "Percentages show each category's share of transcript topic matches. They do not estimate airtime.";
  let instanceCount = 0;

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" }[character]
    ));
  }

  function slugify(value) {
    return String(value ?? "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "item";
  }

  function finiteNumber(value, fallback = 0) {
    const number = typeof value === "number" ? value : Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function nonnegativeNumber(value, fallback = 0) {
    return Math.max(0, finiteNumber(value, fallback));
  }

  function clamp(value, minimum = 0, maximum = 1) {
    return Math.min(maximum, Math.max(minimum, finiteNumber(value, minimum)));
  }

  function normalizeShare(value, count = 0, total = 0) {
    const parsed = finiteNumber(value, Number.NaN);
    const derived = total > 0 ? clamp(nonnegativeNumber(count) / total) : 0;
    if (!Number.isFinite(parsed)) return derived;
    if (total > 0 && parsed >= 0 && parsed <= 100) {
      const fractionCandidate = clamp(parsed);
      const percentageCandidate = clamp(parsed / 100);
      return Math.abs(percentageCandidate - derived) <= Math.abs(fractionCandidate - derived)
        ? percentageCandidate
        : fractionCandidate;
    }
    return clamp(parsed > 1 ? parsed / 100 : parsed);
  }

  function formatNumber(value) {
    return Math.round(nonnegativeNumber(value)).toLocaleString("en-US");
  }

  function formatPercent(value, digits = 1) {
    const percent = clamp(value) * 100;
    if (percent > 0 && percent < 0.1) return "<0.1%";
    return `${percent.toFixed(digits)}%`;
  }

  function formatExactPercent(value) {
    const percent = clamp(value) * 100;
    if (percent > 0 && percent < 0.01) return "<0.01%";
    return `${percent.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1")}%`;
  }

  function metricLabel(metadata, count = 2) {
    const plural = String(metadata?.metric_label || "transcript topic matches").trim()
      || "transcript topic matches";
    if (count !== 1) return plural;
    const suppliedSingular = String(metadata?.metric_label_singular || "").trim();
    if (suppliedSingular) return suppliedSingular;
    return plural
      .replace(/\bmatches$/i, "match")
      .replace(/\boccurrences$/i, "occurrence")
      .replace(/\bmentions$/i, "mention")
      .replace(/\bannotations$/i, "annotation");
  }

  function formatDate(value) {
    if (!value) return "";
    const source = String(value);
    const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(source) ? `${source}T00:00:00` : source);
    if (Number.isNaN(date.getTime())) return source;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function safeUrl(value) {
    const candidate = String(value || "").trim();
    if (!candidate) return "";
    try {
      const parsed = new URL(candidate, "https://pbarchive.ai/");
      return ["http:", "https:"].includes(parsed.protocol) ? candidate : "";
    } catch (_) {
      return "";
    }
  }

  function normalizeEpisode(raw) {
    if (!raw || typeof raw !== "object") return null;
    const youtubeId = String(raw.youtube_id || raw.video_id || "").trim();
    const title = String(raw.title || "Untitled episode").trim();
    const date = String(raw.date || raw.published_date || "").trim();
    const suppliedUrl = safeUrl(raw.url || raw.youtube_url);
    const url = suppliedUrl || (youtubeId ? `https://www.youtube.com/watch?v=${encodeURIComponent(youtubeId)}` : "");
    return {
      youtube_id: youtubeId,
      title,
      date,
      url,
      mention_count: nonnegativeNumber(
        raw.mention_count
        ?? raw.match_count
        ?? raw.occurrence_count
        ?? raw.count
        ?? raw.relevance,
      ),
    };
  }

  function episodeKey(episode) {
    return episode.youtube_id || episode.url || `${episode.title}\u0000${episode.date}`;
  }

  function mergeEpisodes(groups, sumCounts = false) {
    const merged = new Map();
    for (const group of groups || []) {
      for (const rawEpisode of Array.isArray(group) ? group : []) {
        const episode = normalizeEpisode(rawEpisode);
        if (!episode) continue;
        const key = episodeKey(episode);
        const existing = merged.get(key);
        if (!existing) {
          merged.set(key, episode);
          continue;
        }
        existing.mention_count = sumCounts
          ? existing.mention_count + episode.mention_count
          : Math.max(existing.mention_count, episode.mention_count);
        if (!existing.url && episode.url) existing.url = episode.url;
        if (!existing.date && episode.date) existing.date = episode.date;
        if (existing.title === "Untitled episode" && episode.title) existing.title = episode.title;
      }
    }
    return [...merged.values()].sort((a, b) => (
      b.mention_count - a.mention_count
      || b.date.localeCompare(a.date)
      || a.title.localeCompare(b.title)
    ));
  }

  function findDetail(rawDetails, cluster) {
    if (!rawDetails || typeof rawDetails !== "object" || Array.isArray(rawDetails)) return {};
    if (rawDetails[cluster.id]) return rawDetails[cluster.id];
    if (rawDetails[cluster.name]) return rawDetails[cluster.name];
    const match = Object.entries(rawDetails).find(([key, value]) => (
      slugify(key) === cluster.id
      || slugify(value?.id) === cluster.id
      || slugify(value?.name) === cluster.id
    ));
    return match?.[1] || {};
  }

  function normalizeTopic(raw, clusterCount, overallCount, fallbackIndex) {
    const count = nonnegativeNumber(
      raw?.count ?? raw?.mention_count ?? raw?.match_count ?? raw?.occurrence_count,
    );
    const name = String(raw?.name || raw?.label || `Topic ${fallbackIndex + 1}`).trim();
    const id = String(raw?.id || slugify(name)).trim();
    const episodes = mergeEpisodes([raw?.episodes]);
    return {
      id,
      name,
      count,
      share_of_cluster: normalizeShare(raw?.share_of_cluster ?? raw?.share, count, clusterCount),
      share_overall: normalizeShare(raw?.share_overall, count, overallCount),
      episode_count: nonnegativeNumber(raw?.episode_count, episodes.length),
      episodes,
    };
  }

  function normalizeStats(raw) {
    const source = raw && typeof raw === "object" ? raw : {};
    const metadataSource = source.metadata && typeof source.metadata === "object" ? source.metadata : {};
    const overallSource = source.overall && typeof source.overall === "object" ? source.overall : {};
    const rawOverallClusters = Array.isArray(overallSource.clusters) ? overallSource.clusters : [];
    const rawDetails = source.clusters && typeof source.clusters === "object" ? source.clusters : {};

    const preliminaryClusters = rawOverallClusters.map((rawCluster, index) => {
      const name = String(rawCluster?.name || rawCluster?.label || `Cluster ${index + 1}`).trim();
      return {
        id: String(rawCluster?.id || slugify(name)).trim(),
        name,
        count: nonnegativeNumber(
          rawCluster?.count
          ?? rawCluster?.mention_count
          ?? rawCluster?.match_count
          ?? rawCluster?.occurrence_count,
        ),
        raw_share: rawCluster?.share,
        episode_count: nonnegativeNumber(rawCluster?.episode_count),
      };
    });

    const knownIds = new Set(preliminaryClusters.map(cluster => cluster.id));
    for (const [key, rawDetail] of Object.entries(rawDetails)) {
      if (!rawDetail || typeof rawDetail !== "object") continue;
      const name = String(rawDetail.name || rawDetail.label || key).trim();
      const id = String(rawDetail.id || slugify(key || name)).trim();
      if (knownIds.has(id)) continue;
      knownIds.add(id);
      preliminaryClusters.push({
        id,
        name,
        count: nonnegativeNumber(
          rawDetail.count
          ?? rawDetail.mention_count
          ?? rawDetail.match_count
          ?? rawDetail.occurrence_count,
        ),
        raw_share: rawDetail.share,
        episode_count: nonnegativeNumber(rawDetail.episode_count),
      });
    }

    const clusterCountSum = preliminaryClusters.reduce((sum, cluster) => sum + cluster.count, 0);
    const declaredMentionCount = nonnegativeNumber(
      metadataSource.matched_topic_mentions
      ?? metadataSource.matched_topic_matches
      ?? metadataSource.matched_keyword_occurrences
      ?? metadataSource.topic_match_count,
    );
    const overallCount = declaredMentionCount || clusterCountSum;
    const clusters = preliminaryClusters.map((cluster, index) => ({
      ...cluster,
      share: normalizeShare(cluster.raw_share, cluster.count, overallCount || clusterCountSum),
      color: PALETTE[index % PALETTE.length],
      index,
    }));

    const clusterDetails = {};
    for (const cluster of clusters) {
      const detailSource = findDetail(rawDetails, cluster);
      const rawTopics = Array.isArray(detailSource.topics) ? detailSource.topics : [];
      const topics = rawTopics
        .map((topic, index) => normalizeTopic(topic, cluster.count, overallCount, index))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
      const explicitEpisodes = mergeEpisodes([detailSource.episodes]);
      const derivedEpisodes = mergeEpisodes(topics.map(topic => topic.episodes), true);
      clusterDetails[cluster.id] = {
        ...cluster,
        topics,
        episodes: explicitEpisodes.length ? explicitEpisodes : derivedEpisodes,
        episode_count: cluster.episode_count || nonnegativeNumber(detailSource.episode_count)
          || (explicitEpisodes.length ? explicitEpisodes.length : derivedEpisodes.length),
      };
    }

    const rawHeadline = Array.isArray(overallSource.bitcoin_ai_summary)
      ? overallSource.bitcoin_ai_summary
      : [];
    const headlineTotal = rawHeadline.reduce(
      (sum, item) => sum + nonnegativeNumber(
        item?.count ?? item?.mention_count ?? item?.match_count ?? item?.occurrence_count,
      ),
      0,
    );
    const bitcoinAiSummary = rawHeadline.map((item, index) => {
      const name = String(item?.name || item?.label || `Group ${index + 1}`).trim();
      const count = nonnegativeNumber(
        item?.count ?? item?.mention_count ?? item?.match_count ?? item?.occurrence_count,
      );
      return {
        id: String(item?.id || slugify(name)).trim(),
        name,
        count,
        share: normalizeShare(item?.share, count, headlineTotal),
        color: HEADLINE_COLORS[slugify(name)] || PALETTE[index % PALETTE.length],
      };
    });

    const rawQuarters = Array.isArray(source.quarters)
      ? source.quarters
      : Object.entries(source.quarters || {}).map(([id, value]) => ({ id, ...(value || {}) }));
    const quarters = rawQuarters.map((rawQuarter, quarterIndex) => {
      const id = String(rawQuarter?.id || rawQuarter?.quarter || `quarter-${quarterIndex + 1}`);
      const label = String(rawQuarter?.label || id).replace(/^(\d{4})-Q(\d)$/i, "$1 Q$2");
      const rawQuarterClusters = Array.isArray(rawQuarter?.clusters) ? rawQuarter.clusters : [];
      const byId = new Map(rawQuarterClusters.map(item => {
        const itemName = String(item?.name || item?.label || "");
        return [String(item?.id || slugify(itemName)), item || {}];
      }));
      const quarterSum = rawQuarterClusters.reduce(
        (sum, item) => sum + nonnegativeNumber(
          item?.count ?? item?.mention_count ?? item?.match_count ?? item?.occurrence_count,
        ),
        0,
      );
      const quarterMentionCount = nonnegativeNumber(
        rawQuarter?.matched_topic_mentions
        ?? rawQuarter?.matched_topic_matches
        ?? rawQuarter?.matched_keyword_occurrences
        ?? rawQuarter?.topic_match_count,
      ) || quarterSum;
      const quarterClusters = clusters.map(cluster => {
        const item = byId.get(cluster.id) || {};
        const count = nonnegativeNumber(
          item.count ?? item.mention_count ?? item.match_count ?? item.occurrence_count,
        );
        return {
          id: cluster.id,
          name: cluster.name,
          count,
          share: normalizeShare(item.share, count, quarterMentionCount || quarterSum),
          episode_count: nonnegativeNumber(item.episode_count),
          color: cluster.color,
        };
      });
      return {
        id,
        label,
        episode_count: nonnegativeNumber(rawQuarter?.episode_count),
        matched_topic_mentions: quarterMentionCount,
        clusters: quarterClusters,
      };
    }).sort((a, b) => a.id.localeCompare(b.id));

    const methodSource = metadataSource.methodology && typeof metadataSource.methodology === "object"
      ? metadataSource.methodology
      : {};
    const diagnosticCandidate = metadataSource.diagnostic_summary
      || source.diagnostic_summary
      || source.diagnostics;
    const diagnosticSource = diagnosticCandidate && typeof diagnosticCandidate === "object"
      ? diagnosticCandidate
      : {};
    const episodeCount = nonnegativeNumber(
      metadataSource.episode_count
      ?? metadataSource.analyzed_episode_count
      ?? diagnosticSource.included_episode_count,
    );
    const expectedEpisodeCount = nonnegativeNumber(
      metadataSource.expected_episode_count
      ?? metadataSource.expected_full_episode_count
      ?? diagnosticSource.expected_episode_count,
    );
    const displayEpisodeCount = nonnegativeNumber(
      metadataSource.display_episode_count
      ?? diagnosticSource.display_episode_count
      ?? (expectedEpisodeCount || episodeCount),
    );
    const dateRangeSource = metadataSource.date_range;
    let dateStart = "";
    let dateEnd = "";
    if (Array.isArray(dateRangeSource)) {
      [dateStart = "", dateEnd = ""] = dateRangeSource;
    } else if (dateRangeSource && typeof dateRangeSource === "object") {
      dateStart = dateRangeSource.start || dateRangeSource.from || dateRangeSource.min || "";
      dateEnd = dateRangeSource.end || dateRangeSource.to || dateRangeSource.max || "";
    } else if (typeof dateRangeSource === "string") {
      [dateStart = "", dateEnd = ""] = dateRangeSource.split(/\s+(?:to|through|–|—)\s+/i);
    }

    return {
      metadata: {
        episode_count: episodeCount,
        display_episode_count: displayEpisodeCount,
        expected_episode_count: expectedEpisodeCount,
        matched_topic_mentions: overallCount,
        metric_name: String(metadataSource.metric_name || "transcript_topic_matches"),
        metric_label: String(
          metadataSource.metric_label
          || metadataSource.metric_display_name
          || metadataSource.count_label
          || "transcript topic matches",
        ),
        metric_label_singular: String(
          metadataSource.metric_label_singular
          || metadataSource.metric_unit_label
          || "",
        ),
        share_unit: String(metadataSource.share_unit || "percent"),
        date_range: { start: String(dateStart || ""), end: String(dateEnd || "") },
        methodology: {
          summary: String(methodSource.summary || DEFAULT_METHOD),
          percentage_basis: String(methodSource.percentage_basis || DEFAULT_METHOD),
          coverage_caveat: String(
            methodSource.coverage_caveat
            || "Transcript topic matching is directional and is not an estimate of discussion time.",
          ),
          bitcoin_ai_grouping: String(
            methodSource.bitcoin_ai_grouping
            || "Bitcoin, AI, and Other use the grouping documented by the topic-statistics build.",
          ),
        },
      },
      overall: { clusters, bitcoin_ai_summary: bitcoinAiSummary },
      clusters: clusterDetails,
      quarters,
    };
  }

  function polarPoint(cx, cy, radius, angle) {
    const radians = (angle - 90) * Math.PI / 180;
    return {
      x: cx + radius * Math.cos(radians),
      y: cy + radius * Math.sin(radians),
    };
  }

  function describeDonutArc(cx, cy, outerRadius, innerRadius, startAngle, endAngle) {
    const sweep = Math.min(359.999, Math.max(0.001, endAngle - startAngle));
    const safeEnd = startAngle + sweep;
    const outerStart = polarPoint(cx, cy, outerRadius, safeEnd);
    const outerEnd = polarPoint(cx, cy, outerRadius, startAngle);
    const innerStart = polarPoint(cx, cy, innerRadius, startAngle);
    const innerEnd = polarPoint(cx, cy, innerRadius, safeEnd);
    const largeArc = sweep > 180 ? 1 : 0;
    return [
      `M ${outerStart.x.toFixed(3)} ${outerStart.y.toFixed(3)}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArc} 0 ${outerEnd.x.toFixed(3)} ${outerEnd.y.toFixed(3)}`,
      `L ${innerStart.x.toFixed(3)} ${innerStart.y.toFixed(3)}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${innerEnd.x.toFixed(3)} ${innerEnd.y.toFixed(3)}`,
      "Z",
    ].join(" ");
  }

  function createDonutSegments(items, options = {}) {
    const startAngle = finiteNumber(options.startAngle, 0);
    const gapAngle = Math.max(0, finiteNumber(options.gapAngle, 1.2));
    const weights = (items || []).map(item => nonnegativeNumber(item.share ?? item.count));
    const total = weights.reduce((sum, value) => sum + value, 0);
    if (!total) return [];
    let cursor = startAngle;
    return items.map((item, index) => {
      const sweep = weights[index] / total * 360;
      const gap = Math.min(gapAngle, sweep * 0.32);
      const segmentStart = cursor + gap / 2;
      const segmentEnd = cursor + sweep - gap / 2;
      const result = {
        item,
        startAngle: segmentStart,
        endAngle: Math.max(segmentStart + 0.001, segmentEnd),
        midAngle: cursor + sweep / 2,
        normalizedShare: weights[index] / total,
      };
      cursor += sweep;
      return result;
    });
  }

  function collapseTopics(topics, limit = 7) {
    const sorted = [...(topics || [])].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    if (sorted.length <= limit) return sorted;
    const visible = sorted.slice(0, limit);
    const tail = sorted.slice(limit);
    const count = tail.reduce((sum, topic) => sum + nonnegativeNumber(topic.count), 0);
    const clusterShare = tail.reduce((sum, topic) => sum + nonnegativeNumber(topic.share_of_cluster), 0);
    const overallShare = tail.reduce((sum, topic) => sum + nonnegativeNumber(topic.share_overall), 0);
    const episodes = mergeEpisodes(tail.map(topic => topic.episodes), true);
    visible.push({
      id: OTHER_TOPIC_ID,
      name: "Other subtopics",
      count,
      share_of_cluster: clamp(clusterShare),
      share_overall: clamp(overallShare),
      // The artifact stores only each topic's highest-signal episode links, so
      // their union is not a defensible total episode count for the long tail.
      episode_count: 0,
      episodes,
      aggregate: true,
      topic_count: tail.length,
    });
    return visible;
  }

  function dateRangeLabel(dateRange) {
    const start = formatDate(dateRange?.start);
    const end = formatDate(dateRange?.end);
    if (start && end) return start === end ? start : `${start} – ${end}`;
    return start || end || "";
  }

  function exactClusterLabel(cluster, metadata) {
    const episodes = cluster.episode_count
      ? ` across ${formatNumber(cluster.episode_count)} episode${cluster.episode_count === 1 ? "" : "s"}`
      : "";
    return `${cluster.name}: ${formatExactPercent(cluster.share)}, ${formatNumber(cluster.count)} ${metricLabel(metadata, cluster.count)}${episodes}`;
  }

  function exactTopicLabel(topic, cluster, metadata) {
    const tail = topic.aggregate
      ? ` from ${formatNumber(topic.topic_count)} smaller topics`
      : "";
    const episodes = topic.episode_count
      ? ` across ${formatNumber(topic.episode_count)} episode${topic.episode_count === 1 ? "" : "s"}`
      : "";
    return `${topic.name}: ${formatExactPercent(topic.share_of_cluster)} of ${cluster.name}, ${formatNumber(topic.count)} ${metricLabel(metadata, topic.count)}${tail}${episodes}`;
  }

  function renderLoading() {
    return `
      <div class="pbj-topic-explorer__surface pbj-topic-explorer__surface--loading">
        <div class="pbj-topic-explorer__loading" role="status" aria-live="polite">
          <span class="pbj-topic-explorer__spinner" aria-hidden="true"></span>
          <span>Loading PBJ Topic Explorer…</span>
        </div>
      </div>`;
  }

  function renderError() {
    return `
      <div class="pbj-topic-explorer__surface pbj-topic-explorer__surface--error">
        <div class="pbj-topic-explorer__error" role="status">
          <strong>PBJ Topic Explorer is temporarily unavailable.</strong>
          <span>The topic archive remains available in the browsing tabs above.</span>
        </div>
      </div>`;
  }

  class ExplorerInstance {
    constructor(rootElement, url) {
      this.root = rootElement;
      this.url = url || this.root.dataset.topicStatsUrl || "./topic_stats.json";
      this.id = `pbj-topic-explorer-${++instanceCount}`;
      this.abortController = typeof AbortController === "function" ? new AbortController() : null;
      this.data = null;
      this.destroyed = false;
      this.state = {
        view: "overview",
        selectedClusterId: "",
        selectedTopicId: "",
        activeTrendClusters: new Set(),
      };
      this.onClick = this.handleClick.bind(this);
      this.onKeyDown = this.handleKeyDown.bind(this);
      this.onPointerOver = this.handlePointerOver.bind(this);
      this.onPointerMove = this.handlePointerMove.bind(this);
      this.onPointerOut = this.handlePointerOut.bind(this);
      this.onFocusIn = this.handleFocusIn.bind(this);
      this.onFocusOut = this.handleFocusOut.bind(this);
      this.root.classList.add("pbj-topic-explorer");
      this.root.setAttribute("data-topic-explorer-mounted", "true");
      this.root.addEventListener("click", this.onClick);
      this.root.addEventListener("keydown", this.onKeyDown);
      this.root.addEventListener("pointerover", this.onPointerOver);
      this.root.addEventListener("pointermove", this.onPointerMove);
      this.root.addEventListener("pointerout", this.onPointerOut);
      this.root.addEventListener("focusin", this.onFocusIn);
      this.root.addEventListener("focusout", this.onFocusOut);
      this.root.innerHTML = renderLoading();
      this.ready = this.load();
    }

    async load() {
      try {
        let raw;
        if (this.url && typeof this.url === "object") {
          raw = this.url;
        } else {
          if (typeof fetch !== "function") throw new Error("Fetch is not available");
          const response = await fetch(this.url, {
            credentials: "same-origin",
            signal: this.abortController?.signal,
          });
          if (!response.ok) throw new Error(`Topic statistics request failed (${response.status})`);
          raw = await response.json();
        }
        if (this.destroyed) return null;
        const data = normalizeStats(raw);
        if (!data.overall.clusters.length) throw new Error("Topic statistics contain no clusters");
        this.data = data;
        this.state.selectedClusterId = data.overall.clusters[0].id;
        this.state.activeTrendClusters = new Set(data.overall.clusters.map(cluster => cluster.id));
        this.render();
        return data;
      } catch (error) {
        if (this.destroyed || error?.name === "AbortError") return null;
        this.root.innerHTML = renderError();
        return null;
      }
    }

    selectedCluster() {
      return this.data?.clusters[this.state.selectedClusterId]
        || this.data?.clusters[this.data?.overall.clusters[0]?.id]
        || null;
    }

    visibleTopics() {
      return collapseTopics(this.selectedCluster()?.topics || [], 7);
    }

    selectedTopic() {
      if (!this.state.selectedTopicId) return null;
      return this.visibleTopics().find(topic => topic.id === this.state.selectedTopicId) || null;
    }

    selectionEpisodes() {
      const topic = this.selectedTopic();
      const cluster = this.selectedCluster();
      return (topic ? topic.episodes || [] : cluster?.episodes || []).slice(0, 6);
    }

    render(focusKey = "") {
      if (!this.data || this.destroyed) return;
      const metadata = this.data.metadata;
      const episodeCount = metadata.episode_count;
      const displayEpisodeCount = metadata.display_episode_count
        || metadata.expected_episode_count
        || episodeCount;
      const range = dateRangeLabel(metadata.date_range);
      const countLine = displayEpisodeCount > 0
        ? `Based on ${formatNumber(displayEpisodeCount)} full PBJ episodes`
        : episodeCount
          ? `Based on ${formatNumber(episodeCount)} full PBJ episode${episodeCount === 1 ? "" : "s"}`
          : "Full PBJ episode archive";
      const rangeLine = range ? ` · ${escapeHtml(range)}` : "";
      const overviewTabId = `${this.id}-tab-overview`;
      const trendsTabId = `${this.id}-tab-trends`;
      const panelId = `${this.id}-panel`;
      const headingId = `${this.id}-heading`;
      const isOverview = this.state.view === "overview";

      this.root.innerHTML = `
        <div class="pbj-topic-explorer__surface" role="region" aria-labelledby="${headingId}">
          <header class="pbj-topic-explorer__header">
            <h2 class="pbj-topic-explorer__title" id="${headingId}">PBJ Topic Explorer</h2>
            <p class="pbj-topic-explorer__intro">What PBJ talks about, how it breaks down, and how the topic mix changes over time.</p>
            <p class="pbj-topic-explorer__scope"><strong>${escapeHtml(countLine)}</strong>${rangeLine}</p>
          </header>
          <div class="pbj-topic-explorer__tabs" role="tablist" aria-label="PBJ Topic Explorer views">
            <button class="pbj-topic-explorer__tab${isOverview ? " is-active" : ""}" type="button"
              id="${overviewTabId}" role="tab" aria-selected="${isOverview}" aria-controls="${panelId}"
              tabindex="${isOverview ? "0" : "-1"}" data-action="set-view" data-view="overview"
              data-focus-key="tab:overview">Overview</button>
            <button class="pbj-topic-explorer__tab${!isOverview ? " is-active" : ""}" type="button"
              id="${trendsTabId}" role="tab" aria-selected="${!isOverview}" aria-controls="${panelId}"
              tabindex="${!isOverview ? "0" : "-1"}" data-action="set-view" data-view="trends"
              data-focus-key="tab:trends">Trends</button>
          </div>
          <div class="pbj-topic-explorer__panel" id="${panelId}" role="tabpanel"
            aria-labelledby="${isOverview ? overviewTabId : trendsTabId}">
            ${isOverview ? this.renderOverview() : this.renderTrends()}
          </div>
          <div class="pbj-topic-explorer__tooltip" role="status" aria-live="polite" aria-hidden="true"></div>
        </div>`;

      if (focusKey) {
        const focusTarget = [...this.root.querySelectorAll("[data-focus-key]")]
          .find(element => element.dataset.focusKey === focusKey);
        if (focusTarget) {
          const schedule = typeof requestAnimationFrame === "function" ? requestAnimationFrame : callback => setTimeout(callback, 0);
          schedule(() => focusTarget.focus({ preventScroll: true }));
        }
      }
    }

    renderOverview() {
      const clusters = this.data.overall.clusters;
      const selected = this.selectedCluster() || clusters[0];
      const segments = createDonutSegments(clusters, { startAngle: 0, gapAngle: 1.4 });
      const donutTitleId = `${this.id}-donut-title`;
      const donutDescId = `${this.id}-donut-desc`;
      const totalMentions = this.data.metadata.matched_topic_mentions
        || clusters.reduce((sum, cluster) => sum + cluster.count, 0);
      const paths = segments.filter(segment => segment.normalizedShare > 0).map(segment => {
        const cluster = segment.item;
        const label = exactClusterLabel(cluster, this.data.metadata);
        const selectedClass = cluster.id === selected?.id ? " is-selected" : "";
        return `
          <path class="pbj-topic-explorer__donut-segment${selectedClass}"
            d="${describeDonutArc(120, 120, 105, 68, segment.startAngle, segment.endAngle)}"
            fill="${cluster.color}" role="button" tabindex="0"
            aria-pressed="${cluster.id === selected?.id}"
            aria-label="${escapeHtml(label)}" data-tooltip="${escapeHtml(label)}"
            data-action="select-cluster" data-cluster-id="${escapeHtml(cluster.id)}"
            data-focus-key="donut:${escapeHtml(cluster.id)}">
            <title>${escapeHtml(label)}</title>
          </path>`;
      }).join("");
      const legend = clusters.map(cluster => {
        const label = exactClusterLabel(cluster, this.data.metadata);
        return `
          <button class="pbj-topic-explorer__legend-button${cluster.id === selected?.id ? " is-selected" : ""}"
            type="button" aria-pressed="${cluster.id === selected?.id}"
            data-action="select-cluster" data-cluster-id="${escapeHtml(cluster.id)}"
            data-tooltip="${escapeHtml(label)}" data-focus-key="legend:${escapeHtml(cluster.id)}">
            <span class="pbj-topic-explorer__swatch" style="--topic-color:${cluster.color}" aria-hidden="true"></span>
            <span class="pbj-topic-explorer__legend-name">${escapeHtml(cluster.name)}</span>
            <span class="pbj-topic-explorer__legend-value">${formatPercent(cluster.share)}</span>
            <span class="pbj-topic-explorer__legend-count">${formatNumber(cluster.count)}</span>
          </button>`;
      }).join("");

      return `
        <section class="pbj-topic-explorer__overview" aria-labelledby="${this.id}-mix-heading">
          <div class="pbj-topic-explorer__section-heading-row">
            <div>
              <h3 class="pbj-topic-explorer__section-title" id="${this.id}-mix-heading">PBJ topic mix</h3>
              <p class="pbj-topic-explorer__section-sub">Share of ${escapeHtml(metricLabel(this.data.metadata))} across the full-episode archive.</p>
            </div>
            <span class="pbj-topic-explorer__mention-total">${formatNumber(totalMentions)} ${escapeHtml(metricLabel(this.data.metadata, totalMentions))}</span>
          </div>
          <div class="pbj-topic-explorer__mix-grid">
            <div class="pbj-topic-explorer__donut-wrap">
              <svg class="pbj-topic-explorer__donut" viewBox="0 0 240 240" role="group"
                aria-labelledby="${donutTitleId} ${donutDescId}">
                <title id="${donutTitleId}">PBJ top-level topic mix</title>
                <desc id="${donutDescId}">Choose a slice or its matching legend item to explore subtopics and episodes.</desc>
                <circle class="pbj-topic-explorer__donut-track" cx="120" cy="120" r="86.5" aria-hidden="true"></circle>
                ${paths}
              </svg>
              <div class="pbj-topic-explorer__donut-center" aria-hidden="true">
                <strong>${selected ? formatPercent(selected.share) : "—"}</strong>
                <span>${escapeHtml(selected?.name || "Topic mix")}</span>
              </div>
            </div>
            <div class="pbj-topic-explorer__legend" aria-label="Topic cluster legend">
              <div class="pbj-topic-explorer__legend-head" aria-hidden="true">
                <span>Cluster</span><span>Share</span><span>Count</span>
              </div>
              ${legend}
            </div>
          </div>
        </section>
        ${this.renderHeadlineSummary()}
        ${this.renderDrilldown()}`;
    }

    renderHeadlineSummary() {
      const groups = this.data.overall.bitcoin_ai_summary;
      if (!groups.length) return "";
      const barLabel = groups.map(group => `${group.name} ${formatPercent(group.share)}`).join(", ");
      let cursor = 0;
      const segments = groups.filter(group => group.share > 0).map(group => {
        const left = cursor;
        cursor += group.share * 100;
        const tooltip = `${group.name}: ${formatExactPercent(group.share)}, ${formatNumber(group.count)} ${metricLabel(this.data.metadata, group.count)}`;
        return `<span class="pbj-topic-explorer__headline-segment" style="--segment-left:${left}%;--segment-width:${group.share * 100}%;--topic-color:${group.color}"
          role="img" tabindex="0" aria-label="${escapeHtml(tooltip)}" data-tooltip="${escapeHtml(tooltip)}"></span>`;
      }).join("");
      const legend = groups.map(group => `
        <div class="pbj-topic-explorer__headline-key">
          <span class="pbj-topic-explorer__swatch" style="--topic-color:${group.color}" aria-hidden="true"></span>
          <span>${escapeHtml(group.name)}</span>
          <strong>${formatPercent(group.share)}</strong>
        </div>`).join("");
      return `
        <section class="pbj-topic-explorer__headline" aria-labelledby="${this.id}-headline-heading">
          <div class="pbj-topic-explorer__headline-copy">
            <h3 class="pbj-topic-explorer__section-title" id="${this.id}-headline-heading">Headline view</h3>
            <p class="pbj-topic-explorer__section-sub">A secondary taxonomy rollup of the same ${escapeHtml(metricLabel(this.data.metadata))}.</p>
          </div>
          <div class="pbj-topic-explorer__headline-chart">
            <div class="pbj-topic-explorer__headline-bar" role="group" aria-label="${escapeHtml(barLabel)}">
              ${segments}
            </div>
            <div class="pbj-topic-explorer__headline-legend">${legend}</div>
          </div>
        </section>`;
    }

    renderDrilldown() {
      const cluster = this.selectedCluster();
      if (!cluster) return "";
      const topics = this.visibleTopics().map((topic, index) => ({
        ...topic,
        color: topic.aggregate ? "#68736a" : SUBTOPIC_PALETTE[index % SUBTOPIC_PALETTE.length],
        share: topic.share_of_cluster,
      }));
      const selectedTopic = this.selectedTopic();
      const selectedName = selectedTopic?.name || cluster.name;
      const episodes = this.selectionEpisodes();
      const hasAggregatedTail = topics.some(topic => topic.aggregate);
      const subtopicDescription = hasAggregatedTail
        ? "The chart displays the seven largest subtopics and an aggregate of the remaining subtopics."
        : "The chart displays all available subtopics.";
      const subtopicSegments = createDonutSegments(topics, { startAngle: 0, gapAngle: 1.8 });
      const subtopicTitleId = `${this.id}-subtopic-donut-title`;
      const subtopicDescId = `${this.id}-subtopic-donut-desc`;
      const subtopicPaths = subtopicSegments.filter(segment => segment.normalizedShare > 0).map(segment => {
        const topic = segment.item;
        const selected = topic.id === selectedTopic?.id;
        const label = exactTopicLabel(topic, cluster, this.data.metadata);
        return `
          <path class="pbj-topic-explorer__donut-segment pbj-topic-explorer__subtopic-segment${selected ? " is-selected" : ""}"
            d="${describeDonutArc(120, 120, 105, 66, segment.startAngle, segment.endAngle)}"
            fill="${topic.color}" role="button" tabindex="0" aria-pressed="${selected}"
            aria-label="${escapeHtml(label)}" data-tooltip="${escapeHtml(label)}"
            data-action="select-topic" data-topic-id="${escapeHtml(topic.id)}"
            data-focus-key="subdonut:${escapeHtml(topic.id)}">
            <title>${escapeHtml(label)}</title>
          </path>`;
      }).join("");
      const subtopicLegend = topics.map(topic => {
        const selected = topic.id === selectedTopic?.id;
        const label = exactTopicLabel(topic, cluster, this.data.metadata);
        return `
          <button class="pbj-topic-explorer__legend-button pbj-topic-explorer__subtopic-button${selected ? " is-selected" : ""}"
            type="button" aria-pressed="${selected}" data-action="select-topic"
            data-topic-id="${escapeHtml(topic.id)}" data-tooltip="${escapeHtml(label)}"
            data-focus-key="topic:${escapeHtml(topic.id)}">
            <span class="pbj-topic-explorer__swatch" style="--topic-color:${topic.color}" aria-hidden="true"></span>
            <span class="pbj-topic-explorer__legend-name">${escapeHtml(topic.name)}</span>
            <span class="pbj-topic-explorer__legend-value">${formatPercent(topic.share_of_cluster)}</span>
            <span class="pbj-topic-explorer__legend-count">${formatNumber(topic.count)}</span>
          </button>`;
      }).join("");

      const subtopicVisualization = topics.length ? `
        <div class="pbj-topic-explorer__drilldown-grid">
          <div class="pbj-topic-explorer__donut-wrap pbj-topic-explorer__subtopic-donut-wrap">
            <svg class="pbj-topic-explorer__donut pbj-topic-explorer__subtopic-donut" viewBox="0 0 240 240" role="group"
              aria-labelledby="${subtopicTitleId} ${subtopicDescId}">
              <title id="${subtopicTitleId}">${escapeHtml(`${cluster.name} subtopic mix`)}</title>
              <desc id="${subtopicDescId}">Choose a slice or its matching legend item to show the most relevant episodes. ${subtopicDescription}</desc>
              <circle class="pbj-topic-explorer__donut-track" cx="120" cy="120" r="85.5" aria-hidden="true"></circle>
              ${subtopicPaths}
            </svg>
            <div class="pbj-topic-explorer__donut-center pbj-topic-explorer__subtopic-center" aria-hidden="true">
              <strong>${selectedTopic ? formatPercent(selectedTopic.share_of_cluster) : "100%"}</strong>
              <span>${escapeHtml(selectedTopic?.name || "All subtopics")}</span>
            </div>
          </div>
          <div class="pbj-topic-explorer__legend pbj-topic-explorer__subtopic-legend" role="group"
            aria-label="${escapeHtml(`${cluster.name} subtopic legend`)}">
            <div class="pbj-topic-explorer__legend-head" aria-hidden="true">
              <span>Subtopic</span><span>Share</span><span>Count</span>
            </div>
            ${subtopicLegend}
          </div>
        </div>` : `<p class="pbj-topic-explorer__empty">No subtopic breakdown is available for this cluster.</p>`;

      const episodeCards = episodes.length ? episodes.map(episode => {
        const date = formatDate(episode.date);
        const relevance = episode.mention_count
          ? `${formatNumber(episode.mention_count)} ${metricLabel(this.data.metadata, episode.mention_count)}`
          : "Relevant episode";
        const meta = [date, relevance].filter(Boolean).join(" · ");
        const content = `
          <span class="pbj-topic-explorer__episode-title">${escapeHtml(episode.title)}</span>
          ${meta ? `<span class="pbj-topic-explorer__episode-meta">${escapeHtml(meta)}</span>` : ""}`;
        if (!episode.url) return `<div class="pbj-topic-explorer__episode-link is-static">${content}</div>`;
        return `<a class="pbj-topic-explorer__episode-link" href="${escapeHtml(episode.url)}" target="_blank" rel="noreferrer">
          ${content}<span class="pbj-topic-explorer__episode-arrow" aria-hidden="true">↗</span>
        </a>`;
      }).join("") : `<p class="pbj-topic-explorer__empty">No episode links are available for this selection.</p>`;

      return `
        <section class="pbj-topic-explorer__drilldown" aria-labelledby="${this.id}-drilldown-heading">
          <div class="pbj-topic-explorer__drilldown-header">
            <div>
              <p class="pbj-topic-explorer__eyebrow">Selected cluster</p>
              <h3 class="pbj-topic-explorer__drilldown-title" id="${this.id}-drilldown-heading">${escapeHtml(cluster.name)}</h3>
            </div>
            <div class="pbj-topic-explorer__selection-stat">
              <strong>${formatPercent(cluster.share)}</strong>
              <span>${formatNumber(cluster.count)} ${escapeHtml(metricLabel(this.data.metadata, cluster.count))}</span>
            </div>
          </div>
          <div class="pbj-topic-explorer__subtopic-heading">
            <div>
              <h4>Subtopic mix</h4>
              <p>Share within ${escapeHtml(cluster.name)}.${hasAggregatedTail ? " The long tail is combined as Other subtopics." : ""}</p>
            </div>
            <button class="pbj-topic-explorer__text-button${selectedTopic ? "" : " is-selected"}" type="button"
              aria-pressed="${!selectedTopic}" data-action="clear-topic" data-focus-key="topic:all">All ${escapeHtml(cluster.name)}</button>
          </div>
          ${subtopicVisualization}
          <div class="pbj-topic-explorer__episodes">
            <div class="pbj-topic-explorer__subhead-row">
              <h4>Episodes for ${escapeHtml(selectedName)}</h4>
              <span>Most relevant</span>
            </div>
            <div class="pbj-topic-explorer__episode-list">${episodeCards}</div>
          </div>
        </section>`;
    }

    renderTrends() {
      const quarters = this.data.quarters;
      const clusters = this.data.overall.clusters;
      const allActive = clusters.every(cluster => this.state.activeTrendClusters.has(cluster.id));
      const controlItems = clusters.map(cluster => {
        const active = this.state.activeTrendClusters.has(cluster.id);
        return `
          <div class="pbj-topic-explorer__trend-key${active ? " is-active" : ""}">
            <button class="pbj-topic-explorer__trend-toggle" type="button" aria-pressed="${active}"
              data-action="toggle-trend-cluster" data-cluster-id="${escapeHtml(cluster.id)}"
              data-focus-key="toggle:${escapeHtml(cluster.id)}">
              <span class="pbj-topic-explorer__swatch" style="--topic-color:${cluster.color}" aria-hidden="true"></span>
              <span>${escapeHtml(cluster.name)}</span>
            </button>
            <button class="pbj-topic-explorer__trend-only" type="button"
              aria-label="Show only ${escapeHtml(cluster.name)}" title="Show only ${escapeHtml(cluster.name)}"
              data-action="isolate-trend-cluster" data-cluster-id="${escapeHtml(cluster.id)}"
              data-focus-key="only:${escapeHtml(cluster.id)}">Only</button>
          </div>`;
      }).join("");

      const rows = quarters.length ? quarters.map(quarter => this.renderQuarter(quarter)).join("")
        : `<p class="pbj-topic-explorer__empty">No quarterly trend data is available.</p>`;
      return `
        <section class="pbj-topic-explorer__trends" aria-labelledby="${this.id}-trends-heading">
          <div class="pbj-topic-explorer__section-heading-row">
            <div>
              <h3 class="pbj-topic-explorer__section-title" id="${this.id}-trends-heading">Quarterly topic mix</h3>
              <p class="pbj-topic-explorer__section-sub">Each full bar represents 100% of ${escapeHtml(metricLabel(this.data.metadata))} in that quarter.</p>
            </div>
            <button class="pbj-topic-explorer__reset-button${allActive ? " is-selected" : ""}" type="button"
              aria-pressed="${allActive}" data-action="reset-trend-clusters"
              data-focus-key="toggle:all">Show all</button>
          </div>
          <div class="pbj-topic-explorer__trend-controls" aria-label="Topic clusters shown in trend chart">
            ${controlItems}
          </div>
          <div class="pbj-topic-explorer__quarter-list">${rows}</div>
          <p class="pbj-topic-explorer__trend-note">Muted segments retain the original 100% scale. Select a colored segment to explore it.</p>
        </section>`;
    }

    renderQuarter(quarter) {
      let cursor = 0;
      const summary = [];
      const rectangles = quarter.clusters.map(cluster => {
        const width = clamp(cluster.share) * 1000;
        const x = cursor;
        cursor += width;
        const active = this.state.activeTrendClusters.has(cluster.id);
        const interactive = active && width >= 0.1;
        const episodes = cluster.episode_count
          ? ` across ${formatNumber(cluster.episode_count)} episode${cluster.episode_count === 1 ? "" : "s"}`
          : "";
        const tooltip = `${quarter.label} — ${cluster.name}: ${formatExactPercent(cluster.share)}, ${formatNumber(cluster.count)} ${metricLabel(this.data.metadata, cluster.count)}${episodes}`;
        summary.push(`${cluster.name} ${formatPercent(cluster.share)}${active ? "" : " (muted)"}`);
        return `
          <rect class="pbj-topic-explorer__trend-segment${interactive ? " is-active" : " is-muted"}"
            x="${x.toFixed(3)}" y="3" width="${Math.max(0, width).toFixed(3)}" height="26"
            fill="${active ? cluster.color : "#e6e9e6"}" ${interactive ? `role="button" tabindex="0"
              aria-label="${escapeHtml(tooltip)}" data-tooltip="${escapeHtml(tooltip)}"
              data-action="select-cluster" data-next-view="overview" data-cluster-id="${escapeHtml(cluster.id)}"
              data-focus-key="quarter:${escapeHtml(quarter.id)}:${escapeHtml(cluster.id)}"` : "aria-hidden=\"true\""}>
            ${interactive ? `<title>${escapeHtml(tooltip)}</title>` : ""}
          </rect>`;
      }).join("");
      return `
        <div class="pbj-topic-explorer__quarter-row">
          <div class="pbj-topic-explorer__quarter-label">
            <strong>${escapeHtml(quarter.label)}</strong>
            <span>${formatNumber(quarter.episode_count)} episode${quarter.episode_count === 1 ? "" : "s"}</span>
          </div>
          <div class="pbj-topic-explorer__quarter-chart">
            <svg viewBox="0 0 1000 32" preserveAspectRatio="none" role="group"
              aria-label="${escapeHtml(`${quarter.label}: ${summary.join(", ")}`)}">
              <rect class="pbj-topic-explorer__trend-track" x="0" y="3" width="1000" height="26" rx="7" aria-hidden="true"></rect>
              ${rectangles}
            </svg>
            <span class="pbj-topic-explorer__quarter-total">${formatNumber(quarter.matched_topic_mentions)} total</span>
          </div>
        </div>`;
    }

    handleAction(target) {
      const action = target?.dataset.action;
      if (!action || !this.data) return;
      const focusKey = target.dataset.focusKey || "";
      if (action === "set-view") {
        this.state.view = target.dataset.view === "trends" ? "trends" : "overview";
        this.render(`tab:${this.state.view}`);
        return;
      }
      if (action === "select-cluster") {
        if (!this.data.clusters[target.dataset.clusterId]) return;
        this.state.selectedClusterId = target.dataset.clusterId;
        this.state.selectedTopicId = "";
        this.state.view = target.dataset.nextView === "overview" ? "overview" : this.state.view;
        this.render(target.dataset.nextView === "overview" ? `legend:${target.dataset.clusterId}` : focusKey);
        return;
      }
      if (action === "select-topic") {
        this.state.selectedTopicId = target.dataset.topicId || "";
        this.render(focusKey);
        return;
      }
      if (action === "clear-topic") {
        this.state.selectedTopicId = "";
        this.render("topic:all");
        return;
      }
      if (action === "toggle-trend-cluster") {
        const clusterId = target.dataset.clusterId;
        if (this.state.activeTrendClusters.has(clusterId)) this.state.activeTrendClusters.delete(clusterId);
        else this.state.activeTrendClusters.add(clusterId);
        this.render(focusKey);
        return;
      }
      if (action === "isolate-trend-cluster") {
        this.state.activeTrendClusters = new Set([target.dataset.clusterId]);
        this.render(focusKey);
        return;
      }
      if (action === "reset-trend-clusters") {
        this.state.activeTrendClusters = new Set(this.data.overall.clusters.map(cluster => cluster.id));
        this.render("toggle:all");
      }
    }

    handleClick(event) {
      const target = event.target.closest?.("[data-action]");
      if (!target || !this.root.contains(target)) return;
      this.handleAction(target);
    }

    handleKeyDown(event) {
      const tab = event.target.closest?.('[role="tab"]');
      if (tab && ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
        event.preventDefault();
        const tabs = [...this.root.querySelectorAll('[role="tab"]')];
        let index = tabs.indexOf(tab);
        if (event.key === "Home") index = 0;
        else if (event.key === "End") index = tabs.length - 1;
        else index = (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
        this.handleAction(tabs[index]);
        return;
      }
      const actionTarget = event.target.closest?.('[data-action][role="button"]');
      if (!actionTarget || ["BUTTON", "A"].includes(actionTarget.tagName)) return;
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      this.handleAction(actionTarget);
    }

    tooltipElement() {
      return this.root.querySelector(".pbj-topic-explorer__tooltip");
    }

    showTooltip(target, pointerEvent) {
      const text = target?.dataset.tooltip;
      const tooltip = this.tooltipElement();
      if (!text || !tooltip) return;
      tooltip.textContent = text;
      tooltip.setAttribute("aria-hidden", "false");
      tooltip.classList.add("is-visible");
      this.positionTooltip(target, pointerEvent);
    }

    positionTooltip(target, pointerEvent) {
      const tooltip = this.tooltipElement();
      if (!tooltip || !tooltip.classList.contains("is-visible")) return;
      const rootRect = this.root.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const pointerX = pointerEvent?.clientX;
      const pointerY = pointerEvent?.clientY;
      const x = Number.isFinite(pointerX) ? pointerX - rootRect.left : targetRect.left + targetRect.width / 2 - rootRect.left;
      const y = Number.isFinite(pointerY) ? pointerY - rootRect.top : targetRect.top - rootRect.top;
      const width = tooltip.offsetWidth || 240;
      const clampedX = Math.min(Math.max(width / 2 + 8, x), Math.max(width / 2 + 8, rootRect.width - width / 2 - 8));
      tooltip.style.left = `${clampedX}px`;
      tooltip.style.top = `${Math.max(8, y)}px`;
    }

    hideTooltip() {
      const tooltip = this.tooltipElement();
      if (!tooltip) return;
      tooltip.classList.remove("is-visible");
      tooltip.setAttribute("aria-hidden", "true");
    }

    handlePointerOver(event) {
      const target = event.target.closest?.("[data-tooltip]");
      if (!target || !this.root.contains(target)) return;
      this.showTooltip(target, event);
    }

    handlePointerMove(event) {
      const target = event.target.closest?.("[data-tooltip]");
      if (target) this.positionTooltip(target, event);
    }

    handlePointerOut(event) {
      const from = event.target.closest?.("[data-tooltip]");
      const to = event.relatedTarget?.closest?.("[data-tooltip]");
      if (from && from !== to && !from.contains(document.activeElement)) this.hideTooltip();
    }

    handleFocusIn(event) {
      const target = event.target.closest?.("[data-tooltip]");
      if (target) this.showTooltip(target);
    }

    handleFocusOut(event) {
      const next = event.relatedTarget?.closest?.("[data-tooltip]");
      if (!next) this.hideTooltip();
    }

    destroy() {
      if (this.destroyed) return;
      this.destroyed = true;
      this.abortController?.abort();
      this.root.removeEventListener("click", this.onClick);
      this.root.removeEventListener("keydown", this.onKeyDown);
      this.root.removeEventListener("pointerover", this.onPointerOver);
      this.root.removeEventListener("pointermove", this.onPointerMove);
      this.root.removeEventListener("pointerout", this.onPointerOut);
      this.root.removeEventListener("focusin", this.onFocusIn);
      this.root.removeEventListener("focusout", this.onFocusOut);
      this.root.classList.remove("pbj-topic-explorer");
      this.root.removeAttribute("data-topic-explorer-mounted");
      this.root.innerHTML = "";
      if (this.root[INSTANCE_KEY] === this) delete this.root[INSTANCE_KEY];
    }
  }

  function resolveRoot(rootOrSelector) {
    if (typeof rootOrSelector === "string") {
      return typeof document !== "undefined" ? document.querySelector(rootOrSelector) : null;
    }
    return rootOrSelector && typeof rootOrSelector.querySelector === "function" ? rootOrSelector : null;
  }

  function mount(rootOrSelector, url) {
    const rootElement = resolveRoot(rootOrSelector);
    if (!rootElement) return null;
    rootElement[INSTANCE_KEY]?.destroy?.();
    const instance = new ExplorerInstance(rootElement, url);
    rootElement[INSTANCE_KEY] = instance;
    return instance;
  }

  return {
    OTHER_TOPIC_ID,
    clamp,
    collapseTopics,
    createDonutSegments,
    describeDonutArc,
    escapeHtml,
    formatNumber,
    formatExactPercent,
    formatPercent,
    mergeEpisodes,
    metricLabel,
    mount,
    normalizeShare,
    normalizeStats,
    safeUrl,
    slugify,
  };
});
