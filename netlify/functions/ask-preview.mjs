import { connectLambda } from "@netlify/blobs";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import cardModule from "./lib/ask-card.js";
import previewModule from "./lib/ask-preview-handler.js";

cardModule.configureCardRuntime({ satori, Resvg });

export const config = {
  path: "/ask/shared/:id/card.png",
};

export async function handler(event) {
  if (event?.blobs) connectLambda(event);
  const id = String(event?.path || "").match(/^\/ask\/shared\/([^/]+)\/card\.png\/?$/)?.[1];
  const queryStringParameters = { ...(event?.queryStringParameters || {}) };
  if (id) queryStringParameters.id = decodeURIComponent(id);
  return previewModule.handler({ ...event, queryStringParameters });
}
