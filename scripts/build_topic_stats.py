#!/usr/bin/env python3
"""Build deterministic PBJ topic-explorer data from full transcripts.

Every timestamped transcript entry in every confidently identified full PBJ
episode is searched using canonical topic names and the keyword aliases returned
by ``extract_topics``.
Matches use Unicode-aware token boundaries, can cross adjacent timestamp-entry
boundaries, resolve nested aliases longest-first, and are collapsed to at most
one hit per canonical topic every 30 seconds.  The measurement is therefore a
deduplicated transcript-keyword census, not airtime or editorial topic picks.

Canonical topic-to-branch assignments still come from ``KNOWLEDGE_MAP`` and
``MAP_TOPIC_OVERRIDES`` in ``public/topics/index.html``.  A small, explicit
branch-to-explorer rollup produces the eight PBJ-specific outer categories.
"""

from __future__ import annotations

import argparse
import json
import re
import unicodedata
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Iterable, Mapping, Sequence

from build_index import parse_timestamp_entries, youtube_id_from_url
from build_search_chunks import extract_topics, read_catalog, slugify


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
TOPICS_PAGE = PUBLIC / "topics" / "index.html"
OUT = PUBLIC / "topic_stats.json"
DIAGNOSTICS_OUT = PUBLIC / "topic_stats_diagnostics.json"

SCHEMA_VERSION = 2
EXPECTED_EPISODE_COUNT = 79
DISPLAY_EPISODE_OFFSET = 2
TOP_EPISODE_LIMIT = 5
FALLBACK_TARGET = "Other Maps > Cross-cutting"
MENTION_COOLDOWN_SECONDS = 30
MAX_KEYWORD_SPAN_SECONDS = 15

OUTER_CLUSTER_ORDER = (
    "AI & Agents",
    "Payments, Lightning & Stablecoins",
    "Markets, Investing & Lending",
    "Custody, Wallets & Privacy",
    "Bitcoin Protocol & Security",
    "Mining, Energy & Compute",
    "Products, Builders & Open Source",
    "Policy, Geopolitics & Society",
)

# The existing Topics map remains the canonical assignment.  These are merely
# PBJ-explorer rollups of its category/branch pairs.
SOURCE_BRANCH_TO_OUTER = {
    ("AI & Agents", "Agents & apps"): "AI & Agents",
    ("AI & Agents", "Models & labs"): "AI & Agents",
    ("AI & Agents", "Compute & verification"): "Mining, Energy & Compute",
    ("Bitcoin as Money", "Savings & collateral"): "Markets, Investing & Lending",
    ("Bitcoin as Money", "Markets & macro"): "Markets, Investing & Lending",
    ("Bitcoin as Money", "Everyday money"): "Payments, Lightning & Stablecoins",
    ("Builders & Infrastructure", "Open-source projects"): (
        "Products, Builders & Open Source"
    ),
    ("Builders & Infrastructure", "Mining & energy"): "Mining, Energy & Compute",
    ("Builders & Infrastructure", "Product & distribution"): (
        "Products, Builders & Open Source"
    ),
    ("Other Maps", "Stablecoins & rails"): "Payments, Lightning & Stablecoins",
    ("Other Maps", "Prediction & coordination"): "Markets, Investing & Lending",
    # Main builds fail taxonomy validation before an unmapped topic can reach
    # this fallback.  Keeping it explicit makes fixture/future behavior total.
    ("Other Maps", "Cross-cutting"): "Policy, Geopolitics & Society",
    ("Policy & Society", "Regulation & advocacy"): "Policy, Geopolitics & Society",
    ("Policy & Society", "Geopolitics & human rights"): (
        "Policy, Geopolitics & Society"
    ),
    ("Policy & Society", "Culture & education"): "Policy, Geopolitics & Society",
    ("Protocol & Scaling", "Bitcoin Core & policy"): "Bitcoin Protocol & Security",
    ("Protocol & Scaling", "Lightning & layers"): (
        "Payments, Lightning & Stablecoins"
    ),
    ("Protocol & Scaling", "Quantum readiness"): "Bitcoin Protocol & Security",
    ("Wallets & Custody", "Self-custody UX"): "Custody, Wallets & Privacy",
    ("Wallets & Custody", "Privacy & rights"): "Custody, Wallets & Privacy",
    ("Wallets & Custody", "Names & identity"): "Custody, Wallets & Privacy",
}

# Exceptions are intentionally tiny and user-facing: governance belongs with
# policy, while Stacker News is a product/community rather than a market.
OUTER_TOPIC_EXCEPTIONS = {
    "ai governance": "Policy, Geopolitics & Society",
    "stacker news": "Products, Builders & Open Source",
    "stacker news non-custodial": "Products, Builders & Open Source",
}

# Single-word aliases are uniquely prone to ordinary-language false positives.
# Multiword variants for these concepts remain eligible.  The set is explicit,
# deterministic, and reported in diagnostics rather than silently inferred from
# the current corpus.
GENERIC_SINGLE_TOKEN_ALIASES = frozenset({
    "agent",
    "agents",
    "ai",
    "base",
    "bitcoin",
    "block",
    "cash",
    "core",
    "gold",
    "jack",
    "lightning",
    "market",
    "markets",
    "meta",
    "money",
    "policy",
    "privacy",
    "sat",
    "sats",
    "security",
    "spark",
    "strategy",
    "strike",
    "surge",
    "tax",
    "wallet",
    "wallets",
})

# Proper names are also often written as one token, so a blanket singleton ban
# hides real transcript coverage (for example Goose, Anthropic, OpenAI, and
# Lightspark).  Keep singleton matching default-deny, but admit this small set of
# corpus-audited canonical labels.  An entry only applies when the token is the
# topic's exact canonical name; ordinary aliases for that topic remain blocked.
AUDITED_CANONICAL_SINGLE_TOKEN_TOPICS = frozenset({
    "Alby",
    "Anchorwatch",
    "Anthropic",
    "Bitwise",
    "Cashu",
    "Cloudflare",
    "Codex",
    "Goose",
    "L402",
    "Lightspark",
    "Miniscript",
    "OpenAI",
    "SpaceX",
    "TaskFuel",
    "Vora",
    "Wavelength",
    "Worldcoin",
    "XStocks",
    "XXI",
    "Zcash",
})

# A few distinctive company/person tokens are intentionally shared across
# several hand-authored topic definitions.  Resolve only these audited aliases
# to their broad canonical subject; the longest-match pass still gives phrases
# such as "mstr earnings" and "strategy capital structure" to their narrower
# topics.  Bare "strategy" is handled only by the contextual rule below.
AUDITED_SINGLE_TOKEN_ALIAS_OWNERS = {
    "microstrategy": "Strategy",
    "mstr": "Strategy",
    "saylor": "Michael Saylor",
}

# These canonical labels are also ordinary Bitcoin/English vocabulary.  They
# enter the trie, but a hit is counted only when the surrounding transcript
# tokens satisfy the conservative company-name grammar below.
CONTEXTUAL_SINGLE_TOKEN_ALIAS_OWNERS = {
    "block": "Block",
    "buzz": "Buzz",
    "strategy": "Strategy",
}

BUZZ_NON_PRODUCT_LEFT_TOKENS = frozenset({
    "google",
    "industry",
    "marketing",
    "matt",
    "media",
    "publicity",
})

STRATEGY_COMPANY_LEFT_TOKENS = frozenset({
    "bought",
    "buy",
    "buys",
    "held",
    "hold",
    "holds",
    "long",
    "own",
    "owned",
    "owns",
    "sell",
    "sells",
    "short",
    "sold",
})
STRATEGY_COMPANY_LEFT_PHRASES = frozenset({
    ("ceo", "of"),
    ("cfo", "of"),
    ("equity", "in"),
    ("shares", "of"),
    ("stock", "in"),
    ("work", "at"),
    ("work", "for"),
    ("works", "at"),
    ("works", "for"),
})
STRATEGY_COMPANY_RIGHT_TOKENS = frozenset({
    "acquired",
    "announced",
    "buys",
    "company",
    "dividend",
    "dividends",
    "earnings",
    "equity",
    "holds",
    "issued",
    "issues",
    "itself",
    "owns",
    "preferred",
    "preferreds",
    "securities",
    "sells",
    "shares",
    "stock",
})
STRATEGY_COMPANY_RIGHT_PHRASES = frozenset({
    ("capital", "structure"),
    ("the", "company"),
})
STRATEGY_COMPANY_ENTITIES = frozenset({
    "mstr",
    "saylor",
    "strc",
    "stretch",
    "strife",
})
STRATEGY_GENERIC_LEFT_TOKENS = frozenset({
    "ai",
    "bitcoin",
    "block",
    "brand",
    "business",
    "content",
    "corporate",
    "custody",
    "deployment",
    "design",
    "different",
    "distribution",
    "energy",
    "engineering",
    "exit",
    "growth",
    "investment",
    "its",
    "legal",
    "marketing",
    "mic",
    "micr",
    "micro",
    "mining",
    "model",
    "my",
    "our",
    "portfolio",
    "pricing",
    "privacy",
    "product",
    "regulatory",
    "sales",
    "same",
    "saylor",
    "security",
    "see",
    "strategy",
    "tax",
    "their",
    "treasury",
    "your",
})

BLOCK_COMPANY_LEFT_PHRASES = frozenset({
    ("ceo", "of"),
    ("cfo", "of"),
    ("company", "like"),
    ("employee", "at"),
    ("employee", "of"),
    ("work", "at"),
    ("work", "for"),
    ("worked", "at"),
    ("worked", "for"),
    ("works", "at"),
    ("works", "for"),
})
BLOCK_COMPANY_RIGHT_TOKENS = frozenset({
    "acquired",
    "announced",
    "company",
    "donated",
    "earnings",
    "employee",
    "employees",
    "employs",
    "engineer",
    "engineers",
    "funded",
    "headcount",
    "hired",
    "launched",
    "layoffs",
    "owns",
    "published",
    "reported",
    "shares",
    "stock",
    "team",
    "teams",
})
BLOCK_COMPANY_RIGHT_PHRASES = frozenset({
    ("investor", "day"),
    ("mining", "division"),
    ("security", "team"),
    ("the", "company"),
})
BLOCK_COMPANY_BRAND_TOKENS = frozenset({
    "bitkey",
    "buzz",
    "dorsey",
    "goose",
    "proto",
    "spiral",
    "square",
    "tbd",
    "tidal",
})
BLOCK_PROTOCOL_LEFT_TOKENS = frozenset({
    "a",
    "each",
    "eight",
    "eighth",
    "every",
    "fifth",
    "first",
    "five",
    "four",
    "fourth",
    "genesis",
    "initial",
    "invalid",
    "mine",
    "mined",
    "mining",
    "new",
    "next",
    "nine",
    "ninth",
    "one",
    "orphaned",
    "per",
    "previous",
    "second",
    "seven",
    "seventh",
    "six",
    "sixth",
    "same",
    "stale",
    "ten",
    "tenth",
    "third",
    "three",
    "two",
    "valid",
    "validate",
    "validated",
    "verified",
    "verify",
})
BLOCK_PROTOCOL_LEFT_PHRASES = frozenset({
    ("mine", "a"),
    ("mining", "a"),
    ("per", "a"),
    ("per", "the"),
    ("transaction", "in"),
    ("transactions", "in"),
})
BLOCK_PROTOCOL_RIGHT_TOKENS = frozenset({
    "chain",
    "data",
    "download",
    "explorer",
    "fee",
    "fees",
    "hash",
    "header",
    "height",
    "interval",
    "limit",
    "eight",
    "five",
    "four",
    "nine",
    "one",
    "number",
    "propagation",
    "reward",
    "seven",
    "six",
    "size",
    "sizes",
    "space",
    "subsidy",
    "ten",
    "template",
    "time",
    "timestamp",
    "three",
    "two",
    "weight",
})

# A handful of multiword search synonyms are useful for retrieval but too broad
# to stand in for the specific topic that currently owns them.  For example,
# every mention of "bitcoin core" is not a discussion of Core v30, and every
# "public key" is not a discussion of Shor's algorithm.  Keeping this list
# small, explicit, and diagnostic-visible protects the subtopic chart from the
# highest-volume known false positives without pretending to do semantic NLP.
RETRIEVAL_ONLY_PHRASES = frozenset({
    "100 million",
    "ai agents",
    "app store",
    "bitcoin community",
    "bitcoin core",
    "financial institutions",
    "group chat",
    "hardware wallet",
    "market share",
    "presidio bitcoin",
    "presidio bitcoin jam",
    "public key",
    "tech companies",
    "use cases",
})

_TOKEN_RE = re.compile(r"[^\W_]+", re.UNICODE)
_TRIE_TERMINAL = "__topic_alias__"

PBJ_LIKE_RE = re.compile(
    r"\bPBJ\b|\bBitcoin\s+Jam\b|\bLive\s+Recording\s+of\s+(?:the\s+)?PBJ\b",
    re.IGNORECASE,
)

# These patterns target title-format markers, rather than any occurrence of a
# word such as "highlights".  For example, the full PBJ episode titled
# "PB Hackathon Highlights, ..." must remain eligible.
_NON_FULL_WORD = r"(clip(?:s)?|short(?:s)?|highlight(?:s)?|trailer)"
NON_FULL_PATTERNS = (
    re.compile(
        rf"\b(?:PBJ|Bitcoin\s+Jam)\s*(?:[:|\-\u2013\u2014]\s*)?{_NON_FULL_WORD}\b",
        re.IGNORECASE,
    ),
    re.compile(
        rf"\b{_NON_FULL_WORD}\s+(?:from|of)\s+(?:the\s+)?(?:PBJ|Bitcoin\s+Jam)\b",
        re.IGNORECASE,
    ),
    re.compile(r"#(shorts?)\b", re.IGNORECASE),
    re.compile(rf"[\[(]\s*{_NON_FULL_WORD}\s*[\])]", re.IGNORECASE),
    re.compile(rf"(?:^|[|\-\u2013\u2014])\s*{_NON_FULL_WORD}\s*$", re.IGNORECASE),
    re.compile(rf"^\s*{_NON_FULL_WORD}\s*[:|\-\u2013\u2014]", re.IGNORECASE),
)


@dataclass(frozen=True)
class TopicMap:
    """The map categories, branches, and exact topic overrides used by /topics."""

    cluster_order: tuple[str, ...]
    branches: Mapping[str, tuple[str, ...]]
    overrides: Mapping[str, str]
    fallback_target: str = FALLBACK_TARGET

    def assignment(self, topic_name: str) -> tuple[str, str]:
        """Mirror the frontend's ``assignTopicToMap`` category/branch fallback."""

        target = self.overrides.get(topic_name.lower(), self.fallback_target)
        pieces = target.split(" > ", 1)
        requested_cluster = pieces[0]
        requested_branch = pieces[1] if len(pieces) == 2 else ""

        cluster = (
            requested_cluster
            if requested_cluster in self.branches
            else self.cluster_order[-1]
        )
        cluster_branches = self.branches[cluster]
        branch = (
            requested_branch
            if requested_branch in cluster_branches
            else cluster_branches[-1]
        )
        return cluster, branch


@dataclass
class EpisodeSelection:
    included: list[dict]
    pbj_like_excluded: list[dict]
    excluded_non_full: list[dict]
    missing_transcripts: list[dict]
    invalid_transcripts: list[dict]
    transcript_entries: dict[str, list[tuple[int, str, str]]]


@dataclass(frozen=True)
class KeywordAlias:
    """One normalized keyword phrase with a single canonical topic owner."""

    tokens: tuple[str, ...]
    topic_name: str
    keyword: str
    owner_method: str


@dataclass(frozen=True)
class TopicMention:
    """One cooldown-deduplicated transcript-keyword hit."""

    topic_name: str
    timestamp: int
    keyword: str


@dataclass
class KeywordRegistry:
    aliases: tuple[KeywordAlias, ...]
    trie: dict
    max_tokens: int
    audit: dict


def _balanced_body(source: str, declaration: str, opener: str, closer: str) -> str:
    """Return a JS assignment's balanced body while ignoring strings/comments."""

    marker = re.search(rf"\bconst\s+{re.escape(declaration)}\s*=", source)
    if not marker:
        raise ValueError(f"Could not find {declaration} in Topics page")
    start = source.find(opener, marker.end())
    if start < 0:
        raise ValueError(f"Could not find opening {opener!r} for {declaration}")

    depth = 0
    quote = None
    escaped = False
    line_comment = False
    block_comment = False
    i = start
    while i < len(source):
        char = source[i]
        nxt = source[i + 1] if i + 1 < len(source) else ""
        if line_comment:
            if char == "\n":
                line_comment = False
            i += 1
            continue
        if block_comment:
            if char == "*" and nxt == "/":
                block_comment = False
                i += 2
            else:
                i += 1
            continue
        if quote:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
            i += 1
            continue
        if char == "/" and nxt == "/":
            line_comment = True
            i += 2
            continue
        if char == "/" and nxt == "*":
            block_comment = True
            i += 2
            continue
        if char in {'"', "'", "`"}:
            quote = char
            i += 1
            continue
        if char == opener:
            depth += 1
        elif char == closer:
            depth -= 1
            if depth == 0:
                return source[start + 1 : i]
        i += 1
    raise ValueError(f"Unterminated {declaration} assignment")


def _decode_js_string(value: str) -> str:
    return json.loads(f'"{value}"')


def parse_topic_map(source: str) -> TopicMap:
    """Parse the Topics page's map order, branches, and explicit overrides."""

    knowledge_body = _balanced_body(source, "KNOWLEDGE_MAP", "[", "]")
    category_re = re.compile(
        r'\{\s*title\s*:\s*"((?:\\.|[^"\\])*)"\s*,\s*branches\s*:\s*\[(.*?)\]\s*,?\s*\}',
        re.DOTALL,
    )
    name_re = re.compile(r'\bname\s*:\s*"((?:\\.|[^"\\])*)"')

    order = []
    branches = {}
    for match in category_re.finditer(knowledge_body):
        title = _decode_js_string(match.group(1))
        branch_names = tuple(
            _decode_js_string(value) for value in name_re.findall(match.group(2))
        )
        if not branch_names:
            raise ValueError(f"Knowledge-map category has no branches: {title!r}")
        if title in branches:
            raise ValueError(f"Duplicate knowledge-map category: {title!r}")
        order.append(title)
        branches[title] = branch_names

    if not order:
        raise ValueError("No KNOWLEDGE_MAP categories could be parsed")

    overrides_body = _balanced_body(source, "MAP_TOPIC_OVERRIDES", "{", "}")
    pair_re = re.compile(
        r'"((?:\\.|[^"\\])*)"\s*:\s*"((?:\\.|[^"\\])*)"'
    )
    overrides = {}
    for raw_name, raw_target in pair_re.findall(overrides_body):
        name = _decode_js_string(raw_name).lower()
        target = _decode_js_string(raw_target)
        # Match JavaScript object-literal semantics: a later duplicate key wins.
        # The current hand-curated config contains a small number of duplicates.
        overrides[name] = target

    if not overrides:
        raise ValueError("No MAP_TOPIC_OVERRIDES entries could be parsed")
    if FALLBACK_TARGET.split(" > ", 1)[0] not in branches:
        raise ValueError(f"Knowledge map is missing fallback target {FALLBACK_TARGET!r}")

    return TopicMap(tuple(order), branches, overrides)


def load_topic_map(path: Path = TOPICS_PAGE) -> TopicMap:
    return parse_topic_map(path.read_text(encoding="utf-8"))


def topic_assignment(topic, topic_map: TopicMap) -> tuple[str, str]:
    name = topic.get("name", "") if isinstance(topic, Mapping) else str(topic)
    return topic_map.assignment(name)


def topic_cluster(topic, topic_map: TopicMap) -> str:
    """Return the canonical top-level map category for a topic."""

    return topic_assignment(topic, topic_map)[0]


def outer_topic_assignment(
    topic_name: str,
    topic_map: TopicMap,
) -> tuple[str, str, str]:
    """Return ``(outer category, canonical category, canonical branch)``."""

    source_cluster, source_branch = topic_map.assignment(topic_name)
    outer = OUTER_TOPIC_EXCEPTIONS.get(topic_name.casefold())
    if outer is None:
        outer = SOURCE_BRANCH_TO_OUTER.get((source_cluster, source_branch))
    if outer not in OUTER_CLUSTER_ORDER:
        raise ValueError(
            "No PBJ explorer rollup for canonical assignment "
            f"{source_cluster} > {source_branch} (topic {topic_name!r})"
        )
    return outer, source_cluster, source_branch


def headline_group_assignment(source_cluster: str, source_branch: str) -> str:
    """Classify a canonical branch into the secondary Bitcoin/AI/Other view."""

    if source_cluster == "AI & Agents":
        return "AI"
    if source_cluster in {"Bitcoin as Money", "Protocol & Scaling", "Wallets & Custody"}:
        return "Bitcoin"
    if source_cluster == "Builders & Infrastructure" and source_branch == "Mining & energy":
        return "Bitcoin"
    return "Other"


def audit_topic_map(topics: Iterable[Mapping], topic_map: TopicMap) -> dict:
    """Report missing and invalid canonical mappings without using fallbacks."""

    current_names = {
        str(topic.get("name") or "").strip().lower():
        str(topic.get("name") or "").strip()
        for topic in topics
        if str(topic.get("name") or "").strip()
    }
    unmapped = sorted(
        (display_name for key, display_name in current_names.items()
         if key not in topic_map.overrides),
        key=lambda value: (value.casefold(), value),
    )
    invalid_targets = []
    for topic_key, target in topic_map.overrides.items():
        pieces = target.split(" > ", 1)
        cluster = pieces[0]
        branch = pieces[1] if len(pieces) == 2 else ""
        if cluster in topic_map.branches and branch in topic_map.branches[cluster]:
            continue
        invalid_targets.append({"topic": topic_key, "target": target})
    invalid_targets.sort(key=lambda row: (row["topic"].casefold(), row["topic"]))
    orphan_overrides = sorted(
        (key for key in topic_map.overrides if key not in current_names),
        key=lambda value: (value.casefold(), value),
    )
    return {
        "unmapped_topics": unmapped,
        "invalid_targets": invalid_targets,
        "orphan_override_keys": orphan_overrides,
    }


def _keyword_token_details(value: str) -> tuple[tuple[str, ...], tuple[str, ...]]:
    """Return aligned normalized tokens and their case-preserving surfaces."""

    text = unicodedata.normalize("NFKC", str(value or ""))
    # Treat the possessive suffix as grammar rather than part of a proper-name
    # keyword ("OpenAI's models" should still contain the phrase "OpenAI models").
    text = re.sub(
        r"(?<=[^\W_])[’']s\b",
        "",
        text,
        flags=re.IGNORECASE | re.UNICODE,
    )
    # In PB's wordmark, an initial bitcoin symbol is a stylized B (₿uilder).
    text = re.sub(r"₿(?=[^\W_])", "b", text)
    text = text.replace("₿", " bitcoin ")
    text = text.replace("+", " plus ")
    text = text.replace("&", " and ")
    text = text.replace("%", " percent ")
    surfaces = tuple(_TOKEN_RE.findall(text))
    return tuple(token.casefold() for token in surfaces), surfaces


def normalized_keyword_tokens(value: str) -> tuple[str, ...]:
    """Normalize a keyword/transcript string into boundary-safe match tokens.

    Separators such as spaces, hyphens, underscores, and URL punctuation become
    equivalent token boundaries.  Symbols whose spoken form carries meaning are
    expanded before tokenization, so e.g. ``Bitcoin++`` does not collapse to the
    dangerously generic token ``bitcoin``.
    """

    tokens, _surfaces = _keyword_token_details(value)
    return tokens


def _single_token_rejection(
    token: str,
    owner: str,
    canonical_tokens: Sequence[str],
    raw_keywords: Sequence[str],
    owner_method: str,
) -> str | None:
    del raw_keywords
    if owner_method == "contextual_single_token_owner":
        return None
    if token in GENERIC_SINGLE_TOKEN_ALIASES:
        return "generic_single_token"
    if owner_method == "audited_single_token_owner":
        return None
    if (
        owner in AUDITED_CANONICAL_SINGLE_TOKEN_TOPICS
        and tuple(canonical_tokens) == (token,)
    ):
        return None
    # There is no reliable automatic distinction between a proper name and an
    # ordinary word in the hand-authored aliases (e.g. Block/block, Base/base,
    # second, hardware, scale).  Unreviewed singleton aliases therefore remain
    # excluded even when they have only one candidate topic.
    return "single_token_alias"


def build_keyword_registry(topics: Iterable[Mapping]) -> KeywordRegistry:
    """Resolve extracted keyword aliases to one topic and build a match trie.

    Identical normalized aliases are common in ``topics_config.js``.  An alias
    has a defensible owner when exactly one candidate topic name normalizes to
    the alias; otherwise it must belong to only one topic.  Unresolved shared
    aliases are excluded rather than multiplied across several topics.
    """

    topics = list(topics)
    topic_name_tokens = {}
    raw_by_alias_topic = defaultdict(set)
    keyword_definition_count = 0
    empty_keyword_count = 0

    for topic in topics:
        name = str(topic.get("name") or "").strip()
        if not name:
            continue
        topic_name_tokens[name] = normalized_keyword_tokens(name)
        for raw_keyword in topic.get("keywords", []):
            keyword_definition_count += 1
            keyword = str(raw_keyword or "").strip()
            tokens = normalized_keyword_tokens(keyword)
            if not tokens:
                empty_keyword_count += 1
                continue
            raw_by_alias_topic[(tokens, name)].add(keyword)

    # The canonical label is the most specific deterministic phrase available.
    # Add it when the search-keyword list omitted it; singleton labels still go
    # through the same high-precision exclusion rule below.
    canonical_name_alias_count = 0
    for name, tokens in topic_name_tokens.items():
        if not tokens or (tokens, name) in raw_by_alias_topic:
            continue
        raw_by_alias_topic[(tokens, name)].add(name)
        canonical_name_alias_count += 1

    candidates_by_alias = defaultdict(set)
    for tokens, name in raw_by_alias_topic:
        candidates_by_alias[tokens].add(name)

    aliases = []
    excluded = []
    owner_method_counts = Counter()
    for tokens in sorted(candidates_by_alias):
        candidates = sorted(
            candidates_by_alias[tokens], key=lambda value: (value.casefold(), value)
        )
        exact = [name for name in candidates if topic_name_tokens[name] == tokens]
        contextual_owner = (
            CONTEXTUAL_SINGLE_TOKEN_ALIAS_OWNERS.get(tokens[0])
            if len(tokens) == 1
            else None
        )
        audited_owner = (
            AUDITED_SINGLE_TOKEN_ALIAS_OWNERS.get(tokens[0])
            if len(tokens) == 1
            else None
        )
        if contextual_owner in candidates:
            owner = contextual_owner
            owner_method = "contextual_single_token_owner"
        elif audited_owner in candidates:
            owner = audited_owner
            owner_method = "audited_single_token_owner"
        elif len(exact) == 1:
            owner = exact[0]
            owner_method = "exact_topic_name"
        elif len(candidates) == 1:
            owner = candidates[0]
            owner_method = "unique_alias"
        else:
            excluded.append({
                "keyword": " ".join(tokens),
                "reason": "ambiguous_shared_alias",
                "topics": candidates,
            })
            continue

        raw_keywords = sorted(
            raw_by_alias_topic[(tokens, owner)],
            key=lambda value: (len(value), value.casefold(), value),
        )
        if len(tokens) == 1:
            rejection = _single_token_rejection(
                tokens[0],
                owner,
                topic_name_tokens[owner],
                raw_keywords,
                owner_method,
            )
            if rejection:
                excluded.append({
                    "keyword": raw_keywords[0],
                    "reason": rejection,
                    "topics": candidates,
                })
                continue
        elif " ".join(tokens) in RETRIEVAL_ONLY_PHRASES:
            excluded.append({
                "keyword": raw_keywords[0],
                "reason": "retrieval_only_phrase",
                "topics": candidates,
            })
            continue

        aliases.append(KeywordAlias(
            tokens=tokens,
            topic_name=owner,
            keyword=raw_keywords[0],
            owner_method=owner_method,
        ))
        owner_method_counts[owner_method] += 1

    aliases.sort(key=lambda alias: (
        alias.tokens,
        alias.topic_name.casefold(),
        alias.topic_name,
        alias.keyword.casefold(),
        alias.keyword,
    ))
    trie = {}
    for alias in aliases:
        node = trie
        for token in alias.tokens:
            node = node.setdefault(token, {})
        node[_TRIE_TERMINAL] = alias

    excluded_reason_counts = Counter(row["reason"] for row in excluded)
    excluded_samples = {}
    for reason in sorted(excluded_reason_counts):
        rows = [row for row in excluded if row["reason"] == reason]
        rows.sort(key=lambda row: (row["keyword"].casefold(), row["keyword"]))
        excluded_samples[reason] = rows[:25]

    accepted_topic_names = {alias.topic_name for alias in aliases}
    topics_without_accepted_aliases = sorted(
        (name for name in topic_name_tokens if name not in accepted_topic_names),
        key=lambda value: (value.casefold(), value),
    )
    audit = {
        "keyword_definition_count": keyword_definition_count,
        "canonical_name_alias_count": canonical_name_alias_count,
        "normalized_topic_alias_pair_count": len(raw_by_alias_topic),
        "normalized_alias_count": len(candidates_by_alias),
        "accepted_alias_count": len(aliases),
        "accepted_topic_count": len(accepted_topic_names),
        "topics_without_accepted_alias_count": len(topics_without_accepted_aliases),
        "topics_without_accepted_aliases": topics_without_accepted_aliases,
        "empty_keyword_count": empty_keyword_count,
        "excluded_alias_count": len(excluded),
        "excluded_reason_counts": dict(sorted(excluded_reason_counts.items())),
        "owner_method_counts": dict(sorted(owner_method_counts.items())),
        "excluded_alias_samples": excluded_samples,
        "generic_single_token_blocklist": sorted(GENERIC_SINGLE_TOKEN_ALIASES),
        "audited_canonical_single_token_topics": sorted(
            AUDITED_CANONICAL_SINGLE_TOKEN_TOPICS,
            key=lambda value: (value.casefold(), value),
        ),
        "audited_single_token_alias_owners": dict(
            sorted(AUDITED_SINGLE_TOKEN_ALIAS_OWNERS.items())
        ),
        "contextual_single_token_alias_owners": dict(
            sorted(CONTEXTUAL_SINGLE_TOKEN_ALIAS_OWNERS.items())
        ),
        "retrieval_only_phrase_blocklist": sorted(RETRIEVAL_ONLY_PHRASES),
    }
    return KeywordRegistry(
        aliases=tuple(aliases),
        trie=trie,
        max_tokens=max((len(alias.tokens) for alias in aliases), default=0),
        audit=audit,
    )


def _context_slice(
    tokens: Sequence[str],
    token_times: Sequence[int],
    target_index: int,
    relative_start: int,
    length: int,
    max_span_seconds: int,
) -> tuple[str, ...]:
    start = target_index + relative_start
    end = start + length
    if start < 0 or end > len(tokens):
        return ()
    target_time = token_times[target_index]
    if any(
        abs(token_times[index] - target_time) > max_span_seconds
        for index in range(start, end)
    ):
        return ()
    return tuple(tokens[start:end])


def _nearby_context_tokens(
    tokens: Sequence[str],
    token_times: Sequence[int],
    target_index: int,
    *,
    radius: int,
    max_span_seconds: int,
) -> set[str]:
    target_time = token_times[target_index]
    return {
        tokens[index]
        for index in range(
            max(0, target_index - radius),
            min(len(tokens), target_index + radius + 1),
        )
        if index != target_index
        and abs(token_times[index] - target_time) <= max_span_seconds
    }


def _nearby_context_has_phrase(
    tokens: Sequence[str],
    token_times: Sequence[int],
    target_index: int,
    phrase: Sequence[str],
    *,
    radius: int,
    max_span_seconds: int,
) -> bool:
    lower = max(0, target_index - radius)
    upper = min(len(tokens) - len(phrase), target_index + radius) + 1
    target_time = token_times[target_index]
    for start in range(lower, upper):
        end = start + len(phrase)
        if tuple(tokens[start:end]) != tuple(phrase):
            continue
        if all(
            abs(token_times[index] - target_time) <= max_span_seconds
            for index in range(start, end)
        ):
            return True
    return False


def _strategy_company_context(
    tokens: Sequence[str],
    token_surfaces: Sequence[str],
    token_times: Sequence[int],
    start: int,
    max_span_seconds: int,
) -> bool:
    left_one = _context_slice(
        tokens, token_times, start, -1, 1, max_span_seconds
    )
    left_two = _context_slice(
        tokens, token_times, start, -2, 2, max_span_seconds
    )
    right_one = _context_slice(
        tokens, token_times, start, 1, 1, max_span_seconds
    )
    right_two = _context_slice(
        tokens, token_times, start, 1, 2, max_span_seconds
    )

    # These are ASR-split spellings of MicroStrategy and are owned by the
    # longer phrase alias rather than by the contextual bare-name fallback.
    if left_one and left_one[0] in {"mic", "micr", "micro"}:
        return False
    if left_one and left_one[0] in STRATEGY_GENERIC_LEFT_TOKENS:
        return False
    if left_one and left_one[0] in STRATEGY_COMPANY_LEFT_TOKENS:
        return True
    if left_two in STRATEGY_COMPANY_LEFT_PHRASES:
        return True
    if right_one and right_one[0] in STRATEGY_COMPANY_RIGHT_TOKENS:
        return True
    if right_two in STRATEGY_COMPANY_RIGHT_PHRASES:
        return True
    if (
        len(left_two) == 2
        and left_two[0] in STRATEGY_COMPANY_ENTITIES
        and left_two[1] in {"and", "or"}
    ):
        return True
    if (
        len(right_two) == 2
        and right_two[0] in {"and", "or"}
        and right_two[1] in STRATEGY_COMPANY_ENTITIES
    ):
        return True
    return token_surfaces[start] == "Strategy"


def _block_company_context(
    tokens: Sequence[str],
    token_surfaces: Sequence[str],
    token_times: Sequence[int],
    start: int,
    max_span_seconds: int,
) -> bool:
    left_one = _context_slice(
        tokens, token_times, start, -1, 1, max_span_seconds
    )
    left_two = _context_slice(
        tokens, token_times, start, -2, 2, max_span_seconds
    )
    right_one = _context_slice(
        tokens, token_times, start, 1, 1, max_span_seconds
    )
    right_two = _context_slice(
        tokens, token_times, start, 1, 2, max_span_seconds
    )

    # Strong company grammar wins even in discussions of Block's mining arm.
    if left_two in BLOCK_COMPANY_LEFT_PHRASES:
        return True
    if right_one and right_one[0] in BLOCK_COMPANY_RIGHT_TOKENS:
        return True
    if right_two in BLOCK_COMPANY_RIGHT_PHRASES:
        return True

    # Protocol grammar must beat capitalization or nearby company brands.
    if left_one and (
        left_one[0] in BLOCK_PROTOCOL_LEFT_TOKENS or left_one[0].isdigit()
    ):
        return False
    if left_two in BLOCK_PROTOCOL_LEFT_PHRASES:
        return False
    if right_one and (
        right_one[0] in BLOCK_PROTOCOL_RIGHT_TOKENS or right_one[0].isdigit()
    ):
        return False

    if token_surfaces[start] == "Block":
        return True

    nearby = _nearby_context_tokens(
        tokens,
        token_times,
        start,
        radius=6,
        max_span_seconds=max_span_seconds,
    )
    if nearby & BLOCK_COMPANY_BRAND_TOKENS:
        return True
    return _nearby_context_has_phrase(
        tokens,
        token_times,
        start,
        ("cash", "app"),
        radius=6,
        max_span_seconds=max_span_seconds,
    )


def _contextual_single_token_supported(
    tokens: Sequence[str],
    token_surfaces: Sequence[str],
    token_times: Sequence[int],
    start: int,
    alias: KeywordAlias,
    max_span_seconds: int,
) -> bool:
    if alias.topic_name == "Buzz":
        left_one = _context_slice(
            tokens, token_times, start, -1, 1, max_span_seconds
        )
        left_two = _context_slice(
            tokens, token_times, start, -2, 2, max_span_seconds
        )
        return not (
            (left_one and left_one[0] in BUZZ_NON_PRODUCT_LEFT_TOKENS)
            or left_two in {("and", "a"), ("got", "that"), ("have", "that")}
        )
    if alias.topic_name == "Strategy":
        return _strategy_company_context(
            tokens, token_surfaces, token_times, start, max_span_seconds
        )
    if alias.topic_name == "Block":
        return _block_company_context(
            tokens, token_surfaces, token_times, start, max_span_seconds
        )
    return False


def census_transcript_entries(
    entries: Sequence[tuple[int, str, str]],
    registry: KeywordRegistry,
    *,
    cooldown_seconds: int = MENTION_COOLDOWN_SECONDS,
    max_span_seconds: int = MAX_KEYWORD_SPAN_SECONDS,
) -> tuple[list[TopicMention], dict]:
    """Return deduplicated topic mentions from one parsed full transcript."""

    if cooldown_seconds < 0 or max_span_seconds < 0:
        raise ValueError("Keyword census time limits cannot be negative")

    tokens = []
    token_surfaces = []
    token_times = []
    for timestamp, _shown_timestamp, text in entries:
        entry_tokens, entry_surfaces = _keyword_token_details(text)
        tokens.extend(entry_tokens)
        token_surfaces.extend(entry_surfaces)
        token_times.extend([int(timestamp)] * len(entry_tokens))

    candidates = []
    context_rejected = 0
    for start in range(len(tokens)):
        node = registry.trie
        stop = min(len(tokens), start + registry.max_tokens)
        for end in range(start, stop):
            if token_times[end] - token_times[start] > max_span_seconds:
                break
            node = node.get(tokens[end])
            if node is None:
                break
            alias = node.get(_TRIE_TERMINAL)
            if alias is not None:
                if (
                    alias.owner_method == "contextual_single_token_owner"
                    and not _contextual_single_token_supported(
                        tokens,
                        token_surfaces,
                        token_times,
                        start,
                        alias,
                        max_span_seconds,
                    )
                ):
                    context_rejected += 1
                    continue
                candidates.append((start, end + 1, alias))

    # A longer phrase is stronger evidence than any nested alias.  Equal-length
    # candidates resolve left-to-right and then by stable topic/keyword order.
    ranked = sorted(candidates, key=lambda row: (
        -(row[1] - row[0]),
        row[0],
        row[2].topic_name.casefold(),
        row[2].topic_name,
        row[2].keyword.casefold(),
        row[2].keyword,
    ))
    occupied = bytearray(len(tokens))
    non_overlapping = []
    for start, end, alias in ranked:
        if any(occupied[start:end]):
            continue
        occupied[start:end] = b"\x01" * (end - start)
        non_overlapping.append((start, end, alias))

    non_overlapping.sort(key=lambda row: (
        token_times[row[0]],
        row[0],
        row[2].topic_name.casefold(),
        row[2].topic_name,
    ))
    last_counted_at = {}
    mentions = []
    alias_counts = Counter()
    single_token_count = 0
    cooldown_suppressed = 0
    for start, _end, alias in non_overlapping:
        timestamp = token_times[start]
        previous = last_counted_at.get(alias.topic_name)
        if previous is not None and timestamp - previous < cooldown_seconds:
            cooldown_suppressed += 1
            continue
        last_counted_at[alias.topic_name] = timestamp
        mentions.append(TopicMention(alias.topic_name, timestamp, alias.keyword))
        alias_counts[(alias.keyword, alias.topic_name)] += 1
        if len(alias.tokens) == 1:
            single_token_count += 1

    audit = {
        "timestamp_entry_count": len(entries),
        "token_count": len(tokens),
        "candidate_span_count": len(candidates),
        "context_rejected_count": context_rejected,
        "overlap_suppressed_count": len(candidates) - len(non_overlapping),
        "cooldown_suppressed_count": cooldown_suppressed,
        "counted_mention_count": len(mentions),
        "single_token_mention_count": single_token_count,
        "alias_counts": alias_counts,
    }
    return mentions, audit


def explicit_non_full_marker(title: str) -> str | None:
    """Return the explicit clip/short/highlight/trailer marker, if present."""

    for pattern in NON_FULL_PATTERNS:
        match = pattern.search(title or "")
        if not match:
            continue
        marker = next((value for value in match.groups() if value), "non-full marker")
        marker = marker.lower().lstrip("#")
        return {
            "clips": "clip",
            "shorts": "short",
            "highlights": "highlight",
        }.get(marker, marker)
    return None


def is_pbj_like_title(title: str) -> bool:
    return bool(PBJ_LIKE_RE.search(title or ""))


def _normalized_episode(row: Mapping) -> dict:
    raw_url = str(row.get("youtube_url") or row.get("url") or "").strip()
    youtube_id = str(row.get("youtube_id") or youtube_id_from_url(raw_url)).strip()
    url = raw_url or (
        f"https://www.youtube.com/watch?v={youtube_id}" if youtube_id else ""
    )
    return {
        "youtube_id": youtube_id,
        "title": str(row.get("title") or "").strip(),
        "series": str(row.get("series") or "").strip(),
        "date": str(row.get("date") or row.get("published_date") or "").strip(),
        "url": url,
        "transcript_file": str(row.get("transcript_file") or "").strip(),
    }


def _transcript_path(episode: Mapping, root: Path) -> Path | None:
    raw_path = episode.get("transcript_file", "")
    if not raw_path:
        return None
    path = Path(raw_path)
    return path if path.is_absolute() else root / path


def _date_ordinal(value: str) -> int:
    try:
        return date.fromisoformat(value).toordinal()
    except (TypeError, ValueError):
        return 0


def _episode_metadata_sort_key(episode: Mapping) -> tuple:
    return (
        -_date_ordinal(str(episode.get("date", ""))),
        str(episode.get("title", "")).casefold(),
        str(episode.get("youtube_id", "")),
    )


def identify_pbj_episodes(
    catalog_rows: Iterable[Mapping],
    *,
    root: Path = ROOT,
) -> EpisodeSelection:
    """Select full PBJ rows with transcripts and explain every near miss."""

    included = []
    pbj_like_excluded = []
    excluded_non_full = []
    missing_transcripts = []
    invalid_transcripts = []
    transcript_entries = {}
    seen_ids = set()

    for raw_row in catalog_rows:
        episode = _normalized_episode(raw_row)
        youtube_id = episode["youtube_id"]
        if youtube_id and youtube_id in seen_ids:
            continue
        if youtube_id:
            seen_ids.add(youtube_id)

        if episode["series"] == "PBJ":
            marker = explicit_non_full_marker(episode["title"])
            if marker:
                excluded_non_full.append({
                    **episode,
                    "reason": f"title contains explicit non-full PBJ marker: {marker}",
                    "marker": marker,
                })
                continue
            transcript_path = _transcript_path(episode, root)
            if transcript_path is None or not transcript_path.is_file():
                missing_transcripts.append({
                    **episode,
                    "reason": "full PBJ catalog row has no transcript file on disk",
                })
                continue
            try:
                transcript_text = transcript_path.read_text(
                    encoding="utf-8", errors="ignore"
                )
            except OSError as error:
                invalid_transcripts.append({
                    **episode,
                    "reason": f"full PBJ transcript could not be read: {error}",
                })
                continue
            entries = parse_timestamp_entries(transcript_text)
            if not entries:
                invalid_transcripts.append({
                    **episode,
                    "reason": (
                        "full PBJ transcript has no parseable timestamped text entries"
                    ),
                })
                continue
            included.append(episode)
            transcript_entries[episode["youtube_id"]] = entries
            continue

        if is_pbj_like_title(episode["title"]):
            shown_series = episode["series"] or "(blank)"
            pbj_like_excluded.append({
                **episode,
                "reason": (
                    f"series is {shown_series!r}, not 'PBJ'; non-PBJ programming "
                    "is outside the full-episode explorer scope"
                ),
            })

    for values in (
        included,
        pbj_like_excluded,
        excluded_non_full,
        missing_transcripts,
        invalid_transcripts,
    ):
        values.sort(key=_episode_metadata_sort_key)
    return EpisodeSelection(
        included=included,
        pbj_like_excluded=pbj_like_excluded,
        excluded_non_full=excluded_non_full,
        missing_transcripts=missing_transcripts,
        invalid_transcripts=invalid_transcripts,
        transcript_entries=transcript_entries,
    )


def percentage_shares(counts: Sequence[int]) -> list[float]:
    """Allocate hundredths of a percent with a stable largest-remainder rule."""

    if any(count < 0 for count in counts):
        raise ValueError("Percentage counts cannot be negative")
    total = sum(counts)
    if total == 0:
        return [0.0 for _ in counts]

    numerators = [count * 10_000 for count in counts]
    basis_points = [value // total for value in numerators]
    remainders = [value % total for value in numerators]
    unallocated = 10_000 - sum(basis_points)
    order = sorted(range(len(counts)), key=lambda index: (-remainders[index], index))
    for index in order[:unallocated]:
        basis_points[index] += 1
    return [value / 100 for value in basis_points]


def display_episode_count(included_episode_count: int) -> int:
    """Return the editorial counter, advancing once per indexed PBJ transcript."""

    if included_episode_count < 0:
        raise ValueError("Included episode count cannot be negative")
    return included_episode_count + DISPLAY_EPISODE_OFFSET


def quarter_id(value: str) -> str:
    parsed = date.fromisoformat(value)
    return f"{parsed.year}-Q{(parsed.month - 1) // 3 + 1}"


def _quarter_label(value: str) -> str:
    year, quarter = value.split("-Q", 1)
    return f"Q{quarter} {year}"


def _quarter_sequence(start: str, end: str) -> list[str]:
    if not start or not end:
        return []
    first = date.fromisoformat(start)
    last = date.fromisoformat(end)
    year = first.year
    quarter = (first.month - 1) // 3 + 1
    end_year = last.year
    end_quarter = (last.month - 1) // 3 + 1
    result = []
    while (year, quarter) <= (end_year, end_quarter):
        result.append(f"{year}-Q{quarter}")
        quarter += 1
        if quarter == 5:
            year += 1
            quarter = 1
    return result


def _generated_at(included: Sequence[Mapping], injected=None) -> str:
    if injected is None:
        valid_dates = [
            episode["date"]
            for episode in included
            if _date_ordinal(str(episode.get("date", "")))
        ]
        latest = max(valid_dates, default="1970-01-01")
        return f"{latest}T00:00:00Z"
    if isinstance(injected, datetime):
        value = injected
        if value.tzinfo is None:
            value = value.replace(tzinfo=timezone.utc)
        value = value.astimezone(timezone.utc).replace(microsecond=0)
        return value.isoformat().replace("+00:00", "Z")
    if isinstance(injected, date):
        return f"{injected.isoformat()}T00:00:00Z"
    raw = str(injected).strip()
    if re.fullmatch(r"\d{4}-\d{2}-\d{2}", raw):
        date.fromisoformat(raw)
        return f"{raw}T00:00:00Z"
    parsed = datetime.fromisoformat(raw.replace("Z", "+00:00"))
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc).replace(microsecond=0).isoformat().replace(
        "+00:00", "Z"
    )


def _episode_result(episode: Mapping, mention_count: int) -> dict:
    return {
        "youtube_id": episode["youtube_id"],
        "title": episode["title"],
        "date": episode["date"],
        "url": episode["url"],
        "mention_count": mention_count,
    }


def _ranked_episode_results(
    counts: Mapping[str, int],
    episodes_by_id: Mapping[str, Mapping],
    *,
    limit: int = TOP_EPISODE_LIMIT,
) -> list[dict]:
    rows = [
        _episode_result(episodes_by_id[youtube_id], count)
        for youtube_id, count in counts.items()
        if youtube_id in episodes_by_id
    ]
    rows.sort(key=lambda row: (
        -row["mention_count"],
        -_date_ordinal(row["date"]),
        row["title"].casefold(),
        row["youtube_id"],
    ))
    return rows[:limit]


def _discrepancy_explanation(
    actual: int,
    expected: int,
    selection: EpisodeSelection,
) -> str:
    if actual == expected:
        return (
            f"The catalog supports the expected {expected} confidently identified full PBJ "
            "episodes with transcripts."
        )
    direction = "fewer than" if actual < expected else "more than"
    difference = abs(expected - actual)
    support_note = (
        "The reference expectation is unsupported by the current repository/catalog "
        "snapshot produced from the configured PBJ playlist. "
        if actual < expected
        else "The current repository/catalog snapshot exceeds the reference expectation. "
    )
    candidate_count = len(selection.pbj_like_excluded)
    candidate_word = "title" if candidate_count == 1 else "titles"
    unresolved = max(0, expected - actual - candidate_count)
    candidate_note = (
        f"The catalog contains {candidate_count} PBJ-like {candidate_word} assigned to "
        "other series; each is listed below with its exclusion reason. "
    )
    unresolved_note = (
        f"No catalog row confidently accounts for the remaining {unresolved} expected "
        f"episode{'s' if unresolved != 1 else ''}. "
        if unresolved
        else ""
    )
    return (
        f"Included {actual} confidently identified full PBJ episodes with transcripts, "
        f"{difference} {direction} the reference expectation of {expected}. "
        f"{support_note}No episodes were invented or silently reclassified, and the "
        "generator performs no network lookup. "
        f"{candidate_note}{unresolved_note}"
        f"Diagnostics list {len(selection.missing_transcripts)} PBJ rows with missing "
        f"transcripts, {len(selection.invalid_transcripts)} PBJ rows with invalid "
        f"transcripts, {len(selection.excluded_non_full)} PBJ rows carrying explicit "
        f"clip/short/highlight/trailer markers, and "
        f"{len(selection.pbj_like_excluded)} PBJ-like {candidate_word} assigned to other series."
    )


def build_topic_stats(
    catalog_rows: Iterable[Mapping],
    topics: Iterable[Mapping],
    topic_map: TopicMap,
    *,
    root: Path = ROOT,
    generated_at=None,
    expected_episode_count: int = EXPECTED_EPISODE_COUNT,
    top_episode_limit: int = TOP_EPISODE_LIMIT,
) -> tuple[dict, dict]:
    """Return the stable public artifact and its detailed diagnostic artifact."""

    topics = list(topics)
    map_audit = audit_topic_map(topics, topic_map)
    selection = identify_pbj_episodes(catalog_rows, root=root)
    included = selection.included
    episodes_by_id = {episode["youtube_id"]: episode for episode in included}
    generated = _generated_at(included, generated_at)

    valid_dates = sorted(
        episode["date"]
        for episode in included
        if _date_ordinal(episode["date"])
    )
    date_start = valid_dates[0] if valid_dates else ""
    date_end = valid_dates[-1] if valid_dates else ""

    cluster_counts = Counter()
    cluster_episode_counts = defaultdict(Counter)
    topic_counts = Counter()
    topic_episode_counts = defaultdict(Counter)
    topic_episode_timestamps = defaultdict(lambda: defaultdict(list))
    topic_assignments = {}
    episode_counts = Counter()
    quarter_cluster_counts = defaultdict(Counter)
    quarter_cluster_episode_ids = defaultdict(lambda: defaultdict(set))
    summary_counts = Counter()
    summary_episode_ids = defaultdict(set)
    alias_counts = Counter()
    matcher_totals = Counter()

    for topic in topics:
        name = str(topic.get("name") or "").strip()
        if not name:
            continue
        outer, source_cluster, source_branch = outer_topic_assignment(name, topic_map)
        topic_assignments[name] = (outer, source_branch, source_cluster)

    registry = build_keyword_registry(topics)
    for episode in included:
        youtube_id = episode["youtube_id"]
        mentions, episode_audit = census_transcript_entries(
            selection.transcript_entries[youtube_id], registry
        )
        for key, value in episode_audit.items():
            if key == "alias_counts":
                alias_counts.update(value)
            else:
                matcher_totals[key] += value
        episode_date = episode["date"]
        current_quarter = quarter_id(episode_date) if _date_ordinal(episode_date) else None
        for mention in mentions:
            name = mention.topic_name
            cluster, _source_branch, source_cluster = topic_assignments[name]
            source_branch = topic_assignments[name][1]
            topic_counts[name] += 1
            topic_episode_counts[name][youtube_id] += 1
            topic_episode_timestamps[name][youtube_id].append(mention.timestamp)
            cluster_counts[cluster] += 1
            cluster_episode_counts[cluster][youtube_id] += 1
            episode_counts[youtube_id] += 1
            headline_group = headline_group_assignment(source_cluster, source_branch)
            summary_counts[headline_group] += 1
            summary_episode_ids[headline_group].add(youtube_id)
            if current_quarter:
                quarter_cluster_counts[current_quarter][cluster] += 1
                quarter_cluster_episode_ids[current_quarter][cluster].add(youtube_id)

    total_mentions = sum(topic_counts.values())
    cluster_names = list(OUTER_CLUSTER_ORDER)
    cluster_shares = percentage_shares([cluster_counts[name] for name in cluster_names])
    cluster_share_by_name = dict(zip(cluster_names, cluster_shares))

    global_topic_names = sorted(
        topic_counts,
        key=lambda name: (-topic_counts[name], name.casefold(), name),
    )
    global_topic_shares = percentage_shares(
        [topic_counts[name] for name in global_topic_names]
    )
    global_topic_share_by_name = dict(zip(global_topic_names, global_topic_shares))

    cluster_rows = []
    cluster_details = {}
    for cluster_name in cluster_names:
        cluster_id = slugify(cluster_name)
        episode_mentions = cluster_episode_counts[cluster_name]
        cluster_row = {
            "id": cluster_id,
            "name": cluster_name,
            "count": cluster_counts[cluster_name],
            "share": cluster_share_by_name[cluster_name],
            "episode_count": len(episode_mentions),
        }
        cluster_rows.append(cluster_row)

        names = sorted(
            (
                name
                for name, assignment in topic_assignments.items()
                if assignment[0] == cluster_name and topic_counts[name] > 0
            ),
            key=lambda name: (-topic_counts[name], name.casefold(), name),
        )
        within_cluster_shares = percentage_shares([topic_counts[name] for name in names])
        topics_payload = []
        for name, share_of_cluster in zip(names, within_cluster_shares):
            topic_episodes = topic_episode_counts[name]
            topics_payload.append({
                "id": slugify(name),
                "name": name,
                "branch": topic_assignments[name][1],
                "source_category": topic_assignments[name][2],
                "count": topic_counts[name],
                "share_of_cluster": share_of_cluster,
                "share_overall": global_topic_share_by_name[name],
                "episode_count": len(topic_episodes),
                "episodes": _ranked_episode_results(
                    topic_episodes,
                    episodes_by_id,
                    limit=top_episode_limit,
                ),
            })
        cluster_details[cluster_id] = {
            **cluster_row,
            "topics": topics_payload,
            "episodes": _ranked_episode_results(
                episode_mentions,
                episodes_by_id,
                limit=top_episode_limit,
            ),
        }

    summary_names = ["Bitcoin", "AI", "Other"]
    summary_shares = percentage_shares([summary_counts[name] for name in summary_names])
    bitcoin_ai_summary = [
        {
            "id": slugify(name),
            "name": name,
            "count": summary_counts[name],
            "share": share,
            "episode_count": len(summary_episode_ids[name]),
        }
        for name, share in zip(summary_names, summary_shares)
    ]

    quarter_episode_ids = defaultdict(set)
    for episode in included:
        if _date_ordinal(episode["date"]):
            quarter_episode_ids[quarter_id(episode["date"])].add(episode["youtube_id"])

    quarters = []
    for current_quarter in _quarter_sequence(date_start, date_end):
        counts = quarter_cluster_counts[current_quarter]
        shares = percentage_shares([counts[name] for name in cluster_names])
        rows = []
        for cluster_name, share in zip(cluster_names, shares):
            rows.append({
                "id": slugify(cluster_name),
                "name": cluster_name,
                "count": counts[cluster_name],
                "share": share,
                "episode_count": len(
                    quarter_cluster_episode_ids[current_quarter][cluster_name]
                ),
            })
        quarters.append({
            "id": current_quarter,
            "label": _quarter_label(current_quarter),
            "episode_count": len(quarter_episode_ids[current_quarter]),
            "matched_topic_mentions": sum(counts.values()),
            "clusters": rows,
        })

    without_matches = [
        episode for episode in included if episode_counts[episode["youtube_id"]] == 0
    ]
    with_matches_count = len(included) - len(without_matches)
    explanation = _discrepancy_explanation(
        len(included), expected_episode_count, selection
    )
    top_aliases = [
        {"keyword": keyword, "topic": topic, "count": count}
        for (keyword, topic), count in sorted(
            alias_counts.items(),
            key=lambda row: (
                -row[1],
                row[0][1].casefold(),
                row[0][1],
                row[0][0].casefold(),
                row[0][0],
            ),
        )[:50]
    ]
    top_topics = [
        {"topic": name, "count": topic_counts[name]}
        for name in sorted(
            topic_counts,
            key=lambda value: (-topic_counts[value], value.casefold(), value),
        )[:50]
    ]
    curated_pick_keys = set()
    curated_picks_with_same_episode_hit = 0
    curated_picks_with_nearby_hit = 0
    for topic in topics:
        name = str(topic.get("name") or "").strip()
        if not name:
            continue
        for pick in topic.get("video_picks", []):
            youtube_id = str(pick.get("youtube_id") or "")
            if youtube_id not in episodes_by_id:
                continue
            try:
                timestamp = int(pick.get("t"))
            except (TypeError, ValueError):
                continue
            pick_key = (name, youtube_id, timestamp)
            if pick_key in curated_pick_keys:
                continue
            curated_pick_keys.add(pick_key)
            matched_timestamps = topic_episode_timestamps[name][youtube_id]
            if matched_timestamps:
                curated_picks_with_same_episode_hit += 1
            if any(abs(value - timestamp) <= 60 for value in matched_timestamps):
                curated_picks_with_nearby_hit += 1

    matched_topic_count = len(topic_counts)
    single_token_mentions = matcher_totals["single_token_mention_count"]
    diagnostic_summary = {
        "expected_episode_count": expected_episode_count,
        "included_episode_count": len(included),
        "display_episode_count": display_episode_count(len(included)),
        "discrepancy": expected_episode_count - len(included),
        "pbj_like_excluded_count": len(selection.pbj_like_excluded),
        "unrepresented_expected_count": max(
            0,
            expected_episode_count
            - len(included)
            - len(selection.pbj_like_excluded),
        ),
        "excluded_non_full_count": len(selection.excluded_non_full),
        "missing_transcript_count": len(selection.missing_transcripts),
        "invalid_transcript_count": len(selection.invalid_transcripts),
        "episodes_without_matches_count": len(without_matches),
        "matched_topic_mention_count": total_mentions,
        "matched_topic_count": matched_topic_count,
        "unmapped_topic_count": len(map_audit["unmapped_topics"]),
        "invalid_mapping_target_count": len(map_audit["invalid_targets"]),
    }

    payload = {
        "metadata": {
            "schema_version": SCHEMA_VERSION,
            "generated_at": generated,
            "generated_at_basis": (
                "latest included episode publication date, used as a deterministic "
                "data-snapshot timestamp"
            ),
            "episode_count": len(included),
            "display_episode_count": display_episode_count(len(included)),
            "display_episode_count_basis": (
                "included full PBJ episodes with usable transcripts plus the configured "
                f"editorial offset of {DISPLAY_EPISODE_OFFSET}"
            ),
            "expected_episode_count": expected_episode_count,
            "episodes_with_matches": with_matches_count,
            "episodes_without_matches": len(without_matches),
            "matched_topic_mentions": total_mentions,
            "metric_name": "deduplicated_transcript_keyword_mentions",
            "metric_label": "transcript topic matches",
            "metric_label_singular": "transcript topic match",
            "share_unit": "percent",
            "date_range": {"start": date_start, "end": date_end},
            "methodology": {
                "unit": (
                    "one canonical topic keyword hit in an included full PBJ transcript, "
                    "counted at most once for that topic in each rolling 30-second interval"
                ),
                "summary": (
                    "Only catalog rows tagged PBJ, without explicit clip/short/highlight/"
                    "trailer title markers, and with a transcript file on disk are included. "
                    "Every parseable transcript is scanned end to end using canonical topic "
                    "names and the keyword aliases returned by extract_topics; curated video "
                    "picks do not enter the counts or denominator."
                ),
                "percentage_basis": (
                    "Shares are shares of cooldown-deduplicated transcript keyword hits. "
                    "They are not minutes or percentage of airtime."
                ),
                "keyword_matching": (
                    "Unicode-normalized word tokens provide strict word boundaries while "
                    "allowing equivalent punctuation, possessives, and phrases split across adjacent "
                    "timestamp entries. A phrase cannot span more than 15 seconds. Shared "
                    "aliases use an exact canonical-topic-name owner when one exists; "
                    "otherwise unresolved shared aliases are excluded. Single-token aliases "
                    "are excluded by default; a small audited proper-name set is accepted, "
                    "while ambiguous names use local context (including company grammar "
                    "for Block and Strategy). A small audited set of overly broad retrieval-only "
                    "phrases is also excluded. Nested and overlapping matches resolve "
                    "longest-first, then repeat hits for the same topic within 30 seconds "
                    "are collapsed."
                ),
                "coverage_caveat": (
                    "This is an exhaustive census of accepted canonical names and configured "
                    "keyword aliases, not a semantic model. Transcription errors, omitted aliases, and the "
                    "high-precision exclusion rules can cause false negatives; remaining "
                    "phrases can still be contextually ambiguous. Treat the mix and trends "
                    "as directional topic activity."
                ),
                "cluster_source": (
                    "Canonical topic and branch assignments come from KNOWLEDGE_MAP and "
                    "MAP_TOPIC_OVERRIDES in public/topics/index.html. Those branches are "
                    "rolled into eight PBJ explorer categories; AI governance, Stacker "
                    "News, and Stacker News non-custodial have explicit outer-category "
                    "exceptions. Main builds fail if a configured topic is unmapped."
                ),
                "bitcoin_ai_grouping": (
                    "The secondary summary uses canonical branches, not the mixed outer "
                    "categories. AI = every canonical AI & Agents branch. Bitcoin = every "
                    "Bitcoin as Money, Protocol & Scaling, and Wallets & Custody branch, "
                    "plus Builders & Infrastructure > Mining & energy. Other = Stablecoins "
                    "& rails, Prediction & coordination, Products, Open-source projects, "
                    "Policy & Society, and any remaining canonical branch."
                ),
            },
            "diagnostic_summary": diagnostic_summary,
        },
        "overall": {
            "clusters": cluster_rows,
            "bitcoin_ai_summary": bitcoin_ai_summary,
        },
        "clusters": cluster_details,
        "quarters": quarters,
    }

    included_diagnostics = []
    for episode in included:
        included_diagnostics.append({
            **episode,
            "mention_count": episode_counts[episode["youtube_id"]],
        })
    included_diagnostics.sort(key=_episode_metadata_sort_key)

    diagnostics = {
        "metadata": {
            "schema_version": SCHEMA_VERSION,
            "generated_at": generated,
            **diagnostic_summary,
        },
        "discrepancy": {
            "expected_episode_count": expected_episode_count,
            "included_episode_count": len(included),
            "difference": expected_episode_count - len(included),
            "explanation": explanation,
        },
        "included_episodes": included_diagnostics,
        "pbj_like_excluded": selection.pbj_like_excluded,
        "excluded_non_full_pbj": selection.excluded_non_full,
        "missing_transcripts": selection.missing_transcripts,
        "invalid_transcripts": selection.invalid_transcripts,
        "topic_map": map_audit,
        "outer_category_rollup": {
            "category_order": list(OUTER_CLUSTER_ORDER),
            "source_branch_to_outer": [
                {
                    "source": f"{source_cluster} > {source_branch}",
                    "outer": outer,
                }
                for (source_cluster, source_branch), outer in sorted(
                    SOURCE_BRANCH_TO_OUTER.items()
                )
            ],
            "topic_exceptions": dict(sorted(OUTER_TOPIC_EXCEPTIONS.items())),
        },
        "keyword_census": {
            "registry": registry.audit,
            "transcript_totals": {
                key: matcher_totals[key]
                for key in (
                    "timestamp_entry_count",
                    "token_count",
                    "candidate_span_count",
                    "context_rejected_count",
                    "overlap_suppressed_count",
                    "cooldown_suppressed_count",
                    "counted_mention_count",
                    "single_token_mention_count",
                )
            },
            "single_token_mention_share": (
                round(single_token_mentions * 100 / total_mentions, 4)
                if total_mentions
                else 0.0
            ),
            "top_counted_aliases": top_aliases,
            "top_counted_topics": top_topics,
            "curated_pick_evaluation_only": {
                "note": (
                    "Existing curated video picks are used only as a sparse recall "
                    "check and never enter transcript counts or shares."
                ),
                "included_unique_pick_count": len(curated_pick_keys),
                "picks_with_same_topic_episode_keyword_hit": (
                    curated_picks_with_same_episode_hit
                ),
                "picks_with_same_topic_hit_within_60_seconds": (
                    curated_picks_with_nearby_hit
                ),
            },
        },
        "episodes_without_matches": [
            _episode_result(episode, 0)
            for episode in sorted(without_matches, key=_episode_metadata_sort_key)
        ],
    }
    return payload, diagnostics


# A short alias reads naturally in callers that do not need the filename context.
build_payload = build_topic_stats


def serialize_json(value: Mapping) -> str:
    return json.dumps(
        value,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
    ) + "\n"


def write_artifacts(
    payload: Mapping,
    diagnostics: Mapping,
    *,
    output_path: Path = OUT,
    diagnostics_path: Path = DIAGNOSTICS_OUT,
) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    diagnostics_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(serialize_json(payload), encoding="utf-8")
    diagnostics_path.write_text(serialize_json(diagnostics), encoding="utf-8")


def _print_build_diagnostic(diagnostics: Mapping) -> None:
    metadata = diagnostics["metadata"]
    discrepancy = diagnostics["discrepancy"]
    print(
        "PBJ Topic Explorer: "
        f"included {metadata['included_episode_count']} full PBJ episodes "
        f"(public counter {metadata['display_episode_count']}; "
        f"reference expectation {metadata['expected_episode_count']})."
    )
    candidate_count = metadata["pbj_like_excluded_count"]
    candidate_label = "row" if candidate_count == 1 else "rows"
    print(
        "Excluded/diagnosed: "
        f"{candidate_count} PBJ-like {candidate_label} assigned to other series; "
        f"{metadata['excluded_non_full_count']} clip/short/highlight/trailer rows; "
        f"{metadata['missing_transcript_count']} missing transcripts; "
        f"{metadata['invalid_transcript_count']} invalid transcripts; "
        f"{metadata['episodes_without_matches_count']} included episodes with no matches."
    )
    print(discrepancy["explanation"])


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=OUT)
    parser.add_argument("--diagnostics-output", type=Path, default=DIAGNOSTICS_OUT)
    parser.add_argument("--generated-at")
    parser.add_argument(
        "--expected-episode-count",
        type=int,
        default=EXPECTED_EPISODE_COUNT,
    )
    args = parser.parse_args(argv)

    topics = extract_topics()
    topic_map = load_topic_map()
    payload, diagnostics = build_topic_stats(
        read_catalog(),
        topics,
        topic_map,
        root=ROOT,
        generated_at=args.generated_at,
        expected_episode_count=args.expected_episode_count,
    )
    map_metadata = diagnostics["metadata"]
    if (
        map_metadata["unmapped_topic_count"]
        or map_metadata["invalid_mapping_target_count"]
    ):
        print(
            "PBJ Topic Explorer taxonomy validation failed: "
            f"{map_metadata['unmapped_topic_count']} unmapped topics; "
            f"{map_metadata['invalid_mapping_target_count']} invalid mapping targets."
        )
        for name in diagnostics["topic_map"]["unmapped_topics"]:
            print(f"  Unmapped topic: {name}")
        for row in diagnostics["topic_map"]["invalid_targets"]:
            print(f"  Invalid target: {row['topic']} -> {row['target']}")
        return 1
    write_artifacts(
        payload,
        diagnostics,
        output_path=args.output,
        diagnostics_path=args.diagnostics_output,
    )
    _print_build_diagnostic(diagnostics)
    print(f"Wrote {args.output} and {args.diagnostics_output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
