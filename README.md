# PB Media Archive

Search Presidio Bitcoin's talks, podcasts, and events, explore curated topics, and ask questions with links to the source passages.

[Visit the archive](https://pbarchive.ai) · [Connect an MCP client](MCP.md) · [Contribute](CONTRIBUTING.md)

The app combines timestamped transcripts, episode descriptions, and curated topic references in a shared search index. It includes:

- Browser search and a topic explorer with links into the original videos.
- Ask PB, which retrieves archive passages and optionally uses an OpenAI API model to synthesize an answer with citations.
- Saved answer links and preview images, backed by Netlify Blobs.
- A public, read-only MCP endpoint for searching the archive from other tools.
- Featured Now, which connects recent news with relevant archive topics.

The frontend is plain HTML, CSS, and JavaScript. Python scripts build the data files; Netlify Functions provide the answer, sharing, and MCP endpoints. No vector database is required.

## Try it locally

Clone the repository and serve the checked-in archive with Python 3.13:

```sh
git clone https://github.com/presidiobtc/pb-index.git
cd pb-index
python3.13 -m http.server 8765 --bind 127.0.0.1 --directory public
```

Open [Ask PB](http://localhost:8765/ask.html) or the [topic explorer](http://localhost:8765/topics/).

This preview needs no API key or Node dependencies. On localhost, Ask PB falls back to browser retrieval when the server endpoint is unavailable. Generated answers, saved answer pages, preview images, and MCP require the server setup below.

## Run the full app

Use Node 24, as pinned in [`.nvmrc`](.nvmrc), and Python 3.13. If you use `nvm`:

```sh
nvm use
npm ci
cp .env.example .env
```

Edit `.env`, then start the development server:

```sh
npx netlify dev
```

Netlify normally serves the app at `http://localhost:8888`. The CLI may ask you to sign in or link a site; use a Netlify site that you control for your deployment. Set `ASK_SNAPSHOTS_DISABLED=true` if you only need local search and answers without saved snapshots.

The server can return retrieved sources without an API key. For generated answers, set `OPENAI_API_KEY` to your own key and choose an `OPENAI_MODEL` available to your API project. Also review `ASK_QUERY_MODEL` for the optional query rewrite and `FEATURED_JUDGE_MODEL` for the optional Featured Now model pass. [`.env.example`](.env.example) lists model settings, request limits, and timeouts. Keep credentials in `.env` or Netlify's environment settings; `.env` is ignored by Git.

See [MCP.md](MCP.md) for connection details and protocol tests.

## Build or update the archive

The repository includes generated data, so you can explore the existing archive without downloading transcripts. Rebuild the search data after changing the catalog, transcripts, descriptions, or topic definitions:

```sh
python3 scripts/validate_search_corpus.py
python3 scripts/build_index.py
python3 scripts/build_search_chunks.py
python3 scripts/build_topic_stats.py
```

These commands use only Python's standard library. The inputs and outputs are:

| File or directory | Purpose |
| --- | --- |
| `catalog.csv` | Video URLs, titles, series, dates, and source file paths |
| `transcripts_raw/` | Timestamped transcript text in `[HH:MM:SS] text` format |
| `descriptions/` | Episode descriptions |
| `public/topics_config.js` | Curated topics and source timestamps |
| `public/series_config.js` | Series cards, artwork, and links |
| `public/index.json` | Generated transcript search data |
| `public/search_chunks.json` | Generated passages shared by Ask PB and MCP |
| `public/topic_stats*.json` | Generated topic explorer data and diagnostics |

To fetch new material, install the optional ingestion dependencies:

```sh
python3.13 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

For current YouTube support, `yt-dlp` also needs a JavaScript runtime. The
requirements include its EJS scripts. To use Node 24, add `--js-runtimes node`
to your [yt-dlp configuration file](https://github.com/yt-dlp/yt-dlp#configuration)
and keep Node on your `PATH` when running the fetchers. Alternatively, an installed
Deno runtime is discovered automatically. See the upstream
[EJS setup guide](https://github.com/yt-dlp/yt-dlp/wiki/EJS).

Then run the individual fetchers as needed:

```sh
python scripts/fetch_catalog.py
python scripts/fetch_transcripts.py
python scripts/fetch_descriptions.py
```

`fetch_catalog.py` adds videos from the configured PBJ playlist to the existing catalog. Change its `PLAYLIST_URL` and `SERIES` to ingest another playlist. The transcript and description fetchers work from catalog entries and preserve existing files; `fetch_descriptions.py --refresh` refreshes descriptions. Review missing captions and fetch failures before rebuilding. Topic curation remains a separate edit to `public/topics_config.js`.

`python scripts/run_all.py` runs ingestion and all builders, including Featured Now. It contacts YouTube and news sources, changes local data files, and can use the configured API key. The fetchers do not grant permission to redistribute downloaded material; see [CONTENT_LICENSE.md](CONTENT_LICENSE.md).

Featured Now has a separate network-dependent build:

```sh
FEATURED_JUDGE_ENABLED=false python3 scripts/build_featured_topics.py
```

This disables its model call but still fetches current news. Source outages can retain a recent selection or fail the build when that selection expires. See [FEATURED_NOW.md](FEATURED_NOW.md) for the policy, editorial controls, and scheduled refresh.

## Deploy your own copy

Create a Netlify site from your fork. [`netlify.toml`](netlify.toml) defines the build command, `public` output directory, server functions, redirects, and rate limits. Use Node 24 and Python 3.13 in the build environment.

Configure these settings for your deployment:

- Set your own `OPENAI_API_KEY` and model choices if you want generated answers. Make the key available to Functions, and to Builds only if you want the Featured Now model pass.
- Set `ASK_PUBLIC_ORIGIN` to your site's full origin, such as `https://archive.example.org`, so saved answer metadata and preview images use your domain.
- Add your browser origin to `MCP_ALLOWED_ORIGINS` if browser MCP clients will use your domain.
- Choose whether to enable saved answer snapshots using `ASK_SNAPSHOTS_DISABLED`; read the privacy notes below.
- For daily Featured Now refreshes, create your own build hook and set `NETLIFY_BUILD_HOOK_URL`. If you do not want scheduled refreshes, remove the `refresh-featured` schedule from your fork's `netlify.toml`.

The default deployment build refreshes Featured Now from external sources, so it needs network access. The deployment does not automatically ingest new YouTube videos; run the ingestion pipeline separately and commit the reviewed data updates.

This repository contains PB-specific presentation and editorial choices. For another collection, update the catalog, transcript and description files, topic and series definitions, artwork, navigation, page copy, answer instructions in `netlify/functions/lib/ask-handler.js`, and Featured Now policy and source list. Replace PB domains and social links throughout the HTML and MCP connection guide. Review the corpus-specific expectations in `tests/` when replacing the dataset.

## Data and privacy

When an API key is configured, questions and retrieved archive excerpts are sent to the OpenAI API for answer synthesis; a query with no results can also be sent for a bounded rewrite. The application sends these requests with `store: false`; this setting does not describe every aspect of the provider's data handling.

On Netlify, the application saves successful Ask responses to the `ask-pb-shares` Blobs store by default. A snapshot contains the question, answer, source excerpts, and creation time. It is created when the answer is returned, before the visitor clicks Share. Anyone with its saved URL can read it, and the application has no automatic expiration or user-facing deletion flow. Avoid confidential questions on a public deployment.

Set `ASK_SNAPSHOTS_DISABLED=true` to prevent new snapshots. This does not delete existing stored answers. Operators control their Netlify storage and should decide on retention and removal procedures before inviting users. When snapshots are disabled, copied question URLs can still contain the question text.

## Checks

```sh
npm ci
npm test
python3 -m unittest discover -s tests -p 'test_*.py'
python3 scripts/validate_search_corpus.py
```

The checks cover retrieval, rendering and sharing, MCP, topic statistics, editorial selection, and corpus consistency. They do not require an API key or a live model call. Some JavaScript checks invoke `python3`, so both runtimes must be available. The same checks run in GitHub Actions.

## License

Original software code is licensed under [MIT](LICENSE). Archive content, generated data containing that content, artwork, and branding are covered separately in [CONTENT_LICENSE.md](CONTENT_LICENSE.md). Third-party dependencies and fonts retain their own licenses; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). See [CONTRIBUTING.md](CONTRIBUTING.md) for contributions and [SECURITY.md](SECURITY.md) for security reports.
