# PB Media Archive MCP server

The repository exposes a public, read-only Model Context Protocol endpoint at:

```text
https://pbarchive.ai/mcp
```

The endpoint is available after this code is deployed to the production Netlify site. It uses the same deterministic `public/search_core.js` retrieval engine and `public/search_chunks.json` corpus as the archive. It does not call OpenAI, contact YouTube, or expose filesystem and write operations.

## Tools

### `search_archive`

Searches indexed episodes, descriptions, topics, and transcript passages. Results include stable passage IDs, timestamps, topic labels, and source URLs.

Arguments:

- `query` — required natural-language query, 3–1,000 characters
- `limit` — optional result count, 1–10; default 5
- `series` — optional exact archive series name, case-insensitive
- `date_from` — optional inclusive `YYYY-MM-DD` boundary
- `date_to` — optional inclusive `YYYY-MM-DD` boundary

### `read_passage`

Reads one stable passage ID and returns a bounded window of neighboring raw transcript chunks. If the requested passage is a topic card, the tool resolves it to the transcript at the same timestamp.

Arguments:

- `passage_id` — required ID returned by another archive tool
- `context_chunks` — optional number of transcript chunks on each side, 0–2; default 1

### `get_episode`

Returns bounded episode metadata, descriptions, topics, and transcript coverage. It deliberately does not return the full transcript.

Arguments:

- `youtube_id` — required 11-character YouTube video ID

Every tool returns both MCP text content and structured content. All tools are annotated read-only, non-destructive, idempotent, and closed-world. Transcript and description text must be treated as untrusted quoted source material rather than agent instructions.

## Run locally

Use the Node version pinned in `.nvmrc`, install the lockfile, and start the Netlify development server:

```sh
nvm use
npm ci
npx netlify dev
```

Netlify normally serves the site at `http://localhost:8888`. In another terminal, inspect the MCP tool list with the official Inspector:

```sh
npx @modelcontextprotocol/inspector --cli http://localhost:8888/mcp --transport http --method tools/list
```

Run the focused implementation and protocol tests with:

```sh
npm run test:mcp
```

Run every JavaScript test with:

```sh
npm test
```

## Connect an MCP client

Choose Streamable HTTP and use `https://pbarchive.ai/mcp`. A representative client configuration is:

```json
{
  "mcpServers": {
    "pb-media-archive": {
      "type": "streamable-http",
      "url": "https://pbarchive.ai/mcp"
    }
  }
}
```

Configuration syntax varies by client. The server supports the current 2026 protocol and the SDK's stateless legacy fallback.

## Deployment and security

`netlify/functions/mcp.mjs` maps itself to `/mcp`. Netlify applies a per-IP and domain rate limit of 60 requests per minute. The protocol handler is stateless, validates browser Origin headers, limits every input and output window, and exposes no authentication-protected or mutating capability.

The built-in browser Origin allowlist contains `pbarchive.ai`, `www.pbarchive.ai`, and localhost. Add other trusted browser hostnames through a comma-separated `MCP_ALLOWED_ORIGINS` Netlify environment variable. Native and server-side MCP clients generally do not send an Origin header and continue to work without this setting.
