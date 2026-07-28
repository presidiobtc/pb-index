# Featured Now

Featured Now is rebuilt automatically by `scripts/build_featured_topics.py`.
Its objective is to select current developments for which the PB archive has a
strong, useful, and representative point of view—not simply the five loudest
headlines.

## Selection flow

1. Fetch dated stories from the trusted source list for the last 28 days.
2. Roll closely related PB topic cards into the curated families in
   `featured_topics_policy.json` for coverage measurement.
3. Require recurring PB coverage (normally at least two episodes in the last
   year), a usable destination card, a direct headline match, and credible
   current evidence.
4. Score qualified topics: PB strength 45%, current relevance 30%, story/PB
   alignment 15%, and destination quality 10%.
5. Optionally adjudicate the small deterministic candidate set with one OpenAI
   Responses API call. If no key is available or the call fails, the strict
   deterministic result is used.
6. Select up to five with family, story, pillar, Bitcoin-mix, and churn limits.

The page reads `public/featured_topics.json`. A detailed, non-secret audit is
written to `public/featured_topics_diagnostics.json` on every healthy build.

## One-time Netlify setup

1. In Netlify, create a build hook for the production branch.
2. Save its URL as the secret environment variable
   `NETLIFY_BUILD_HOOK_URL`.
3. Redeploy once so the scheduled function receives the variable.

Netlify then runs `refresh-featured` daily at 14:00 UTC (about 6–7 a.m. Pacific),
which invokes the hook. Every normal content deployment also reruns the ranker.

`OPENAI_API_KEY` is optional for Featured Now and is reused when already set for
Ask PB. The other optional settings and defaults are documented in
`.env.example`.

## Failure behavior

Source health is checked before publishing. If it drops below policy thresholds,
the last known good selection is retained for at most 72 hours. After that the
build fails so it cannot replace the working deployment, while the browser hides
the expired selection using its original selection timestamp. A model outage
does not block the build; selection falls back to deterministic checks.

## Editorial controls

`featured_topics_overrides.json` supports short-lived `pins`, `blocks`, and
bounded score `boosts`. Every control needs a start, expiration, reason, and
editor. Pins and boosts may last at most 14 days; blocks at most 30. Controls can
only affect topics that already passed the automatic quality gates, so this file
cannot become another frozen five-topic list.

## Local verification

```sh
python3 -m unittest tests.test_featured_topics
node --test tests/refresh_featured.test.js
FEATURED_JUDGE_ENABLED=false python3 scripts/build_featured_topics.py
```
