import copy
import json
import sys
import unittest
from datetime import date, datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))

from build_featured_topics import (  # noqa: E402
    ExternalItem,
    apply_editorial_controls,
    pb_eligible,
    pb_topic_metrics,
    relevance_guard,
    select_portfolio,
    source_health_ok,
)


AS_OF_DATE = date(2026, 7, 28)
AS_OF_TIME = datetime(2026, 7, 28, 12, 0, tzinfo=timezone.utc)
POLICY = json.loads((ROOT / "featured_topics_policy.json").read_text(encoding="utf-8"))

GOOD_LABEL = (
    "The hosts connect this development to a concrete product tradeoff, explain "
    "the mechanism, and identify why it matters for builders and users."
)


def make_pick(youtube_id, t=100, label=GOOD_LABEL):
    return {"youtube_id": youtube_id, "t": t, "label": label}


def make_topic(name, picks, keywords=None):
    return {
        "name": name,
        "keywords": keywords or [name.lower()],
        "video_picks": picks,
        "report_picks": [],
    }


def make_catalog(**rows):
    return {
        youtube_id: {
            "youtube_id": youtube_id,
            "date": published,
            "series": series,
            "title": title,
        }
        for youtube_id, (published, series, title) in rows.items()
    }


def make_candidate(
    topic,
    score,
    *,
    family=None,
    pillar="misc",
    cluster=None,
    bitcoin_native=False,
):
    family = family or topic.lower().replace(" ", "-")
    return {
        "topic": topic,
        "topic_slug": topic.lower().replace(" ", "-"),
        "score": score,
        "final_score": score,
        "family": family,
        "family_id": family,
        "pillar": pillar,
        "cluster": cluster or f"story-{topic.lower().replace(' ', '-')}",
        "bitcoin_native": bitcoin_native,
        "external_items": [
            {
                "title": f"Current reporting about {topic}",
                "url": f"https://example.test/{topic.lower().replace(' ', '-')}",
                "source": "Example",
                "published": "2026-07-28",
            }
        ],
    }


def candidate_score(candidate):
    return candidate.get("final_score", candidate.get("score"))


def active_control(topic, *, position=None):
    control = {
        "topic": topic,
        "starts_at": "2026-07-27T00:00:00Z",
        "expires_at": "2026-07-30T00:00:00Z",
        "reason": "Time-bounded editorial judgment",
        "editor": "test-editor",
    }
    if position is not None:
        control["position"] = position
    return control


def active_block(topic_or_family):
    return {
        "topic_or_family": topic_or_family,
        "starts_at": "2026-07-27T00:00:00Z",
        "expires_at": "2026-07-30T00:00:00Z",
        "reason": "Known mismatch",
        "editor": "test-editor",
    }


class PBTopicMetricsTests(unittest.TestCase):
    def test_metrics_count_unique_episodes_passages_series_and_recency(self):
        topic = make_topic(
            "Open-source AI",
            [
                make_pick("episode-a", 100),
                make_pick("episode-a", 900),
                make_pick("episode-b", 200),
                make_pick("episode-c", 300),
            ],
        )
        catalog = make_catalog(
            **{
                "episode-a": ("2026-07-18", "PBJ", "Open-weight models"),
                "episode-b": ("2026-07-09", "Builder", "Open-source agents"),
                "episode-c": ("2026-03-19", "PBJ", "Funding open-source AI"),
            }
        )

        metrics = pb_topic_metrics(topic, catalog, AS_OF_DATE)

        self.assertEqual(metrics["episode_count"], 3)
        self.assertEqual(metrics["passage_count"], 4)
        self.assertEqual(metrics["series_count"], 2)
        self.assertEqual(metrics["latest_date"], "2026-07-18")
        self.assertEqual(metrics["latest_age_days"], 10)
        self.assertGreater(metrics["pb_strength_score"], 55)

    def test_family_members_roll_up_without_double_counting_shared_picks(self):
        canonical = make_topic("Strategy", [make_pick("episode-a", 100)])
        members = [
            make_topic(
                "Strategy capital structure",
                [make_pick("episode-a", 100), make_pick("episode-b", 200)],
            ),
            make_topic("Strategy selling bitcoin", [make_pick("episode-c", 300)]),
        ]
        catalog = make_catalog(
            **{
                "episode-a": ("2026-07-04", "PBJ", "Strategy reserve"),
                "episode-b": ("2026-05-23", "PBJ", "MSTR and STRC"),
                "episode-c": ("2026-05-09", "The Bitcoin Age", "Selling bitcoin"),
            }
        )

        metrics = pb_topic_metrics(
            canonical,
            catalog,
            AS_OF_DATE,
            family_members=members,
        )

        self.assertEqual(metrics["episode_count"], 3)
        self.assertEqual(metrics["passage_count"], 3)
        self.assertEqual(metrics["series_count"], 2)
        self.assertTrue(pb_eligible(metrics, POLICY))

    def test_clarity_act_and_tokenized_stocks_are_not_core_eligible(self):
        cases = [
            (
                make_topic("Clarity Act", [make_pick("clarity")]),
                make_catalog(
                    clarity=("2025-10-28", "21 in 21", "Save Our Wallets")
                ),
            ),
            (
                make_topic("Tokenized stocks", [make_pick("stocks")]),
                make_catalog(
                    stocks=("2025-07-09", "PBJ", "Robinhood tokenized stocks")
                ),
            ),
        ]

        for topic, catalog in cases:
            with self.subTest(topic=topic["name"]):
                metrics = pb_topic_metrics(topic, catalog, AS_OF_DATE)
                self.assertEqual(metrics["episode_count"], 1)
                self.assertFalse(pb_eligible(metrics, POLICY))

    def test_current_multi_episode_topic_is_core_eligible(self):
        topic = make_topic(
            "AI privacy",
            [
                make_pick("privacy-a"),
                make_pick("privacy-b"),
                make_pick("privacy-c"),
                make_pick("privacy-d"),
            ],
        )
        catalog = make_catalog(
            **{
                "privacy-a": ("2026-07-16", "Builder", "Local AI and privacy"),
                "privacy-b": ("2026-07-11", "PBJ", "Cross-model data leakage"),
                "privacy-c": ("2026-05-02", "PBJ", "Private inference"),
                "privacy-d": ("2026-01-13", "21 in 21", "Privacy-first AI"),
            }
        )

        metrics = pb_topic_metrics(topic, catalog, AS_OF_DATE)

        self.assertGreaterEqual(metrics["episodes_365d"], 2)
        self.assertTrue(pb_eligible(metrics, POLICY))


class RelevanceGuardTests(unittest.TestCase):
    def test_strategy_word_alone_does_not_match_the_strategy_company(self):
        topic = make_topic(
            "Strategy",
            [make_pick("strategy")],
            keywords=["strategy", "microstrategy", "mstr", "saylor", "strategy bitcoin"],
        )
        generic_article = ExternalItem(
            "Microsoft outlines a new AI strategy for enterprise customers",
            "The cloud provider changed its product roadmap.",
            "https://example.test/generic-strategy",
            "Reuters Technology",
            "2026-07-28",
        )
        selling_strategy_article = ExternalItem(
            "Core Scientific adds bitcoin despite selling strategy",
            "The miner discussed its balance sheet.",
            "https://example.test/selling-strategy",
            "Bitcoin Magazine",
            "2026-07-28",
        )
        explicit_article = ExternalItem(
            "Saylor's Strategy adds to its bitcoin reserve",
            "MSTR discussed its capital structure and BTC holdings.",
            "https://example.test/mstr",
            "Reuters Crypto",
            "2026-07-28",
        )

        self.assertFalse(relevance_guard(topic, generic_article))
        self.assertFalse(relevance_guard(topic, selling_strategy_article))
        self.assertTrue(relevance_guard(topic, explicit_article))

    def test_central_bank_quantum_story_is_not_a_bitcoin_vs_gold_story(self):
        topic = make_topic(
            "Bitcoin vs. gold",
            [make_pick("gold")],
            keywords=[
                "bitcoin gold",
                "bitcoin priced in gold",
                "btc gold ratio",
                "central bank",
                "digital gold",
            ],
        )
        wrong_story = ExternalItem(
            "Central bank warns quantum computers could threaten bitcoin keys",
            "Officials called for post-quantum cryptography research.",
            "https://example.test/central-bank-quantum",
            "Reuters Technology",
            "2026-07-28",
        )
        aligned_story = ExternalItem(
            "Central-bank gold buying pushes bitcoin-to-gold ratio lower",
            "Gold outperformed BTC as reserve managers accumulated bullion.",
            "https://example.test/bitcoin-gold",
            "Reuters Crypto",
            "2026-07-28",
        )

        self.assertFalse(relevance_guard(topic, wrong_story))
        self.assertTrue(relevance_guard(topic, aligned_story))


class EditorialControlTests(unittest.TestCase):
    def test_active_pin_moves_topic_to_requested_position_and_block_removes_topic(self):
        candidates = [
            make_candidate("First", 90, family="first"),
            make_candidate("Blocked", 85, family="blocked-family"),
            make_candidate("Pinned", 70, family="pinned"),
        ]
        controls = {
            "pins": [active_control("Pinned", position=1)],
            "blocks": [active_block("blocked-family")],
            "boosts": [],
        }

        controlled = apply_editorial_controls(candidates, controls, AS_OF_TIME)

        self.assertEqual([item["topic"] for item in controlled], ["Pinned", "First"])

    def test_expired_pins_blocks_and_boosts_are_ignored(self):
        candidates = [
            make_candidate("First", 90, family="first"),
            make_candidate("Second", 80, family="second"),
        ]
        expired = {
            "starts_at": "2026-07-01T00:00:00Z",
            "expires_at": "2026-07-27T00:00:00Z",
            "reason": "Expired test control",
            "editor": "test-editor",
        }
        controls = {
            "pins": [{**expired, "topic": "Second", "position": 1}],
            "blocks": [{**expired, "topic_or_family": "first"}],
            "boosts": [{**expired, "topic_or_family": "second", "points": 10}],
        }

        controlled = apply_editorial_controls(candidates, controls, AS_OF_TIME)

        self.assertEqual([item["topic"] for item in controlled], ["First", "Second"])
        self.assertEqual([candidate_score(item) for item in controlled], [90, 80])

    def test_active_boost_is_bounded_and_does_not_mutate_input(self):
        candidates = [make_candidate("Boosted", 80, family="boosted")]
        controls = {
            "pins": [],
            "blocks": [],
            "boosts": [
                {
                    "topic_or_family": "boosted",
                    "points": 7,
                    "starts_at": "2026-07-27T00:00:00Z",
                    "expires_at": "2026-07-30T00:00:00Z",
                    "reason": "Material PB relevance",
                    "editor": "test-editor",
                }
            ],
        }

        controlled = apply_editorial_controls(candidates, controls, AS_OF_TIME)

        self.assertEqual(candidate_score(controlled[0]), 87)
        self.assertEqual(candidate_score(candidates[0]), 80)


class PortfolioSelectionTests(unittest.TestCase):
    def portfolio_policy(self):
        policy = copy.deepcopy(POLICY)
        policy["diversity"]["max_topics_per_family"] = 1
        policy["diversity"]["default_max_topics_per_pillar"] = 5
        policy["diversity"]["pillar_caps"] = {"ai": 1}
        policy["diversity"]["bitcoin_native_floor_when_qualified"] = 0
        policy["refresh_and_stability"]["challenger_margin_points"] = 8
        policy["refresh_and_stability"]["max_normal_replacements_per_24_hours"] = 2
        return policy

    def test_portfolio_enforces_family_and_pillar_caps(self):
        candidates = [
            make_candidate("A", 100, family="shared", pillar="ai"),
            make_candidate("B", 99, family="shared", pillar="other"),
            make_candidate("C", 98, family="c", pillar="ai"),
            make_candidate("D", 97, family="d", pillar="bitcoin-payments"),
            make_candidate("E", 96, family="e", pillar="protocol-security"),
            make_candidate("F", 95, family="f", pillar="other"),
            make_candidate("G", 94, family="g", pillar="other"),
            make_candidate("H", 93, family="h", pillar="other"),
        ]

        selected = select_portfolio(candidates, self.portfolio_policy())
        topics = [item["topic"] for item in selected]

        self.assertEqual(len(selected), 5)
        self.assertIn("A", topics)
        self.assertNotIn("B", topics)
        self.assertNotIn("C", topics)
        self.assertEqual(sum(item["pillar"] == "ai" for item in selected), 1)
        self.assertEqual(len({item["family_id"] for item in selected}), len(selected))

    def test_incumbent_survives_challenger_below_margin(self):
        policy = self.portfolio_policy()
        policy["diversity"]["pillar_caps"] = {}
        previous = [
            make_candidate("A", 100),
            make_candidate("B", 90),
            make_candidate("C", 80),
            make_candidate("D", 70),
            make_candidate("Incumbent", 60),
        ]
        candidates = [*previous, make_candidate("Challenger", 67)]

        selected = select_portfolio(candidates, policy, previous=previous)
        topics = {item["topic"] for item in selected}

        self.assertIn("Incumbent", topics)
        self.assertNotIn("Challenger", topics)

    def test_challenger_above_margin_replaces_incumbent(self):
        policy = self.portfolio_policy()
        policy["diversity"]["pillar_caps"] = {}
        previous = [
            make_candidate("A", 100),
            make_candidate("B", 90),
            make_candidate("C", 80),
            make_candidate("D", 70),
            make_candidate("Incumbent", 60),
        ]
        candidates = [*previous, make_candidate("Challenger", 69)]

        selected = select_portfolio(candidates, policy, previous=previous)
        topics = {item["topic"] for item in selected}

        self.assertNotIn("Incumbent", topics)
        self.assertIn("Challenger", topics)

    def test_daily_replacement_cap_limits_churn(self):
        policy = self.portfolio_policy()
        policy["diversity"]["pillar_caps"] = {}
        previous = [make_candidate(name, 50) for name in ["A", "B", "C", "D", "E"]]
        challengers = [make_candidate(name, 90) for name in ["F", "G", "H"]]

        selected = select_portfolio([*previous, *challengers], policy, previous=previous)
        previous_topics = {item["topic"] for item in previous}

        self.assertGreaterEqual(
            sum(item["topic"] in previous_topics for item in selected),
            3,
        )


class SourceHealthTests(unittest.TestCase):
    def test_source_health_requires_both_count_and_ratio(self):
        healthy = {
            "successful_priority_sources": 7,
            "total_priority_sources": 10,
        }
        too_few = {
            "successful_priority_sources": 5,
            "total_priority_sources": 7,
        }
        poor_ratio = {
            "successful_priority_sources": 6,
            "total_priority_sources": 10,
        }

        self.assertTrue(source_health_ok(healthy, POLICY))
        self.assertFalse(source_health_ok(too_few, POLICY))
        self.assertFalse(source_health_ok(poor_ratio, POLICY))

    def test_source_health_accepts_exact_thresholds(self):
        health = {
            "successful_priority_sources": 7,
            "total_priority_sources": 10,
        }
        policy = copy.deepcopy(POLICY)
        policy["source_health"]["min_successful_priority_sources"] = 7
        policy["source_health"]["min_priority_source_success_ratio"] = 0.7

        self.assertTrue(source_health_ok(health, policy))

    def test_zero_attempted_sources_is_unhealthy(self):
        health = {
            "successful_priority_sources": 0,
            "total_priority_sources": 0,
        }

        self.assertFalse(source_health_ok(health, POLICY))


if __name__ == "__main__":
    unittest.main()
