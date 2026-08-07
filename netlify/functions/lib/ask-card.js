"use strict";

const fs = require("fs");
const path = require("path");
const opentype = require("@shuding/opentype.js");
const { cardData, clampText, plainAnswer } = require("./ask-share.js");

const WIDTH = 1200;
const HEIGHT = 630;
const GREEN = "#0d4b34";
const IVORY = "#fbf8f2";

let assetsCache = null;
let runtimeOverride = null;

function configureCardRuntime(runtime) {
  if (!runtime) {
    runtimeOverride = null;
    return;
  }
  if (typeof runtime.satori !== "function" || typeof runtime.Resvg !== "function") {
    throw new TypeError("Ask PB card runtime requires satori and Resvg.");
  }
  runtimeOverride = runtime;
}

function cardRuntime() {
  if (runtimeOverride) return runtimeOverride;
  const satoriModule = require("satori");
  const { Resvg } = require("@resvg/resvg-js");
  return { satori: satoriModule.default || satoriModule, Resvg };
}

function element(type, props = {}, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.flat().filter(child => child !== undefined && child !== null),
    },
  };
}

function firstExisting(candidates) {
  const match = candidates.find(candidate => candidate && fs.existsSync(candidate));
  if (!match) throw new Error("Ask PB card asset is unavailable.");
  return match;
}

function cardAssets() {
  if (assetsCache) return assetsCache;
  const logoPath = firstExisting([
    path.join(process.cwd(), "public", "logo.png"),
    path.join(__dirname, "..", "..", "..", "public", "logo.png"),
    path.join(__dirname, "logo.png"),
  ]);
  const newsreaderPath = require.resolve("@fontsource/newsreader/files/newsreader-latin-400-normal.woff");
  const interRegularPath = require.resolve("@fontsource/inter/files/inter-latin-400-normal.woff");
  const interSemiboldPath = require.resolve("@fontsource/inter/files/inter-latin-600-normal.woff");
  const logo = fs.readFileSync(logoPath).toString("base64");
  const newsreader = fs.readFileSync(newsreaderPath);
  const interRegular = fs.readFileSync(interRegularPath);
  const interSemibold = fs.readFileSync(interSemiboldPath);
  const newsreaderArrayBuffer = newsreader.buffer.slice(
    newsreader.byteOffset,
    newsreader.byteOffset + newsreader.byteLength,
  );
  const interArrayBuffer = interRegular.buffer.slice(
    interRegular.byteOffset,
    interRegular.byteOffset + interRegular.byteLength,
  );
  assetsCache = {
    logo: `data:image/png;base64,${logo}`,
    titleFont: opentype.parse(newsreaderArrayBuffer),
    bodyFont: opentype.parse(interArrayBuffer),
    fonts: [
      { name: "Newsreader", data: newsreader, weight: 400, style: "normal" },
      { name: "Inter", data: interRegular, weight: 400, style: "normal" },
      { name: "Inter", data: interSemibold, weight: 600, style: "normal" },
    ],
  };
  return assetsCache;
}

function clampedTitle(value, max = 120) {
  const text = String(value || "Ask PB").replace(/\s+/g, " ").trim();
  const characters = graphemes(text);
  if (characters.length <= max) return text;
  return `${characters.slice(0, max).join("").replace(/\s+\S*$/, "").trim()}…`;
}

function clampedTeaser(value, max = 118) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const clamped = clampText(text.replace(/…$/, ""), max);
  return `${clamped.text.replace(/[.!?…]+$/g, "")}…`;
}

function cardExcerpt(answer, maxLength) {
  const plain = plainAnswer(answer);
  if (!plain) return "Explore an answer grounded in the Presidio Bitcoin archive.";
  const normalized = `${plain.charAt(0).toLocaleUpperCase()}${plain.slice(1)}`;
  return clampedTeaser(normalized, maxLength);
}

function graphemes(value) {
  const text = String(value || "");
  if (typeof Intl?.Segmenter === "function") {
    return [...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(text)]
      .map(segment => segment.segment);
  }
  return Array.from(text);
}

function measuredWidth(font, value, fontSize) {
  return font.getAdvanceWidth(String(value || ""), fontSize, { kerning: true });
}

function splitWideToken(token, font, fontSize, maxWidth) {
  const chunks = [];
  let current = "";
  for (const character of graphemes(token)) {
    const candidate = `${current}${character}`;
    if (!current || measuredWidth(font, candidate, fontSize) <= maxWidth) {
      current = candidate;
      continue;
    }
    chunks.push(current);
    current = character;
  }
  if (current) chunks.push(current);
  return chunks;
}

function ellipsizedLine(line, font, fontSize, maxWidth) {
  const characters = graphemes(String(line || "").replace(/…+$/g, "").trimEnd());
  while (characters.length && measuredWidth(font, `${characters.join("")}…`, fontSize) > maxWidth) {
    characters.pop();
  }
  return `${characters.join("").trimEnd()}…`;
}

function wrapMeasuredTitle(value, font, fontSize, maxWidth, maxLines) {
  const text = String(value || "Ask PB").replace(/\s+/g, " ").trim();
  const lines = [];
  let current = "";

  for (const word of text.split(" ")) {
    const candidate = current ? `${current} ${word}` : word;
    if (measuredWidth(font, candidate, fontSize) <= maxWidth) {
      current = candidate;
      continue;
    }
    if (current) {
      lines.push(current);
      current = "";
    }
    const chunks = splitWideToken(word, font, fontSize, maxWidth);
    while (chunks.length > 1) lines.push(chunks.shift());
    current = chunks[0] || "";
  }
  if (current) lines.push(current);

  const truncated = lines.length > maxLines;
  const visible = lines.slice(0, maxLines);
  if (truncated) {
    visible[visible.length - 1] = ellipsizedLine(
      visible[visible.length - 1],
      font,
      fontSize,
      maxWidth,
    );
  }
  return { lines: visible, lineCount: visible.length, text: visible.join("\n"), truncated };
}

function titleTypography(title, titleFont = cardAssets().titleFont) {
  const bounded = clampedTitle(title, 400);
  const tiers = [
    { fontSize: 70, lineHeight: 1.02, maxLines: 1 },
    { fontSize: 58, lineHeight: 1.04, maxLines: 2 },
    { fontSize: 46, lineHeight: 1.07, maxLines: 3 },
  ];
  for (const tier of tiers) {
    const wrapped = wrapMeasuredTitle(bounded, titleFont, tier.fontSize, 1072, tier.maxLines);
    if (!wrapped.truncated || tier === tiers[tiers.length - 1]) return { ...tier, ...wrapped };
  }
  return { ...tiers[2], ...wrapMeasuredTitle(bounded, titleFont, 46, 1072, 3) };
}

function cardViewModel(snapshot, options = {}) {
  const data = cardData(snapshot);
  const assets = options.titleFont && options.bodyFont ? options : cardAssets();
  const typography = titleTypography(data.title, assets.titleFont);
  const teaserLimit = typography.lineCount <= 1 ? 285 : typography.lineCount === 2 ? 205 : 125;
  const teaserMaxLines = typography.lineCount <= 1 ? 4 : typography.lineCount === 2 ? 3 : 2;
  const teaserSource = cardExcerpt(snapshot?.answer, teaserLimit);
  const teaserTypography = wrapMeasuredTitle(teaserSource, assets.bodyFont, 30, 1050, teaserMaxLines);
  return {
    title: typography.text,
    teaser: teaserTypography.text,
    provenance: data.provenance,
    teaserTypography,
    typography,
  };
}

function cardElement(snapshot, assets = cardAssets()) {
  const card = cardViewModel(snapshot, {
    bodyFont: assets.bodyFont,
    titleFont: assets.titleFont,
  });
  const titleStyle = card.typography;

  return element("div", {
    style: {
      width: "100%",
      height: "100%",
      display: "flex",
      position: "relative",
      backgroundColor: IVORY,
      color: GREEN,
    },
  },
  element("div", {
    style: {
      position: "absolute",
      top: 44,
      left: 64,
      display: "flex",
      alignItems: "center",
      height: 64,
    },
  },
  element("img", {
    src: assets.logo,
    width: 64,
    height: 64,
    style: {
      objectFit: "contain",
      filter: "brightness(0) saturate(100%) invert(23%) sepia(22%) saturate(1422%) hue-rotate(106deg) brightness(90%) contrast(94%)",
    },
  }),
  element("div", {
    style: {
      display: "flex",
      marginLeft: 22,
      fontFamily: "Inter",
      fontWeight: 600,
      fontSize: 26,
      letterSpacing: "0.14em",
      lineHeight: 1,
    },
  }, "PB MEDIA ARCHIVE")),
  element("div", {
    style: {
      position: "absolute",
      top: 164,
      left: 64,
      display: "flex",
      flexDirection: "column",
      width: 1072,
    },
  },
  element("div", {
    style: {
      display: "flex",
      flexShrink: 0,
      whiteSpace: "pre-wrap",
      fontFamily: "Newsreader",
      fontWeight: 400,
      fontSize: titleStyle.fontSize,
      lineHeight: titleStyle.lineHeight,
      letterSpacing: "-0.025em",
    },
  }, card.title),
  element("div", {
    style: {
      display: "flex",
      flexShrink: 0,
      marginTop: 17,
      fontFamily: "Inter",
      fontWeight: 400,
      fontSize: 22,
      letterSpacing: "-0.01em",
      lineHeight: 1.2,
      color: "#285f49",
    },
  }, card.provenance),
  element("div", {
    style: {
      display: "flex",
      flexShrink: 0,
      marginTop: 38,
      width: 1050,
      whiteSpace: "pre-wrap",
      fontFamily: "Inter",
      fontWeight: 400,
      fontSize: 30,
      lineHeight: 1.34,
      letterSpacing: "-0.018em",
    },
  }, card.teaser)));
}

async function renderCardPng(snapshot, options = {}) {
  const assets = options.assets || cardAssets();
  const runtime = options.runtime || cardRuntime();
  const svg = await runtime.satori(cardElement(snapshot, assets), {
    width: WIDTH,
    height: HEIGHT,
    fonts: assets.fonts,
  });
  const renderer = new runtime.Resvg(svg, {
    fitTo: { mode: "width", value: WIDTH },
    background: IVORY,
  });
  return Buffer.from(renderer.render().asPng());
}

module.exports = {
  HEIGHT,
  WIDTH,
  cardElement,
  cardExcerpt,
  cardViewModel,
  clampedTeaser,
  clampedTitle,
  configureCardRuntime,
  ellipsizedLine,
  renderCardPng,
  splitWideToken,
  titleTypography,
  wrapMeasuredTitle,
};
