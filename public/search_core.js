(function initPbSearch(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.PBSearch = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createPbSearch() {
  "use strict";

  const LEGACY_STOP_WORDS = new Set([
    "a", "an", "and", "are", "as", "at", "be", "but", "by", "can", "do", "for", "from",
    "how", "i", "in", "is", "it", "of", "on", "or", "so", "that", "the", "this", "to",
    "was", "we", "what", "when", "where", "who", "why", "with", "you", "your", "about",
    "into", "does", "did", "they", "their", "there", "through", "using", "use",
  ]);

  const SEARCH_STOP_WORDS = new Set([
    ...LEGACY_STOP_WORDS,
    "actual", "all", "among", "another", "archive", "answer", "answered", "been", "correct", "could", "count", "covered", "cover", "covers", "different",
    "discuss", "discussed", "discusses", "discussing", "episode", "episodes",
    "explain", "explained", "explains", "explaining",
    "find", "identify", "locate", "looking", "mention", "mentioned", "mentioning", "mentions",
    "current", "earliest", "every", "ever", "everything", "exact", "exactly", "former", "give", "had", "has", "have", "last", "latest", "latter", "list", "many", "most",
    "never", "newest", "next", "me", "oldest", "other", "others", "overview", "pb", "please", "question",
    "one", "ones", "passage", "passages", "precise", "precisely", "recap", "recent", "recently", "result", "results", "same", "section", "sections", "should", "source", "sources", "these", "those", "today", "was", "were", "will", "would",
    "reference", "referenced", "references", "referencing", "related", "relation", "relationship",
    "say", "says", "said", "search", "show", "summarize", "summary", "tell",
    "stamp", "stamps", "them", "timecode", "timecodes", "timestamp", "timestamps", "video", "videos", "which",
  ]);

  const EPISODE_INTENT_WORDS = new Set(["episode", "episodes", "video", "videos"]);
  const BROAD_BITCOIN_TOPICS = [
    "Bitcoin as everyday money",
    "Bitcoin payments",
    "Bitcoin merchant adoption",
    "Bitcoin vs. stablecoins",
    "Bitcoin as savings asset",
    "Bitcoin treasury companies",
    "Bitcoin-backed loans",
    "Bitcoin privacy",
  ];

  const TOPIC_ALIASES = {
    "ai data privacy": "ai privacy",
    "privacy first ai": "ai privacy",
    "bitcoin lending": "bitcoin backed loans",
    "bitcoin backed lending": "bitcoin backed loans",
    "bitcoin backed loan": "bitcoin backed loans",
    "bitcoin backed loans": "bitcoin backed loans",
    "quantum report": "presidio bitcoins quantum readiness report",
    "quantum readiness report": "presidio bitcoins quantum readiness report",
    "pb quantum report": "presidio bitcoins quantum readiness report",
    "bitcoin quantum report": "presidio bitcoins quantum readiness report",
  };

  // These are intentionally compact, high-confidence concept families rather than a
  // thesaurus. They cover common archive language while avoiding the opaque matches
  // that a very broad synonym expansion would create.
  const CONCEPT_FAMILIES = [
    ["analyze", "analysis", "assess", "evaluate", "review", "survey"],
    ["collaborate", "collaboration", "collaborative", "multiplayer", "shared", "teamwork"],
    ["code", "coding", "developer", "development", "ide", "programming", "software"],
    ["against", "argument", "criticize", "criticism", "concern", "downside", "drawback", "problem", "risk"],
    ["launch", "launched", "mainnet", "release", "released", "ship", "shipped"],
    ["loan", "lending", "borrow", "borrowing"],
    ["outlook", "direction", "future", "trajectory"],
    ["privacy", "private", "confidential", "confidentiality"],
    ["selfcustody", "custody", "noncustodial", "sovereign"],
    ["stablecoin", "stablecoins", "usdc", "usdt"],
    ["versus", "vs", "compare", "comparison"],
  ];

  const PHRASE_CONCEPTS = [
    { pattern: /\bdesign (?:app|software|tool)s?\b/i, terms: ["figma", "sketch", "design"], consume: ["design", "app", "software", "tool"] },
    { pattern: /\b(?:graphics?|visual) editor\b/i, terms: ["figma", "sketch", "design"], consume: ["graphic", "visual", "editor"] },
    { pattern: /\bcollaborative (?:code|coding|development)\b/i, terms: ["collaboration", "multiplayer", "coding"], consume: ["collaborative", "code"] },
    { pattern: /\bmulti[\s-]+user\b/i, terms: ["multiplayer", "collaboration", "shared"], consume: ["multi", "user"] },
    { pattern: /\bsoftware (?:construction|creation|building)\b/i, terms: ["coding", "development", "software"], consume: ["software", "construction", "creation", "building"] },
    { pattern: /\bself[\s-]+custod(?:y|ial)\b/i, terms: ["selfcustody", "custody", "noncustodial"] },
    { pattern: /\bharvest now[,]? decrypt later\b/i, terms: ["harvest", "decrypt", "hndl"] },
    { pattern: /\bpost[\s-]+quantum\b/i, terms: ["postquantum", "quantum"] },
  ];

  const SERIES_ALIASES = new Map([
    ["pbj", "PBJ"],
    ["builder", "Builder"],
    ["21 in 21", "21 in 21"],
    ["qbs", "QBS"],
    ["quantum bitcoin summit", "QBS"],
    ["open source ai summit", "Open Source AI Summit"],
    ["open-source ai summit", "Open Source AI Summit"],
    ["built in the presidio", "Built in the Presidio"],
    ["built in presidio", "Built in the Presidio"],
    ["member spotlight", "Member Spotlight"],
    ["type i summit", "Type I Summit"],
    ["presidio bitcoin startup night", "Presidio Bitcoin Startup Night"],
    ["startup night", "Presidio Bitcoin Startup Night"],
    ["bdw", "BDW"],
    ["bitcoin design week", "BDW"],
    ["the bitcoin age", "The Bitcoin Age"],
    ["bitcoin age", "The Bitcoin Age"],
    ["presidio bitcoin hackathon", "Presidio Bitcoin Hackathon"],
    ["bitcoin hackathon", "Presidio Bitcoin Hackathon"],
    ["presidio bitcoin launch", "Presidio Bitcoin Launch"],
  ]);

  const BROAD_QUERY_FILLER = new Set([
    "bitcoin", "broad", "broadly", "direction", "future", "going", "long", "longterm", "next", "outlook",
    "term", "thesis", "think",
  ]);

  const GENERIC_RELATED_TOPICS = new Set([
    "21 in 21",
    "built in the presidio",
    "pbj",
    "presidio bitcoin",
    "presidio bitcoin report",
    "type i summit",
  ]);

  const RELATED_INTENT_CONCEPTS = new Set([
    "against", "analysis", "analyze", "bitcoin", "method", "outlook", "pbj", "self",
  ]);

  const RELATED_BRIDGE_STOP = new Set([
    "ai", "app", "bitcoin", "company", "market", "model", "network", "product", "system", "tool", "user",
  ]);

  const TOKEN_LEMMAS = new Map(Object.entries({
    analyses: "analyze",
    analysis: "analyze",
    analyzed: "analyze",
    analyzes: "analyze",
    analyzing: "analyze",
    assessed: "assess",
    assesses: "assess",
    assessing: "assess",
    borrowed: "borrow",
    borrowing: "borrow",
    categories: "category",
    compared: "compare",
    compares: "compare",
    comparing: "compare",
    criticisms: "criticism",
    criticized: "criticize",
    criticizes: "criticize",
    criticizing: "criticize",
    developers: "developer",
    developed: "develop",
    developing: "develop",
    evaluated: "evaluate",
    evaluates: "evaluate",
    evaluating: "evaluate",
    launched: "launch",
    launching: "launch",
    held: "hold",
    holding: "hold",
    methods: "method",
    models: "model",
    options: "option",
    reviewed: "review",
    reviews: "review",
    reviewing: "review",
    risks: "risk",
    released: "release",
    releasing: "release",
    solutions: "solution",
    softwares: "software",
    stablecoins: "stablecoin",
    surveyed: "survey",
    surveying: "survey",
    surveys: "survey",
    techniques: "technique",
    trajectories: "trajectory",
    wallets: "wallet",
    ways: "way",
  }));

  const CONCEPT_LOOKUP = new Map();
  for (const family of CONCEPT_FAMILIES) {
    const normalized = new Set(family.map(token => TOKEN_LEMMAS.get(token) || token));
    for (const token of normalized) CONCEPT_LOOKUP.set(token, normalized);
  }

  const ANALYSIS_TERMS = new Set(["analyze", "assess", "compare", "evaluate", "review"]);
  const METHOD_TERMS = new Set(["approach", "category", "method", "model", "option", "solution", "technique", "way"]);
  const CUSTODY_TERMS = new Set(["custody", "hold"]);
  const stateCache = new WeakMap();

  function normalizeForMatch(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[-–—]/g, " ")
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizeEntityPhrases(value) {
    return String(value || "")
      .replace(/\bbit[\s-]+key\b/gi, "bitkey")
      .replace(/\bb[\s-]+key\b/gi, "bitkey");
  }

  function legacyTokenize(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/['’]/g, "")
      .match(/[a-z0-9]+/g)
      ?.filter(token => token.length > 1 && !LEGACY_STOP_WORDS.has(token))
      .map(token => {
        if (token.endsWith("ies") && token.length > 5) return token.slice(0, -3) + "y";
        if (token.endsWith("s") && token.length > 4) return token.slice(0, -1);
        return token;
      }) || [];
  }

  function searchTokenize(value, keepStopWords = false) {
    return normalizeEntityPhrases(value)
      .toLowerCase()
      .replace(/['’]/g, "")
      .match(/[a-z0-9]+/g)
      ?.filter(token => token.length > 1 && (keepStopWords || !SEARCH_STOP_WORDS.has(token)))
      .map(token => {
        if (TOKEN_LEMMAS.has(token)) return TOKEN_LEMMAS.get(token);
        if (token.endsWith("ies") && token.length > 5) return token.slice(0, -3) + "y";
        if (token.endsWith("s") && token.length > 4 && !token.endsWith("ss")) return token.slice(0, -1);
        return token;
      }) || [];
  }

  function fieldTokens(value) {
    const list = searchTokenize(value);
    const counts = new Map();
    for (const token of list) counts.set(token, (counts.get(token) || 0) + 1);
    return { list, counts, set: new Set(list) };
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function dateValue(value) {
    const time = Date.parse(value || "");
    return Number.isNaN(time) ? 0 : time;
  }

  function isoDateValue(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) return 0;
    return dateValue(value);
  }

  function extractQuotedPhrases(query) {
    const phrases = [];
    const pattern = /["“”]([^"“”]{2,})["“”]/g;
    let match;
    while ((match = pattern.exec(String(query || "")))) {
      const normalized = normalizeForMatch(match[1]);
      if (normalized) phrases.push(normalized);
    }
    return [...new Set(phrases)];
  }

  function extractTimecode(query) {
    const raw = String(query || "");
    const urlTime = raw.match(/[?&](?:t|start)=((?:\d+h)?(?:\d+m)?\d+s?|\d+)(?:&|$)/i);
    if (urlTime) {
      if (/^\d+s?$/i.test(urlTime[1])) return Number(urlTime[1].replace(/s$/i, ""));
      const hours = Number(urlTime[1].match(/(\d+)h/i)?.[1] || 0);
      const minutes = Number(urlTime[1].match(/(\d+)m/i)?.[1] || 0);
      const seconds = Number(urlTime[1].match(/(\d+)s/i)?.[1] || 0);
      return hours * 3600 + minutes * 60 + seconds;
    }
    const duration = raw.match(/\b(?:(\d+)h)?(?:(\d+)m)(?:(\d+)s)?\b/i);
    if (duration) return Number(duration[1] || 0) * 3600 + Number(duration[2]) * 60 + Number(duration[3] || 0);
    const clock = raw.match(/(?:^|[^\d])(\d{1,2}:\d{2}(?::\d{2})?)(?!\d)/);
    if (!clock) return null;
    const parts = clock[1].split(":").map(Number);
    return parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + parts[1];
  }

  function relativeYearIsComparison(query) {
    const norm = normalizeForMatch(query);
    return (
      /\b(?:half|one third|a third|one quarter|a quarter|twice|double) (?:of|than) (?:last|previous|this|current|next) year\b/.test(norm)
      || /\b(?:higher|lower|more|less|better|worse|ahead|behind)(?: [a-z0-9]+){0,3} than (?:last|previous|this|current|next) year\b/.test(norm)
      || /\b(?:up|down|rose|risen|fell|fallen|grew|grown|dropped|declined)(?: [a-z0-9]+){0,3} (?:from|since) (?:last|previous|this|current|next) year\b/.test(norm)
      || /\b(?:compared (?:to|with)|relative to|versus|vs) (?:last|previous|this|current|next) year\b/.test(norm)
      || /\b(?:last|previous|this|current|next) year(?: s)? (?:level|value|price|ratio|performance|figure|amount|total|share|rate)\b/.test(norm)
    );
  }

  function parseDateIntent(query) {
    const raw = String(query || "").toLowerCase();
    const norm = normalizeForMatch(query);
    let start = null;
    let end = null;
    const monthNumbers = {
      january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
      july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
    };
    const isoRange = raw.match(/\b(?:between|from)\s+(20\d{2}-\d{2}-\d{2})\s+(?:and|to|through|until)\s+(20\d{2}-\d{2}-\d{2})\b/);
    const isoBoundary = raw.match(/\b(before|after|since|on)\s+(20\d{2}-\d{2}-\d{2})\b/);
    const quarterRange = norm.match(/\b(?:between|from) q([1-4])(?: and| to| through| until) q([1-4]) (20\d{2})\b/);
    const quarterBoundary = norm.match(/\b(before|after|since|in|during) q([1-4])(?: of)? (20\d{2})\b/);
    const monthRange = norm.match(new RegExp(
      `\\b(?:between|from) (${Object.keys(monthNumbers).join("|")})(?: and| to| through| until) `
      + `(${Object.keys(monthNumbers).join("|")}) (20\\d{2})\\b`,
    ));
    const range = norm.match(/\b(?:between|from) (20\d{2})(?: and| to| through| until) (20\d{2})\b/);
    const monthBoundary = norm.match(new RegExp(
      `\\b(before|after|since|in|during) (${Object.keys(monthNumbers).join("|")}) (20\\d{2})\\b`,
    ));
    const relativeYear = relativeYearIsComparison(norm)
      ? null
      : norm.match(/\b(last|previous|this|current|next) year\b/);
    if (relativeYear) {
      const currentYear = new Date().getUTCFullYear();
      const offset = relativeYear[1] === "last" || relativeYear[1] === "previous"
        ? -1
        : relativeYear[1] === "next" ? 1 : 0;
      const year = currentYear + offset;
      start = Date.UTC(year, 0, 1);
      end = Date.UTC(year + 1, 0, 1) - 1;
    } else if (isoRange) {
      const first = dateValue(isoRange[1]);
      const second = dateValue(isoRange[2]);
      start = Math.min(first, second);
      end = Math.max(first, second) + 86400000 - 1;
    } else if (isoBoundary) {
      const value = dateValue(isoBoundary[2]);
      if (isoBoundary[1] === "before") end = value - 1;
      else if (isoBoundary[1] === "after") start = value + 86400000;
      else if (isoBoundary[1] === "since") start = value;
      else {
        start = value;
        end = value + 86400000 - 1;
      }
    } else if (quarterRange) {
      const year = Number(quarterRange[3]);
      const low = Math.min(Number(quarterRange[1]), Number(quarterRange[2])) - 1;
      const high = Math.max(Number(quarterRange[1]), Number(quarterRange[2]));
      start = Date.UTC(year, low * 3, 1);
      end = Date.UTC(year, high * 3, 1) - 1;
    } else if (quarterBoundary) {
      const operator = quarterBoundary[1];
      const quarter = Number(quarterBoundary[2]) - 1;
      const year = Number(quarterBoundary[3]);
      if (operator === "before") end = Date.UTC(year, quarter * 3, 1) - 1;
      else if (operator === "after") start = Date.UTC(year, (quarter + 1) * 3, 1);
      else if (operator === "since") start = Date.UTC(year, quarter * 3, 1);
      else {
        start = Date.UTC(year, quarter * 3, 1);
        end = Date.UTC(year, (quarter + 1) * 3, 1) - 1;
      }
    } else if (monthRange) {
      const year = Number(monthRange[3]);
      const low = Math.min(monthNumbers[monthRange[1]], monthNumbers[monthRange[2]]);
      const high = Math.max(monthNumbers[monthRange[1]], monthNumbers[monthRange[2]]);
      start = Date.UTC(year, low, 1);
      end = Date.UTC(year, high + 1, 1) - 1;
    } else if (monthBoundary) {
      const operator = monthBoundary[1];
      const month = monthNumbers[monthBoundary[2]];
      const year = Number(monthBoundary[3]);
      if (operator === "before") end = Date.UTC(year, month, 1) - 1;
      else if (operator === "after") start = Date.UTC(year, month + 1, 1);
      else if (operator === "since") start = Date.UTC(year, month, 1);
      else {
        start = Date.UTC(year, month, 1);
        end = Date.UTC(year, month + 1, 1) - 1;
      }
    } else if (range) {
      const low = Math.min(Number(range[1]), Number(range[2]));
      const high = Math.max(Number(range[1]), Number(range[2]));
      start = Date.UTC(low, 0, 1);
      end = Date.UTC(high, 11, 31, 23, 59, 59, 999);
    } else {
      const before = norm.match(/\b(?:before|earlier than|prior to) (20\d{2})\b/);
      const after = norm.match(/\b(?:after|later than) (20\d{2})\b/);
      const since = norm.match(/\bsince (20\d{2})\b/);
      const inYear = norm.match(/\b(?:in|during|from) (20\d{2})\b/);
      if (before) end = Date.UTC(Number(before[1]), 0, 1) - 1;
      else if (after) start = Date.UTC(Number(after[1]) + 1, 0, 1);
      else if (since) start = Date.UTC(Number(since[1]), 0, 1);
      else if (inYear) {
        start = Date.UTC(Number(inYear[1]), 0, 1);
        end = Date.UTC(Number(inYear[1]), 11, 31, 23, 59, 59, 999);
      }
    }
    return { start, end };
  }

  function parseSeriesIntent(query) {
    const norm = normalizeForMatch(query);
    const matches = new Set();
    let strength = 0;
    const aliases = [...SERIES_ALIASES.entries()].sort((a, b) => b[0].length - a[0].length);
    for (const [alias, canonical] of aliases) {
      const escaped = escapeRegExp(alias);
      if (new RegExp(`\\bseries\\s+${escaped}\\b|\\b${escaped}\\s+series\\b`).test(norm)) {
        matches.add(canonical);
        strength = Math.max(strength, 2);
      } else if (new RegExp(`\\b(?:from|within) (?:the )?${escaped}(?: series)?\\b`).test(norm)) {
        matches.add(canonical);
        strength = Math.max(strength, 2);
      } else if (new RegExp(`\\b${escaped} (?:episode|episodes|video|videos)\\b`).test(norm)) {
        matches.add(canonical);
        strength = Math.max(strength, 1);
      } else if (new RegExp(`\\b(?:what did|search|from|within) (?:the )?${escaped}\\b`).test(norm)) {
        matches.add(canonical);
        strength = Math.max(strength, 1);
      } else if (["pbj", "qbs", "bdw"].includes(alias) && new RegExp(`\\b${escaped}\\b`).test(norm)) {
        matches.add(canonical);
        strength = Math.max(strength, 1);
      }
    }
    // Colon syntax is deliberately parsed from the raw query because punctuation is
    // removed by normalizeForMatch.
    for (const [alias, canonical] of aliases) {
      if (new RegExp(`\\bseries\\s*:\\s*${escapeRegExp(alias)}\\b`, "i").test(String(query || ""))) {
        matches.add(canonical);
        strength = 3;
      }
    }
    return { values: matches, strength };
  }

  function parseCountIntent(query) {
    const norm = normalizeForMatch(query);
    const match = norm.match(/\b(?:how many|total number of|number of|count(?: the| all)?)\b\s*(.*)$/);
    if (!match) return { requested: false, target: null };
    const rest = match[1].replace(/^(?:(?:number of|of the|different|total) )+/, "");
    const optionalSeries = "(?:(?:pbj|qbs|bdw|builder|21 in 21) )?";
    if (new RegExp(`^${optionalSeries}(?:podcast )?(?:episodes?|videos?|shows?)\\b`).test(rest)) {
      return { requested: true, target: "episodes" };
    }
    if (/^(?:times?|mentions?|occurrences?|references?)\b/.test(rest)) {
      return { requested: true, target: "mentions" };
    }
    if (new RegExp(`^${optionalSeries}(?:sources?|topics?|entries|results?|items?|transcripts?|chunks?|records?)\\b`).test(rest)) {
      return { requested: true, target: "sources" };
    }
    if (/^.+\b(?:mentions?|occurrences?|references?)\b(?: (?:in|of|across) .*)?$/.test(rest)) {
      return { requested: true, target: "mentions" };
    }
    return { requested: true, target: "entities" };
  }

  function parseRequestedLimit(query) {
    const numberWords = new Map([
      ["one", 1], ["two", 2], ["three", 3], ["four", 4], ["five", 5],
      ["six", 6], ["seven", 7], ["eight", 8], ["nine", 9], ["ten", 10],
      ["eleven", 11], ["twelve", 12], ["thirteen", 13], ["fourteen", 14], ["fifteen", 15],
      ["sixteen", 16], ["seventeen", 17], ["eighteen", 18], ["nineteen", 19], ["twenty", 20],
    ]);
    const words = [...numberWords.keys()].join("|");
    const seriesWords = "pbj|qbs|bdw|builder|21 in 21";
    const match = normalizeForMatch(query).match(new RegExp(
      `\\b(\\d{1,3}|${words}) (?:(${seriesWords}) )?`
      + "(?:episodes?|videos?|results?|sources?|items?|moments?|passages?)\\b",
    ));
    if (!match) return null;
    const value = /^\d+$/.test(match[1]) ? Number(match[1]) : numberWords.get(match[1]);
    return value > 0 ? { value: Math.min(value, 100), token: match[1] } : null;
  }

  function hasBooleanOr(query) {
    const raw = String(query || "");
    const norm = normalizeForMatch(raw);
    if (/\bOR\b/.test(raw) || /\band\s*\/\s*or\b/i.test(raw) || /\beither\b.*\bor\b/.test(norm)) return true;
    if (!/\bor\b/.test(norm)) return false;
    if (/["“”][^"“”]+["“”]\s+or\s+["“”][^"“”]+["“”]/i.test(raw)) return true;
    const scrubbed = norm.replace(
      /\b(?:more or less|one or more|sooner or later|now or never|whether or not|or not|and or)\b/g,
      " ",
    );
    const pair = scrubbed.match(/\b([a-z0-9][a-z0-9-]*) or ([a-z0-9][a-z0-9-]*)\b/);
    if (!pair) return false;
    return searchTokenize(pair[1]).length > 0 && searchTokenize(pair[2]).length > 0;
  }

  function extractExclusions(query) {
    const raw = String(query || "");
    const phrases = [];
    let predicateNegation = false;
    let cleaned = raw.replace(/(?:^|\s)-([a-z][a-z0-9-]{2,})\b/gi, (whole, word) => {
      phrases.push(word);
      return " ";
    });
    const patterns = [
      {
        regex: /\b((?:do|does|did) not (?:discuss(?:es|ed|ing)?|mention(?:s|ed|ing)?|cover(?:s|ed|ing)?|reference(?:s|d|ing)?)|never (?:discuss(?:es|ed|ing)?|mention(?:s|ed|ing)?|cover(?:s|ed|ing)?|reference(?:s|d|ing)?))\s+([^,;.?!]+)/gi,
        predicate: true,
      },
      {
        regex: /\b(but not|without|exclud(?:e|ed|es|ing)|except(?: for)?|not about|unrelated to)\s+([^\n,;.?!]+)/gi,
        predicate: false,
      },
      {
        regex: /(?:^|\n)\s*(not)\s+([^\n,;.?!]+)\s*$/gi,
        predicate: false,
      },
    ];
    function capture(whole, operator, value, predicate) {
      if (predicate) predicateNegation = true;
      const bounded = value.split(/\b(?:from|within|during|before|after|between|when|while)\b/i)[0]
        .replace(/\b(?:please|in the archive)\b.*$/i, " ")
        .trim();
      if (bounded) {
        for (const part of bounded.split(/\s+(?:and|or)\s+/i)) {
          if (part.trim()) phrases.push(part.trim());
        }
      }
      return " ";
    }
    for (const { regex, predicate } of patterns) {
      cleaned = cleaned.replace(regex, (whole, operator, value) => capture(whole, operator, value, predicate));
    }
    const normalizedPhrases = [...new Set(phrases.map(normalizeForMatch).filter(Boolean))];
    for (const phrase of normalizedPhrases) {
      const escaped = escapeRegExp(phrase).split(" ").join("\\s+");
      cleaned = cleaned.replace(new RegExp(`\\b${escaped}\\b`, "gi"), " ");
    }
    return {
      cleaned,
      phrases: normalizedPhrases,
      predicateNegation,
    };
  }

  function youtubeIdFromQuery(query, state) {
    const raw = String(query || "");
    const urlMatch = raw.match(/(?:youtube\.com\/(?:watch\?[^\s#]*?v=|shorts\/|embed\/)|youtu\.be\/)([-_a-z0-9]{11})/i);
    if (urlMatch) return urlMatch[1];
    for (const id of state.videoIds) {
      if (id.length === 11 && raw.includes(id)) return id;
    }
    return "";
  }

  function youtubeIdFromTitle(query, state) {
    const norm = normalizeForMatch(query);
    for (const [title, ids] of state.titleIds) {
      if (ids.size !== 1) continue;
      if (norm === title || (title.length >= 24 && norm.includes(title))) return [...ids][0];
    }
    return "";
  }

  function stripIntentLanguage(query, intentParts) {
    let cleaned = intentParts.exclusions.cleaned
      .replace(/https?:\/\/\S+/gi, " ")
      .replace(/[?&](?:t|start)=\d+s?/gi, " ")
      .replace(/\b(?:\d+h)?(?:\d+m)(?:\d+s)?\b/gi, " ")
      .replace(/(?:^|[^\d])\d{1,2}:\d{2}(?::\d{2})?(?!\d)/g, " ")
      .replace(/\b(?:between|from)\s+20\d{2}-\d{2}-\d{2}\s+(?:and|to|through|until)\s+20\d{2}-\d{2}-\d{2}\b/gi, " ")
      .replace(/\b(?:before|after|since|on)\s+20\d{2}-\d{2}-\d{2}\b/gi, " ")
      .replace(/\b(?:between|from) q[1-4](?: and| to| through| until) q[1-4] 20\d{2}\b/gi, " ")
      .replace(/\b(?:before|after|since|in|during) q[1-4](?: of)? 20\d{2}\b/gi, " ")
      .replace(/\b(?:between|from) (?:january|february|march|april|may|june|july|august|september|october|november|december)(?: and| to| through| until) (?:january|february|march|april|may|june|july|august|september|october|november|december) 20\d{2}\b/gi, " ")
      .replace(/\b(?:before|after|since|in|during) (?:january|february|march|april|may|june|july|august|september|october|november|december) 20\d{2}\b/gi, " ")
      .replace(/\b(?:key|main) points?\b/gi, " ")
      .replace(/\b(?:between|from) 20\d{2}(?: and| to| through| until) 20\d{2}\b/gi, " ")
      .replace(/\b(?:before|after|since|during|in|earlier than|later than|prior to) 20\d{2}\b/gi, " ")
      .replace(/\b(?:last|previous|this|current|next) year\b/gi, " ")
      .replace(/\b20\d{2}\b/g, " ");
    if (intentParts.requestedLimit !== null && intentParts.requestedLimitToken) {
      const token = escapeRegExp(intentParts.requestedLimitToken);
      cleaned = cleaned.replace(new RegExp(
        `\\b${token}\\b(?=\\s+(?:(?:pbj|qbs|bdw|builder|21 in 21)\\s+)?`
        + "(?:episodes?|videos?|results?|sources?|items?|moments?|passages?)\\b)",
        "i",
      ), " ");
    }
    if (intentParts.videoId) cleaned = cleaned.split(intentParts.videoId).join(" ");
    for (const [alias] of [...SERIES_ALIASES.entries()].sort((a, b) => b[0].length - a[0].length)) {
      const escaped = escapeRegExp(alias).replace(/\\ /g, "\\s+");
      cleaned = cleaned
        .replace(new RegExp(`\\bseries\\s*:\\s*${escaped}\\b`, "gi"), " ")
        .replace(new RegExp(`\\b${escaped}\\s+(?:series|episode|episodes|video|videos)\\b`, "gi"), " ")
        .replace(new RegExp(`\\b(?:from|within)\\s+(?:the\\s+)?${escaped}(?:\\s+series)?\\b`, "gi"), " ");
    }
    if (intentParts.series?.values.size) {
      for (const [alias, canonical] of SERIES_ALIASES) {
        if (intentParts.series.values.has(canonical)) {
          cleaned = cleaned.replace(new RegExp(`\\b${escapeRegExp(alias)}\\b`, "gi"), " ");
        }
      }
    }
    if (intentParts.temporal) {
      cleaned = cleaned.replace(/\b(?:change|changed|changes|changing|evolve|evolved|evolution|over time|timeline)\b/gi, " ");
    }
    if (intentParts.earliest) cleaned = cleaned.replace(/\bfirst(?: ever| mention)?\b/gi, " ");
    if (intentParts.comparison) {
      cleaned = cleaned.replace(/\b(?:compare|compared|comparing|comparison|versus|vs|difference between)\b/gi, " ");
    }
    if (intentParts.countRequested) {
      cleaned = cleaned.replace(/\b(?:how many|total number of|number of|count(?: the| all)?)\b/gi, " ");
      if (intentParts.countTarget === "mentions") {
        cleaned = cleaned.replace(/\b(?:times?|mentions?|occurrences?|references?)\b/gi, " ");
      }
    }
    return cleaned.replace(/\s+/g, " ").trim();
  }

  function parseQueryIntent(query, state) {
    const norm = normalizeForMatch(query);
    let series = parseSeriesIntent(query);
    const exclusions = extractExclusions(query);
    const explicitVideoId = youtubeIdFromQuery(query, state);
    const titleVideoId = youtubeIdFromTitle(query, state);
    const videoId = explicitVideoId || titleVideoId;
    if (titleVideoId && !explicitVideoId && series.strength < 2) series = { values: new Set(), strength: 0 };
    const targetTime = extractTimecode(query);
    const date = parseDateIntent(query);
    const exactPhrases = extractQuotedPhrases(query);
    const count = parseCountIntent(query);
    const limitIntent = parseRequestedLimit(query);
    const requestedLimit = limitIntent?.value ?? null;
    const orderingNorm = relativeYearIsComparison(norm)
      ? norm.replace(/\b(?:last|previous|this|current|next) year(?: s)?\b/g, " ")
      : norm;
    const latest = /\b(?:current|latest|last|newest|most recent|recent|recently|today)\b/.test(orderingNorm);
    const earliest = /\b(?:earliest|oldest|first ever|first mention|first (?:\d{1,3}|one|two|three|four|five|six|seven|eight|nine|ten) (?:pbj |qbs |bdw |builder )?(?:episodes?|videos?))\b/.test(norm);
    const timestampRequest = targetTime !== null || /\b(?:time ?stamps?|time ?codes?|where (?:did|do)|at what time|when in)\b/.test(norm);
    const exhaustiveEpisodes = /\b(?:every|all) (?:pbj |qbs |bdw |builder )?(?:episodes?|videos?)\b/.test(norm);
    const everLookup = /\bever\b/.test(norm)
      && /\b(?:discuss(?:es|ed|ing)?|mention(?:s|ed|ing)?|cover(?:s|ed|ing)?|reference(?:s|d|ing)?|criticiz(?:e|es|ed|ing))\b/.test(norm);
    const explicitEpisodeMode = isEpisodeLookupQuery(query);
    const negationScope = exclusions.phrases.length
      ? ((explicitEpisodeMode || count.target === "episodes" || exclusions.predicateNegation) ? "episode" : "passage")
      : null;
    const complementRequested = negationScope === "episode";
    const aggregate = count.requested || exhaustiveEpisodes || everLookup || complementRequested;
    const episodeMode = explicitEpisodeMode || count.target === "episodes" || exhaustiveEpisodes || everLookup || complementRequested;
    const temporal = latest || earliest
      || /\b(?:over time|evolve|evolved|evolution|timeline|change|changed|changes|between 20\d{2})\b/.test(norm);
    const summary = /\b(?:summarize|summary|overview|recap|what happened|key points?|main points?)\b/.test(norm);
    const comparison = /\b(?:compare|compared|comparing|comparison|versus|vs|difference between)\b/.test(norm);
    const booleanOr = hasBooleanOr(query);
    const requiresFullScan = complementRequested || (count.requested
      && (count.target === "episodes" || count.target === "mentions" || count.target === "sources"));
    const parts = {
      exclusions, videoId, series, temporal, comparison, earliest,
      countRequested: count.requested, countTarget: count.target, requestedLimit,
      requestedLimitToken: limitIntent?.token || null,
    };
    const positiveQuery = stripIntentLanguage(query, parts);
    const protectedTopics = protectedTopicMatches(query, state.definitions);
    return {
      raw: String(query || ""), norm, positiveQuery, series, date, videoId, targetTime,
      exactPhrases, latest, earliest, timestampRequest, aggregate, episodeMode, temporal,
      summary, comparison, booleanOr, directTitle: Boolean(titleVideoId),
      countRequested: count.requested, countTarget: count.target, requestedLimit,
      negationScope, complementRequested, requiresFullScan,
      exclusionPhrases: exclusions.phrases, protectedTopics,
    };
  }

  function isBroadBitcoinQuery(query) {
    const norm = normalizeForMatch(query);
    if (!norm.includes("bitcoin")) return false;
    return /\b(future|broad|broadly|long term|longterm|where.*going|what.*next|thesis|outlook)\b/.test(norm);
  }

  function isEpisodeLookupQuery(query) {
    const norm = normalizeForMatch(query);
    const tokens = new Set(norm.split(" ").filter(Boolean));
    if ([...EPISODE_INTENT_WORDS].some(token => tokens.has(token))) return true;
    return /\b(which|what|find|identify)\b.*\bpbj\b/.test(norm);
  }

  function episodeSubjectQuery(query) {
    return String(query || "")
      .replace(/\btime[\s-]*stamps?\b/gi, " ")
      .replace(/\btime[\s-]*codes?\b/gi, " ")
      .replace(
        /\b(?:reference|references|referenced|referencing|mention|mentions|mentioned|mentioning)\s+(?:to|of)\b/gi,
        " ",
      );
  }

  function topicDefinitions(chunks) {
    const definitions = new Map();
    for (const chunk of chunks) {
      for (const topic of chunk.topics || []) {
        if (!definitions.has(topic)) definitions.set(topic, { name: topic, keywords: new Set() });
        for (const keyword of chunk.keywords || []) definitions.get(topic).keywords.add(keyword);
      }
    }
    return definitions;
  }

  function protectedTopicMatches(query, definitions) {
    const queryNorm = normalizeForMatch(query);
    const aliasTargets = new Set();
    for (const [alias, canonical] of Object.entries(TOPIC_ALIASES)) {
      if (queryNorm.includes(alias)) aliasTargets.add(canonical);
    }

    const full = [];
    const aliasMatches = [];
    const phrases = [];
    for (const definition of definitions.values()) {
      const topicNorm = normalizeForMatch(definition.name);
      if (queryNorm === topicNorm) {
        full.push({ name: definition.name, norm: topicNorm });
      } else if (aliasTargets.has(topicNorm)) {
        aliasMatches.push({ name: definition.name, norm: topicNorm });
      } else if (topicNorm !== "bitcoin" && topicNorm.split(" ").length > 1 && queryNorm.includes(topicNorm)) {
        phrases.push({ name: definition.name, norm: topicNorm });
      }
    }
    if (full.length) return new Set(full.map(item => item.name));

    // Prefer the most specific canonical topic over a shorter parent topic.
    const maximal = phrases.filter(candidate => !phrases.some(other => (
      other !== candidate && other.norm.length > candidate.norm.length && other.norm.includes(candidate.norm)
    )));
    if (maximal.length) return new Set(maximal.map(item => item.name));
    return new Set(aliasMatches.map(item => item.name));
  }

  function editDistanceAtMostOne(left, right) {
    if (left === right) return 0;
    if (Math.abs(left.length - right.length) > 1) return 2;
    if (left.length === right.length) {
      const differences = [];
      for (let i = 0; i < left.length; i += 1) if (left[i] !== right[i]) differences.push(i);
      if (differences.length === 1) return 1;
      if (differences.length === 2) {
        const [a, b] = differences;
        if (b === a + 1 && left[a] === right[b] && left[b] === right[a]) return 1;
      }
      return 2;
    }
    const shorter = left.length < right.length ? left : right;
    const longer = left.length < right.length ? right : left;
    let i = 0;
    let j = 0;
    let edits = 0;
    while (i < shorter.length && j < longer.length) {
      if (shorter[i] === longer[j]) {
        i += 1;
        j += 1;
      } else {
        edits += 1;
        j += 1;
        if (edits > 1) return 2;
      }
    }
    return 1;
  }

  function fuzzyToken(token, state) {
    if (!state || token.length < 5) return token;
    ensureSearchDf(state);
    if (state.searchDf.has(token)) return token;
    if (state.corrections.has(token)) return state.corrections.get(token);
    let best = token;
    let bestDf = 0;
    for (const [candidate, df] of state.searchDf) {
      if (candidate.length < 4 || Math.abs(candidate.length - token.length) > 1) continue;
      if (candidate[0] !== token[0] && candidate[1] !== token[0] && candidate[0] !== token[1]) continue;
      if (editDistanceAtMostOne(token, candidate) !== 1) continue;
      // Prefer established spellings that occur in more than one source. This avoids
      // "correcting" a query to a one-off ASR error.
      if (df > bestDf && df >= 2) {
        best = candidate;
        bestDf = df;
      }
    }
    state.corrections.set(token, best);
    return best;
  }

  function buildQueryConcepts(query, episodeMode = false, state = null) {
    const concepts = new Map();
    const subjectQuery = episodeMode ? episodeSubjectQuery(query) : query;
    const rawTokens = searchTokenize(subjectQuery);
    for (const rawToken of rawTokens) {
      if (episodeMode && rawToken === "pbj") continue;
      const token = fuzzyToken(rawToken, state);
      const family = CONCEPT_LOOKUP.get(token);
      let terms = new Set(family || [token]);
      let key = family ? [...family][0] : token;
      if (episodeMode && ANALYSIS_TERMS.has(token)) {
        key = "analysis";
        terms = new Set([
          ...ANALYSIS_TERMS,
          ...(token === "compare" ? ["comparison", "versus", "vs"] : []),
        ]);
      } else if (episodeMode && METHOD_TERMS.has(token)) {
        key = "method";
        terms = new Set(METHOD_TERMS);
      } else if (episodeMode && CUSTODY_TERMS.has(token)) {
        key = "custody";
        terms = new Set(CUSTODY_TERMS);
      } else if (token === "lending") {
        terms.add("loan");
      } else if (token === "loan") {
        terms.add("lending");
      } else if (token === "collateralized") {
        terms.add("backed");
      }
      if (!concepts.has(key)) concepts.set(key, { key, terms: new Set() });
      for (const term of terms) concepts.get(key).terms.add(term);
    }
    for (const phrase of PHRASE_CONCEPTS) {
      if (!phrase.pattern.test(subjectQuery)) continue;
      for (const consumed of phrase.consume || []) {
        const token = searchTokenize(consumed)[0] || consumed;
        const family = CONCEPT_LOOKUP.get(token);
        concepts.delete(family ? [...family][0] : token);
      }
      const key = phrase.terms[0];
      if (!concepts.has(key)) concepts.set(key, { key, terms: new Set() });
      for (const term of phrase.terms) concepts.get(key).terms.add(term);
    }
    return [...concepts.values()];
  }

  function softTopicMatches(query, definitions, state = null) {
    const queryConcepts = buildQueryConcepts(query, true, state);
    const queryTerms = new Set(queryConcepts.flatMap(concept => [...concept.terms]));
    const matches = new Map();

    function covered(tokens) {
      const meaningful = tokens.filter(token => token !== "bitcoin" && token !== "pbj");
      return meaningful.length && meaningful.every(token => queryTerms.has(token));
    }

    for (const definition of definitions.values()) {
      const nameTokens = searchTokenize(definition.name);
      if (covered(nameTokens)) matches.set(definition.name, 1);
      for (const keyword of definition.keywords) {
        if (covered(searchTokenize(keyword))) {
          matches.set(definition.name, Math.max(matches.get(definition.name) || 0, 1.35));
        }
      }
    }
    return matches;
  }

  function sourceKey(chunk) {
    return chunk.id || `${chunk.title}|${chunk.t || chunk.section || chunk.url}`;
  }

  function momentKey(chunk) {
    if (chunk.type === "report") return `report|${sourceKey(chunk)}`;
    return `${chunk.youtube_id || chunk.title}|${Math.round((chunk.t || 0) / 30)}`;
  }

  function selectFromScored(scored, limit, options = {}) {
    const selected = [];
    const seenSource = new Set();
    const seenMoment = new Set();
    const perTitle = new Map();

    function add(item, allowSameTitle = false) {
      const source = sourceKey(item.chunk);
      const moment = momentKey(item.chunk);
      if (seenSource.has(source) || (!options.allowSameMoment && seenMoment.has(moment))) return false;
      const titleCount = perTitle.get(item.chunk.title) || 0;
      const titleLimit = item.chunk.type === "report"
        ? (options.reportPerTitle || 5)
        : (options.perTitleLimit || 2);
      if (!allowSameTitle && titleCount >= titleLimit) return false;
      selected.push({ ...item.chunk, score: Number(item.score.toFixed(3)) });
      seenSource.add(source);
      seenMoment.add(moment);
      perTitle.set(item.chunk.title, titleCount + 1);
      return true;
    }

    for (const item of options.pinned || []) {
      add(item, true);
      if (selected.length >= limit) return selected;
    }
    for (const item of scored) {
      if (options.skipTopic && item.chunk.type === "topic" && options.skipTopic(item.chunk)) continue;
      add(item, false);
      if (selected.length >= limit) break;
    }
    return selected;
  }

  function prepareChunk(chunk) {
    const fields = {
      title: fieldTokens(chunk.title),
      series: fieldTokens(chunk.series),
      topics: fieldTokens((chunk.topics || []).join(" ")),
      keywords: fieldTokens((chunk.keywords || []).join(" ")),
      text: fieldTokens(chunk.text),
    };
    const combined = new Map();
    for (const field of Object.values(fields)) {
      for (const [token, count] of field.counts) combined.set(token, (combined.get(token) || 0) + count);
    }
    return {
      chunk,
      fields,
      combined,
      normalized: normalizeForMatch(
        `${chunk.title || ""} ${chunk.series || ""} ${(chunk.topics || []).join(" ")} `
        + `${(chunk.keywords || []).join(" ")} ${chunk.section || ""} ${chunk.text || ""}`,
      ),
    };
  }

  function buildState(chunks) {
    const titleIds = new Map();
    for (const chunk of chunks) {
      const id = chunk.youtube_id || youtubeIdFromUrl(chunk.url);
      const title = normalizeForMatch(chunk.title);
      if (!id || !title) continue;
      if (!titleIds.has(title)) titleIds.set(title, new Set());
      titleIds.get(title).add(id);
    }
    return {
      chunks,
      definitions: topicDefinitions(chunks),
      legacyDf: null,
      searchDf: null,
      episodes: null,
      prepared: null,
      preparedByChunk: new WeakMap(),
      corrections: new Map(),
      videoIds: new Set(chunks.map(chunk => chunk.youtube_id || youtubeIdFromUrl(chunk.url)).filter(Boolean)),
      titleIds: [...titleIds.entries()].sort((a, b) => b[0].length - a[0].length),
    };
  }

  function getState(chunks) {
    if (!stateCache.has(chunks)) stateCache.set(chunks, buildState(chunks));
    return stateCache.get(chunks);
  }

  function ensureLegacyDf(state) {
    if (state.legacyDf) return state.legacyDf;
    const df = new Map();
    for (const chunk of state.chunks) {
      const tokens = new Set(legacyTokenize(`${chunk.title} ${chunk.series} ${(chunk.topics || []).join(" ")} ${chunk.text}`));
      for (const token of tokens) df.set(token, (df.get(token) || 0) + 1);
    }
    state.legacyDf = df;
    return df;
  }

  function ensureSearchDf(state) {
    if (state.searchDf) return state.searchDf;
    const df = new Map();
    const prepared = state.prepared || state.chunks.map(prepareChunk);
    state.prepared = prepared;
    for (const item of prepared) state.preparedByChunk.set(item.chunk, item);
    for (const item of prepared) {
      for (const token of item.combined.keys()) df.set(token, (df.get(token) || 0) + 1);
    }
    state.searchDf = df;
    return df;
  }

  function ensurePrepared(state) {
    ensureSearchDf(state);
    return state.prepared;
  }

  function preparedFor(state, chunk) {
    ensurePrepared(state);
    return state.preparedByChunk.get(chunk) || prepareChunk(chunk);
  }

  function legacyScore(chunk, queryTokens, queryPhrase, state, matchedTopics) {
    const haystack = `${chunk.title} ${chunk.series} ${(chunk.topics || []).join(" ")} ${chunk.text}`.toLowerCase();
    let score = 0;
    const topicMatched = (chunk.topics || []).some(topic => matchedTopics.has(topic));
    for (const token of queryTokens) {
      const tf = (haystack.match(new RegExp(`\\b${escapeRegExp(token)}\\b`, "g")) || []).length;
      if (!tf) continue;
      const idf = Math.log(1 + state.chunks.length / (1 + (state.legacyDf.get(token) || 0)));
      score += Math.min(tf, 5) * idf;
      if ((chunk.title || "").toLowerCase().includes(token)) score += 2.5;
      if ((chunk.series || "").toLowerCase().includes(token)) score += 1.5;
      if ((chunk.topics || []).some(topic => topic.toLowerCase().includes(token))) score += 2;
    }
    if (queryPhrase.length > 5 && haystack.includes(queryPhrase)) score += 8;
    if (topicMatched) score += chunk.type === "topic" ? 60 : 28;
    if (chunk.type === "topic") score *= 1.2;
    if (chunk.type === "report") score *= 1.15;
    return score;
  }

  function legacyScored(state, query, matchedTopics = new Set()) {
    ensureLegacyDf(state);
    const queryTokens = [...new Set(legacyTokenize(query))];
    const queryPhrase = String(query || "").toLowerCase().trim();
    return state.chunks
      .map(chunk => ({ chunk, score: legacyScore(chunk, queryTokens, queryPhrase, state, matchedTopics) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  function retrieveProtectedTopic(state, query, topics, limit) {
    const scored = legacyScored(state, query, topics);
    const topicPinned = scored
      .filter(item => item.chunk.type === "topic" && (item.chunk.topics || []).some(topic => topics.has(topic)))
      .sort((a, b) => dateValue(b.chunk.date) - dateValue(a.chunk.date) || b.score - a.score);
    const isReportQuery = [...topics].some(topic => normalizeForMatch(topic).includes("quantum readiness report"));
    const reportPinned = isReportQuery
      ? scored
        .filter(item => item.chunk.type === "report")
        .sort((a, b) => b.score - a.score)
        .slice(0, Math.min(5, limit))
      : [];
    const pinned = isReportQuery ? [...reportPinned, ...topicPinned] : topicPinned;
    return selectFromScored(scored, limit, {
      pinned,
      skipTopic: chunk => !(chunk.topics || []).some(topic => topics.has(topic)),
    });
  }

  function retrieveBroadBitcoin(state, query, limit, intent = null) {
    const scored = legacyScored(state, query)
      .filter(item => !intent || passesDateAndSeries(item.chunk, intent));
    const available = new Set(state.chunks.flatMap(chunk => chunk.topics || []));
    const pinned = [];
    for (const topic of BROAD_BITCOIN_TOPICS.filter(topic => available.has(topic))) {
      const item = scored
        .filter(candidate => candidate.chunk.type === "topic" && (candidate.chunk.topics || []).includes(topic))
        .sort((a, b) => dateValue(b.chunk.date) - dateValue(a.chunk.date) || b.score - a.score)[0];
      if (item) pinned.push(item);
    }
    return selectFromScored(scored, limit, { pinned });
  }

  function idfFor(state, token) {
    ensureSearchDf(state);
    return Math.log(1 + state.chunks.length / (1 + (state.searchDf.get(token) || 0)));
  }

  function phraseMatchesNormalized(normalized, phrases, any = false) {
    if (any) return phrases.some(phrase => normalized.includes(phrase));
    return phrases.every(phrase => normalized.includes(phrase));
  }

  function conceptMatchesPrepared(concept, item) {
    return [...concept.terms].some(term => item.combined.has(term));
  }

  function conceptMatchesSet(concept, set) {
    return [...concept.terms].some(term => set.has(term));
  }

  function matchedConceptIdf(concept, set, state) {
    const values = [...concept.terms].filter(term => set.has(term)).map(term => idfFor(state, term));
    return values.length ? Math.max(...values) : 0;
  }

  function minimumCoverage(conceptCount, booleanOr = false) {
    if (booleanOr) return conceptCount ? 1 : 0;
    if (conceptCount <= 1) return conceptCount;
    if (conceptCount <= 3) return conceptCount;
    return Math.max(2, Math.ceil(conceptCount * 0.45));
  }

  function passesDateAndSeries(chunk, intent) {
    if (intent.series.values.size && !intent.series.values.has(chunk.series)) return false;
    if (intent.date.start !== null || intent.date.end !== null) {
      const value = isoDateValue(chunk.date);
      if (!value) return false;
      if (intent.date.start !== null && value < intent.date.start) return false;
      if (intent.date.end !== null && value > intent.date.end) return false;
    }
    return true;
  }

  function exclusionConcepts(intent, state) {
    return intent.exclusionPhrases
      .map(phrase => buildQueryConcepts(phrase, false, state))
      .filter(group => group.length);
  }

  function containsExclusion(item, exclusions) {
    return exclusions.some(group => group.every(concept => conceptMatchesPrepared(concept, item)));
  }

  function groupContainsExclusion(group, exclusions) {
    return exclusions.some(exclusion => exclusion.every(concept => conceptMatchesSet(concept, group.allTokens)));
  }

  function phraseBonus(item, phrases, state) {
    let score = 0;
    for (const phrase of phrases) {
      if (!item.normalized.includes(phrase)) continue;
      const tokens = searchTokenize(phrase);
      score += 12 + tokens.reduce((total, token) => total + idfFor(state, token), 0);
    }
    return score;
  }

  function compareByIntent(a, b, intent) {
    const aDate = isoDateValue(a.chunk?.date || a.group?.date);
    const bDate = isoDateValue(b.chunk?.date || b.group?.date);
    if (intent.latest && aDate !== bDate) return bDate - aDate;
    if (intent.earliest && aDate !== bDate) return aDate - bDate;
    if (intent.temporal && aDate !== bDate) return aDate - bDate;
    return b.score - a.score || bDate - aDate;
  }

  function spreadAcrossTimeline(items, count) {
    if (items.length <= count || count <= 1) return items.slice(0, count);
    const selected = [];
    const seen = new Set();
    for (let index = 0; index < count; index += 1) {
      const position = Math.round(index * (items.length - 1) / (count - 1));
      if (!seen.has(position)) {
        selected.push(items[position]);
        seen.add(position);
      }
    }
    return selected;
  }

  function isSpecificBroadBitcoinQuery(intent) {
    if (!isBroadBitcoinQuery(intent.raw)) return false;
    const terms = searchTokenize(intent.positiveQuery);
    return !terms.some(term => !BROAD_QUERY_FILLER.has(term));
  }

  function bestConceptMatch(concept, fields, state, weights) {
    let best = 0;
    for (const term of concept.terms) {
      const idf = idfFor(state, term);
      let termScore = 0;
      for (const [fieldName, weight] of Object.entries(weights)) {
        if (fields[fieldName]?.set.has(term)) termScore = Math.max(termScore, weight * idf);
      }
      best = Math.max(best, termScore);
    }
    return best;
  }

  function scorePreparedChunk(item, concepts, state, softTopics) {
    let score = 0;
    let covered = 0;
    let coveredIdf = 0;
    let textCovered = 0;
    let textCoveredIdf = 0;
    for (const concept of concepts) {
      let best = 0;
      for (const term of concept.terms) {
        const tf = item.combined.get(term) || 0;
        if (!tf) continue;
        const idf = idfFor(state, term);
        let termScore = Math.min(tf, 5) * idf;
        if (item.fields.title.set.has(term)) termScore += 2.5;
        if (item.fields.series.set.has(term)) termScore += 1.5;
        if (item.fields.topics.set.has(term)) termScore += 2;
        if (item.fields.keywords.set.has(term)) termScore += 2;
        best = Math.max(best, termScore);
      }
      score += best;
      if (best > 0) {
        covered += 1;
        coveredIdf += matchedConceptIdf(concept, item.combined, state);
      }
      if ([...concept.terms].some(term => item.fields.text.set.has(term))) {
        textCovered += 1;
        textCoveredIdf += matchedConceptIdf(concept, item.fields.text.set, state);
      }
    }
    const coverageRatio = concepts.length ? covered / concepts.length : 0;
    const textCoverageRatio = concepts.length ? textCovered / concepts.length : 0;
    score += coveredIdf * (0.5 + 1.5 * coverageRatio);
    score += textCoveredIdf * (0.75 + 2 * textCoverageRatio);
    if (concepts.length > 1 && textCovered === concepts.length) {
      score += textCoveredIdf * 2;
      const span = minimumConceptSpan(concepts, item.fields.text.list);
      if (span !== null) score += textCoveredIdf * (3 / Math.log2(span + 2));
    }
    const topicStrength = Math.max(0, ...(item.chunk.topics || []).map(topic => softTopics.get(topic) || 0));
    if (topicStrength) score += topicStrength * (item.chunk.type === "topic" ? 16 : 6);
    if (item.chunk.type === "topic") score *= 1.08;
    if (item.chunk.type === "report") score *= 1.08;
    return score;
  }

  function buildEpisodes(state) {
    const groups = new Map();
    for (const chunk of state.chunks) {
      const id = chunk.youtube_id || youtubeIdFromUrl(chunk.url);
      if (!id || chunk.type === "report") continue;
      if (!groups.has(id)) {
        groups.set(id, {
          id,
          title: chunk.title,
          series: chunk.series,
          date: chunk.date,
          items: [],
          topicNames: new Set(),
          fields: {
            title: { set: new Set(searchTokenize(chunk.title)) },
            topics: { set: new Set() },
            keywords: { set: new Set() },
            description: { set: new Set() },
            topicText: { set: new Set() },
            transcript: { set: new Set() },
          },
          allTokens: new Set(),
          normalizedItems: [],
        });
      }
      const group = groups.get(id);
      group.items.push(chunk);
      const normalized = normalizeForMatch(
        `${chunk.title || ""} ${(chunk.topics || []).join(" ")} ${(chunk.keywords || []).join(" ")} ${chunk.text || ""}`,
      );
      group.normalizedItems.push(normalized);
      for (const topic of chunk.topics || []) group.topicNames.add(topic);
      addFieldTokens(group.fields.topics.set, (chunk.topics || []).join(" "));
      addFieldTokens(group.fields.keywords.set, (chunk.keywords || []).join(" "));
      if (chunk.type === "description") addFieldTokens(group.fields.description.set, chunk.text);
      else if (chunk.type === "topic") addFieldTokens(group.fields.topicText.set, chunk.text);
      else if (chunk.type === "transcript") addFieldTokens(group.fields.transcript.set, chunk.text);
      addFieldTokens(group.allTokens, normalized);
    }
    return [...groups.values()];
  }

  function addFieldTokens(target, value) {
    for (const token of searchTokenize(value)) target.add(token);
  }

  function ensureEpisodes(state) {
    if (!state.episodes) state.episodes = buildEpisodes(state);
    return state.episodes;
  }

  function youtubeIdFromUrl(value) {
    const match = String(value || "").match(/[?&]v=([^&]+)/);
    return match ? match[1] : "";
  }

  function passageScore(chunk, concepts, state) {
    const prepared = preparedFor(state, chunk);
    const fields = prepared.fields;
    const typeWeights = chunk.type === "description"
      ? { text: 2.5, topics: 2, keywords: 2 }
      : chunk.type === "topic"
        ? { text: 2, topics: 3, keywords: 3 }
        : { text: 1, topics: 2, keywords: 2 };
    let score = 0;
    let covered = 0;
    let coveredIdf = 0;
    let textCovered = 0;
    let textCoveredIdf = 0;
    const matchedFields = new Set([
      ...fields.text.set,
      ...fields.topics.set,
      ...fields.keywords.set,
    ]);
    for (const concept of concepts) {
      const conceptIdf = matchedConceptIdf(concept, matchedFields, state);
      const match = bestConceptMatch(concept, fields, state, typeWeights);
      if (match > 0) {
        score += match;
        covered += 1;
        coveredIdf += conceptIdf;
      }
      const textMatch = bestConceptMatch(concept, fields, state, { text: 1 });
      if (textMatch > 0) {
        textCovered += 1;
        textCoveredIdf += matchedConceptIdf(concept, fields.text.set, state);
      }
    }

    const coverageRatio = concepts.length ? covered / concepts.length : 0;
    const textCoverageRatio = concepts.length ? textCovered / concepts.length : 0;
    score += coveredIdf * (0.5 + coverageRatio);
    score += textCoveredIdf * (1 + 2 * textCoverageRatio);

    // A passage containing all requested concepts is stronger evidence than an episode
    // that happens to mention them in unrelated sections. Favor tighter co-occurrence,
    // while retaining whole-episode coverage as the outer ranking stage.
    if (concepts.length > 1 && textCovered === concepts.length) {
      score += textCoveredIdf * 2;
      const span = minimumConceptSpan(concepts, fields.text.list);
      if (span !== null) score += textCoveredIdf * (3 / Math.log2(span + 2));
    }
    return score;
  }

  function minimumConceptSpan(concepts, tokens) {
    const matches = [];
    tokens.forEach((token, position) => {
      concepts.forEach((concept, conceptIndex) => {
        if (concept.terms.has(token)) matches.push({ position, conceptIndex });
      });
    });
    if (!matches.length) return null;

    const counts = new Array(concepts.length).fill(0);
    let covered = 0;
    let left = 0;
    let best = Infinity;
    for (let right = 0; right < matches.length; right += 1) {
      const rightMatch = matches[right];
      if (counts[rightMatch.conceptIndex] === 0) covered += 1;
      counts[rightMatch.conceptIndex] += 1;
      while (covered === concepts.length && left <= right) {
        best = Math.min(best, rightMatch.position - matches[left].position + 1);
        const leftMatch = matches[left];
        counts[leftMatch.conceptIndex] -= 1;
        if (counts[leftMatch.conceptIndex] === 0) covered -= 1;
        left += 1;
      }
    }
    return Number.isFinite(best) ? best : null;
  }

  function scoreEpisode(group, concepts, state, softTopics) {
    const weights = { title: 5, topics: 3, keywords: 3, description: 2.5, topicText: 2, transcript: 1 };
    let metadata = 0;
    let coveredIdf = 0;
    let covered = 0;
    const matched = new Set(Object.values(group.fields).flatMap(field => [...field.set]));
    for (const concept of concepts) {
      const match = bestConceptMatch(concept, group.fields, state, weights);
      if (match > 0) {
        metadata += match;
        covered += 1;
        coveredIdf += matchedConceptIdf(concept, matched, state);
      }
    }
    const locals = group.items.map(item => passageScore(item, concepts, state)).sort((a, b) => b - a);
    const localScore = (locals[0] || 0) + 0.35 * (locals[1] || 0) + 0.15 * (locals[2] || 0);
    const coverageRatio = concepts.length ? covered / concepts.length : 0;
    const coverageScore = coveredIdf * (1 + 2 * coverageRatio);
    const softTopicScore = Math.max(0, ...[...group.topicNames].map(topic => softTopics.get(topic) || 0)) * 5;
    return metadata + localScore + coverageScore + softTopicScore;
  }

  function retrieveEpisodes(state, intent, limit) {
    const concepts = buildQueryConcepts(intent.positiveQuery, true, state);
    const softTopics = softTopicMatches(intent.positiveQuery, state.definitions, state);
    const exclusions = exclusionConcepts(intent, state);
    const negateWholeEpisode = intent.negationScope === "episode";
    const ranked = ensureEpisodes(state)
      .filter(group => passesDateAndSeries(group, intent))
      .filter(group => (
        !intent.exactPhrases.length
        || (intent.booleanOr
          ? intent.exactPhrases.some(phrase => group.normalizedItems.some(text => text.includes(phrase)))
          : intent.exactPhrases.every(phrase => group.normalizedItems.some(text => text.includes(phrase))))
      ))
      .filter(group => !negateWholeEpisode || !groupContainsExclusion(group, exclusions))
      .map(group => {
        const covered = concepts.filter(concept => conceptMatchesSet(concept, group.allTokens)).length;
        const score = concepts.length ? scoreEpisode(group, concepts, state, softTopics) : 1;
        return { group, score, covered };
      })
      .filter(item => {
        if (!concepts.length) return intent.latest || intent.earliest || intent.aggregate;
        return item.covered >= minimumCoverage(concepts.length, intent.booleanOr) && item.score > 0;
      })
      .sort((a, b) => compareByIntent(a, b, intent));

    const episodesToVisit = intent.temporal && !intent.latest && !intent.earliest
      ? spreadAcrossTimeline(ranked, limit)
      : ranked;
    const selected = [];
    const seenSources = new Set();
    const seenMoments = new Set();
    function passageCandidates(episode) {
      const ranked = episode.group.items
        .filter(chunk => passesDateAndSeries(chunk, intent))
        .map(chunk => {
          const prepared = preparedFor(state, chunk);
          if (containsExclusion(prepared, exclusions)) return null;
          if (intent.exactPhrases.length
            && !phraseMatchesNormalized(
              prepared.normalized,
              intent.exactPhrases,
              intent.booleanOr || intent.comparison,
            )) return null;
          let score = concepts.length ? passageScore(chunk, concepts, state) : 0;
          score += phraseBonus(prepared, intent.exactPhrases, state);
          if (intent.timestampRequest && chunk.type === "transcript") score += 8;
          if (intent.targetTime !== null && typeof chunk.t === "number") {
            score += Math.max(0, 12 - Math.abs(chunk.t - intent.targetTime) / 15);
          }
          return { chunk, score };
        })
        .filter(Boolean)
        .filter(item => !concepts.length || item.score > 0)
        .sort((a, b) => (
          (intent.timestampRequest
            ? Number(typeof b.chunk.t === "number") - Number(typeof a.chunk.t === "number")
            : 0)
          || b.score - a.score
          || representativeTypePreference(b.chunk.type, false) - representativeTypePreference(a.chunk.type, false)
        ));
      // A curated topic can identify the right moment more precisely than the raw
      // transcript window. For an explicit episode-and-timestamp lookup, use that
      // topic as the anchor but lead with nearby transcript evidence when available.
      const anchor = ranked[0];
      if (intent.timestampRequest && intent.episodeMode
        && anchor?.chunk.type === "topic" && typeof anchor.chunk.t === "number") {
        const nearbyTranscript = ranked
          .filter(candidate => (
            candidate.chunk.type === "transcript"
            && typeof candidate.chunk.t === "number"
            && Math.abs(candidate.chunk.t - anchor.chunk.t) <= 120
          ))
          .sort((a, b) => (
            Math.abs(a.chunk.t - anchor.chunk.t) - Math.abs(b.chunk.t - anchor.chunk.t)
            || b.score - a.score
          ))[0];
        if (nearbyTranscript) {
          return [nearbyTranscript, ...ranked.filter(candidate => candidate !== nearbyTranscript)];
        }
      }
      return ranked;
    }

    for (let episodeIndex = 0; episodeIndex < episodesToVisit.length && selected.length < limit; episodeIndex += 1) {
      const episode = episodesToVisit[episodeIndex];
      const candidates = passageCandidates(episode);
      if (!candidates.length) continue;
      const bundleSize = episodeIndex === 0
        ? Math.min(
          (intent.aggregate || intent.temporal || intent.requestedLimit !== null) ? 1 : (intent.summary ? 3 : 2),
          limit - selected.length,
        )
        : 1;
      let orderedCandidates = candidates;
      if (intent.comparison && bundleSize > 1) {
        const remaining = [...candidates];
        const coveredConcepts = new Set();
        orderedCandidates = [];
        while (remaining.length) {
          remaining.sort((left, right) => {
            const newCoverage = candidate => concepts.reduce((count, concept, index) => (
              count + (!coveredConcepts.has(index) && conceptMatchesPrepared(concept, preparedFor(state, candidate.chunk)) ? 1 : 0)
            ), 0);
            return newCoverage(right) - newCoverage(left) || right.score - left.score;
          });
          const chosen = remaining.shift();
          orderedCandidates.push(chosen);
          concepts.forEach((concept, index) => {
            if (conceptMatchesPrepared(concept, preparedFor(state, chosen.chunk))) coveredConcepts.add(index);
          });
        }
      } else if (intent.timestampRequest && bundleSize > 1 && candidates[0]) {
        const first = candidates[0];
        const firstTime = Number(first.chunk.t);
        orderedCandidates = [first, ...candidates.slice(1).sort((left, right) => {
          const neighborRank = candidate => (
            candidate.chunk.id === first.chunk.prev_id || candidate.chunk.id === first.chunk.next_id
              || candidate.chunk.prev_id === first.chunk.id || candidate.chunk.next_id === first.chunk.id
              ? 0
              : 1
          );
          const rankDelta = neighborRank(left) - neighborRank(right);
          if (rankDelta) return rankDelta;
          if (Number.isFinite(firstTime)) {
            const leftDistance = Number.isFinite(Number(left.chunk.t)) ? Math.abs(Number(left.chunk.t) - firstTime) : Infinity;
            const rightDistance = Number.isFinite(Number(right.chunk.t)) ? Math.abs(Number(right.chunk.t) - firstTime) : Infinity;
            if (leftDistance !== rightDistance) return leftDistance - rightDistance;
          }
          return right.score - left.score;
        })];
      }
      let added = 0;
      for (const candidate of orderedCandidates) {
        const source = sourceKey(candidate.chunk);
        const moment = momentKey(candidate.chunk);
        if (seenSources.has(source) || seenMoments.has(moment)) continue;
        selected.push({
          ...candidate.chunk,
          score: Number((episode.score + candidate.score / 10).toFixed(3)),
        });
        seenSources.add(source);
        seenMoments.add(moment);
        added += 1;
        if (added >= bundleSize || selected.length >= limit) break;
      }
    }
    return selected;
  }

  function typePreference(type) {
    if (type === "description") return 3;
    if (type === "topic") return 2;
    return 1;
  }

  function representativeTypePreference(type, requiresTimestamp) {
    if (!requiresTimestamp) return typePreference(type);
    if (type === "transcript") return 3;
    if (type === "topic") return 2;
    return 1;
  }

  function retrieveDirectVideo(state, intent, limit) {
    const concepts = buildQueryConcepts(intent.positiveQuery, false, state);
    const exclusions = exclusionConcepts(intent, state);
    const softTopics = softTopicMatches(intent.positiveQuery, state.definitions, state);
    const candidates = ensurePrepared(state)
      .filter(item => item.chunk.youtube_id === intent.videoId || youtubeIdFromUrl(item.chunk.url) === intent.videoId)
      .filter(item => passesDateAndSeries(item.chunk, intent))
      .filter(item => !containsExclusion(item, exclusions))
      .filter(item => !intent.exactPhrases.length
        || phraseMatchesNormalized(item.normalized, intent.exactPhrases, intent.booleanOr || intent.comparison))
      .map(item => {
        let score = concepts.length
          ? scorePreparedChunk(item, concepts, state, softTopics)
          : typePreference(item.chunk.type);
        score += phraseBonus(item, intent.exactPhrases, state);
        if (intent.targetTime !== null) {
          if (item.chunk.type === "transcript") score += 30;
          if (typeof item.chunk.t === "number") {
            const distance = Math.abs(item.chunk.t - intent.targetTime);
            score += Math.max(0, 40 - distance / 3);
            // A transcript chunk begins at t and covers the following passage, so a
            // slightly earlier start is preferable to a slightly later one.
            if (item.chunk.t <= intent.targetTime && intent.targetTime - item.chunk.t <= 120) score += 12;
          }
        }
        return { chunk: item.chunk, score };
      })
      .filter(item => !concepts.length || item.score > 0)
      .sort((a, b) => {
        if (intent.targetTime !== null) {
          const aTranscript = a.chunk.type === "transcript" ? 1 : 0;
          const bTranscript = b.chunk.type === "transcript" ? 1 : 0;
          if (aTranscript !== bTranscript) return bTranscript - aTranscript;
          const distance = chunk => {
            if (typeof chunk.t !== "number") return Infinity;
            const delta = intent.targetTime - chunk.t;
            return delta >= 0 ? delta : Math.abs(delta) + 90;
          };
          const aDistance = distance(a.chunk);
          const bDistance = distance(b.chunk);
          if (aDistance !== bDistance) return aDistance - bDistance;
        }
        if (intent.timestampRequest) {
          const timedDelta = Number(typeof b.chunk.t === "number") - Number(typeof a.chunk.t === "number");
          if (timedDelta) return timedDelta;
        }
        return b.score - a.score || typePreference(b.chunk.type) - typePreference(a.chunk.type);
      });
    // A direct-video request deliberately permits several moments from the same title;
    // the normal cross-title diversity cap would otherwise discard useful context.
    return selectFromScored(candidates, limit, { pinned: candidates, allowSameMoment: true });
  }

  function retrieveGeneral(state, intent, limit) {
    const concepts = buildQueryConcepts(intent.positiveQuery, false, state);
    const softTopics = softTopicMatches(intent.positiveQuery, state.definitions, state);
    const exclusions = exclusionConcepts(intent, state);
    if (!concepts.length && !intent.exactPhrases.length) return [];
    const scored = ensurePrepared(state)
      .filter(item => passesDateAndSeries(item.chunk, intent))
      .filter(item => !containsExclusion(item, exclusions))
      .filter(item => !intent.exactPhrases.length
        || phraseMatchesNormalized(item.normalized, intent.exactPhrases, intent.booleanOr || intent.comparison))
      .map(item => {
        const covered = concepts.filter(concept => conceptMatchesPrepared(concept, item)).length;
        let score = scorePreparedChunk(item, concepts, state, softTopics);
        score += phraseBonus(item, intent.exactPhrases, state);
        if (intent.timestampRequest) score += item.chunk.type === "transcript" ? 8 : -2;
        if (intent.targetTime !== null && typeof item.chunk.t === "number") {
          score += Math.max(0, 10 - Math.abs(item.chunk.t - intent.targetTime) / 30);
        }
        return { chunk: item.chunk, score, covered };
      })
      .filter(item => {
        if (intent.exactPhrases.length) return item.score > 0;
        return item.covered >= minimumCoverage(concepts.length, intent.booleanOr || intent.comparison) && item.score > 0;
      })
      .sort((a, b) => (
        (intent.timestampRequest
          ? Number(typeof b.chunk.t === "number") - Number(typeof a.chunk.t === "number")
          : 0)
        || compareByIntent(a, b, intent)
      ));
    if (!scored.length) return [];
    const floor = scored[0].score * 0.12;
    const confident = scored.filter(item => item.score >= floor);
    const pinned = [];
    if (intent.comparison) {
      for (const concept of concepts) {
        const item = confident.find(candidate => conceptMatchesPrepared(concept, preparedFor(state, candidate.chunk)));
        if (item && !pinned.includes(item)) pinned.push(item);
      }
    }
    return selectFromScored(confident, limit, {
      pinned,
      perTitleLimit: intent.countTarget === "mentions" ? 5 : 2,
    });
  }

  function shouldPreserveProtectedTopic(intent) {
    if (!intent.protectedTopics.size) return false;
    if ([...intent.protectedTopics].some(topic => normalizeForMatch(topic) === intent.norm)) return true;
    if (intent.booleanOr) return false;
    if (intent.series.values.size || intent.date.start !== null || intent.date.end !== null) return false;
    if (intent.videoId || intent.targetTime !== null || intent.exclusionPhrases.length || intent.exactPhrases.length) return false;
    if (intent.latest || intent.earliest || intent.aggregate || intent.temporal) return false;
    if (intent.protectedTopics.size > 1 || /\b(?:compare|versus|vs|against)\b/.test(intent.norm)) return false;
    const protectedTokens = new Set(
      [...intent.protectedTopics].flatMap(topic => searchTokenize(topic)),
    );
    const qualifiers = new Set(
      searchTokenize(intent.positiveQuery).filter(token => !protectedTokens.has(token)),
    );
    if (qualifiers.size >= 2) return false;
    return true;
  }

  function retrieve(chunks, query, limit = 10) {
    if (!Array.isArray(chunks) || !String(query || "").trim()) return [];
    const safeLimit = Math.max(1, Math.min(100, Number(limit) || 10));
    const state = getState(chunks);
    const intent = parseQueryIntent(query, state);
    const effectiveLimit = intent.requestedLimit === null
      ? safeLimit
      : Math.min(safeLimit, intent.requestedLimit);
    const exactProtected = [...intent.protectedTopics]
      .some(topic => normalizeForMatch(topic) === intent.norm);
    if (intent.videoId && !(intent.directTitle && exactProtected)) {
      return retrieveDirectVideo(state, intent, effectiveLimit);
    }
    if (shouldPreserveProtectedTopic(intent)) {
      return retrieveProtectedTopic(state, query, intent.protectedTopics, effectiveLimit);
    }
    if (isSpecificBroadBitcoinQuery(intent)) return retrieveBroadBitcoin(state, query, effectiveLimit, intent);
    if (intent.episodeMode || intent.temporal || (intent.comparison && intent.timestampRequest)) {
      return retrieveEpisodes(state, intent, effectiveLimit);
    }
    return retrieveGeneral(state, intent, effectiveLimit);
  }

  // Rank navigation topics from the current request only. A topic must be
  // grounded in the query, or bridge the query to a distinctive term in one
  // of the strongest retrieved episodes; archive-wide repetition is only a
  // small capped corroboration signal and can never qualify a topic by itself.
  function relatedTopicNames(chunks, query, sources = [], limit = 6) {
    if (!Array.isArray(chunks) || !String(query || "").trim()) return [];
    const safeLimit = Math.max(1, Math.min(10, Number(limit) || 6));
    const definitions = topicDefinitions(chunks);
    if (isBroadBitcoinQuery(query)) {
      return BROAD_BITCOIN_TOPICS.filter(topic => definitions.has(topic)).slice(0, safeLimit);
    }

    const state = getState(chunks);
    const concepts = buildQueryConcepts(query, true, state)
      .filter(concept => !RELATED_INTENT_CONCEPTS.has(concept.key));
    if (!concepts.length) return [];

    const queryNorm = normalizeForMatch(query);
    const queryTerms = new Set(concepts.flatMap(concept => [...concept.terms]));
    const bestSourceScore = Number(sources[0]?.score) || 0;
    const primarySources = sources
      .filter((source, index) => index < 3 && source?.youtube_id && (
        !bestSourceScore || !Number(source.score) || Number(source.score) >= bestSourceScore * 0.75
      ));
    const primaryVideoIds = new Set(primarySources.map(source => source.youtube_id));
    const primarySourceTokens = new Map();
    for (const source of primarySources) {
      if (!primarySourceTokens.has(source.youtube_id)) primarySourceTokens.set(source.youtube_id, new Set());
      const target = primarySourceTokens.get(source.youtube_id);
      for (const token of searchTokenize(
        `${source.title || ""} ${source.text || ""} ${(source.topics || []).join(" ")} ${(source.keywords || []).join(" ")}`,
      )) target.add(token);
    }
    const candidates = new Map();

    function conceptWeight(concept, tokenSet) {
      let weight = 0;
      for (const term of concept.terms) {
        if (tokenSet.has(term)) weight = Math.max(weight, idfFor(state, term));
      }
      return weight;
    }

    for (const chunk of chunks) {
      if (chunk.type !== "topic" || !Array.isArray(chunk.topics)) continue;
      for (const topic of chunk.topics) {
        const topicNorm = normalizeForMatch(topic);
        if (!topicNorm || GENERIC_RELATED_TOPICS.has(topicNorm)) continue;
        const nameTokens = new Set(searchTokenize(topic));
        const evidenceTokens = new Set(searchTokenize(
          `${topic} ${chunk.text || ""} ${(chunk.keywords || []).join(" ")}`,
        ));
        const nameWeights = concepts.map(concept => conceptWeight(concept, nameTokens));
        const evidenceWeights = concepts.map(concept => conceptWeight(concept, evidenceTokens));
        const nameMatches = nameWeights.filter(Boolean).length;
        const evidenceMatches = evidenceWeights.filter(Boolean).length;
        const meaningfulNameTokens = [...nameTokens].filter(token => token !== "bitcoin");
        const directName = ` ${queryNorm} `.includes(` ${topicNorm} `) || (meaningfulNameTokens.length > 0
          && meaningfulNameTokens.every(token => queryTerms.has(token)));
        const primaryEpisode = primaryVideoIds.has(chunk.youtube_id);
        const sourceTokens = primarySourceTokens.get(chunk.youtube_id);
        const sourceBridge = primaryEpisode && sourceTokens
          ? meaningfulNameTokens.reduce((best, token) => (
            !queryTerms.has(token) && !RELATED_BRIDGE_STOP.has(token) && sourceTokens.has(token)
              ? Math.max(best, idfFor(state, token))
              : best
          ), 0)
          : 0;
        const multiConceptName = nameMatches >= Math.min(2, concepts.length);
        const multiConceptEvidence = evidenceMatches >= Math.min(2, concepts.length);
        const anchoredName = primaryEpisode && nameMatches > 0;
        const anchoredBridge = primaryEpisode && evidenceMatches > 0 && sourceBridge > 0;
        if (!directName && !multiConceptName && !multiConceptEvidence && !anchoredName && !anchoredBridge) continue;

        let score = directName ? 120 : 0;
        score += nameWeights.reduce((sum, value) => sum + value, 0) * 9;
        score += evidenceWeights.reduce((sum, value) => sum + value, 0) * 2.25;
        score += nameMatches * 12 + Math.min(evidenceMatches, 5) * 6;
        if (primaryEpisode) score += 28;
        score += sourceBridge * 5;

        const item = candidates.get(topic) || {
          name: topic,
          score: 0,
          directName: false,
          primaryEpisode: false,
          support: 0,
        };
        item.score = Math.max(item.score, score);
        item.directName ||= directName;
        item.primaryEpisode ||= primaryEpisode;
        item.support += 1;
        candidates.set(topic, item);
      }
    }

    const ranked = [...candidates.values()]
      .map(item => ({ ...item, score: item.score + Math.min(item.support, 4) * 3 }))
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
    if (!ranked.length) return [];
    const qualityFloor = ranked[0].score * 0.34;
    const confident = ranked
      .filter(item => item.directName || item.primaryEpisode || item.score >= qualityFloor)
      .map(item => item.name);
    const selected = [];
    const signatures = new Set();
    for (const name of confident) {
      const signature = searchTokenize(name).filter(token => token !== "bitcoin").sort().join(" ");
      if (!signature || signatures.has(signature)) continue;
      signatures.add(signature);
      selected.push(name);
      if (selected.length >= safeLimit) break;
    }
    return selected;
  }

  return {
    BROAD_BITCOIN_TOPICS,
    buildQueryConcepts,
    isBroadBitcoinQuery,
    isEpisodeLookupQuery,
    normalizeForMatch,
    parseQueryIntent: (query, chunks) => parseQueryIntent(query, getState(chunks)),
    protectedTopicMatches: (query, chunks) => protectedTopicMatches(query, topicDefinitions(chunks)),
    relatedTopicNames,
    retrieve,
    searchTokenize,
  };
});
