const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const test = require("node:test");

const refreshModule = import(pathToFileURL(
  path.join(__dirname, "..", "netlify", "functions", "refresh-featured.mjs"),
));

test("refresh handler exposes missing build-hook configuration as a failure", async () => {
  const { default: handler } = await refreshModule;
  const previous = process.env.NETLIFY_BUILD_HOOK_URL;
  delete process.env.NETLIFY_BUILD_HOOK_URL;
  try {
    await assert.rejects(handler(), /NETLIFY_BUILD_HOOK_URL is not set/);
  } finally {
    if (previous === undefined) delete process.env.NETLIFY_BUILD_HOOK_URL;
    else process.env.NETLIFY_BUILD_HOOK_URL = previous;
  }
});

test("scheduled featured refresh fails loudly without a build hook", async () => {
  const { triggerFeaturedRefresh } = await refreshModule;
  await assert.rejects(
    triggerFeaturedRefresh({ env: {}, fetchImpl: async () => assert.fail("fetch should not run") }),
    /NETLIFY_BUILD_HOOK_URL is not set/,
  );
});

test("scheduled featured refresh posts the expected build-hook request", async () => {
  const { triggerFeaturedRefresh } = await refreshModule;
  let request;
  await triggerFeaturedRefresh({
    env: { NETLIFY_BUILD_HOOK_URL: "https://api.netlify.com/build_hooks/test-hook" },
    fetchImpl: async (url, options) => {
      request = { url, options };
      return new Response(null, { status: 200 });
    },
  });

  assert.equal(request.url, "https://api.netlify.com/build_hooks/test-hook");
  assert.equal(request.options.method, "POST");
  assert.equal(request.options.headers["content-type"], "application/json");
  assert.deepEqual(JSON.parse(request.options.body), {
    trigger: "scheduled-featured-topics-refresh",
  });
  assert.ok(request.options.signal instanceof AbortSignal);
});

test("scheduled featured refresh reports hook rejections clearly", async () => {
  const { triggerFeaturedRefresh } = await refreshModule;
  await assert.rejects(
    triggerFeaturedRefresh({
      env: { NETLIFY_BUILD_HOOK_URL: "https://api.netlify.com/build_hooks/test-hook" },
      fetchImpl: async () => new Response("invalid build hook", { status: 401 }),
    }),
    /rejected .* HTTP 401: invalid build hook/,
  );
});

test("scheduled featured refresh aborts a stalled hook request", async () => {
  const { triggerFeaturedRefresh } = await refreshModule;
  await assert.rejects(
    triggerFeaturedRefresh({
      env: { NETLIFY_BUILD_HOOK_URL: "https://api.netlify.com/build_hooks/test-hook" },
      timeoutMs: 5,
      fetchImpl: async (_url, { signal }) => new Promise((resolve, reject) => {
        signal.addEventListener("abort", () => {
          const error = new Error("aborted");
          error.name = "AbortError";
          reject(error);
        }, { once: true });
      }),
    }),
    /timed out after 5ms/,
  );
});
