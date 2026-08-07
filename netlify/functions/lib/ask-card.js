"use strict";

const fs = require("fs");
const path = require("path");
const { cardData, clampText } = require("./ask-share.js");

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
  assetsCache = {
    logo: `data:image/png;base64,${logo}`,
    fonts: [
      { name: "Newsreader", data: fs.readFileSync(newsreaderPath), weight: 400, style: "normal" },
      { name: "Inter", data: fs.readFileSync(interRegularPath), weight: 400, style: "normal" },
      { name: "Inter", data: fs.readFileSync(interSemiboldPath), weight: 600, style: "normal" },
    ],
  };
  return assetsCache;
}

function clampedTitle(value, max = 120) {
  const text = String(value || "Ask PB").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "").trim()}…`;
}

function clampedTeaser(value, max = 118) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const clamped = clampText(text.replace(/…$/, ""), max);
  return `${clamped.text.replace(/[.!?…]+$/g, "")}…`;
}

function titleTypography(title) {
  const length = [...title].length;
  if (length <= 18) return { askTop: 197, titleTop: 244, fontSize: 126, lineHeight: 0.92, maxHeight: 124 };
  if (length <= 36) return { askTop: 178, titleTop: 220, fontSize: 84, lineHeight: 0.95, maxHeight: 160 };
  if (length <= 68) return { askTop: 166, titleTop: 207, fontSize: 62, lineHeight: 0.98, maxHeight: 168 };
  if (length <= 100) return { askTop: 156, titleTop: 197, fontSize: 50, lineHeight: 1, maxHeight: 180 };
  return { askTop: 148, titleTop: 188, fontSize: 45, lineHeight: 1.02, maxHeight: 190 };
}

function cardViewModel(snapshot) {
  const data = cardData(snapshot);
  const title = clampedTitle(data.title);
  return {
    title,
    teaser: clampedTeaser(data.teaser),
    provenance: data.provenance,
    typography: titleTypography(title),
  };
}

function cardElement(snapshot, assets = cardAssets()) {
  const card = cardViewModel(snapshot);
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
      top: 46,
      left: 56,
      display: "flex",
      alignItems: "center",
      height: 80,
    },
  },
  element("img", {
    src: assets.logo,
    width: 80,
    height: 80,
    style: { objectFit: "contain" },
  }),
  element("div", {
    style: {
      display: "flex",
      marginLeft: 25,
      fontFamily: "Inter",
      fontWeight: 400,
      fontSize: 29,
      letterSpacing: "0.22em",
      lineHeight: 1,
    },
  }, "PB MEDIA ARCHIVE")),
  element("div", {
    style: {
      position: "absolute",
      top: titleStyle.askTop,
      left: 56,
      display: "flex",
      fontFamily: "Inter",
      fontWeight: 600,
      fontSize: 25,
      letterSpacing: "0.28em",
      lineHeight: 1,
    },
  }, "ASK PB"),
  element("div", {
    style: {
      position: "absolute",
      top: titleStyle.titleTop,
      left: 56,
      display: "flex",
      width: 1088,
      maxHeight: titleStyle.maxHeight,
      overflow: "hidden",
      overflowWrap: "anywhere",
      fontFamily: "Newsreader",
      fontWeight: 400,
      fontSize: titleStyle.fontSize,
      lineHeight: titleStyle.lineHeight,
      letterSpacing: "-0.035em",
    },
  }, card.title),
  element("div", {
    style: {
      position: "absolute",
      top: 392,
      left: 58,
      display: "flex",
      fontFamily: "Inter",
      fontWeight: 400,
      fontSize: 22,
      letterSpacing: "-0.01em",
      lineHeight: 1.2,
    },
  }, card.provenance),
  element("div", {
    style: {
      position: "absolute",
      top: 434,
      left: 58,
      display: "flex",
      width: 254,
      height: 1,
      backgroundColor: GREEN,
    },
  }),
  element("div", {
    style: {
      position: "absolute",
      top: 466,
      left: 58,
      display: "flex",
      width: 940,
      maxHeight: 84,
      overflow: "hidden",
      fontFamily: "Newsreader",
      fontWeight: 400,
      fontSize: 32,
      lineHeight: 1.18,
      letterSpacing: "-0.012em",
    },
  }, card.teaser),
  element("div", {
    style: {
      position: "absolute",
      right: 58,
      bottom: 40,
      display: "flex",
      fontFamily: "Inter",
      fontWeight: 400,
      fontSize: 21,
      letterSpacing: "0.02em",
    },
  }, "pbarchive.ai"));
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
  cardViewModel,
  clampedTeaser,
  clampedTitle,
  configureCardRuntime,
  renderCardPng,
  titleTypography,
};
