import { withLambda } from "@netlify/aws-lambda-compat";
import "@netlify/blobs";
import sharedPageModule from "./lib/ask-page-handler.js";

const pageHandler = withLambda(sharedPageModule.handler);

export const config = {
  path: "/ask/shared/:id",
};

export default function handleSharedPage(request, context) {
  const id = context?.params?.id;
  if (!id) return pageHandler(request, context);
  const url = new URL(request.url);
  url.searchParams.set("id", id);
  return pageHandler(new Request(url, request), context);
}
