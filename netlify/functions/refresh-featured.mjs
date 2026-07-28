const DEFAULT_BUILD_HOOK_TIMEOUT_MS = 15000;

function buildHookUrlFromEnv(env) {
  const value = env.NETLIFY_BUILD_HOOK_URL?.trim();
  if (!value) {
    throw new Error(
      "Scheduled featured-topic refresh is misconfigured: NETLIFY_BUILD_HOOK_URL is not set.",
    );
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(
      "Scheduled featured-topic refresh is misconfigured: NETLIFY_BUILD_HOOK_URL is not a valid URL.",
    );
  }
  if (!new Set(["http:", "https:"]).has(url.protocol)) {
    throw new Error(
      "Scheduled featured-topic refresh is misconfigured: NETLIFY_BUILD_HOOK_URL must use HTTP or HTTPS.",
    );
  }
  return url.toString();
}

export async function triggerFeaturedRefresh({
  env = process.env,
  fetchImpl = globalThis.fetch,
  timeoutMs = DEFAULT_BUILD_HOOK_TIMEOUT_MS,
} = {}) {
  const buildHookUrl = buildHookUrlFromEnv(env);
  if (typeof fetchImpl !== "function") {
    throw new Error("Scheduled featured-topic refresh cannot run because fetch is unavailable.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetchImpl(buildHookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ trigger: "scheduled-featured-topics-refresh" }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = (await response.text()).trim().slice(0, 500);
      throw new Error(
        `Netlify build hook rejected the scheduled featured-topic refresh with HTTP ${response.status}`
        + (detail ? `: ${detail}` : "."),
      );
    }
  } catch (error) {
    if (controller.signal.aborted || error?.name === "AbortError") {
      throw new Error(
        `Netlify build hook timed out after ${timeoutMs}ms while scheduling the featured-topic refresh.`,
        { cause: error },
      );
    }
    if (error instanceof Error && error.message.startsWith("Netlify build hook rejected")) {
      throw error;
    }
    throw new Error(
      `Netlify build hook request failed while scheduling the featured-topic refresh: ${error?.message || "unknown error"}`,
      { cause: error },
    );
  } finally {
    clearTimeout(timeout);
  }
}

export default async function handler() {
  await triggerFeaturedRefresh();
  console.log("Triggered Netlify build hook for featured-topic refresh.");
  return new Response(null, { status: 204 });
}
