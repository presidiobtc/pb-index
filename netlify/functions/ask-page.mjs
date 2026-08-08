import { connectLambda } from "@netlify/blobs";
import sharedPageModule from "./lib/ask-page-handler.js";

export const config = {
  path: "/ask/shared/:id",
};

export async function handler(event) {
  if (event?.blobs) connectLambda(event);
  const id = String(event?.path || "").match(/^\/ask\/shared\/([^/]+)\/?$/)?.[1];
  const queryStringParameters = { ...(event?.queryStringParameters || {}) };
  if (id) queryStringParameters.id = decodeURIComponent(id);
  return sharedPageModule.handler({ ...event, queryStringParameters });
}
