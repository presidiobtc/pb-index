const fs = require("fs");
const path = require("path");
const satoriModule = require("satori");
const { Resvg } = require("@resvg/resvg-js");
const { provenanceLabel } = require("./ask-share.js");

const satori = satoriModule.default || satoriModule;
const WIDTH = 1200;
const HEIGHT = 630;
const GREEN = "#0d4b34";
const IVORY = "#fbf8f2";

let assetsCache = null;

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

function clampedTitle(value, max = 150) {
  const text = String(value || "Ask PB").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max + 1).replace(/\s+\S*$/, "").trim()}…`;
}

function titleTypography(title) {
  const length = [...title].length;
  if (length <= 24) return { fontSize: 86, lineHeight: 0.94, maxWidth: 1040 };
  if (length <= 58) return { fontSize: 66, lineHeight: 0.98, maxWidth: 1060 };
  if (length <= 96) return { fontSize: 52, lineHeight: 1.02, maxWidth: 1070 };
  return { fontSize: 43, lineHeight: 1.04, maxWidth: 1080 };
}

function cardViewModel(snapshot) {
  const title = clampedTitle(snapshot?.card?.title || snapshot?.query || "Ask PB");
  const recordingCount = Number(snapshot?.card?.recording_count) || 0;
  return {
    title,
    teaser: String(snapshot?.card?.teaser || "Explore an answer grounded in the Presidio Bitcoin archive.").trim(),
    provenance: String(snapshot?.card?.provenance || provenanceLabel(recordingCount)),
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
      flexDirection: "column",
      backgroundColor: IVORY,
      color: GREEN,
      padding: "44px 58px 42px",
    },
  },
  element("div", {
    style: { display: "flex", alignItems: "center", height: 62 },
  },
  element("img", {
    src: assets.logo,
    width: 62,
    height: 62,
    style: { objectFit: "contain" },
  }),
  element("div", {
    style: {
      display: "flex",
      marginLeft: 22,
      fontFamily: "Inter",
      fontWeight: 600,
      fontSize: 25,
      letterSpacing: "0.22em",
      lineHeight: 1,
    },
  }, "PB MEDIA ARCHIVE")),
  element("div", {
    style: {
      display: "flex",
      flex: 1,
      flexDirection: "column",
      paddingTop: 44,
      overflow: "hidden",
    },
  },
  element("div", {
    style: {
      display: "flex",
      fontFamily: "Inter",
      fontWeight: 600,
      fontSize: 23,
      letterSpacing: "0.28em",
      lineHeight: 1,
      marginBottom: 22,
    },
  }, "ASK PB"),
  element("div", {
    style: {
      display: "flex",
      maxWidth: titleStyle.maxWidth,
      maxHeight: 174,
      overflow: "hidden",
      fontFamily: "Newsreader",
      fontWeight: 400,
      fontSize: titleStyle.fontSize,
      lineHeight: titleStyle.lineHeight,
      letterSpacing: "-0.035em",
    },
  }, card.title),
  element("div", {
    style: {
      display: "flex",
      fontFamily: "Inter",
      fontWeight: 400,
      fontSize: 21,
      letterSpacing: "-0.01em",
      lineHeight: 1.2,
      marginTop: 9,
    },
  }, card.provenance),
  element("div", {
    style: {
      display: "flex",
      width: 254,
      height: 1,
      backgroundColor: GREEN,
      marginTop: 20,
      marginBottom: 22,
    },
  }),
  element("div", {
    style: {
      display: "flex",
      maxWidth: 930,
      maxHeight: 84,
      overflow: "hidden",
      fontFamily: "Newsreader",
      fontWeight: 400,
      fontSize: 31,
      lineHeight: 1.18,
      letterSpacing: "-0.012em",
    },
  }, card.teaser)),
  element("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      height: 28,
      fontFamily: "Inter",
      fontWeight: 400,
      fontSize: 21,
      letterSpacing: "0.02em",
    },
  }, "pbarchive.ai"));
}

async function renderCardPng(snapshot, options = {}) {
  const assets = options.assets || cardAssets();
  const svg = await satori(cardElement(snapshot, assets), {
    width: WIDTH,
    height: HEIGHT,
    fonts: assets.fonts,
  });
  const renderer = new Resvg(svg, {
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
  clampedTitle,
  renderCardPng,
  titleTypography,
};
