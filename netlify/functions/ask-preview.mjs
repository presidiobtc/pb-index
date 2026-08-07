import { withLambda } from "@netlify/aws-lambda-compat";
import "@netlify/blobs";
import "@resvg/resvg-js";
import "satori";
import previewModule from "./lib/ask-preview-handler.js";

export default withLambda(previewModule.handler);
