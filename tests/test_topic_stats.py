import json
import sys
import tempfile
import unittest
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))

from build_topic_stats import (  # noqa: E402
    OUTER_CLUSTER_ORDER,
    TopicMap,
    audit_topic_map,
    build_keyword_registry,
    build_topic_stats,
    census_transcript_entries,
    display_episode_count,
    explicit_non_full_marker,
    identify_pbj_episodes,
    load_topic_map,
    normalized_keyword_tokens,
    percentage_shares,
    quarter_id,
    serialize_json,
    topic_cluster,
    write_artifacts,
)
from build_search_chunks import extract_topics  # noqa: E402


CLUSTER_ORDER = (
    "AI & Agents",
    "Bitcoin as Money",
    "Builders & Infrastructure",
    "Other Maps",
    "Policy & Society",
    "Protocol & Scaling",
    "Wallets & Custody",
)

BRANCHES = {
    "AI & Agents": ("Models & labs",),
    "Bitcoin as Money": ("Everyday money",),
    "Builders & Infrastructure": ("Product & distribution",),
    "Other Maps": ("Cross-cutting",),
    "Policy & Society": ("Culture & education",),
    "Protocol & Scaling": ("Bitcoin Core & policy",),
    "Wallets & Custody": ("Self-custody UX",),
}


def make_topic_map(**overrides):
    return TopicMap(CLUSTER_ORDER, BRANCHES, overrides)


def make_topic(name, *picks, keywords=None):
    return {
        "name": name,
        "keywords": list(keywords or [name.lower()]),
        "video_picks": [
            {"youtube_id": youtube_id, "t": timestamp, "label": name}
            for youtube_id, timestamp in picks
        ],
        "report_picks": [],
    }


def transcript_line(seconds, text):
    hours, remainder = divmod(seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    return f"[{hours:02d}:{minutes:02d}:{seconds:02d}] {text}"


class TopicStatsTestCase(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.fixture_root = Path(self.temp_dir.name)

    def tearDown(self):
        self.temp_dir.cleanup()

    def episode(
        self,
        youtube_id,
        *,
        title="A full weekly episode",
        series="PBJ",
        published="2025-01-01",
        transcript=True,
        transcript_text="[00:00:00] fixture transcript",
    ):
        relative = Path("transcripts") / f"{youtube_id}.txt"
        if transcript:
            path = self.fixture_root / relative
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(transcript_text, encoding="utf-8")
        return {
            "youtube_id": youtube_id,
            "youtube_url": f"https://www.youtube.com/watch?v={youtube_id}",
            "title": title,
            "series": series,
            "date": published,
            "transcript_file": str(relative),
        }

    def assert_percent_total(self, rows, expected=Decimal("100.0")):
        actual = sum(Decimal(str(row["share"])) for row in rows)
        self.assertEqual(actual, expected)


class EpisodeIdentificationTests(TopicStatsTestCase):
    def test_pbj_filter_requires_series_full_title_and_existing_transcript(self):
        full = self.episode("aaaaaaaaaaa")
        legitimate_highlights_word = self.episode(
            "bbbbbbbbbbb",
            title="OpenAI and Worldcoin, PB Hackathon Highlights, and Kraken xStocks",
        )
        clip = self.episode("ccccccccccc", title="PBJ Clip: Wallet security")
        short = self.episode("ddddddddddd", title="PBJ: Wallet security #Shorts")
        highlight = self.episode("eeeeeeeeeee", title="[Highlight] PBJ wallet security")
        trailer = self.episode("fffffffffff", title="Trailer: The next PBJ")
        missing = self.episode("ggggggggggg", transcript=False)
        wrong_series = self.episode("hhhhhhhhhhh", series="Builder")
        empty = self.episode("iiiiiiiiiii")
        malformed = self.episode("jjjjjjjjjjj")
        (self.fixture_root / empty["transcript_file"]).write_text("", encoding="utf-8")
        (self.fixture_root / malformed["transcript_file"]).write_text(
            "transcript text without a timestamp", encoding="utf-8"
        )

        selected = identify_pbj_episodes(
            [
                full,
                legitimate_highlights_word,
                clip,
                short,
                highlight,
                trailer,
                missing,
                wrong_series,
                empty,
                malformed,
            ],
            root=self.fixture_root,
        )

        self.assertEqual(
            [row["youtube_id"] for row in selected.included],
            ["aaaaaaaaaaa", "bbbbbbbbbbb"],
        )
        self.assertEqual(
            {row["marker"] for row in selected.excluded_non_full},
            {"clip", "short", "highlight", "trailer"},
        )
        self.assertEqual(
            [row["youtube_id"] for row in selected.missing_transcripts],
            ["ggggggggggg"],
        )
        self.assertEqual(
            {row["youtube_id"] for row in selected.invalid_transcripts},
            {"iiiiiiiiiii", "jjjjjjjjjjj"},
        )
        self.assertEqual(explicit_non_full_marker(legitimate_highlights_word["title"]), None)

    def test_non_pbj_rows_are_diagnosed_only_when_the_title_is_pbj_like(self):
        rows = [
            self.episode("aaaaaaaaaaa", title="PBJ Recap", series="Builder"),
            self.episode("bbbbbbbbbbb", title="Bitcoin Jam live", series="QBS"),
            self.episode(
                "ccccccccccc",
                title="Live Recording of the PBJ",
                series="Type I Summit",
            ),
            self.episode("ddddddddddd", title="Ordinary Builder interview", series="Builder"),
        ]

        selected = identify_pbj_episodes(rows, root=self.fixture_root)

        self.assertEqual(len(selected.included), 0)
        self.assertEqual(len(selected.pbj_like_excluded), 3)
        self.assertEqual(
            {row["series"] for row in selected.pbj_like_excluded},
            {"Builder", "QBS", "Type I Summit"},
        )
        for row in selected.pbj_like_excluded:
            self.assertIn(repr(row["series"]), row["reason"])
            self.assertIn("not 'PBJ'", row["reason"])


class ExistingTaxonomyTests(unittest.TestCase):
    def test_current_topics_map_is_parsed_in_frontend_order_with_same_fallback(self):
        topic_map = load_topic_map()

        self.assertEqual(topic_map.cluster_order, CLUSTER_ORDER)
        self.assertGreater(len(topic_map.overrides), 700)
        self.assertEqual(
            topic_map.assignment("AI privacy"),
            ("AI & Agents", "Models & labs"),
        )
        self.assertEqual(
            topic_map.assignment("A future unmapped topic"),
            ("Other Maps", "Cross-cutting"),
        )
        self.assertEqual(topic_cluster("AI privacy", topic_map), "AI & Agents")

    def test_every_current_topic_has_an_explicit_canonical_map_assignment(self):
        topic_map = load_topic_map()
        current_topics = extract_topics()
        missing = audit_topic_map(current_topics, topic_map)["unmapped_topics"]
        registry = build_keyword_registry(current_topics)

        self.assertEqual(missing, [])
        self.assertEqual(audit_topic_map(current_topics, topic_map)["invalid_targets"], [])
        self.assertEqual(registry.audit["accepted_topic_count"], len(current_topics))
        self.assertEqual(registry.audit["topics_without_accepted_aliases"], [])

    def test_topic_map_audit_reports_missing_names_and_invalid_targets(self):
        topic_map = make_topic_map(**{
            "known topic": "Missing cluster > Missing branch",
            "orphan topic": "AI & Agents > Models & labs",
        })

        audit = audit_topic_map(
            [make_topic("Known Topic"), make_topic("Unmapped Topic")],
            topic_map,
        )

        self.assertEqual(audit["unmapped_topics"], ["Unmapped Topic"])
        self.assertEqual(
            audit["invalid_targets"],
            [{"topic": "known topic", "target": "Missing cluster > Missing branch"}],
        )
        self.assertEqual(audit["orphan_override_keys"], ["orphan topic"])


class PercentageTests(unittest.TestCase):
    def test_largest_remainder_shares_sum_to_exactly_one_hundred(self):
        shares = percentage_shares([1, 1, 1])

        self.assertEqual(shares, [33.34, 33.33, 33.33])
        self.assertEqual(sum(Decimal(str(value)) for value in shares), Decimal("100.00"))
        self.assertEqual(percentage_shares([0, 0, 0]), [0.0, 0.0, 0.0])
        with self.assertRaises(ValueError):
            percentage_shares([1, -1])

    def test_display_counter_advances_once_per_indexed_pbj(self):
        self.assertEqual(display_episode_count(77), 79)
        self.assertEqual(display_episode_count(78), 80)
        self.assertEqual(display_episode_count(79), 81)
        with self.assertRaises(ValueError):
            display_episode_count(-1)


class KeywordCensusTests(unittest.TestCase):
    def test_normalization_preserves_symbols_and_handles_possessives(self):
        self.assertEqual(
            normalized_keyword_tokens("Bitcoin++"),
            ("bitcoin", "plus", "plus"),
        )
        self.assertNotEqual(
            normalized_keyword_tokens("Bitcoin++"),
            normalized_keyword_tokens("bitcoin"),
        )
        self.assertEqual(
            normalized_keyword_tokens("OpenAI's open-source_models"),
            ("openai", "open", "source", "models"),
        )

    def test_shared_aliases_need_a_unique_or_canonical_owner(self):
        topics = [
            make_topic("OP_RETURN", keywords=["op return"]),
            make_topic("Transaction metadata", keywords=["op return"]),
            make_topic("Agentic money", keywords=["agent payments"]),
            make_topic("Agentic web", keywords=["agent payments"]),
        ]

        registry = build_keyword_registry(topics)
        owners = {alias.tokens: alias.topic_name for alias in registry.aliases}

        self.assertEqual(owners[("op", "return")], "OP_RETURN")
        self.assertNotIn(("agent", "payments"), owners)
        self.assertEqual(
            registry.audit["excluded_reason_counts"]["ambiguous_shared_alias"],
            1,
        )

    def test_cross_entry_longest_phrase_boundaries_and_time_limits(self):
        registry = build_keyword_registry([
            make_topic("Google Quantum", keywords=["google quantum"]),
            make_topic("Google Quantum AI", keywords=["google quantum ai"]),
            make_topic("Base Layer", keywords=["base layer"]),
        ])

        mentions, audit = census_transcript_entries(
            [
                (0, "00:00:00", "google"),
                (10, "00:00:10", "quantum ai and database layer"),
            ],
            registry,
        )
        self.assertEqual(
            [(row.topic_name, row.timestamp) for row in mentions],
            [("Google Quantum AI", 0)],
        )
        self.assertGreater(audit["overlap_suppressed_count"], 0)

        too_far, _ = census_transcript_entries(
            [
                (0, "00:00:00", "google"),
                (16, "00:00:16", "quantum ai"),
            ],
            registry,
        )
        self.assertEqual(too_far, [])

    def test_cooldown_counts_repeated_topic_at_most_once_per_thirty_seconds(self):
        registry = build_keyword_registry([
            make_topic("Vibe Coding", keywords=["vibe coding"]),
        ])
        mentions, audit = census_transcript_entries(
            [
                (10, "00:00:10", "vibe coding"),
                (29, "00:00:29", "vibe coding"),
                (40, "00:00:40", "vibe coding"),
            ],
            registry,
        )

        self.assertEqual([row.timestamp for row in mentions], [10, 40])
        self.assertEqual(audit["cooldown_suppressed_count"], 1)

    def test_retrieval_only_phrases_and_all_singletons_are_excluded(self):
        registry = build_keyword_registry([
            make_topic("Core v30", keywords=["bitcoin core", "core version 30"]),
            make_topic("Bark", keywords=["bark"]),
        ])
        aliases = {alias.tokens for alias in registry.aliases}

        self.assertNotIn(("bitcoin", "core"), aliases)
        self.assertIn(("core", "version", "30"), aliases)
        self.assertNotIn(("bark",), aliases)
        self.assertEqual(
            registry.audit["excluded_reason_counts"]["retrieval_only_phrase"],
            1,
        )
        self.assertEqual(
            registry.audit["excluded_reason_counts"]["single_token_alias"],
            1,
        )

    def test_registry_and_matches_do_not_depend_on_topic_or_keyword_order(self):
        forward = [
            make_topic("Open Source AI", keywords=["open source ai", "source available ai"]),
            make_topic("Vibe Coding", keywords=["vibe coding", "coding by vibe"]),
        ]
        reversed_topics = [
            make_topic("Vibe Coding", keywords=["coding by vibe", "vibe coding"]),
            make_topic("Open Source AI", keywords=["source available ai", "open source ai"]),
        ]
        entries = [(10, "00:00:10", "open-source_ai and vibe coding")]
        first_registry = build_keyword_registry(forward)
        second_registry = build_keyword_registry(reversed_topics)
        first, _ = census_transcript_entries(entries, first_registry)
        second, _ = census_transcript_entries(entries, second_registry)

        self.assertEqual(first_registry.aliases, second_registry.aliases)
        self.assertEqual(first, second)


class AggregationTests(TopicStatsTestCase):
    def test_mentions_clusters_topics_episode_links_and_headline_grouping(self):
        first = self.episode(
            "aaaaaaaaaaa",
            published="2025-01-01",
            transcript_text="\n".join((
                transcript_line(10, "AI systems"),
                transcript_line(50, "spending bitcoin"),
            )),
        )
        second = self.episode(
            "bbbbbbbbbbb",
            published="2025-04-01",
            transcript_text="\n".join((
                transcript_line(20, "AI systems"),
                transcript_line(60, "core policy"),
                transcript_line(100, "tiny unmapped topic"),
            )),
        )
        topic_map = make_topic_map(**{
            "ai systems": "AI & Agents > Models & labs",
            "spending bitcoin": "Bitcoin as Money > Everyday money",
            "core policy": "Protocol & Scaling > Bitcoin Core & policy",
        })
        topics = [
            make_topic(
                "AI Systems",
                ("aaaaaaaaaaa", 10),
                ("aaaaaaaaaaa", 10),
                ("bbbbbbbbbbb", 20),
            ),
            make_topic("Spending Bitcoin", ("aaaaaaaaaaa", 30)),
            make_topic("Core Policy", ("bbbbbbbbbbb", 40)),
            make_topic("Tiny unmapped topic", ("bbbbbbbbbbb", 50)),
            make_topic("Excluded series topic", ("ccccccccccc", 60)),
        ]

        payload, diagnostics = build_topic_stats(
            [first, second],
            topics,
            topic_map,
            root=self.fixture_root,
            expected_episode_count=2,
        )

        metadata = payload["metadata"]
        self.assertEqual(metadata["episode_count"], 2)
        self.assertEqual(metadata["episodes_with_matches"], 2)
        self.assertEqual(metadata["matched_topic_mentions"], 5)
        self.assertEqual(
            metadata["metric_name"],
            "deduplicated_transcript_keyword_mentions",
        )
        self.assertEqual(metadata["share_unit"], "percent")
        self.assertEqual(metadata["generated_at"], "2025-04-01T00:00:00Z")
        self.assertIn("not minutes or percentage of airtime", metadata["methodology"]["percentage_basis"])
        self.assertIn("directional", metadata["methodology"]["coverage_caveat"])
        self.assertIn(
            "curated video picks do not enter",
            metadata["methodology"]["summary"],
        )

        rows = payload["overall"]["clusters"]
        self.assertEqual([row["name"] for row in rows], list(OUTER_CLUSTER_ORDER))
        self.assertEqual(
            {row["name"]: row["count"] for row in rows},
            {
                "AI & Agents": 2,
                "Payments, Lightning & Stablecoins": 1,
                "Markets, Investing & Lending": 0,
                "Custody, Wallets & Privacy": 0,
                "Bitcoin Protocol & Security": 1,
                "Mining, Energy & Compute": 0,
                "Products, Builders & Open Source": 0,
                "Policy, Geopolitics & Society": 1,
            },
        )
        self.assert_percent_total(rows)

        ai_detail = payload["clusters"]["ai-agents"]
        self.assertEqual(ai_detail["episode_count"], 2)
        self.assertEqual(ai_detail["topics"][0]["count"], 2)
        self.assertEqual(ai_detail["topics"][0]["share_of_cluster"], 100.0)
        self.assertEqual(len(ai_detail["topics"][0]["episodes"]), 2)
        self.assertTrue(
            all(
                row["url"].startswith("https://www.youtube.com/watch?v=")
                for row in ai_detail["episodes"]
            )
        )

        all_topics = [
            topic
            for cluster in payload["clusters"].values()
            for topic in cluster["topics"]
        ]
        self.assertEqual(sum(topic["count"] for topic in all_topics), 5)
        self.assertEqual(
            sum(Decimal(str(topic["share_overall"])) for topic in all_topics),
            Decimal("100.0"),
        )

        summary = payload["overall"]["bitcoin_ai_summary"]
        self.assertEqual(
            [(row["name"], row["count"]) for row in summary],
            [("Bitcoin", 2), ("AI", 2), ("Other", 1)],
        )
        self.assert_percent_total(summary)
        self.assertEqual(diagnostics["discrepancy"]["difference"], 0)
        self.assertEqual(len(diagnostics["included_episodes"]), 2)

    def test_zero_match_episode_is_kept_in_metadata_and_diagnostics(self):
        episode = self.episode("aaaaaaaaaaa", published="2025-02-10")

        payload, diagnostics = build_topic_stats(
            [episode],
            [],
            make_topic_map(),
            root=self.fixture_root,
            expected_episode_count=1,
        )

        self.assertEqual(payload["metadata"]["episode_count"], 1)
        self.assertEqual(payload["metadata"]["episodes_with_matches"], 0)
        self.assertEqual(payload["metadata"]["episodes_without_matches"], 1)
        self.assertEqual(payload["metadata"]["matched_topic_mentions"], 0)
        self.assertEqual(
            [row["share"] for row in payload["overall"]["clusters"]],
            [0.0] * len(OUTER_CLUSTER_ORDER),
        )
        self.assertEqual(payload["quarters"][0]["id"], "2025-Q1")
        self.assertEqual(payload["quarters"][0]["matched_topic_mentions"], 0)
        self.assertEqual(
            diagnostics["episodes_without_matches"][0]["youtube_id"],
            "aaaaaaaaaaa",
        )

    def test_tiny_clusters_remain_in_underlying_data(self):
        transcript = "\n".join(
            [transcript_line(index * 31, "large topic") for index in range(99)]
            + [transcript_line(4000, "tiny topic")]
        )
        episode = self.episode("aaaaaaaaaaa", transcript_text=transcript)
        topic_map = make_topic_map(**{
            "large topic": "AI & Agents > Models & labs",
            "tiny topic": "Policy & Society > Culture & education",
        })
        topics = [
            make_topic(
                "Large Topic",
                *(("aaaaaaaaaaa", timestamp) for timestamp in range(99)),
            ),
            make_topic("Tiny Topic", ("aaaaaaaaaaa", 100)),
        ]

        payload, _ = build_topic_stats(
            [episode], topics, topic_map, root=self.fixture_root
        )

        rows = {row["name"]: row for row in payload["overall"]["clusters"]}
        self.assertEqual(rows["AI & Agents"]["share"], 99.0)
        self.assertEqual(rows["Policy, Geopolitics & Society"]["share"], 1.0)
        self.assertEqual(
            payload["clusters"]["policy-geopolitics-society"]["topics"][0]["name"],
            "Tiny Topic",
        )


class QuarterTests(TopicStatsTestCase):
    def test_calendar_quarter_boundaries(self):
        self.assertEqual(quarter_id("2024-03-31"), "2024-Q1")
        self.assertEqual(quarter_id("2024-04-01"), "2024-Q2")
        self.assertEqual(quarter_id("2024-06-30"), "2024-Q2")
        self.assertEqual(quarter_id("2024-07-01"), "2024-Q3")
        self.assertEqual(quarter_id("2024-12-31"), "2024-Q4")

    def test_quarters_are_continuous_and_include_no_episode_gaps(self):
        first = self.episode(
            "aaaaaaaaaaa",
            published="2025-01-01",
            transcript_text=transcript_line(10, "AI systems"),
        )
        last = self.episode("bbbbbbbbbbb", published="2025-07-01")
        topic_map = make_topic_map(**{
            "ai systems": "AI & Agents > Models & labs",
        })

        payload, _ = build_topic_stats(
            [first, last],
            [make_topic("AI Systems", ("aaaaaaaaaaa", 10))],
            topic_map,
            root=self.fixture_root,
        )

        quarters = payload["quarters"]
        self.assertEqual([row["id"] for row in quarters], ["2025-Q1", "2025-Q2", "2025-Q3"])
        self.assertEqual([row["episode_count"] for row in quarters], [1, 0, 1])
        self.assertEqual([row["matched_topic_mentions"] for row in quarters], [1, 0, 0])
        self.assert_percent_total(quarters[0]["clusters"])
        self.assert_percent_total(quarters[1]["clusters"], expected=Decimal("0.0"))


class DeterminismTests(TopicStatsTestCase):
    def test_generation_is_byte_deterministic_and_generated_at_is_injectable(self):
        episode = self.episode(
            "aaaaaaaaaaa",
            published="2025-02-03",
            transcript_text=transcript_line(10, "AI systems"),
        )
        topic_map = make_topic_map(**{
            "ai systems": "AI & Agents > Models & labs",
        })
        topics = [make_topic("AI Systems", ("aaaaaaaaaaa", 10))]

        first = build_topic_stats(
            [episode], topics, topic_map, root=self.fixture_root
        )
        second = build_topic_stats(
            [episode], topics, topic_map, root=self.fixture_root
        )
        self.assertEqual(serialize_json(first[0]), serialize_json(second[0]))
        self.assertEqual(serialize_json(first[1]), serialize_json(second[1]))
        self.assertEqual(first[0]["metadata"]["generated_at"], "2025-02-03T00:00:00Z")
        self.assertIn(
            "unsupported by the current repository/catalog snapshot",
            first[1]["discrepancy"]["explanation"],
        )
        self.assertIn("performs no network lookup", first[1]["discrepancy"]["explanation"])

        injected, _ = build_topic_stats(
            [episode],
            topics,
            topic_map,
            root=self.fixture_root,
            generated_at=datetime(2030, 1, 2, 3, 4, 5, tzinfo=timezone.utc),
        )
        self.assertEqual(injected["metadata"]["generated_at"], "2030-01-02T03:04:05Z")

        first_stats = self.fixture_root / "first" / "topic_stats.json"
        first_diagnostics = self.fixture_root / "first" / "diagnostics.json"
        second_stats = self.fixture_root / "second" / "topic_stats.json"
        second_diagnostics = self.fixture_root / "second" / "diagnostics.json"
        write_artifacts(
            first[0],
            first[1],
            output_path=first_stats,
            diagnostics_path=first_diagnostics,
        )
        write_artifacts(
            second[0],
            second[1],
            output_path=second_stats,
            diagnostics_path=second_diagnostics,
        )

        self.assertEqual(first_stats.read_bytes(), second_stats.read_bytes())
        self.assertEqual(first_diagnostics.read_bytes(), second_diagnostics.read_bytes())
        self.assertTrue(first_stats.read_bytes().endswith(b"\n"))
        self.assertNotIn(b": ", first_stats.read_bytes())
        self.assertEqual(json.loads(first_stats.read_text(encoding="utf-8")), first[0])


if __name__ == "__main__":
    unittest.main()
