import { withLambda } from "@netlify/aws-lambda-compat";
import "@netlify/blobs";
import askModule from "./lib/ask-handler.js";

export const config = {
  path: "/api/ask",
  rateLimit: {
    windowLimit: 30,
    windowSize: 60,
    aggregateBy: ["ip"],
  },
};

export default withLambda(askModule.handler);
