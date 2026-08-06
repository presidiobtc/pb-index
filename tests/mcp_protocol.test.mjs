import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { mcpHandler } from "../netlify/functions/mcp.mjs";

let client;

function fetchThroughHandler(input, init) {
  return mcpHandler.fetch(input instanceof Request ? input : new Request(input, init));
}

before(async () => {
  const transport = new StreamableHTTPClientTransport(new URL("http://pb.test/mcp"), {
    fetch: fetchThroughHandler,
  });
  client = new Client(
    { name: "pb-mcp-tests", version: "1.0.0" },
    { versionNegotiation: { mode: "auto" } },
  );
  await client.connect(transport);
});

after(async () => {
  await client?.close();
  await mcpHandler.close();
});

test("the endpoint negotiates the modern protocol and advertises only read-only tools", async () => {
  assert.equal(client.getProtocolEra(), "modern");
  const listed = await client.listTools();
  assert.deepEqual(
    listed.tools.map(tool => tool.name),
    ["search_archive", "read_passage", "get_episode"],
  );
  for (const tool of listed.tools) {
    assert.deepEqual(tool.annotations, {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    });
    assert.ok(tool.inputSchema);
    assert.ok(tool.outputSchema);
    assert.doesNotMatch(tool.name, /write|edit|delete|publish|shell/i);
  }
});

test("the endpoint retains stateless compatibility with legacy MCP clients", async () => {
  const legacyTransport = new StreamableHTTPClientTransport(new URL("http://pb.test/mcp"), {
    fetch: fetchThroughHandler,
  });
  const legacyClient = new Client({ name: "pb-legacy-tests", version: "1.0.0" });
  await legacyClient.connect(legacyTransport);
  try {
    assert.equal(legacyClient.getProtocolEra(), "legacy");
    const listed = await legacyClient.listTools();
    assert.deepEqual(
      listed.tools.map(tool => tool.name),
      ["search_archive", "read_passage", "get_episode"],
    );
  } finally {
    await legacyClient.close();
  }
});

test("search_archive returns matching text and structured evidence", async () => {
  const result = await client.callTool({
    name: "search_archive",
    arguments: {
      query: "COLDCARD random number vulnerability",
      limit: 2,
    },
  });

  assert.notEqual(result.isError, true);
  assert.equal(result.structuredContent.result_count, 2);
  assert.equal(result.structuredContent.results[0].youtube_id, "cSXOmwI38Jo");
  assert.ok(result.structuredContent.results[0].timestamp);
  assert.match(result.structuredContent.results[0].source_url, /youtube\.com\/watch/);
  assert.deepEqual(JSON.parse(result.content[0].text), result.structuredContent);
  assert.ok(JSON.stringify(result).length < 100_000);
});

test("read_passage resolves a stable topic ID to raw transcript context", async () => {
  const result = await client.callTool({
    name: "read_passage",
    arguments: {
      passage_id: "topic:ai-security-scanning:cSXOmwI38Jo:2849:1",
      context_chunks: 1,
    },
  });

  assert.notEqual(result.isError, true);
  assert.equal(result.structuredContent.requested_passage.kind, "topic");
  assert.equal(result.structuredContent.transcript_context.length, 3);
  assert.ok(result.structuredContent.transcript_context.every(passage => passage.kind === "transcript"));
  assert.ok(JSON.stringify(result).length < 100_000);
});

test("get_episode returns bounded metadata and all 11 COLDCARD topics", async () => {
  const result = await client.callTool({
    name: "get_episode",
    arguments: { youtube_id: "cSXOmwI38Jo" },
  });

  assert.notEqual(result.isError, true);
  assert.equal(result.structuredContent.title, "PBJ: The COLDCARD Hack and Future of Self-Custody");
  assert.equal(result.structuredContent.topics.length, 11);
  assert.equal(result.structuredContent.transcript.passage_count, 129);
  assert.ok(JSON.stringify(result).length < 100_000);
});

test("invalid tool arguments are rejected without exposing internals", async () => {
  const invalidLimit = await client.callTool({
    name: "search_archive",
    arguments: { query: "bitcoin", limit: 11 },
  });
  assert.equal(invalidLimit.isError, true);
  assert.doesNotMatch(invalidLimit.content[0].text, /node_modules|\/Users\//);

  const unknownPassage = await client.callTool({
    name: "read_passage",
    arguments: { passage_id: "missing:passage" },
  });
  assert.equal(unknownPassage.isError, true);
  assert.match(unknownPassage.content[0].text, /No archive passage/);
  assert.doesNotMatch(unknownPassage.content[0].text, /node_modules|\/Users\//);
});

test("the HTTP boundary rejects an unexpected browser Origin", async () => {
  const response = await mcpHandler.fetch(new Request("http://pb.test/mcp", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://evil.example",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} }),
  }));
  assert.equal(response.status, 403);
  assert.doesNotMatch(await response.text(), /node_modules|\/Users\//);
});

test("the HTTP boundary permits an allowlisted CORS preflight", async () => {
  const response = await mcpHandler.fetch(new Request("http://pb.test/mcp", {
    method: "OPTIONS",
    headers: { origin: "https://pbarchive.ai" },
  }));
  assert.equal(response.status, 204);
  assert.equal(response.headers.get("access-control-allow-origin"), "https://pbarchive.ai");
  assert.match(response.headers.get("access-control-allow-methods"), /POST/);
});

test("a normal browser navigation receives a friendly MCP landing page", async () => {
  const response = await mcpHandler.fetch(new Request("http://pb.test/mcp", {
    method: "GET",
    headers: {
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
    },
  }));

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /^text\/html/);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.match(response.headers.get("vary"), /Accept/);
  assert.match(response.headers.get("content-security-policy"), /frame-ancestors 'none'/);

  const html = await response.text();
  assert.match(html, /PB Media Archive MCP Server/);
  assert.match(html, /https:\/\/pbarchive\.ai\/mcp/);
  assert.match(html, /timestamped transcript segments/);
  assert.doesNotMatch(html, /timestamped transcript evidence/);
  assert.doesNotMatch(html, />Model Context Protocol</);
  assert.match(html, /search_archive/);
  assert.match(html, /read_passage/);
  assert.match(html, /get_episode/);
  assert.doesNotMatch(html, /node_modules|\/Users\//);
  assert.ok(Buffer.byteLength(html) < 20_000);
});

async function assertProtocolOwnsGet(headers = {}) {
  const response = await mcpHandler.fetch(new Request("http://pb.test/mcp", {
    method: "GET",
    headers,
  }));

  assert.equal(response.status, 405);
  assert.match(response.headers.get("content-type") || "", /application\/json/);
  const body = await response.text();
  assert.doesNotMatch(body, /<!doctype html/i);
  assert.equal(JSON.parse(body).error.message, "Method not allowed.");
}

test("MCP event-stream GETs are never replaced by the browser landing page", async () => {
  await assertProtocolOwnsGet({ accept: "text/event-stream" });
  await assertProtocolOwnsGet({ accept: "text/html, text/event-stream" });
});

test("ambiguous and MCP-identified GETs remain owned by the protocol handler", async () => {
  await assertProtocolOwnsGet();
  await assertProtocolOwnsGet({ accept: "*/*" });
  await assertProtocolOwnsGet({ accept: "text/html;q=0" });
  await assertProtocolOwnsGet({
    accept: "text/html",
    "mcp-protocol-version": "2025-11-25",
  });
  await assertProtocolOwnsGet({
    accept: "text/html",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
  });
});

test("Origin validation runs before the browser landing-page branch", async () => {
  const response = await mcpHandler.fetch(new Request("http://pb.test/mcp", {
    method: "GET",
    headers: {
      accept: "text/html",
      origin: "https://evil.example",
    },
  }));

  assert.equal(response.status, 403);
  assert.doesNotMatch(await response.text(), /<!doctype html/i);
});

test("an allowlisted browser Origin receives CORS and content-negotiation variance", async () => {
  const response = await mcpHandler.fetch(new Request("http://pb.test/mcp", {
    method: "GET",
    headers: {
      accept: "text/html",
      origin: "https://pbarchive.ai",
    },
  }));

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("access-control-allow-origin"), "https://pbarchive.ai");
  assert.match(response.headers.get("vary"), /Accept/);
  assert.match(response.headers.get("vary"), /Origin/);
  await response.body?.cancel();
});

test("HEAD and DELETE remain owned by the protocol handler", async () => {
  for (const method of ["HEAD", "DELETE"]) {
    const response = await mcpHandler.fetch(new Request("http://pb.test/mcp", {
      method,
      headers: { accept: "text/html" },
    }));
    assert.equal(response.status, 405);
    assert.doesNotMatch(response.headers.get("content-type") || "", /^text\/html/);
    await response.body?.cancel();
  }
});
