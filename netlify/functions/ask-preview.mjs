import { withLambda } from "@netlify/aws-lambda-compat";
import "@netlify/blobs";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import cardModule from "./lib/ask-card.js";
import previewModule from "./lib/ask-preview-handler.js";

cardModule.configureCardRuntime({ satori, Resvg });

const previewHandler = withLambda(previewModule.handler);

export const config = {
  path: "/ask/shared/:id/card.png",
};

export default function handlePreviewCard(request, context) {
  const id = context?.params?.id;
  if (!id) return previewHandler(request, context);
  const url = new URL(request.url);
  url.searchParams.set("id", id);
  return previewHandler(new Request(url, request), context);
}
