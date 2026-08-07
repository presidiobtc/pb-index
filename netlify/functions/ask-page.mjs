import { withLambda } from "@netlify/aws-lambda-compat";
import "@netlify/blobs";
import sharedPageModule from "./lib/ask-page-handler.js";

export default withLambda(sharedPageModule.handler);
