import { connectLambda } from "@netlify/blobs";
import askModule from "./lib/ask-handler.js";

export const config = {
  path: "/api/ask",
  rateLimit: {
    windowLimit: 30,
    windowSize: 60,
    aggregateBy: ["ip"],
  },
};

export async function handler(event, context) {
  if (event?.blobs) connectLambda(event);
  return askModule.handler(event, context);
}
