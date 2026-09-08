# Security

Security fixes target the latest code on the default branch. There is no commitment to backport fixes to older snapshots or forks.

## Report a vulnerability

Please do not disclose an unpatched vulnerability, credentials, or private user data in a public issue or pull request.

If GitHub private vulnerability reporting is available, use [Report a vulnerability](https://github.com/presidiobtc/pb-index/security/advisories/new). Otherwise, email Presidio Bitcoin's public contact address, [Hello@presidiobitcoin.org](mailto:Hello@presidiobitcoin.org), with the subject `PB Media Archive security report` and ask for a private reporting channel before sharing sensitive details.

Include the affected commit or deployment, the impact, and the smallest reproducible example. Redact credentials and user data. Test against a local copy or a deployment you control; avoid disruptive testing of the public archive. The maintainers will coordinate disclosure with the reporter where possible; no response-time guarantee or bounty is offered.

## Deployment considerations

- Keep API keys and build hook URLs in server environment settings. Never put them in `public/`, issues, screenshots, or logs you intend to share.
- Ask PB can call a paid API, and its public endpoints accept unauthenticated requests. Review the rate limits in `netlify.toml` and `.env.example` and monitor your deployment's usage.
- Saved answers are readable by anyone with the URL and are created automatically when snapshots are enabled. The application does not implement automatic expiration. Review the [data and privacy notes](README.md#data-and-privacy), or set `ASK_SNAPSHOTS_DISABLED=true` before serving confidential workloads.
- Treat transcripts, descriptions, model output, and external news as untrusted data. The MCP endpoint is read-only and does not make this source text safe to execute as instructions.
- Set `ASK_PUBLIC_ORIGIN` and `MCP_ALLOWED_ORIGINS` for your own domain. Keep dependencies current and run the test suite when updating them.

Repository privacy and saved-answer privacy are separate: publishing the source code does not itself copy Netlify Blobs into Git, but a deployed saved-answer endpoint can already expose a snapshot to anyone who has its URL.
