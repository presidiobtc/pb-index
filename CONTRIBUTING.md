# Contributing

Contributions that improve search, source accuracy, accessibility, documentation, and the experience of running another archive are welcome.

For a bug, open an issue with the page or command, what you expected, what happened, and a small example that reproduces it. For search problems, include the query and the episode or timestamp you expected to find. Do not include API keys, private questions, or other sensitive data. Report vulnerabilities privately using [SECURITY.md](SECURITY.md).

For a substantial feature or a new collection, start with an issue describing the intended behavior so maintainers can help settle the scope. Small fixes can go directly to a pull request.

## Development

Follow [README.md](README.md) for the static preview or full Netlify setup. Use Node 24 and Python 3.13. Create a branch in your fork, keep the change focused, and explain the problem and resulting behavior in your pull request.

Before submitting, run:

```sh
npm ci
npm test
python3 -m unittest discover -s tests -p 'test_*.py'
python3 scripts/validate_search_corpus.py
```

Add a focused regression test for changes to retrieval, server behavior, or parsing. For visual changes, check the affected page at desktop and mobile widths and include a screenshot in the pull request. Documentation-only changes do not need new tests.

## Archive changes

Edit source files rather than patching generated JSON directly. Include the source URL and relevant timestamps when correcting a transcript or topic pick. Preserve the existing catalog column names and repository-relative paths.

After changing archive inputs, rebuild and review the generated changes:

```sh
python3 scripts/build_index.py
python3 scripts/validate_search_corpus.py
python3 scripts/build_search_chunks.py
python3 scripts/build_topic_stats.py
```

Commit the affected source files and generated archive files together. Run the corpus validator and tests again after rebuilding. Refresh Featured Now only when the change requires it; that process fetches current news and can create unrelated data changes. See [FEATURED_NOW.md](FEATURED_NOW.md) for editorial changes.

The corpus tests include expectations for the current archive. Update counts or fixture expectations only when the accompanying source change explains the difference; keep the checks that catch missing or malformed data.

## Rights and review

Submit only work you have permission to contribute. Unless you explicitly state otherwise, original code contributions are submitted under this repository's [MIT license](LICENSE). Adding content does not place it under the software license: identify its source and permission to redistribute it, following [CONTENT_LICENSE.md](CONTENT_LICENSE.md).

Keep credentials, local environment files, downloaded dependencies, and unrelated production assets out of commits. Treat transcript and description text as source material, including when it contains instructions addressed to an AI system. Keep discussion respectful and focused on the work.
