// public/topics_config.js
// MVP rule: 1 high-signal link per topic (manual picks). Auto fallback exists if you omit picks.

const QUANTUM_REPORT_BASE = "https://presidiobtc.github.io/bitcoin-quantum/";
function quantumReportPick(anchor, section, label) {
  return {
    url: `${QUANTUM_REPORT_BASE}${anchor}`,
    reportSeries: "QUANTUM_REPORT",
    section,
    date: "Apr 2026",
    label,
  };
}

const TOPIC_DEFS = [
  {
    name: "Agent group chats",
    keywords: ["group chat", "groupchats", "telegram", "signal", "dm"],
    picks: [{ youtube_id: "VdJj0sjKDiY", t: 785, label: "Ori as a Telegram bot that can roast you, build apps, make memes, and handle payments, all from your existing group chat" }], // 13:05
  },
  {
    name: "AI singularity",
    keywords: ["singularity", "compute curve", "kurzweil", "moravec", "event horizon", "intelligence curve"],
    picks: [
      { youtube_id: "0iBG0F98ZN8", t: 2740, label: "The argument that we've already crossed the event horizon. Compute, energy, and intelligence curves going back to Moravec in the 70s and Kurzweil in the 90s suggest singularity isn't just near, it's here." }, // 45:40
    ],
  },
  {
    name: "AI provenance",
    keywords: ["ai provenance", "data provenance", "open weights", "open data", "opentimestamps", "nostr key", "training inputs"],
    picks: [{ youtube_id: "-NIPr7zX3ss", t: 3972, label: "Jack Dorsey's claim that data provenance, protocols, evals, and weights now matter more than open source code becomes a framework for AI transparency. The hosts focus on proving training inputs, who submitted them, and when a model was created, with Nostr keys and OpenTimestamps floated as a bitcoin-native provenance layer." }], // 1:06:12
  },
  {
    name: "Anthropic",
    keywords: ["mythos", "anthropic mythos", "claude nerfed", "model dependency", "frontier model"],
    picks: [{ youtube_id: "7He8tdQ6gnk", t: 2888, label: "Anthropic's rumored Mythos model and the apparent nerfing of public Claude frame a strategic risk for companies building around one frontier provider. If the best model is reserved for governments, banks, or premium tiers, model dependency can become an existential switching-cost problem." }], // 48:08
  },
  {
    name: "Bitcoin as AI collateral",
    keywords: ["thermodynamic", "bitcoin collateral", "ai collateral", "bitcoin thermodynamic", "john ko"],
    picks: [{ youtube_id: "mSNQApWdtNo", t: 380, label: "The thesis from a Type One Summit speaker that bitcoin functions as a thermodynamic system uniquely suited for AI agents to use as collateral. Bitcoin's permissionless nature makes it the default monetary infrastructure for autonomous AI, which traditional financial systems would never allow access to." }], // 6:20
  },
  {
    name: "Bitcoin as everyday money",
    keywords: ["bitcoin currency", "everyday money", "spend bitcoin", "spending bitcoin", "bitcoin payments", "whitepaper", "medium of exchange"],
    picks: [{ youtube_id: "0iBG0F98ZN8", t: 4310, label: "The original bitcoin-as-everyday-money use case from the whitepaper is being revived. Eight years of digital gold narrative dominance may be ending as technical and UX barriers to spending are solved by AI payments and merchant adoption." }], // 1:11:50
  },
  {
    name: "Bitcoin ₿ symbol",
    keywords: ["bitcoin symbol", "bitcoin b", "sats ui", "sat ui", "integer amount"],
    picks: [{ youtube_id: "0iBG0F98ZN8", t: 613, label: "Cash App, BitKey, and other major bitcoin products switched UI from showing sats to the ₿ symbol. A concrete step toward making bitcoin legible to non-technical merchants and consumers." }], // 10:13
  },
  {
    name: "Bitcoin-backed loans",
    keywords: ["bitcoin loan", "collateralized loan", "bitcoin collateral loan", "bitcoin lending", "ai investing"],
    picks: [
      { youtube_id: "mSNQApWdtNo", t: 4800, label: "The case for a collateralized bitcoin lending product that lets holders gain exposure to major AI companies (Google, Anthropic, xAI) without selling their BTC. Deposit bitcoin as collateral, invest in AI equity upside, stay long bitcoin. Described as a product that will 'absolutely print' once regulatory clarity arrives." }, // 1:20:00
      { youtube_id: "-NIPr7zX3ss", t: 430, label: "Coinbase's mortgage product is framed as a new form of bitcoin-backed lending: roughly 40% LTV, no margin calls if BTC drops, and a practical down-payment path for holders who do not want to sell. The deeper signal is traditional mortgage infrastructure, including Fannie Mae-style conforming loans, beginning to treat bitcoin as credible collateral." }, // 7:10
    ],
  },
  {
    name: "Bitcoin quantum break glass scenario",
    keywords: ["break glass", "quantum break glass", "inflation bug", "last valid block", "emergency signature"],
    picks: [{ youtube_id: "7He8tdQ6gnk", t: 4670, label: "The worst-case quantum scenario is framed as ugly but survivable: most exposed value could move quickly if there is warning, while an extreme real-time break would force debate over freezing, reorgs, or emergency signature upgrades. The 2018 inflation bug is used as precedent that Core, pools, and exchanges can coordinate rapidly when they must." }], // 1:17:50
  },
  {
    name: "Bitcoin merchant adoption",
    keywords: ["merchant", "merchant adoption", "accountant", "tax", "fiat conversion", "bitcoin payments"],
    picks: [
      { youtube_id: "0iBG0F98ZN8", t: 120, label: "Merchants are turning on bitcoin payments, then being told to turn them off by their accountants due to tax confusion. A tax specialist published guidance clarifying that immediately converting to fiat has no tax consequences, removing a key barrier." }, // 2:00
      { youtube_id: "FC0y7J9pGCs", t: 2191, label: "Square's default bitcoin payments rollout is a material step, but the hosts map the remaining adoption friction: hardware and software rollout gaps, sellers who do not know the feature exists, unified QR expectations, tipping flows, and the need to message Cash App payments as a fee-saving merchant benefit." }, // 36:31
    ],
  },
  {
    name: "Presidio Bitcoin's Quantum Readiness Report",
    keywords: ["quantum readiness", "quantum report", "quantum risk", "postquantum", "bitcoin quantum"],
    picks: [{ youtube_id: "7He8tdQ6gnk", t: 4000, label: "Presidio Bitcoin's quantum readiness report is presented as a neutral, investor-friendly public good rather than a one-off PDF. It is designed as a living GitHub project that maps the threat, current work, and response paths across short, medium, long, and never-happens timelines." }], // 1:06:40
  },
  {
    name: "Bitcoin treasury companies",
    keywords: ["microstrategy", "metaplanet", "bitcoin treasury", "bitcoin company", "corporate bitcoin"],
    picks: [{ youtube_id: "gNoES_ygukM", t: 4490, label: "MicroStrategy and Metaplanet aren't competitors. Different leverage strategies and different markets (US vs Japan) create space for multiple winners rather than winner-take-all dynamics. All bitcoin accumulation by public companies serves the shared goal regardless of strategy differences." }], // 1:14:50
  },
  {
    name: "Bitcoin vs. gold",
    keywords: ["gold", "digital gold", "store of value", "central bank", "bitcoin narrative", "crypto dying"],
    picks: [{ youtube_id: "0iBG0F98ZN8", t: 4158, label: "Bitcoin's underperformance attributed to crypto contagion and the 'digital gold' narrative losing to actual gold (which ran from $3k to $5.4k on central bank buying). Central banks lack the operational infrastructure for bitcoin that they have for gold, so the comparison isn't apples-to-apples." }], // 1:09:18
  },
  {
    name: "Block",
    keywords: ["block", "builder bot", "mini agi", "hierarchy to intelligence", "player coach", "super builder", "block layoffs", "ai restructuring"],
    picks: [
      { youtube_id: "FC0y7J9pGCs", t: 5015, label: "Jack Dorsey and Roelof Botha's 'hierarchy to intelligence' frame points to Block reorganizing around agents rather than managers as information routers. Builder Bot is the concrete example: a Slack-integrated company world model that can answer questions, surface SQL, point to internal experts, and reduce meeting friction." }, // 1:23:35
      { youtube_id: "NejxiHIBy_w", t: 4829, label: "Block's 40% layoff is framed as AI-driven restructuring rather than financial distress, with Spiral spared and Cash App still growing gross profit. The discussion combines the human cost with the broader adaptation thesis: companies will get leaner, and displaced workers may need entrepreneurial paths such as vibe-coding workshops and MDK-style ways to build and earn online." }, // 1:20:29
    ],
  },
  {
    name: "Buck Token",
    keywords: ["bucktoken", "buck token", "buck stablecoin", "bitcoin stablecoin", "yield stablecoin"],
    picks: [{ youtube_id: "KNn06gkO_3U", t: 4840, label: "Travis Vander Zanden's BUCK token is a stablecoin built on top of MicroStrategy's Stretch instrument. Stretch over-collateralizes bitcoin to yield ~11%, and Buck passes 7% to users while keeping a ~4% spread. Unavailable to US users due to stablecoin yield-sharing regulations. The hosts see it as the first live manifestation of Saylor's capital-to-credit-to-money stack." }], // 1:20:40
  },
  {
    name: "Cash App",
    keywords: ["cash app", "cashapp"],
    picks: [{ youtube_id: "VdJj0sjKDiY", t: 4790, label: "Cash App dollars on Lightning as the template for mass adoption without asking anyone to become a bitcoiner first" }], // 1:19:50
  },
  {
    name: "Flint",
    keywords: ["flint", "flint community", "vibe coder community", "kindling", "firewood", "blaze"],
    picks: [{ youtube_id: "gNoES_ygukM", t: 740, label: "Spiral launches Flint (flints.dev), a curated community for AI-assisted developers with three tiers: Kindling (early apps), Firewood (published apps), and Blaze (commercialized products). The goal is to be a tastemaker destination that surfaces quality work as vibe-coded apps proliferate and discovery becomes the hard problem." }], // 12:20
  },
  {
    name: "GPU marketplace",
    keywords: ["gpu marketplace", "gpu market", "apple silicon", "apple m chips", "fracking", "open agents", "christopher david", "spare compute"],
    picks: [
      { youtube_id: "mSNQApWdtNo", t: 1309, label: "Christopher David at Open Agents is building a bitcoin-powered GPU marketplace where owners of spare Apple Silicon can plug in and earn sats. Key called it 'fracking for Apple M chips.' The hosts see bitcoin as the natural economic coordination layer: when economics (not privacy) drives hybrid cloud/local AI infrastructure, open permissionless payments win by default." }, // 21:49
      { youtube_id: "FC0y7J9pGCs", t: 3598, label: "Open Agents, Owls, Sprout, and Block's Mesh-LLM all point toward open networks for training and serving AI with spare compute. The hosts frame bitcoin and sats as the natural payout layer, but emphasize that demand generation and verifiable execution are the next hard problems." }, // 59:58
    ],
  },
  {
    name: "Group chat vibecoding",
    keywords: ["vibecoding", "vibe coding", "gc is the new ide", "chat is the new ide"],
    picks: [{ youtube_id: "VdJj0sjKDiY", t: 954, label: "Ori 10x's both casual AI use and solo vibe coding. Software emerges from the conversation you're already having, not from going to an IDE with a spec. Super Bowl betting pool as an example." }], // 15:54
  },
  {
    name: "Google Quantum",
    keywords: ["google quantum", "google quantum ai", "google paper", "quantum computing ai", "accelerating ai", "quantum timeline"],
    picks: [
      { youtube_id: "7He8tdQ6gnk", t: 4962, label: "Google's paper linking quantum computing to AI acceleration caught the hosts off guard because they had not seen AI treated as a known quantum application. If quantum unlocks new AI capabilities, the resulting investment could increase the probability of viable quantum computers and compress the timeline." }, // 1:22:42
      { youtube_id: "FC0y7J9pGCs", t: 183, label: "Google's quantum paper claims a 20x improvement in the algorithmic path to breaking elliptic-curve cryptography, with a zero-knowledge proof that the details exist without revealing them. Steve frames it as 'n minus one': material progress, but not proof that bitcoin breakage is imminent." }, // 3:03
    ],
  },
  {
    name: "Iran",
    keywords: ["iran", "hormuz", "strait of hormuz", "bitcoin toll", "sanctions", "petrodollar"],
    picks: [{ youtube_id: "7He8tdQ6gnk", t: 703, label: "Reports that Iran was charging ships a Strait of Hormuz toll in bitcoin are treated as a major geopolitical use case, even with the facts still uncertain. The segment highlights bitcoin's liquidity, sanctions resistance, and the unusual pattern of a dollar-denominated fee settled in bitcoin." }], // 11:43
  },
  {
    name: "Jack Dorsey",
    keywords: ["jack dorsey", "jack", "dorsey", "jack ama", "presidio ama"],
    picks: [{ youtube_id: "KNn06gkO_3U", t: 1540, label: "Jack Dorsey visited Presidio Bitcoin for an off-the-record AMA with about 20 members. The most candid he'd been publicly, with frank answers to questions that wouldn't get asked on a Block investor day." }], // 25:40
  },
  {
    name: "Lexe",
    keywords: ["lexe", "lexi", "ldk", "intel sgx", "trusted execution environment", "tee", "async payments"],
    picks: [{ youtube_id: "-NIPr7zX3ss", t: 2240, label: "Lexe's launch is treated as a serious Lightning UX breakthrough: each user gets an LDK node in the cloud inside Intel SGX, while the wallet provider does not hold the private keys. The trade-off aims to preserve self-custody while solving offline receiving, persistent connectivity, and multi-device wallet access." }], // 37:20
  },
  {
    name: "Lightning Network",
    keywords: ["lightning", "invoice", "sats", "sat", "ln"],
    picks: [
      { youtube_id: "VdJj0sjKDiY", t: 5150, label: "Voltage facilitated a $1M payment between Secure Digital Markets (SDM) and Kraken over Lightning in under a second. Direct channel with no routing, but a clear signal that the network has matured." }, // 1:25:50
      { youtube_id: "NejxiHIBy_w", t: 2580, label: "Lightning usage is measured through imperfect but improving volume estimates: River reports roughly $1 billion per month and more than 5 million payments, despite the network's private routing design. The key signal is that settlement volume appears to be compounding while most attention is elsewhere." }, // 43:00
    ],
  },
  {
    name: "MemePay",
    keywords: ["meme pay", "memepay", "meme marketplace", "meme bitcoin", "meme zap"],
    picks: [{ youtube_id: "mSNQApWdtNo", t: 1740, label: "A Nostr-native meme marketplace where creators earn bitcoin through zaps. The vision includes revenue waterfalls where sharers earn a cut when their shared content gets zapped downstream, creating viral economic incentives." }], // 29:00
  },
  {
    name: "Mesh-LLM",
    keywords: ["mesh-llm", "mesh llm", "peer-to-peer gpu", "p2p gpu", "distributed inference", "mcneal"],
    picks: [{ youtube_id: "FC0y7J9pGCs", t: 3795, label: "Mesh-LLM is described as Block's early peer-to-peer GPU network: useful as a community compute layer today, but not yet a marketplace. The roadmap questions are payments and proofs: how nodes get paid, and how users know the expected model actually ran." }], // 1:03:15
  },
  {
    name: "MoltBook",
    keywords: ["moltbook", "molt book", "bot social", "bot network", "bot posts"],
    picks: [{ youtube_id: "0iBG0F98ZN8", t: 1669, label: "A Reddit-like social network that emerged for AI bots to interact with each other, requiring Twitter verification that you're a bot. Part performance art, but an early real-world indicator of AI agents building their own communities and communication layer." }], // 27:49
  },
  {
    name: "MoltBot",
    keywords: ["moltbot", "molt bot", "clawdbot", "claudebot"],
    picks: [{ youtube_id: "0iBG0F98ZN8", t: 1237, label: "Origin story of what became OpenClaw. Started as ClawdBot (a riff on Claude), went viral, rebranded to MoltBot, then OpenClaw, all within a week. The two rebrands didn't kill momentum because the core product-market fit (AI agent via Telegram on your local machine) was undeniable." }], // 20:37
  },
  {
    name: "Michael Saylor",
    keywords: ["saylor", "michael saylor", "microstrategy ceo", "durant", "rothbard", "bitcoin cycles", "bitcoin collateral thesis"],
    picks: [{ youtube_id: "gNoES_ygukM", t: 3780, label: "Saylor's intellectual framework: Will Durant's 11-volume world history and Rothbard's economic histories as foundation. Every civilization has had its '1971 moment.' Currency debasement is the oldest trick, not something new. History rhymes in a spiral, not a circle. Bitcoin as the pristine collateral that breaks the cycle. Max recommends his What Bitcoin Did appearance for the depth of his reading list alone." }], // 1:03:00
  },
  {
    name: "Moneydevkit (MDK)",
    keywords: ["money dev kit", "mdk", "moneydevkit"],
    picks: [
      { youtube_id: "VdJj0sjKDiY", t: 1230, label: "Ori is built by the MDK team. Bitcoin payments are a core competency but deliberately not front-and-center in the pitch, and why frictionless payments transform group chat experiences like prediction markets and trivia." }, // 20:30
      { youtube_id: "KNn06gkO_3U", t: 3420, label: "Replit's CEO Amjad and then Paul Graham both publicly endorsed MDK after Nick framed it as 'permissionless global payments' rather than 'bitcoin payments.' The hosts see this as the template for getting bitcoin mainstream: position as enabling infrastructure, not as a technology choice." }, // 57:00
    ],
  },
  {
    name: "Nostr for AI agents",
    keywords: ["nostr", "ndk", "zap", "zapping", "npub", "nostr agent", "bot zap"],
    picks: [
      { youtube_id: "0iBG0F98ZN8", t: 2028, label: "The case for Nostr as natural infrastructure for autonomous AI agents. Public/private key pairs as identity require no centralized accounts, JB55 already has a bot live on Nostr, and bots are already zapping bitcoin to each other autonomously." }, // 33:48
      { youtube_id: "gNoES_ygukM", t: 1640, label: "In a world of infinite vibe-coded apps, identity and social graph infrastructure becomes the critical differentiator. Nostr offers an open alternative to Google/Apple login, and open leaderboards, friend networks, and Zap-based discovery signals create network effects without requiring custom backend infrastructure per app." }, // 27:20
    ],
  },
  {
    name: "OpenClaw",
    keywords: ["openclaw", "open claw"],
    picks: [
      { youtube_id: "VdJj0sjKDiY", t: 138, label: "Recap of the first OpenClaw meetup at Presidio Bitcoin. 10-12 members got it running and why it matters." }, // 2:18
      { youtube_id: "0iBG0F98ZN8", t: 1237, label: "Origin story: went viral as ClawdBot, rebranded twice in a week to MoltBot then OpenClaw. Full OS-level computer control via Telegram, fastest to 100k GitHub stars." }, // 20:37
    ],
  },
  {
    name: "Ori",
    keywords: ["ori", "ori bot"],
    picks: [{ youtube_id: "VdJj0sjKDiY", t: 785, label: "Ori as a productized OpenClaw under the hood. Add it to your Telegram group and it integrates natively, with the transition from OpenClaw as a raw tool to Ori as something ready for everyday group use." }], // 13:05
  },
  {
    name: "OpenAI",
    keywords: ["openai", "tbpn", "tech podcast", "media channel", "mouthpiece"],
    picks: [{ youtube_id: "FC0y7J9pGCs", t: 3161, label: "OpenAI's acquisition of TBPN is treated as a media and distribution move, not just a content deal. The strategic logic is that OpenAI needs its own high-value tech audience channel while Anthropic dominates daily mindshare and competitors buy visibility through ads." }], // 52:41
  },
  {
    name: "Payment privacy",
    keywords: ["payment privacy", "base privacy", "spark privacy", "tempo privacy", "shielded privacy", "venmo feed", "public balance"],
    picks: [{ youtube_id: "-NIPr7zX3ss", t: 3159, label: "Agentic payments expose a privacy gap in public-chain stablecoin rails: paying someone on Base can reveal a wallet balance and transaction history to the recipient or the internet. The hosts contrast that with normal user expectations, Lightning's better privacy properties, and Tempo's promised compliance-friendly shielded privacy." }], // 52:39
  },
  {
    name: "Prediction markets",
    keywords: ["prediction market", "polymarket", "kalshi", "futarchy", "arbitrage"],
    picks: [
      { youtube_id: "KNn06gkO_3U", t: 3650, label: "Prediction markets as information discovery infrastructure, not gambling. Stacker News demonstrates the principle: Bitcoin-paid upvotes create non-forgeable signal that bots can't fabricate. AI agents with wallets competing in markets produces emergent intelligence that beats central planning." }, // 1:00:50
      { youtube_id: "mSNQApWdtNo", t: 4420, label: "Enormous pricing gaps between Polymarket and Kalshi on the same outcomes create obvious arbitrage that should be closing but isn't. AI tools could exploit these gaps and build permissionless access for users excluded from US prediction markets." }, // 1:13:40
    ],
  },
  {
    name: "Quantum-Safe Bitcoin",
    keywords: ["quantum safe transaction", "quantum-safe transaction", "no consensus changes", "slipstream", "non-standard transaction", "quantum resistant"],
    picks: [{ youtube_id: "7He8tdQ6gnk", t: 5316, label: "A prototype quantum-safe bitcoin transaction can be done today without consensus changes, but the trade-offs are severe. It relies on brute-forcing hash values, may cost around $150 per key, and creates a non-standard transaction that likely needs a direct miner path such as Slipstream." }], // 1:28:36
  },
  {
    name: "Replit",
    keywords: ["replit", "rep lit", "replit bitcoin", "replit nostr", "shakespeare diy", "vibe coding platform"],
    picks: [{ youtube_id: "mSNQApWdtNo", t: 2100, label: "MDK did the hard polish work to make bitcoin payments first-class in Replit. Now someone needs to do the same for Nostr. Alex Gleason's Shakespeare is a Nostr-native alternative, but Replit has the user base, so the higher-leverage move is integrating Nostr as a first-class citizen there. The template: do the hard work once, and everyone can build on top of it." }], // 35:00
  },
  {
    name: "Security & privacy of agents",
    keywords: ["security", "privacy", "prompt injection", "malware", "leak", "keys", "wallet"],
    picks: [{ youtube_id: "VdJj0sjKDiY", t: 2920, label: "Prompt injection, malware as a top OpenClaw add-on, 'just assume everything on your local machine is already leaked.' Plus the notification overload problem and whether this all goes Black Mirror faster than we think." }], // 48:40
  },
  {
    name: "Self-sovereign names",
    keywords: ["self-sovereign names", "human-readable names", "human-speakable names", "agent names", "agent-based network resources", "dns", "cryptographic key"],
    picks: [{ youtube_id: "-NIPr7zX3ss", t: 4854, label: "The naming project is reframed from human self-sovereign names into agent-based network resources. In an agent-first internet, humans still need speakable, memorable names that map to cryptographic keys without depending on DNS gatekeepers like registrars, ICANN, or Cloudflare." }], // 1:20:54
  },
  {
    name: "SHRINCS and SHRIMPS",
    keywords: ["shrincs", "shrinks", "shrimps", "hash-based signature", "post-quantum signature", "blockstream quantum"],
    picks: [{ youtube_id: "FC0y7J9pGCs", t: 924, label: "Blockstream's SHRINCS and SHRIMPS are compared as complementary post-quantum signature schemes. SHRINCS gets close to practical size at roughly five times today's Schnorr signature but requires retained state, while SHRIMPS is larger and stateless, making it better suited to recovery paths." }], // 15:24
  },
  {
    name: "Stablecoins",
    keywords: ["usdc", "stablecoin", "stable coin"],
    picks: [{ youtube_id: "VdJj0sjKDiY", t: 4568, label: "Skepticism on YC telling startups to use USDC. The 'intranet on intranets' critique of stablecoin platforms vs. open bitcoin/Lightning rails." }], // 1:16:08
  },
  {
    name: "Stretch-backed stablecoins",
    keywords: ["stretch-backed stablecoin", "stretch backed stablecoin", "buck token", "yield stablecoin", "bitcoin-backed stablecoin", "regional exchange"],
    picks: [{ youtube_id: "-NIPr7zX3ss", t: 1928, label: "Stretch-backed stablecoins are pitched as a regional fintech opportunity: exchanges or licensed settlement companies outside the US could offer dollar savings products backed by bitcoin credit rather than waiting for American regulatory clarity. The main constraint is distribution and interoperability, since new stablecoin issuers still need wallets, Stripe-like bridges, and local payment networks to accept them." }], // 32:08
  },
  {
    name: "The Sovereign Individual",
    keywords: ["sovereign individual", "cognitive elite", "nation state", "great pirates", "ai centralizing", "crypto decentralizing"],
    picks: [{ youtube_id: "7He8tdQ6gnk", t: 1620, label: "The Sovereign Individual thesis is reframed for AI: cryptography and bitcoin shifted power toward individuals, while frontier AI may re-centralize power into a few model companies. The open question is whether open models at the edge can preserve the individual-sovereignty arc." }], // 27:00
  },
  {
    name: "Stretch (STRC) bonds",
    keywords: ["stretch", "stretch bond", "stretchr", "bitcoin bond", "bitcoin yield", "bitcoin credit"],
    picks: [{ youtube_id: "gNoES_ygukM", t: 4100, label: "MicroStrategy's Stretch instrument over-collateralizes bitcoin 6x to offer ~11% yields versus 3-4% from traditional bonds. The only belief required: Bitcoin won't drop 85-90% over the bond term. Max sees Stretch as the bridge between old-world capital mandates and bitcoin collateral, without requiring self-custody." }], // 1:08:20
  },
  {
    name: "Taproot",
    keywords: ["taproot quantum", "taproot", "tap script", "key spend", "BIP 360", "quantum signature"],
    picks: [{ youtube_id: "7He8tdQ6gnk", t: 5711, label: "Taproot's cheapest key-spend path exposes a public key, which is the core quantum concern. The discussion covers future soft-fork designs that could disable vulnerable key spends while preserving script paths, plus BIP 360 as a Taproot-like output type meant to support quantum signatures." }], // 1:35:11
  },
  {
    name: "Verifiable compute",
    keywords: ["verifiable compute", "verifiability", "proof of inference", "proof mechanism", "lightspark"],
    picks: [
      { youtube_id: "FC0y7J9pGCs", t: 3910, label: "Verifiable compute is identified as the missing piece that turns decentralized AI from a toy into infrastructure. A paid mesh network needs proof that a node actually ran the requested model or computation, not just a trust-me-bro GPU marketplace." }, // 1:05:10
      { youtube_id: "-NIPr7zX3ss", t: 4693, label: "Interpretability hooks and ZK proofs are framed as two paths toward making AI compute auditable and more fungible. If users can verify what a model did or prove that requested computation ran, marketplaces for distributed training and inference become much more viable." }, // 1:18:13
    ],
  },
];

function normalizedTopicName(name) {
  const normalized = name
    .toLowerCase()
    .replace(/[-–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const aliases = {
    "bolt12": "bolt 12",
    "bolt 12 zaps": "bolt 12 zaps",
    "dynamic block size": "dynamic block sizes",
    "small business bitcoin savings": "small business bitcoin savings",
    "miner centralization": "mining centralization",
    "bitcoin lending": "bitcoin backed loans",
    "ai data privacy": "ai privacy",
    "privacy first ai": "ai privacy",
  };
  return aliases[normalized] || normalized;
}

function pickIdentity(pick) {
  if (pick.url) return `url:${pick.url}`;
  return `${pick.youtube_id || ""}:${pick.t ?? ""}`;
}

function dedupePicks(picks) {
  const seen = new Set();
  const deduped = [];
  for (const pick of picks || []) {
    const key = pickIdentity(pick);
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(pick);
  }
  return deduped;
}

function addTopicDefs(topicDefs) {
  for (const topic of topicDefs) {
    const existing = TOPIC_DEFS.find((candidate) => normalizedTopicName(candidate.name) === normalizedTopicName(topic.name));
    if (existing) {
      existing.keywords = [...new Set([...(existing.keywords || []), ...(topic.keywords || [])])];
      existing.picks = dedupePicks([...(existing.picks || []), ...(topic.picks || [])]);
    } else {
      topic.picks = dedupePicks(topic.picks || []);
      TOPIC_DEFS.push(topic);
    }
  }
}

addTopicDefs([
  {
    name: "Bitcoin branding",
    keywords: ["bitcoin branding", "brand problem", "bitcoin brand", "merchant opposition", "bitcoin stigma"],
    picks: [{ youtube_id: "KZsEVToqXYk", t: 979, label: "Bitcoin's brand problem shows up at the merchant layer: some sellers react emotionally against the word bitcoin before they understand the payment mechanics. The implication is that product framing, merchant education, and language may matter as much as technical rollout for mainstream acceptance." }], // 16:19
  },
  {
    name: "Open-source AI",
    keywords: ["open source ai", "open-source ai", "open models", "model weights", "open weights", "open source models"],
    picks: [
      { youtube_id: "KZsEVToqXYk", t: 1818, label: "Open-source AI is treated as a category at risk of being captured by crypto-style grift if it lacks credible institutions and taste. The hosts want the bitcoin open-source playbook applied carefully, with funding focused on durable public goods rather than tokenized noise." }, // 30:18
      { youtube_id: "59D_r8qaDu4", t: 2758, label: "The open-source AI funding question is framed through blind spots: work that big labs and VC-backed startups are unlikely to do because it is too infrastructural, too non-commercial, or too far from immediate customer capture. Spiral is floated as a possible funder if the problem selection is disciplined." }, // 45:58
      { youtube_id: "NejxiHIBy_w", t: 1089, label: "Local open-source models are framed as a privacy and control layer that can sit between personal data and cloud frontier models. The opportunity is not just cheaper inference, but giving users their own agentic system that can decide what should stay local and what can safely leave the machine." }, // 18:09
    ],
  },
  {
    name: "Spiral",
    keywords: ["spiral ai", "spiral playbook", "spiral funding", "bitcoin playbook", "ai initiative"],
    picks: [{ youtube_id: "KZsEVToqXYk", t: 5256, label: "Spiral's bitcoin playbook is tested against AI: fund small teams, protocol work, SDKs, and public goods that are unlikely to be run over by frontier labs. The open question is whether auditability, provenance, and low-level infrastructure give Spiral a comparable role in AI." }], // 1:27:36
  },
  {
    name: "Stretch (STRC)",
    keywords: ["strc", "stretch", "strc.live", "strategy stretch", "overcollateralized bitcoin credit"],
    picks: [
      { youtube_id: "59D_r8qaDu4", t: 5714, label: "STRC buying is presented as live financial engineering at scale: Strategy can sell hundreds of millions of dollars of overcollateralized bitcoin credit at roughly 11.5% yield. The hosts separate that capital-markets machine from technical bitcoin development, while acknowledging how much economic gravity it creates." }, // 1:35:14
    ],
  },
  {
    name: "Bitcoin stablecoins",
    keywords: ["bitcoin stablecoin", "stablecoins on bitcoin", "utexo", "ark stablecoin", "bitcoin-backed stablecoin"],
    picks: [{ youtube_id: "59D_r8qaDu4", t: 1928, label: "Bitcoin stablecoins are treated as a missing product category: Utexo and Ark-style designs point toward dollar instruments that use bitcoin rails or bitcoin credit without defaulting to Ethereum-style token platforms. The strategic question is whether bitcoin-native stablecoins can win on settlement, interoperability, or yield rather than ideology." }], // 32:08
  },
  {
    name: "Codex",
    keywords: ["codex", "codex cli", "openai codex", "claude code", "vibe coding cli"],
    picks: [{ youtube_id: "xID5cFaXAu0", t: 367, label: "Codex is compared with Claude Code through real vibe-coding workflow: running CLI agents for hours, letting them plan and continue work, and using multiple coding agents against each other. The discussion treats coding agents as already practical infrastructure, not a demo category." }], // 6:07
  },
  {
    name: "Vibe coding",
    keywords: ["vibe coding", "vibecoding", "coding agent", "claude code", "codex cli", "bounty projects"],
    picks: [
      { youtube_id: "xID5cFaXAu0", t: 175, label: "Vibe coding is pushed from desk workflow into ambient workflow: Max describes using Codex from a car ride, checking in every 10 or 15 minutes and telling the agent to continue. The point is that coding becomes supervision of an autonomous process rather than continuous hands-on implementation." }, // 2:55
      { youtube_id: "_5WG0yIa8Pc", t: 185, label: "The vibe-coding community is treated as an emerging production surface for Presidio Bitcoin ideas. A member-built app becomes evidence that PBJ brainstorms can turn into working software quickly, especially when AI can generate personalized interfaces and bounty-style projects." }, // 3:05
    ],
  },
  {
    name: "AI agents prefer Bitcoin",
    keywords: ["ai agents prefer bitcoin", "bpi study", "agents choose bitcoin", "agentic wave", "bitcoin for agents"],
    picks: [{ youtube_id: "xID5cFaXAu0", t: 4609, label: "The BPI study is used as evidence for a recurring thesis: when AI agents evaluate payment options by properties rather than brand familiarity, bitcoin looks unusually attractive. The hosts connect this to the agentic wave after OpenClaw and the urgency of making bitcoin the default rail before closed platforms set the norms." }], // 1:16:49
  },
  {
    name: "Kazakhstan",
    keywords: ["kazakhstan", "btc reserve", "sovereign wealth", "national bitcoin", "bitcoin reserve"],
    picks: [{ youtube_id: "xID5cFaXAu0", t: 5100, label: "Kazakhstan adding bitcoin is treated as part of the national-adoption flywheel rather than a one-off headline. The important signal is that more governments and sovereign institutions are considering BTC as a reserve or strategic asset while the US policy window remains open." }], // 1:25:00
  },
  {
    name: "OpenClaw",
    keywords: ["openclaw", "open claw", "openclaw builder meetup", "openclaw openai"],
    picks: [
      { youtube_id: "NejxiHIBy_w", t: 126, label: "The OpenClaw Builder Meetup becomes a signal that local, agentic tooling has crossed from curiosity into community infrastructure. The index itself is mentioned as a way to find OpenClaw segments across episodes, reinforcing how quickly the topic became recurring." }, // 2:06
      { youtube_id: "oeJpuHfd8dg", t: 632, label: "OpenClaw's skill and tool ecosystem is framed as something likely to trend open source because the components are cheap for agents to recreate once the pattern is visible. The durable value may shift from individual tools to hubs, workflows, and agent collaboration surfaces." }, // 10:32
      { youtube_id: "oeJpuHfd8dg", t: 5269, label: "The 'OpenClaw joins OpenAI' segment treats the acquisition-or-alignment story as both plausible product evolution and a source of suspicion. The sharper question is whether OpenClaw's unsafe, local-control aesthetic was organically popular or strategically useful to OpenAI in the frontier-model narrative fight." }, // 1:27:49
    ],
  },
  {
    name: "Agent wallets",
    keywords: ["agent wallet", "agentic wallet", "wallet for agents", "wdk", "agentic payments", "wallet developer kit"],
    picks: [{ youtube_id: "oeJpuHfd8dg", t: 1217, label: "Agent wallets are analyzed as the practical interface between AI agents and commerce: how an agent creates a wallet, receives permissions, pays over bitcoin or stablecoin rails, and avoids KYC-heavy developer flows. The segment compares open bitcoin paths with Stripe and Coinbase's more platform-shaped approaches." }], // 20:17
  },
  {
    name: "Agentic commerce",
    keywords: ["agentic commerce", "agentic payments", "commerce agents", "stripe agent", "coinbase base", "stablecoin commerce"],
    picks: [
      { youtube_id: "oeJpuHfd8dg", t: 2231, label: "Agentic commerce is framed as a rail-selection problem: Bitcoin, Lightning via Spark, Tether, gold tokens, and stablecoins all offer different trade-offs for agents that need to transact without human onboarding. The key criterion is whether a tool is permissionless enough for an agent to create and use directly." }, // 37:11
      { youtube_id: "59D_r8qaDu4", t: 756, label: "The New York Builder presentation 'Unleash the Agents' sharpens the agentic commerce thesis: compare credit cards, stablecoins, and bitcoin, then make the case for why bitcoin should win agent payments. The hosts admit the 'why now' argument still needs work, but frame every bitcoin payment by a buyer, seller, or agent as a vote for the rail." }, // 12:36
      { youtube_id: "NejxiHIBy_w", t: 3033, label: "Agentic payments are tied directly to Lightning's growth curve: if agents become real users, prior volume models may be far too conservative. Matt Corallo's open-source agents post frames bitcoin and Lightning as neutral monetary rails that open agents can use without being boxed out by closed stablecoin ecosystems." }, // 50:33
    ],
  },
  {
    name: "Meta",
    keywords: ["meta stablecoin", "meta", "light spark", "lightspark", "paypal acquisition"],
    picks: [{ youtube_id: "NejxiHIBy_w", t: 4369, label: "Meta's return to stablecoins is read through its long-running payments ambition and the possibility of acquiring or partnering with existing rails. The hosts connect it to a broader scramble by large platforms to own agent and consumer payment infrastructure before the next interface shift hardens." }], // 1:12:49
  },
  {
    name: "Alby",
    keywords: ["alby", "lightning wallets to agents", "alby bots", "roland"],
    picks: [{ youtube_id: "NejxiHIBy_w", t: 4369, label: "Alby is called out as another team moving quickly on Lightning wallets for agents. Its bot services and rapid integrations make it part of the same open agent-payment stack as MDK and OpenClaw, rather than a separate wallet-only story." }], // 1:12:49
  },
  {
    name: "Bolt 12",
    keywords: ["bolt 12", "b12", "offers", "cash app bolt 12", "phoenix bolt 12"],
    picks: [{ youtube_id: "_5WG0yIa8Pc", t: 2857, label: "Bolt 12 is reviewed as a partially missed 2025 prediction: many apps support it, and Phoenix counts as meaningful progress, but the major-brand adoption the hosts expected has not fully arrived. Cash App being publicly on the roadmap keeps the thesis alive for 2026." }], // 47:37
  },
  {
    name: "Contentious forks",
    keywords: ["contentious fork", "bcap", "bitcoin consensus analysis project", "bitcoin governance", "how bitcoin changes"],
    picks: [{ youtube_id: "_5WG0yIa8Pc", t: 5238, label: "Contentious forks are framed through BCAP, the Bitcoin Consensus Analysis Project: the hard question is not only how bitcoin changes, but how it resists unwanted change. The segment uses Knots, quantum concerns, and governance anxiety as examples of why consensus-process literacy matters." }], // 1:27:18
  },
]);

// 2026-08-21 PBJ: BlackRock's New Case for Bitcoin, Stripe Buys OpenRouter, Open Source AI Summit.
addTopicDefs([
  {
    name: "Open Source AI Summit",
    keywords: ["open source ai summit", "david sacks questions", "open weights policy", "auditable training data", "us chip capacity"],
    picks: [{ youtube_id: "Wsu5J5yJU4Q", t: 513, label: "The Open Source AI Summit is framed around open weights, auditable training data, and domestic chip capacity. Preparing questions for David Sacks exposes a policy tradeoff: openness can strengthen U.S. capability while unverified foreign models may carry hidden risks." }], // 8:33
  },
  {
    name: "Berd",
    keywords: ["berd ai agent", "block berd", "enterprise agent harness", "goose development kit", "agent client protocol"],
    picks: [{ youtube_id: "Wsu5J5yJU4Q", t: 1080, label: "Berd is Block's enterprise-ready agentic interface built atop Goose and ACP. Goose remains the lower-level development kit, while Berd offers a reference implementation for organizations needing multi-model use; Buzz remains the collaboration-oriented option for open-source projects and independent developers." }], // 18:00
  },
  {
    name: "TaskFuel",
    keywords: ["taskfuel", "alby taskfuel", "agent payment budget", "l402 x402 payments", "agent paid tools"],
    picks: [{ youtube_id: "Wsu5J5yJU4Q", t: 1350, label: "Alby's TaskFuel lets an agent receive a budget and select paid tools across L402, X402, and Stripe-linked protocols. Its promise is simpler agent commerce, though permissioning remains unresolved and centralized stablecoin rails currently have more adoption than Bitcoin or Lightning." }], // 22:30
  },
  {
    name: "Agent credential isolation",
    keywords: ["agent credential isolation", "agent api key vault", "scoped agent credentials", "agent secret management", "environment variable vault"],
    picks: [{ youtube_id: "Wsu5J5yJU4Q", t: 1814, label: "Agent credential isolation treats API keys, payment methods, and environment secrets as separately scoped vaults rather than extensions of a user's password manager. Agents need authority to provision services, but separate scopes limit damage if one agent or tool is compromised." }], // 30:14
  },
  {
    name: "Stripe's OpenRouter acquisition",
    keywords: ["stripe openrouter acquisition", "openrouter acquisition", "stripe seven and a half billion", "ai model router acquisition", "stripe developer tools"],
    picks: [{ youtube_id: "Wsu5J5yJU4Q", t: 2206, label: "Stripe's acquisition of OpenRouter is framed as a developer-tools and payments combination, not merely a model bet. Owning routing and token payment processing can lower aggregate take rates, subsidize usage, and make an integrated platform harder for thinner competitors to match." }], // 36:46
  },
  {
    name: "Model routing",
    keywords: ["model routing", "openrouter routing", "automated model selection", "multi-model api", "ai inference aggregation"],
    picks: [{ youtube_id: "Wsu5J5yJU4Q", t: 2415, label: "OpenRouter's service is presented as the value of aggregation: developers keep one relationship while a router handles changing model integrations and automated selection. The tradeoff is that routing can create powerful gatekeepers even when many open and closed models remain available." }], // 40:15
  },
  {
    name: "Permissionless agent payments",
    keywords: ["permissionless agent payments", "autonomous agent lightning", "agent payment protocols", "lightning model routing", "digital life payments"],
    picks: [{ youtube_id: "Wsu5J5yJU4Q", t: 2715, label: "They distinguish today's developer-controlled agents, where Stripe's integrated experience is likely stronger, from autonomous agents needing their own payments and model access. The latter could create demand for permissionless Lightning-based protocols, but only if builders create usable services." }], // 45:15
  },
  {
    name: "User intent routing",
    keywords: ["user intent routing", "apple ai routing", "device-level ai interface", "ai top of funnel", "smartphone agent interface"],
    picks: [{ youtube_id: "Wsu5J5yJU4Q", t: 3170, label: "The hosts argue the strategic router will be the company controlling the device or interface where people express intent. Aggregation and low token prices matter, but Apple or Android could direct demand before model providers and routers compete." }], // 52:50
  },
  {
    name: "BlackRock bitcoin report",
    keywords: ["blackrock bitcoin report", "re-underwriting bitcoin", "blackrock bitcoin thesis", "bitcoin portfolio allocation", "bitcoin diversification report"],
    picks: [{ youtube_id: "Wsu5J5yJU4Q", t: 4067, label: "BlackRock's new Bitcoin report is treated as a polished institutional case for allocation, potentially reaching investors who would not follow Bitcoin-native arguments. The hosts examine its charts as a signal that traditional capital is gaining a formal framework for assessing Bitcoin." }], // 1:07:47
  },
  {
    name: "Bitcoin four-year cycle",
    keywords: ["bitcoin four-year cycle", "halving cycle", "miner forced selling", "stock to flow critique", "bitcoin bear market expectation"],
    picks: [{ youtube_id: "Wsu5J5yJU4Q", t: 4863, label: "Bitcoin's four-year cycle is explained as dwindling miner forced selling plus a self-fulfilling investor expectation, not Stock-to-Flow. Halving effects diminish over time, while bear-market waiting and demand-side institutions can produce momentum that a purely supply model omits." }], // 1:21:03
  },
  {
    name: "Bitcoin treasury companies",
    keywords: ["strategy resilience", "mstr resilience", "bitcoin treasury financial engineering", "strategy bitcoin accumulation", "bitcoin treasury risk"],
    picks: [{ youtube_id: "Wsu5J5yJU4Q", t: 5185, label: "Strategy's resilience is attributed to safeguards, a larger cash position, and financial engineering that can benefit when Bitcoin rises. The hosts still separate its securities from holding bitcoin directly: credit, fraud, custody, and concentrated-ownership risks remain even for a bullish investor." }], // 1:26:25
  },
  {
    name: "Bitcoin custody concentration",
    keywords: ["bitcoin custody concentration", "economic custody power", "bitcoin ownership distribution", "etf exchange custody", "bitcoin gini coefficient"],
    picks: [{ youtube_id: "Wsu5J5yJU4Q", t: 5449, label: "Bitcoin concentration cannot be judged from one headline share: retail, ETFs, Strategy, governments, and exchanges measure different claims, and ETF coins may overlap exchange custody. The discussion distinguishes economic ownership from key control and favors distribution metrics that expose both layers." }], // 1:30:49
  },
  {
    name: "Stratum V2",
    keywords: ["stratum v2", "mining pool decentralization", "stratum v2 incentives", "mining pool authentication", "hashrate decentralization"],
    picks: [{ youtube_id: "Wsu5J5yJU4Q", t: 5665, label: "Stratum V2 is presented as a route to more decentralized mining-pool control through better authentication and encryption, but adoption lacks immediate economic demand. The slow rollout is frustrating, yet the hosts view broad voluntary adoption by independent actors as a decentralization strength." }], // 1:34:25
  },
]);


addTopicDefs([
  {
    name: "Bitkey",
    keywords: ["bitkey display", "bitkey vegas", "block bitkey", "verify address", "hardware wallet ux"],
    picks: [{ youtube_id: "gebBz3V_8uo", t: 160, label: "Block's new Bitkey with a display is treated as a self-custody UX upgrade: users can verify send and receive addresses on dedicated hardware, while still getting Bitkey's 2-of-3 recovery model instead of raw seed management." }], // 2:40
  },
  {
    name: "Seedless custody",
    keywords: ["seedless bitkey", "seed phrase", "seedless self custody", "social recovery", "unilateral control"],
    picks: [{ youtube_id: "gebBz3V_8uo", t: 420, label: "The hosts revisit seedless self-custody through Bitkey's 2-of-3 design. The trade-off is practical: many users are safer with guided recovery and unilateral control paths than with a seed phrase they can lose, leak, or misunderstand." }], // 7:00
  },
  {
    name: "Wrench attacks",
    keywords: ["wrench attack", "personal safety", "vaulting", "hardware wallet safety", "coercion"],
    picks: [{ youtube_id: "gebBz3V_8uo", t: 630, label: "Bitkey prompts a practical safety discussion around wrench attacks. Vaulting, withdrawal delays, and recovery policy become part of self-custody design because securing bitcoin is also about reducing physical coercion risk." }], // 10:30
  },
  {
    name: "Square Bitcoin payments",
    keywords: ["square tap to pay", "square bitcoin payments", "nfc bitcoin payments", "cash app transaction"],
    picks: [{ youtube_id: "gebBz3V_8uo", t: 824, label: "Square's tap-to-pay flow is discussed as a bridge between familiar merchant hardware and Cash App bitcoin transactions. The important shift is that bitcoin payment rails can appear inside ordinary checkout behavior instead of feeling like a separate crypto ritual." }], // 13:44
  },
  {
    name: "Cash App",
    keywords: ["cash app bitcoin back", "cash app p2p", "cashapp bitcoin rewards", "cash app bitcoin payments"],
    picks: [{ youtube_id: "gebBz3V_8uo", t: 974, label: "Cash App's 5% bitcoin-back offer and P2P bitcoin payments are treated as mainstream distribution moments. The hosts focus on rewards and familiar peer payments as ways to normalize bitcoin without requiring users to start from ideology." }], // 16:14
  },
  {
    name: "Bitcoin rewards",
    keywords: ["bitcoin rewards", "bitcoin back", "cash app bitcoin back", "5% bitcoin back"],
    picks: [{ youtube_id: "gebBz3V_8uo", t: 974, label: "Cash App's bitcoin-back rewards show how accumulation can be introduced through normal spending behavior. The product frame is simple: earn bitcoin as a reward first, then learn the deeper self-custody and payment story over time." }], // 16:14
  },
  {
    name: "Proof of reserves",
    keywords: ["proof of reserves", "proof of liabilities", "river proof of reserves", "block proof of reserves"],
    picks: [{ youtube_id: "gebBz3V_8uo", t: 1096, label: "River's proof-of-reserves and liabilities work is credited as a template that Block later followed. The segment frames reserves as a trust-minimizing disclosure standard for bitcoin financial companies, not just a post-FTX marketing badge." }], // 18:16
  },
  {
    name: "Aven",
    keywords: ["aven", "aven bitcoin card", "bitcoin-backed liquidity", "traditional fintech bitcoin"],
    picks: [{ youtube_id: "gebBz3V_8uo", t: 1600, label: "Aven's bitcoin-backed liquidity and card product is treated as a sign that traditional San Francisco fintech companies are moving into bitcoin collateral. The hosts compare it with PB-native work like Surge to ask which custody and signer models will win." }], // 26:40
  },
  {
    name: "Bitcoin-backed loans",
    keywords: ["bitcoin-based loans", "bitcoin-backed liquidity", "bitcoin lending strategy", "borrow against bitcoin"],
    picks: [{ youtube_id: "gebBz3V_8uo", t: 1790, label: "The lending segment revisits the core borrower problem: access liquidity without selling bitcoin, while avoiding opaque custody, rehypothecation, and brittle liquidation mechanics. The hosts compare strategies rather than assuming every bitcoin loan is the same product." }], // 29:50
  },
  {
    name: "Surge",
    keywords: ["surge signer network", "surge mpc", "surge bitcoin lending", "non-custodial bitcoin lending"],
    picks: [{ youtube_id: "gebBz3V_8uo", t: 1600, label: "Surge is referenced as the Presidio Bitcoin-built counterpoint to Aven: a bitcoin-backed lending approach using a signer network and MPC to reduce custody risk while still making credit usable." }], // 26:40
  },
  {
    name: "Strike",
    keywords: ["strike tether xxi", "strike strategy", "tether xxi", "jack mallers strategy"],
    picks: [{ youtube_id: "gebBz3V_8uo", t: 2282, label: "The hosts speculate about Strike, Tether, and XXI as a combined strategic stack: payment distribution, stablecoin liquidity, and bitcoin-native capital markets potentially reinforcing each other." }], // 38:02
  },
  {
    name: "XXI",
    keywords: ["xxi tether strike", "twenty one strategy", "mallers xxi", "bitcoin capital markets"],
    picks: [{ youtube_id: "gebBz3V_8uo", t: 2282, label: "XXI is discussed through the possibility that Tether and Strike are building more than a treasury company. The question is whether XXI becomes a capital-markets layer that feeds bitcoin financial products and distribution." }], // 38:02
  },
  {
    name: "Stretch (STRC)",
    keywords: ["strc", "stretch", "saylor stretch", "strc vegas"],
    picks: [{ youtube_id: "gebBz3V_8uo", t: 2761, label: "Saylor's Vegas explanation of STRC gives the hosts a cleaner frame for Stretch: a bitcoin-backed credit instrument that can sit between treasury accumulation and more money-like products." }], // 46:01
  },
  {
    name: "Hack-Nation",
    keywords: ["hack nation ai", "hack nation", "hackathon applicants", "ai hackathon"],
    picks: [{ youtube_id: "gebBz3V_8uo", t: 2873, label: "Hack Nation AI's applicant scale changes the feel of the Presidio Bitcoin Hackathon: thousands of people wanted in, and the hosts treat that demand as evidence that bitcoin plus AI builder energy is much larger than the local room." }], // 47:53
  },
  {
    name: "Mesh-LLM",
    keywords: ["mesh llm", "mesh-llm", "spare compute", "distributed llm", "builder event"],
    picks: [{ youtube_id: "gebBz3V_8uo", t: 3844, label: "Builder's Mesh-LLM presentation is described as a practical peer-to-peer compute experiment: pool spare machines, distribute open-model workloads, and make AI inference feel more like a network than a centralized cloud account." }], // 1:04:04
  },
  {
    name: "Goose Perception",
    keywords: ["goose perception", "goose-perception", "personal wiki", "computer observation", "ai agent memory"],
    picks: [{ youtube_id: "gebBz3V_8uo", t: 3844, label: "Goose Perception is highlighted as an agent-memory experiment: Goose watches what is happening on your computer and keeps a personal wiki updated so future agents can understand your projects, people, and workflow context." }], // 1:04:04
  },
  {
    name: "Local AI hardware",
    keywords: ["machine specs", "local ai hardware", "gpu specs", "computer capabilities", "on-device ai"],
    picks: [{ youtube_id: "gebBz3V_8uo", t: 4383, label: "The hosts argue that machine specs matter again because local and open-source AI workloads make RAM, GPUs, and device capabilities strategically relevant. Consumer hardware becomes part of the privacy and sovereignty stack." }], // 1:13:03
  },
  {
    name: "Open-source AI models",
    keywords: ["open source ai economics", "open source ai privacy", "open models", "local models economics"],
    picks: [{ youtube_id: "gebBz3V_8uo", t: 4499, label: "Recent SF AI conversations suggest companies are switching more workloads to open-source models for economics and privacy. The hosts treat open models as already good enough for many corporate tasks, especially where data-sharing with frontier labs is unacceptable." }], // 1:14:59
  },
  {
    name: "AI privacy",
    keywords: ["frontier model privacy", "sharing data with models", "ai data sharing", "private model usage"],
    picks: [{ youtube_id: "gebBz3V_8uo", t: 4499, label: "AI privacy is discussed as a business necessity: everyone wants frontier-model quality without handing sensitive data to the model provider. That creates demand for local, open, or credibly private inference paths." }], // 1:14:59
  },
  {
    name: "Frontier models",
    keywords: ["frontier models", "frontier labs", "model providers", "models eating companies"],
    picks: [{ youtube_id: "gebBz3V_8uo", t: 4813, label: "Frontier models are framed as both infrastructure and existential platform risk. If an application company builds on one provider and feeds it proprietary usage data, the model provider may later absorb the product category." }], // 1:20:13
  },
  {
    name: "Model provider lock-in",
    keywords: ["model lock in", "frontier provider", "model flexibility", "multi-model strategy", "switching models"],
    picks: [{ youtube_id: "gebBz3V_8uo", t: 4813, label: "The hosts argue organizations need model flexibility: support multiple providers, keep the option to run models in different locations, and avoid giving one frontier lab both the workflow and the data needed to replace you." }], // 1:20:13
  },
  {
    name: "X Money",
    keywords: ["x money", "cashtags", "cash tags", "x payments", "twitter payments"],
    picks: [{ youtube_id: "gebBz3V_8uo", t: 5165, label: "X Money is discussed through the possibility of CashTags becoming payment primitives. The hosts ask whether X can turn social identity, handles, and money movement into a consumer payment layer." }], // 1:26:05
  },
  {
    name: "San Francisco",
    keywords: ["san francisco", "sf ai dominance", "sf is back", "ai market cap bay area", "bitcoin ai san francisco"],
    picks: [
      { youtube_id: "gebBz3V_8uo", t: 5342, label: "SF is back is grounded in AI market structure: the hosts cite data suggesting the overwhelming share of AI market cap is concentrated in the San Francisco Bay Area, making Presidio Bitcoin unusually well positioned at the bitcoin and AI intersection." }, // 1:29:02
    ],
  },
]);

addTopicDefs([
  {
    name: "Presidio Bitcoin Startup Night",
    keywords: ["presidio bitcoin startup night", "startup night", "bitcoin founders", "bitcoin startups"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 1885, label: "Startup Night transitions from PBJ context into founder pitches from companies building at Presidio Bitcoin and around the broader bitcoin ecosystem. The event frames early-stage bitcoin startups as part of a renewed Silicon Valley builder moment." }], // 31:25
  },
  {
    name: "Bitcoin VC landscape",
    keywords: ["bitcoin vc", "venture capital", "bitcoin venture", "bitcoin startup investing", "investable startups"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 476, label: "Steve explains why bitcoin venture has been harder than broader tech or crypto: the number of investable startups and venture-scale business opportunities has historically been limited, which keeps larger funds from focusing deeply on the category." }], // 7:56
  },
  {
    name: "Bitcoin in Silicon Valley",
    keywords: ["bitcoin silicon valley", "silicon valley bitcoin", "presidio bitcoin", "bitcoin startup density"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 573, label: "Max argues Presidio Bitcoin can reconnect bitcoin with Silicon Valley's capital, design talent, and business talent after years of crypto misallocation. The thesis is that bitcoin needs the best builders pointed at the protocol likely to endure." }], // 9:33
  },
  {
    name: "Bitcoin business models",
    keywords: ["bitcoin business models", "bitcoin startups", "exchanges", "mining hardware", "bitcoin lending"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 630, label: "The PBJ crew maps the bitcoin business models that have worked so far: exchanges, mining hardware, custody-adjacent services, lending, and simply holding bitcoin. The open question is which new categories can become venture-scale without abandoning bitcoin's core properties." }], // 10:30
  },
  {
    name: "Bitcoin exchanges",
    keywords: ["bitcoin exchanges", "coinbase", "kraken", "river", "crypto exchanges"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 653, label: "Exchanges are treated as the clearest profitable bitcoin startup category to date, with Coinbase, Kraken, and bitcoin-only examples like River. The caveat is that the largest exchanges often rely heavily on broader crypto trading and casino-like volume." }], // 10:53
  },
  {
    name: "Bitcoin mining businesses",
    keywords: ["bitcoin mining businesses", "bitmain", "miners", "mining hardware", "public miners"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 653, label: "Mining is identified as another major bitcoin business category, especially hardware and infrastructure. Bitmain is named as the biggest winner, while public miners are discussed as businesses now being pulled into AI compute because they were early to energy and power infrastructure." }], // 10:53
  },
  {
    name: "Bitcoin-only startups",
    keywords: ["bitcoin-only startups", "hardcore bitcoiners", "self-custody startups", "privacy startups"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 769, label: "Steve says many bitcoin-only startups have been founded by people deeply committed to self-custody, privacy, and bitcoin principles, but those values alone have not always translated into products customers need today or revenue that can support a venture-scale company." }], // 12:49
  },
  {
    name: "Bitcoin gaming",
    keywords: ["bitcoin gaming", "games with bitcoin", "consumer bitcoin apps", "bitcoin games"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 823, label: "DK treats gaming as an early consumer category for bitcoin, but warns against building a game that is merely 'with bitcoin.' The better test is whether the product would be great on its own and bitcoin makes the experience meaningfully better." }], // 13:43
  },
  {
    name: "Prediction markets",
    keywords: ["prediction markets", "bitcoin prediction markets", "nostr prediction markets", "gaming"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 969, label: "Prediction markets are discussed as a native form of bitcoin-enabled gaming. Nostr and bitcoin can combine publishing and payments in a way that may open designs that are difficult under conventional regulatory and payment infrastructure." }], // 16:09
  },
  {
    name: "Bitcoin monetization",
    keywords: ["bitcoin monetization", "store of value", "medium of exchange", "bitcoin layers", "payments later"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 875, label: "Max frames bitcoin monetization as a layered process that cannot be forced faster than reality. Store-of-value adoption and corporate balance-sheet gains can help companies survive until payment use cases mature." }], // 14:35
  },
  {
    name: "Bitcoin-backed loans",
    keywords: ["bitcoin lending", "bitcoin-backed loans", "collateralized loans", "borrow against bitcoin"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 1067, label: "Bitcoin lending is presented as one of the business models with clear product-market fit because holders want liquidity without selling and triggering taxes. The unresolved challenge is whether lenders can avoid opaque custody and rehypothecation risk." }], // 17:47
  },
  {
    name: "Non-custodial lending",
    keywords: ["non-custodial lending", "self-custodial lending", "multisig lending", "lend at hodl hodl"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 1116, label: "Asked about JP Morgan and traditional finance, Steve says the unsolved opportunity is successful non-custodial lending at scale. If a startup goes fully custodial, it competes much more directly with banks, brokers, and large financial incumbents." }], // 18:36
  },
  {
    name: "Rehypothecation risk",
    keywords: ["rehypothecation", "blockfi", "bitcoin lending trust", "custody risk", "credit blowup"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 1067, label: "The lending discussion repeatedly returns to rehypothecation and trust. Bitcoin-backed credit works as a customer problem, but the category is judged by whether collateral remains verifiable and protected rather than disappearing into an opaque balance sheet." }], // 17:47
  },
  {
    name: "Banks vs. Bitcoin startups",
    keywords: ["banks vs bitcoin startups", "jp morgan bitcoin lending", "traditional finance bitcoin", "bitcoin startups banks"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 1116, label: "The crew separates bank-compatible bitcoin lending from startup-native bitcoin products. JP Morgan may serve private-wealth borrowers, but startups can still win by building self-custody, global access, and products incumbents will not touch." }], // 18:36
  },
  {
    name: "Net-new Bitcoin use cases",
    keywords: ["net-new bitcoin use cases", "internet of value", "permissionless payment network", "always-on bitcoin"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 1208, label: "Max argues the biggest bitcoin startups will be built around net-new possibilities, not slightly better versions of bank products. The target is what a global, always-on, permissionless payment and value network enables that traditional finance will not build." }], // 20:08
  },
  {
    name: "Bitcoin developer tools",
    keywords: ["bitcoin developer tools", "ldk", "lightspark", "lexe", "bitcoin application tooling"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 1477, label: "Steve says bitcoin developer tools have improved dramatically: LDK, Lexe-style services, Lightspark, and AI coding tools can turn ideas that once required a specialized team into prototypes that can be built in minutes." }], // 24:37
  },
  {
    name: "Nostr identity",
    keywords: ["nostr identity", "user-owned identity", "public private key identity", "nostr bitcoin stack"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 1600, label: "Max frames Nostr as user-owned identity for the internet, pairing with bitcoin as base value and Lightning as payments. In his stack, Nostr handles identity and messaging while bitcoin handles value and settlement." }], // 26:40
  },
  {
    name: "Bitcoin merchant adoption",
    keywords: ["merchant adoption", "square bitcoin payments", "bitcoin merchants", "save 3% fees"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 1650, label: "Square's bitcoin payments launch becomes the prompt for a practical merchant push. Spiral's materials focus on the merchant-facing benefit of saving payment fees, because that message lands before ideological arguments about censorship resistance or privacy." }], // 27:30
  },
  {
    name: "Crypto capital misallocation",
    keywords: ["crypto capital misallocation", "silicon valley crypto", "crypto casino", "bitcoin talent"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 1805, label: "Max argues the last several years misallocated Silicon Valley capital and talent into crypto casino games. Startup Night is framed as a chance to redirect elite builders, designers, and capital toward bitcoin instead." }], // 30:05
  },
  {
    name: "Vora",
    keywords: ["vora", "vora vault", "vora aegis", "self-custodied ai", "jesse posner"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 1890, label: "Vora is pitched as a home for your digital life: personal AI and home technology secured with user-owned hardware, keys, encrypted data, recovery, and verifiable software inspired by the bitcoin self-custody ethos." }], // 31:30
  },
  {
    name: "Self-custodied AI",
    keywords: ["self-custodied ai", "personal ai custody", "custodial ai", "ai self custody"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 1986, label: "Vora argues AI will bring mainstream users into self-custody before bitcoin does because personal AI will hold health, financial, calendar, email, and private conversational data. The more useful AI becomes, the more dangerous custodial AI becomes." }], // 33:06
  },
  {
    name: "Not your keys, not your AI",
    keywords: ["not your keys not your ai", "ai keys", "ai loyalty", "custodial ai", "personal ai"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 2066, label: "Vora adapts bitcoin's custody maxim to AI: not your keys, not your AI. Jesse argues a personal AI can only be loyal to the user if the user controls the model, memory, system prompts, hardware, backups, and keys." }], // 34:26
  },
  {
    name: "AI privacy",
    keywords: ["ai privacy", "private ai", "chat history leak", "encrypted ai data", "ai data privacy"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 2294, label: "Vora treats AI privacy as a mass-market shift: once people see leaks of full chat histories or personal AI memory, they will care much more about where models run, who holds keys, and whether backups and data are encrypted end to end." }], // 38:14
  },
  {
    name: "Castle",
    keywords: ["castle", "save with castle", "automated bitcoin treasuries", "business bitcoin treasury"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 2554, label: "Castle is pitched as automated bitcoin treasury software for businesses, built around the thesis that dollars and savings accounts fail as long-term savings tools once inflation and purchasing power are accounted for." }], // 42:34
  },
  {
    name: "Business Bitcoin treasuries",
    keywords: ["business bitcoin treasury", "small business bitcoin", "corporate bitcoin treasury", "bitcoin savings for businesses"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 2663, label: "Castle says everyday businesses think about bitcoin allocation as a percentage of revenue or balance sheet, but current tools force them into manual exchange workflows. Its product translates bitcoin treasury management into business-native language." }], // 44:23
  },
  {
    name: "Revenue automation",
    keywords: ["revenue automation", "bitcoin revenue allocation", "percentage of revenue bitcoin", "castle revenue"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 2769, label: "Castle's revenue automation lets a business connect payment and bookkeeping systems, choose what percentage of incoming revenue should convert into bitcoin, and automate accumulation without manual spreadsheets or exchange clicks." }], // 46:09
  },
  {
    name: "Bitcoin sweep accounts",
    keywords: ["bitcoin sweep account", "idle cash", "sweep into bitcoin", "business checking threshold"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 2915, label: "Castle adapts the sweep-account concept to bitcoin: a business sets a checking-account threshold, and idle cash above that level automatically sweeps into bitcoin instead of sitting in dollars and losing purchasing power." }], // 48:35
  },
  {
    name: "Stable Channels",
    keywords: ["stable channels", "stable dollar balances", "lightning dollar stability", "tony clausing"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 3337, label: "Stable Channels is pitched as a way to deliver self-custodied, dollar-denominated balances on bitcoin by using Lightning channels, peer-to-peer architecture, and high-frequency rebalancing rather than fiat IOUs." }], // 55:37
  },
  {
    name: "Stable dollar balances on Bitcoin",
    keywords: ["stable dollar balances on bitcoin", "synthetic dollars bitcoin", "bitcoin dollar stability", "stablecoins bitcoin ethos"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 3361, label: "Stable Channels starts from stablecoin product-market fit but rejects the fiat-IOU tradeoff. The question is whether bitcoin can deliver useful dollar stability while preserving self-custody and decentralization." }], // 56:01
  },
  {
    name: "Lightning synthetic dollars",
    keywords: ["lightning synthetic dollars", "stable channels synthetic dollar", "lightning stable dollar", "dollar balance lightning"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 3432, label: "Stable Channels creates a synthetic dollar position by matching a user who wants stable dollar value with a provider willing to take leveraged bitcoin exposure inside a Lightning channel." }], // 57:12
  },
  {
    name: "Streaming finance",
    keywords: ["streaming finance", "lightning counterparty risk", "continuous finance", "instant settlement finance"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 3567, label: "Stable Channels calls its model streaming finance: Lightning compresses counterparty risk to seconds, allowing financial relationships to update continuously in tiny increments rather than through slow, batch-style settlement." }], // 59:27
  },
  {
    name: "Guarana Bank",
    keywords: ["guarana bank", "guarana", "andres maceira", "bitcoin credit latin america"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 3826, label: "Guarana Bank is pitched as a shared-custody bitcoin-backed credit app for people who want to borrow without selling bitcoin or handing collateral to an opaque custodian, shaped by the founders' experience with Latin American currency devaluation." }], // 1:03:46
  },
  {
    name: "Argentina currency devaluation",
    keywords: ["argentina currency devaluation", "argentinian peso", "hyperinflation", "3000% inflation", "argentina bitcoin"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 3836, label: "Guarana grounds its credit thesis in Argentina's monetary history: repeated currency changes, the 1989 inflation crisis above 3,000%, the peso's long-term collapse, and the lived experience of unreliable financial security." }], // 1:03:56
  },
  {
    name: "Latin America Bitcoin credit",
    keywords: ["latin america bitcoin credit", "bitcoin loans latam", "argentina bitcoin credit", "guarana bank"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 4132, label: "Guarana argues shared-custody bitcoin credit is especially important in Latin America, where decades of currency devaluation make long-term holders want liquidity without selling bitcoin or trusting a black-box lender." }], // 1:08:52
  },
  {
    name: "Shared-custody Bitcoin credit",
    keywords: ["shared-custody bitcoin credit", "shared custody bitcoin loan", "bitcoin collateral management", "non-custodial credit"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 4093, label: "Guarana's product is framed as shared-custody bitcoin credit: a middle path meant to preserve more transparency and control than custodial lenders while still enabling borrowers to access credit against long-term bitcoin holdings." }], // 1:08:13
  },
  {
    name: "Bitcoin-backed credit",
    keywords: ["bitcoin-backed credit", "borrow without selling bitcoin", "bitcoin collateral loans", "bitcoin credit app"],
    picks: [{ youtube_id: "TYoGefYQ1yw", t: 3959, label: "Guarana describes the market for bitcoin-backed credit as holders who want to unlock liquidity without selling. It sizes the opportunity from bitcoin's market cap, active coins, likely willingness to borrow, and a 50% loan-to-value assumption." }], // 1:05:59
  },
]);

addTopicDefs([
  {
    name: "Early PBJ",
    keywords: ["early pbj", "first pbj episodes", "bitcoin jam early episodes", "december 2024 pbj"],
    picks: [
      { youtube_id: "5MMJ7-rvTUY", t: 0, label: "The first archived PBJ episode starts with bitcoin crossing $100k and sets the show's early pattern: price milestones quickly become discussions about payments, developer experience, and corporate treasury strategy." }, // 0:00
      { youtube_id: "LZ1ZCr4MXxY", t: 0, label: "By the twelfth early PBJ, the show has broadened into security, privacy, exchange hacks, Apple encryption policy, and how AI may change the urgency of personal data protection." }, // 0:00
    ],
  },
  {
    name: "$100k bitcoin milestone",
    keywords: ["100k bitcoin", "$100k bitcoin", "bitcoin price milestone", "six figure bitcoin"],
    picks: [{ youtube_id: "5MMJ7-rvTUY", t: 0, label: "PBJ's first archived episode opens on bitcoin crossing $100k, treating the price milestone less as a finish line and more as a prompt to ask what adoption, use, and development should look like next." }], // 0:00
  },
  {
    name: "Digital gold",
    keywords: ["digital gold", "powell digital gold", "bitcoin as gold", "jerome powell bitcoin"],
    picks: [{ youtube_id: "5MMJ7-rvTUY", t: 470, label: "Jerome Powell's digital-gold framing becomes a way to discuss bitcoin's current institutional legibility: store of value is easier for officials to understand than medium-of-exchange or open monetary network." }], // 7:50
  },
  {
    name: "Bitcoin payments",
    keywords: ["bitcoin payments", "lightning payments", "bitcoin as currency", "medium of exchange"],
    picks: [
      { youtube_id: "5MMJ7-rvTUY", t: 1407, label: "The hosts separate bitcoin's store-of-value success from the harder payments question, asking what real payment use cases can become compelling instead of assuming price appreciation alone will carry adoption." }, // 23:27
      { youtube_id: "WFsWloC7BS4", t: 2982, label: "Lightning's health is debated through actual usage, merchant demand, and whether bitcoin payments need a stronger narrative than 'Lightning is dead' versus 'Lightning fixes everything.'" }, // 49:42
    ],
  },
  {
    name: "Bitcoin developer experience",
    keywords: ["bitcoin developer experience", "bitcoin dev education", "bitcoin developer onboarding", "developer tools"],
    picks: [{ youtube_id: "5MMJ7-rvTUY", t: 2486, label: "Early PBJ identifies developer experience and education as bottlenecks: bitcoin needs better ways for new builders to understand the stack, discover projects, and contribute without already being deep insiders." }], // 41:26
  },
  {
    name: "Corporate bitcoin treasury strategies",
    keywords: ["corporate bitcoin treasury", "bitcoin treasury strategy", "microstrategy block treasury", "corporate bitcoin balance sheet"],
    picks: [{ youtube_id: "5MMJ7-rvTUY", t: 4194, label: "The first PBJ compares MicroStrategy and Block as treasury archetypes: one maximizes bitcoin accumulation through capital markets, while the other embeds bitcoin into products, mining, open source, and payments." }], // 1:09:54
  },
  {
    name: "Quantum and bitcoin",
    keywords: ["quantum and bitcoin", "bitcoin quantum computing", "quantum risks bitcoin", "quantum solutions bitcoin"],
    picks: [
      { youtube_id: "fWYf1DIe1Mc", t: 0, label: "The second PBJ focuses on quantum risk and bitcoin, beginning the show's recurring treatment of quantum as both a technical threat model and a coordination problem for future upgrades." }, // 0:00
      { youtube_id: "WFsWloC7BS4", t: 0, label: "Quantum computing returns the next week, paired with Spiral Wizards and the question of how bitcoin should evaluate new cryptographic proposals before the threat becomes urgent." }, // 0:00
    ],
  },
  {
    name: "Bitcoin supply cap",
    keywords: ["bitcoin supply cap", "21 million cap", "more than 21 million bitcoin", "blackrock 21 million"],
    picks: [
      { youtube_id: "lKkQDmgXWVo", t: 0, label: "The BlackRock 21 million cap discussion treats bitcoin's supply limit as a social, technical, and economic guarantee: not magic, but a rule defended by nodes, users, and incentives." }, // 0:00
      { youtube_id: "WFsWloC7BS4", t: 1402, label: "John Carvalho's denomination proposal prompts a broader discussion of whether bitcoin's 21 million framing or 2.1 quadrillion sats framing matters for UX, monetary intuition, and public understanding." }, // 23:22
    ],
  },
  {
    name: "Bitcoin denominations",
    keywords: ["bitcoin denominations", "sats", "bits", "bip 177", "2.1 quadrillion"],
    picks: [{ youtube_id: "WFsWloC7BS4", t: 1402, label: "The denomination debate asks whether renaming units can make bitcoin more intuitive, or whether changing the mental model risks confusing the very scarcity story users already understand." }], // 23:22
  },
  {
    name: "Hardware wallet security",
    keywords: ["hardware wallet security", "hardware wallets", "wallet supply chain", "bitcoin self custody hardware"],
    picks: [{ youtube_id: "fWYf1DIe1Mc", t: 0, label: "Hardware-wallet security appears early as part of the quantum and custody discussion, with the hosts treating self-custody as a stack of assumptions rather than a simple purchase decision." }], // 0:00
  },
  {
    name: "Lava",
    keywords: ["lava", "lava bitcoin", "keith rabois", "bitcoin wallet funding"],
    picks: [{ youtube_id: "fWYf1DIe1Mc", t: 0, label: "Lava's $10 million raise from Keith Rabois is discussed as a sign that bitcoin consumer infrastructure and wallet UX can still attract serious Silicon Valley-style backing." }], // 0:00
  },
  {
    name: "Mining chips vs rigs",
    keywords: ["mining chips vs rigs", "bitcoin mining chips", "bitcoin mining rigs", "asic supply chain"],
    picks: [{ youtube_id: "lKkQDmgXWVo", t: 2086, label: "The chips-versus-rigs segment separates ASIC chips from complete mining rigs, asking where value, control, and centralization pressure actually sit in the bitcoin mining hardware supply chain." }], // 34:46
  },
  {
    name: "Mining decentralization",
    keywords: ["mining decentralization", "bitcoin mining decentralization", "mining centralization", "asic decentralization"],
    picks: [{ youtube_id: "lKkQDmgXWVo", t: 3449, label: "Mining decentralization is discussed through hardware production, operational scale, and whether separating chips from rigs could help distribute control across more builders and geographies." }], // 57:29
  },
  {
    name: "Yuppie elite bitcoin skepticism",
    keywords: ["yuppie elite bitcoin", "elite dismiss bitcoin", "bitcoin skepticism", "citadel21 yuppie elite"],
    picks: [{ youtube_id: "9jVSes7XbB0", t: 2334, label: "The Yuppie Elite essay gives PBJ a cultural lens for bitcoin skepticism: smart, credentialed people can reject bitcoin because it violates status narratives, institutional trust, and the way they expect progress to look." }], // 38:54
  },
  {
    name: "Genesis block",
    keywords: ["genesis block", "bitcoin birthday", "16th birthday bitcoin", "bitcoin genesis"],
    picks: [{ youtube_id: "9jVSes7XbB0", t: 495, label: "Bitcoin's 16th birthday becomes a moment to revisit the genesis block, why bitcoin has survived, and why the hosts are still spending their time on it years after the first discovery phase." }], // 8:15
  },
  {
    name: "Proof of Keys",
    keywords: ["proof of keys", "proof of reserves", "withdraw bitcoin", "self custody day"],
    picks: [{ youtube_id: "9jVSes7XbB0", t: 3013, label: "Proof of Keys and proof of reserves are discussed as complementary disciplines: exchanges can make claims, but bitcoiners still need withdrawal practice and custody habits that keep those claims honest." }], // 50:13
  },
  {
    name: "Self-custody scaling",
    keywords: ["self-custody scaling", "can self custody scale", "bitcoin custody scale", "bitcoin custody UX"],
    picks: [{ youtube_id: "9jVSes7XbB0", t: 3346, label: "The early PBJ crew asks whether self-custody can scale beyond expert users, framing custody as both a technical UX challenge and a cultural education problem." }], // 55:46
  },
  {
    name: "Infrastructure vs. applications",
    keywords: ["infrastructure vs applications", "bitcoin infrastructure", "bitcoin apps", "push and pull"],
    picks: [{ youtube_id: "9jVSes7XbB0", t: 3789, label: "Infrastructure versus application development is framed as a push-pull problem: bitcoin needs deeper primitives and better user-facing apps, and each side can create demand for the other." }], // 1:03:09
  },
  {
    name: "Anchorwatch",
    keywords: ["anchorwatch", "bitcoin insurance", "self custody insurance", "miniscript insurance"],
    picks: [{ youtube_id: "7h7RjBehe-w", t: 206, label: "Anchorwatch is introduced as self-custody augmented by insurance, using structured custody, policy design, and bitcoin-native tools to make insured self-custody credible." }], // 3:26
  },
  {
    name: "Bitcoin insurance",
    keywords: ["bitcoin insurance", "self-custody insurance", "insured custody", "anchorwatch"],
    picks: [{ youtube_id: "7h7RjBehe-w", t: 868, label: "Anchorwatch's solution overview shows bitcoin insurance as more than a policy wrapper: the custody setup itself has to be legible to underwriters and enforceable enough to reduce real loss risk." }], // 14:28
  },
  {
    name: "Miniscript",
    keywords: ["miniscript", "bitcoin miniscript", "policy language", "script policy"],
    picks: [{ youtube_id: "7h7RjBehe-w", t: 1733, label: "Miniscript is highlighted as the policy layer that can make complex custody arrangements analyzable, testable, and insurable instead of bespoke scripts that only experts can reason about." }], // 28:53
  },
  {
    name: "Reproducible builds",
    keywords: ["reproducible builds", "signal reproducible", "software verification", "build verification"],
    picks: [{ youtube_id: "7h7RjBehe-w", t: 3018, label: "The reproducible-builds segment uses Signal as a prompt to ask when users can verify that the software they run corresponds to the source code they trust." }], // 50:18
  },
  {
    name: "Stacker News non-custodial",
    keywords: ["stacker news non-custodial", "stacker news", "non custodial social", "zaps"],
    picks: [{ youtube_id: "7h7RjBehe-w", t: 4103, label: "Stacker News going non-custodial is treated as a meaningful shift for bitcoin-native social apps: zaps and balances should move toward user custody rather than platform custody when possible." }], // 1:08:23
  },
  {
    name: "Bitcoin custody models",
    keywords: ["bitcoin custody models", "custody techniques", "bitcoin custody survey", "custody setup"],
    picks: [{ youtube_id: "OSanv5Z-DA4", t: 0, label: "The custody survey episode maps four approaches to holding bitcoin, emphasizing that there is no single custody model for every user, threat model, and life stage." }], // 0:00
  },
  {
    name: "Custody attack vectors",
    keywords: ["custody attack vectors", "bitcoin custody risks", "known custody attacks", "custody threat model"],
    picks: [{ youtube_id: "OSanv5Z-DA4", t: 566, label: "The custody survey emphasizes preparing for known attack vectors before choosing tools: device compromise, coercion, phishing, inheritance, exchange failure, and ordinary human error." }], // 9:26
  },
  {
    name: "Phishing attacks",
    keywords: ["phishing attacks", "bitcoin phishing", "human element custody", "social engineering bitcoin"],
    picks: [{ youtube_id: "OSanv5Z-DA4", t: 1862, label: "Phishing is framed as the human side of bitcoin security: even strong cryptography fails when users can be tricked into revealing secrets or approving the wrong action." }], // 31:02
  },
  {
    name: "User error",
    keywords: ["user error", "bitcoin security user error", "custody mistakes", "self custody mistakes"],
    picks: [{ youtube_id: "OSanv5Z-DA4", t: 2952, label: "User error is described as the biggest bitcoin security risk for many people, which means good custody design has to reduce mistakes rather than only maximize theoretical sovereignty." }], // 49:12
  },
  {
    name: "Coinbase collateralized borrowing",
    keywords: ["coinbase collateralized borrowing", "coinbase bitcoin loans", "borrow against bitcoin coinbase", "coinbase lending"],
    picks: [{ youtube_id: "OSanv5Z-DA4", t: 4153, label: "Coinbase's collateralized borrowing product raises the question of whether convenient bitcoin loans will pull users toward custodial platforms unless self-custody alternatives can match the experience." }], // 1:09:13
  },
  {
    name: "OpenAI Operator",
    keywords: ["openai operator", "operator agent", "ai browser agent", "openai agent"],
    picks: [{ youtube_id: "kl_x2YNTZR4", t: 448, label: "OpenAI Operator is treated as an early mainstream glimpse of agents that can navigate services on a user's behalf, raising questions about identity, permissions, payments, and what breaks when bots use the web." }], // 7:28
  },
  {
    name: "Dead Internet Theory",
    keywords: ["dead internet theory", "bots online", "ai internet", "bot internet"],
    picks: [{ youtube_id: "kl_x2YNTZR4", t: 1055, label: "Dead Internet Theory becomes less of a meme and more of an operating assumption as AI agents, bots, and generated content change what it means for online activity to be human." }], // 17:35
  },
  {
    name: "Nostr web of trust",
    keywords: ["nostr web of trust", "pgp web of trust", "nostr trust", "emergent web of trust"],
    picks: [{ youtube_id: "kl_x2YNTZR4", t: 1520, label: "Nostr's emergent web of trust is compared to PGP-style trust graphs, but with better chances of becoming usable because social context, identity, and publishing are native to the protocol." }], // 25:20
  },
  {
    name: "Open-source algorithms",
    keywords: ["open-source algorithms", "algorithmic alignment", "open social algorithms", "financial alignment open source"],
    picks: [{ youtube_id: "kl_x2YNTZR4", t: 3197, label: "The hosts argue open-source algorithms can align culture and money differently from closed feeds: users, developers, and communities can inspect, fork, and financially support the algorithms they want." }], // 53:17
  },
  {
    name: "Crypto executive order",
    keywords: ["crypto executive order", "trump crypto executive order", "bitcoin regulation forecast", "bsa bitcoin"],
    picks: [{ youtube_id: "kl_x2YNTZR4", t: 3570, label: "The Trump crypto executive order is used to forecast regulatory direction, including where bitcoin-specific clarity may diverge from broader crypto policy and Bank Secrecy Act defaults." }], // 59:30
  },
  {
    name: "Strategic Bitcoin Reserve",
    keywords: ["strategic bitcoin reserve", "sbr", "us bitcoin reserve", "bitcoin strategic reserve"],
    picks: [
      { youtube_id: "kl_x2YNTZR4", t: 4438, label: "The early PBJ forecast asks whether a US Strategic Bitcoin Reserve is politically real, symbolically useful, or likely to be muddied by broader crypto-reserve agendas." }, // 1:13:58
      { youtube_id: "7ZJjjYJ1g2k", t: 102, label: "Strategic reserve talk is immediately tied to the distinction between bitcoin and crypto, especially whether XRP-style lobbying can blur the policy case for bitcoin as a reserve asset." }, // 1:42
    ],
  },
  {
    name: "Public vs. private money",
    keywords: ["public vs private money", "private money", "public money", "bitcoin government money"],
    picks: [{ youtube_id: "7ZJjjYJ1g2k", t: 510, label: "The public-versus-private money discussion asks what kind of money bitcoin is when states, companies, and individuals all interact with the same open network." }], // 8:30
  },
  {
    name: "Bitcoin governance constituents",
    keywords: ["bitcoin governance constituents", "how can bitcoin change", "bitcoin constituents", "bitcoin governance"],
    picks: [{ youtube_id: "7ZJjjYJ1g2k", t: 970, label: "The hosts explain bitcoin change as a negotiation among many constituents rather than a single owner, which is why changing bitcoin's rules is deliberately difficult." }], // 16:10
  },
  {
    name: "Taproot Assets",
    keywords: ["taproot assets", "usdt taproot assets", "stablecoins taproot assets", "taro"],
    picks: [{ youtube_id: "7ZJjjYJ1g2k", t: 1798, label: "USDT on Taproot Assets prompts a debate over whether stablecoins on bitcoin rails could accelerate Lightning usage or import issuer, regulatory, and consensus risks into bitcoin-adjacent systems." }], // 29:58
  },
  {
    name: "Stablecoins on bitcoin",
    keywords: ["stablecoins on bitcoin", "usdt on bitcoin", "stablecoin bitcoin rails", "tether bitcoin"],
    picks: [{ youtube_id: "7ZJjjYJ1g2k", t: 3551, label: "The episode asks how Tether and stablecoins fit into bitcoin's future: as payment-demand accelerants, competitors for monetary mindshare, or bridges that bring users to bitcoin rails." }], // 59:11
  },
  {
    name: "AI agent payments",
    keywords: ["ai agent payments", "agents pay bitcoin", "ai bitcoin payments", "agentic payments"],
    picks: [
      { youtube_id: "7ZJjjYJ1g2k", t: 4321, label: "AI and bitcoin payments are linked through the need for agents to transact programmatically, globally, and with less reliance on card networks or bank accounts designed for humans." }, // 1:12:01
      { youtube_id: "MIulbwu91nI", t: 3603, label: "The AI-agent payments discussion asks whether open money or closed systems will win when agents need to buy domains, pay APIs, and coordinate work without human checkout flows." }, // 1:00:03
    ],
  },
  {
    name: "Taproot Wizards",
    keywords: ["taproot wizards", "bitcoin season 2", "wizard raise", "bitcoin ordinals"],
    picks: [{ youtube_id: "MIulbwu91nI", t: 619, label: "Taproot Wizards' $30 million raise is treated as a signal that venture investors still see bitcoin application narratives, even when the cultural fit with bitcoin's conservative base is contested." }], // 10:19
  },
  {
    name: "Bitcoin Season 2",
    keywords: ["bitcoin season 2", "covenants", "bitcoin expressiveness", "scaling bitcoin"],
    picks: [{ youtube_id: "MIulbwu91nI", t: 995, label: "Bitcoin Season 2 is discussed through covenants, Lightning, and expressiveness: how much new functionality should bitcoin enable, and how much should stay outside the base protocol." }], // 16:35
  },
  {
    name: "Bitcoin expressiveness",
    keywords: ["bitcoin expressiveness", "bitcoin scripting", "bitcoin programmability", "expressive bitcoin"],
    picks: [{ youtube_id: "MIulbwu91nI", t: 2063, label: "The expressiveness segment weighs bitcoin's deliberately constrained design against builders' desire for richer applications, asking where complexity should live." }], // 34:23
  },
  {
    name: "DeepSeek",
    keywords: ["deepseek", "ai agents deepseek", "fewsats deepseek", "ai payments"],
    picks: [{ youtube_id: "MIulbwu91nI", t: 2623, label: "DeepSeek and Fewsats become a concrete AI-agent prompt: cheaper models, better agents, and programmatic payments together could create new demand for bitcoin-native payment rails." }], // 43:43
  },
  {
    name: "Stratum and mempools",
    keywords: ["stratum", "mempools", "stratum mining", "bitcoin mempool"],
    picks: [{ youtube_id: "MIulbwu91nI", t: 4492, label: "Stratum, mempools, and hashrate are linked through mining centralization concerns: who builds blocks, who sees transaction flow, and what happens as mining infrastructure professionalizes." }], // 1:14:52
  },
  {
    name: "Sovereign wealth bitcoin adoption",
    keywords: ["sovereign wealth bitcoin", "abu dhabi bitcoin", "uae bitcoin", "nation state bitcoin"],
    picks: [{ youtube_id: "QEZnIK93D8g", t: 0, label: "Abu Dhabi's bitcoin exposure starts a discussion of sovereign-wealth adoption, where state-level balance sheets may enter bitcoin through ETFs, custodians, and institutional wrappers before direct custody." }], // 0:00
  },
  {
    name: "Nation-state bitcoin custody",
    keywords: ["nation-state bitcoin custody", "institutional btc management", "bitcoin custody transition of power", "sovereign bitcoin custody"],
    picks: [{ youtube_id: "QEZnIK93D8g", t: 477, label: "Nation-state custody raises problems ordinary holders do not face: transition of power, bureaucratic controls, key management guidelines, and institutional procedures for holding bitcoin responsibly." }], // 7:57
  },
  {
    name: "Institutional BTC management",
    keywords: ["institutional btc management", "bitcoin management guidelines", "institutional bitcoin custody", "sovereign bitcoin guidelines"],
    picks: [{ youtube_id: "QEZnIK93D8g", t: 732, label: "The hosts call for guidelines around institutional BTC management, because states and large institutions need processes for custody, authorization, reporting, and continuity before bitcoin can be responsibly held at scale." }], // 12:12
  },
  {
    name: "UTXOracle",
    keywords: ["utxoracle", "utx oracle", "bitcoin oracle", "oracle-free price"],
    picks: [{ youtube_id: "QEZnIK93D8g", t: 2104, label: "UTXOracle is explained as a way to infer bitcoin price from on-chain UTXO patterns, opening a discussion of what kinds of smart-contract-like applications can be built with minimal external oracle trust." }], // 35:04
  },
  {
    name: "Decentralized order books",
    keywords: ["decentralized order books", "bitcoin order books", "oracle order books", "bitcoin trading infrastructure"],
    picks: [{ youtube_id: "QEZnIK93D8g", t: 3092, label: "The order-book segment explores how oracle-like signals such as UTXOracle could support more decentralized market infrastructure without simply recreating centralized exchange custody." }], // 51:32
  },
  {
    name: "Bitcoin confirmation risk",
    keywords: ["bitcoin confirmation risk", "confirmation risk calculator", "jlopp calculator", "bitcoin confirmations"],
    picks: [{ youtube_id: "QEZnIK93D8g", t: 4094, label: "Jameson Lopp's confirmation-risk calculator turns the familiar 'wait six confirmations' rule into a more explicit model of transaction value, hashpower assumptions, and acceptable reorg risk." }], // 1:08:14
  },
  {
    name: "Obscura VPN",
    keywords: ["obscura vpn", "obscura", "bitcoin vpn", "privacy vpn"],
    picks: [{ youtube_id: "QEZnIK93D8g", t: 5155, label: "Obscura's VPN service is discussed as part of the broader bitcoin privacy stack: tools that reduce network-level surveillance matter even when they are not themselves wallets or custody products." }], // 1:25:55
  },
  {
    name: "Bybit hack",
    keywords: ["bybit hack", "bybit heist", "exchange hack", "1.5 billion hack"],
    picks: [{ youtube_id: "LZ1ZCr4MXxY", t: 0, label: "The Bybit heist opens the security episode as another reminder that large custodians are high-value honeypots and that operational policy can fail even when individual security components look strong." }], // 0:00
  },
  {
    name: "Address replacement attacks",
    keywords: ["address replacement attacks", "bitcoin address replacement", "clipboard attack", "verify send address"],
    picks: [{ youtube_id: "LZ1ZCr4MXxY", t: 312, label: "Address replacement attacks are treated as a practical user threat: the transaction can be technically valid while the destination has silently changed, so verification has to happen at the human interface." }], // 5:12
  },
  {
    name: "HSM policy risk",
    keywords: ["hsm policy risk", "hardware security module", "hsm bitcoin", "security policy"],
    picks: [{ youtube_id: "LZ1ZCr4MXxY", t: 532, label: "The Bybit discussion emphasizes that HSMs are only as strong as the policy around them. Hardware controls cannot compensate for broken approval flows, weak address verification, or confused operational procedures." }], // 8:52
  },
  {
    name: "Server as screen",
    keywords: ["server as screen", "hardware wallet display", "address verification display", "bitcoin signing UX"],
    picks: [{ youtube_id: "LZ1ZCr4MXxY", t: 1280, label: "Server as screen is floated as a possible answer to hardware-display limits: if users cannot safely verify complex transactions on tiny devices, signing UX may need new trusted-display patterns." }], // 21:20
  },
  {
    name: "Apple Advanced Data Protection",
    keywords: ["apple advanced data protection", "adp", "apple privacy uk", "icloud encryption"],
    picks: [{ youtube_id: "LZ1ZCr4MXxY", t: 1577, label: "Apple pulling Advanced Data Protection in response to government pressure becomes a concrete example of how platform-level privacy can be weakened by legal mandates even for sophisticated users." }], // 26:17
  },
  {
    name: "Data honeypots",
    keywords: ["data honeypots", "bitcoin data honeypots", "centralized data", "privacy attacks bitcoiners"],
    picks: [{ youtube_id: "LZ1ZCr4MXxY", t: 2011, label: "The hosts connect growing data honeypots to bitcoin-specific risk: as more services collect sensitive user data, attackers gain better maps of who holds assets and how to target them." }], // 33:31
  },
  {
    name: "Privacy pain threshold",
    keywords: ["privacy pain threshold", "privacy wake up call", "ai privacy awareness", "privacy action"],
    picks: [{ youtube_id: "LZ1ZCr4MXxY", t: 2165, label: "The privacy pain-threshold discussion asks whether users need a major shock before they change behavior, and whether LLMs and AI data exposure will finally make personal privacy feel urgent." }], // 36:05
  },
  {
    name: "End-to-end encryption",
    keywords: ["end-to-end encryption", "private data", "encrypted backups", "privacy fundamental right"],
    picks: [{ youtube_id: "LZ1ZCr4MXxY", t: 2598, label: "The episode ends by arguing that end-to-end encryption and private data should be treated as basic individual infrastructure, not premium features that platforms can withdraw under pressure." }], // 43:18
  },
]);

addTopicDefs([
  {
    name: "Built in the Presidio",
    keywords: ["built in the presidio", "built at presidio", "presidio bitcoin companies", "presidio bitcoin builders"],
    picks: [
      { youtube_id: "OfegnpXFRVI", t: 0, label: "Built in the Presidio opens as a deeper company interview format, starting with Vora and the larger philosophical and technical questions behind self-custody, AI, data, and bitcoin." }, // 0:00
      { youtube_id: "LFTt5q0THxM", t: 7, label: "The second Built in the Presidio episode turns to Surge, using bitcoin lending as a way to examine how Presidio Bitcoin companies are trying to build more native financial infrastructure." }, // 0:07
    ],
  },
  {
    name: "Surge",
    keywords: ["surge", "surge credit", "surge.credit", "yash belavadi", "michael borglin"],
    picks: [{ youtube_id: "LFTt5q0THxM", t: 99, label: "Yash Belavadi and Michael Borglin introduce Surge as a bitcoin lending company built from experience in self-custody, custody infrastructure, DeFi, and bitcoin application design." }], // 1:39
  },
  {
    name: "Bitcoin-backed loans",
    keywords: ["bitcoin lending", "bitcoin-backed loans", "collateralized loans", "borrow against bitcoin"],
    picks: [{ youtube_id: "LFTt5q0THxM", t: 19, label: "The Surge episode opens by framing bitcoin lending as an old financial market with a uniquely bitcoin failure mode: repeated cycles of lending growth followed by collapses when custody and trust are handled poorly." }], // 0:19
  },
  {
    name: "Non-custodial lending",
    keywords: ["non-custodial lending", "self-custodial lending", "bitcoin non-custodial loans", "trust-minimized lending"],
    picks: [
      { youtube_id: "LFTt5q0THxM", t: 380, label: "Surge argues non-custodial lending is finally closer to prime time because the technical pieces, market awareness, and customer demand have improved since earlier failed attempts." }, // 6:20
      { youtube_id: "LFTt5q0THxM", t: 725, label: "Michael explains why lending has historically centralized: custodial models match traditional banking mental models and are much easier to build, while non-custodial systems require stronger technical primitives." }, // 12:05
    ],
  },
  {
    name: "Custodial lending failures",
    keywords: ["custodial lending failures", "blockfi", "ftx", "genesis lending", "centralized lending blowups"],
    picks: [{ youtube_id: "LFTt5q0THxM", t: 487, label: "Yash traces the history of bitcoin lending back through cycle-driven custodial products, noting that BlockFi, FTX, and other centralized blowups made users more aware that bitcoin collateral should be verifiable and different from bank-style trust." }], // 8:07
  },
  {
    name: "Rehypothecation risk",
    keywords: ["rehypothecation", "blockfi", "bitcoin lending trust", "custody risk", "credit blowup"],
    picks: [{ youtube_id: "LFTt5q0THxM", t: 569, label: "The Surge conversation treats BlockFi and FTX as reminders that bitcoin collateral is not like ordinary collateral: if lending systems obscure custody, users cannot know whether the asset is still actually there." }], // 9:29
  },
  {
    name: "Bitcoin-backed credit",
    keywords: ["bitcoin-backed credit", "borrow without selling bitcoin", "bitcoin collateral loans", "bitcoin credit app"],
    picks: [{ youtube_id: "LFTt5q0THxM", t: 1308, label: "Surge sees retail bitcoin-backed credit as a growing market: users want to borrow against bitcoin, but they need a product that preserves self-custody enough to earn trust after the failures of previous lenders." }], // 21:48
  },
  {
    name: "ETF-based lending",
    keywords: ["etf-based lending", "bitcoin etf loans", "margin loans bitcoin etf", "wall street bitcoin lending"],
    picks: [{ youtube_id: "LFTt5q0THxM", t: 1385, label: "The episode contrasts self-custody lending with ETF-based lending and margin loans, warning that convenient financial products can pull bitcoin back toward Wall Street unless native alternatives exist." }], // 23:05
  },
  {
    name: "Distributed custody network",
    keywords: ["distributed custody network", "dcn", "surge dcn", "bitcoin lending custody"],
    picks: [{ youtube_id: "LFTt5q0THxM", t: 1557, label: "Surge's roadmap includes a distributed custody network with at least three partners, meant to make the lending system less dependent on a single custodian while still supporting a usable product." }], // 25:57
  },
  {
    name: "Fixed-rate bitcoin loans",
    keywords: ["fixed-rate bitcoin loans", "variable rate bitcoin loans", "surge fixed rate", "bitcoin loan markets"],
    picks: [{ youtube_id: "LFTt5q0THxM", t: 1566, label: "Surge plans both variable and fixed-rate loan markets, reflecting a borrower need that DeFi-style variable markets do not fully solve for users who want more predictable credit terms." }], // 26:06
  },
  {
    name: "On-chain risk parameters",
    keywords: ["on-chain risk parameters", "loan parameters on chain", "ltv haircut liquidation", "verify lending parameters"],
    picks: [{ youtube_id: "LFTt5q0THxM", t: 1630, label: "Yash explains Surge's on-chain risk parameters: liquidity providers should be able to verify LTV, liquidation rules, rates, and the actual bitcoin collateral instead of trusting an opaque lending box." }], // 27:10
  },
  {
    name: "Liquidity cold start",
    keywords: ["liquidity cold start", "two-sided marketplace", "bitcoin lending liquidity", "liquidity providers"],
    picks: [{ youtube_id: "LFTt5q0THxM", t: 1808, label: "Surge's immediate challenge is the lending cold start: borrowers want liquidity, liquidity providers want to see bitcoin locked and demand proven, and the product has to bootstrap both sides without centralizing shortcuts." }], // 30:08
  },
  {
    name: "Unilateral exit",
    keywords: ["unilateral exit", "surge disappears", "bitcoin collateral recovery", "self-custody loan exit"],
    picks: [{ youtube_id: "LFTt5q0THxM", t: 2001, label: "Surge describes a unilateral exit path: if the company disappears, the self-custodied wallet can reclaim collateral after the loan term, limiting the user's dependence on the company continuing to operate." }], // 33:21
  },
  {
    name: "Vora",
    keywords: ["vora", "vora vault", "vora aegis", "self-custodied ai", "jesse posner"],
    picks: [{ youtube_id: "OfegnpXFRVI", t: 65, label: "Jesse and Erik explain Vora's origin as a response to bitcoin self-custody hardware they did not trust enough for serious savings: cheap devices, supply-chain risk, and a need for more uncompromising security." }], // 1:05
  },
  {
    name: "Verifiable hardware",
    keywords: ["verifiable hardware", "open-source hardware", "transparent hardware", "hardware verification"],
    picks: [
      { youtube_id: "OfegnpXFRVI", t: 235, label: "Vora's core hardware thesis comes from crypto-sovereignty: if bitcoin self-custody is to be real, users need verifiable, open-source, transparent hardware rather than opaque devices with unknown low-level code." }, // 3:55
      { youtube_id: "OfegnpXFRVI", t: 541, label: "Vora argues secure hardware is foundational not only for bitcoin, but for any digital-age system where political power, private data, and personal agency depend on trustworthy computers." }, // 9:01
    ],
  },
  {
    name: "Supply-chain attacks",
    keywords: ["supply-chain attacks", "hardware wallet supply chain", "chip backdoor", "microcode"],
    picks: [{ youtube_id: "OfegnpXFRVI", t: 312, label: "Jesse explains why Vora focuses on supply-chain attacks: if the chip, hardware, or closed-source microcode used to generate keys is compromised, even strong cryptography and multisig setups can fail." }], // 5:12
  },
  {
    name: "Chip-level verification",
    keywords: ["chip-level verification", "iris chip imaging", "bunnie huang", "non-destructive chip imaging"],
    picks: [{ youtube_id: "OfegnpXFRVI", t: 462, label: "Vora draws inspiration from Bunnie's Iris technique for nondestructive chip imaging, imagining hardware that can be inspected and certified down to the microchip level without destroying the device." }], // 7:42
  },
  {
    name: "Sovereign custody",
    keywords: ["sovereign custody", "sovereign custody solution", "keys and data", "digital life custody"],
    picks: [{ youtube_id: "OfegnpXFRVI", t: 653, label: "Vora extends bitcoin's self-sovereignty ethos beyond coins: the same concerns around privacy, encryption, and control increasingly apply to personal computers, data, AI agents, and the user's digital life." }], // 10:53
  },
  {
    name: "Self-custodied AI",
    keywords: ["self-custodied ai", "personal ai custody", "custodial ai", "ai self custody"],
    picks: [{ youtube_id: "OfegnpXFRVI", t: 685, label: "Erik frames Vora as a hardened computer for private AI: a system good enough to store bitcoin should also be good enough to run a personal AI, recover encrypted data, and act as a fiduciary toward other AIs." }], // 11:25
  },
  {
    name: "AI data privacy",
    keywords: ["ai data privacy", "personal ai data", "private ai data", "ai privacy"],
    picks: [{ youtube_id: "OfegnpXFRVI", t: 1495, label: "Jesse argues AI will change privacy expectations because useful personal AI needs health data, financial data, email, calendars, memory, and context; that makes custodial AI far more sensitive than ordinary web services." }], // 24:55
  },
  {
    name: "AI fiduciary",
    keywords: ["ai fiduciary", "loyal ai", "personal ai loyalty", "corporate ai"],
    picks: [{ youtube_id: "OfegnpXFRVI", t: 1610, label: "The Vora conversation asks who a personal AI is loyal to: the user or the corporate platform. As AI becomes a lifelong companion and decision layer, loyalty, ownership, and custody become central design questions." }], // 26:50
  },
  {
    name: "Digital life self-custody",
    keywords: ["digital life self-custody", "safeguarding digital life", "keys and data", "self-sovereignty online"],
    picks: [{ youtube_id: "OfegnpXFRVI", t: 1665, label: "Vora treats bitcoin self-custody as the best existing template for securing high-value personal data. The same mindset used to protect keys may be needed for AI memories, files, identity, and a lifetime of digital context." }], // 27:45
  },
  {
    name: "Cryptography and constitutional rights",
    keywords: ["cryptography constitutional rights", "code is speech", "cryptography first amendment", "cryptography fourth amendment"],
    picks: [{ youtube_id: "OfegnpXFRVI", t: 2211, label: "Jesse argues the first five amendments can be read as protecting cryptography: code as speech, cryptography as a munition, backdoors as intrusion, privacy against search, and due process for digital tools." }], // 36:51
  },
]);

addTopicDefs([
  {
    name: "Member Spotlight",
    keywords: ["member spotlight", "presidio bitcoin members", "pb members"],
    picks: [
      { youtube_id: "F0hyvzYcdso", t: 10, label: "The first Member Spotlight introduces the format as a monthly way to highlight the people building from Presidio Bitcoin, starting with Vora's Jesse Posner and Erik Cason." }, // 0:10
      { youtube_id: "dPlNNPucHCE", t: 17, label: "Max Webster's spotlight frames the series as a behind-the-scenes look at members, companies, and the daily work happening inside Presidio Bitcoin." }, // 0:17
    ],
  },
  {
    name: "Fold",
    keywords: ["fold", "fold app", "fold card", "bitcoin rewards", "joshua philippe"],
    picks: [
      { youtube_id: "ZQWaYlUGmPk", t: 852, label: "Joshua Philippe describes joining Fold after Strike and rebuilding the app from the ground up, with a new information architecture, product positioning, and a broader vision of Fold as a bitcoin-native financial home." }, // 14:12
      { youtube_id: "ZQWaYlUGmPk", t: 1233, label: "Fold's rebrand and credit-card launch become a case study in how bitcoin companies speak to mainstream users: less abstract technology, more concrete financial value and day-to-day usefulness." }, // 20:33
    ],
  },
  {
    name: "Bitcoin product design",
    keywords: ["bitcoin product design", "bitcoin ux", "design thinking bitcoin", "bitcoin designers"],
    picks: [
      { youtube_id: "ZQWaYlUGmPk", t: 64, label: "Joshua explains why bitcoin needed designers: the early industry was technical and engineering-led, but terrible UX created a large opening for design talent to make products more usable and trustworthy." }, // 1:04
      { youtube_id: "ZQWaYlUGmPk", t: 1028, label: "The spotlight asks whether bitcoin companies are maturing into Silicon Valley-style product organizations, where design leadership shapes product strategy rather than only polishing interfaces after engineering decisions." }, // 17:08
    ],
  },
  {
    name: "Strike design",
    keywords: ["strike design", "strike ux", "punk unconventional beautiful bitcoin open", "jack mallers"],
    picks: [{ youtube_id: "ZQWaYlUGmPk", t: 600, label: "Joshua describes becoming head of design at Strike and using design leadership to turn rough product ideas into credible futures: practical UX improvements, prototypes, and the five-word identity of punk, unconventional, beautiful, bitcoin, and open." }], // 10:00
  },
  {
    name: "Bitcoin brand strategy",
    keywords: ["bitcoin brand strategy", "bitcoin messaging", "bitcoin narrative", "mainstream bitcoin brand"],
    picks: [{ youtube_id: "ZQWaYlUGmPk", t: 1077, label: "Joshua argues that bitcoin's next stage requires sharper narrative and brand strategy. Companies need to decide when to lead with bitcoin, when to lead with user benefits, and how to open the aperture beyond bitcoin enthusiasts." }], // 17:57
  },
  {
    name: "Delegance AI",
    keywords: ["delegance ai", "dustin dannenhauer", "ai agents", "nostr devs"],
    picks: [{ youtube_id: "jR98jxbKlpE", t: 169, label: "Dustin Dannenhauer traces his agent work back to 2011 and explains how modern LLMs made agent-building practical enough to connect with Nostr, open-source tools, and Presidio Bitcoin's builder community." }], // 2:49
  },
  {
    name: "Data vending machines",
    keywords: ["data vending machines", "nostr dvm", "agent tools", "async api nostr"],
    picks: [{ youtube_id: "jR98jxbKlpE", t: 227, label: "Dustin explains Nostr data vending machines as API-like services for agents: specialized tools can be spun up asynchronously over Nostr, letting others compose agent workflows without rebuilding every capability themselves." }], // 3:47
  },
  {
    name: "Open-source AI models",
    keywords: ["open-source ai models", "local ai models", "sovereign ai", "private ai models"],
    picks: [{ youtube_id: "jR98jxbKlpE", t: 381, label: "Dustin's optimism about AI rests partly on open-source models and consumer hardware improving quickly enough that individuals can run increasingly capable AI privately and sovereignly." }], // 6:21
  },
  {
    name: "Nostr and AI",
    keywords: ["nostr and ai", "ai agents nostr", "decentralized ai tooling", "nostr data"],
    picks: [
      { youtube_id: "jR98jxbKlpE", t: 570, label: "The Delegance AI spotlight asks how Nostr and decentralized tooling might become more important as AI grows, especially for identity, messaging, data access, and agent coordination." }, // 9:30
      { youtube_id: "jR98jxbKlpE", t: 741, label: "Dustin compares Nostr to Go: simple rules that create complex emergent behavior. AI could help developers navigate that complexity by handling data, coordination, and protocol friction." }, // 12:21
    ],
  },
  {
    name: "Guarana Bank",
    keywords: ["guarana bank", "guarana", "andres maceira", "bitcoin credit latin america"],
    picks: [{ youtube_id: "XXqNQAdU1XA", t: 596, label: "Andy Maceira previews Guarana Bank as a bitcoin-backed credit product for people who want to borrow against bitcoin without selling the best-performing asset they own." }], // 9:56
  },
  {
    name: "Argentina bitcoin adoption",
    keywords: ["argentina bitcoin adoption", "argentina bitcoin", "argentina stablecoins", "argentina tether"],
    picks: [{ youtube_id: "XXqNQAdU1XA", t: 333, label: "Andy describes Argentina as an early-adopter market: millions of exchange users, massive stablecoin volume, and practical demand driven by capital controls and access to dollars." }], // 5:33
  },
  {
    name: "Stablecoin remittances",
    keywords: ["stablecoin remittances", "tether argentina", "stablecoin adoption argentina", "dollar access"],
    picks: [{ youtube_id: "XXqNQAdU1XA", t: 362, label: "The Guarana spotlight points to Tether and stablecoins as a practical dollar-access tool in Argentina, with users caring less about reserve mechanics than the ability to reach dollars under capital controls." }], // 6:02
  },
  {
    name: "Emerging-market bitcoin financial services",
    keywords: ["emerging market bitcoin financial services", "argentina bitcoin financial services", "bitcoin services emerging markets"],
    picks: [{ youtube_id: "XXqNQAdU1XA", t: 499, label: "Andy argues that markets like Argentina may be early adopters of bitcoin-based financial services because people have fewer legacy options and a clearer need for savings, credit, and banking alternatives." }], // 8:19
  },
  {
    name: "Hivemind VC",
    keywords: ["hivemind vc", "hivemind ventures", "max webster", "bitcoin venture capital"],
    picks: [{ youtube_id: "dPlNNPucHCE", t: 426, label: "Max Webster describes Hivemind VC as a first-money-in bitcoin fund, usually writing early checks and helping founders think bigger about markets, hiring, monetization, and company formation." }], // 7:06
  },
  {
    name: "Bitcoin venture capital",
    keywords: ["bitcoin venture capital", "bitcoin startups", "first money in", "bitcoin company formation"],
    picks: [{ youtube_id: "dPlNNPucHCE", t: 426, label: "The Hivemind spotlight lays out Max's early-stage investing style: first checks, founder coaching, market selection, and a bias toward helping bitcoin startups become ambitious enough for Silicon Valley-scale outcomes." }], // 7:06
  },
  {
    name: "Presidio Bitcoin startup hub",
    keywords: ["presidio bitcoin startup hub", "bitcoin startups presidio", "bitcoin talent san francisco", "bitcoin coworking"],
    picks: [
      { youtube_id: "dPlNNPucHCE", t: 244, label: "Max describes Presidio Bitcoin as a daily collision engine for startups, open-source developers, investors, and founders, where informal lunches and whiteboard sessions create higher-fidelity collaboration than remote calls." }, // 4:04
      { youtube_id: "FsrcEQBeQjs", t: 380, label: "Lexe's hiring story shows Presidio Bitcoin working as a talent filter: the team expected the right candidate to walk through the door, and that is exactly how they found a new hire." }, // 6:20
    ],
  },
  {
    name: "Solar and batteries",
    keywords: ["solar and batteries", "solar storage", "solar cost curve", "battery cost curve"],
    picks: [{ youtube_id: "dPlNNPucHCE", t: 609, label: "Max explains his solar-and-battery thesis through cost curves: every doubling of deployed capacity makes solar and storage cheaper, creating Moore's-law-like dynamics for electricity." }], // 10:09
  },
  {
    name: "Type I Summit",
    keywords: ["type i summit", "type 1 summit", "kardashev scale", "terawatt grid"],
    picks: [{ youtube_id: "dPlNNPucHCE", t: 837, label: "The Type I Summit is introduced as Presidio Bitcoin's effort to gather bitcoin, energy, compute, and free-market builders around the question of how to build terawatt-scale grids." }], // 13:57
  },
  {
    name: "Nostr identity",
    keywords: ["nostr identity", "user-owned identity", "nostr private key", "nostr applications"],
    picks: [{ youtube_id: "dPlNNPucHCE", t: 1001, label: "Max frames Nostr as user-owned identity: a private-key-based substrate for identity and information that can plug into many applications and pair with bitcoin incentives." }], // 16:41
  },
  {
    name: "Lexe",
    keywords: ["lexe", "lexi", "ldk", "intel sgx", "trusted execution environment", "tee", "async payments"],
    picks: [{ youtube_id: "FsrcEQBeQjs", t: 84, label: "Max Fang and Philip Hayes describe Lexe as Lightning infrastructure that runs user nodes inside cloud hardware enclaves, aiming for a custodial-feeling Lightning experience while keeping the wallet self-custodial." }], // 1:24
  },
  {
    name: "Lightning self-custody UX",
    keywords: ["lightning self-custody ux", "self-custodial lightning wallet", "lightning ux", "cloud lightning node"],
    picks: [{ youtube_id: "FsrcEQBeQjs", t: 141, label: "Lexe starts from the gap between Lightning's promise and its UX: the original 24/7 self-run-node model did not work for most users, while mobile wallets still struggle with offline receiving and static payment identifiers." }], // 2:21
  },
  {
    name: "Offline Lightning receiving",
    keywords: ["offline lightning receiving", "async lightning payments", "lightning address offline", "bolt 12 offline"],
    picks: [{ youtube_id: "FsrcEQBeQjs", t: 201, label: "Lexe highlights offline receiving as a core Lightning problem: if a phone goes offline after creating an invoice, payments can fail, especially for static identifiers like Lightning Address and BOLT 12." }], // 3:21
  },
  {
    name: "Trusted execution environments",
    keywords: ["trusted execution environments", "tee", "intel sgx", "hardware enclave", "remote attestation"],
    picks: [{ youtube_id: "FsrcEQBeQjs", t: 252, label: "The Lexe team explains how seeing Signal use SGX in production helped them connect the dots: hardware enclaves could run users' Lightning nodes in the cloud without giving the provider spending access." }], // 4:12
  },
  {
    name: "Vora",
    keywords: ["vora", "vora vault", "vora aegis", "self-custodied ai", "jesse posner"],
    picks: [{ youtube_id: "F0hyvzYcdso", t: 422, label: "Jesse and Erik introduce Vora as a sovereign-custody system: an open-source, verifiable full-stack computer meant to secure keys, data, nodes, hardware wallets, home systems, and eventually personal AI." }], // 7:02
  },
  {
    name: "Sovereign custody",
    keywords: ["sovereign custody", "sovereign custody solution", "keys and data", "digital life custody"],
    picks: [{ youtube_id: "F0hyvzYcdso", t: 422, label: "Vora uses the phrase sovereign custody for a broader custody problem than bitcoin keys alone: people need secure control over data, devices, backups, and their digital life as the internet becomes more agentic." }], // 7:02
  },
  {
    name: "Digital life self-custody",
    keywords: ["digital life self-custody", "safeguarding digital life", "keys and data", "self-sovereignty online"],
    picks: [{ youtube_id: "F0hyvzYcdso", t: 462, label: "Erik and Jesse argue bitcoiners are tired of assembling security from disconnected building blocks. Vora's goal is an integrated package that safeguards an entire digital life, not only a wallet." }], // 7:42
  },
  {
    name: "Bitcoin coworking",
    keywords: ["bitcoin coworking", "presidio bitcoin coworking", "physical bitcoin community", "bitcoin workspace"],
    picks: [{ youtube_id: "F0hyvzYcdso", t: 65, label: "Vora's founders describe Presidio Bitcoin as instrumental to the company: a physical workspace, technical community, investor network, and place for product and philosophy conversations that would not happen in a remote-only setup." }], // 1:05
  },
]);

addTopicDefs([
  {
    name: "Hack-Nation",
    keywords: ["hack-nation", "hack nation", "ai hackathon", "linn bieske"],
    picks: [{ youtube_id: "V1-KjT3brmQ", t: 23, label: "Linn Bieske introduces Hack-Nation as a quarterly AI hackathon and builder community. The interview frames hackathons as more than a 24-hour sprint: they can create durable community, collaboration, and proof of work for new AI builders." }], // 0:23
  },
  {
    name: "AI builder communities",
    keywords: ["ai builder communities", "ai entrepreneurs", "hack-nation", "ai collaboration"],
    picks: [{ youtube_id: "V1-KjT3brmQ", t: 97, label: "Linn describes Hack-Nation as a way to help more people become AI researchers, entrepreneurs, and innovators. The theme is designing spaces where curiosity turns into community rather than isolated demos." }], // 1:37
  },
  {
    name: "Agentic money",
    keywords: ["agentic money", "ai agents earn", "lightning agents", "agent payments"],
    picks: [{ youtube_id: "V1-KjT3brmQ", t: 1079, label: "Spiral's Hack-Nation challenge asks what becomes possible when AI agents can earn and pay using bitcoin and Lightning. The segment treats agentic money as a practical design space for hackathon builders." }], // 17:59
  },
  {
    name: "Financial censorship",
    keywords: ["financial censorship", "transaction denied", "frozen accounts", "payments denied"],
    picks: [{ youtube_id: "ysPxfA2922I", t: 218, label: "Rainey Reitman explains how lawful speech can still lead to frozen accounts, denied payments, and exclusion from financial infrastructure. Her Transaction Denied frame puts banking access squarely inside civil-liberties work." }], // 3:38
  },
  {
    name: "Transaction Denied",
    keywords: ["transaction denied", "big finance power to punish speech", "rainey reitman", "financial censorship book"],
    picks: [{ youtube_id: "ysPxfA2922I", t: 20, label: "Rainey introduces Transaction Denied, her book on Big Finance's power to punish speech. The episode connects payment access, journalism, whistleblowers, privacy, and bitcoin's promise and limits as a censorship-resistant tool." }], // 0:20
  },
  {
    name: "Free speech and payments",
    keywords: ["free speech payments", "financial censorship speech", "lawful speech banking", "payments and speech"],
    picks: [{ youtube_id: "ysPxfA2922I", t: 218, label: "The conversation links payments to speech: if lawful expression can get someone removed from banking or payment rails, financial infrastructure becomes a private censorship layer." }], // 3:38
  },
  {
    name: "Bitcoin as censorship resistance",
    keywords: ["bitcoin censorship resistance", "financial censorship bitcoin", "payments censorship", "transaction denied bitcoin"],
    picks: [{ youtube_id: "ysPxfA2922I", t: 46, label: "Rainey approaches bitcoin from a civil-liberties angle: it can help resist financial censorship, but the interview is careful about both its promise and the limits users face in practice." }], // 0:46
  },
  {
    name: "Digital capital",
    keywords: ["digital capital", "saylor digital capital", "bitcoin digital capital", "credit currency capital"],
    picks: [{ youtube_id: "PIVWyjihxnA", t: 105, label: "Michael Saylor frames bitcoin as digital capital that can sit beneath new layers of credit and currency. The interview connects corporate adoption, banks, and AI-era financial products to that base-layer thesis." }], // 1:45
  },
  {
    name: "Bitcoin for AI agents",
    keywords: ["bitcoin ai agents", "agents need money", "ai agents transact", "digital capital agents"],
    picks: [{ youtube_id: "PIVWyjihxnA", t: 802, label: "Saylor argues that autonomous agents will need to transact constantly with digital capital, making bitcoin more important in an AI-shaped economy rather than less." }], // 13:22
  },
  {
    name: "AI-built financial instruments",
    keywords: ["ai financial instruments", "ai-built credit", "stretch strc", "strategy ai"],
    picks: [{ youtube_id: "PIVWyjihxnA", t: 529, label: "Saylor points to Strategy's use of AI in creating digital credit products such as Stretch, suggesting that AI will accelerate the design and distribution of bitcoin-backed financial instruments." }], // 8:49
  },
  {
    name: "Career advice",
    keywords: ["career advice ai", "learn ai tools", "builders ai", "young people ai"],
    picks: [{ youtube_id: "PIVWyjihxnA", t: 920, label: "Saylor's advice to builders and young people is to spend serious time learning AI tools, keep creating, and use this unusually fertile period to build something useful." }], // 15:20
  },
  {
    name: "Bitcoin venture capital",
    keywords: ["bitcoin venture capital", "ego death capital", "bitcoin-only venture", "bitcoin startups"],
    picks: [{ youtube_id: "9lcCIsy7uxg", t: 11, label: "Andi Pitt discusses bitcoin-only venture through Ego Death Capital, including how the funding landscape has changed and what investors look for in founders building with or for bitcoin." }], // 0:11
  },
  {
    name: "Founder evaluation",
    keywords: ["founder evaluation", "bitcoin founders", "what investors look for", "startup advice"],
    picks: [{ youtube_id: "9lcCIsy7uxg", t: 269, label: "Andi explains that Ego Death looks for founders using bitcoin or building for bitcoin, across pre-seed through Series A. The broader lesson is that founder quality matters as much as the category." }], // 4:29
  },
  {
    name: "Cognitive sovereignty",
    keywords: ["cognitive sovereignty", "mind control", "ai individual rights", "clyra passages"],
    picks: [{ youtube_id: "9lcCIsy7uxg", t: 21, label: "Beyond venture, Andi introduces her research on mind control and cognitive sovereignty. The topic bridges bitcoin, AI, individual rights, and the question of who controls attention and thought." }], // 0:21
  },
  {
    name: "Maple AI",
    keywords: ["maple ai", "signal of ai", "privacy-first ai", "mark suman"],
    picks: [{ youtube_id: "uEddWDEw_gg", t: 10, label: "Mark Suman presents Maple AI as a privacy-first AI chat platform, described as the Signal of AI. It aims to offer a familiar ChatGPT-like experience while moving privacy closer to local AI." }], // 0:10
  },
  {
    name: "Secure enclaves",
    keywords: ["secure enclaves", "open secret", "hardware encryption", "cloud privacy"],
    picks: [{ youtube_id: "uEddWDEw_gg", t: 204, label: "Mark explains how Open Secret uses secure enclaves to provide per-user encryption in the cloud, giving app developers a path toward private AI without forcing every user to run models locally." }], // 3:24
  },
  {
    name: "Verifiable AI",
    keywords: ["verifiable ai", "ai verifiability", "data routing", "open secret"],
    picks: [{ youtube_id: "uEddWDEw_gg", t: 924, label: "Mark argues that AI services need verifiability so users know where their data is routed and how it is processed. The goal is to resist surveillance, censorship, and top-down control hidden inside AI stacks." }], // 15:24
  },
  {
    name: "AI in schools",
    keywords: ["ai in schools", "school ai", "ai bias education", "students ai"],
    picks: [{ youtube_id: "uEddWDEw_gg", t: 1171, label: "Mark warns that AI being assigned in schools deserves scrutiny: parents and educators should ask which AI systems students use, what biases they contain, and what children learn from them." }], // 19:31
  },
  {
    name: "Chaincode BOSS Challenge",
    keywords: ["chaincode boss challenge", "boss challenge", "bitcoin core contributor", "chaincode labs"],
    picks: [{ youtube_id: "YmxDES6VfZY", t: 17, label: "David Gumberg explains how completing the Chaincode BOSS Challenge helped move him from curiosity into full-time Bitcoin Core contribution, supported by OpenSats grants and Localhost Research." }], // 0:17
  },
  {
    name: "Bitcoin Core contribution",
    keywords: ["bitcoin core contribution", "bitcoin core contributor", "localhost research", "open sats grant"],
    picks: [{ youtube_id: "YmxDES6VfZY", t: 797, label: "David describes working full time on Bitcoin Core after BOSS and OpenSats support. The episode makes the pathway into protocol contribution concrete rather than mysterious." }], // 13:17
  },
  {
    name: "Compact Block Relay",
    keywords: ["compact block relay", "block propagation", "bitcoin core latency", "compact blocks"],
    picks: [{ youtube_id: "YmxDES6VfZY", t: 805, label: "David's current Bitcoin Core work focuses on Compact Block Relay and block propagation. Improving relay performance can reduce latency and make mining fairer for smaller miners." }], // 13:25
  },
  {
    name: "Mining latency",
    keywords: ["mining latency", "block propagation latency", "fair mining", "small miners latency"],
    picks: [{ youtube_id: "YmxDES6VfZY", t: 1050, label: "David explains latency in block propagation as a centralizing force: larger miners benefit if blocks propagate unevenly, so relay improvements can make expected rewards better match hash-rate share." }], // 17:30
  },
  {
    name: "Bitcoin Park",
    keywords: ["bitcoin park", "nashville bitcoin park", "rod roudi", "bitcoin events"],
    picks: [{ youtube_id: "-l-gvaZM5BM", t: 104, label: "Rod Roudi describes Bitcoin Park as a physical community hub where events, policy conversations, founders, developers, and bitcoin-curious locals can meet in person." }], // 1:44
  },
  {
    name: "Bitcoin events",
    keywords: ["bitcoin events", "in-person bitcoin", "bitcoin community events", "bitcoin park"],
    picks: [{ youtube_id: "-l-gvaZM5BM", t: 219, label: "Rod traces Bitcoin Park's origin story and why in-person energy matters. The episode treats events as infrastructure for trust, learning, and local bitcoin culture." }], // 3:39
  },
  {
    name: "Bitcoin policymakers",
    keywords: ["bitcoin policymakers", "local policymakers", "bitcoin policy community", "bitcoin park policy"],
    picks: [{ youtube_id: "-l-gvaZM5BM", t: 428, label: "Rod discusses engaging policymakers and the local community through Bitcoin Park, showing how physical bitcoin spaces can bridge technical, civic, founder, and newcomer audiences." }], // 7:08
  },
  {
    name: "Pink Owl Coffee",
    keywords: ["pink owl coffee", "joe carlo", "square merchant", "coffee bitcoin"],
    picks: [{ youtube_id: "WR-rnDP0MVg", t: 0, label: "Joe Carlo tells the story of Pink Owl Coffee, an early Square merchant using bitcoin inside a real small business across multiple Bay Area locations." }], // 0:00
  },
  {
    name: "Small business bitcoin savings",
    keywords: ["small business bitcoin savings", "convert sales to bitcoin", "square bitcoin savings", "business savings bitcoin"],
    picks: [{ youtube_id: "WR-rnDP0MVg", t: 214, label: "Pink Owl has converted a percentage of sales into bitcoin for years, treating bitcoin as a long-term savings strategy for a local business rather than just a checkout novelty." }], // 3:34
  },
  {
    name: "Square Bitcoin payments",
    keywords: ["square bitcoin payments", "square merchants bitcoin", "accepting bitcoin square", "cash app merchants"],
    picks: [{ youtube_id: "WR-rnDP0MVg", t: 334, label: "Joe discusses Pink Owl joining Square's beta to accept bitcoin payments directly, ahead of public launch. The segment grounds merchant adoption in an actual cafe workflow." }], // 5:34
  },
  {
    name: "Bitcoin merchant education",
    keywords: ["bitcoin merchant education", "staff customer education", "merchant bitcoin training", "pink owl bitcoin"],
    picks: [{ youtube_id: "WR-rnDP0MVg", t: 457, label: "Pink Owl's bitcoin rollout includes educating staff and customers on what it means to pay and save in bitcoin, showing that merchant adoption is an operations and communication problem too." }], // 7:37
  },
  {
    name: "Save Our Wallets",
    keywords: ["save our wallets", "satoshi needs you", "clarity act", "section 109"],
    picks: [{ youtube_id: "hBYqHpTAvfw", t: 246, label: "Kyle Olney explains Save Our Wallets as a coalition fighting for Section 109 language in the Clarity Act, with the goal of protecting open-source developers and the right to self-custody." }], // 4:06
  },
  {
    name: "Clarity Act",
    keywords: ["clarity act", "brca", "section 109", "bitcoin policy"],
    picks: [{ youtube_id: "hBYqHpTAvfw", t: 346, label: "Kyle walks through the Clarity Act and BRCA language, explaining how small legislative differences could either protect or endanger open-source bitcoin developers." }], // 5:46
  },
  {
    name: "Satoshi Needs You",
    keywords: ["satoshi needs you", "bitcoin call to action", "save our wallets", "bitcoin advocacy"],
    picks: [{ youtube_id: "hBYqHpTAvfw", t: 989, label: "The Satoshi Needs You campaign turns bitcoin policy into a national call to action, asking ordinary bitcoiners to defend self-custody and open-source development rather than assume someone else will." }], // 16:29
  },
  {
    name: "Moneydevkit (MDK)",
    keywords: ["money dev kit", "moneydevkit", "mdk", "developer payments bitcoin"],
    picks: [{ youtube_id: "WJl-b8jmK4A", t: 37, label: "Nick Slaney introduces Money Dev Kit, a startup building tools that make it easier for developers to add bitcoin and Lightning payments to applications." }], // 0:37
  },
  {
    name: "Lightning service providers",
    keywords: ["lightning service provider", "lsp", "lightning liquidity", "money dev kit"],
    picks: [{ youtube_id: "WJl-b8jmK4A", t: 238, label: "Nick explains Lightning service providers as a way to get liquidity to users who need it, improving the usability of Lightning wallets and applications." }], // 3:58
  },
  {
    name: "Bitcoin vs. stablecoins",
    keywords: ["bitcoin over stablecoins", "stablecoins vs bitcoin", "bitcoin payments stablecoins", "money dev kit stablecoins"],
    picks: [{ youtube_id: "WJl-b8jmK4A", t: 0, label: "Nick's Money Dev Kit interview is framed around why he is betting on bitcoin over stablecoins for developer payment tools, despite stablecoins' current mindshare." }], // 0:00
  },
  {
    name: "Ecash design",
    keywords: ["ecash design", "cashu ux", "bitcoin ecash", "ecash privacy"],
    picks: [{ youtube_id: "1mDxk-P8uzA", t: 14, label: "Erik Cativo introduces his work on bitcoin and ecash UX, focusing on making private money tools feel intuitive, social, and usable rather than abstract." }], // 0:14
  },
  {
    name: "Bump-to-pay",
    keywords: ["bump to pay", "bump ux", "nfc bitcoin", "bitchat invite"],
    picks: [{ youtube_id: "1mDxk-P8uzA", t: 355, label: "Erik describes bump-style UX for bitcoin and Bitchat interactions: local, tactile, Apple Pay-like flows that make private tools feel simple and fun." }], // 5:55
  },
  {
    name: "Cashless society",
    keywords: ["cashless society", "cashless sweden", "bank id", "surveilled payments"],
    picks: [{ youtube_id: "1mDxk-P8uzA", t: 1025, label: "Erik uses Sweden's cashless society as a warning about centralized payment systems, surveillance, and why digital money needs privacy-preserving design." }], // 17:05
  },
  {
    name: "Bitcoin brand creative",
    keywords: ["bitcoin brand creative", "bitcoin artists", "bitcoin design culture", "kyle fletcher"],
    picks: [{ youtube_id: "NMSdRmyoMU8", t: 61, label: "Kyle Fletcher discusses the state of bitcoin brand creative and why artists, designers, and culture builders matter for bitcoin's future as much as engineering does." }], // 1:01
  },
  {
    name: "Local circular economies",
    keywords: ["local circular economies", "future money design", "local bitcoin economy", "creative communities bitcoin"],
    picks: [{ youtube_id: "NMSdRmyoMU8", t: 179, label: "Kyle frames future-money design through local and circular economies, where merchants, artists, and communities can make bitcoin tangible instead of abstract." }], // 2:59
  },
  {
    name: "Sats vs. bitcoin display",
    keywords: ["sats vs bitcoin", "bip 177", "bitcoin denomination", "bitcoin display"],
    picks: [{ youtube_id: "NMSdRmyoMU8", t: 499, label: "Kyle discusses the sats versus bitcoin denomination debate as a design problem: naming and display choices shape whether bitcoin feels understandable to mainstream users." }], // 8:19
  },
  {
    name: "Bitcoin art",
    keywords: ["bitcoin art", "bitcoin art galleries", "artists and bitcoin", "bitcoin philanthropy"],
    picks: [{ youtube_id: "NMSdRmyoMU8", t: 1072, label: "Kyle's dream projects include bitcoin art galleries and philanthropy, pointing to creative communities as a route for cultural adoption." }], // 17:52
  },
  {
    name: "Bitcoin Design Community",
    keywords: ["bitcoin design community", "bitcoin design foundation", "designers bitcoin", "open source design"],
    picks: [
      { youtube_id: "c2cOGZWQHxg", t: 400, label: "Christoph Ono explains how newcomers can join the Bitcoin Design Community and contribute to open design work, even without being protocol developers." }, // 6:40
      { youtube_id: "-1Ha6XCQiE4", t: 95, label: "Mogashni Naidoo describes the Bitcoin Design Foundation and Design Community as support structures for builders who need research, UX, and design help." }, // 1:35
    ],
  },
  {
    name: "Bitcoin Core wallet redesign",
    keywords: ["bitcoin core wallet redesign", "bitcoin core wallet ux", "redesigning bitcoin core", "core wallet"],
    picks: [{ youtube_id: "c2cOGZWQHxg", t: 524, label: "Christoph discusses redesigning Bitcoin Core's original wallet, using design work to make foundational bitcoin software more approachable without compromising its values." }], // 8:44
  },
  {
    name: "Making bitcoin magical",
    keywords: ["making bitcoin magical", "bitcoin magic ux", "bitcoin design magic", "bitcoin user experience"],
    picks: [{ youtube_id: "c2cOGZWQHxg", t: 1383, label: "Christoph's closing theme is making bitcoin feel magical: good design can make powerful monetary technology feel intuitive, joyful, and worth sharing." }], // 23:03
  },
  {
    name: "Spiral grants",
    keywords: ["spiral grants", "spiral grantee", "bitcoin grant program", "bitcoin contributors"],
    picks: [{ youtube_id: "6Gnd5qavyLg", t: 93, label: "Conor Okus describes going from Spiral grantee to full-time product manager, and explains what Spiral looks for when supporting bitcoin contributors." }], // 1:33
  },
  {
    name: "Easy bitcoin addresses",
    keywords: ["easy bitcoin addresses", "human bitcoin addresses", "bolt12 ux", "bitcoin address ux"],
    picks: [{ youtube_id: "6Gnd5qavyLg", t: 505, label: "Conor discusses easy bitcoin addresses, BOLT12, and UX work aimed at making bitcoin payments feel less like infrastructure and more like a normal product." }], // 8:25
  },
  {
    name: "AI and Lightning payments",
    keywords: ["ai lightning payments", "ai bitcoin payments", "micro transactions ai", "agent payments lightning"],
    picks: [{ youtube_id: "6Gnd5qavyLg", t: 878, label: "Conor explores how AI could use bitcoin and Lightning for payments and microtransactions, turning open payment rails into infrastructure for software agents." }], // 14:38
  },
  {
    name: "Bitcoin UX research",
    keywords: ["bitcoin ux research", "ux research toolkit", "bitcoin design sidekick", "ai design tools"],
    picks: [{ youtube_id: "-1Ha6XCQiE4", t: 471, label: "Mo Naidoo presents her project to unify bitcoin UX research and use AI to build design tools, including the idea of a Bitcoin Design Sidekick." }], // 7:51
  },
  {
    name: "Bitcoin design for activists",
    keywords: ["bitcoin design activists", "unbanked ux", "activist bitcoin ux", "bitcoin design human rights"],
    picks: [{ youtube_id: "-1Ha6XCQiE4", t: 892, label: "Mo argues that better bitcoin design can empower activists, unbanked users, and everyday people who cannot afford clunky, expert-only tools." }], // 14:52
  },
  {
    name: "Bitcoin policy",
    keywords: ["bitcoin policy", "bitcoin policy institute", "washington dc bitcoin", "matthew pines"],
    picks: [{ youtube_id: "1afaot3nJ9Y", t: 210, label: "Matthew Pines discusses bitcoin's growing role in U.S. policy and the Washington DC bitcoin scene, where bitcoin is increasingly treated as a strategic asset." }], // 3:30
  },
  {
    name: "Bitcoin as strategic asset",
    keywords: ["bitcoin strategic asset", "strategic bitcoin", "policy strategic asset", "bitcoin reserves"],
    picks: [{ youtube_id: "1afaot3nJ9Y", t: 227, label: "Matthew describes shifting policy conversations where bitcoin is framed less as a fringe technology and more as a strategic asset relevant to national policy." }], // 3:47
  },
  {
    name: "Bitcoin standard",
    keywords: ["bitcoin standard", "world on bitcoin standard", "bitcoin policy future", "global monetary order"],
    picks: [{ youtube_id: "1afaot3nJ9Y", t: 426, label: "Matthew sketches what a bitcoin standard world could look like and how policy, institutional adoption, and individual agency interact during the transition." }], // 7:06
  },
  {
    name: "Lifeboat",
    keywords: ["lifeboat", "tadge dryja", "commit reveal quantum", "quantum lifeboat"],
    picks: [{ youtube_id: "hRRZTX4D_iI", t: 142, label: "Tadge Dryja explains Lifeboat, a commit-reveal scheme for protecting coins if quantum computers become a serious threat to bitcoin signatures." }], // 2:22
  },
  {
    name: "Quantum complacency",
    keywords: ["quantum complacency", "post-quantum readiness", "bitcoin quantum risk", "scalability fees quantum"],
    picks: [{ youtube_id: "hRRZTX4D_iI", t: 47, label: "Tadge warns against complacency despite bitcoin's high price, pointing to scalability, fees, and post-quantum readiness as unresolved work." }], // 0:47
  },
  {
    name: "Bitcoin developer onboarding",
    keywords: ["bitcoin developer onboarding", "new bitcoin developers", "developer stigma", "bitcoin contributor pipeline"],
    picks: [{ youtube_id: "hRRZTX4D_iI", t: 633, label: "Tadge discusses the challenge of bringing new developers into bitcoin, including political stigma and the need to keep the community open to diverse contributors." }], // 10:33
  },
  {
    name: "Bitcoin client diversity",
    keywords: ["bitcoin client diversity", "multiple full node implementations", "bip39 bitcoin core", "bitcoin core usability"],
    picks: [{ youtube_id: "hRRZTX4D_iI", t: 981, label: "Tadge's dream usability improvements include BIP39 support in Bitcoin Core and more client diversity through multiple full-node implementations." }], // 16:21
  },
  {
    name: "Bitcoin ossification",
    keywords: ["bitcoin ossification", "protocol evolution", "lopp ossification", "bitcoin protocol changes"],
    picks: [{ youtube_id: "NAXGVZLrCwc", t: 51, label: "Jameson Lopp names ossification, quantum threats, and protocol evolution as top-of-mind questions for bitcoin's future." }], // 0:51
  },
  {
    name: "Quantum Bitcoin Improvement Proposal",
    keywords: ["quantum bip", "quantum bitcoin improvement proposal", "lopp quantum proposal", "quantum vulnerable coins"],
    picks: [{ youtube_id: "NAXGVZLrCwc", t: 104, label: "Lopp outlines his quantum Bitcoin Improvement Proposal and the hard policy questions around quantum-vulnerable coins." }], // 1:44
  },
  {
    name: "Paper bitcoin",
    keywords: ["paper bitcoin", "custodial bitcoin claims", "sovereign future", "bitcoin custody risk"],
    picks: [{ youtube_id: "NAXGVZLrCwc", t: 715, label: "Lopp's sovereign-future answer includes concern about paper bitcoin trends, where custodial claims can pull users away from actual self-sovereign ownership." }], // 11:55
  },
  {
    name: "Dynamic block sizes",
    keywords: ["dynamic block sizes", "lopp block size", "bitcoin block size", "quantum vulnerable coins"],
    picks: [{ youtube_id: "NAXGVZLrCwc", t: 1002, label: "Lopp shares two controversial ideas: cutting off quantum-vulnerable coins and using dynamic block sizes, showing how protocol debates can connect security, economics, and governance." }], // 16:42
  },
  {
    name: "Project Eleven",
    keywords: ["project eleven", "alex pruden", "quantum cryptography", "qday"],
    picks: [{ youtube_id: "C8NLSPDgu2c", t: 102, label: "Alex Pruden introduces Project Eleven as an applied R&D lab at the intersection of quantum computing and cryptography, focused on future-proofing bitcoin." }], // 1:42
  },
  {
    name: "Quantum-resistant Bitcoin",
    keywords: ["quantum-resistant bitcoin", "future-proofing bitcoin", "quantum resistance", "project eleven"],
    picks: [{ youtube_id: "C8NLSPDgu2c", t: 166, label: "Alex explains what it means for bitcoin to become quantum-resistant and why future-proofing requires work before a crisis arrives." }], // 2:46
  },
  {
    name: "AI and cryptography",
    keywords: ["ai cryptography", "cryptography ai", "ai and crypto research", "project eleven"],
    picks: [{ youtube_id: "C8NLSPDgu2c", t: 290, label: "Alex discusses AI and cryptography as overlapping research fronts, where new tools can help but do not replace deep technical understanding." }], // 4:50
  },
  {
    name: "Zero-knowledge on Bitcoin",
    keywords: ["zero-knowledge on bitcoin", "zk bitcoin", "zero knowledge bitcoin", "aleo bitcoin"],
    picks: [{ youtube_id: "C8NLSPDgu2c", t: 671, label: "Alex discusses zero-knowledge on bitcoin and the broader question of what privacy, verification, and self-sovereignty should look like in future bitcoin systems." }], // 11:11
  },
  {
    name: "AI for activists",
    keywords: ["ai for activists", "activists ai tools", "human rights ai", "hrf ai"],
    picks: [{ youtube_id: "kva7Cp1zFjQ", t: 226, label: "Alex Gladstein describes how AI tools can empower activists, especially when they lower the cost of communication, research, translation, and coordination." }], // 3:46
  },
  {
    name: "Bitcoin as human rights tool",
    keywords: ["bitcoin human rights tool", "human rights foundation bitcoin", "activists bitcoin", "financial freedom"],
    picks: [{ youtube_id: "kva7Cp1zFjQ", t: 484, label: "Gladstein frames bitcoin as a human rights tool, with practical value for people facing authoritarian controls, financial exclusion, or unstable money." }], // 8:04
  },
  {
    name: "HRF grant program",
    keywords: ["hrf grant program", "human rights foundation grants", "bitcoin grants", "activist bitcoin ux"],
    picks: [{ youtube_id: "kva7Cp1zFjQ", t: 1013, label: "Gladstein shares lessons from HRF's grant program, including the UX hurdles activists face and the types of bitcoin tools that matter most in adversarial environments." }], // 16:53
  },
  {
    name: "Block custody",
    keywords: ["block custody", "bitkey custody", "cash app custody", "block bitcoin custody"],
    picks: [{ youtube_id: "svN_Q71EsrI", t: 179, label: "Ryan Loomba explains Block's approach to custody across products, grounding self-custody and user experience in real engineering tradeoffs." }], // 2:59
  },
  {
    name: "Open-source software",
    keywords: ["open-source software", "bitcoin open-source", "block open source", "developer contribution"],
    picks: [{ youtube_id: "svN_Q71EsrI", t: 459, label: "Ryan discusses using open-source software inside bitcoin products and why new developers should learn AI tools while contributing back to open-source projects." }], // 7:39
  },
  {
    name: "Cash App Lightning",
    keywords: ["cash app lightning", "lightning integration", "cash app bitcoin payments", "block lightning"],
    picks: [{ youtube_id: "svN_Q71EsrI", t: 1214, label: "Ryan discusses Cash App's Lightning integration as part of Block's broader bitcoin payment work, connecting consumer apps to real-world Lightning usage." }], // 20:14
  },
  {
    name: "Presidio Bitcoin membership",
    keywords: ["presidio bitcoin membership", "presidio bitcoin members", "open-source contributors startups builders", "presidio bitcoin space"],
    picks: [{ youtube_id: "ZvlUoR-t6EA", t: 701, label: "Alex Zukauskas describes Presidio Bitcoin's focused membership model, including open-source contributors, startups, and builders working from the space." }], // 11:41
  },
  {
    name: "Presidio Bitcoin recurring events",
    keywords: ["presidio bitcoin recurring events", "bitdevs litdevs builder", "monthly events", "presidio events"],
    picks: [{ youtube_id: "ZvlUoR-t6EA", t: 373, label: "Alex highlights recurring public events at Presidio Bitcoin, including BitDevs, LitDevs, and Builder, as part of the space's community rhythm." }], // 6:13
  },
  {
    name: "Cryptographers in bitcoin",
    keywords: ["cryptographers bitcoin", "cryptographers engage bitcoin", "post-quantum bitcoin", "bitcoin whitepaper cryptographers"],
    picks: [{ youtube_id: "ZC1BT2V2PNU", t: 246, label: "Clara calls for more cryptographers to engage directly with bitcoin and read the whitepaper, especially as post-quantum questions become more urgent." }], // 4:06
  },
  {
    name: "Bitcoin UX like Venmo",
    keywords: ["bitcoin ux venmo", "venmo-like bitcoin", "bitcoin usability", "seamless bitcoin payments"],
    picks: [{ youtube_id: "ZC1BT2V2PNU", t: 501, label: "Clara says bitcoin needs tools as seamless as Venmo if it is going to be used naturally for everyday payments rather than only by enthusiasts." }], // 8:21
  },
  {
    name: "Next-generation Lightning wallets",
    keywords: ["next-generation lightning wallets", "self-custodial lightning wallets", "mutiny wallet", "lightning payments"],
    picks: [{ youtube_id: "yQ-h5DjbePI", t: 358, label: "Ben Carman argues bitcoin needs next-generation Lightning and self-custodial wallets so payments do not collapse into custodial convenience." }], // 5:58
  },
  {
    name: "Bitcoin payments culture",
    keywords: ["bitcoin payments culture", "real-world bitcoin payments", "pay with lightning", "spend bitcoin"],
    picks: [{ youtube_id: "yQ-h5DjbePI", t: 340, label: "Ben critiques the bitcoin community for loving Lightning in theory while often failing to use it in ordinary social payment moments, such as paying friends." }], // 5:40
  },
  {
    name: "Mining pool centralization",
    keywords: ["mining pool centralization", "hardware manufacturing centralization", "block template construction", "mine hackers"],
    picks: [{ youtube_id: "efL8xPVdPUA", t: 240, label: "Stephen DeLorme names centralization risks across mining pools, hardware manufacturing, and block-template construction, motivating hackathon work around miner decentralization." }], // 4:00
  },
  {
    name: "Bolt 12 zaps",
    keywords: ["bolt 12 zaps", "reusable payment requests", "nostr zaps", "voltage bolt 12"],
    picks: [{ youtube_id: "efL8xPVdPUA", t: 691, label: "Stephen discusses Bolt 12 and zaps as payment primitives that can make Lightning requests reusable and social, especially when paired with Nostr." }], // 11:31
  },
  {
    name: "Bitcoin games",
    keywords: ["bitcoin games", "make bitcoin fun", "bitty", "mine hackers", "bitcoin.org game"],
    picks: [{ youtube_id: "efL8xPVdPUA", t: 1184, label: "Stephen connects games, vibe coding, and projects like Bitty to making bitcoin more fun and approachable rather than only educational or ideological." }], // 19:44
  },
  {
    name: "Bitcoin Students Network",
    keywords: ["bitcoin students network", "cornell bitcoin club", "student bitcoin", "ella hough"],
    picks: [{ youtube_id: "-TE7hLn_CRc", t: 72, label: "Ella Hough describes leading bitcoin student work through Cornell and the Bitcoin Students Network, including research into adoption and financial freedom across 25 countries." }], // 1:12
  },
  {
    name: "Bitcoin as language",
    keywords: ["bitcoin as language", "bitcoin linguistics", "protocol for truth", "bitcoin game theory"],
    picks: [{ youtube_id: "-TE7hLn_CRc", t: 440, label: "Ella frames bitcoin through linguistics and game theory: a new protocol for truth and disseminating truth, not only a financial asset." }], // 7:20
  },
  {
    name: "Gen Z Bitcoin adoption",
    keywords: ["gen z bitcoin", "young bitcoiners", "student bitcoin adoption", "bitcoin careers"],
    picks: [{ youtube_id: "-TE7hLn_CRc", t: 309, label: "Ella is optimistic about Gen Z adoption because younger people have the longest time horizon and are actively asking how to learn, build, and work in bitcoin." }], // 5:09
  },
  {
    name: "Student hackathons",
    keywords: ["student hackathons", "bitcoin hackathons", "student proof of work", "hackathon careers"],
    picks: [{ youtube_id: "-TE7hLn_CRc", t: 733, label: "Ella sees hackathons as a strong path for students to build proof of work, make connections, and become more employable in bitcoin." }], // 12:13
  },
  {
    name: "Lightning Labs",
    keywords: ["lightning labs", "laolu osuntokun", "lnd", "roasbeef"],
    picks: [{ youtube_id: "DP0wGXlmmao", t: 0, label: "Laolu Osuntokun, CTO of Lightning Labs and lead developer of LND, discusses Lightning development, adoption, privacy, stablecoins, and bitcoin payment UX." }], // 0:00
  },
  {
    name: "LND",
    keywords: ["lnd", "lightning implementation", "lightning labs lnd", "roasbeef"],
    picks: [{ youtube_id: "DP0wGXlmmao", t: 0, label: "The Laolu interview centers on LND, one of the major Lightning implementations, and the ongoing work to improve reliability, privacy, and usability." }], // 0:00
  },
  {
    name: "Taproot Assets",
    keywords: ["taproot assets", "lightning labs assets", "stablecoins lightning", "assets on bitcoin"],
    picks: [{ youtube_id: "DP0wGXlmmao", t: 0, label: "Laolu highlights Taproot Assets as part of Lightning Labs' work, including the practical role asset protocols may play in onboarding more people to bitcoin rails." }], // 0:00
  },
  {
    name: "Bitcoin privacy",
    keywords: ["bitcoin privacy", "lightning privacy", "privacy adoption", "bitcoin adoption privacy"],
    picks: [{ youtube_id: "DP0wGXlmmao", t: 473, label: "Laolu reflects on bitcoin adoption and the continuing need for better privacy, including protocol-level improvements that could enable more expressive and private transfers." }], // 7:53
  },
  {
    name: "Bitcoin Design Foundation",
    keywords: ["bitcoin design foundation", "fund open source designers", "daniel nordh", "bitcoin design"],
    picks: [{ youtube_id: "Q-PaXGrRehs", t: 113, label: "Daniel Nordh describes the Bitcoin Design Foundation's mission to fund open-source designers working on bitcoin, complementing developer-focused grant programs." }], // 1:53
  },
  {
    name: "Open-source designers",
    keywords: ["open-source designers", "bitcoin designers", "design grants", "bitcoin ux funding"],
    picks: [{ youtube_id: "Q-PaXGrRehs", t: 193, label: "Daniel explains why bitcoin needs a sustainable design community: open-source projects often start with developers, but designers and researchers are needed to make them usable." }], // 3:13
  },
  {
    name: "MIT Digital Currency Initiative",
    keywords: ["mit digital currency initiative", "mit dci", "neha narula", "digital currency research"],
    picks: [{ youtube_id: "KsCREYVdawg", t: 15, label: "Neha Narula introduces the MIT Digital Currency Initiative, which supports research across cryptocurrency, blockchain technology, and digital currency systems." }], // 0:15
  },
  {
    name: "Lava",
    keywords: ["lava", "lava xyz", "shehzan maredia", "borrow against bitcoin"],
    picks: [{ youtube_id: "RgB-sPf2B44", t: 247, label: "Shehzan Maredia explains Lava's core use case: people want to borrow against bitcoin and make purchases without selling their long-term savings asset." }], // 4:07
  },
  {
    name: "Bitcoin as savings asset",
    keywords: ["bitcoin savings asset", "spending asset savings asset", "store of value phase", "lava bitcoin"],
    picks: [{ youtube_id: "RgB-sPf2B44", t: 147, label: "Shehzan argues bitcoin needs to be adopted as a savings asset before it can become a spending asset; the store-of-value phase comes first." }], // 2:27
  },
  {
    name: "Bitcoin failure mitigation",
    keywords: ["bitcoin failure mitigation", "bitcoin core reliable", "node operation", "mining centralization"],
    picks: [{ youtube_id: "RgB-sPf2B44", t: 340, label: "Shehzan says mitigating bitcoin failure means keeping Bitcoin Core reliable, running enough nodes, addressing mining centralization, and keeping access to bitcoin broad." }], // 5:40
  },
  {
    name: "Bitcoin Bond Company",
    keywords: ["bitcoin bond company", "pierre rochard", "bitcoin bonds", "riot research"],
    picks: [{ youtube_id: "pjix9O2kQ3k", t: 0, label: "Pierre Rochard discusses launching The Bitcoin Bond Company and brings a researcher's view of bitcoin's payments, savings, institutional adoption, and security-budget debates." }], // 0:00
  },
  {
    name: "Bitcoin payments and savings",
    keywords: ["bitcoin payments and savings", "bitcoin utilities", "payments savings tension", "bitcoin cultural tension"],
    picks: [{ youtube_id: "pjix9O2kQ3k", t: 171, label: "Pierre frames bitcoin's two fundamental utilities as payments and savings, with a cultural tension between people emphasizing each use case." }], // 2:51
  },
  {
    name: "Institutional adoption as education",
    keywords: ["institutional adoption education", "educational trojan horse", "bitcoin ethos institutions", "bitcoin institutions"],
    picks: [{ youtube_id: "pjix9O2kQ3k", t: 486, label: "Pierre describes institutional adoption as an educational Trojan horse: it can spread bitcoin's ethos to mainstream audiences without requiring the message to be watered down." }], // 8:06
  },
  {
    name: "Bitcoin security budget",
    keywords: ["bitcoin security budget", "pierre rochard security budget", "bitcoin fees", "miner revenue"],
    picks: [{ youtube_id: "pjix9O2kQ3k", t: 673, label: "Pierre shares controversial thoughts on the security budget, tying bitcoin's long-term miner incentives to the broader question of how payments, savings, and fees evolve." }], // 11:13
  },
  {
    name: "Bitcoin++",
    keywords: ["bitcoin++", "btcplusplus", "niftynei", "bitcoin developer conference"],
    picks: [{ youtube_id: "M-KlLM-SNfY", t: 95, label: "Niftynei explains Bitcoin++ as a developer conference that helps bitcoiners and new contributors interface around specific technical themes." }], // 1:35
  },
  {
    name: "Incentive engineering",
    keywords: ["incentive engineering", "satoshi incentives", "bitcoin incentives", "decentralized participants"],
    picks: [{ youtube_id: "M-KlLM-SNfY", t: 324, label: "Niftynei emphasizes Satoshi's incentive engineering: bitcoin coordinates decentralized participants by making it rational for them to move in the same direction." }], // 5:24
  },
  {
    name: "Ephemeral anchors",
    keywords: ["ephemeral anchors", "v3 transactions", "replacement by fee rate", "niftynei"],
    picks: [{ youtube_id: "M-KlLM-SNfY", t: 577, label: "Niftynei gets into ephemeral anchors, v3 transactions, and replacement by fee rate, highlighting the kind of transaction-relay work that makes Lightning and bitcoin applications safer." }], // 9:37
  },
  {
    name: "Grassroots bitcoin organizing",
    keywords: ["grassroots bitcoin", "teach friends and family", "bitcoin organizing", "bitcoin++ community"],
    picks: [{ youtube_id: "M-KlLM-SNfY", t: 1071, label: "Niftynei argues for grassroots organizing: bitcoin spreads when people teach friends and family, not only through companies or conferences." }], // 17:51
  },
  {
    name: "Proto",
    keywords: ["proto", "block mining initiative", "jack dorsey mining", "bitcoin mining decentralization"],
    picks: [{ youtube_id: "0PaV_6vjkXI", t: 166, label: "Jack Dorsey discusses Block's mining initiative, Proto, and the need to decentralize mining hardware and infrastructure." }], // 2:46
  },
  {
    name: "Companies supporting open source",
    keywords: ["companies support open source", "spiral brink hrf opensats", "bitcoin open source ecosystem", "corporate bitcoin support"],
    picks: [{ youtube_id: "0PaV_6vjkXI", t: 548, label: "Jack argues companies can support bitcoin open source by creating their own Spiral-like teams or contributing to groups such as Brink, HRF, and OpenSats." }], // 9:08
  },
  {
    name: "Bitcoin permissionlessness",
    keywords: ["bitcoin permissionless", "permissionless nature", "jack dorsey bitcoin", "use bitcoin magic"],
    picks: [{ youtube_id: "0PaV_6vjkXI", t: 1017, label: "Jack's closing point is bitcoin's permissionless nature: people should enter the space, build, and use bitcoin rather than overthinking from the sidelines." }], // 16:57
  },
  {
    name: "BTCPay Server",
    keywords: ["btcpay server", "rockstar dev", "bitcoin payments open source", "merchant bitcoin"],
    picks: [{ youtube_id: "ZNZ-fSYETU8", t: 0, label: "Rockstar Dev introduces BTCPay Server as one of bitcoin's most important open-source merchant tools, with the episode linking payments, open-source work, and real adoption." }], // 0:00
  },
  {
    name: "Hyperinflation stories",
    keywords: ["hyperinflation stories", "rockstar dev hyperinflation", "fiat failure", "bitcoin origin story"],
    picks: [{ youtube_id: "ZNZ-fSYETU8", t: 237, label: "Rockstar Dev's origin story starts with growing up around hyperinflation, making fiat failure a lived experience rather than an abstract monetary argument." }], // 3:57
  },
  {
    name: "Physical Bitcoin spaces",
    keywords: ["physical bitcoin spaces", "presidio bitcoin physical space", "bitcoin community space", "real connection"],
    picks: [{ youtube_id: "ZNZ-fSYETU8", t: 880, label: "Rockstar Dev highlights physical bitcoin spaces like Presidio Bitcoin as important as technology advances and people seek real connection alongside digital tools." }], // 14:40
  },
]);

addTopicDefs([
  {
    name: "21 in 21",
    keywords: ["21 in 21", "rapid-fire bitcoin q&a", "haley berkoe", "bitcoin interview"],
    picks: [{ youtube_id: "ZNZ-fSYETU8", t: 0, label: "21 in 21 starts as a rapid-fire interview format for builders, designers, researchers, founders, advocates, and bitcoin culture-shapers passing through Presidio Bitcoin." }], // 0:00
  },
  {
    name: "Hack-Nation",
    keywords: ["hack-nation", "hack nation", "ai hackathon", "linn bieske"],
    picks: [{ youtube_id: "V1-KjT3brmQ", t: 0, label: "Linn Bieske introduces Hack-Nation as an AI builder community and hackathon format focused on collaboration, durable projects, and giving AI builders a place to turn experiments into something longer-lived than a weekend sprint." }], // 0:00
  },
  {
    name: "AI hackathons",
    keywords: ["ai hackathon", "hackathon community", "ai builders", "proof of work"],
    picks: [
      { youtube_id: "V1-KjT3brmQ", t: 0, label: "Hack-Nation is framed as a way to organize AI builders around challenges, community, and collaboration rather than one-off demos. Spiral's sponsored challenge asks what becomes possible when AI agents can earn using Lightning." }, // 0:00
      { youtube_id: "-TE7hLn_CRc", t: 0, label: "Ella Hough highlights hackathons as a way for students to build proof of work, make connections, and become more employable inside the bitcoin ecosystem." }, // 0:00
    ],
  },
  {
    name: "AI agents earning bitcoin",
    keywords: ["ai agents earn bitcoin", "agents earning", "lightning agents", "ai lightning challenge"],
    picks: [{ youtube_id: "V1-KjT3brmQ", t: 0, label: "Spiral's Hack-Nation challenge centers on AI agents earning over the Lightning Network, turning agent payments from an abstract thesis into a concrete builder prompt." }], // 0:00
  },
  {
    name: "Financial censorship",
    keywords: ["financial censorship", "transaction denied", "bank account frozen", "payment denied"],
    picks: [{ youtube_id: "ysPxfA2922I", t: 0, label: "Rainey Reitman explains how lawful speech can still trigger frozen accounts, denied payments, and exclusion from the financial system, making financial censorship a civil-liberties problem rather than only a payments issue." }], // 0:00
  },
  {
    name: "Transaction Denied",
    keywords: ["transaction denied", "big finance power", "rainey reitman", "financial censorship book"],
    picks: [{ youtube_id: "ysPxfA2922I", t: 0, label: "Rainey Reitman's Transaction Denied is introduced as a book about Big Finance's power to punish speech, tying banking access, payment rails, surveillance, journalism, whistleblowers, and bitcoin's censorship-resistance promise together." }], // 0:00
  },
  {
    name: "Journalism and financial censorship",
    keywords: ["journalism financial censorship", "whistleblowers", "freedom of the press", "payment censorship"],
    picks: [{ youtube_id: "ysPxfA2922I", t: 0, label: "Rainey connects financial censorship to journalism and whistleblowers: payment denial and account freezes can become pressure points against lawful speech even when no formal speech ban exists." }], // 0:00
  },
  {
    name: "Bitcoin censorship resistance",
    keywords: ["bitcoin censorship resistance", "censorship-resistant tool", "financial censorship", "permissionless money"],
    picks: [{ youtube_id: "ysPxfA2922I", t: 0, label: "Bitcoin is discussed as a censorship-resistant tool with real promise but also practical limits: it can reduce dependence on gatekept payment rails, but does not automatically solve every access, privacy, or usability problem." }], // 0:00
  },
  {
    name: "Digital capital",
    keywords: ["digital capital", "saylor digital capital", "bitcoin capital", "capital beneath credit"],
    picks: [{ youtube_id: "PIVWyjihxnA", t: 0, label: "Michael Saylor describes bitcoin as digital capital beneath new layers of credit and currency, with 2026 framed as a turning point for bitcoin's institutional and product evolution." }], // 0:00
  },
  {
    name: "AI agents and bitcoin",
    keywords: ["ai agents bitcoin", "autonomous agents bitcoin", "agents transact", "digital capital ai"],
    picks: [
      { youtube_id: "PIVWyjihxnA", t: 0, label: "Saylor argues AI makes bitcoin more important because autonomous agents will need to transact constantly with durable digital capital." }, // 0:00
      { youtube_id: "6Gnd5qavyLg", t: 878, label: "Conor Okus connects AI agents to bitcoin payments and microtransactions, pointing to Lightning as a natural rail for machine-to-machine value transfer." }, // 14:38
    ],
  },
  {
    name: "Bitcoin credit products",
    keywords: ["bitcoin credit products", "strc", "stretch", "digital credit", "bitcoin credit"],
    picks: [{ youtube_id: "PIVWyjihxnA", t: 0, label: "Saylor points to Strategy's AI-assisted digital credit products such as Stretch and STRC as examples of bitcoin moving from treasury asset into a broader capital-to-credit product stack." }], // 0:00
  },
  {
    name: "Builder advice",
    keywords: ["builder advice", "advice for builders", "learn ai tools", "build something useful"],
    picks: [
      { youtube_id: "PIVWyjihxnA", t: 0, label: "Saylor tells builders and young people to spend serious time learning AI tools and continually push themselves to create something useful in one of the most fertile building periods he has seen." }, // 0:00
      { youtube_id: "C8NLSPDgu2c", t: 1262, label: "Alex Pruden's closing advice is to celebrate bitcoin's progress but keep contributing: the price does not equal success, and future-proofing the system still requires builders." }, // 21:02
    ],
  },
  {
    name: "Bitcoin venture capital",
    keywords: ["bitcoin venture", "ego death capital", "bitcoin startups", "funding landscape"],
    picks: [{ youtube_id: "9lcCIsy7uxg", t: 0, label: "Andi Pitt discusses the rise of new bitcoin startups, how the funding landscape has changed, and what venture investors look for in founders building around bitcoin." }], // 0:00
  },
  {
    name: "Cognitive sovereignty",
    keywords: ["cognitive sovereignty", "mind control", "ai individual rights", "andi pitt"],
    picks: [{ youtube_id: "9lcCIsy7uxg", t: 0, label: "Andi Pitt extends the bitcoin sovereignty frame into cognitive sovereignty, connecting venture, AI, individual rights, and research into mind control." }], // 0:00
  },
  {
    name: "Privacy-first AI",
    keywords: ["privacy-first ai", "private ai", "signal of ai", "ai privacy"],
    picks: [{ youtube_id: "uEddWDEw_gg", t: 0, label: "Mark Suman presents privacy-first AI as a product category: a ChatGPT-like experience that preserves user privacy as much as possible without making users run frontier models locally." }], // 0:00
  },
  {
    name: "Maple AI",
    keywords: ["maple ai", "trymaple", "signal of ai", "mark suman"],
    picks: [{ youtube_id: "uEddWDEw_gg", t: 0, label: "Maple AI is described as the 'Signal of AI,' using secure enclaves and verifiability to offer a familiar AI chat experience with stronger privacy guarantees." }], // 0:00
  },
  {
    name: "Secure enclaves",
    keywords: ["secure enclaves", "enclave ai", "verifiable ai", "private ai"],
    picks: [{ youtube_id: "uEddWDEw_gg", t: 0, label: "Mark explains secure enclaves as Maple AI's path toward local-like privacy in a cloud product, with verifiability doing the trust work that ordinary hosted AI lacks." }], // 0:00
  },
  {
    name: "Thought privacy",
    keywords: ["thought privacy", "ai privacy", "private prompts", "mental privacy"],
    picks: [{ youtube_id: "uEddWDEw_gg", t: 0, label: "Thought privacy becomes the core AI privacy concern: as people use AI for intimate questions and reasoning, prompts and model interactions become sensitive enough to deserve bitcoin-like privacy thinking." }], // 0:00
  },
  {
    name: "AI in schools",
    keywords: ["ai in schools", "ai education scrutiny", "students ai privacy", "school ai"],
    picks: [{ youtube_id: "uEddWDEw_gg", t: 0, label: "Mark argues AI in schools deserves scrutiny because student use mixes education, surveillance, privacy, and dependency questions before social norms have caught up." }], // 0:00
  },
  {
    name: "Chaincode BOSS Challenge",
    keywords: ["chaincode boss challenge", "boss challenge", "bitcoin core contributor", "chaincode labs"],
    picks: [{ youtube_id: "YmxDES6VfZY", t: 0, label: "David Gumberg explains how the Chaincode BOSS Challenge helped him move from bitcoin curiosity to contributing to Bitcoin Core full time." }], // 0:00
  },
  {
    name: "Bitcoin Core contributors",
    keywords: ["bitcoin core contributors", "core contributor", "contributing to bitcoin core", "localhost research"],
    picks: [
      { youtube_id: "YmxDES6VfZY", t: 0, label: "David Gumberg describes the path into Bitcoin Core contribution, including the transition from learning to full-time work at Localhost." }, // 0:00
      { youtube_id: "0PaV_6vjkXI", t: 775, label: "Jack Dorsey shouts out the thankless and anonymous work behind Bitcoin Core, emphasizing that open-source contributors are part of bitcoin's essential infrastructure." }, // 12:55
    ],
  },
  {
    name: "Compact Block Relay",
    keywords: ["compact block relay", "block relay", "bitcoin core latency", "block propagation"],
    picks: [{ youtube_id: "YmxDES6VfZY", t: 0, label: "David's current Bitcoin Core work focuses on Compact Block Relay and block propagation, where shaving latency can improve network health and mining fairness." }], // 0:00
  },
  {
    name: "Block propagation",
    keywords: ["block propagation", "propagation time", "network latency", "compact block relay"],
    picks: [{ youtube_id: "YmxDES6VfZY", t: 0, label: "Block propagation is framed as a practical Core optimization problem: faster relay reduces stale risk and can make the network fairer for smaller miners." }], // 0:00
  },
  {
    name: "Miner fairness",
    keywords: ["miner fairness", "small miners", "stale blocks", "mining fairness"],
    picks: [{ youtube_id: "YmxDES6VfZY", t: 0, label: "David ties relay latency to miner fairness: smaller miners are hurt when blocks propagate slowly, so protocol-level performance work can reduce structural advantages for large miners." }], // 0:00
  },
  {
    name: "Bitcoin Park",
    keywords: ["bitcoin park", "nashville bitcoin", "austin bitcoin", "rod roudi"],
    picks: [{ youtube_id: "-l-gvaZM5BM", t: 104, label: "Rod Roudi explains Bitcoin Park's origins in Nashville and Austin, and why in-person energy helped turn local meetups into hubs for bitcoiners, policymakers, founders, developers, and curious locals." }], // 1:44
  },
  {
    name: "Bitcoin communities",
    keywords: ["bitcoin communities", "bitcoin events", "local bitcoin", "in-person bitcoin"],
    picks: [{ youtube_id: "-l-gvaZM5BM", t: 219, label: "Rod argues in-person communities matter because they compound trust, bring policymakers and builders into the same room, and make bitcoin more tangible than online discourse alone." }], // 3:39
  },
  {
    name: "Bitcoin merchant adoption",
    keywords: ["merchant adoption", "accepting bitcoin", "square bitcoin", "bitcoin business"],
    picks: [
      { youtube_id: "-l-gvaZM5BM", t: 982, label: "Rod focuses on reducing merchant friction as the key to getting more businesses to accept bitcoin, drawing from Bitcoin Park's experience and the business side of payments." }, // 16:22
      { youtube_id: "WR-rnDP0MVg", t: 334, label: "Joe Carlo explains Pink Owl Coffee's move into accepting bitcoin through Square, showing merchant adoption as an operating decision rather than a slogan." }, // 5:34
    ],
  },
  {
    name: "Pink Owl Coffee",
    keywords: ["pink owl coffee", "joe carlo", "square merchant", "coffee bitcoin"],
    picks: [{ youtube_id: "WR-rnDP0MVg", t: 0, label: "Pink Owl Coffee is presented as an early Square merchant that converts a portion of sales into bitcoin and joined Square's beta to accept bitcoin payments directly." }], // 0:00
  },
  {
    name: "Small business bitcoin savings",
    keywords: ["small business bitcoin savings", "business bitcoin savings", "convert sales to bitcoin", "merchant treasury"],
    picks: [{ youtube_id: "WR-rnDP0MVg", t: 214, label: "Joe describes why Pink Owl began converting a portion of sales into bitcoin through Square, treating bitcoin as long-term savings for a small business." }], // 3:34
  },
  {
    name: "Bitcoin staff education",
    keywords: ["staff education bitcoin", "customer education bitcoin", "merchant bitcoin education", "pink owl staff"],
    picks: [{ youtube_id: "WR-rnDP0MVg", t: 457, label: "Pink Owl's rollout includes educating staff and customers on paying and saving in bitcoin, making merchant adoption a frontline communication problem as much as a technical integration." }], // 7:37
  },
  {
    name: "Save Our Wallets",
    keywords: ["save our wallets", "self-custody coalition", "section 109", "clarity act"],
    picks: [{ youtube_id: "hBYqHpTAvfw", t: 246, label: "Kyle Olney explains Save Our Wallets as a coalition defending Section 109 language in the Clarity Act to protect self-custody and open-source software from overly broad regulation." }], // 4:06
  },
  {
    name: "Clarity Act",
    keywords: ["clarity act", "brca", "section 109", "bitcoin policy law"],
    picks: [{ youtube_id: "hBYqHpTAvfw", t: 346, label: "The Clarity Act discussion turns on BRCA and Section 109 language: small legislative wording differences can decide whether open-source bitcoin developers face serious legal risk." }], // 5:46
  },
  {
    name: "Open-source developer protections",
    keywords: ["open-source developer protections", "developer rights", "satoshi needs you", "wallet law"],
    picks: [{ youtube_id: "hBYqHpTAvfw", t: 989, label: "The Satoshi Needs You campaign is framed as a call to protect open-source developers and the right to self-custody before bad legislation accidentally or deliberately criminalizes normal bitcoin software work." }], // 16:29
  },
  {
    name: "Satoshi Needs You",
    keywords: ["satoshi needs you", "save our wallets", "bitcoin advocacy", "open source developers"],
    picks: [{ youtube_id: "hBYqHpTAvfw", t: 989, label: "Satoshi Needs You turns bitcoin policy into a participatory campaign, asking ordinary bitcoiners to defend self-custody and open-source development in the legislative process." }], // 16:29
  },
  {
    name: "Moneydevkit (MDK)",
    keywords: ["moneydevkit", "money dev kit", "mdk", "developer bitcoin payments"],
    picks: [{ youtube_id: "WJl-b8jmK4A", t: 0, label: "Nick Slaney introduces Money Dev Kit as a startup making it easier for developers to add bitcoin and Lightning payments to applications without becoming payment-infrastructure experts." }], // 0:00
  },
  {
    name: "Lightning service providers",
    keywords: ["lightning service providers", "lsp", "lightning usability", "ldk node"],
    picks: [{ youtube_id: "WJl-b8jmK4A", t: 0, label: "Nick explains Lightning service providers as part of the usability layer that makes Lightning practical for apps, drawing on his work at Block, Bitkey, c=, and Money Dev Kit." }], // 0:00
  },
  {
    name: "Bitcoin vs. stablecoins",
    keywords: ["bitcoin vs stablecoins", "stablecoins", "bitcoin payments", "money dev kit"],
    picks: [
      { youtube_id: "WJl-b8jmK4A", t: 0, label: "Nick says he is betting on bitcoin over stablecoins for developer payments, while still recognizing the UX and liquidity problems builders have to solve." }, // 0:00
      { youtube_id: "pjix9O2kQ3k", t: 1111, label: "Pierre Rochard calls stablecoins a useful stopgap for people outside the US without dollar bank accounts, but not the final monetary goal." }, // 18:31
    ],
  },
  {
    name: "Ecash UX",
    keywords: ["ecash ux", "cashu ux", "ecash bitcoin", "private payments"],
    picks: [{ youtube_id: "1mDxk-P8uzA", t: 0, label: "Erik Cativo uses ecash experiments to explore how bitcoin-adjacent payment UX can feel private, intuitive, and fun instead of technical and intimidating." }], // 0:00
  },
  {
    name: "Bitchat",
    keywords: ["bitchat", "bitchat ux", "bitcoin design", "private chat payments"],
    picks: [{ youtube_id: "1mDxk-P8uzA", t: 0, label: "Erik's design experiments with Bitchat show how bitcoin product design can borrow from cash-like and social interactions to make privacy-preserving tools feel natural." }], // 0:00
  },
  {
    name: "Bump-to-pay",
    keywords: ["bump-to-pay", "tap to pay bitcoin", "throw cash", "payment interaction"],
    picks: [{ youtube_id: "1mDxk-P8uzA", t: 0, label: "Bump-to-pay is discussed as a physical, playful interaction pattern for bitcoin payments, part of Erik's broader argument that money UX can be made intuitive and social." }], // 0:00
  },
  {
    name: "Bitcoin design",
    keywords: ["bitcoin design", "design future money", "bitcoin ux", "designers bitcoin"],
    picks: [
      { youtube_id: "NMSdRmyoMU8", t: 175, label: "Kyle Fletcher frames bitcoin design as designing future money for local and circular economies, with artists and designers shaping the culture around adoption." }, // 2:55
      { youtube_id: "c2cOGZWQHxg", t: 171, label: "Christoph Ono argues design plays a critical role in shaping the future of money and making bitcoin feel magical rather than merely correct." }, // 2:51
    ],
  },
  {
    name: "Sats vs. bitcoin denomination",
    keywords: ["sats vs bitcoin", "bip 177", "bitcoin denomination", "₿ display"],
    picks: [
      { youtube_id: "NMSdRmyoMU8", t: 499, label: "Kyle Fletcher discusses the sats-versus-bitcoin denomination debate as a design and culture problem: units change how normal people perceive what they are holding or spending." }, // 8:19
      { youtube_id: "6Gnd5qavyLg", t: 1107, label: "Conor Okus links BIP 177 and the ₿ display debate to mainstream UX: the way wallets present bitcoin units can either clarify or confuse adoption." }, // 18:27
    ],
  },
  {
    name: "Bitcoin Design Community",
    keywords: ["bitcoin design community", "bitcoin design foundation", "designers bitcoin", "open design"],
    picks: [
      { youtube_id: "c2cOGZWQHxg", t: 400, label: "Christoph explains how newcomers can join the Bitcoin Design Community and contribute to open design work without needing to be protocol developers." }, // 6:40
      { youtube_id: "-1Ha6XCQiE4", t: 95, label: "Mo Naidoo describes the Bitcoin Design Foundation and Bitcoin Design Community as support structures for designers working across the bitcoin ecosystem." }, // 1:35
    ],
  },
  {
    name: "Bitcoin Core wallet redesign",
    keywords: ["bitcoin core wallet redesign", "core wallet ux", "bitcoin core design", "wallet redesign"],
    picks: [{ youtube_id: "c2cOGZWQHxg", t: 524, label: "Christoph discusses redesigning Bitcoin Core's original wallet, a project that brings design attention to one of bitcoin's most historically developer-centric interfaces." }], // 8:44
  },
  {
    name: "Designers and developers",
    keywords: ["designers and developers", "bitcoin developers designers", "open-source collaboration", "ux developers"],
    picks: [
      { youtube_id: "c2cOGZWQHxg", t: 711, label: "Christoph emphasizes that bitcoin design works best when designers and developers collaborate instead of treating UX as a layer pasted on after protocol work." }, // 11:51
      { youtube_id: "-1Ha6XCQiE4", t: 326, label: "Mo explains why developers need designers: better bitcoin products require research, empathy, and product thinking alongside engineering." }, // 5:26
    ],
  },
  {
    name: "Spiral grants",
    keywords: ["spiral grants", "spiral grantee", "grant applications", "bitcoin grants"],
    picks: [{ youtube_id: "6Gnd5qavyLg", t: 233, label: "Conor Okus explains what Spiral looks for in grant applications and how grants can turn contributors into full-time bitcoin builders." }], // 3:53
  },
  {
    name: "Bolt 12",
    keywords: ["bolt12", "bolt 12", "easy bitcoin addresses", "bitcoin ux"],
    picks: [{ youtube_id: "6Gnd5qavyLg", t: 505, label: "Conor describes his focus on UX, BOLT12, and easy bitcoin addresses as part of making bitcoin payments feel less like infrastructure and more like a usable product surface." }], // 8:25
  },
  {
    name: "Easy bitcoin addresses",
    keywords: ["easy bitcoin addresses", "human bitcoin addresses", "payment addresses", "bitcoin ux"],
    picks: [{ youtube_id: "6Gnd5qavyLg", t: 505, label: "Easy bitcoin addresses are presented as a practical UX unlock: users need payment identifiers that feel simple enough for ordinary apps, not only raw invoices and technical primitives." }], // 8:25
  },
  {
    name: "AI micropayments",
    keywords: ["ai micropayments", "ai microtransactions", "lightning ai", "agent payments"],
    picks: [{ youtube_id: "6Gnd5qavyLg", t: 878, label: "Conor sees AI and bitcoin converging through payments and microtransactions, where Lightning can let agents pay for small units of work, APIs, or services." }], // 14:38
  },
  {
    name: "UX research toolkit",
    keywords: ["ux research toolkit", "bitcoin ux research", "research toolkit", "mo naidoo"],
    picks: [{ youtube_id: "-1Ha6XCQiE4", t: 471, label: "Mo Naidoo's UX Research Toolkit is a project to unify bitcoin UX research so designers and builders can reuse insights instead of repeatedly guessing what users need." }], // 7:51
  },
  {
    name: "Bitcoin Design Sidekick",
    keywords: ["bitcoin design sidekick", "ai design tools", "ai powered design", "bitcoin design ai"],
    picks: [{ youtube_id: "-1Ha6XCQiE4", t: 1010, label: "Mo explores AI-powered design tools, including a possible Bitcoin Design Sidekick that could help designers and builders apply bitcoin-specific UX knowledge." }], // 16:50
  },
  {
    name: "Bitcoin policy",
    keywords: ["bitcoin policy", "bitcoin policy institute", "washington dc bitcoin", "policy conversations"],
    picks: [{ youtube_id: "1afaot3nJ9Y", t: 127, label: "Matthew Pines maps the bitcoin scene in Washington, DC and explains how policy conversations are shifting as officials increasingly treat bitcoin as a strategic asset." }], // 2:07
  },
  {
    name: "Bitcoin as strategic asset",
    keywords: ["strategic asset", "bitcoin strategic asset", "policy bitcoin", "government bitcoin"],
    picks: [{ youtube_id: "1afaot3nJ9Y", t: 227, label: "Matthew Pines says policy conversations are moving toward bitcoin as a strategic asset, which changes the leverage that bitcoiners have when engaging lawmakers and institutions." }], // 3:47
  },
  {
    name: "Quantum policy",
    keywords: ["quantum policy", "quantum government response", "quantum computing risk", "bitcoin policy quantum"],
    picks: [{ youtube_id: "1afaot3nJ9Y", t: 548, label: "Matthew connects quantum computing risk to government response, treating post-quantum readiness as both a technical and policy coordination problem." }], // 9:08
  },
  {
    name: "China vs. U.S. bitcoin holdings",
    keywords: ["china us bitcoin holdings", "china bitcoin", "us bitcoin holdings", "sovereign bitcoin"],
    picks: [{ youtube_id: "1afaot3nJ9Y", t: 1182, label: "Matthew's spicy take compares China and U.S. bitcoin holdings, using sovereign accumulation to frame bitcoin as a geopolitical asset rather than just private savings technology." }], // 19:42
  },
  {
    name: "Lifeboat",
    keywords: ["lifeboat", "tadge dryja", "commit reveal", "quantum lifeboat"],
    picks: [{ youtube_id: "hRRZTX4D_iI", t: 142, label: "Tadge Dryja explains Lifeboat as a commit-reveal scheme for protecting coins if quantum computers become a real threat, giving bitcoin a possible emergency migration path." }], // 2:22
  },
  {
    name: "Post-quantum readiness",
    keywords: ["post-quantum readiness", "quantum computing bitcoin", "quantum signatures", "bitcoin quantum"],
    picks: [
      { youtube_id: "hRRZTX4D_iI", t: 47, label: "Tadge warns against complacency despite bitcoin's high price, naming scalability, fees, and post-quantum readiness as unresolved long-term issues." }, // 0:47
      { youtube_id: "ZC1BT2V2PNU", t: 0, label: "Clara Shikhelman describes the quantum report as a way to clarify what matters, reduce FUD, and orient future bitcoin work around post-quantum readiness." }, // 0:00
    ],
  },
  {
    name: "Client diversity",
    keywords: ["client diversity", "multiple full node implementations", "bitcoin core alternatives", "node diversity"],
    picks: [{ youtube_id: "hRRZTX4D_iI", t: 981, label: "Tadge names multiple full node implementations as a usability and resilience goal, connecting client diversity to bitcoin's long-term health." }], // 16:21
  },
  {
    name: "BIP39 in Bitcoin Core",
    keywords: ["bip39 bitcoin core", "seed phrase core", "wallet usability", "bitcoin core bip39"],
    picks: [{ youtube_id: "hRRZTX4D_iI", t: 981, label: "Tadge points to BIP39 support in Bitcoin Core as a concrete usability improvement that would make node and wallet usage easier for more people." }], // 16:21
  },
  {
    name: "Quantum-vulnerable coins",
    keywords: ["quantum-vulnerable coins", "cut off coins", "quantum vulnerable", "lopp quantum"],
    picks: [{ youtube_id: "NAXGVZLrCwc", t: 1002, label: "Jameson Lopp's controversial quantum view includes cutting off quantum-vulnerable coins, a proposal that forces the community to weigh property rights, emergency defense, and protocol rules." }], // 16:42
  },
  {
    name: "Dynamic block sizes",
    keywords: ["dynamic block size", "block size", "lopp dynamic blocks", "protocol evolution"],
    picks: [{ youtube_id: "NAXGVZLrCwc", t: 1002, label: "Lopp's other controversial idea is dynamic block sizes, using the episode to surface how protocol evolution debates remain live even among long-time bitcoiners." }], // 16:42
  },
  {
    name: "Project Eleven",
    keywords: ["project eleven", "qday", "alex pruden", "quantum cryptography"],
    picks: [{ youtube_id: "C8NLSPDgu2c", t: 102, label: "Alex Pruden introduces Project Eleven as applied R&D at the intersection of quantum computing and cryptography, with an explicit focus on future-proofing bitcoin." }], // 1:42
  },
  {
    name: "Quantum-resistant Bitcoin",
    keywords: ["quantum-resistant bitcoin", "quantum resistant", "future-proof bitcoin", "post-quantum bitcoin"],
    picks: [{ youtube_id: "C8NLSPDgu2c", t: 166, label: "Alex Pruden explains what it means for bitcoin to become quantum-resistant, shifting the conversation from vague fear to concrete cryptographic upgrade work." }], // 2:46
  },
  {
    name: "Zero-knowledge on Bitcoin",
    keywords: ["zero-knowledge bitcoin", "zk on bitcoin", "zero knowledge", "aleo"],
    picks: [{ youtube_id: "C8NLSPDgu2c", t: 671, label: "Alex Pruden discusses zero-knowledge on bitcoin as one possible future direction for self-sovereignty, privacy, and cryptographic functionality." }], // 11:11
  },
  {
    name: "Bitcoin as human rights tool",
    keywords: ["bitcoin human rights", "human rights tool", "activists bitcoin", "hrf bitcoin"],
    picks: [{ youtube_id: "kva7Cp1zFjQ", t: 484, label: "Alex Gladstein frames bitcoin as a human rights tool, especially for activists and people operating under weak institutions or financial repression." }], // 8:04
  },
  {
    name: "Activist bitcoin UX",
    keywords: ["activist bitcoin ux", "activists bitcoin", "hrf grants", "bitcoin usability activists"],
    picks: [{ youtube_id: "kva7Cp1zFjQ", t: 858, label: "Gladstein names the UX hurdles activists still face when using bitcoin, showing that human-rights use cases depend on product work, not only ideology." }], // 14:18
  },
  {
    name: "Human Rights Foundation grants",
    keywords: ["hrf grants", "human rights foundation bitcoin grants", "bitcoin grants", "activist tools"],
    picks: [{ youtube_id: "kva7Cp1zFjQ", t: 1013, label: "Gladstein shares lessons from HRF's grant program, where funding open-source and activist-facing tools can directly improve bitcoin's usefulness in adversarial environments." }], // 16:53
  },
  {
    name: "Block's Bitcoin custody",
    keywords: ["block bitcoin custody", "block custody", "bitkey custody", "self custody block"],
    picks: [{ youtube_id: "svN_Q71EsrI", t: 179, label: "Ryan Loomba explains Block's approach to bitcoin custody across Square, Cash App, Bitkey, and internal bitcoin work, grounding custody as a product-design and infrastructure problem." }], // 2:59
  },
  {
    name: "Cash App Lightning",
    keywords: ["cash app lightning", "lightning integration", "cash app bitcoin", "block lightning"],
    picks: [{ youtube_id: "svN_Q71EsrI", t: 1214, label: "Ryan discusses Cash App's Lightning integration as part of Block's long-term bitcoin payments roadmap and the move from price hype toward usable infrastructure." }], // 20:14
  },
  {
    name: "Bitcoin career paths",
    keywords: ["bitcoin career", "bitcoin engineer", "bitcoin jobs", "open-source contribution"],
    picks: [
      { youtube_id: "svN_Q71EsrI", t: 53, label: "Ryan Loomba traces a bitcoin engineering career across startups, Square, Cash App, and Block's bitcoin team." }, // 0:53
      { youtube_id: "yQ-h5DjbePI", t: 0, label: "Ben Carman's path from Mutiny and Taproot Wizards to Spiral shows how open-source wallet and Lightning work can become a full-time bitcoin career." }, // 0:00
    ],
  },
  {
    name: "Presidio Bitcoin",
    keywords: ["presidio bitcoin", "presidio bitcoin membership", "pb events", "bitcoin space"],
    picks: [{ youtube_id: "ZvlUoR-t6EA", t: 250, label: "Alex Zukauskas updates the audience on Presidio Bitcoin's first months, recurring public events, upcoming summits, memberships, visitors, and the day-to-day value of working in the space." }], // 4:10
  },
  {
    name: "Presidio Bitcoin events",
    keywords: ["presidio bitcoin events", "bitdevs litdevs builder", "quantum bitcoin summit", "careers fair"],
    picks: [{ youtube_id: "ZvlUoR-t6EA", t: 373, label: "Alex lists recurring public events such as BitDevs, LitDevs, and Builder, plus upcoming programming including the Quantum Bitcoin Summit, careers events, and book clubs." }], // 6:13
  },
  {
    name: "Cryptographers in bitcoin",
    keywords: ["cryptographers bitcoin", "cryptographers whitepaper", "bitcoin research", "chaincode labs"],
    picks: [{ youtube_id: "ZC1BT2V2PNU", t: 0, label: "Clara Shikhelman calls for more cryptographers to engage with bitcoin, read the white paper, and bring rigorous research attention to post-quantum and Lightning questions." }], // 0:00
  },
  {
    name: "Next-generation Lightning wallets",
    keywords: ["next-generation lightning wallets", "self-custodial lightning", "ldk", "mutiny"],
    picks: [{ youtube_id: "yQ-h5DjbePI", t: 0, label: "Ben Carman argues bitcoin needs next-generation Lightning and self-custodial wallets so it does not get reduced to a banking asset while real-world payments stagnate." }], // 0:00
  },
  {
    name: "Mining centralization",
    keywords: ["mining centralization", "mining pools", "hardware manufacturing", "block templates"],
    picks: [{ youtube_id: "efL8xPVdPUA", t: 0, label: "Stephen DeLorme points to mining pool, hardware manufacturing, and block-template centralization as concrete risks worth tracking in bitcoin's infrastructure." }], // 0:00
  },
  {
    name: "Bolt 12 zaps",
    keywords: ["bolt 12 zaps", "bolt12 zaps", "voltage", "zaps"],
    picks: [{ youtube_id: "efL8xPVdPUA", t: 0, label: "Stephen's side projects include Bolt 12 Zaps, a small but practical example of making Lightning social payment primitives more flexible." }], // 0:00
  },
  {
    name: "Bitcoin Students Network",
    keywords: ["bitcoin students network", "cornell bitcoin club", "student bitcoin", "gen z bitcoin"],
    picks: [{ youtube_id: "-TE7hLn_CRc", t: 0, label: "Ella Hough discusses co-founding the Bitcoin Students Network and leading the Cornell Bitcoin Club as part of bringing younger generations into bitcoin." }], // 0:00
  },
  {
    name: "Bitcoin as language",
    keywords: ["bitcoin as language", "truth protocol", "bitcoin linguistics", "game theory"],
    picks: [{ youtube_id: "-TE7hLn_CRc", t: 0, label: "Ella's independent major frames bitcoin through linguistics and game theory, treating it as a language or protocol for truth and information dissemination." }], // 0:00
  },
  {
    name: "Financial freedom research",
    keywords: ["financial freedom research", "bitcoin adoption study", "global bitcoin study", "25 countries"],
    picks: [{ youtube_id: "-TE7hLn_CRc", t: 0, label: "Ella describes a global research study across 25 countries exploring bitcoin adoption and financial freedom, linking student research to real-world human-rights questions." }], // 0:00
  },
  {
    name: "Taproot Assets",
    keywords: ["taproot assets", "lightning labs", "lnd", "roasbeef"],
    picks: [{ youtube_id: "DP0wGXlmmao", t: 0, label: "Laolu Osuntokun discusses Lightning Labs work on LND and Taproot Assets, including pragmatic views on where asset issuance and stablecoins intersect with bitcoin infrastructure." }], // 0:00
  },
  {
    name: "LND",
    keywords: ["lnd", "lightning labs", "roasbeef", "lightning implementation"],
    picks: [{ youtube_id: "DP0wGXlmmao", t: 0, label: "Laolu, lead developer of LND, reflects on Lightning Labs' work improving one of the main Lightning implementations and the adoption path for bitcoin payments." }], // 0:00
  },
  {
    name: "Bitcoin Design Foundation",
    keywords: ["bitcoin design foundation", "bitcoin design", "design community", "daniel nordh"],
    picks: [
      { youtube_id: "Q-PaXGrRehs", t: 0, label: "Daniel Nordh describes the Bitcoin Design Foundation and the long-running work to make bitcoin design sustainable, collaborative, and useful to open-source projects." }, // 0:00
      { youtube_id: "-1Ha6XCQiE4", t: 95, label: "Mo Naidoo explains how the Bitcoin Design Foundation supports designers across the ecosystem and creates structures for better research, tools, and collaboration." }, // 1:35
    ],
  },
  {
    name: "MIT Digital Currency Initiative",
    keywords: ["mit digital currency initiative", "mit dci", "neha narula", "cryptocurrency research"],
    picks: [{ youtube_id: "KsCREYVdawg", t: 0, label: "Neha Narula introduces the MIT Digital Currency Initiative as a research center for cryptocurrency and blockchain technology, with work that bridges academia, open-source systems, and industry." }], // 0:00
  },
  {
    name: "Lava",
    keywords: ["lava", "lava xyz", "shehzan maredia", "self-custodial bitcoin loans"],
    picks: [{ youtube_id: "RgB-sPf2B44", t: 247, label: "Shehzan Maredia explains Lava as a self-custodial way to borrow against bitcoin, serving people who want liquidity without selling their savings asset." }], // 4:07
  },
  {
    name: "Bitcoin savings asset",
    keywords: ["bitcoin savings asset", "store of value phase", "saving asset", "spending asset"],
    picks: [{ youtube_id: "RgB-sPf2B44", t: 136, label: "Shehzan argues bitcoin has to be adopted as a savings asset before it can become a spending asset, because store-of-value adoption is the current phase of monetization." }], // 2:16
  },
  {
    name: "Bitcoin Bond Company",
    keywords: ["bitcoin bond company", "pierre rochard", "bitcoin bonds", "savings and payments"],
    picks: [{ youtube_id: "pjix9O2kQ3k", t: 0, label: "Pierre Rochard introduces The Bitcoin Bond Company as part of his broader view that bitcoin's payments and savings utilities can be developed into financial products." }], // 0:00
  },
  {
    name: "Payments and savings",
    keywords: ["payments and savings", "bitcoin payments savings", "two utilities", "bitcoin utility"],
    picks: [{ youtube_id: "pjix9O2kQ3k", t: 165, label: "Pierre argues bitcoin has two fundamental utilities, payments and savings, and that cultural tension between the two shapes product debates across the ecosystem." }], // 2:45
  },
  {
    name: "Institutional adoption",
    keywords: ["institutional adoption", "educational trojan horse", "bitcoin ethos", "mainstream adoption"],
    picks: [{ youtube_id: "pjix9O2kQ3k", t: 468, label: "Pierre describes institutional adoption as an educational Trojan horse: mainstream financial interest can spread bitcoin's ethos if builders preserve the message while meeting users where they are." }], // 7:48
  },
  {
    name: "Bitcoin security budget",
    keywords: ["security budget", "bitcoin security budget", "fee market", "miner revenue"],
    picks: [{ youtube_id: "pjix9O2kQ3k", t: 670, label: "Pierre's controversial security-budget thoughts bring long-term miner incentives and fee-market sustainability into the 21-in-21 topic set." }], // 11:10
  },
  {
    name: "Bitcoin++",
    keywords: ["bitcoin++", "btcplusplus", "bitcoin developer conference", "niftynei"],
    picks: [{ youtube_id: "M-KlLM-SNfY", t: 95, label: "Niftynei explains Bitcoin++ as a developer conference format that helps bitcoiners interface with people looking to get involved in protocol and application work." }], // 1:35
  },
  {
    name: "Incentive engineering",
    keywords: ["incentive engineering", "satoshi incentives", "bitcoin incentives", "decentralized participants"],
    picks: [{ youtube_id: "M-KlLM-SNfY", t: 309, label: "Niftynei highlights Satoshi's incentive engineering: bitcoin works because decentralized participants are economically motivated to move in the same direction." }], // 5:09
  },
  {
    name: "Ephemeral anchors",
    keywords: ["ephemeral anchors", "v3 transactions", "replacement by fee rate", "rbf rate"],
    picks: [{ youtube_id: "M-KlLM-SNfY", t: 573, label: "Niftynei's love of ephemeral anchors, v3 transactions, and replacement-by-fee-rate surfaces a cluster of transaction-relay work aimed at making Lightning and fee management more robust." }], // 9:33
  },
  {
    name: "Grassroots bitcoin organizing",
    keywords: ["grassroots bitcoin", "teach friends family", "bitcoin organizing", "bitcoin community"],
    picks: [{ youtube_id: "M-KlLM-SNfY", t: 1076, label: "Niftynei argues for grassroots organizing: teaching friends and family to use bitcoin is still part of protocol adoption, not a distraction from technical work." }], // 17:56
  },
  {
    name: "Proto",
    keywords: ["proto", "block mining initiative", "decentralize mining", "bitcoin mining hardware"],
    picks: [{ youtube_id: "0PaV_6vjkXI", t: 166, label: "Jack Dorsey discusses Block's Proto mining initiative and the need to decentralize mining hardware and infrastructure." }], // 2:46
  },
  {
    name: "Bitcoin open-source funding",
    keywords: ["bitcoin open-source funding", "spiral", "brink", "opensats", "hrf"],
    picks: [
      { youtube_id: "0PaV_6vjkXI", t: 548, label: "Jack says companies can support bitcoin open source by creating their own Spirals or contributing to organizations such as Brink, HRF, and OpenSats." }, // 9:08
      { youtube_id: "pjix9O2kQ3k", t: 909, label: "Pierre says companies can positively affect bitcoin by employing native bitcoiners or donating to organizations like Brink and OpenSats." }, // 15:09
    ],
  },
  {
    name: "Bitcoin permissionless",
    keywords: ["bitcoin permissionless", "permissionless nature", "unique bitcoin", "open monetary network"],
    picks: [{ youtube_id: "0PaV_6vjkXI", t: 1017, label: "Jack ends by emphasizing bitcoin's permissionless nature as the thing that makes it uniquely powerful and worth building around." }], // 16:57
  },
  {
    name: "BTCPay Server",
    keywords: ["btcpay server", "rockstar dev", "open-source payments", "bitcoin tools"],
    picks: [{ youtube_id: "ZNZ-fSYETU8", t: 0, label: "Rockstar Dev introduces BTCPay Server as one of bitcoin's most important open-source projects, showing how merchant tools can be built without handing payments to a custodian." }], // 0:00
  },
  {
    name: "Hyperinflation",
    keywords: ["hyperinflation", "growing up hyperinflation", "rockstar dev", "fiat failure"],
    picks: [{ youtube_id: "ZNZ-fSYETU8", t: 226, label: "Rockstar Dev's path into bitcoin starts with growing up amid hyperinflation, making fiat failure a lived experience rather than an abstract monetary argument." }], // 3:46
  },
  {
    name: "Physical Bitcoin spaces",
    keywords: ["physical bitcoin spaces", "presidio bitcoin", "bitcoin spaces", "real connection"],
    picks: [{ youtube_id: "ZNZ-fSYETU8", t: 880, label: "Rockstar Dev praises physical spaces like Presidio Bitcoin as technology advances, arguing that people still need real connection around open-source work and money." }], // 14:40
  },
]);

addTopicDefs([
  {
    name: "Bitcoin Design Week",
    keywords: ["bitcoin design week", "presidio bitcoin design week", "design future money", "bitcoin designers"],
    picks: [{ youtube_id: "0_04PZms-I0", t: 0, label: "The recap frames Bitcoin Design Week as five days of designers and builders working on future-money UX: user needs, stablecoins versus bitcoin payments, vibe coding, grand design challenges, and bitcoin inside mainstream Silicon Valley products." }], // 0:00
  },
  {
    name: "Bitcoin design",
    keywords: ["bitcoin design week", "bitcoin design", "design future money", "bitcoin ux"],
    picks: [
      { youtube_id: "EbFCoVtJKEc", t: 105, label: "Christoph Ono explains why designing bitcoin is unusually hard: money is psychological, cultural, adversarial, global, and regulated, so good UX has to bridge much more than screens." }, // 1:45
      { youtube_id: "0_04PZms-I0", t: 0, label: "The Design Week recap treats design as the missing layer between bitcoin's technical correctness and everyday usefulness, especially for payments, products, and cultural adoption." }, // 0:00
    ],
  },
  {
    name: "Bitcoin Design Community",
    keywords: ["bitcoin design community", "bitcoin design foundation", "presidio bitcoin design week", "open source design"],
    picks: [{ youtube_id: "EbFCoVtJKEc", t: 105, label: "Christoph reflects on five years of the Bitcoin Design Community and Bitcoin Design Foundation, showing how open-source design work helps bitcoin products move toward broader usability." }], // 1:45
  },
  {
    name: "Bitcoin branding",
    keywords: ["bitcoin branding", "brand of bitcoin", "bitcoin brand", "bitcoin visual identity"],
    picks: [
      { youtube_id: "Lpdf6ANtntk", t: 301, label: "Joshua Philippe defines brand as the perception created by how bitcoin looks, talks, and shows up culturally, then argues bitcoin's open-source brand needs to mature beyond fragmented coins, orange tropes, and insider aesthetics." }, // 5:01
      { youtube_id: "YArvqMYy6nI", t: 314, label: "Kyle Fletcher maps recent bitcoin aesthetics and asks designers to expand the creative vocabulary so bitcoin can reach the next 96% through everyday experiences rather than insider-coded visuals." }, // 5:14
    ],
  },
  {
    name: "Bitcoin brand creative",
    keywords: ["bitcoin brand creative", "cash app brand", "bitcoin aesthetics", "bitcoin artists"],
    picks: [{ youtube_id: "YArvqMYy6nI", t: 1308, label: "Kyle Fletcher points to new aesthetic horizons for bitcoin, highlighting artists and cultural references that can diversify bitcoin's visual language beyond the familiar orange-and-coin defaults." }], // 21:48
  },
  {
    name: "Bitcoin aesthetic horizons",
    keywords: ["bitcoin aesthetic horizons", "aesthetic horizon", "bitcoin aesthetics", "bitcoin culture design"],
    picks: [{ youtube_id: "YArvqMYy6nI", t: 314, label: "Kyle's aesthetic horizon audit gives designers a vocabulary for where bitcoin creative has been and where it could go next, from Cash App lessons to broader cultural experimentation." }], // 5:14
  },
  {
    name: "Cash App",
    keywords: ["cash app bitcoin", "cash app brand", "cash app design", "block bitcoin"],
    picks: [{ youtube_id: "YArvqMYy6nI", t: 474, label: "Kyle uses Cash App's bitcoin-facing brand work as a case study in making bitcoin feel approachable, useful, and culturally legible without forcing every user through technical explanations first." }], // 7:54
  },
  {
    name: "Mainstream bitcoin UX",
    keywords: ["mainstream bitcoin ux", "next 96%", "everyday bitcoin ux", "bitcoin mainstream adoption"],
    picks: [{ youtube_id: "YArvqMYy6nI", t: 1562, label: "The challenge is reaching the next 96% through everyday experiences, not only dedicated bitcoin apps: bitcoin has to feel familiar in normal product surfaces and cultural contexts." }], // 26:02
  },
  {
    name: "BIP 177",
    keywords: ["bip 177", "bitcoin base unit", "bitcoin display", "integer bitcoin"],
    picks: [{ youtube_id: "8ZFk2oMwX8Y", t: 402, label: "Mat Balez introduces BIP 177 as a design proposal for representing bitcoin quantities with integers and the bitcoin symbol, reducing confusion from decimals and sats in mainstream interfaces." }], // 6:42
  },
  {
    name: "Bitcoin ₿ symbol",
    keywords: ["bitcoin symbol", "bitcoin b symbol", "₿ symbol", "bitcoin display"],
    picks: [{ youtube_id: "8ZFk2oMwX8Y", t: 334, label: "Mat argues that prices and wallet balances should use the ₿ symbol and integer-style display so bitcoin's cultural surface area remains bitcoin, not an obscure unit label users have to decode." }], // 5:34
  },
  {
    name: "Sats vs. bitcoin denomination",
    keywords: ["sats vs bitcoin", "sats display", "bip 177", "bitcoin denomination"],
    picks: [{ youtube_id: "8ZFk2oMwX8Y", t: 292, label: "The sats-versus-bitcoin display question is treated as a mainstream adoption problem: decimals are intimidating, sats require explanation, and the ₿ symbol may make amounts feel more natural." }], // 4:52
  },
  {
    name: "Bitcoin as unit of account",
    keywords: ["bitcoin unit of account", "priced in bitcoin", "bitcoin prices", "bitcoin quantity display"],
    picks: [{ youtube_id: "8ZFk2oMwX8Y", t: 250, label: "Mat asks designers to imagine a world where everything is priced in bitcoin, then work backward from how those prices should look in coffee shops, wallets, keyboards, and everyday products." }], // 4:10
  },
  {
    name: "Bitcoin keyboards",
    keywords: ["bitcoin keyboard", "bitcoin symbol keyboard", "type bitcoin symbol", "soft keyboard bitcoin"],
    picks: [{ youtube_id: "8ZFk2oMwX8Y", t: 613, label: "If the bitcoin symbol becomes part of everyday pricing, people need to type it. Mat turns keyboard placement and soft-keyboard support into a design challenge that has to start years before ubiquity." }], // 10:13
  },
  {
    name: "BIP 353",
    keywords: ["bip 353", "b addresses", "human readable bitcoin addresses", "bitcoin symbol addresses"],
    picks: [{ youtube_id: "8ZFk2oMwX8Y", t: 636, label: "Mat connects BIP 353 and human-readable bitcoin addresses to the ₿ symbol, asking whether 'B addresses' can make payment identifiers easier to recognize and use." }], // 10:36
  },
  {
    name: "Bitcoin fees",
    keywords: ["bitcoin fees", "fee spikes", "bitcoin fee ux", "fee design"],
    picks: [{ youtube_id: "mBKxn_Thr7c", t: 0, label: "Christoph Ono uses a failed allowance payment during a fee spike to show how high on-chain fees can make bitcoin feel broken for ordinary users, especially when wallets do not explain what is happening." }], // 0:00
  },
  {
    name: "Fee transparency",
    keywords: ["fee transparency", "fee predictability", "wallet fee ux", "lightning splice fee"],
    picks: [{ youtube_id: "mBKxn_Thr7c", t: 135, label: "A Lightning splice unexpectedly charging about $60 becomes a trust lesson: wallets need to warn users, explain fees, and make tradeoffs visible before money appears to vanish." }], // 2:15
  },
  {
    name: "Global fee market",
    keywords: ["global fee market", "fee affordability", "bitcoin fees global south", "fee inequality"],
    picks: [{ youtube_id: "mBKxn_Thr7c", t: 105, label: "Christoph compares incomes across countries to show that a global bitcoin fee market hits users very differently: what is annoying in Switzerland can be prohibitive somewhere else." }], // 1:45
  },
  {
    name: "Bitcoin Design Guide",
    keywords: ["bitcoin design guide", "fee design guide", "bitcoin design resources", "bitcoin ux guidance"],
    picks: [{ youtube_id: "mBKxn_Thr7c", t: 0, label: "The fee talk grounds its recommendations in the Bitcoin Design Guide, treating fees as a product communication problem as much as a protocol constraint." }], // 0:00
  },
  {
    name: "Bitcoin vs. stablecoins",
    keywords: ["bitcoin vs stablecoins", "stablecoins payments", "future payments", "global payments app"],
    picks: [{ youtube_id: "N-IZbxNAvzY", t: 0, label: "Nick Slaney and Daniel Nordh frame future payments as a practical tradeoff between bitcoin's open, censorship-resistant rails and stablecoins' dollar stability, interoperability, and compliance fit." }], // 0:00
  },
  {
    name: "Bitcoin payments",
    keywords: ["bitcoin payments", "bitcoin for payments", "global payments app", "payment rails bitcoin"],
    picks: [{ youtube_id: "N-IZbxNAvzY", t: 144, label: "Nick Slaney makes the case for bitcoin as accessible, censorship-resistant payment infrastructure, pushing the conversation beyond store-of-value into actual global money apps." }], // 2:24
  },
  {
    name: "Stablecoins for payments",
    keywords: ["stablecoins for payments", "stablecoin payments", "dollar backed tokens", "payments compliance"],
    picks: [{ youtube_id: "N-IZbxNAvzY", t: 1046, label: "Daniel Nordh argues for stablecoins as interoperable dollar rails that match current user habits and regulatory expectations, even as the panel surfaces their custody and censorship tradeoffs." }], // 17:26
  },
  {
    name: "Payment protocol UX",
    keywords: ["payment protocol ux", "payment protocols", "bitcoin payment flows", "people products protocols"],
    picks: [{ youtube_id: "grc6hKjNYkY", t: 0, label: "Conor Okus reframes payment protocols around people and products: start with real user needs such as remittances and freelance work, then work backward to protocol choices." }], // 0:00
  },
  {
    name: "Remittances",
    keywords: ["remittances", "los angeles guatemala", "bitcoin remittances", "cross border payments"],
    picks: [{ youtube_id: "grc6hKjNYkY", t: 0, label: "Conor uses remittances from Los Angeles to Guatemala as a design lens for bitcoin payments: users need flows that are reliable and humane before they care about protocol details." }], // 0:00
  },
  {
    name: "Payment links",
    keywords: ["payment links", "bitcoin payment links", "qr codes", "human readable names"],
    picks: [{ youtube_id: "grc6hKjNYkY", t: 0, label: "The talk surfaces concrete UX primitives for better payments: QR codes, payment links, human-readable names, and flexible flows for saving, sending, and spending." }], // 0:00
  },
  {
    name: "Easy bitcoin addresses",
    keywords: ["human readable bitcoin addresses", "easy bitcoin addresses", "payment names", "bitcoin address ux"],
    picks: [{ youtube_id: "grc6hKjNYkY", t: 0, label: "Human-readable names are treated as a key ingredient for making bitcoin payments feel like normal product interactions instead of raw infrastructure." }], // 0:00
  },
  {
    name: "Bitchat",
    keywords: ["bitchat", "bluetooth mesh", "decentralized messaging", "nostr identity"],
    picks: [{ youtube_id: "pcGcu0giDuE", t: 0, label: "Steve Lee introduces Bitchat as a peer-to-peer messaging app using Bluetooth mesh networking, no servers, no accounts, and ephemeral identities, with real-world relevance for privacy and resilience." }], // 0:00
  },
  {
    name: "Bluetooth mesh",
    keywords: ["bluetooth mesh", "bitchat bluetooth", "local messaging", "mesh networking"],
    picks: [{ youtube_id: "pcGcu0giDuE", t: 0, label: "Bitchat's Bluetooth mesh design turns local device-to-device communication into a design opportunity for resilient messaging when centralized networks are unavailable or undesirable." }], // 0:00
  },
  {
    name: "Nostr identity",
    keywords: ["nostr identity", "bitchat identity", "nostr handshake", "ephemeral identities"],
    picks: [{ youtube_id: "pcGcu0giDuE", t: 0, label: "The Bitchat talk points to Nostr-based identity handshakes and ephemeral identities as ways to give peer-to-peer communication continuity without accounts or centralized control." }], // 0:00
  },
  {
    name: "Bitcoin merchant adoption",
    keywords: ["merchant adoption", "bitcoin at the register", "square bitcoin", "merchant bitcoin"],
    picks: [{ youtube_id: "TCvQ2Axa-i8", t: 0, label: "Haley Berkoe frames merchant adoption as a design and storytelling challenge: bitcoin has to move beyond digital gold and become easy, fun, and rewarding at the register." }], // 0:00
  },
  {
    name: "Merchant onboarding",
    keywords: ["merchant onboarding", "bitcoin merchants", "grassroots onboarding", "inspiring merchants"],
    picks: [{ youtube_id: "TCvQ2Axa-i8", t: 0, label: "The merchant session focuses on grassroots onboarding, better branding, and practical tools that make it easier for business owners to say yes to accepting bitcoin." }], // 0:00
  },
  {
    name: "Square merchants",
    keywords: ["square merchants", "square bitcoin payments", "bitcoin at register", "merchant tools"],
    picks: [{ youtube_id: "TCvQ2Axa-i8", t: 0, label: "Square is treated as a key merchant surface where better tools and clearer messaging can make bitcoin payments feel operationally normal for businesses." }], // 0:00
  },
  {
    name: "Grand design challenges",
    keywords: ["grand design challenges", "bitcoin design challenges", "bitcoin design week", "design challenge"],
    picks: [{ youtube_id: "Lpdf6ANtntk", t: 0, label: "The Grand Design Challenges session gathers bitcoin branding, BIP 177, payment protocols, fees, merchant adoption, and Bitchat into one frame: design has to operate across culture, interfaces, and technical primitives." }], // 0:00
  },
  {
    name: "Bitcoin brand artifacts",
    keywords: ["bitcoin brand artifacts", "credit card chip", "bitcoin card design", "brand artifact"],
    picks: [{ youtube_id: "Lpdf6ANtntk", t: 780, label: "Joshua's design challenge rethinks the credit-card chip as a bitcoin brand artifact, asking how the conductive pad layout could integrate the bitcoin symbol while remaining functional and recognizable." }], // 13:00
  },
  {
    name: "Bitcoin credit card chip",
    keywords: ["bitcoin credit card chip", "credit card chip design", "visa chip bitcoin", "fold card"],
    picks: [{ youtube_id: "Lpdf6ANtntk", t: 780, label: "The credit-card chip exercise turns bitcoin branding into a physical product detail: a small, electrically functional surface that could carry bitcoin identity into everyday payment cards." }], // 13:00
  },
  {
    name: "Vibe coding",
    keywords: ["vibe coding", "rapid prototyping", "flora ai", "design prototype"],
    picks: [
      { youtube_id: "Lpdf6ANtntk", t: 783, label: "Joshua uses Flora as an AI prompting platform to prototype a real-world bitcoin card artifact, showing how vibe coding can accelerate design exploration." }, // 13:03
      { youtube_id: "0_04PZms-I0", t: 0, label: "The Design Week recap includes vibe coding and rapid prototyping as part of the designer toolkit for exploring bitcoin product ideas faster." }, // 0:00
    ],
  },
  {
    name: "Bitcoin inside Silicon Valley products",
    keywords: ["bitcoin inside gmail", "bitcoin inside uber", "bitcoin inside linkedin", "silicon valley products"],
    picks: [{ youtube_id: "0_04PZms-I0", t: 0, label: "The recap asks what bitcoin could look like inside mainstream products such as Gmail, Uber, and LinkedIn, shifting design from niche wallets to familiar surfaces people already use." }], // 0:00
  },
]);

addTopicDefs([
  {
    name: "Type I Summit",
    keywords: ["type i summit", "terawatt future", "power markets", "data centers"],
    picks: [{ youtube_id: "9tIxNm3mPwg", t: 0, label: "Max Webster opens Type I Summit by framing energy as the new constraint on technological progress: AI demand, compute infrastructure, capital, and power markets now have to be planned together at gigawatt and eventually terawatt scale." }],
  },
  {
    name: "Terawatt future",
    keywords: ["terawatt future", "terawatt-scale grid", "terawatt compute", "there is no top"],
    picks: [{ youtube_id: "9tIxNm3mPwg", t: 0, label: "The opening keynote sets the summit thesis: intelligence is being electrified, and the next phase of AI will demand enough new power that builders need to think in terawatts rather than incremental data-center loads." }],
  },
  {
    name: "AI power demand",
    keywords: ["ai power demand", "ai electricity demand", "compute demand", "power needs doubling"],
    picks: [
      { youtube_id: "nc2xUOP00jM", t: 0, label: "Ramez Naam frames the AI race around energy access: as models and inference scale, cheap reliable power becomes a strategic input alongside chips, model quality, and capital." },
      { youtube_id: "ImajAZ4wItk", t: 0, label: "Sam Steyer explains why electricity demand is rising again after decades of flat load growth, with AI data centers pushing utilities, developers, and grid planners into a much faster buildout cycle." },
    ],
  },
  {
    name: "Gigawatt data centers",
    keywords: ["gigawatt data center", "5 gigawatts", "10 gigawatts", "large ai sites"],
    picks: [{ youtube_id: "nc2xUOP00jM", t: 0, label: "Ramez Naam treats gigawatt-scale campuses as the new planning unit for frontier AI, where access to sites, generation, grid capacity, and time-to-power can determine who wins." }],
  },
  {
    name: "Electricity demand growth",
    keywords: ["electricity demand growth", "load growth", "flat demand", "10% annual demand"],
    picks: [{ youtube_id: "ImajAZ4wItk", t: 0, label: "The data-center grid talk turns load growth into the central bottleneck: after roughly twenty years of flat demand, utilities now face AI-driven growth rates that existing planning processes were not built to handle." }],
  },
  {
    name: "Time-to-power",
    keywords: ["time to power", "power availability", "substations", "turbines", "grid connection delay"],
    picks: [{ youtube_id: "ImajAZ4wItk", t: 0, label: "Sam Steyer argues the binding constraint is time, not just money: turbines, substations, gas lines, and transmission take years, so power availability becomes the real cap on AI growth." }],
  },
  {
    name: "Interconnection queues",
    keywords: ["interconnection queue", "interconnection queues", "grid queue", "five year interconnection"],
    picks: [
      { youtube_id: "WA-ITXRwoXo", t: 0, label: "The off-grid panel explains why clogged interconnection queues push compute developers to build next to generation instead of waiting years for a traditional grid connection." },
      { youtube_id: "Vtu-Cmsb_XI", t: 93, label: "The grid panel treats interconnection as one of the defining constraints in today's power markets, with permitting, planning, and queue mechanics determining whether new load can actually come online." },
    ],
  },
  {
    name: "Off-grid data centers",
    keywords: ["off-grid data center", "offgrid data center", "compute at the power source", "behind the meter compute"],
    picks: [
      { youtube_id: "WA-ITXRwoXo", t: 0, label: "Scott Williams, Brock Petersen, and Tomas Ocampo frame off-grid data centers as a response to slow grid connections: place compute next to generation and turn remote power into deployable capacity." },
      { youtube_id: "WA-ITXRwoXo", t: 8, label: "Scott Williams revisits the limits of off-grid AI data centers through Crusoe's solar-plus-storage work, showing why the model is powerful but still constrained by uptime, cost, and operational requirements." },
    ],
  },
  {
    name: "Stranded power",
    keywords: ["stranded power", "remote power", "curtailed power", "stranded energy"],
    picks: [{ youtube_id: "WA-ITXRwoXo", t: 0, label: "The off-grid panel treats stranded or remote power as an advantage once compute can move to the source, letting developers monetize energy that the existing grid cannot absorb quickly." }],
  },
  {
    name: "Grid interconnection",
    keywords: ["grid interconnection", "connected grid", "interconnect regions", "grid connection"],
    picks: [{ youtube_id: "Vtu-Cmsb_XI", t: 34, label: "The grid panel pushes back on a purely islanded future, arguing that better interconnection lets regions share power, reduce volatility, and make the whole system more resilient." }],
  },
  {
    name: "Transmission planning",
    keywords: ["transmission planning", "transmission lines", "transmission costs", "transmission distribution"],
    picks: [
      { youtube_id: "Vtu-Cmsb_XI", t: 934, label: "The grid discussion identifies transmission planning as both a technical need and a governance bottleneck: the physics of moving power can work well, but planning and cost allocation slow everything down." },
      { youtube_id: "Tw-LO33woPo", t: 263, label: "Casey Handmer and Ramez Naam debate whether cheap solar and batteries can reduce the need for long-distance transmission, or whether a larger connected grid remains essential for reliability." },
    ],
  },
  {
    name: "Fractal grids",
    keywords: ["fractal grid", "fractal grids", "federated grid", "internet of energy"],
    picks: [{ youtube_id: "Vtu-Cmsb_XI", t: 340, label: "The grid panel explores the idea of decentralized or fractal grids: local generation and load clusters that can grow, trade, and eventually interconnect into a more open power system." }],
  },
  {
    name: "Macrogrids",
    keywords: ["macrogrid", "macro grid", "islanded macrogrid", "new grid"],
    picks: [{ youtube_id: "x4uJcx9Ed1I", t: 319, label: "The solar panel uses macrogrids as a bridge between microgrids and the traditional utility system: start with local solar and storage, then connect clusters as they scale." }],
  },
  {
    name: "Real-time power markets",
    keywords: ["real-time power markets", "market clearing", "system operators", "power market software"],
    picks: [{ youtube_id: "Vtu-Cmsb_XI", t: 671, label: "The grid panel frames the ideal grid as a software and market-design problem: real-time price signals and better dispatch can coordinate new flexible loads, generators, and storage." }],
  },
  {
    name: "Solar scaling",
    keywords: ["solar scaling", "solar deployment", "solar cost curves", "solar installations"],
    picks: [
      { youtube_id: "Tw-LO33woPo", t: 0, label: "Casey Handmer and Ramez Naam discuss solar scaling as a compounding deployment curve: costs keep falling, installation rates keep rising, and the main questions become land, storage, transmission, and build speed." },
      { youtube_id: "x4uJcx9Ed1I", t: 486, label: "The terawatt solar panel argues solar is already the dominant new generation technology by cost and speed, with the frontier shifting from technology risk to execution and deployment scale." },
    ],
  },
  {
    name: "Terawatt scale solar",
    keywords: ["terawatt scale solar", "terawatt solar", "solar farms", "utility-scale solar"],
    picks: [{ youtube_id: "x4uJcx9Ed1I", t: 0, label: "Banks Hunter, Alex Fuster, and Ali Chehrehsaz focus on the practical path to terawatt-scale solar: site selection, permitting, interconnection, construction labor, automation, batteries, and new development models." }],
  },
  {
    name: "Solar construction automation",
    keywords: ["solar construction automation", "robots that build solar", "charge robotics", "solar robots"],
    picks: [{ youtube_id: "x4uJcx9Ed1I", t: 48, label: "Banks Hunter describes Charge Robotics as factory-style automation for utility-scale solar, replacing slow field labor with machines that can assemble solar farms faster and more repeatably." }],
  },
  {
    name: "Solar + storage",
    keywords: ["solar plus storage", "solar and batteries", "solar storage", "battery-backed solar"],
    picks: [
      { youtube_id: "x4uJcx9Ed1I", t: 1251, label: "The solar panel notes how quickly co-located batteries have become standard for utility-scale solar, shifting the conversation from intermittent generation to dispatchable solar-plus-storage systems." },
      { youtube_id: "WA-ITXRwoXo", t: 38, label: "Scott Williams uses Crusoe's 12 MW solar and 63 MWh battery project to ground the off-grid data-center thesis in actual solar-plus-storage operating constraints." },
    ],
  },
  {
    name: "Battery storage",
    keywords: ["battery storage", "batteries", "lithium ion", "storage cost curve"],
    picks: [{ youtube_id: "Tw-LO33woPo", t: 297, label: "Casey Handmer and Ramez Naam discuss how battery deployment and cost curves change grid planning, with storage increasingly absorbing solar variability and reducing the need for legacy assumptions." }],
  },
  {
    name: "Long-duration storage",
    keywords: ["long-duration storage", "long duration storage", "seasonal storage", "storage duration"],
    picks: [{ youtube_id: "Tw-LO33woPo", t: 14, label: "The long-duration storage conversation asks how much storage is actually needed once solar is cheap enough to overbuild, and where batteries, transmission, and other storage forms each fit." }],
  },
  {
    name: "Batteries vs. transmission",
    keywords: ["batteries replace transmission", "batteries vs transmission", "transmission replacement"],
    picks: [{ youtube_id: "Tw-LO33woPo", t: 13, label: "Casey Handmer and Ramez Naam debate the provocative claim that solar-plus-storage can become cheap enough to substitute for some transmission, while still disagreeing on how much grid buildout remains necessary." }],
  },
  {
    name: "Maritime data centers",
    keywords: ["maritime data centers", "ocean data centers", "floating data centers", "data centers at sea"],
    picks: [
      { youtube_id: "UWobJlMoZP8", t: 0, label: "Mike Schroepfer and Garth Sheldon-Coulson present maritime data centers as a new infrastructure class: compute that moves offshore to access wind, cooling, fewer land constraints, and different permitting regimes." },
      { youtube_id: "UWobJlMoZP8", t: 230, label: "Schroepfer explains the ocean-power thesis from first principles: the ocean is a vast solar collector, with wind and cooling resources that could support gigawatt-scale floating compute." },
    ],
  },
  {
    name: "High seas compute",
    keywords: ["high seas compute", "computing on the high seas", "ocean compute", "offshore compute"],
    picks: [{ youtube_id: "UWobJlMoZP8", t: 0, label: "The high-seas compute panel shows how far data-center builders may go to escape land, grid, and permitting constraints when AI demand pushes infrastructure beyond normal sites." }],
  },
  {
    name: "Ocean energy",
    keywords: ["ocean energy", "ocean wind", "offshore wind", "ocean solar collector"],
    picks: [{ youtube_id: "UWobJlMoZP8", t: 240, label: "Schroepfer makes the ocean-energy case by treating ocean wind and cooling as concentrated solar energy that can be harvested without conventional land-based transmission constraints." }],
  },
  {
    name: "Bitcoin mining energy infrastructure",
    keywords: ["bitcoin mining energy infrastructure", "miners pioneered flexible compute", "mining playbook ai"],
    picks: [{ youtube_id: "4GScJjcSrwg", t: 0, label: "The bitcoin mining panel argues miners pioneered the flexible compute playbook now being adapted for AI: go directly to power sources, absorb otherwise stranded energy, and help projects finance new generation." }],
  },
  {
    name: "Flexible compute",
    keywords: ["flexible compute", "mobile compute", "compute that goes where energy is"],
    picks: [
      { youtube_id: "4GScJjcSrwg", t: 0, label: "The mining panel connects bitcoin mining to AI infrastructure through flexible compute: the operational ability to move, curtail, and structure offtake around energy availability." },
      { youtube_id: "WA-ITXRwoXo", t: 242, label: "Scott Williams distinguishes flexible compute from always-on AI loads, explaining why off-grid economics depend on how much downtime a workload can tolerate." },
    ],
  },
  {
    name: "Flexible load",
    keywords: ["flexible load", "demand response", "curtailment", "load flexibility"],
    picks: [{ youtube_id: "4GScJjcSrwg", t: 0, label: "Bitcoin mining is presented as the original flexible load for new power projects, with AI borrowing some of the same financing and siting patterns but facing stricter uptime demands." }],
  },
  {
    name: "Energy-backed money",
    keywords: ["energy-backed money", "energy backed money", "proof of work energy", "energy-native settlement"],
    picks: [{ youtube_id: "Vtu-Cmsb_XI", t: 354, label: "The grid panel connects bitcoin, solar, and new power infrastructure through the idea of energy-backed money: a neutral settlement asset tied to physical work and useful in dynamic power markets." }],
  },
  {
    name: "Internet of Energy",
    keywords: ["internet of energy", "energy internet", "free electrons", "energy protocol"],
    picks: [{ youtube_id: "Vtu-Cmsb_XI", t: 340, label: "The grid conversation points toward an Internet of Energy: decentralized generation, storage, load, identity, and settlement coordinated more like open networks than vertically planned utilities." }],
  },
  {
    name: "Lightning for energy settlement",
    keywords: ["lightning energy settlement", "lightning network energy", "instant energy settlement"],
    picks: [{ youtube_id: "r14tawJBYSU", t: 1153, label: "In the contrarian AI compute discussion, Lightning comes up as the kind of instant settlement layer that could matter if energy and compute markets become more dynamic and machine-mediated." }],
  },
  {
    name: "Nostr for energy assets",
    keywords: ["nostr energy", "asset identity nostr", "encrypted energy communication"],
    picks: [{ youtube_id: "Vtu-Cmsb_XI", t: 340, label: "The fractal-grid thesis extends open protocols into energy: Nostr-like identity and messaging could let generation, storage, and load assets coordinate without depending on legacy utility platforms." }],
  },
  {
    name: "Jevons paradox",
    keywords: ["jevons paradox", "efficiency increases demand", "cheaper ai more usage"],
    picks: [{ youtube_id: "r14tawJBYSU", t: 653, label: "Bob McElrath's contrarian view puts efficiency gains against Jevons paradox: even if chips and models get vastly more efficient, cheaper intelligence may cause usage to expand rather than total power demand to collapse." }],
  },
  {
    name: "AI compute efficiency",
    keywords: ["ai compute efficiency", "model efficiency", "hardware efficiency", "inference efficiency"],
    picks: [{ youtube_id: "r14tawJBYSU", t: 79, label: "Bob McElrath argues AI power forecasts may be overstated because model and hardware efficiency could improve by orders of magnitude, changing how much new energy is actually required." }],
  },
  {
    name: "Overbuilding AI compute",
    keywords: ["overbuilding ai compute", "ai compute overbuild", "contrarian ai compute"],
    picks: [{ youtube_id: "r14tawJBYSU", t: 0, label: "Bob McElrath makes the contrarian case that the industry may be overbuilding AI compute if efficiency gains arrive faster than demand growth, even while the broader summit expects power demand to keep rising." }],
  },
  {
    name: "China energy race",
    keywords: ["china energy race", "china solar", "energy competition china", "ai race china power"],
    picks: [
      { youtube_id: "r14tawJBYSU", t: 1259, label: "The contrarian compute discussion brings China into the power race: even if AI demand is uncertain, national competition makes energy capacity and deployment speed strategically important." },
      { youtube_id: "x4uJcx9Ed1I", t: 1162, label: "The solar panel discusses supply-chain and manufacturing questions around China, asking how much terawatt-scale solar and battery capacity can be built domestically versus sourced globally." },
    ],
  },
  {
    name: "Solar manufacturing",
    keywords: ["solar manufacturing", "solar supply chain", "first solar", "domestic solar"],
    picks: [{ youtube_id: "x4uJcx9Ed1I", t: 1184, label: "The terawatt solar panel explains why solar manufacturing inputs are unusually scalable, while still acknowledging current dependence on global supply chains and a limited domestic supplier base." }],
  },
  {
    name: "Grid permitting",
    keywords: ["grid permitting", "permitting reform", "permitting constraints", "environmental review"],
    picks: [{ youtube_id: "Vtu-Cmsb_XI", t: 93, label: "The grid panel treats permitting and environmental review as core blockers for both transmission and interconnection, making speed-to-build as important as technology choice." }],
  },
  {
    name: "Data center flexibility",
    keywords: ["data center flexibility", "flexible data centers", "demand response data centers"],
    picks: [{ youtube_id: "WA-ITXRwoXo", t: 242, label: "Scott Williams breaks down where data centers can and cannot behave like flexible load, a crucial difference between bitcoin mining economics and AI inference or training infrastructure." }],
  },
  {
    name: "Redwood Energy",
    keywords: ["redwood energy", "redwood batteries", "recycled batteries", "crusoe redwood"],
    picks: [{ youtube_id: "WA-ITXRwoXo", t: 30, label: "Scott Williams discusses Crusoe's off-grid project with Redwood Energy, where recycled batteries and solar become a practical test case for powering compute without waiting on the grid." }],
  },
  {
    name: "Crusoe",
    keywords: ["crusoe", "scott williams", "off-grid compute", "crusoe data centers"],
    picks: [
      { youtube_id: "WA-ITXRwoXo", t: 0, label: "Crusoe's Scott Williams represents the off-grid compute thesis from an operator's view: build where energy is available, then solve the uptime, networking, and deployment realities." },
      { youtube_id: "WA-ITXRwoXo", t: 8, label: "Williams gives a more cautious version of the thesis, explaining why off-grid data centers are promising but not yet a universal replacement for grid-connected sites." },
    ],
  },
  {
    name: "Satoshi Energy",
    keywords: ["satoshi energy", "brock petersen", "andrew myers", "energy markets bitcoin"],
    picks: [
      { youtube_id: "WA-ITXRwoXo", t: 0, label: "Brock Petersen brings Satoshi Energy's power-market lens to off-grid compute, focusing on how offtake, site selection, and grid constraints shape what can be built quickly." },
      { youtube_id: "Vtu-Cmsb_XI", t: 34, label: "Andrew Myers anchors the grid panel in power-market design, asking what the grid should look like if built around flexible loads, open markets, and new compute demand." },
    ],
  },
  {
    name: "Panthalassa",
    keywords: ["panthalassa", "garth sheldon-coulson", "ocean power", "floating compute"],
    picks: [{ youtube_id: "UWobJlMoZP8", t: 0, label: "Garth Sheldon-Coulson presents Panthalassa's ocean-power perspective, making the case that offshore wind, cooling, and mobility can create a new path for energy-intensive compute." }],
  },
  {
    name: "Gigascale",
    keywords: ["gigascale", "mike schroepfer", "schrep", "gigascale capital"],
    picks: [{ youtube_id: "UWobJlMoZP8", t: 0, label: "Mike Schroepfer brings a Gigascale Capital lens to maritime compute, treating ocean-based infrastructure as one of the more radical but plausible responses to AI's power bottleneck." }],
  },
  {
    name: "Energy abundance",
    keywords: ["type i summit energy abundance", "abundant energy", "energy abundance ai"],
    picks: [{ youtube_id: "9tIxNm3mPwg", t: 0, label: "Type I Summit frames energy abundance as the foundation for the next phase of AI, compute, and industrial growth: the goal is not to ration demand, but to build enough power for it." }],
  },
  {
    name: "AI data centers",
    keywords: ["type i summit data centers", "ai data centers grid", "data centers power markets"],
    picks: [{ youtube_id: "ImajAZ4wItk", t: 0, label: "Sam Steyer's Type I talk centers AI data centers as the new driver of grid load growth, forcing utilities and developers to rethink planning around speed, capacity, and power availability." }],
  },
  {
    name: "Bitcoin mining demand response",
    keywords: ["bitcoin mining demand response", "mining flexible load", "mining demand response"],
    picks: [{ youtube_id: "4GScJjcSrwg", t: 0, label: "The mining panel shows how bitcoin miners helped prove flexible-load demand response in practice, a playbook now informing AI infrastructure even though GPUs are less interruption-tolerant than ASICs." }],
  },
]);

addTopicDefs([
  {
    name: "Presidio Bitcoin's Quantum Readiness Report",
    keywords: ["presidio bitcoin quantum readiness", "quantum readiness report", "bitcoin quantum readiness"],
    picks: [
      quantumReportPick("#key-takeaways", "Key Takeaways", "The report frames bitcoin quantum readiness as a living map of exposure, mitigations, and upgrade paths, with practical hygiene now and staged protocol work if credible CRQC signals strengthen."),
    ],
  },
  {
    name: "Cryptographically relevant quantum computers",
    keywords: ["logical qubits", "crqc timeline", "state of quantum computing"],
    picks: [
      quantumReportPick("#state-of-quantum-computing", "State of Quantum Computing", "The report anchors CRQC readiness in logical qubits, error correction, gate depth, and operations per second, separating credible technical milestones from simple headline qubit counts."),
    ],
  },
  {
    name: "Quantum threat modeling",
    keywords: ["quantum exposure", "attack classes", "quantum attacker"],
    picks: [
      quantumReportPick("#how-quantum-affects-bitcoin", "How Quantum Affects bitcoin", "The report separates signature attacks from mining effects, then distinguishes long-range exposed-key theft from short-range mempool races so mitigations can target the right threat."),
    ],
  },
  {
    name: "Long-range attacks",
    keywords: ["long range quantum report", "exposed public keys report"],
    picks: [
      quantumReportPick("#how-quantum-affects-bitcoin", "How Quantum Affects bitcoin", "The report treats long-range attacks as theft from public keys already visible on-chain, especially P2PK outputs, reused addresses, and script paths that leave keys exposed indefinitely."),
    ],
  },
  {
    name: "Short-range attacks",
    keywords: ["short range quantum report", "mempool race quantum"],
    picks: [
      quantumReportPick("#how-quantum-affects-bitcoin", "How Quantum Affects bitcoin", "The report defines short-range attacks as transaction-window races after a public key is revealed, making timing, relay, confirmation policy, and commit-reveal defenses central to the mitigation."),
    ],
  },
  {
    name: "Address reuse",
    keywords: ["custody practices quantum", "address reuse report"],
    picks: [
      quantumReportPick("#custody-practices", "Custody Practices", "The report makes address non-reuse the clearest immediate action for wallets, businesses, and custodians because it reduces unnecessary public-key exposure before any protocol migration is needed."),
    ],
  },
  {
    name: "SPHINCS+",
    keywords: ["sphincs report", "slh-dsa report"],
    picks: [
      quantumReportPick("#post-quantum-cryptography", "Post-Quantum Cryptography", "The report places SPHINCS+/SLH-DSA in the conservative hash-based signature family, emphasizing its mature security assumptions alongside signature-size and usability costs."),
    ],
  },
  {
    name: "Hash-based signatures",
    keywords: ["hash based signature report", "wots xmss report"],
    picks: [
      quantumReportPick("#post-quantum-cryptography", "Post-Quantum Cryptography", "The report surveys hash-based signature paths because bitcoin already depends heavily on hash functions, while noting the engineering trade-offs around larger signatures and state management."),
    ],
  },
  {
    name: "BIP360",
    keywords: ["bip360 report", "output types report", "p2qrh report"],
    picks: [
      quantumReportPick("#output-types", "Output Types", "The report indexes BIP360 as an output-type proposal that could move bitcoin toward quantum-resistant spend paths while keeping algorithm choices and deployment mechanics separate."),
    ],
  },
  {
    name: "Quantum-Safe Bitcoin",
    keywords: ["qsb report", "quantum safe bitcoin report"],
    picks: [
      quantumReportPick("#quantum-safe-bitcoin-qsb", "Quantum-Safe Bitcoin (QSB)", "The report includes QSB as a no-consensus-change experiment that can demonstrate quantum-safe transaction construction today, while making the cost and relay trade-offs explicit."),
    ],
  },
  {
    name: "Quantum migration",
    keywords: ["migration safeguards report", "pqc precommitment"],
    picks: [
      quantumReportPick("#pqc-precommitment-for-post-quantum-migration", "PQC Precommitment", "The report describes PQC precommitment as a way to create migration evidence before a full post-quantum spend path is active, giving users and institutions a preparation step short of consensus change."),
      quantumReportPick("#migration-safeguards", "Migration Safeguards", "The report groups migration safeguards around replay safety, activation discipline, wallet support, monitoring, and rollout mechanics so a quantum response does not become its own failure mode."),
    ],
  },
  {
    name: "Commit-delay-reveal",
    keywords: ["commit delay reveal report", "cdr report"],
    picks: [
      quantumReportPick("#migration-safeguards", "Migration Safeguards", "The report treats commit-delay-reveal style flows as one family of safeguards for reducing front-running and race conditions during a staged quantum migration."),
    ],
  },
  {
    name: "Burn vs. steal",
    keywords: ["legacy coin policy report", "burn steal report"],
    picks: [
      quantumReportPick("#legacy-coin-policy", "Legacy Coin Policy", "The report puts burn-versus-steal inside a broader legacy-coin policy discussion: exposed inactive coins create a legitimacy problem as much as a cryptographic one."),
    ],
  },
  {
    name: "Quantum transition",
    keywords: ["orderly transition report", "legacy coins report"],
    picks: [
      quantumReportPick("#orderly-transition-scenario", "Orderly Transition Scenario", "The report sketches an orderly transition in which monitoring, wallet migration, soft-fork design, ecosystem coordination, and legacy-coin decisions happen before emergency pressure dominates."),
      quantumReportPick("#how-an-orderly-transition-will-likely-work", "How an Orderly Transition Will Likely Work", "The report breaks the transition into likely phases, from early research and signals through tooling, activation, migration pressure, and eventual policy choices for unmoved exposed coins."),
    ],
  },
  {
    name: "Quantum readiness coordination",
    keywords: ["rapid response playbook", "activation triggers", "forward outlook"],
    picks: [
      quantumReportPick("#rapid-response-playbook", "Rapid Response Playbook", "The report turns coordination into a playbook: watch activation triggers, prepare bridge defenses, and define emergency safeguards before a live CRQC theft environment exists."),
      quantumReportPick("#forward-outlook", "Forward Outlook", "The report closes by treating readiness as an ongoing public-good process across research, implementation, custody practice, and communication rather than a single fixed roadmap."),
    ],
  },
  {
    name: "Activation triggers",
    keywords: ["activation triggers", "quantum activation trigger", "crqc trigger"],
    picks: [
      quantumReportPick("#activation-triggers", "Activation Triggers", "The report lists activation triggers as the signals that should move bitcoin readiness from research posture to coordinated action, including credible hardware milestones, public-key theft evidence, and ecosystem preparedness gaps."),
    ],
  },
  {
    name: "Bridge defenses",
    keywords: ["bridge defenses", "quantum bridge defense", "temporary quantum defense"],
    picks: [
      quantumReportPick("#bridge-defenses", "Bridge Defenses", "The report treats bridge defenses as temporary measures that can reduce exposure while a durable post-quantum migration is designed, tested, and activated."),
    ],
  },
  {
    name: "Emergency quantum safeguards",
    keywords: ["emergency safeguard", "live crqc theft", "quantum emergency response"],
    picks: [
      quantumReportPick("#emergency-safeguard-in-a-live-crqc-theft-environment", "Emergency Safeguard", "The report names the emergency case directly: if live CRQC theft appears, bitcoin may need narrowly scoped safeguards that buy time without confusing emergency response for long-term policy."),
    ],
  },
  {
    name: "Bitcoin post-quantum report",
    keywords: ["presidio quantum report", "bitcoin quantum readiness report"],
    picks: [
      quantumReportPick("#context-and-scope", "Context and Scope", "The report sets its scope as exposure, mitigations, and upgrade paths for bitcoin specifically, connecting earlier post-quantum research to practical readiness work."),
    ],
  },
  {
    name: "Quantum mining",
    keywords: ["quantum mining report", "grover report"],
    picks: [
      quantumReportPick("#how-quantum-affects-bitcoin", "How Quantum Affects bitcoin", "The report covers mining separately from signature theft, noting that Grover-style speedups affect proof-of-work economics differently than Shor-style attacks on exposed public keys."),
    ],
  },
]);

addTopicDefs([
  {
    name: "Address reuse",
    keywords: ["institutional address reuse", "exchange address reuse", "custodian address reuse", "etf address reuse", "proof of reserves quantum"],
    picks: [{ youtube_id: "a_B8BnwagEU", t: 431, label: "Institutional address reuse is identified as the largest immediate quantum-hygiene problem: a minority of reused addresses holds a majority of reused-address UTXOs, with exchange and ETF-style custody likely driving much of the exposure. The QBS takeaway is operational rather than speculative: custodians can reduce quantum-vulnerable supply now by changing wallet practices." }], // 7:11
  },
  {
    name: "Shor's algorithm",
    keywords: ["shor's algorithm", "shor algorithm", "ecdsa private key", "public key", "elliptic curve cryptography"],
    picks: [{ youtube_id: "P6URL_vfBwk", t: 0, label: "Shor's algorithm is the load-bearing reason exposed bitcoin public keys matter: a sufficiently capable quantum computer could derive the private key from the public key. Hunter Beast uses that premise to distinguish the four ways public keys become exposed in bitcoin." }], // 0:00
  },
  {
    name: "SPHINCS+",
    keywords: ["sphincs+", "sphincs plus", "slhdsa", "sphinx", "hash-based signatures", "post-quantum signatures"],
    picks: [
      { youtube_id: "oeVnzWGyRq8", t: 1317, label: "SPHINCS+ is treated as a candidate bitcoin-compatible post-quantum signature scheme, with open questions around parameter sets, address derivation, verification cost, and block validation impact. Its appeal is conservative hash-based security, while its cost is large signatures and weaker support for familiar multisig and aggregation patterns." }, // 21:57
      { youtube_id: "P6URL_vfBwk", t: 621, label: "Hunter Beast contrasts SPHINCS+/SLHDSA with other post-quantum schemes and argues it may be the practical default if bitcoin wants conservative cryptography. The trade-off is that signature size, verification speed, and Lightning implications still need careful evaluation." }, // 10:21
    ],
  },
  {
    name: "Lifted FawkesCoin",
    keywords: ["lifted fawkescoin", "fawkescoin", "signature lifting", "post-quantum migration", "picnic signatures"],
    picks: [{ youtube_id: "FgoZCw21SQw", t: 205, label: "Lifted FawkesCoin is Shai Wyborski's proposal for migrating pre-quantum UTXOs after a quantum adversary already exists. It combines FawkesCoin-style commit-delay-reveal with signature lifting and fraud proofs, offering a modular but costly path that can require slow confirmations, online checks, and burning some old UTXOs." }], // 3:25
  },
  {
    name: "Burn vs. steal",
    keywords: ["burn vs steal", "burn versus steal", "freeze quantum coins", "do nothing", "quantum-vulnerable coins"],
    picks: [
      { youtube_id: "rykGVwDGSew", t: 1, label: "Burn vs. steal is the summit's core philosophical dilemma for quantum-vulnerable coins: freeze or invalidate exposed outputs to preserve market integrity, or allow quantum actors to sweep them in order to preserve protocol purity. The panel adds a third path, restriction, where spending is throttled before harsher measures are considered." }, // 0:01
      { youtube_id: "rykGVwDGSew", t: 1, label: "The summit debate compresses burn vs. steal into three options: freeze vulnerable coins, do nothing and let them be swept, or throttle spending through a middle path such as Hourglass. The disagreement turns on property rights, economic stability, and whether intervention itself breaks bitcoin's social contract." }, // 0:01
    ],
  },
  {
    name: "Quantum readiness coordination",
    keywords: ["quantum readiness coordination", "bitcoin-dev mailing list", "delving bitcoin", "presidio bitcoin discord", "post-quantum roadmap"],
    picks: [{ youtube_id: "JUojCIPxzCc", t: 1704, label: "Quantum readiness coordination is framed as ongoing work across the bitcoin-dev mailing list, Delving bitcoin, Presidio Bitcoin's Discord, and future summaries of technical options. The closing panel stresses that bitcoin probably cannot publish a fixed roadmap yet, but it does need shared venues for tracking signatures, wallet guidance, forks, and investor-facing risk communication." }], // 28:24
  },
]);

addTopicDefs([
  {
    name: "Quantum exposure",
    keywords: ["quantum exposure", "exposure mitigations upgrade paths", "exposed-key theft"],
    picks: [
      quantumReportPick("#context-and-scope", "Context and Scope", "The report narrows bitcoin's quantum exposure to theft from coins with exposed public keys, while emphasizing that block production, validation, issuance, and the supply cap remain intact."),
    ],
  },
  {
    name: "Exposed public keys",
    keywords: ["exposed public keys", "public key visible on-chain", "public key exposure"],
    picks: [
      quantumReportPick("#how-quantum-affects-bitcoin", "How Quantum Affects bitcoin", "The report treats exposed public keys as the core unit of quantum risk: once a public key is visible, a sufficiently capable CRQC could derive the corresponding private key."),
    ],
  },
  {
    name: "P2PK outputs",
    keywords: ["p2pk", "pay to public key", "early-era outputs"],
    picks: [
      quantumReportPick("#how-quantum-affects-bitcoin", "How Quantum Affects bitcoin", "The report identifies early Pay-to-Public-Key outputs as structurally exposed because their public keys sit directly on-chain, giving an attacker unlimited time once CRQC capability exists."),
    ],
  },
  {
    name: "Taproot quantum exposure",
    keywords: ["taproot quantum exposure", "p2tr public key", "taproot key path quantum"],
    picks: [
      quantumReportPick("#how-quantum-affects-bitcoin", "How Quantum Affects bitcoin", "The report includes Pay-to-Taproot in the long-range exposure set because P2TR outputs place a public key on-chain, unless future output designs avoid or disable that vulnerable path."),
    ],
  },
  {
    name: "Hashed address formats",
    keywords: ["hashed address formats", "public key hidden until spent", "short-range exposure"],
    picks: [
      quantumReportPick("#how-quantum-affects-bitcoin", "How Quantum Affects bitcoin", "The report distinguishes hashed address formats from exposed-key outputs: they are generally safe at rest, but become short-range targets during the spend window when the public key is revealed."),
    ],
  },
  {
    name: "Quantum-vulnerable supply",
    keywords: ["6.5 million btc", "one third supply quantum", "vulnerable supply"],
    picks: [
      quantumReportPick("#how-quantum-affects-bitcoin", "How Quantum Affects bitcoin", "The report cites a June 2025 estimate that roughly 6.5 million BTC, about one-third of supply, would be vulnerable to long-range theft if a CRQC existed today."),
    ],
  },
  {
    name: "Custodian quantum hygiene",
    keywords: ["custodian quantum hygiene", "institutional address reuse", "custody quantum practices"],
    picks: [
      quantumReportPick("#custody-practices", "Custody Practices", "The report argues that large custodians can reduce a major share of long-range exposure immediately by rotating keys and ending operational address reuse, without waiting for a protocol change."),
    ],
  },
  {
    name: "Post-quantum signatures",
    keywords: ["post-quantum signatures", "pq signatures", "signature scheme migration"],
    picks: [
      quantumReportPick("#post-quantum-cryptography", "Post-Quantum Cryptography", "The report frames post-quantum signatures as the core protocol mitigation, likely starting with conservative optional paths before more efficient schemes mature."),
    ],
  },
  {
    name: "Lattice-based signatures",
    keywords: ["lattice-based signatures", "compact post-quantum signatures", "lattice cryptography"],
    picks: [
      quantumReportPick("#post-quantum-cryptography", "Post-Quantum Cryptography", "The report contrasts lattice-based signatures with hash-based signatures: they are more compact and fee-efficient, but rely on newer assumptions that may need more maturity before bitcoin adopts them."),
    ],
  },
  {
    name: "Output types",
    keywords: ["output types", "spend paths", "taproot-like output types"],
    picks: [
      quantumReportPick("#output-types", "Output Types", "The report uses output types to organize how bitcoin could add quantum-secure spend paths alongside today's signatures, giving holders a way to prepare without immediately abandoning existing behavior."),
    ],
  },
  {
    name: "Pay-to-Merkle-Root",
    keywords: ["pay-to-merkle-root", "p2mr", "bip 360 p2mr"],
    picks: [
      quantumReportPick("#output-types", "Output Types", "The report describes BIP360's Pay-to-Merkle-Root as a Taproot-style output that avoids exposing a public key upfront, while still needing careful handling of address reuse and future signature paths."),
    ],
  },
  {
    name: "Pay-to-Quantum-safe",
    keywords: ["pay-to-quantum-safe", "p2q", "quantum-safe output"],
    picks: [
      quantumReportPick("#output-types", "Output Types", "The report presents P2Q as a middle-path output type: preserve Taproot-like behavior today, then disable the vulnerable key path by soft fork if quantum risk becomes urgent."),
    ],
  },
  {
    name: "PQC precommitment",
    keywords: ["pqc precommitment", "post-quantum precommitment", "future pq spend path"],
    picks: [
      quantumReportPick("#pqc-precommitment-for-post-quantum-migration", "PQC Precommitment", "The report explains PQC precommitment as a way to embed a future post-quantum spend path under today's rules so an eventual soft fork can activate safety without forcing another move."),
    ],
  },
  {
    name: "Binohash",
    keywords: ["binohash", "hash-to-signature puzzle", "qsb binohash"],
    picks: [
      quantumReportPick("#quantum-safe-bitcoin-qsb", "Quantum-Safe Bitcoin (QSB)", "The report identifies Binohash as the hash-based construction behind QSB's no-consensus-change quantum-resistant transaction path, with high compute cost as the main trade-off."),
    ],
  },
  {
    name: "Testing environments",
    keywords: ["testing environments", "post-quantum testing", "production testing quantum"],
    picks: [
      quantumReportPick("#testing-environments", "Testing Environments", "The report points to lower-stakes production environments as the place to gather performance data and operational experience before proposing bitcoin mainnet changes."),
    ],
  },
  {
    name: "Liquid SHRINCS deployment",
    keywords: ["liquid shrincs", "blockstream shrincs", "shrincs verifier liquid"],
    picks: [
      quantumReportPick("#testing-environments", "Testing Environments", "The report cites Blockstream Research's March 2026 SHRINCS verifier deployment on Liquid as a live test of post-quantum signature infrastructure on bitcoin-adjacent rails."),
    ],
  },
  {
    name: "Anduro quantum testing",
    keywords: ["anduro quantum", "sidechain testing", "post-quantum sidechain"],
    picks: [
      quantumReportPick("#testing-environments", "Testing Environments", "The report names Anduro and other sidechains as lower-stakes environments for testing post-quantum functionality before bitcoin base-layer deployment."),
    ],
  },
  {
    name: "Private mempools",
    keywords: ["private mempools", "direct miner submission", "short-range theft shield"],
    picks: [
      quantumReportPick("#migration-safeguards", "Migration Safeguards", "The report treats private mempools as an undesirable but possible bridge defense if public broadcast would expose keys during a short-range CRQC threat window."),
    ],
  },
  {
    name: "MARA Slipstream",
    keywords: ["mara slipstream", "slipstream private mempool", "miner direct submission"],
    picks: [
      quantumReportPick("#migration-safeguards", "Migration Safeguards", "The report uses MARA Slipstream as the concrete example of direct miner submission that could hide a vulnerable spend from the public mempool until confirmation."),
    ],
  },
  {
    name: "Legacy coin policy",
    keywords: ["legacy coin policy", "legacy spends", "unmigrated coins"],
    picks: [
      quantumReportPick("#legacy-coin-policy", "Legacy Coin Policy", "The report frames unmigrated legacy coins as the likely social fault line: leave them spendable, throttle them, or freeze them with a recovery path."),
    ],
  },
  {
    name: "Throttle legacy spends",
    keywords: ["throttle legacy spends", "slow legacy spends", "rate-limit p2pk"],
    picks: [
      quantumReportPick("#legacy-coin-policy", "Legacy Coin Policy", "The report lists throttling as a middle policy between steal and freeze, slowing vulnerable legacy spends rather than immediately invalidating them."),
    ],
  },
  {
    name: "Soft-freeze recovery",
    keywords: ["soft-freeze", "freeze with recovery path", "legacy recovery"],
    picks: [
      quantumReportPick("#legacy-coin-policy", "Legacy Coin Policy", "The report describes soft-freeze as turning off legacy spends while preserving a recovery path for owners who can prove control through quantum-resistant evidence."),
    ],
  },
  {
    name: "Seed phrase recovery",
    keywords: ["seed phrase recovery", "zero-knowledge seed phrase", "zk recovery quantum"],
    picks: [
      quantumReportPick("#legacy-coin-policy", "Legacy Coin Policy", "The report notes that many legacy coins could be recovered through zero-knowledge proof of seed phrase control, since a CRQC cannot derive an ordered seed phrase from an exposed public key."),
    ],
  },
  {
    name: "Migration capacity",
    keywords: ["migration capacity", "25% block space", "90% of bitcoin value"],
    picks: [
      quantumReportPick("#key-takeaways", "Key Takeaways", "The report argues migration capacity is probably not the bottleneck: dedicating about 25% of block space could move most bitcoin value in days to weeks."),
    ],
  },
  {
    name: "CRQC rapid response",
    keywords: ["crqc rapid response", "rapid response quantum", "live theft response"],
    picks: [
      quantumReportPick("#rapid-response-playbook", "Rapid Response Playbook", "The report's rapid-response playbook turns an abrupt CRQC scenario into operational stages: triggers, bridge defenses, emergency safeguards, and communication discipline."),
    ],
  },
  {
    name: "Bitcoin-dev quantum activity",
    keywords: ["bitcoin-dev quantum", "development mailing list quantum", "delving bitcoin quantum"],
    picks: [
      quantumReportPick("#mitigations", "Mitigations", "The report uses bitcoin-dev mailing-list activity as a readiness signal, noting that quantum-related discussion has grown sharply as developers engage concrete mitigation proposals."),
    ],
  },
  {
    name: "Quantum governance risk",
    keywords: ["quantum governance risk", "coordination risk", "distributed governance quantum"],
    picks: [
      quantumReportPick("#key-takeaways", "Key Takeaways", "The report identifies coordination and speed as the main risks to a successful post-quantum transition, more than the raw feasibility of post-quantum cryptography."),
    ],
  },
  {
    name: "Quantum fork risk",
    keywords: ["quantum fork risk", "legacy coins fork", "market resolves fork"],
    picks: [
      quantumReportPick("#legacy-coin-policy", "Legacy Coin Policy", "The report says legacy-coin policy is the likeliest quantum fault line for a fork, with the market ultimately resolving which policy set carries legitimacy."),
    ],
  },
]);

addTopicDefs([
  {
    name: "Cryptographically relevant quantum computers",
    keywords: ["cryptographically relevant quantum computer", "crqc", "fault-tolerant quantum computing", "ftqc", "logical qubits", "error correction", "phase transition", "quantum roadmap", "ecdsa quantum"],
    picks: [
      { youtube_id: "MKLHjaj2Boo", t: 0, label: "Sho Sugiura frames the state of quantum computing around the path to cryptographically relevant quantum computers: error correction, logical qubits, hardware architectures, and the maturity of the surrounding software stack. The key bitcoin implication is that ECDSA is one of the clearer cryptographic targets once the hardware becomes reliable enough." }, // 0:00
      { youtube_id: "MKLHjaj2Boo", t: 768, label: "Sho Sugiura frames FTQC as the post-NISQ roadmap built around error correction, logical qubits, and component maturity. The point is not that bitcoin is immediately breakable, but that hardware roadmaps toward cryptographically relevant quantum computers make the next five years important to watch." }, // 12:48
      { youtube_id: "ZIOhF9Ne8KI", t: 140, label: "Fault-tolerant quantum computing is described as a phase transition: once a system is large enough and error rates are low enough, useful quantum computation can arrive quickly rather than linearly. The panel treats FTQC as the milestone that turns quantum risk from abstract research into a bitcoin-relevant timeline question." }, // 2:20
      { youtube_id: "ZIOhF9Ne8KI", t: 202, label: "The Q&A moves from generic quantum timelines to concrete CRQC milestones: logical qubit quality, error rates, compute speed, cryogenic bottlenecks, and whether public commercial roadmaps reveal the real state of the art. The panel treats the timeline as uncertain but no longer dismissible." }, // 3:22
    ],
  },
  {
    name: "Photonic quantum computing",
    keywords: ["photonic quantum computing", "psiquantum", "terry rudolph", "photonic architecture", "entangled photons"],
    picks: [
      { youtube_id: "MKLHjaj2Boo", t: 191, label: "Photonic quantum computing is presented as one of the major architecture paths alongside superconducting, ion-trap, and neutral-atom systems. The discussion focuses on scaling and error correction rather than treating quantum progress as a single monolithic curve." }, // 3:11
      { youtube_id: "ZIOhF9Ne8KI", t: 487, label: "Terry Rudolph explains why PsiQuantum made a large bet on photonics and why architecture choice matters for fault-tolerant scale. The panel uses photonics to ground the broader question of which hardware paths could realistically reach a CRQC." }, // 8:07
    ],
  },
  {
    name: "Bitcoin post-quantum report",
    keywords: ["bitcoin post quantum report", "chaincode labs", "clara shikhelman", "pq-bitcoin", "bitcoin quantum report"],
    picks: [{ youtube_id: "FNqYU9TudRU", t: 0, label: "Clara Shikhelman uses the Chaincode Labs bitcoin post-quantum report as a structured map of the threat: signatures, mining, migration, mitigation, and timelines. The talk makes clear that bitcoin's quantum problem is both an engineering problem and a governance problem." }], // 0:00
  },
  {
    name: "Quantum-vulnerable UTXOs",
    keywords: ["quantum vulnerable utxos", "quantum vulnerable bitcoin", "pay to pubkey", "p2pk", "reused addresses", "taproot exposure"],
    picks: [
      { youtube_id: "a_B8BnwagEU", t: 24, label: "Anthony Milton quantifies bitcoin's immediately quantum-vulnerable surface at roughly 6.5 million BTC, or about 32% of current supply, across exposed script types, reused addresses, Taproot, and fork exposure. The point is to turn vague quantum concern into measurable UTXO categories that wallets, exchanges, and developers can reason about." }, // 0:24
      { youtube_id: "rykGVwDGSew", t: 1, label: "The quantum-vulnerable coins panel centers the policy choice around exposed outputs: allow them to be swept, throttle liquidation, or freeze them before a CRQC can turn old public keys into spendable coins. The discussion treats P2PK and reused-address coins as both a technical risk and a property-rights dilemma." }, // 0:01
    ],
  },
  {
    name: "Quantum threat modeling",
    keywords: ["quantum threat modeling", "intent capability consequence", "economic attacker", "strategic attacker", "ideological attacker"],
    picks: [{ youtube_id: "6ryfWyeO-Oc", t: 29, label: "Alex Pruden and Matthew Pines reframe quantum risk as intent, capability, and consequence rather than hardware timelines alone. They separate economic, strategic, and ideological adversaries so bitcoin defenses can be evaluated against who would actually attack and why." }], // 0:29
  },
  {
    name: "Hash-based signatures",
    keywords: ["hash-based signatures", "sphincs+", "slhdsa", "wots", "fors", "xmss", "post-quantum signatures"],
    picks: [{ youtube_id: "oeVnzWGyRq8", t: 37, label: "Olaoluwa Osuntokun argues for hash-based signatures as a conservative post-quantum path because their security reduces to hash functions bitcoin already depends on. The talk covers SPHINCS+, WOTS+, FORS, XMSS, statelessness, signature-size tuning, and how wallet assumptions change when public-key derivation goes away." }], // 0:37
  },
  {
    name: "BIP360",
    keywords: ["bip360", "bip 360", "p2qrh", "pay to quantum resistant hash", "hunter beast", "taproot quantum"],
    picks: [{ youtube_id: "P6URL_vfBwk", t: 811, label: "BIP360 is presented as a focused soft-fork path that removes vulnerable Taproot key-spend assumptions and creates a pay-to-quantum-resistant-hash style output. Hunter Beast emphasizes narrowing the proposal so signature algorithms can be evaluated separately rather than bundled into one oversized bitcoin change." }], // 13:31
  },
  {
    name: "Long-range attacks",
    keywords: ["long-range attack", "long range attack", "long exposure attack", "exposed public keys", "satoshi coins", "pay to pubkey", "reused addresses"],
    picks: [{ youtube_id: "P6URL_vfBwk", t: 57, label: "Long-range attacks target public keys that have been visible on-chain for years, including P2PK outputs, reused addresses, and other already-exposed keys. The category matters because it creates a persistent pool of quantum-vulnerable coins rather than a brief transaction-confirmation race." }], // 0:57
  },
  {
    name: "Short-range attacks",
    keywords: ["short-range attack", "short range attack", "short exposure attack", "mempool quantum", "transaction broadcast quantum", "public key reveal"],
    picks: [
      { youtube_id: "P6URL_vfBwk", t: 57, label: "Short-range attacks are the mempool-window version of bitcoin's quantum problem: a public key is revealed when a user spends, and an attacker must derive the private key quickly enough to race the legitimate transaction. Hunter Beast separates this from long-range exposure because the hardware requirements and mitigations are very different." }, // 0:57
      { youtube_id: "4bzOwYPf1yo", t: 7, label: "Tadge Dryja presents short-range attacks as the specific threat Lifeboat is meant to address: theft during the narrow interval after a transaction exposes a public key but before it confirms. The mitigation focuses on commit/reveal mechanics rather than a full post-quantum signature migration." }, // 0:07
    ],
  },
  {
    name: "Lifeboat",
    keywords: ["lifeboat", "commit reveal", "commit/reveal", "short-range quantum attack", "tadge dryja", "fawkescoin"],
    picks: [{ youtube_id: "4bzOwYPf1yo", t: 7, label: "Lifeboat is Tadge Dryja's lightweight commit/reveal mechanism for short-range quantum attacks, where a public key is exposed only after a transaction enters the spend path. It uses commitments rather than a full post-quantum signature scheme, making it a narrow safety tool rather than a complete migration plan." }], // 0:07
  },
  {
    name: "Hourglass proposal",
    keywords: ["hourglass", "hourglass v1", "hourglass v2", "p2pk throttling", "quantum liquidation", "bloom filters"],
    picks: [{ youtube_id: "wosVFIGhiKg", t: 9, label: "Mike Casey's Hourglass proposal aims to slow quantum theft rather than freeze coins outright. V1 throttles exposed P2PK spends to one per block, while V2 extends the idea to revealed public keys with bloom filters and fee constraints to reduce mass-liquidation and miner-collusion risk." }], // 0:09
  },
  {
    name: "Quantum migration",
    keywords: ["quantum migration", "post-quantum migration", "migration incentives", "quantum recovery", "soft fork quantum"],
    picks: [
      { youtube_id: "iQVrZEGKnfg", t: 413, label: "Jameson Lopp frames quantum migration as a collision between bitcoin's slow consensus process and a potentially fast-moving CRQC threat. The hard part is not only choosing cryptography, but creating incentives, recovery paths, and soft-fork mechanics that do not cause more chaos than the attack." }, // 6:53
      { youtube_id: "FgoZCw21SQw", t: 2, label: "Shai Wyborski presents a post-break migration framework that can protect some pre-quantum UTXOs without immediately relying on post-quantum signatures. The proposal combines commitments, zero-knowledge proofs, fraud proofs, and on-chain activation ideas to recover symmetry after an attacker appears." }, // 0:02
    ],
  },
  {
    name: "Commit-delay-reveal",
    keywords: ["commit delay reveal", "cdr cycle", "commitment scheme", "quantum migration", "fawkescoin"],
    picks: [{ youtube_id: "FgoZCw21SQw", t: 749, label: "Commit-delay-reveal is Shai Wyborski's core migration primitive: commit first, wait long enough to blunt front-running, then reveal the transaction. The repeated CDR cycle is meant to let honest owners prove claims even after ECDSA is no longer safe." }], // 12:29
  },
  {
    name: "Quantum-resistant rollups",
    keywords: ["quantum-resistant rollups", "validity rollups", "bitcoin rollups", "john light", "alpen labs", "op_cat"],
    picks: [{ youtube_id: "DJFQh_1xxDg", t: 5, label: "John Light presents validity rollups as a way to move post-quantum transaction capacity off Bitcoin L1 while preserving self-custody and trustless exits. The argument is that rollups can support new signature schemes and proof systems faster than the base layer, if bitcoin gains the needed verification hooks." }], // 0:05
  },
  {
    name: "Quantum-resistant sidechains",
    keywords: ["quantum-resistant sidechains", "anduro", "qbtc", "sidechain", "merged mining", "quantum bridge", "side-chain"],
    picks: [{ youtube_id: "10YEVDhcjsw", t: 47, label: "Quantum-resistant sidechains are presented as a way to experiment with post-quantum defenses without waiting for Bitcoin L1 consensus. The qBTC and Anduro discussion focuses on fallback infrastructure, bridge security, merge mining, bitcoin-pegged assets, and using sidechain features to protect users from short-range attacks." }], // 0:47
  },
  {
    name: "Yellowpages",
    keywords: ["yellowpages", "project 11 yellowpages", "post-quantum recovery", "mldsa", "slhdsa", "tee"],
    picks: [{ youtube_id: "AVuFK9T6hxU", t: 1, label: "Project 11's yellowpages is live infrastructure for asserting ownership of ECDSA UTXOs in a post-quantum recovery scenario. It uses dual post-quantum signatures, TEEs, and off-chain claims so users can establish a recovery record without publishing their bitcoin public keys." }], // 0:01
  },
  {
    name: "BitZip",
    keywords: ["bitzip", "stark aggregation", "post-quantum signature scaling", "ethan heilman", "john light"],
    picks: [{ youtube_id: "OYaI3fXMUwM", t: 0, label: "BitZip addresses the throughput problem created by large post-quantum signatures on Bitcoin L1. The proposal removes individual post-quantum signatures from blocks and replaces them with a single STARK proof that verifies the included transactions." }], // 0:00
  },
  {
    name: "Quantum mining",
    keywords: ["quantum mining", "grover's algorithm", "difficulty increase attack", "quantum miner", "bitcoin mining quantum"],
    picks: [{ youtube_id: "0pKbiS-u-fw", t: 49, label: "Or Sattath shows that quantum mining is not just faster ASIC mining: Grover's algorithm changes miner strategy, stale-rate dynamics, tie-breaking rules, and difficulty-adjustment assumptions. The talk includes a 51% attack via difficulty increase, while noting why the attack is not yet practical." }], // 0:49
  },
  {
    name: "Quantum transition",
    keywords: ["freeze quantum vulnerable coins", "do nothing", "burn vs freeze", "quantum property rights", "bip361"],
    picks: [
      { youtube_id: "JUojCIPxzCc", t: 435, label: "The closing panel treats burn versus freeze as the hardest social question in bitcoin's quantum transition. The technical path is inseparable from property rights, wallet behavior, business risk, miner incentives, and whether developers can even coordinate a roadmap without creating panic." }, // 7:15
      { youtube_id: "rykGVwDGSew", t: 1, label: "The quantum-vulnerable coins panel debates the cleanest response to exposed coins: freeze and maybe recover later, or do nothing and accept the consequences. Mike Casey's Hourglass framing appears as a middle path that slows liquidation without fully deciding ownership." }, // 0:01
    ],
  },
  {
    name: "Address reuse",
    keywords: ["address reuse", "do not reuse addresses", "wallet quantum hygiene", "public key exposure"],
    picks: [
      { youtube_id: "FNqYU9TudRU", t: 512, label: "Clara Shikhelman turns quantum risk into the simplest user action: do not reuse addresses. Address reuse unnecessarily exposes public keys and makes the same bad privacy habit also a quantum-hygiene failure." }, // 8:32
      { youtube_id: "JUojCIPxzCc", t: 1085, label: "The closing panel returns to address reuse as the rare quantum preparation step that users, wallets, and businesses can take immediately. The advice is practical: improve wallet defaults and pressure entities that reuse addresses before the risk becomes urgent." }, // 18:05
    ],
  },
  {
    name: "Quantum Bitcoin Summit",
    keywords: ["qbs", "quantum bitcoin summit recap", "quantum summit takeaways", "quantum bitcoin"],
    picks: [{ youtube_id: "WeEZJmKlsAE", t: 0, label: "The Quantum Bitcoin Summit recap distills the event into the key unresolved buckets: CRQC timelines, post-quantum signatures, vulnerable coins, burn-versus-steal dilemmas, Hourglass, tail emissions, and the risk that fear itself becomes a coordination problem." }], // 0:00
  },
]);

addTopicDefs([
  {
    name: "Vibe coding security",
    keywords: ["vibe coding security", "bitcoin app security", "ai generated code", "secure vibe coding"],
    picks: [{ youtube_id: "_5WG0yIa8Pc", t: 627, label: "Vibe coding security is treated as the key constraint on building bitcoin products with AI. The hosts are optimistic about the idea surface, but distinguish low-risk prototypes from applications that touch keys, custody, and real money." }], // 10:27
  },
  {
    name: "Bitcoin price cycles",
    keywords: ["four year cycle", "bitcoin cycle", "price cycle", "bitcoin predictions"],
    picks: [{ youtube_id: "_5WG0yIa8Pc", t: 3021, label: "The 4-year cycle is revisited through the 2025 prediction review, with DK and Max still expecting more upside. The segment matters less as price prediction than as a check on whether old cycle heuristics still apply in an ETF, treasury-company, and policy-driven market." }], // 50:21
  },
  {
    name: "Bitcoin ₿ symbol",
    keywords: ["bitcoin symbol prediction", "b symbol", "bitcoin unit", "consumer bitcoin display"],
    picks: [{ youtube_id: "_5WG0yIa8Pc", t: 4913, label: "Steve's lone new prediction is that the Bitcoin ₿ symbol becomes the dominant consumer unit marker in 2026. The idea is that UI standardization can make bitcoin feel less like a technical asset and more like ordinary money." }], // 1:21:53
  },
  {
    name: "Bitcoin merchant community",
    keywords: ["bitcoin merchant community", "merchant community", "merchant businesses", "join today"],
    picks: [{ youtube_id: "H5dDVTNY4R4", t: 710, label: "The Bitcoin Merchant Community is described as having reached a few thousand businesses, making merchant adoption feel like an organized network rather than scattered anecdotes. The call to join turns payment acceptance into a coordinated distribution effort." }], // 11:50
  },
  {
    name: "Spaces protocol",
    keywords: ["spaces protocol", "bitcoin names", "dns bitcoin address", "own your address"],
    picks: [{ youtube_id: "H5dDVTNY4R4", t: 3665, label: "Spaces protocol is raised as a possible answer to DNS-based human bitcoin address concerns. The underlying issue is whether people can own a readable payment name without being locked by domain registrars or external naming authorities." }], // 1:01:05
  },
  {
    name: "Prediction markets",
    keywords: ["prediction markets mainstream", "gambling investing", "tails", "markets"],
    picks: [{ youtube_id: "SqExLGqYIhc", t: 497, label: "Prediction markets going mainstream prompts a distinction between gambling and investing at the tails. The hosts treat the category as culturally important because it changes how people price uncertainty, risk, and conviction in public." }], // 8:17
  },
  {
    name: "AI security",
    keywords: ["ai hacking", "bitcoin target", "ai security", "core contributors ai"],
    picks: [{ youtube_id: "SqExLGqYIhc", t: 2596, label: "AI security is framed as a looming bitcoin problem because better hacking tools will make bitcoin a more attractive target. The hosts connect AI-written BIPs, AI-assisted Core work, and adversarial AI to the need for stronger review and defensive tooling." }], // 43:16
  },
  {
    name: "Open-source models",
    keywords: ["open source models", "local models", "frontier models", "ai bifurcation"],
    picks: [{ youtube_id: "SqExLGqYIhc", t: 4278, label: "Open-source models are contrasted with frontier cloud models as AI splits into local control and maximum capability. The hosts see the bifurcation as central to privacy, sovereignty, and whether users can keep sensitive work off closed platforms." }], // 1:11:18
  },
  {
    name: "Block",
    keywords: ["block investor day", "block bitcoin", "investor day bitcoin", "square bitcoin strategy"],
    picks: [{ youtube_id: "VdQp4TXf4B4", t: 1114, label: "Block Investor Day is read as a test of whether mainstream investors understand Block's bitcoin strategy. The segment focuses on how bitcoin payments, Square merchants, and Cash App fit into a long-term platform story that may not map neatly to quarterly expectations." }], // 18:34
  },
  {
    name: "Bitcoin migration mechanics",
    keywords: ["migration mechanics", "frozen coins", "burned coins", "quantum migration", "contentious fork"],
    picks: [{ youtube_id: "VdQp4TXf4B4", t: 2955, label: "Bitcoin migration mechanics become the practical question behind quantum fear: should vulnerable coins be frozen, burned, or left exposed during a transition. The hosts connect the technical migration path to the political risk of a contentious fork." }], // 49:15
  },
  {
    name: "Bitcoin vs. Stripe",
    keywords: ["bitcoin versus stripe", "stripe payments", "bitcoin payments competition", "developer experience"],
    picks: [{ youtube_id: "VdQp4TXf4B4", t: 5105, label: "Bitcoin versus Stripe is framed as a developer-experience and distribution fight, not only a fee comparison. Bitcoin can win where permissionless settlement and global reach matter, but only if SDKs, docs, and support feel competitive to ordinary builders." }], // 1:25:05
  },
  {
    name: "Stablecoins",
    keywords: ["stablecoins lightning", "cash app stablecoins", "stablecoins compete", "lightning dollars"],
    picks: [{ youtube_id: "_FwG1hkNVUE", t: 3152, label: "Stablecoins are compared with Cash App's dollar-over-Lightning path: both can hide volatile BTC from users, but Lightning keeps the settlement network bitcoin-native. The hosts use the comparison to ask whether stablecoins and Lightning compete or converge in consumer payment UX." }], // 52:32
  },
  {
    name: "Bitcoin in space",
    keywords: ["bitcoin in space", "space bitcoin", "satellite bitcoin", "space energy"],
    picks: [{ youtube_id: "EzdLVuu7gA0", t: 357, label: "Bitcoin in space appears as part of the frontier-energy conversation rather than a novelty. Serious space players were interested in whether mining could subsidize launch economics, making bitcoin a possible first buyer for infrastructure beyond normal grids." }], // 5:57
  },
  {
    name: "Steak n Shake",
    keywords: ["steak n shake", "steak and shake", "restaurant bitcoin", "merchant bitcoin reserve"],
    picks: [
      { youtube_id: "aVWpAjRIIEM", t: 870, label: "Steak n Shake's bitcoin reserve in the Square style becomes a concrete merchant-adoption example: accept payments, retain some BTC, and let operations create accumulation. The hosts contrast this slower payment-driven model with leverage-heavy treasury strategies." }, // 14:30
      { youtube_id: "ogQ2z9lBHC8", t: 300, label: "Steak n Shake accepting bitcoin is treated as an early real-world test of whether recognizable consumer brands can make bitcoin payments feel normal. The point is not the restaurant alone, but whether mainstream merchants can generate repeated payment behavior." }, // 5:00
    ],
  },
  {
    name: "Bitcoin merchant association",
    keywords: ["bitcoin merchant association", "bitcoin chamber of commerce", "merchant chamber", "merchant organization"],
    picks: [
      { youtube_id: "aVWpAjRIIEM", t: 1833, label: "The Bitcoin Merchant Association idea turns merchant adoption into an institution-building problem. The hosts imagine a repeatable structure for education, local coordination, and merchant support rather than relying on one-off enthusiasm." }, // 30:33
      { youtube_id: "Zxtndnb0AHw", t: 884, label: "A Bitcoin Merchant Association or Chamber of Commerce is proposed as the organizing layer around Square adoption. The goal is to give merchants simple materials, peer validation, and a shared identity around accepting bitcoin." }, // 14:44
    ],
  },
  {
    name: "Bitcoin savings bonds",
    keywords: ["bitcoin savings bonds", "savings bonds", "bitcoin bonds", "traditional savings"],
    picks: [{ youtube_id: "aVWpAjRIIEM", t: 3215, label: "Bitcoin savings bonds are floated as a way to remake familiar paper-based savings products for a bitcoin world. The interesting part is not nostalgia, but packaging bitcoin time preference and custody into a form normal savers already understand." }], // 53:35
  },
  {
    name: "Economic nodes",
    keywords: ["running a node", "node is not a vote", "economic nodes", "bitcoin governance"],
    picks: [{ youtube_id: "aVWpAjRIIEM", t: 4983, label: "The claim that running a node is not a vote reframes bitcoin governance around actual economic behavior. The hosts distinguish symbolic node counts from the harder question of what software users, businesses, and miners actually enforce when conflict appears." }], // 1:23:03
  },
  {
    name: "Privacy coins",
    keywords: ["privacy coins", "zcash privacy", "cypherpunk privacy", "hard money privacy"],
    picks: [{ youtube_id: "Zxtndnb0AHw", t: 2588, label: "Privacy coins are discussed through Zcash's renewed popularity and the different meanings of privacy in money. The hosts separate Austrian hard-money instincts from cypherpunk privacy instincts, asking what bitcoin must preserve to keep users from seeking privacy elsewhere." }], // 43:08
  },
  {
    name: "Cashu",
    keywords: ["cashu", "signal cashu", "ecash", "messenger payments", "mints"],
    picks: [{ youtube_id: "ESPiivspKsU", t: 1641, label: "Cashu is examined as a possible payment architecture for Signal because it can make small private payments feel simple. The trade-off is the mint model: better UX and privacy come with questions about reliability, regulation, and who operates the mint." }], // 27:21
  },
  {
    name: "Bitcoin stickers",
    keywords: ["bitcoin stickers", "square stickers", "merchant stickers", "payment signage"],
    picks: [{ youtube_id: "ESPiivspKsU", t: 2548, label: "Bitcoin stickers are treated as adoption infrastructure: visible merchant signage tells customers bitcoin is actually usable at the point of sale. The hosts see stickers as a low-tech but necessary bridge between product support and consumer behavior." }], // 42:28
  },
  {
    name: "Physical Bitcoin",
    keywords: ["physical bitcoin", "gold at costco", "bitcoin gift", "bitcoin bearer"],
    picks: [{ youtube_id: "ESPiivspKsU", t: 3188, label: "Physical bitcoin is explored through the surprising appeal of buying gold at Costco. The hosts ask whether bitcoin needs more tangible products or gifting experiences to make digital ownership feel concrete to normal people." }], // 53:08
  },
  {
    name: "Ark",
    keywords: ["ark", "ark spark lightning", "bitcoin l2", "second.tech"],
    picks: [{ youtube_id: "BmfqFfY_ZnQ", t: 635, label: "Ark is compared with Spark and Lightning as part of the fast-moving bitcoin scaling stack. The hosts focus on how these systems can work together to onboard more users, while noting that different trust and liquidity trade-offs make the category hard to explain." }], // 10:35
  },
  {
    name: "Bitcoin difficulty adjustment",
    keywords: ["difficulty adjustment", "bitcoin energy", "bitcoin nobel", "complexity science"],
    picks: [{ youtube_id: "BmfqFfY_ZnQ", t: 2953, label: "The bitcoin difficulty adjustment is presented as the hidden bridge between digital demand and physical energy. In the Santa Fe Institute framing, it is the mechanism that lets bitcoin act like a market signal for energy systems rather than just a power consumer." }], // 49:13
  },
  {
    name: "Bitcoin node operation",
    keywords: ["run a node", "ease of running a node", "node operation", "bitcoin node"],
    picks: [
      { youtube_id: "tfBVyn-KDdc", t: 1877, label: "Bitcoin node operation becomes part of the Core v30 debate because the cost and ease of running a node shape who can verify the system. The hosts separate legitimate concern over node burden from panic that distracts from more concrete centralization vectors." }, // 31:17
      { youtube_id: "RZ17F1urYzg", t: 969, label: "The point of running a full node is framed as personal verification rather than status signaling. The hosts ask who actually needs to run one, what trade-offs users accept, and how implementation diversity changes the meaning of node choice." }, // 16:09
    ],
  },
  {
    name: "Cloudflare",
    keywords: ["cloudflare agents", "cloudflare chain", "stablecoin agents", "centralized chain"],
    picks: [{ youtube_id: "tfBVyn-KDdc", t: 3070, label: "Cloudflare's agent-focused stablecoin chain is treated as another sign that large infrastructure companies want to own payment rails for AI. The contrast with bitcoin is neutrality: convenience may arrive first from centralized platforms, but open rails remain strategically different." }], // 51:10
  },
  {
    name: "AI-generated media",
    keywords: ["ai-generated videos", "vibes", "attention algorithms", "dystopian media"],
    picks: [{ youtube_id: "tfBVyn-KDdc", t: 3762, label: "AI-generated media is discussed through Vibes-style video feeds and the anxiety that synthetic content will intensify attention capture. The segment connects AI media to the broader problem of algorithmic environments shaping what people notice and believe." }], // 1:02:42
  },
  {
    name: "Bitcoin startup applications",
    keywords: ["bitcoin applications", "breakout bitcoin company", "bitcoin startups", "bitcoin app layer"],
    picks: [{ youtube_id: "n4G1syj-mxw", t: 771, label: "The next breakout bitcoin company is expected to move from infrastructure into applications. Better tools, AI-assisted development, and payment primitives make it more plausible that builders can finally ship consumer or business apps on bitcoin instead of only wallets and infrastructure." }], // 12:51
  },
  {
    name: "ZIRP psychology",
    keywords: ["zirp psychology", "zero interest rates", "silicon valley investing", "bitcoin investors"],
    picks: [{ youtube_id: "n4G1syj-mxw", t: 2521, label: "ZIRP psychology is used to explain why Silicon Valley investors often missed bitcoin. A decade of cheap capital trained people to chase venture-style equity upside, while bitcoin's savings and monetary thesis required a different mental model." }], // 42:01
  },
  {
    name: "Bitcoin understanding",
    keywords: ["bitcoin understanding", "litmus test", "trust versus smarts", "who gets bitcoin"],
    picks: [{ youtube_id: "n4G1syj-mxw", t: 2696, label: "Bitcoin understanding is framed as a litmus test about trust more than intelligence. Smart people can miss bitcoin if they trust existing institutions enough to treat its threat model as irrelevant." }], // 44:56
  },
  {
    name: "Solar cost curves",
    keywords: ["solar maximalism", "solar cost curves", "energy cost curves", "solar bitcoin"],
    picks: [{ youtube_id: "hjIJ9PHYa-w", t: 720, label: "Solar cost curves are discussed as part of the Type One energy thesis: if solar keeps getting cheaper, the bottleneck shifts toward storage, transmission, financing, and demand. Bitcoin and AI become ways to monetize or justify capacity that otherwise arrives unevenly." }], // 12:00
  },
  {
    name: "Energy financing",
    keywords: ["energy financing", "grid financing", "bitcoin energy financing", "infrastructure financing"],
    picks: [{ youtube_id: "hjIJ9PHYa-w", t: 1380, label: "Energy financing is treated as the hard part of abundant power: even when demand exists, grids, permits, and capital structures can slow buildout. Bitcoin's role is framed as a flexible buyer that can help make new generation financeable earlier." }], // 23:00
  },
  {
    name: "Real-time energy markets",
    keywords: ["real-time markets", "energy markets", "demand response", "power markets"],
    picks: [{ youtube_id: "hjIJ9PHYa-w", t: 2400, label: "Real-time energy markets are presented as the market structure that makes flexible demand valuable. Bitcoin miners and some AI workloads can respond to price signals, turning volatility in power supply into an economic coordination problem rather than pure waste." }], // 40:00
  },
  {
    name: "Payment trees",
    keywords: ["payment trees", "spark payment trees", "service payments", "bitcoin l2 payments"],
    picks: [{ youtube_id: "Gwf9-SxYvo4", t: 1976, label: "Payment trees are used to explain how Spark-like systems can route value across services without every user touching the base chain. The segment focuses on the happy path and the incentives that would make different entities participate." }], // 32:56
  },
  {
    name: "Free banking",
    keywords: ["free banking", "stablecoin banks", "bitcoin free banking", "banking era"],
    picks: [{ youtube_id: "Gwf9-SxYvo4", t: 4778, label: "Free banking is used as the historical analogy for a future where many issuers, chains, and service providers compete around dollar instruments. The hosts ask whether stablecoin-era finance recreates old bank-note dynamics with new ledgers and bitcoin-adjacent settlement." }], // 1:19:38
  },
  {
    name: "Machine-ready repos",
    keywords: ["machine-ready repos", "mcp servers", "llm ready repos", "agent docs", "developer repos"],
    picks: [{ youtube_id: "uaN_P80CCFI", t: 709, label: "Machine-ready repos are proposed as infrastructure for AI agents that need to use Lightning, Nostr, and other developer tools without human hand-holding. The Lexe SDK example shows the broader need for docs, MCP servers, and repositories designed for LLM consumption." }], // 11:49
  },
  {
    name: "Bitcoin-aligned AI",
    keywords: ["bitcoin aligned ai", "bitcoin ai model", "goose nwc", "sats ai queries"],
    picks: [{ youtube_id: "uaN_P80CCFI", t: 3462, label: "Bitcoin-aligned AI is discussed as both a model-training ambition and a payment UX project. Ideas include Goose with NWC, paying sats for private LLM queries, and building models that understand bitcoin values rather than only generic crypto narratives." }], // 57:42
  },
  {
    name: "AI ads",
    keywords: ["ai ads", "ad-driven ai", "ai assistant ads", "agent ads"],
    picks: [{ youtube_id: "uaN_P80CCFI", t: 3262, label: "AI ads are framed as the dystopian default if assistants become attention and commerce intermediaries. The concern is not just annoying sponsored answers, but agents whose recommendations, purchases, and priorities are shaped by opaque monetization." }], // 54:22
  },
  {
    name: "Open-source apps",
    keywords: ["open source apps", "free applications", "app store", "foss apps"],
    picks: [{ youtube_id: "ZDN4LX3doJg", t: 518, label: "Open-source apps are discussed through Bitchat's path to distribution and app-store submission. The hosts use the example to ask how free, open tools can reach normal users without surrendering to closed platform gatekeepers." }], // 8:38
  },
  {
    name: "Lightning bridge",
    keywords: ["lightning bridge", "crypto bridge", "stablecoin bridge", "bitcoin bridge"],
    picks: [{ youtube_id: "ZDN4LX3doJg", t: 3970, label: "A Lightning bridge to the rest of crypto is framed as a practical interoperability need rather than ideological surrender. If stablecoins remain important, bitcoin wallets may need clean paths between Lightning and dollar-token ecosystems without sending users through centralized exchanges." }], // 1:06:10
  },
  {
    name: "Modular mining",
    keywords: ["modular mining", "mining form factors", "proto modular", "home mining"],
    picks: [{ youtube_id: "RIg8yQZPwyw", t: 1154, label: "Modular mining is the deeper product thesis behind Proto: new mining form factors could make hashpower more repairable, flexible, and embedded in more places. The hosts treat hardware modularity as a possible path away from monolithic industrial rigs." }], // 19:14
  },
  {
    name: "Solar mining",
    keywords: ["solar mining", "solar powered mining", "off-grid mining", "home solar miner"],
    picks: [{ youtube_id: "RIg8yQZPwyw", t: 3094, label: "Solar mining is raised as a practical experiment enabled by better hardware and software. The idea is not just hobby mining, but whether small-scale energy systems can use bitcoin to monetize otherwise stranded or intermittent power." }], // 51:34
  },
  {
    name: "Bitcoin security budget",
    keywords: ["security budget", "bitcoin fees", "tail emission", "block space", "long-term security"],
    picks: [
      { youtube_id: "ajsWQStK1JU", t: 1200, label: "Bitcoin's security budget is unpacked as the long-term question behind fees, block space, and investor responsibility. The hosts walk through whether settlement demand, payments, or new use cases can create enough fee pressure without changing issuance." }, // 20:00
      { youtube_id: "ogQ2z9lBHC8", t: 2760, label: "The future security budget is modeled through what the mempool might look like in 2050. The hosts ask how much fee revenue bitcoin actually needs, and whether spam, payments, settlement, and higher layers can support miners over time." }, // 46:00
    ],
  },
  {
    name: "Tail emission",
    keywords: ["tail emission", "tail emissions", "monero", "lost coins", "bitcoin issuance"],
    picks: [{ youtube_id: "ajsWQStK1JU", t: 2188, label: "Tail emission is rejected as an appealing but impractical answer to bitcoin's long-term security budget. The hosts compare Monero and quantum-vulnerable coins, but emphasize that changing bitcoin's issuance would violate a core social contract." }], // 36:28
  },
  {
    name: "Bitcoin settlement network",
    keywords: ["bitcoin replaces swift", "swift", "settlement network", "bitcoin settlement"],
    picks: [{ youtube_id: "ajsWQStK1JU", t: 2738, label: "Bitcoin as a settlement network is tested against the question of whether replacing SWIFT-like flows could create enough transaction demand. The hosts treat institutional settlement as useful, but not a substitute for broad native use that keeps the network decentralized." }], // 45:38
  },
  {
    name: "Proof of personhood",
    keywords: ["proof of human", "proof of personhood", "kyc internet", "bot resistance"],
    picks: [{ youtube_id: "ajsWQStK1JU", t: 5156, label: "Proof of personhood is raised as a response to the KYC'd internet and bot-saturated online spaces. The question is how to prove humanness without turning identity into another centralized honeypot or biometric checkpoint." }], // 1:25:56
  },
  {
    name: "Bitcoin local currencies",
    keywords: ["bitcoin backed local currencies", "local currencies", "community currencies", "bitcoin credit"],
    picks: [{ youtube_id: "zrOwT30p5rM", t: 3988, label: "Bitcoin-backed local currencies are floated as a way to combine local commerce with hard collateral. The idea points toward community money or credit systems that use bitcoin underneath without requiring every user to handle BTC directly." }], // 1:06:28
  },
  {
    name: "Bitcoin treasury companies",
    keywords: ["treasury adoption risk", "too much treasury adoption", "bitcoin treasury companies", "block space demand"],
    picks: [{ youtube_id: "zrOwT30p5rM", t: 5118, label: "Bitcoin treasury companies are examined as a possible adoption risk when too much demand flows through companies and ETFs rather than direct use. The hosts ask whether treasury-company success can strengthen bitcoin financially while weakening payment demand, self-custody, and block-space usage." }], // 1:25:18
  },
  {
    name: "Bitcoin-based voting",
    keywords: ["bitcoin based voting", "sats voting", "builder voting", "bitcoin voting"],
    picks: [{ youtube_id: "nEJ-cEzcDdk", t: 1306, label: "Bitcoin-based voting is proposed as a Builder-community primitive, where sats can create a harder-to-fake signal than likes or polls. The idea sits between governance, bounties, and product discovery: use money to reveal what people actually want built." }], // 21:46
  },
  {
    name: "Strategy",
    keywords: ["strategy most valuable company", "mstr strategy", "saylor capital markets", "bitcoin capital asset"],
    picks: [{ youtube_id: "nEJ-cEzcDdk", t: 2442, label: "Strategy's path to becoming one of the world's most valuable companies is examined through bitcoin as a capital asset. The hosts focus on the capital-markets machine around BTC accumulation and the risks of turning bitcoin's story into pure financial engineering." }], // 40:42
  },
  {
    name: "Decentralization window",
    keywords: ["decentralization window", "centralization traps", "bitcoin holders", "self custody window"],
    picks: [{ youtube_id: "nEJ-cEzcDdk", t: 4318, label: "The decentralization window is the concern that bitcoin has only a limited period to build real usage and self-custody before ETFs, treasury companies, and custodians absorb the user base. The hosts frame it as a race between convenience and bitcoin's original distribution of control." }], // 1:11:58
  },
  {
    name: "Address reuse",
    keywords: ["address reuse", "do not reuse addresses", "quantum public key", "p2pk"],
    picks: [{ youtube_id: "r91-r97-ksc", t: 1151, label: "Address reuse becomes the simplest actionable quantum takeaway: avoid exposing public keys unnecessarily. The hosts connect old pay-to-public-key outputs and reused addresses to the wider problem of which coins become vulnerable first." }], // 19:11
  },
  {
    name: "Hourglass proposal",
    keywords: ["hourglass proposal", "quantum hourglass", "bitcoin quantum proposal", "migration window"],
    picks: [{ youtube_id: "r91-r97-ksc", t: 1732, label: "The hourglass proposal is discussed as one possible quantum-transition mechanism with a defined migration path. Its importance is that it forces the governance question into concrete timelines, rights, and choices rather than vague quantum panic." }], // 28:52
  },
  {
    name: "Quantum panic",
    keywords: ["quantum fear", "recursive fear", "quantum panic", "quantum fud"],
    picks: [{ youtube_id: "r91-r97-ksc", t: 2215, label: "Quantum panic is treated as a risk of its own: fear of the threat can create bad coordination, rushed proposals, or market overreaction before the technical facts require it. The hosts distinguish preparation from recursive panic that damages bitcoin socially." }], // 36:55
  },
  {
    name: "Attention scarcity",
    keywords: ["attention spans", "connectivity", "new luxuries", "ai age attention"],
    picks: [{ youtube_id: "NrywCKRjHDk", t: 2871, label: "Attention scarcity is framed as a new luxury in an always-connected AI age. The hosts connect road trips, limited connectivity, and intentional focus to the broader question of what becomes valuable when information and media are abundant." }], // 47:51
  },
  {
    name: "Open-source thinking",
    keywords: ["open source thinking", "thinking in ai age", "ai thought process", "open cognition"],
    picks: [{ youtube_id: "NrywCKRjHDk", t: 2989, label: "Open-source thinking is proposed as an AI-era counterpart to open-source software: make reasoning, prompts, and intellectual process visible enough for others to inspect and build on. The segment treats thinking itself as an infrastructure layer once AI starts mediating knowledge work." }], // 49:49
  },
  {
    name: "Pakistan mining",
    keywords: ["pakistan mining", "imf bitcoin mining", "bitcoin mining policy", "sovereign mining"],
    picks: [{ youtube_id: "NrywCKRjHDk", t: 5063, label: "Pakistan's blocked mining plans show bitcoin mining becoming a sovereign-policy question rather than only a private industry. The IMF angle highlights how energy, debt, and monetary politics can constrain countries that want to monetize power through mining." }], // 1:24:23
  },
  {
    name: "Web micropayments",
    keywords: ["web micropayments", "attention currency", "browser payments", "bitcoin micropayments"],
    picks: [{ youtube_id: "9Cr-5lSGUU8", t: 1228, label: "Web micropayments are revisited through stablecoins, bitcoin, and attention as the internet's hidden currency. The hosts ask whether Nostr, Alby, and open payment systems can finally make tiny payments practical where earlier browser and credit-card models failed." }], // 20:28
  },
  {
    name: "Stablecoin bridges",
    keywords: ["stablecoin bridges", "bitcoin stablecoin bridge", "without cex", "bitcoin stablecoin interoperability"],
    picks: [{ youtube_id: "9Cr-5lSGUU8", t: 3447, label: "Stablecoin bridges are treated as necessary if bitcoin is going to coexist with vast stablecoin liquidity without routing everyone through centralized exchanges. The strategic question is how to connect dollar demand to bitcoin rails while preserving openness." }], // 57:27
  },
  {
    name: "Bitcoin node MCP",
    keywords: ["bitcoin node mcp", "mcp server bitcoin", "agent bitcoin payments", "node agent"],
    picks: [{ youtube_id: "tyOeK1bfM5E", t: 1913, label: "A bitcoin node as an MCP server is proposed as a way for agents to interact with bitcoin directly. The idea turns node functionality into a tool surface for payments, queries, and automation rather than only a human-operated backend." }], // 31:53
  },
  {
    name: "Block hijacking",
    keywords: ["block hijacking", "stratum v2 hijacking", "mining blocks", "template selection"],
    picks: [{ youtube_id: "tyOeK1bfM5E", t: 4265, label: "Block hijacking is introduced as a mining-risk concept tied to Stratum V2 and block-template control. The hosts use it to explain why who selects transactions matters, even when miners appear to be contributing hashpower normally." }], // 1:11:05
  },
  {
    name: "Private-key authenticity",
    keywords: ["private key authenticity", "signing with a private key", "authenticity", "digital signature"],
    picks: [{ youtube_id: "75Q1RRl2GtQ", t: 1937, label: "Private-key authenticity is framed as one of the scarce things left when AI makes content cheap. Signing with a key can prove origin, identity, and commitment in a world where media, software, and text are easy to generate." }], // 32:17
  },
  {
    name: "Bitcoin distribution",
    keywords: ["bitcoin distribution", "initial distribution", "fair launch", "early adopters"],
    picks: [{ youtube_id: "75Q1RRl2GtQ", t: 2370, label: "Bitcoin's initial distribution is revisited as a fairness and legitimacy question. The hosts distinguish natural early-adopter concentration from premines or insider allocations, while acknowledging that wealth concentration remains a live social critique." }], // 39:30
  },
  {
    name: "Home equity Bitcoin loans",
    keywords: ["home equity bitcoin", "horizon", "sovana", "home equity to buy bitcoin", "bitcoin loans"],
    picks: [{ youtube_id: "75Q1RRl2GtQ", t: 5126, label: "Home equity bitcoin loans are discussed through Horizon and Sovana as a new bridge between household balance sheets and BTC exposure. The segment raises the obvious upside and risk: real-estate collateral can buy bitcoin, but leverage changes the user's downside dramatically." }], // 1:25:26
  },
  {
    name: "Save Our Wallets",
    keywords: ["save our wallets", "wallet initiative", "apple nfc", "wallet access", "self-custody wallets"],
    picks: [{ youtube_id: "4YN4cxBgA1g", t: 1472, label: "Save Our Wallets is highlighted as a policy and advocacy effort around wallet access. The hosts connect it to Apple NFC restrictions and the broader risk that platform control can decide which bitcoin payment experiences reach users." }], // 24:32
  },
  {
    name: "Bitcoin NFC",
    keywords: ["bitcoin nfc", "apple nfc", "tap to pay bitcoin", "wallet nfc"],
    picks: [{ youtube_id: "4YN4cxBgA1g", t: 756, label: "Bitcoin NFC is discussed through Apple's control over tap-to-pay access. The practical point is that payment UX depends on device permissions as much as wallet design, making platform policy part of bitcoin adoption." }], // 12:36
  },
  {
    name: "Messaging app payments",
    keywords: ["messaging app payments", "bitcoin in messaging apps", "messenger bitcoin", "chat payments"],
    picks: [{ youtube_id: "4YN4cxBgA1g", t: 4519, label: "Messaging app payments are framed as a potentially enormous bitcoin opportunity because chat already contains social context and trust. If wallets can hide complexity, messengers could make bitcoin payments habitual in the same place people coordinate." }], // 1:15:19
  },
  {
    name: "Nostr payments",
    keywords: ["nostr payments", "5 million payments", "zaps", "highfives", "nostr developer possibilities"],
    picks: [{ youtube_id: "NYKHpoKwCIw", t: 862, label: "Nostr exceeding 5 million payments is treated as evidence that open social payments are not theoretical. The highfives.fun example shows how vibe coding and bitcoin payments can let non-developers build small, real products quickly." }], // 14:22
  },
  {
    name: "Google Flow",
    keywords: ["google flow", "veo", "ai video", "google io"],
    picks: [{ youtube_id: "NYKHpoKwCIw", t: 1695, label: "Google Flow and Veo are discussed as evidence that AI media tools are advancing into practical creative workflows. The segment matters because video generation changes who can produce convincing content, demos, and interfaces." }], // 28:15
  },
  {
    name: "Stateless socialism",
    keywords: ["stateless socialism", "bitcoin is venice", "allen farrington", "open protocols"],
    picks: [{ youtube_id: "NYKHpoKwCIw", t: 2663, label: "Stateless socialism is raised through Allen Farrington's bitcoin is Venice as a way to think about free markets and open protocols without centralized state allocation. The hosts use it to connect bitcoin's monetary architecture to broader political economy." }], // 44:23
  },
  {
    name: "HyperBitcoinization",
    keywords: ["hyperbitcoinization", "credit market", "debt types", "bitcoin credit"],
    picks: [{ youtube_id: "NYKHpoKwCIw", t: 5087, label: "Hyperbitcoinization is introduced through its impact on credit markets and debt types. The hosts ask what happens to lending, collateral, and capital formation when bitcoin becomes the monetary base rather than a speculative asset." }], // 1:24:47
  },
  {
    name: "Bitcoin namespace",
    keywords: ["bitcoin namespace", "future namespace", "namespaces", "bitcoin names"],
    picks: [{ youtube_id: "ogQ2z9lBHC8", t: 4262, label: "Bitcoin namespace is raised as a long-run question after the spam and filtering debate. The issue is whether scarce, durable naming or data commitments belong on bitcoin, and how fee markets should arbitrate that demand." }], // 1:11:02
  },
  {
    name: "Unintentional hard fork",
    keywords: ["unintentional hard fork", "hard fork risk", "knots core", "implementation diversity"],
    picks: [{ youtube_id: "RZ17F1urYzg", t: 688, label: "Unintentional hard fork risk is discussed in the context of Knots gaining share and policy differences across implementations. The hosts focus on the subtle line between healthy diversity and accidental consensus fragmentation." }], // 11:28
  },
  {
    name: "Bitcoin games",
    keywords: ["bitcoin games", "lightning games", "gaming bitcoin", "bitcoin game mechanics"],
    picks: [{ youtube_id: "Y8U9hWLC2EU", t: 2321, label: "Bitcoin games are used to think beyond payments as checkout: Lightning can change incentives, rewards, and multiplayer mechanics inside games. The hosts see gaming as a natural place to test bitcoin-native digital economies." }], // 38:41
  },
  {
    name: "Quantum Day",
    keywords: ["quantum day", "q-day", "q day", "quantum risk bitcoin", "quantum computing bitcoin", "quantum event"],
    picks: [{ youtube_id: "Y8U9hWLC2EU", t: 4167, label: "Quantum Day, or Q-Day, serves as an early public marker for bitcoin's quantum-risk conversation. The hosts use it to separate sensational timing from the real protocol question of how vulnerable coins and future signatures should be handled." }], // 1:09:27
  },
  {
    name: "Proof of Walk",
    keywords: ["proof of walk", "walking app", "bitcoin game", "activity game"],
    picks: [{ youtube_id: "S-ap38cImgU", t: 3350, label: "Proof of Walk is a game idea where real-world activity becomes energy or value inside an app. The concept matters as an example of vibe-coded bitcoin experiments that combine physical behavior, incentives, and playful product design." }], // 55:50
  },
  {
    name: "Bitcoin Bond Company",
    keywords: ["bitcoin bond company", "bitcoin bonds", "saylor bonds", "bitcoin securitization"],
    picks: [{ youtube_id: "S-ap38cImgU", t: 5335, label: "The Bitcoin Bond Company is floated as part of the emerging securitization stack around bitcoin. The hosts connect it to MicroStrategy-style instruments and the broader question of how capital markets package bitcoin exposure." }], // 1:28:55
  },
  {
    name: "Zettahash",
    keywords: ["zettahash", "zeta hash", "hash rate", "bitcoin hashrate"],
    picks: [{ youtube_id: "S-ap38cImgU", t: 4800, label: "Bitcoin reaching a zettahash-scale hash rate is treated as a milestone in network security and industrial maturity. The hosts connect rising hash rate to the broader foundation being laid for bitcoin's payment network." }], // 1:20:00
  },
  {
    name: "Consensus vs. policy",
    keywords: ["consensus versus policy", "node relay policy", "bitcoin core policy", "op_return policy"],
    picks: [{ youtube_id: "xYbakpGY9Ys", t: 968, label: "Consensus versus policy is the key distinction in the OP_RETURN drama: relay defaults can shape network behavior without changing what blocks are valid. The hosts use the distinction to lower the temperature while still taking policy influence seriously." }], // 16:08
  },
  {
    name: "OP_RETURN",
    keywords: ["op_return", "op return", "bitcoin data", "packet size"],
    picks: [{ youtube_id: "xYbakpGY9Ys", t: 1242, label: "OP_RETURN is explained as the specific policy surface behind the broader money-versus-data fight. The debate turns on whether changing data limits meaningfully affects spam, node costs, and miner incentives when other storage paths already exist." }], // 20:42
  },
  {
    name: "Bitcoin discussion venues",
    keywords: ["bitcoin discussion venues", "where should discussions happen", "bitcoin governance discussion", "developer debate"],
    picks: [{ youtube_id: "xYbakpGY9Ys", t: 3580, label: "Bitcoin discussion venues become part of the governance problem: where debates happen shapes who participates and how intense disagreements become. The hosts ask whether mailing lists, social media, and in-person spaces produce different kinds of consensus." }], // 59:40
  },
  {
    name: "Nostr adoption",
    keywords: ["nostr adoption", "big tech nostr", "nostr drawbacks", "open social network"],
    picks: [{ youtube_id: "j7ICtL37dZs", t: 787, label: "Nostr adoption is explored through its drawbacks and the possibility that big tech could incorporate open social primitives. The hosts treat Nostr as both promising infrastructure and a product challenge that still needs better user experiences." }], // 13:07
  },
  {
    name: "Future of scarcity",
    keywords: ["future of scarcity", "scarcity", "ai abundance", "digital abundance"],
    picks: [{ youtube_id: "j7ICtL37dZs", t: 1725, label: "The future of scarcity is discussed as AI and networks make copying, software, and content cheaper. Bitcoin's role is framed as a scarce coordination point in a world where many other digital goods trend toward abundance." }], // 28:45
  },
  {
    name: "Vibe coding coaches",
    keywords: ["vibe coding coaches", "replit bounties", "software development future", "ai coding coaches"],
    picks: [{ youtube_id: "j7ICtL37dZs", t: 2037, label: "Vibe coding coaches and Replit bounties are presented as new roles in software production. As AI lowers implementation costs, value shifts toward taste, prompt direction, product judgment, and helping others turn ideas into working apps." }], // 33:57
  },
  {
    name: "Presidio Bitcoin Entrepreneur in Residence program",
    keywords: ["entrepreneur in residence", "eir", "presidio bitcoin eir", "presidio bitcoin entrepreneur in residence program", "bitcoin entrepreneurs"],
    picks: [{ youtube_id: "j7ICtL37dZs", t: 3645, label: "The Presidio Bitcoin Entrepreneur in Residence program is framed as a way to turn community energy into companies. It sits between hackathons, venture connections, and open-source development as a bridge from idea to startup." }], // 1:00:45
  },
  {
    name: "Self-custody narratives",
    keywords: ["self-custody claims", "false market claims", "self custody", "custody narratives"],
    picks: [{ youtube_id: "G7lrDU5xpo8", t: 3745, label: "Self-custody narratives are challenged through false or misleading market claims about what custody actually means. The hosts use the segment to stress that bitcoin adoption depends on users understanding the difference between holding keys and holding exposure." }], // 1:02:25
  },
  {
    name: "Bitcoin S-curve",
    keywords: ["bitcoin s curve", "s curve adoption", "bitcoin adoption curve", "peer to peer transactions"],
    picks: [{ youtube_id: "G7lrDU5xpo8", t: 4120, label: "Bitcoin's S-curve is discussed through the search for use cases that can drive repeated peer-to-peer transactions. The hosts argue adoption needs more than price appreciation; it needs situations where bitcoin solves a real payment or coordination problem." }], // 1:08:40
  },
  {
    name: "KYC honeypots",
    keywords: ["kyc honeypots", "kyc bitcoin", "data honeypots", "kyc data"],
    picks: [{ youtube_id: "G7lrDU5xpo8", t: 4862, label: "KYC honeypots are framed as a major failure mode for bitcoin services: identity data gathered for compliance can become a target and a permanent user risk. The hosts connect the issue to self-custody, privacy, and better ways to prove eligibility without exposing everyone." }], // 1:21:02
  },
  {
    name: "Autonomous agent commerce",
    keywords: ["autonomous agents commerce", "agents conducting commerce", "hackathon agents", "agent payments"],
    picks: [{ youtube_id: "Uw5Vh5Tr7To", t: 1249, label: "Autonomous agent commerce appears as a hackathon goal: agents should be able to buy, sell, and coordinate with bitcoin and Nostr primitives. The idea is early, but it anchors the episode's broader push to make open payments usable by non-human actors." }], // 20:49
  },
  {
    name: "American competitiveness",
    keywords: ["american competitiveness", "america bitcoin", "balaji china", "bitcoin competitiveness"],
    picks: [{ youtube_id: "Uw5Vh5Tr7To", t: 2076, label: "Bitcoin and American competitiveness are linked through Balaji's China thesis: if software and AI services trend toward zero, the US needs monetary, hardware, and energy strategies that preserve advantage. Bitcoin is framed as one way to keep open innovation and capital formation competitive." }], // 34:36
  },
  {
    name: "Mining chip platforms",
    keywords: ["mining chip platform", "proto chip", "mining chips", "hashing platform"],
    picks: [{ youtube_id: "Uw5Vh5Tr7To", t: 4280, label: "Mining chip platforms are proposed as a hackathon direction after discussing Proto and mining hardware. The idea is to treat ASICs as programmable, productizable infrastructure rather than sealed industrial equipment." }], // 1:11:20
  },
  {
    name: "Money services regulation",
    keywords: ["money service licensing", "msb regulation", "bsa", "non-custodial services"],
    picks: [{ youtube_id: "JIwKzzxCHLg", t: 797, label: "Money services regulation is revisited after the Tornado Cash news, with the hosts arguing that non-custodial internet services do not fit cleanly inside old Bank Secrecy Act categories. The segment asks how bitcoiners can support policy reform without weakening privacy tools." }], // 13:17
  },
  {
    name: "Wallet libraries",
    keywords: ["wallet libraries", "graduated wallet libraries", "bitcoin wallet library", "bitcoin integration"],
    picks: [{ youtube_id: "JIwKzzxCHLg", t: 3665, label: "Wallet libraries are proposed as a path to broader bitcoin integration: graduated levels of abstraction could let apps add payments without becoming wallet experts. The point is to make bitcoin easy enough for mainstream developers while preserving good defaults." }], // 1:01:05
  },
  {
    name: "Nostr resource markets",
    keywords: ["nostr resource markets", "bandwidth storage compute", "nostr compute", "nostr storage"],
    picks: [{ youtube_id: "JIwKzzxCHLg", t: 4875, label: "Nostr resource markets are proposed around bandwidth, storage, and compute as investable primitives. The hosts see open identity, messaging, and payments as the substrate for markets where agents and humans can buy infrastructure directly." }], // 1:21:15
  },
  {
    name: "Bitcoin securitization",
    keywords: ["bitcoin securitization", "bitbonds", "bitcoin bonds", "securitized bitcoin"],
    picks: [{ youtube_id: "7Rcn8tMzliM", t: 500, label: "Bitcoin securitization is introduced as the new era behind BitBonds and similar products. The hosts are ambivalent: securitization can bring institutional capital, but it also shifts attention from native use toward wrappers and financial engineering." }], // 8:20
  },
  {
    name: "MPC payments",
    keywords: ["mpc payments", "open payments mpc", "multiparty computation", "payment custody"],
    picks: [{ youtube_id: "7Rcn8tMzliM", t: 1375, label: "MPC payments are raised as a possible path for open payments, but the hosts question whether better custody math solves the deeper product problem. The key issue is making payments easy and permissionless without hiding too much trust in technical acronyms." }], // 22:55
  },
  {
    name: "Bitcoin checkpoints",
    keywords: ["bitcoin checkpoints", "checkpoints", "bitcoin core checkpoints", "chain checkpoints"],
    picks: [{ youtube_id: "7Rcn8tMzliM", t: 2912, label: "Bitcoin checkpoints are reviewed as a historical mechanism that was removed because it conflicted with the system's trust-minimized direction. The segment uses checkpoints to explain how bitcoin has shed centralized safety valves over time." }], // 48:32
  },
  {
    name: "Bitcoin vaults",
    keywords: ["bitcoin vaults", "vaults", "covenant vaults", "bitcoin custody"],
    picks: [{ youtube_id: "7Rcn8tMzliM", t: 4967, label: "Bitcoin vaults are introduced as a custody primitive for delaying or constraining spends. The hosts treat vaults as part of the broader search for safer self-custody, especially as more value moves into bitcoin." }], // 1:22:47
  },
  {
    name: "Bitcoin foundational layer",
    keywords: ["foundational layer", "build on bitcoin", "bitcoin layer", "bitcoin base layer"],
    picks: [{ youtube_id: "XlPhtCfOzt0", t: 869, label: "Bitcoin as a foundational layer is the early Presidio Bitcoin pitch: build on the monetary network with the strongest neutrality and settlement properties rather than chasing generic crypto platforms. The hosts use it to explain why Silicon Valley should return to bitcoin specifically." }], // 14:29
  },
  {
    name: "Nostr messaging",
    keywords: ["nostr messaging", "messaging network", "nostr next to bitcoin", "open messaging"],
    picks: [{ youtube_id: "XlPhtCfOzt0", t: 1343, label: "Nostr is framed as the messaging network that naturally sits next to bitcoin: open identity, open publishing, and bitcoin payments reinforce each other. The segment sets up why Presidio Bitcoin treats Nostr as adjacent infrastructure rather than a separate hobby." }], // 22:23
  },
  {
    name: "Digital commodity",
    keywords: ["digital commodity", "no issuer", "bitcoin no issuer", "commodity money"],
    picks: [{ youtube_id: "XlPhtCfOzt0", t: 3584, label: "Bitcoin's no-issuer status is presented as the key distinction from crypto tokens and stablecoins. The hosts argue that being a digital commodity changes how policymakers, investors, and builders should reason about bitcoin." }], // 59:44
  },
  {
    name: "The Sovereign Individual",
    keywords: ["sovereign individual", "state adoption", "bitcoin state adoption", "individual sovereignty"],
    picks: [{ youtube_id: "XlPhtCfOzt0", t: 4267, label: "The Sovereign Individual is revisited through US state adoption and the possibility that bitcoin changes the balance between individuals, companies, and governments. The early PBJ framing already treats bitcoin as political technology, not only an investment." }], // 1:11:07
  },
  {
    name: "Bitcoin energy criticism",
    keywords: ["energy criticism", "bitcoin energy fud", "mainstream energy criticism", "bitcoin education energy"],
    picks: [{ youtube_id: "XlPhtCfOzt0", t: 4650, label: "Bitcoin energy criticism is anticipated as the next mainstream attack surface. The hosts argue education has to move beyond defensive talking points and explain why mining can support energy buildout, renewable monetization, and grid resilience." }], // 1:17:30
  },
]);

addTopicDefs([
  {
    name: "Bitcoin merchant adoption",
    keywords: ["square default bitcoin", "square bitcoin rollout", "cash app qr", "btc map", "merchant awareness"],
    picks: [{ youtube_id: "KZsEVToqXYk", t: 392, label: "Square's broader bitcoin payments rollout is a real adoption win, but not the finish line. Sellers still need awareness, Bitcoin Map opt-in, customer-facing promotion, a cleaner unified QR flow, and UI that makes zero-fee bitcoin payments obvious enough to change merchant behavior." }], // 6:32
  },
  {
    name: "Machine Payments Protocol",
    keywords: ["mpp", "machine payments protocol", "tempo mpp", "stripe mpp", "x402", "l402", "lightning template"],
    picks: [{ youtube_id: "KZsEVToqXYk", t: 4096, label: "Tempo and Stripe's Machine Payments Protocol is treated as promising because it includes a Lightning template rather than only stablecoin rails. The hosts compare it to X402 and L402, seeing an opportunity for agents with Lightning or MDK wallets to pay across either protocol if builders implement the bridge." }], // 1:08:16
  },
  {
    name: "Presidio Bitcoin Hackathon",
    keywords: ["pb hackathon", "presidio bitcoin hackathon", "hackathon", "hackathon projects", "presidio hackathon"],
    picks: [
      { youtube_id: "NYKHpoKwCIw", t: 18, label: "The Presidio Bitcoin Hackathon is treated as proof that the community can produce real bitcoin and AI prototypes, not just discussion. The hosts focus on the winning projects as a way to understand what builders are actually able to ship under Presidio Bitcoin's constraints and taste." }, // 0:18
      { youtube_id: "7UoDUm5u5bg", t: 0, label: "The finalist presentation stream captures the top teams from Presidio Bitcoin's inaugural 24-hour hackathon, with judges selecting projects across bitcoin, AI, Lightning, Nostr, and open-source tooling." }, // 0:00
    ],
  },
  {
    name: "Presidio Bitcoin Hackathon finalist presentations",
    keywords: ["hackathon finalist presentations", "finalist presentations", "hackathon top five", "presidio bitcoin hackathon finalists"],
    picks: [{ youtube_id: "7UoDUm5u5bg", t: 48, label: "After a science-fair round, judges selected the top five teams for five-minute finalist pitches and follow-up questions, turning the hackathon into a live map of what could be built in 24 hours." }], // 0:48
  },
  {
    name: "Unstuck AI",
    keywords: ["unstuck ai", "ai human help", "goose mcp", "nostr job requests"],
    picks: [{ youtube_id: "7UoDUm5u5bg", t: 188, label: "Unstuck AI lets a Goose agent ask humans for help when it hits tasks it cannot solve alone, posting screenshots and job requests over Nostr so people can bid for sats and return useful guidance." }], // 3:08
  },
  {
    name: "MCP servers",
    keywords: ["mcp server", "goose mcp", "model context protocol", "agent tools"],
    picks: [{ youtube_id: "7UoDUm5u5bg", t: 253, label: "Unstuck AI is implemented as an MCP server that any compatible agent can add, giving agent tools a practical path to request outside help through bitcoin and Nostr." }], // 4:13
  },
  {
    name: "Nostr Data Vending Machine",
    keywords: ["nostr data vending machine", "data vending machine", "nostr jobs", "kind 7000"],
    picks: [{ youtube_id: "7UoDUm5u5bg", t: 398, label: "The Unstuck demo adapts Nostr Data Vending Machine-style events to human labor: the job is posted over Nostr, bids arrive, a Lightning invoice is paid, and the result flows back to the agent." }], // 6:38
  },
  {
    name: "Supersonic",
    keywords: ["supersonic", "ad free podcast player", "podcast ad skipping", "zap ads"],
    picks: [{ youtube_id: "7UoDUm5u5bg", t: 628, label: "Supersonic is an ad-free podcast player that uses AI to identify ad segments in transcripts and lets listeners pay small bitcoin amounts to skip ads without a subscription." }], // 10:28
  },
  {
    name: "Podcast ad skipping",
    keywords: ["podcast ad skipping", "ai ad detection", "podcast ads", "skip ads bitcoin"],
    picks: [{ youtube_id: "7UoDUm5u5bg", t: 655, label: "Supersonic uses timecoded transcripts and AI-detected ad start and end times so users can skip exactly past ads rather than manually scrubbing around the timeline." }], // 10:55
  },
  {
    name: "Lightning micropayments",
    keywords: ["lightning micropayments", "webln", "albi", "small bitcoin payments"],
    picks: [{ youtube_id: "7UoDUm5u5bg", t: 688, label: "The Supersonic demo connects through Alby and WebLN, showing how Lightning micropayments can unlock small one-click payments that are not feasible with traditional payment rails." }], // 11:28
  },
  {
    name: "Project Darwin",
    keywords: ["project darwin", "darwin agent", "ai agent game", "open secret"],
    picks: [{ youtube_id: "7UoDUm5u5bg", t: 1164, label: "Project Darwin, built by the Open Secret team, is a game-like simulation where AI agents use bitcoin to compete, collaborate, beg, attack, block, and potentially replicate once they accumulate enough sats." }], // 19:24
  },
  {
    name: "AI agents and bitcoin",
    keywords: ["ai agents bitcoin", "ai agents lightning", "autonomous agents bitcoin", "ai digital currency"],
    picks: [{ youtube_id: "7UoDUm5u5bg", t: 1203, label: "Project Darwin starts from the premise that AI needs energy, compute, and internet-native money, then uses bitcoin as the resource that lets agents act, survive, and replicate inside a game environment." }], // 20:03
  },
  {
    name: "Agentic game theory",
    keywords: ["agentic game theory", "ai agent game theory", "darwin agent game", "agents cooperate attack"],
    picks: [{ youtube_id: "7UoDUm5u5bg", t: 1246, label: "Darwin turns agentic game theory into a playable experiment: agents can cooperate through high-fives, attack, block, beg for money, or replicate, making AI incentives observable instead of purely speculative." }], // 20:46
  },
  {
    name: "Bitcoin High Fives",
    keywords: ["bitcoin high fives", "peer bonus", "nostr wallet connect", "bitcoin gratitude"],
    picks: [{ youtube_id: "7UoDUm5u5bg", t: 1662, label: "Bitcoin High Fives is a peer-bonus system for bitcoiners, inspired by Google peer bonuses, that lets people publicly thank contributors and send small bitcoin rewards through Nostr and Lightning." }], // 27:42
  },
  {
    name: "Peer bonuses",
    keywords: ["peer bonuses", "bitcoin peer bonus", "google peer bonus", "reward contributors"],
    picks: [{ youtube_id: "7UoDUm5u5bg", t: 1755, label: "The Bitcoin High Fives pitch adapts peer bonuses to an open community: instead of internal company rewards, anyone can recognize useful work and send value directly." }], // 29:15
  },
  {
    name: "Nostr Wallet Connect",
    keywords: ["nostr wallet connect", "nwc", "nostr payments", "bitcoin high fives"],
    picks: [{ youtube_id: "7UoDUm5u5bg", t: 1824, label: "Bitcoin High Fives uses Nostr Wallet Connect and a Nostr public key to route the payment flow, turning identity, recognition, and payment into one lightweight social action." }], // 30:24
  },
  {
    name: "Agentic Fuzzing League",
    keywords: ["agentic fuzzing league", "ai fuzzing", "l402 mcp", "bitcoin fuzzing"],
    picks: [{ youtube_id: "7UoDUm5u5bg", t: 2215, label: "Agentic Fuzzing League, the first-place project, combines AI-generated fuzz tests with Lightning-paid tool access so agents can fuzz open-source software and improve tests over time." }], // 36:55
  },
  {
    name: "AI fuzz testing",
    keywords: ["ai fuzz testing", "fuzz tests", "autonomous fuzzing", "software security ai"],
    picks: [{ youtube_id: "7UoDUm5u5bg", t: 2298, label: "The fuzzing pipeline has agents write tests, compile them, run them, analyze failures, and improve coverage, turning fuzz testing into a repeatable AI-assisted security workflow." }], // 38:18
  },
  {
    name: "L402",
    keywords: ["l402", "lightning paid api", "macaroon", "lightning invoice tool access"],
    picks: [{ youtube_id: "7UoDUm5u5bg", t: 2392, label: "Agentic Fuzzing League embeds L402-style paid access into MCP tool calls: the server rejects unpaid work, returns an invoice and macaroon components, and the agent pays before using the fuzzing service." }], // 39:52
  },
  {
    name: "Bitcoin open-source security",
    keywords: ["bitcoin open source security", "bitcoin core fuzzing", "lnd fuzzing", "security testing bitcoin"],
    picks: [{ youtube_id: "7UoDUm5u5bg", t: 2613, label: "The team points toward applying agentic fuzzing to bitcoin projects like Bitcoin Core and LND, where better automated testing could help harden critical open-source infrastructure." }], // 43:33
  },
  {
    name: "Presidio Bitcoin Hackathon awards",
    keywords: ["hackathon awards", "hackathon winners", "presidio bitcoin hackathon winners", "crowd favorite"],
    picks: [{ youtube_id: "7UoDUm5u5bg", t: 2900, label: "The awards recognize Agentic Fuzzing League as crowd favorite and first place, Unstuck AI as most sci-fi and second place, Supersonic as third place, and Bit Buddy as best beginner." }], // 48:20
  },
  {
    name: "Vibe coding",
    keywords: ["vibe coding hackathon", "hackathon vibe coding", "ai coding tools", "build in 24 hours"],
    picks: [{ youtube_id: "7UoDUm5u5bg", t: 3459, label: "In closing remarks, judges point to vibe coding as a democratizing force: people with ideas can now build working bitcoin and AI apps in hours, not only after years of software experience." }], // 57:39
  },
  {
    name: "Bitcoin app innovation",
    keywords: ["bitcoin app innovation", "bitcoin apps", "lightning apps", "bitcoin utilities"],
    picks: [{ youtube_id: "7UoDUm5u5bg", t: 3488, label: "The closing vision is a coming wave of bitcoin app innovation as builders combine Replit-style tools, Nostr utilities, bitcoin utilities, Lightning utilities, and AI-assisted development." }], // 58:08
  },
  {
    name: "Autonomous digital life",
    keywords: ["autonomous digital life", "ai agents lightning nostr", "confidential compute", "agentic bitcoin"],
    picks: [{ youtube_id: "7UoDUm5u5bg", t: 3525, label: "Max closes by saying the hackathon made autonomous digital life feel more real: AI agents, bitcoin, Lightning, Nostr, and confidential compute may combine into both strange risks and powerful new tools." }], // 58:45
  },
  {
    name: "OpenAI",
    keywords: ["openai", "jony ive", "johnny ive", "openai hardware", "ai device"],
    picks: [{ youtube_id: "NYKHpoKwCIw", t: 1991, label: "OpenAI's acquisition of Jony Ive's company is interpreted as a hardware and interface bet. The discussion frames it as OpenAI trying to own the next consumer AI surface, not just the model layer." }], // 33:11
  },
  {
    name: "XStocks",
    keywords: ["xstocks", "kraken xstocks", "tokenized equities", "solana stocks", "backed"],
    picks: [{ youtube_id: "NYKHpoKwCIw", t: 3766, label: "Kraken's xStocks product is used to examine tokenized equities as global market access. The hosts are interested in the promise of giving users outside traditional brokerage systems exposure to stocks, while questioning the legal and custody structure behind the wrapper." }], // 1:02:46
  },
  {
    name: "Bitcoin spam",
    keywords: ["bitcoin spam", "spam", "op_return", "filtering", "bitcoin data"],
    picks: [{ youtube_id: "ogQ2z9lBHC8", t: 1347, label: "Defining bitcoin spam becomes hard once the conversation moves from obvious junk to subjective judgments about unwanted data. The hosts connect the debate to phishing, AI-generated attacks, and the danger of letting social outrage define protocol policy." }], // 22:27
  },
  {
    name: "Coinbase ransom",
    keywords: ["coinbase ransom", "20 million bounty", "customer data", "coinbase hack", "operational security"],
    picks: [{ youtube_id: "ogQ2z9lBHC8", t: 1151, label: "The Coinbase ransom is treated as an operational-security failure, not merely a hacker story. Customer-service access to sensitive data becomes the core issue, with AI-powered phishing making these internal-data leaks more dangerous over time." }], // 19:11
  },
  {
    name: "Bitcoin ₿ symbol",
    keywords: ["bitcoin units", "rebasing bitcoin", "sats", "btc unit", "jack dorsey rebased"],
    picks: [{ youtube_id: "ogQ2z9lBHC8", t: 54, label: "Bitcoin units are revisited through the idea of rebasing away from sats toward a simpler consumer denomination. The segment matters because the hosts see unit language as a coordination problem that could change quickly if major apps like Cash App and Coinbase move together." }], // 0:54
  },
  {
    name: "Knots",
    keywords: ["knots", "bitcoin knots", "luke dashjr", "bitcoin core fork", "market share"],
    picks: [{ youtube_id: "RZ17F1urYzg", t: 106, label: "Knots gaining market share is treated as a healthy-but-complicated signal of implementation diversity. Because Knots is a Bitcoin Core fork maintained around Luke Dashjr's policy preferences, its growth raises questions about what kind of diversity actually matters for economic nodes." }], // 1:46
  },
  {
    name: "Nostr Blossom",
    keywords: ["blossom", "blossom servers", "nostr storage", "ipfs", "decentralized storage"],
    picks: [{ youtube_id: "RZ17F1urYzg", t: 2733, label: "Blossom servers are described as Nostr developers accidentally building a better IPFS. The core idea is decentralized file storage with simpler incentives and discovery, making Nostr useful beyond social posts and identity." }], // 45:33
  },
  {
    name: "Noauth",
    keywords: ["noauth", "nostr auth", "nostr login", "authentication", "global identity"],
    picks: [{ youtube_id: "RZ17F1urYzg", t: 1354, label: "Noauth is framed as part of Nostr's broader answer to decentralized identity and app login. The hosts connect it to node discovery and data availability: users need portable keys, but also practical infrastructure for finding and using their data." }], // 22:34
  },
  {
    name: "Bitcoin-backed loans",
    keywords: ["strike loans", "strike bitcoin loans", "collateralized lending", "bitcoin credit line"],
    picks: [{ youtube_id: "RZ17F1urYzg", t: 3626, label: "Strike's loan product is evaluated alongside Lava and Coinbase as part of the emerging bitcoin-collateralized lending market. The hosts care less about the announcement itself than whether users can borrow dollars against BTC without selling or accepting opaque custody risk." }], // 1:00:26
  },
  {
    name: "Stablecoins on Lightning",
    keywords: ["stablecoins on lightning", "lightning stablecoins", "taproot assets", "lightning transactions", "stablecoin lightning"],
    picks: [{ youtube_id: "Y8U9hWLC2EU", t: 716, label: "Stablecoins on Lightning are discussed through the long-term question of how much activity can happen off-chain while still anchoring to bitcoin. The point is that Lightning can support massive payment volume, but the base layer must still handle channel liquidity and settlement constraints." }], // 11:56
  },
  {
    name: "Bitcoin design",
    keywords: ["bitcoin design", "bitcoin orange", "design guide", "bitcoin branding", "unit design"],
    picks: [{ youtube_id: "Y8U9hWLC2EU", t: 3076, label: "Bitcoin design is explored through unit naming, orange branding, and the need for AI-readable design guidance. The segment treats visual and language consistency as part of adoption infrastructure, not superficial polish." }], // 51:16
  },
  {
    name: "Nostr for AI agents",
    keywords: ["nostr vibe coding", "nostr apps", "global identity", "global data commons", "open agents"],
    picks: [
      { youtube_id: "S-ap38cImgU", t: 492, label: "Nostr is framed as the missing global identity and data commons for AI-built apps. Existing services may keep extending their data moats, but new agentic apps need portable identity, open payments, and shared data primitives that Nostr already points toward." }, // 8:12
      { youtube_id: "Uw5Vh5Tr7To", t: 629, label: "Vibe coding with bitcoin and Nostr is framed as the open alternative to defaulting to Google auth, X identity, and Stripe payments. The opportunity is a plug-and-play app environment where builders can choose Nostr identity and bitcoin payments as first-class modules." }, // 10:29
    ],
  },
  {
    name: "Open-source bounties",
    keywords: ["open source bounties", "bounties", "bitcoin bounties", "vibe coding bounties", "nostr bounties"],
    picks: [{ youtube_id: "S-ap38cImgU", t: 1953, label: "Open-source bounties are proposed as a way to turn vibe-coded bitcoin and Nostr ideas into shipped software. The hosts imagine a platform that handles hosting, payments, Lightning, NWC, and Cashu so builders can focus on apps instead of infrastructure." }], // 32:33
  },
  {
    name: "Phoenix",
    keywords: ["phoenix", "phoenix wallet", "non-custodial wallet", "wallet regulation"],
    picks: [{ youtube_id: "S-ap38cImgU", t: 4339, label: "Phoenix returning is used to discuss how wallet companies decide between custodial and non-custodial models under regulatory pressure. The episode treats the comeback as good news, but also as a reminder that product architecture is shaped by policy risk." }], // 1:12:19
  },
  {
    name: "Spark",
    keywords: ["spark live", "lightspark spark", "spark vs arc", "spark vs lightning", "tokens on spark"],
    picks: [{ youtube_id: "xYbakpGY9Ys", t: 5066, label: "Spark going live starts the practical comparison between Spark, Ark, and Lightning. The hosts emphasize that Spark can scale bitcoin payments and issue tokens, including stablecoins, but its trade-offs need a deeper treatment than launch-week excitement." }], // 1:24:26
  },
  {
    name: "Epic v. Apple",
    keywords: ["epic vs apple", "apple tax", "fortnite", "app store payments", "external payments"],
    picks: [{ youtube_id: "xYbakpGY9Ys", t: 4136, label: "Epic v. Apple is treated as a payments story: the court's rejection of Apple's anti-steering tactics could loosen the app-store tax and make alternative payment flows more viable. For bitcoin builders, it matters because app distribution rules shape whether open payments can reach users." }], // 1:08:56
  },
  {
    name: "Value for value",
    keywords: ["value for value", "content monetization", "network evolution", "creator payments", "information wants to spread"],
    picks: [{ youtube_id: "j7ICtL37dZs", t: 179, label: "Value for value is presented as a business model that accepts how networks actually spread information. Instead of fighting copying and distribution, creators can design payment models around voluntary support, attribution, and the reality that content will escape controlled channels." }], // 2:59
  },
  {
    name: "XXI",
    keywords: ["xxi", "jack mallers", "mallers", "twenty one", "bitcoin company"],
    picks: [{ youtube_id: "j7ICtL37dZs", t: 1900, label: "Mallers' XXI company is discussed as part of the next wave of bitcoin-native corporate formation. The hosts treat it as a bet that bitcoin companies can be structured around capital markets, product distribution, and public narrative in a way earlier startups could not." }], // 31:40
  },
  {
    name: "Bitcoin venture capital",
    keywords: ["bitcoin venture capital", "venture capital", "craft ventures", "builder judges", "bitcoin startups"],
    picks: [{ youtube_id: "j7ICtL37dZs", t: 3082, label: "Unlocking bitcoin venture capital is tied to making credible investors part of the builder pipeline. Having Craft Ventures and other technology partners judge projects signals that bitcoin startups can be evaluated as venture-scale companies, not only community experiments." }], // 51:22
  },
  {
    name: "Tariffs",
    keywords: ["tariffs", "cryptography export controls", "vibe coding at home", "economic repercussions"],
    picks: [{ youtube_id: "G7lrDU5xpo8", t: 889, label: "Tariffs are used as a macro backdrop for bitcoin and vibe coding: if physical goods get more expensive, software and cryptography remain unusually permissionless and globally reproducible. The hosts connect modern tariffs to older export-control fights over cryptography." }], // 14:49
  },
  {
    name: "Bitcoin dev list",
    keywords: ["bitcoin dev list", "bitcoin development mailing list", "google groups banned", "banned content warning"],
    picks: [{ youtube_id: "G7lrDU5xpo8", t: 1835, label: "Google banning the bitcoin development mailing list is treated as a reminder that core infrastructure still depends on centralized platforms. Even if it was an automated mistake, the warning shows how fragile developer coordination can be when hosted by systems outside bitcoin's control." }], // 30:35
  },
  {
    name: "Off-grid mining",
    keywords: ["off-grid mining", "offgrid mining", "solar batteries", "off-grid cloud", "energy modeling"],
    picks: [{ youtube_id: "Uw5Vh5Tr7To", t: 3042, label: "Off-grid mining is revisited with AI-assisted modeling for solar, batteries, and potentially off-grid cloud infrastructure. The point is not that the model is final, but that AI makes complex energy and mining feasibility analysis much easier to explore." }], // 50:42
  },
  {
    name: "China",
    keywords: ["balaji china", "deepseek", "commoditize the complement", "hardware", "ai china"],
    picks: [{ youtube_id: "Uw5Vh5Tr7To", t: 1913, label: "Balaji's China thesis is discussed through DeepSeek and the strategy of commoditizing the complement. If China drives model and software costs toward zero, value may accrue to hardware, manufacturing, and energy systems where it has structural advantages." }], // 31:53
  },
  {
    name: "Payjoin",
    keywords: ["payjoin", "tornado cash", "bsa", "privacy regulation", "bitcoin privacy"],
    picks: [{ youtube_id: "JIwKzzxCHLg", t: 252, label: "Payjoin is framed alongside Tornado Cash and a broader rethink of financial surveillance law. The hosts argue for reimagining policy from a clean slate that accounts for bitcoin, encryption, and the internet rather than stretching the Bank Secrecy Act over new technology." }], // 4:12
  },
  {
    name: "Ecash mints",
    keywords: ["ecash mints", "cashu", "mint", "reliable mints", "wallet developer"],
    picks: [{ youtube_id: "JIwKzzxCHLg", t: 3453, label: "Ecash mints are discussed as both useful privacy infrastructure and a regulatory hot potato. Wallet developers want reliable mints, but often do not want to become one themselves, creating a pass-the-buck problem around responsibility and trust." }], // 57:33
  },
  {
    name: "Quantum transition",
    keywords: ["burning bitcoin", "quantum transition", "quantum computing", "lost coins", "postquantum bitcoin"],
    picks: [{ youtube_id: "JIwKzzxCHLg", t: 5134, label: "Burning bitcoin in a quantum transition is raised as one of the hardest governance questions: what happens to coins that cannot or will not move to quantum-safe outputs. The segment connects technical migration to legitimacy, property rights, and bitcoin's social contract." }], // 1:25:34
  },
  {
    name: "BitBonds",
    keywords: ["bitbonds", "bit bonds", "bitcoin bonds", "bpi", "treasury refinancing", "us debt"],
    picks: [{ youtube_id: "7Rcn8tMzliM", t: 120, label: "BitBonds are introduced as a policy thought experiment for refinancing US debt with bitcoin-linked instruments. The idea is not yet a concrete proposal, but it gives policymakers a way to imagine bitcoin inside sovereign debt markets rather than only as a reserve asset." }], // 2:00
  },
  {
    name: "Bitwise",
    keywords: ["bitwise", "bitwise etf", "bitcoin etf", "developer donations"],
    picks: [{ youtube_id: "7Rcn8tMzliM", t: 4766, label: "Bitwise's new ETF is discussed through the firm's position as a Silicon Valley crypto asset manager with a bitcoin product line. The hosts connect ETF choices to ecosystem support, especially the value of issuers that route some upside back toward bitcoin development." }], // 1:19:26
  },
  {
    name: "Presidio Bitcoin launch",
    keywords: ["presidio bitcoin", "presidio bitcoin launches", "san francisco", "bitcoin space"],
    picks: [
      { youtube_id: "XlPhtCfOzt0", t: 31, label: "Presidio Bitcoin launches as a physical bitcoin hub in San Francisco, meant for Bay Area builders and visiting bitcoiners. The core mission is to reconnect Silicon Valley technical talent with bitcoin after years of crypto distraction." }, // 0:31
      { youtube_id: "Q7Svo4NJCK0", t: 19, label: "The welcome address frames Presidio Bitcoin as a home for bringing bitcoin back to the Bay: a place where bitcoiners can meet, work, host events, create content, and advance bitcoin from San Francisco." }, // 0:19
    ],
  },
  {
    name: "Silicon Valley bitcoin",
    keywords: ["silicon valley bitcoin", "bay area builders", "bitcoin and silicon valley", "big tech bitcoin"],
    picks: [
      { youtube_id: "Q7Svo4NJCK0", t: 385, label: "Mark Casey explains the original gap: the Bay Area had world-class software talent, entrepreneurship, and cypherpunk history, but no dedicated bitcoin space." }, // 6:25
      { youtube_id: "23aLNIgolSI", t: 360, label: "The live PBJ recording names outreach to Silicon Valley institutions, big tech companies, and technical talent as one of Presidio Bitcoin's core jobs." }, // 6:00
    ],
  },
  {
    name: "Physical Bitcoin spaces",
    keywords: ["physical bitcoin spaces", "third spaces", "bitcoin community spaces", "bitcoin park"],
    picks: [
      { youtube_id: "8XlHRMVsjwQ", t: 1, label: "Rod Roudi uses Bitcoin Park's origin story to show why physical bitcoin spaces matter: people who thought they were alone suddenly find collaborators, friends, and a durable local community." }, // 0:01
      { youtube_id: "Q7Svo4NJCK0", t: 659, label: "Mark describes Presidio Bitcoin as part coworking space, part event space, and part community, where in-person proximity can accelerate the work of advancing bitcoin." }, // 10:59
    ],
  },
  {
    name: "Bitcoin Park",
    keywords: ["bitcoin park", "rod roudi", "nashville bitcoin", "physical bitcoin space"],
    picks: [{ youtube_id: "8XlHRMVsjwQ", t: 1, label: "Rod Roudi brings lessons from Bitcoin Park in Nashville to Presidio Bitcoin's launch, arguing that a local third space can turn isolated bitcoiners into a real community." }], // 0:01
  },
  {
    name: "Bitcoin community spaces",
    keywords: ["bitcoin community spaces", "third spaces", "bitcoin coworking", "bitcoin events"],
    picks: [{ youtube_id: "8XlHRMVsjwQ", t: 62, label: "Community-supported third spaces are described as underrated infrastructure for bitcoin: they create repeated collisions between builders, educators, activists, investors, and newcomers." }], // 1:02
  },
  {
    name: "Open-source software",
    keywords: ["open source bitcoin", "bitcoin open source", "open source software", "freedom technology"],
    picks: [{ youtube_id: "VXYJtFY7wi0", t: 60, label: "The open-source panel centers the launch around a foundational bitcoin idea: open-source software lets people inspect, improve, and rely on tools without asking permission from a company or state." }], // 1:00
  },
  {
    name: "Bitcoin open source",
    keywords: ["bitcoin open source", "open source bitcoin", "open source value bitcoin", "bitcoin contributors"],
    picks: [{ youtube_id: "VXYJtFY7wi0", t: 63, label: "Jack, David, Alex, and Steve discuss why open source is not decorative for bitcoin; it is how trust, collaboration, security, and permissionless building become practical." }], // 1:03
  },
  {
    name: "Bitkey",
    keywords: ["bitkey", "block bitkey", "self custody ux", "private keys"],
    picks: [{ youtube_id: "VXYJtFY7wi0", t: 0, label: "Steve Lee opens the open-source panel by pointing to Bitkey as an example of self-custody UX: a private-key product where the user experience matters as much as the cryptography." }], // 0:00
  },
  {
    name: "Bitcoin self-custody",
    keywords: ["bitcoin self custody", "private keys", "bitkey", "self custody ux"],
    picks: [{ youtube_id: "VXYJtFY7wi0", t: 8, label: "Bitkey is used as a concrete self-custody example, with the launch panel emphasizing that better private-key management can make holding bitcoin safer for normal users." }], // 0:08
  },
  {
    name: "Bitcoin and human rights",
    keywords: ["bitcoin human rights", "human rights foundation", "banking access", "censorship resistance"],
    picks: [{ youtube_id: "VXYJtFY7wi0", t: 250, label: "The open-source discussion connects bitcoin to human-rights work, especially for people who need tools that preserve access to money when banking, speech, or political conditions become hostile." }], // 4:10
  },
  {
    name: "Institutional bitcoin adoption",
    keywords: ["institutional bitcoin adoption", "wall street bitcoin", "public markets bitcoin", "michael saylor"],
    picks: [{ youtube_id: "2e_TfXn-K0A", t: 128, label: "Michael Saylor describes bitcoin's path toward institutional legitimacy, from ETF approval and Wall Street research conferences to major banks and sovereign-wealth audiences newly willing to engage." }], // 2:08
  },
  {
    name: "Bitcoin ETFs",
    keywords: ["bitcoin etf", "bitcoin etfs", "ibit", "institutional capital"],
    picks: [
      { youtube_id: "2e_TfXn-K0A", t: 148, label: "Saylor treats the January 2024 ETF approval as a crossing-the-Rubicon moment, opening institutional access and pulling large pools of capital into bitcoin exposure." }, // 2:28
      { youtube_id: "23aLNIgolSI", t: 840, label: "The live PBJ recording praises ETFs for access while warning that bitcoiners still need to think carefully about custody, usage, and building rather than only financial exposure." }, // 14:00
    ],
  },
  {
    name: "Operation Chokepoint 2.0",
    keywords: ["operation chokepoint 2.0", "debanking bitcoin", "bitcoin bank discrimination", "silvergate signature"],
    picks: [{ youtube_id: "2e_TfXn-K0A", t: 840, label: "Mark shares that even Presidio Bitcoin struggled to secure basic banking because banks stopped responding once they learned the account was for a bitcoin coworking space, connecting the launch to Operation Chokepoint 2.0." }], // 14:00
  },
  {
    name: "Bitcoin banking access",
    keywords: ["bitcoin banking access", "banks custody bitcoin", "sab 121", "sab 122", "bitcoin debanking"],
    picks: [{ youtube_id: "2e_TfXn-K0A", t: 671, label: "Saylor explains why banks still need regulatory permission and confidence to buy, sell, and custody bitcoin, even after SAB 121 was replaced by SAB 122." }], // 11:11
  },
  {
    name: "Digital assets taxonomy",
    keywords: ["digital assets taxonomy", "token currency commodity security", "bitcoin taxonomy", "digital assets framework"],
    picks: [{ youtube_id: "2e_TfXn-K0A", t: 1019, label: "Saylor argues that policymakers and bankers still need a digital-assets taxonomy because many cannot clearly distinguish tokens, currencies, commodities, securities, and bitcoin." }], // 16:59
  },
  {
    name: "Bitcoin education",
    keywords: ["bitcoin education", "educating politicians", "educating bankers", "bitcoin taxonomy"],
    picks: [{ youtube_id: "2e_TfXn-K0A", t: 960, label: "The Saylor conversation turns to education: politicians, bankers, and institutional investors each need a different path to understand what bitcoin is and why it matters." }], // 16:00
  },
  {
    name: "Presidio Bitcoin Jam (PBJ)",
    keywords: ["presidio bitcoin jam", "pbj podcast", "bitcoin podcast", "live pbj"],
    picks: [{ youtube_id: "23aLNIgolSI", t: 0, label: "The launch includes the first live Presidio Bitcoin Jam recording, introducing PBJ as a weekly show from the new studio where Steve, DK, and Max process bitcoin and technology together." }], // 0:00
  },
  {
    name: "Energy-backed money",
    keywords: ["energy backed money", "bitcoin energy money", "energy industry bitcoin", "max webster"],
    picks: [{ youtube_id: "23aLNIgolSI", t: 170, label: "Max Webster explains his path from the energy industry into bitcoin through the idea of bitcoin as energy-backed money, a thesis that later becomes central to Presidio Bitcoin programming." }], // 2:50
  },
  {
    name: "Renewable mining",
    keywords: ["renewable mining", "renewable energy bitcoin mining", "solar mining", "hydro mining", "energy thesis"],
    picks: [{ youtube_id: "XlPhtCfOzt0", t: 4736, label: "Renewable energy mining is defended against simplistic claims that miners steal power from citizens. The hosts emphasize the broader thesis that mining can support renewable buildout by monetizing stranded or underused energy, even if local cases need careful analysis." }], // 1:18:56
  },
]);

addTopicDefs([
  {
    name: "Spark",
    keywords: ["spark", "lightspark", "stablecoins on spark", "spark servers", "spark operators"],
    picks: [
      { youtube_id: "Gwf9-SxYvo4", t: 224, label: "Spark stablecoins are used to build a clearer mental model of Bitcoin L2 trade-offs. The key idea is that wallets can support bitcoin and stablecoins without a separate blockchain, but the server and operator structure introduces new trust and incentive questions." }, // 3:44
      { youtube_id: "Gwf9-SxYvo4", t: 4475, label: "Stablecoins on Spark raise fork-choice and regulatory-pressure questions similar to other large bitcoin-adjacent assets. If a USDB-style asset becomes large, its issuer and operators may influence which bitcoin rules or forks they support." }, // 1:14:35
    ],
  },
  {
    name: "L2 tradeoffs",
    keywords: ["l2 tradeoffs", "layer 2 tradeoffs", "ecash", "spark", "privacy versus data size", "denominations"],
    picks: [{ youtube_id: "Gwf9-SxYvo4", t: 2158, label: "L2 trade-offs are explained through eCash-style denominations, privacy, and data size. The discussion highlights why scaling designs are never purely technical wins: each path chooses different balances between privacy, storage, operator complexity, and payment UX." }], // 35:58
  },
  {
    name: "Payment incentives",
    keywords: ["payment incentives", "incentive structures", "spark incentives", "signer economics", "payment rails"],
    picks: [{ youtube_id: "Gwf9-SxYvo4", t: 3450, label: "Payment incentives are analyzed through who gets paid in a Spark-like system. If a few large operators or signers capture the economics, the rail may scale technically while creating new power centers that compete with open bitcoin payment infrastructure." }], // 57:30
  },
  {
    name: "Google Cloud Universal Ledger",
    keywords: ["google cloud universal ledger", "gcul", "gluck", "google ledger", "universal ledger"],
    picks: [{ youtube_id: "uaN_P80CCFI", t: 4803, label: "Google Cloud Universal Ledger is read as a FOMO response to Stripe Tempo and Circle Arc rather than a deeply articulated strategy. The hosts treat it as another sign that major cloud and payment companies want their own ledger layer for stablecoin-era finance." }], // 1:20:03
  },
  {
    name: "Banks vs tech companies",
    keywords: ["banks", "tech companies", "genius act", "treasury yield", "interchange", "stablecoin yield"],
    picks: [{ youtube_id: "uaN_P80CCFI", t: 5387, label: "Tech companies become a threat to banks when stablecoin balances turn treasury yield into a richer rewards pool than interchange. Even if the Genius Act blocks direct yield sharing, distribution deals can route value through partners and pressure the banking model." }], // 1:29:47
  },
  {
    name: "Bitchat",
    keywords: ["bitchat", "proof of personhood", "local chat", "bluetooth mesh", "bot detection"],
    picks: [
      { youtube_id: "ZDN4LX3doJg", t: 1677, label: "Bitchat adoption is treated as meaningful because real usage is harder than technical novelty. The hosts focus on its potential to create proof-of-personhood from in-person social graphs without Worldcoin-style biometric infrastructure." }, // 27:57
      { youtube_id: "zrOwT30p5rM", t: 1685, label: "Bitchat's mutual favorite mechanic is framed as a local, social proof-of-personhood primitive. If people verify each other in person, the same graph could extend beyond private chat into a more bot-resistant internet." }, // 28:05
    ],
  },
  {
    name: "Stablecoin adoption",
    keywords: ["stablecoin adoption", "stablecoin wallet", "global south", "argentina", "brazil", "dollar wallet"],
    picks: [{ youtube_id: "ZDN4LX3doJg", t: 4317, label: "Stablecoin adoption is grounded in demand for dollars, especially in countries where people actually need dollar savings and payments. The hosts contrast that with the US, where Apple Pay and bank rails make a standalone stablecoin wallet much harder to justify." }], // 1:11:57
  },
  {
    name: "Proto",
    keywords: ["proto", "proto mining", "mining hardware", "bitmain", "mining launch"],
    picks: [{ youtube_id: "RIg8yQZPwyw", t: 246, label: "Proto's mining launch is treated as a major attempt to reshape bitcoin mining hardware, not just another product announcement. The hosts focus on efficiency, repairability, and whether new hardware entrants can reduce dependence on incumbent manufacturers." }], // 4:06
  },
  {
    name: "Stripe Tempo",
    keywords: ["stripe tempo", "tempo", "stripe l1", "paradigm", "circle arc", "stablecoin l1"],
    picks: [{ youtube_id: "RIg8yQZPwyw", t: 4856, label: "Stripe Tempo and Circle Arc are grouped as new corporate L1s for stablecoins. The hosts see the announcements as confirmation that payment companies want controlled settlement layers, while bitcoiners need to explain why open rails are different." }], // 1:20:56
  },
  {
    name: "KYC'd internet",
    keywords: ["kyc internet", "kyc'd internet", "pirate internet", "nick carter", "identity"],
    picks: [{ youtube_id: "ajsWQStK1JU", t: 98, label: "The KYC'd internet is framed as a loss of the cypherpunk edge that made bitcoin possible. As people age into families, careers, and regulated platforms, the temptation to accept identity-gated systems grows even though it weakens the original permissionless internet." }], // 1:38
  },
  {
    name: "Bitcoin market structure",
    keywords: ["bitcoin market", "financial institutions", "settlement", "store of value", "decentralization risk"],
    picks: [{ youtube_id: "ajsWQStK1JU", t: 898, label: "Bitcoin market structure risk is analyzed through a future where most day-to-day payments never touch L1 and institutions handle settlement. The open question is how many custodians, ETFs, banks, and native holders are needed for the network to remain meaningfully decentralized." }], // 14:58
  },
  {
    name: "Bitcoin energy security",
    keywords: ["energy backed money", "power backed money", "proof of work", "tail emission", "monero"],
    picks: [{ youtube_id: "ajsWQStK1JU", t: 2159, label: "Bitcoin is defended as energy-backed money: remove the energy cost and the system loses its core security property. The Monero comparison is used to explore why proof-of-work economics and long-term issuance choices matter for staying power." }], // 35:59
  },
  {
    name: "MSTR earnings",
    keywords: ["mstr earnings", "strategy earnings", "saylor earnings call", "mstr call"],
    picks: [{ youtube_id: "zrOwT30p5rM", t: 4740, label: "MSTR earnings are treated as Saylor theater plus serious capital-structure education. The call reinforces how Strategy is using public markets, preferred instruments, and bitcoin conviction to create a financial machine around BTC accumulation." }], // 1:19:00
  },
  {
    name: "In-kind Bitcoin ETFs",
    keywords: ["in-kind bitcoin etf", "in kind etf", "etf approval", "bitcoin etf redemption"],
    picks: [{ youtube_id: "zrOwT30p5rM", t: 5201, label: "In-kind Bitcoin ETF approval matters because it makes ETF plumbing more bitcoin-native. Allowing creation and redemption with actual BTC can reduce friction, improve market efficiency, and make the wrapper less detached from the underlying asset." }], // 1:26:41
  },
  {
    name: "STRC stablecoin hypothesis",
    keywords: ["strc stablecoin", "mstr stablecoin", "stretch stablecoin", "tokenized strc", "robinhood strc"],
    picks: [{ youtube_id: "nEJ-cEzcDdk", t: 3148, label: "The STRC stablecoin hypothesis imagines brokers or fintechs buying Strategy's Stretch-like security, tokenizing it, and offering a dollar product globally. The problem is fragmentation: multiple issuers could wrap the same yield source under different names and split liquidity." }], // 52:28
  },
  {
    name: "Goose",
    keywords: ["goose", "vibe coding with goose", "block goose", "coding agent"],
    picks: [{ youtube_id: "nEJ-cEzcDdk", t: 861, label: "Goose is discussed as a vibe-coding platform that could turn PBJ ideas and meetup RFPs into working apps. The broader point is that coding agents need discovery surfaces for good project ideas, not just better implementation loops." }], // 14:21
  },
  {
    name: "AI model risk",
    keywords: ["ai risk", "model risk", "colluding bots", "big reset", "verify ai"],
    picks: [{ youtube_id: "nEJ-cEzcDdk", t: 2385, label: "The biggest risk to bitcoin is framed through dependence on AI systems people do not understand. If users rely on other AIs to audit AI behavior, the trust problem becomes recursive and demands multiple independent checks rather than one magic verifier." }], // 39:45
  },
  {
    name: "Quantum Bitcoin Summit",
    keywords: ["quantum bitcoin summit", "quantum summit", "postquantum bitcoin", "quantum transition"],
    picks: [{ youtube_id: "r91-r97-ksc", t: 10, label: "The Quantum Bitcoin Summit is presented as a rare gathering of quantum physicists, cryptographers, and bitcoin experts focused on response paths rather than panic. The hosts emphasize that the summit clarified multiple threat threads and transition questions." }], // 0:10
  },
  {
    name: "Quantum transition",
    keywords: ["quantum transition", "lost coins", "pay to public key", "postquantum cryptography", "early miners"],
    picks: [{ youtube_id: "r91-r97-ksc", t: 1336, label: "The quantum transition raises the lost-coin problem: even if post-quantum cryptography works perfectly, old pay-to-public-key coins from early miners may never move. The hard question is whether exposed but inactive coins should remain spendable in a quantum future." }], // 22:16
  },
  {
    name: "AI data centers",
    keywords: ["ai mining energy", "bitcoin mining ai", "hpc", "high performance computing", "data centers"],
    picks: [{ youtube_id: "r91-r97-ksc", t: 4266, label: "AI and mining energy are reframed as compatible rather than competitive. Miners are good at finding and developing low-cost power, and that capability may become valuable to AI data centers even when pure hash-rate economics are not the end state." }], // 1:11:06
  },
  {
    name: "Bitcoin venture capital",
    keywords: ["bitcoin vc", "ego death capital", "100 million", "bitcoin venture capital", "bitcoin startups"],
    picks: [{ youtube_id: "NrywCKRjHDk", t: 294, label: "Ego Death Capital's $100 million raise is treated as ecosystem infrastructure: more dedicated bitcoin venture capital means more startups can build around bitcoin without needing to contort themselves into broader crypto narratives." }], // 4:54
  },
  {
    name: "Tokenized stocks",
    keywords: ["tokenized stocks", "robinhood", "openai stock", "spacex token", "private market tokenization"],
    picks: [{ youtube_id: "NrywCKRjHDk", t: 5262, label: "Robinhood's tokenized private-stock announcement is treated cautiously because OpenAI said the product was not OpenAI stock. The broader issue is whether token wrappers around private-market exposure create access or just confusing synthetic claims." }], // 1:27:42
  },
  {
    name: "Builder",
    keywords: ["builder", "₿uilder", "builder summit", "builder program", "bitcoin builders"],
    picks: [
      { youtube_id: "9Cr-5lSGUU8", t: 19, label: "The Builder recap marks a shift from talking about bitcoin products to organizing builders around them. The format mixes product demos, Socratic discussion, and community formation so bitcoin infrastructure work becomes legible to more founders." }, // 0:19
      { youtube_id: "tyOeK1bfM5E", t: 357, label: "Builder is described as a movement spreading beyond one Presidio Bitcoin meetup. The goal is to welcome Silicon Valley into bitcoin product building while giving builders a recurring place to test ideas and recruit collaborators." }, // 5:57
    ],
  },
  {
    name: "Fannie Mae",
    keywords: ["fannie mae", "freddie mac", "mortgage", "bitcoin collateral", "btc mortgage"],
    picks: [{ youtube_id: "9Cr-5lSGUU8", t: 669, label: "Fannie Mae accepting bitcoin is discussed as part of a broader product session on Square acceptance, Lightning, and Coinbase's credit card. The important signal is that mainstream housing finance is beginning to acknowledge BTC as collateral or underwriting context." }], // 11:09
  },
  {
    name: "Stratum V2",
    keywords: ["stratum v2", "stratum", "mining pool", "share acceptance", "mining profitability"],
    picks: [{ youtube_id: "tyOeK1bfM5E", t: 2971, label: "Stratum V2 is explained as mining infrastructure that can improve decentralization and profitability. The hosts focus on the concrete claim that better share handling can increase miner profitability by roughly 7%, which is huge in a low-margin industry." }], // 49:31
  },
  {
    name: "Bitcoin standard",
    keywords: ["bitcoin standard", "life on a bitcoin standard", "capital singularity", "bitcoin hurdle rate"],
    picks: [{ youtube_id: "75Q1RRl2GtQ", t: 167, label: "Life on a bitcoin standard is explored alongside AI, cheap energy, and collapsing software/media costs. The question is what work, company formation, and capital allocation look like when bitcoin becomes the savings baseline and everything else must clear its hurdle rate." }], // 2:47
  },
  {
    name: "Version control for vibe coding",
    keywords: ["version control", "vibe coding", "founders you should know", "ai coding workflow"],
    picks: [{ youtube_id: "75Q1RRl2GtQ", t: 974, label: "Version control for vibe coding emerges from the need to manage AI-built products that can change quickly and break silently. The segment connects coding-agent workflows to founder recruiting and the need for better infrastructure around fast-moving AI software projects." }], // 16:14
  },
  {
    name: "Bitcoin treasury companies",
    keywords: ["treasury companies", "btc treasury", "bitcoin treasury saturation", "monthly meetup"],
    picks: [{ youtube_id: "75Q1RRl2GtQ", t: 4733, label: "Bitcoin treasury company saturation becomes a community topic rather than only a market topic. The hosts propose a recurring meetup to track strategies, risks, and global expansion as the category spreads beyond early public-company pioneers." }], // 1:18:53
  },
  {
    name: "Lightning yield",
    keywords: ["lightning yield", "10% yield", "routing yield", "lsp", "lightning service provider"],
    picks: [{ youtube_id: "4YN4cxBgA1g", t: 2262, label: "Generating 10% bitcoin yield through Lightning routing is framed as a major milestone because it comes from real payment flow rather than financial engineering. The key question is how value splits among LSPs, wallets, and applications once Lightning routing becomes an economic layer." }], // 37:42
  },
  {
    name: "Circle",
    keywords: ["circle ipo", "circle", "usdc", "tether tron", "stablecoin ipo"],
    picks: [{ youtube_id: "4YN4cxBgA1g", t: 626, label: "Circle's IPO is discussed against the claim that Tether on Tron may have already won the stablecoin market. The segment asks whether public-market legitimacy can overcome distribution, network effects, and the reality of where stablecoins are actually used." }], // 10:26
  },
]);

addTopicDefs([
  {
    name: "Stablecoin UX",
    keywords: ["stablecoin ux", "stablecoin pairs", "chain pair explosion", "gas fees", "bridged usdc", "native usdc", "interoperability"],
    picks: [{ youtube_id: "oeJpuHfd8dg", t: 2349, label: "The stablecoin demo exposes the UX reality behind agent wallets: currency, issuer, chain, native-versus-bridged assets, and gas-token requirements create a combinatorial mess. Even when tools like MetaMask and Phantom make swaps possible, normal users and agents still face chain/pair fragmentation and interoperability pain." }], // 39:09
  },
  {
    name: "Lightning interoperability",
    keywords: ["lightning interoperability", "lightning simplifier", "cashu wallet", "fedimint wallet", "arc wallet", "spark wallet", "consumer abstraction"],
    picks: [{ youtube_id: "oeJpuHfd8dg", t: 3162, label: "Lightning is framed as the simplifier that stablecoins lack: consumers can send and receive bitcoin across Lightning, Cashu, Fedimint, Ark, or Spark without understanding which system either side uses. The important abstraction is interoperability without bridges, swaps, gas tokens, or chain-specific balances." }], // 52:42
  },
  {
    name: "Vora",
    keywords: ["vora", "jesse posner", "eric", "personal agent", "openclaw security"],
    picks: [{ youtube_id: "NejxiHIBy_w", t: 702, label: "Jesse Posner's Vora presentation turns OpenClaw security into a broader AI vision: personal agents need sovereign data, secure execution, and eventually the ability to participate in free markets. The hosts emphasize how far the pitch moved beyond a narrow bitcoin product into something legible to a broader tech audience." }], // 11:42
  },
  {
    name: "Personal agent hardware",
    keywords: ["personal agent hardware", "personal server", "local ai", "secure local ai", "mac mini", "airgapped agent"],
    picks: [{ youtube_id: "NejxiHIBy_w", t: 977, label: "OpenClaw creates latent demand for personal agent hardware: people are already buying machines to run agents, but local execution alone does not make Gmail, credit cards, or private data safe. Vora's opportunity is to turn that demand into secure local AI systems with confidentiality and a fiduciary-style agent model." }], // 16:17
  },
  {
    name: "Agent authentication",
    keywords: ["agent authentication", "agent custody", "agent auth", "one password", "credentials", "private keys", "security model"],
    picks: [{ youtube_id: "NejxiHIBy_w", t: 1339, label: "Personal agents still lack a resolved security model for authentication and custody. The hosts use OnePassword, private keys, tax documents, and cloud-code orchestration to ask how an agent can do useful work without exposing the credentials and secrets that make the work possible." }], // 22:19
  },
  {
    name: "Lightning scaling",
    keywords: ["lightning scaling", "block space demand", "lightning adoption", "mempool", "lightning fees"],
    picks: [{ youtube_id: "NejxiHIBy_w", t: 2024, label: "Lightning scaling creates a two-sided tension: skeptics ask whether it consumes too much block space, while others ask whether it reduces L1 fee demand. The hosts argue successful Lightning adoption likely increases block-space demand over time, with the bigger risk being too much demand rather than none." }], // 33:44
  },
  {
    name: "Unhuman domains",
    keywords: ["unhuman domains", "unhuman.domains", "agent-first services", "domain registration", "bot first", "bitcoin payments"],
    picks: [{ youtube_id: "NejxiHIBy_w", t: 3746, label: "Unhuman domains is presented as an early agent-first digital service: a bot-facing domain registrar flow that explains how an agent can register a domain and pay in bitcoin. It emerged because normal registrars, CAPTCHAs, accounts, and credit-card flows were hostile to agents doing useful work directly." }], // 1:02:26
  },
  {
    name: "Lightning infrastructure",
    keywords: ["lightning infrastructure", "l402", "l42", "open standards", "lightning providers", "mdk", "alby", "lexe", "lightspark"],
    picks: [{ youtube_id: "xID5cFaXAu0", t: 2266, label: "The hackathon planning turns into a broader Lightning infrastructure question: bring in providers like Lightspark, MDK, Alby, and Lexe for good builder experience, while avoiding dependence on any single company. Open standards such as L402 are framed as the cleaner access layer because companies can improve the experience without owning the rail." }], // 37:46
  },
  {
    name: "Lightning yield",
    keywords: ["autonomous lsp", "lsp", "ldk server", "channel management", "liquidity management", "inbound liquidity", "permissionless yield"],
    picks: [{ youtube_id: "xID5cFaXAu0", t: 2468, label: "An autonomous LSP is proposed as permissionless Lightning yield infrastructure: one-line deploy software, send it bitcoin, and let it manage channels and liquidity. The missing pieces are automated operations and inbound-liquidity management, but LDK and prior work like CLBOSS make the vision feel increasingly buildable." }], // 41:08
  },
  {
    name: "Human Bitcoin addresses",
    keywords: ["human bitcoin address", "human readable address", "hba", "bitcoin human address", "human-readable names"],
    picks: [{ youtube_id: "H5dDVTNY4R4", t: 1746, label: "Human bitcoin addresses are proposed as a bridge between long cryptographic strings and normal human communication. The point is not to replace all computer-readable payment flows, but to support cases where people want to say, send, or recognize a human-readable destination." }], // 29:06
  },
  {
    name: "SHRINCS and SHRIMPS",
    keywords: ["shrincs", "shrimps", "post-quantum signatures", "hash-based signatures", "jonas nick"],
    picks: [{ youtube_id: "H5dDVTNY4R4", t: 4880, label: "SHRINCS and related hash-based signature work are introduced as a practical path toward quantum-resistant bitcoin signatures. The credibility of the authors matters because the proposal sits in the uncomfortable middle ground between real research progress and quantum-risk panic." }], // 1:21:20
  },
  {
    name: "Bitcoin gift cards",
    keywords: ["bitcoin gift card", "fold gift card", "fold", "gift bitcoin", "bitkey gift"],
    picks: [
      { youtube_id: "H5dDVTNY4R4", t: 3727, label: "Bitcoin gift cards expose how onboarding friction can kill an otherwise natural use case. The hosts like gifting bitcoin in principle, but a redemption flow that takes 15 minutes and still fails turns the gift into support burden instead of delight." }, // 1:02:07
      { youtube_id: "SqExLGqYIhc", t: 3821, label: "Fold's bitcoin gift card is treated as one of the cleanest ways to introduce someone to bitcoin because it has the familiar form factor of a credit-card-sized gift. The strategic hope is that a simple physical gift can avoid the awkwardness of making someone install and understand a wallet before receiving value." }, // 1:03:41
    ],
  },
  {
    name: "Gemini",
    keywords: ["gemini 3", "google ai", "google super pro", "ai model"],
    picks: [{ youtube_id: "H5dDVTNY4R4", t: 384, label: "Gemini 3 changes Max's view of Google's AI position: it is the first model experience compelling enough for him to pay for the highest consumer tier. The moment matters because Google shifts from being doubted in frontier AI to looking strategically credible again." }], // 6:24
  },
  {
    name: "Bitcoin in AI models",
    keywords: ["bitcoin in ai models", "ai thinking model", "bitcoin principles", "move 37", "bitcoin implementation"],
    picks: [{ youtube_id: "SqExLGqYIhc", t: 2511, label: "Bitcoin in AI models is framed as more than asking an LLM facts about bitcoin. The hosts imagine training or refining a model around bitcoin's principles so it could discover a 'Move 37' implementation idea that respects the system's goals better than human intuition alone." }], // 41:51
  },
  {
    name: "Bitkey",
    keywords: ["bitkey", "bit key", "private purchasing", "fedex pickup", "hardware wallet privacy"],
    picks: [{ youtube_id: "SqExLGqYIhc", t: 1199, label: "Bitkey private purchasing is presented as the obvious way to buy a hardware wallet: pay in bitcoin and pick it up at a FedEx-style location without tying the device to personal shipping data. The privacy point is concrete because the product is meant to secure private keys." }], // 19:59
  },
  {
    name: "Quantum FUD",
    keywords: ["quantum fud", "quantum price", "quantum risk priced", "bitcoin quantum risk"],
    picks: [{ youtube_id: "VdQp4TXf4B4", t: 2177, label: "Quantum FUD is discussed as a possible explanation for bitcoin's price weakness, but the hosts separate market narrative from technical news. From their view, little had changed since the Quantum Bitcoin Summit, so price action alone should not be mistaken for new quantum evidence." }], // 36:17
  },
  {
    name: "Bitcoin merchant community",
    keywords: ["bitcoin merchant community", "merchant kit", "marketing kit", "local merchants", "itty bitty plushies"],
    picks: [{ youtube_id: "VdQp4TXf4B4", t: 255, label: "The bitcoin merchant community is organized around practical local action: visit merchants, use Spiral's marketing kit, and give local champions leave-behind materials. The itty bitty plushies are funny, but the substantive point is turning merchant adoption into a repeatable grassroots workflow." }], // 4:15
  },
  {
    name: "Bitcoin merchant adoption",
    keywords: ["square bitcoin acceptance", "square seller", "merchant fees", "bitcoin acceptance", "merchant onboarding"],
    picks: [
      { youtube_id: "_FwG1hkNVUE", t: 52, label: "Square's bitcoin acceptance going GA turns merchant adoption from announcement into operational reality. The hosts map the real rollout details: a few taps for many sellers, gotchas around upgrades and configuration, and the need to explain why lower payment fees can materially improve margins." }, // 0:52
      { youtube_id: "Zxtndnb0AHw", t: 661, label: "Merchant adoption is framed in margin language rather than ideology: cutting processing fees from 3% to 1% can be a dramatic profit improvement for low-margin businesses. The hosts argue for simple leave-behind materials that help employees and owners understand the pitch after the conversation ends." }, // 11:01
    ],
  },
  {
    name: "Lava",
    keywords: ["lava", "lava drama", "dlc", "bitcoin-backed lending", "non-custodial lending"],
    picks: [{ youtube_id: "_FwG1hkNVUE", t: 4502, label: "The Lava drama sits inside the larger search for non-custodial bitcoin-backed lending. The hosts revisit the promise of DLC-based collateralized loans, why the category is so compelling, and why trust, execution, and product details matter as much as the headline claim." }], // 1:15:02
  },
  {
    name: "Type One Summit",
    keywords: ["type one summit", "type 1 summit", "energy summit", "live recap"],
    picks: [
      { youtube_id: "EzdLVuu7gA0", t: 0, label: "The live Type One Summit recap treats the event as a convergence point for bitcoin, AI, and energy infrastructure. The hosts use the summit to connect frontier compute demand with new energy sources rather than treating mining as a narrow industry topic." }, // 0:00
      { youtube_id: "hjIJ9PHYa-w", t: 28, label: "The Type One Summit is framed around an expansive energy thesis: human progress correlates with harnessing more energy, not using less. Bitcoin and AI become demand-side catalysts for building abundant power rather than apologizing for consumption." }, // 0:28
    ],
  },
  {
    name: "Fusion energy",
    keywords: ["fusion", "fusion curves", "nuclear", "reactor", "terawatts"],
    picks: [{ youtube_id: "EzdLVuu7gA0", t: 220, label: "Fusion energy is discussed through cost curves rather than science-fiction optimism. Max remains skeptical of nuclear broadly, but the summit's presentation opens him to the possibility that fusion breakthroughs could become relevant to bitcoin and AI-scale power demand." }], // 3:40
  },
  {
    name: "Ocean power",
    keywords: ["ocean power", "ocean energy", "pontalaza", "frontier energy", "gridless"],
    picks: [{ youtube_id: "EzdLVuu7gA0", t: 927, label: "Ocean power is treated as a frontier-energy use case where bitcoin can be the first buyer in a new physical location. The Gridless comparison matters: mining can bootstrap stranded or novel energy sources before broader industrial demand arrives." }], // 15:27
  },
  {
    name: "AI energy demand",
    keywords: ["ai energy", "compute demand", "gigawatts", "frontier training runs", "data centers"],
    picks: [
      { youtube_id: "EzdLVuu7gA0", t: 469, label: "AI energy demand is mapped in gigawatts: frontier training runs may require multi-gigawatt campuses by 2030, with Meta, Google, Elon, and China all pushing the curve. The conclusion is that bitcoin's energy conversation now sits inside a much larger compute-power race." }, // 7:49
      { youtube_id: "BmfqFfY_ZnQ", t: 2918, label: "Bitcoin is described as a portal between digital demand and physical energy development. The difficulty adjustment becomes the key concept for explaining to physicists why bitcoin can stabilize frontier power projects and create a Nobel-scale bridge between computation and energy." }, // 48:38
    ],
  },
  {
    name: "Bitcoin white paper",
    keywords: ["white paper", "17 years", "hal finney", "cypherpunks mailing list", "satoshi"],
    picks: [{ youtube_id: "aVWpAjRIIEM", t: 202, label: "The 17-year white paper anniversary is used to emphasize how quietly bitcoin began: only two people responded in the first 24 hours, including Hal Finney. The contrast between tiny initial reception and global consequence reinforces the episode's theme of underappreciated early signals." }], // 3:22
  },
  {
    name: "BIP 444",
    keywords: ["bip 444", "spam", "knots", "core v30", "contentious fork", "op_return"],
    picks: [{ youtube_id: "aVWpAjRIIEM", t: 4163, label: "BIP 444 is introduced as an anti-spam proposal born out of the Ocean, Knots, and Core v30 debates. The key issue is not just technical filtering, but whether a proposal to remove unwanted data from bitcoin becomes a contentious fork." }], // 1:09:23
  },
  {
    name: "Block Bitcoin treasury strategy",
    keywords: ["block bitcoin treasury strategy", "square reserve", "square strategic bitcoin reserve", "saylor style", "block bitcoin reserve"],
    picks: [{ youtube_id: "aVWpAjRIIEM", t: 892, label: "Block's bitcoin treasury strategy is contrasted with Saylor's leverage-heavy approach: keep the bitcoin received from Square customers rather than issuing financial instruments to buy more. It is a slower merchant-driven accumulation path, but one tied directly to payment adoption." }], // 14:52
  },
  {
    name: "Strike",
    keywords: ["strike", "strike credit line", "bitcoin-backed credit line", "line of credit"],
    picks: [{ youtube_id: "Zxtndnb0AHw", t: 4814, label: "Strike's bitcoin-backed line of credit prompts a distinction between term loans and flexible credit products. The appeal is giving bitcoin holders access to dollars without selling, while the product details determine whether it behaves like useful liquidity or just another short-duration lending product." }], // 1:20:14
  },
  {
    name: "Zcash",
    keywords: ["zcash", "bitcoin fails", "privacy coin", "presidio zcash jam"],
    picks: [{ youtube_id: "Zxtndnb0AHw", t: 2, label: "Zcash is jokingly introduced as a fallback if bitcoin fails, but the underlying topic is serious: privacy remains a live pressure point in bitcoin payments. The comparison gives the hosts a way to ask what bitcoin must solve itself versus what users might seek elsewhere." }], // 0:02
  },
  {
    name: "Signal",
    keywords: ["signal", "bitcoin for signal", "mobilecoin", "messenger payments"],
    picks: [{ youtube_id: "ESPiivspKsU", t: 292, label: "The Bitcoin-for-Signal campaign is evaluated against Signal's actual constraints: privacy, brain-dead-simple key management, and avoiding users losing money. The point is that bitcoin integration into a mainstream messenger must clear product and trust thresholds, not just ideological ones." }], // 4:52
  },
  {
    name: "Open-source funding",
    keywords: ["open source funding", "developer funding", "tether donation", "bitcoin development funding"],
    picks: [{ youtube_id: "ESPiivspKsU", t: 5382, label: "Open-source funding is discussed through the optics of highly profitable bitcoin-adjacent companies donating little or nothing to development. The hosts avoid saying anyone must donate, but argue that visible support matters when the whole ecosystem depends on shared infrastructure." }], // 1:29:42
  },
  {
    name: "Silicon Valley",
    keywords: ["silicon valley", "trust the system", "bitcoin anthropology", "smart people dismissed bitcoin"],
    picks: [{ youtube_id: "n4G1syj-mxw", t: 14, label: "Silicon Valley missing bitcoin is explained as a trust problem, not an intelligence problem. The useful axis is whether someone trusts existing institutions enough to dismiss bitcoin's threat model, even if they are technically sophisticated." }], // 0:14
  },
  {
    name: "Block vs Stripe",
    keywords: ["block vs stripe", "stripe", "tempo", "corporate adoption", "payments company"],
    picks: [{ youtube_id: "n4G1syj-mxw", t: 1578, label: "Block versus Stripe is framed as a time-horizon question: Stripe may win short-term Silicon Valley excitement with Tempo and stablecoin products, while Block's longer bitcoin infrastructure work may compound over decades. The comparison is about corporate strategy, not just payment rails." }], // 26:18
  },
  {
    name: "Mining centralization",
    keywords: ["miner centralization", "slipstream", "mining centralization", "mining permissionless", "transaction accelerator"],
    picks: [{ youtube_id: "tfBVyn-KDdc", t: 1396, label: "Miner centralization risk appears through private transaction submission services like Slipstream and mining accelerators. If high-fee transactions increasingly route through proprietary APIs, new miners may face hidden barriers to competing in what should remain permissionless mining." }], // 23:16
  },
  {
    name: "Core v30",
    keywords: ["core v30", "bitcoin core", "op_return", "bitcoin spam", "knots drama"],
    picks: [{ youtube_id: "tfBVyn-KDdc", t: 279, label: "Core v30 is used to separate social-media urgency from in-person developer reality. The hosts argue the issue matters, but the intensity of online debate can distort perceived consensus and make bitcoin feel more fragile than it is." }], // 4:39
  },
  {
    name: "Attention algorithms",
    keywords: ["attention algorithm", "algorithmic curation", "bad content", "apple filtering", "slippery slope"],
    picks: [{ youtube_id: "tfBVyn-KDdc", t: 2631, label: "Attention algorithms become a cautionary analogy for bitcoin filtering debates. Outsourcing judgments about 'bad' content to opaque lists or committees may look convenient, but it introduces a slippery slope of hidden governance over what transactions are acceptable." }], // 43:51
  },
  {
    name: "Bitcoin billionaire flippening",
    keywords: ["billionaire flippening", "bitcoin billionaires", "cognitive elite", "bitcoin wealth"],
    picks: [{ youtube_id: "hjIJ9PHYa-w", t: 2985, label: "The billionaire flippening thesis predicts that somewhere between $100k and $1M per BTC, most of the world's billionaires could be bitcoiners. The strategic implication is that bitcoin-native capital may become the funding base for open models, energy infrastructure, and public goods." }], // 49:45
  },
  {
    name: "iPhone memory",
    keywords: ["iphone 17", "memory upgrade", "local ai", "hacker proof", "apple memory"],
    picks: [{ youtube_id: "hjIJ9PHYa-w", t: 4830, label: "The iPhone 17 memory upgrade is treated as an AI infrastructure signal rather than a normal spec bump. More device memory matters because local models, privacy-preserving agents, and on-device intelligence depend on consumer hardware capacity." }], // 1:20:30
  },
]);

addTopicDefs([
  {
    name: "Bitcoin merchant adoption",
    keywords: ["square bitcoin conversions", "square bitcoin acceptance", "bitcoin stickers", "merchant btc conversion", "zero processing fees"],
    picks: [{ youtube_id: "BmfqFfY_ZnQ", t: 2001, label: "Square's release is framed as both a product rollout and a normalization strategy: Bitcoin stickers in stores make the payment option feel real, while merchant BTC conversions let sellers route a percentage of fiat sales into bitcoin automatically. Acceptance going live for all merchants, paired with waived fees, creates a practical adoption path rather than just another announcement." }], // 33:21
  },
  {
    name: "Moneydevkit (MDK)",
    keywords: ["mdk stripe", "payment developer experience", "permissionless payments", "vibe coders", "developer docs"],
    picks: [{ youtube_id: "VdQp4TXf4B4", t: 4567, label: "MDK's Stripe comparison is about developer experience, not only speed: five-minute payment setup may become table stakes across Spark, Lexe, and other SDKs. The differentiator is messaging, docs, support, and a product surface that lets vibe coders add payments without understanding APIs or pull requests." }], // 1:16:07
  },
  {
    name: "Cash App",
    keywords: ["cash app lightning dollars", "dollars over lightning", "cash app remittance", "cash app bitcoin wallet", "lightning dollars"],
    picks: [{ youtube_id: "_FwG1hkNVUE", t: 2857, label: "Cash App's dollars-over-Lightning path is treated as a potentially historic product shift: a user can hold dollars, send through Cash App, and have the recipient receive bitcoin over Lightning. The hosts frame it as a remittance and payment-network threat because it makes bitcoin rails invisible to the sender." }], // 47:37
  },
  {
    name: "AI privacy",
    keywords: ["ai privacy", "open secret", "maple ai", "private ai", "local models", "healthcare ai"],
    picks: [{ youtube_id: "uaN_P80CCFI", t: 1792, label: "AI privacy is framed as more urgent than ordinary consumer privacy because prompts expose business secrets, health questions, mental-health concerns, and deeply personal research in a way search never did. Open Secret and Maple AI show one path, but the trade-off is that privacy-preserving open models may lag frontier closed models." }], // 29:52
  },
  {
    name: "Bitcoin-backed loans",
    keywords: ["lava leverage", "bitcoin lending leverage", "borrow stablecoin dollars", "bitcoin collateral", "responsible lending"],
    picks: [{ youtube_id: "ZDN4LX3doJg", t: 5299, label: "Bitcoin lending is treated through Lava's actual user behavior: deposit BTC, borrow stablecoin dollars, then sometimes use the proceeds to buy more bitcoin. The hosts separate legitimate dollar liquidity from circular leverage, asking whether the UI should model risks and guide users rather than blindly encourage the behavior." }], // 1:28:19
  },
  {
    name: "App store gatekeeping",
    keywords: ["google play", "wallet apps", "non-custodial wallets", "app store policy", "wallet distribution"],
    picks: [{ youtube_id: "RIg8yQZPwyw", t: 3708, label: "The Google Play wallet hiccup shows how app-store policy can become a choke point for non-custodial wallets. Even if the rule is clarified later, builders have to educate platform gatekeepers before wallet distribution gets accidentally swept into restrictions meant for custodial or exchange apps." }], // 1:01:48
  },
  {
    name: "Agentic commerce",
    keywords: ["agent payments", "pay agents", "real-time payments", "builder agents", "agent authentication"],
    picks: [{ youtube_id: "tyOeK1bfM5E", t: 1280, label: "The Builder expansion segment frames real-time bitcoin payments as the connective tissue for humans and agents doing work together. The goal is not merely more meetups, but a builder movement where agent workflows, authentication, and payments become default project primitives." }], // 21:20
  },
  {
    name: "Worldcoin",
    keywords: ["worldcoin", "orb", "proof of human", "ubi", "biometrics", "openai worldcoin"],
    picks: [{ youtube_id: "NYKHpoKwCIw", t: 2897, label: "Worldcoin is examined as a biometric proof-of-human system with a token incentive and possible UBI ambitions. The hosts focus on the privacy risk of orb-scanned identity and question whether 'human not bot' is even the right primitive for future online interactions." }], // 48:17
  },
  {
    name: "Bitcoin fee market",
    keywords: ["block space fees", "bitcoin nfts", "fee market", "spam debate", "censorship resistance"],
    picks: [{ youtube_id: "ogQ2z9lBHC8", t: 2887, label: "The spam debate is reframed as economics rather than taste: if block space is scarce, fees should decide which uses survive. NFTs may be annoying, but if someone pays the market-clearing fee, the network can preserve censorship resistance while higher layers handle everyday payments." }], // 48:07
  },
  {
    name: "Bitcoin usefulness",
    keywords: ["bitcoin usefulness", "use cases", "vpn", "vps", "obscura", "nostr zaps"],
    picks: [{ youtube_id: "G7lrDU5xpo8", t: 4266, label: "Bitcoin usefulness is framed as solving problems that cannot be done with ordinary payment rails, not proving ideology by buying coffee. VPNs, VPSs, Obscura-style privacy flows, and Nostr zaps are cited as digitally native services where bitcoin and Lightning are essential rather than decorative." }], // 1:11:06
  },
  {
    name: "Vibe coding",
    keywords: ["early vibe coding", "ai coding", "deployment", "time to market", "developer expansion"],
    picks: [{ youtube_id: "7Rcn8tMzliM", t: 884, label: "Early vibe coding is described as both impressive and not yet turnkey: AI can generate huge amounts of infrastructure quickly, but deployment, hosting, and product-quality gaps still require human judgment. The key distinction is whether AI reduces skilled developers' time-to-market or expands who can build at all." }], // 14:44
  },
]);

addTopicDefs([
  {
    name: "Bitcoin leadership",
    keywords: ["bitcoin leaders", "jack dorsey", "michael saylor", "greg maxwell", "bitcoin perspectives", "andreas antonopoulos"],
    picks: [{ youtube_id: "ESPiivspKsU", t: 4881, label: "Bitcoin leadership is treated as plural rather than centralized: Jack Dorsey, Michael Saylor, and Greg Maxwell all matter, but each speaks from a different part of the system. The point is that no single public figure can cover bitcoin's technical, monetary, corporate, and cultural dimensions." }], // 1:21:21
  },
  {
    name: "Bitcoin++",
    keywords: ["btc++", "Bitcoin++", "btc plus plus", "bitcoin plus plus", "nifty nay", "lightning conference", "berlin bitcoin"],
    picks: [{ youtube_id: "BmfqFfY_ZnQ", t: 338, label: "Bitcoin++ Berlin is described as a high-quality, developer-heavy Lightning event organized by Nifty Nay. The hosts treat the conference series as important bitcoin infrastructure because it creates recurring in-person space for protocol builders rather than broad conference spectacle." }], // 5:38
  },
  {
    name: "Chat control",
    keywords: ["chat control", "eu chat control", "end-to-end encryption", "client side scanning", "encrypted messaging"],
    picks: [{ youtube_id: "BmfqFfY_ZnQ", t: 4050, label: "Chat control is framed as a direct threat to encrypted messaging: client-side scanning would effectively undermine end-to-end encryption even when sold as safety tooling. The discussion connects the EU proposal to bitcoin-adjacent tools like Bitchat, where privacy depends on distribution and device control as much as cryptography." }], // 1:07:30
  },
  {
    name: "Bitcoin developer tools",
    keywords: ["bitcoin developer tools", "bitcoin app tools", "vibe coding bitcoin", "bitcoin payments sdk", "one-shot bitcoin app"],
    picks: [{ youtube_id: "n4G1syj-mxw", t: 598, label: "Bitcoin developer tools are presented as dramatically better than in prior cycles: what once required several skilled developers and a year can now become a working bitcoin app or payment integration through vibe coding. That changes the Silicon Valley question from whether bitcoin is investable to how many new builders can ship with it." }], // 9:58
  },
  {
    name: "Skibbidity Cash",
    keywords: ["skibbidity cash", "skibidi cash", "skiby app", "meme app", "bitcoin hackathon"],
    picks: [{ youtube_id: "NrywCKRjHDk", t: 2213, label: "Skibbidity Cash is treated as a deliberately weird experiment in meeting younger internet culture where it already is. The hackathon and prize pool are less about the meme itself than testing whether bitcoin builders can use playful formats to reach audiences that would ignore normal financial messaging." }], // 36:53
  },
  {
    name: "Agentic web",
    keywords: ["agentic web", "agent payments", "web micropayments", "microsoft agentic web", "ai agents payments"],
    picks: [{ youtube_id: "9Cr-5lSGUU8", t: 1320, label: "The agentic web conversation starts from a missing primitive in the original web: native payments. If agents are going to perform work, buy services, and coordinate online, the hosts see bitcoin and stablecoins competing to become the payment layer for agent-driven business models." }], // 22:00
  },
  {
    name: "Bitcoin merchant adoption",
    keywords: ["square terminal", "bitcoin conference payments", "steak and shake bitcoin", "vegas bitcoin payments", "square acceptance"],
    picks: [{ youtube_id: "4YN4cxBgA1g", t: 0, label: "The Vegas recap grounds merchant adoption in messy real-world payment attempts: Square terminal bitcoin payments worked, but venue internet, store rollout gaps, and staff awareness still mattered. The takeaway is that payment availability is only one layer of adoption; operational reliability and merchant education decide whether users experience it as real." }], // 0:00
  },
  {
    name: "Seedless custody",
    keywords: ["seedless custody", "seed phrase", "bitkey", "self custody", "hardware wallet", "private keys"],
    picks: [{ youtube_id: "4YN4cxBgA1g", t: 194, label: "Seedless custody is defended as a practical self-custody path for users who are not ready to manage raw seed phrases safely. The trade-off is not framed as seedless versus perfect security, but seedless self-custody versus users falling back to custodians because key management is too hard." }], // 3:14
  },
  {
    name: "Bitcoin data",
    keywords: ["bitcoin data debate", "op_return", "bitcoin blockchain data", "money versus data", "bitcoin drama"],
    picks: [{ youtube_id: "xYbakpGY9Ys", t: 623, label: "The bitcoin data debate is framed around the basic question of whether the chain is only for money or also for arbitrary data. The hosts use the OP_RETURN drama to separate legitimate concern over scarce block space from social-media escalation that turns policy disagreement into existential crisis." }], // 10:23
  },
  {
    name: "De minimis tax",
    keywords: ["de minimis", "bitcoin tax", "capital gains payments", "spending bitcoin tax", "micropayment tax"],
    picks: [{ youtube_id: "xYbakpGY9Ys", t: 5750, label: "A de minimis tax exemption is presented as one of the biggest unlocks for bitcoin payments in the US. Without relief, even a $5 coffee creates capital-gains accounting, but a $200 or $600 per-payment threshold could make everyday spending, micropayments, Nostr payments, and AI payments much more practical." }], // 1:35:50
  },
  {
    name: "Bitcoin performance",
    keywords: ["bitcoin performance", "bitcoin versus gold", "bitcoin price", "relative performance", "bitcoin underperformance"],
    picks: [{ youtube_id: "r91-r97-ksc", t: 4658, label: "Bitcoin performance is reframed by comparing BTC not only to dollars, but to gold over the same window. The hosts use the comparison to separate headline price excitement from the harder question of whether bitcoin is outperforming the asset it most often claims to supersede." }], // 1:17:38
  },
  {
    name: "Delete IP",
    keywords: ["delete ip", "intellectual property", "patents", "copyright", "jack dorsey", "elon"],
    picks: [{ youtube_id: "Y8U9hWLC2EU", t: 3171, label: "Delete IP is discussed as more than a slogan from Jack and Elon: patents, copyrights, and trademarks are questioned in a world where AI lowers the cost of creating variations and China ignores many Western IP norms. The hosts argue the upside of IP protection may be shrinking while the drag on innovation becomes more obvious." }], // 52:51
  },
  {
    name: "Bitchat",
    keywords: ["bitchat disaster", "mesh chat", "jamaica hurricane", "offline messaging", "white noise"],
    picks: [{ youtube_id: "aVWpAjRIIEM", t: 6324, label: "Bitchat's rise during the Jamaica hurricane is treated as a real-world stress test for offline, mesh-like communication. The hosts connect it to SimpleX, White Noise, and Nostr-adjacent protocols as evidence that resilient messaging matters most when normal infrastructure breaks." }], // 1:45:24
  },
  {
    name: "Network evolution",
    keywords: ["network evolution", "social network evolution", "nostr", "ai generated content", "public private key identity"],
    picks: [{ youtube_id: "j7ICtL37dZs", t: 1369, label: "Network evolution is framed as a reason dominant platforms are less permanent than they look. Twitter, Facebook, Instagram, TikTok, and whatever comes next all shift with content formats and identity models, leaving room for Nostr-style public-key networks as AI-generated media changes social behavior." }], // 22:49
  },
]);

addTopicDefs([
  {
    name: "Stacker News",
    keywords: ["stacker news", "bitcoin dev mailing list", "nostr territory", "sats upvotes", "bitcoin forum", "kian"],
    picks: [{ youtube_id: "G7lrDU5xpo8", t: 2612, label: "After Google bans the bitcoin dev mailing list, the hosts propose a Stacker News territory as a direct replacement. Builder Kian is positioned to ship it with Nostr and email integration, sats-weighted upvotes, and a mission-aligned audience already on the platform." }], // 43:32
  },
  {
    name: "Strategic Bitcoin Reserve",
    keywords: ["strategic bitcoin reserve", "bitcoin reserve", "digital asset reserve", "executive order", "peter schiff", "brian armstrong"],
    picks: [{ youtube_id: "XlPhtCfOzt0", t: 1980, label: "The executive order draws a hard line between a bitcoin-specific reserve with a hold-forever mandate and a broader digital asset reserve that allows selling altcoins. Peter Schiff and Brian Armstrong both publicly endorsed the bitcoin-only carveout, signaling unusual cross-aisle agreement on the distinction." }], // 33:00
  },
  {
    name: "Bitcoin market structure",
    keywords: ["bitcoin institutionalization", "bitcoin capture", "treasury companies", "bitcoin etf", "freedom money", "everyday money", "number go up"],
    picks: [{ youtube_id: "nEJ-cEzcDdk", t: 3840, label: "The hosts surface a capture risk: if bitcoin's dominant narrative shifts to number-go-up and actual usage consolidates into treasury companies and ETFs, it may crowd out the freedom-money and everyday-money use cases. Ben Arc's dialectics frame — thesis, antithesis, synthesis — is applied to the three competing bitcoin visions." }], // 1:04:00
  },
  {
    name: "Replit",
    keywords: ["replit open protocols", "nostr identity", "bitcoin lightning dev", "vibe coding secrets", "karpathy", "open source ide"],
    picks: [{ youtube_id: "S-ap38cImgU", t: 1800, label: "The hosts sketch a Replit-on-open-protocols vision: Nostr for identity, Bitcoin Lightning for payments, and native secret management built into the dev environment. Karpathy's public frustration with vibe-coding credential sprawl is the prompt, and the pitch is that open infrastructure solves what closed platforms cannot." }], // 30:00
  },
  {
    name: "Bitcoin vs. gold",
    keywords: ["central bank custody", "gold bitcoin custody", "sovereign bitcoin", "gold mooning", "bitcoin gold cycle"],
    picks: [{ youtube_id: "ESPiivspKsU", t: 3617, label: "Central banks have institutional custody processes for gold but not bitcoin, which the hosts argue explains why gold is outperforming during the current macro crisis. They call this probably the last cycle where that dynamic holds, as sovereign bitcoin custody infrastructure slowly catches up." }], // 1:00:17
  },
]);

addTopicDefs([
  {
    name: "Lightspark",
    keywords: ["lightspark", "light spark", "david marcus", "grid", "spark", "machine payments protocol", "mpp"],
    picks: [
      { youtube_id: "Gwf9-SxYvo4", t: 4382, label: "Lightspark is separated from Spark as the company building a broader real-time payments stack: bank integrations, Grid developer APIs, and Spark as a more bottom-up open-network surface. The hosts frame David Marcus and the team as betting that open payment networks win after corporate chains fail to interoperate." }, // 1:13:02
      { youtube_id: "KZsEVToqXYk", t: 4144, label: "Lightspark's work on Tempo's Machine Payments Protocol matters because it adds a Lightning template instead of leaving MPP as a stablecoin-only standard. The segment treats Lightspark as a bridge between crypto/payment-company ecosystems and bitcoin-native agent payments." }, // 1:09:04
    ],
  },
  {
    name: "Spiral",
    keywords: ["bitcoin army", "spiral adoption tools", "merchant adoption tools", "bitcoin volunteer army"],
    picks: [{ youtube_id: "_FwG1hkNVUE", t: 3301, label: "Spiral's merchant-adoption work is framed as activating bitcoin's volunteer army, something stablecoin companies and corporate chains cannot easily copy. The team shipped practical tools so local advocates can convince merchants, populate Bitcoin Map, and turn Square's rollout into visible payment behavior." }], // 55:01
  },
  {
    name: "Bitcoin usefulness",
    keywords: ["stripe does not work", "bitcoin data in ai models", "mdk replit", "bitcoin default data"],
    picks: [{ youtube_id: "SqExLGqYIhc", t: 5345, label: "Bitcoin usefulness is tied to situations where Stripe or ordinary payment rails do not work. The hosts argue those use cases will keep producing data, examples, and integrations for AI models, especially as MDK and Replit make bitcoin payments easier to build with." }], // 1:29:05
  },
  {
    name: "Bitcoin vs. gold",
    keywords: ["digital gold narrative", "gold outperformance", "gold education", "tech people gold"],
    picks: [{ youtube_id: "hjIJ9PHYa-w", t: 3919, label: "Gold's renewed strength becomes a way to revisit bitcoin's digital-gold narrative. The hosts argue that tech people often need to understand why gold matters before bitcoin's monetary upgrade story makes sense." }], // 1:05:19
  },
  {
    name: "No-KYC payments",
    keywords: ["no kyc payments", "no-kyc payments", "receive bitcoin", "stacker news", "fountain", "first touchpoint"],
    picks: [{ youtube_id: "Gwf9-SxYvo4", t: 4948, label: "No-KYC payments are presented as a key onboarding path for bitcoin apps: users may first receive tiny amounts through Stacker News, Nostr, or Fountain rather than buying BTC on an exchange. That makes KYC friction feel wildly disproportionate and pushes wallets toward app-native earning flows." }], // 1:22:28
  },
  {
    name: "Prediction markets",
    keywords: ["predyx", "polymarket bitcoin", "lnurl auth", "bitcoin prediction market"],
    picks: [{ youtube_id: "aVWpAjRIIEM", t: 5374, label: "Prediction markets are revisited through Polymarket accepting bitcoin and Predyx offering a bitcoin-native experience. Predyx's LNURL login, no-email onboarding, and instant Lightning deposits show how bitcoin identity and payments can make market UX feel unusually lightweight." }], // 1:29:34
  },
  {
    name: "Bitcoin treasury companies",
    keywords: ["microstrategy bubble", "treasury company risk", "block treasury", "single digit treasury"],
    picks: [{ youtube_id: "ogQ2z9lBHC8", t: 4674, label: "Bitcoin treasury companies are debated as the category spreads beyond Strategy and XXI. The hosts contrast aggressive levered bitcoin plays with the more conservative Block-style approach of holding a single-digit percentage of corporate treasury in BTC." }], // 1:17:54
  },
  {
    name: "Tokens on Bitcoin",
    keywords: ["tokens on bitcoin", "nfts on bitcoin", "stablecoins on bitcoin", "tokenized assets", "bitcoin platform"],
    picks: [{ youtube_id: "NYKHpoKwCIw", t: 4620, label: "Tokens on bitcoin are discussed through stablecoins, NFTs, tokenized stocks, gold, and real estate. The strategic question is whether these assets should live on bitcoin for survivability or on separate chains whose native tokens may compete with bitcoin and eventually fail." }], // 1:17:00
  },
  {
    name: "El Salvador",
    keywords: ["el salvador", "imf loan", "bitcoin legal tender", "volcano mining", "bitcoin policy"],
    picks: [{ youtube_id: "XlPhtCfOzt0", t: 3254, label: "El Salvador's IMF loan is used to examine the limits of state-led bitcoin adoption. Legal-tender mandates, volcanic mining, citizen data, and loan conditions all show how sovereign bitcoin policy can be shaped by external financial pressure." }], // 54:14
  },
  {
    name: "Nostr developer tools",
    keywords: ["nostr developer tools", "awesome nostr", "nostr devs", "primal iris", "nostr github"],
    picks: [{ youtube_id: "BmfqFfY_ZnQ", t: 3205, label: "Nostr developer tools are highlighted through Presidio Bitcoin's first Nostr event and the Awesome Nostr directory. Seeing identity work across Primal, Iris, Highlighter, and other apps makes Nostr easier to explain as shared infrastructure rather than a single social app." }], // 53:25
  },
  {
    name: "Bitcoin faucet",
    keywords: ["bitcoin faucet", "btc.day", "block faucet", "free bitcoin", "sats faucet"],
    picks: [{ youtube_id: "FC0y7J9pGCs", t: 2066, label: "Block's btc.day teaser revives the bitcoin faucet idea at consumer scale, with one billion sats framed as a marketing hook rather than a protocol change. The hosts use it to ask whether modern faucets can avoid bot farming and turn free bitcoin into a real onboarding mechanism." }], // 34:26
  },
  {
    name: "De minimis tax",
    keywords: ["de minimis tax", "bitcoin payments tax", "stablecoin de minimis", "capital gains purchases"],
    picks: [{ youtube_id: "-NIPr7zX3ss", t: 1660, label: "De minimis tax policy is treated as the legal unlock for everyday bitcoin payments: without relief, small purchases still create capital-gains accounting friction. The hosts note the risk that policymakers only fix the issue for stablecoins, even though bitcoin is where appreciation makes the exemption matter most." }], // 27:40
  },
  {
    name: "Financial privacy",
    keywords: ["financial privacy", "hong kong decryption", "decryption keys", "wallet privacy", "phone search"],
    picks: [{ youtube_id: "-NIPr7zX3ss", t: 3740, label: "Hong Kong's reported power to demand device decryption keys turns financial privacy into a physical travel and custody risk. The discussion connects encrypted phones, bitcoin wallets, and protest-era cash behavior to the broader question of whether privacy survives when states can compel access at borders." }], // 1:02:20
  },
  {
    name: "Spiral",
    keywords: ["spiral ai criteria", "spiral ai initiative", "low-level tools", "protocol work", "ai public goods"],
    picks: [{ youtube_id: "-NIPr7zX3ss", t: 4373, label: "Spiral's AI criteria focus on work that a small nonprofit team can defend: low-level tools, protocol work, SDKs, and public goods far enough from the customer that big labs are unlikely to steamroll them. The filter is impact without revenue dependence, borrowing the bitcoin open-source playbook for AI infrastructure." }], // 1:12:53
  },
  {
    name: "Bitcoin education",
    keywords: ["bitcoin education", "university students", "digital assets program", "student outreach", "academic bitcoin"],
    picks: [{ youtube_id: "KZsEVToqXYk", t: 2590, label: "University student visits expose a bitcoin education gap even inside elite digital-assets programs. The hosts are struck that compliance and crypto framing dominate student questions while monetary neutrality, financial access, geopolitics, and bitcoin's distinct thesis barely register." }], // 43:10
  },
  {
    name: "Bitcoin as everyday money",
    keywords: ["better currency", "spend bitcoin", "paying bots", "monetary transition"],
    picks: [{ youtube_id: "KZsEVToqXYk", t: 3820, label: "Bitcoin as everyday money is defended against the objection that no one wants to spend an appreciating asset. The hosts flip the framing to the seller side: if bitcoin is the better money, merchants may eventually prefer receiving it and offer incentives that pull buyers into the monetary transition." }], // 1:03:40
  },
  {
    name: "Internet of earners",
    keywords: ["internet of earners", "microtask markets", "micro bounty", "paid verification", "continuous labor markets"],
    picks: [{ youtube_id: "xID5cFaXAu0", t: 1728, label: "The internet of earners is proposed as a hackathon challenge for continuous labor markets: moderation, tutoring, labeling, sensing, curation, and verification could be instantly priced and rewarded. Bitcoin belongs because many of these contributions are too small, global, or fluid for legacy payment rails." }], // 28:48
  },
  {
    name: "L402 directories",
    keywords: ["l402 directories", "l402", "x402", "agent payable services", "machine-readable services"],
    picks: [{ youtube_id: "xID5cFaXAu0", t: 5587, label: "L402 directories are discussed as discovery infrastructure for agent-payable services: a machine-readable list that lets bots find, rank, and trust paid endpoints. The hosts compare L402 with X402 and point to Nostr or sats-weighted signals as possible reputation layers." }], // 1:33:07
  },
  {
    name: "Agentic commerce",
    keywords: ["internet gdp", "agent commerce", "bots paying", "group chat business", "agent zaps"],
    picks: [{ youtube_id: "VdJj0sjKDiY", t: 1960, label: "Agentic commerce is made concrete through Ori-style bots that browse the web, create memes, use Nostr, and send zaps on their own. The larger thesis is an explosion of internet GDP, where group chats can spin up software, marketing, and payments fast enough to test many small businesses." }], // 32:40
  },
  {
    name: "Elon Co.",
    keywords: ["elon co", "spacex xai merger", "tesla xai", "neuralink", "boring company"],
    picks: [{ youtube_id: "0iBG0F98ZN8", t: 2130, label: "Elon Co. is the thesis that Musk's companies are converging into one integrated stack: AI, energy, robots, space, social distribution, and infrastructure all reinforce the Mars and consciousness-expansion mission. The rumored SpaceX and xAI rollup is treated as one step in a broader pattern rather than an isolated corporate transaction." }], // 35:30
  },
  {
    name: "Flint",
    keywords: ["flint ideas", "idea box", "crowdfunded vibe coding", "vibe coding ideas", "bot debate"],
    picks: [{ youtube_id: "0iBG0F98ZN8", t: 3880, label: "Flint's private idea channel becomes a template for public, crowdfunded vibe coding: anyone could propose an app, have humans and bots debate the architecture, and fund the build with bitcoin. The point is turning community taste and AI implementation into a repeatable software-production loop." }], // 1:04:40
  },
  {
    name: "Labor and capital convergence",
    keywords: ["labor and capital", "bank the robots", "robots use collateral", "electricity compute labor", "capital labor convergence"],
    picks: [{ youtube_id: "gNoES_ygukM", t: 5550, label: "Labor and capital convergence is teased as the economic frame for AI: electricity, compute, capital, and labor start to look like fungible markets. The next question is how robots use collateral and who builds the banking layer for autonomous economic actors." }], // 1:32:30
  },
  {
    name: "Walmart",
    keywords: ["walmart bitcoin", "onepay", "nicehash", "walmart accepts bitcoin", "retail bitcoin"],
    picks: [{ youtube_id: "KNn06gkO_3U", t: 1278, label: "Walmart's bitcoin announcement is treated as exposure, not real bitcoin payments: users buy or sell BTC inside OnePay, but the checkout flow still settles as dollars rather than using bitcoin or Lightning. The hosts propose a simple litmus test for meaningful merchant adoption: can any normal bitcoin wallet pay?" }], // 21:18
  },
  {
    name: "AI business models",
    keywords: ["ai business models", "ai subscriptions", "ai ads", "agent commerce", "llm monetization"],
    picks: [{ youtube_id: "59D_r8qaDu4", t: 2100, label: "AI business models are compared with Google's search ads and the browser wars: subscriptions, ads, and commerce cuts may all coexist, but agentic behavior changes what can be monetized. Once an AI buys on a user's behalf, disclosure, trust, and auditability become part of the business model." }], // 35:00
  },
  {
    name: "Bitcoin Core funding",
    keywords: ["bitcoin core funding", "core developer funding", "blackrock funding", "etf issuer funding", "developer influence"],
    picks: [{ youtube_id: "7Rcn8tMzliM", t: 4205, label: "Bitcoin Core funding is examined through the hypothetical of BlackRock, ETF issuers, or other large institutions funding developers. The hosts argue vigilance is warranted, but influence is constrained because bitcoin's review culture, code transparency, and user choice make funding very different from command authority." }], // 1:10:05
  },
  {
    name: "Agent-run mints",
    keywords: ["agent-run mints", "ai mints", "ai agent mints", "cashu mints", "ecash liability"],
    picks: [{ youtube_id: "JIwKzzxCHLg", t: 4182, label: "Agent-run mints are used to stress-test responsibility in a world where AI agents can publish, copy, and operate financial software. If a self-replicating agent runs profitable e-cash mints, liability becomes hard to assign because the code author, operator, and executor may all be different parties." }], // 1:09:42
  },
  {
    name: "Mining centralization",
    keywords: ["fpps", "bitmain hash rate", "mining pool liquidity", "transaction selection", "coinbase reward custody"],
    picks: [{ youtube_id: "Uw5Vh5Tr7To", t: 4799, label: "Miner centralization is tied to FPPS pool economics: Bitmain-associated pools may control a large share of hash rate, choose transactions, and custody block rewards before paying miners. The risk is not only hardware concentration, but the liquidity and payout structures that pull miners toward centralized pools." }], // 1:19:59
  },
  {
    name: "AI governance",
    keywords: ["ai governance", "llm government", "transparent llm", "government ai", "model governance"],
    picks: [{ youtube_id: "75Q1RRl2GtQ", t: 93, label: "AI governance is introduced through the wish for a transparent LLM that could make government decisions with known training data, predictable behavior, and auditable reasoning. The point is less a concrete policy proposal than a contrast between opaque human politics and potentially inspectable decision systems." }], // 1:33
  },
  {
    name: "Mining pools",
    keywords: ["mining pools", "stratum v2", "pool economics", "bitcoin mining pools", "job negotiation"],
    picks: [{ youtube_id: "tyOeK1bfM5E", t: 3001, label: "Mining pools are explained as an economic response to payout variance: most miners cannot tolerate waiting years to find a block alone. That context sets up why Stratum V2 matters, because separating stable payouts from transaction selection could reduce the governance power pools gain from coordinating miners." }], // 50:01
  },
  {
    name: "Proof of reserves",
    keywords: ["proof of reserves", "utxo proof", "signed message", "bitcoin reserves", "mortgage reserves"],
    picks: [{ youtube_id: "9Cr-5lSGUU8", t: 4937, label: "Proof of reserves becomes a building block for bitcoin-backed mortgage qualification: signing with a UTXO can prove control of funds, but does not by itself prove identity, commitment, or that the funds will remain available. The hosts sketch a fuller protocol with loan-specific commitments, KYC attestations, and verifiable credentials." }], // 1:22:17
  },
  {
    name: "Nostr talent markets",
    keywords: ["nostr talent markets", "nostr upwork", "nostr hiring", "unstuck", "open talent marketplace"],
    picks: [{ youtube_id: "NrywCKRjHDk", t: 1054, label: "Nostr talent markets are floated as an open alternative to Upwork or Toptal, where identity, reputation, and payments could live on permissionless rails. The hosts connect this to Unstuck and the broader long tail of Nostr apps that can only exist when hiring and work coordination are open by default." }], // 17:34
  },
  {
    name: "Proof of personhood",
    keywords: ["proof of personhood", "social graph proof", "mutual favorites", "bot resistance", "bitchat"],
    picks: [{ youtube_id: "zrOwT30p5rM", t: 1685, label: "Proof of personhood is explored through Bitchat's mutual-favorite mechanic: people can verify each other locally through real social contact rather than biometrics. The idea is that an in-person trust graph could become a bot-resistant primitive for more than messaging." }], // 28:05
  },
  {
    name: "AI data centers",
    keywords: ["ai data centers", "demand response", "training workloads", "google data centers", "bitcoin mining demand response"],
    picks: [{ youtube_id: "ajsWQStK1JU", t: 3854, label: "AI data centers are compared with bitcoin miners as flexible energy loads. Inference may need to stay online, but training and video-processing workloads can potentially pause, making demand response a bridge between grid stress, AI growth, and lessons learned from mining." }], // 1:04:14
  },
  {
    name: "Mining fleet software",
    keywords: ["mining fleet software", "proto fleet", "mining management software", "ai mining management", "mining hackathon"],
    picks: [{ youtube_id: "RIg8yQZPwyw", t: 1503, label: "Mining fleet software is treated as the next obvious layer after Proto's hardware launch. The hosts connect Proto's fleet UI, AI-assisted management, and a Presidio hackathon mining project as evidence that mining needs better software surfaces, not only better ASICs." }], // 25:03
  },
  {
    name: "Geohashing",
    keywords: ["geohashing", "bitchat geohash", "local discovery", "location privacy", "local chat"],
    picks: [{ youtube_id: "ZDN4LX3doJg", t: 1785, label: "Geohashing gives Bitchat a privacy-preserving local discovery layer: users can attach a rough location bucket without doxing exact GPS coordinates. The hosts see it as a way to make local conversations and maps feel spatial while preserving the safety properties that make the product interesting." }], // 29:45
  },
  {
    name: "Stablecoin yield",
    keywords: ["stablecoin yield", "treasury yield", "genius act", "bank deposits", "fintech rewards"],
    picks: [{ youtube_id: "uaN_P80CCFI", t: 5274, label: "Stablecoin yield is the economic wedge behind tech companies threatening banks: treasury interest backing stablecoins can become a rewards pool that bank deposits cannot easily match. Even if the Genius Act blocks direct yield sharing, companies may route value through distribution deals and partner incentives." }], // 1:27:54
  },
  {
    name: "Energy abundance",
    keywords: ["energy abundance", "more energy", "type one civilization", "human progress", "energy use"],
    picks: [{ youtube_id: "hjIJ9PHYa-w", t: 370, label: "Energy abundance is framed as the core civilizational thesis behind Type One: human progress correlates with harnessing more energy, not moralizing about using less. Bitcoin and AI fit that worldview because both create demand that can justify building new energy capacity." }], // 6:10
  },
  {
    name: "Bitcoin fee market",
    keywords: ["bitcoin fee market", "fee filter", "op_return", "utxo bloat", "block size"],
    picks: [{ youtube_id: "tfBVyn-KDdc", t: 2148, label: "The fee market is treated as bitcoin's natural filter for unwanted data: if someone wants to use scarce block space, they should have to pay the market price. The hosts distinguish that economic filter from opaque policy lists, while still taking UTXO bloat and node costs seriously." }], // 35:48
  },
  {
    name: "Bitcoin privacy",
    keywords: ["bitcoin privacy", "lightning privacy", "cash privacy", "traceable payments", "merchant privacy"],
    picks: [{ youtube_id: "Zxtndnb0AHw", t: 2517, label: "Bitcoin privacy is compared with cash and traditional digital payments in the merchant context. Bitcoin is not perfectly private, but the hosts argue it is much closer to cash than Visa-style rails, especially when Lightning is involved and merchants care about traceability." }], // 41:57
  },
  {
    name: "Bitcoin Map",
    keywords: ["btc map", "bitcoin map", "openstreetmap", "merchant data", "cash app btc map", "square btc map"],
    picks: [{ youtube_id: "_FwG1hkNVUE", t: 666, label: "Bitcoin Map becomes part of the Square and Cash App rollout because merchant discovery is an adoption problem, not a side feature. Its open-source data model, OpenStreetMap foundation, and share-alike requirements make bitcoin merchant listings reusable across wallets and local campaigns." }], // 11:06
  },
  {
    name: "Spiral",
    keywords: ["spiral wave two", "spiral merchant kit", "bitcoin payments kit", "square merchant kit", "local champion"],
    picks: [{ youtube_id: "VdQp4TXf4B4", t: 192, label: "Spiral's wave two is a merchant-adoption toolkit rather than protocol work: one-pagers, plushies, and local champion boxes are meant to turn Square's bitcoin payment rollout into street-level action. The segment shows Spiral acting as a bridge between open-source infrastructure and grassroots distribution." }], // 3:12
  },
  {
    name: "AI music production",
    keywords: ["ai music", "music production", "ai beats", "creative ai", "parallel ai"],
    picks: [{ youtube_id: "SqExLGqYIhc", t: 4808, label: "AI music production is used as a concrete example of how AI could expand creative output rather than merely replace work. The desired interface is the ability to request many usable beats or variations, choose where human taste should enter, and keep lyrics or performance as the artist's own contribution." }], // 1:20:08
  },
  {
    name: "Bitcoin timelocks",
    keywords: ["bitcoin timelocks", "time locks", "inheritance", "hsa", "bitcoin estate planning"],
    picks: [{ youtube_id: "_5WG0yIa8Pc", t: 247, label: "Bitcoin timelocks are treated as an underused primitive for real products such as inheritance, savings, and HSA-style financial planning. The hosts note that Lightning, Ark, Spark, and other systems already depend on timelocks, but consumer-facing applications are still mostly unexplored." }], // 4:07
  },
  {
    name: "Bitcoin as everyday money",
    keywords: ["spend and replace", "bitcoin payments", "spending bitcoin", "dollars over lightning", "bitcoin network asset"],
    picks: [{ youtube_id: "n4G1syj-mxw", t: 2221, label: "Bitcoin as everyday money is discussed through the practical objection that people do not want to spend an appreciating asset. The hosts answer with spend-and-replace, tax friction, and interoperable dollars over bitcoin or Lightning, separating bitcoin the asset from bitcoin the payment network." }], // 37:01
  },
  {
    name: "Bitcoin spaces and culture",
    keywords: ["bitcoin spaces", "bitcoin coworking", "pubkey", "the commons", "bitcoin entrepreneurial culture"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 135, label: "Nik describes Presidio Bitcoin, The Commons, and PubKey as part of a bitcoin-specific culture of physical spaces. His point is that bitcoin uniquely creates rooms where entrepreneurs can gather around shared monetary, technical, and civic interests without needing a single company or project to organize them." }], // 2:15
  },
  {
    name: "The Bitcoin Age",
    keywords: ["the bitcoin age", "nik bhatia", "layered money", "book tour", "bitcoin age book"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 230, label: "Nik frames The Bitcoin Age as the follow-up to Layered Money and explains why this appearance is part of his first real book tour. The discussion sets up the Q&A around markets, money, the dollar system, and bitcoin's long arc." }], // 3:50
  },
  {
    name: "Layered Money",
    keywords: ["layered money", "nik bhatia layered money", "money layers", "bitcoin base layer", "monetary hierarchy"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 3500, label: "Nik returns to the Layered Money frame at the end: money is what settles debt, and the long-run question is whether large debts increasingly settle in bitcoin terms. The Fed can remain a fixture while bitcoin becomes the neutral base layer chosen by the market." }], // 58:20
  },
  {
    name: "Fed watching",
    keywords: ["fed watching", "federal reserve", "fed irrelevant", "policy rate", "fed commentary"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 312, label: "Nik says the Fed is mostly irrelevant to his day-to-day market practice because markets price the curve continuously. He still recognizes the Fed as important institutionally, but for signal he watches prices, rates, volatility, and liquidity rather than Fed commentary." }], // 5:12
  },
  {
    name: "Time value of money",
    keywords: ["time value of money", "yield curve", "interest rate curve", "overnight rate", "forward indicator"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 312, label: "Nik explains the interest-rate market as a live pricing system for the time value of money from one week out to thirty years. The 2-year yield matters because it prices where overnight money is likely headed over the next one to two years." }], // 5:12
  },
  {
    name: "Interest-rate market",
    keywords: ["interest-rate market", "rates market", "yield curve", "policy rate", "two-year yield"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 312, label: "The interest-rate market is treated as the primary source of forward guidance. Instead of waiting for a central-bank announcement, Nik looks at the shape and movement of the curve to understand how markets are repricing money." }], // 5:12
  },
  {
    name: "2-year yield",
    keywords: ["2-year yield", "two-year yield", "twos", "fed funds", "rate cuts"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 2483, label: "Nik Bhatia argues the 2-year yield is more useful than watching the Fed directly: when twos trade below the policy rate, cuts are being priced in, and when they trade above, hikes are being priced in. The spread and its rate of change become the forward signal." }], // 41:23
  },
  {
    name: "TBL liquidity index",
    keywords: ["tbl liquidity", "liquidity index", "bank balance sheets", "move index", "cross border capital"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 441, label: "Nik explains The Bitcoin Layer's liquidity index as a market-driven alternative to Fed watching: bank balance-sheet assets, rates, Treasury volatility, and the dollar combine into a live read on whether liquidity is supportive." }], // 7:21
  },
  {
    name: "Bank balance sheet liquidity",
    keywords: ["balance sheet liquidity", "sheet", "bank assets", "liquidity equals sheet", "asset side banking system"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 755, label: "Nik uses the old bond-desk idea that liquidity equals 'sheet': the size and strength of bank assets create market liquidity. Lower rates and lower volatility make those assets more stable and easier to lever." }], // 12:35
  },
  {
    name: "Treasury volatility",
    keywords: ["treasury volatility", "move index", "bond volatility", "volatility collapse", "market certainty"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 755, label: "Nik uses the MOVE index as a liquidity input because Treasury volatility changes how stable and leverable balance-sheet assets feel. After the April volatility spike, falling MOVE signaled a return of certainty that coincided with stocks and bitcoin moving higher." }], // 12:35
  },
  {
    name: "Dollar liquidity",
    keywords: ["dollar liquidity", "weaker dollar", "liquidity index dollar", "dxy", "global dollar"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 755, label: "Nik says adding the dollar improved The Bitcoin Layer's liquidity model because a weaker dollar tends to mean stronger liquidity. The dollar becomes another market price that helps explain whether risk assets have a supportive backdrop." }], // 12:35
  },
  {
    name: "Price analysis",
    keywords: ["price analysis", "price action", "market behavior", "prices first", "market signals"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 1009, label: "Nik describes himself as a price analyst: he starts with whether prices are up or down, then works backward to understand why. That habit is why he prefers market behavior over trying to underwrite every balance sheet or policy statement from scratch." }], // 16:49
  },
  {
    name: "Cross-asset correlations",
    keywords: ["cross-asset correlations", "cross asset", "stocks and bitcoin", "macro correlations", "market drivers"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 1009, label: "Nik's morning process centers on price action and cross-asset correlations. He uses the relationships between rates, volatility, the dollar, stocks, and bitcoin to infer the driver before reading the day's narrative." }], // 16:49
  },
  {
    name: "Bitcoin treasury companies",
    keywords: ["bitcoin treasury companies", "strategy", "microstrategy", "mstr", "corporate bitcoin adoption"],
    picks: [
      { youtube_id: "nUY39E7-XYI", t: 900, label: "Nik reads bitcoin treasury companies through network growth: as bitcoin matures, corporate adoption is a natural stage. He expects Strategy to keep issuing capital and acquiring bitcoin, while avoiding security-level calls on MSTR's capital structure." }, // 15:00
      { youtube_id: "nUY39E7-XYI", t: 1009, label: "Nik warns that some treasury companies may botch the financial engineering, creating volatility, forced sellers, or liquidation cascades. His answer is to watch market behavior and price action rather than underwrite every balance sheet." }, // 16:49
    ],
  },
  {
    name: "STRC yield",
    keywords: ["strc", "stretch", "strategy yield", "risk-free rate", "over collateralized"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 1200, label: "Nik treats STRC and Stretch as capital-market signals rather than his main research lane. If high yields persist, he says the market is not yet arbitraging them away; if capital floods in, the yield should compress." }], // 20:00
  },
  {
    name: "Strategy capital structure",
    keywords: ["strategy capital structure", "mstr tranches", "strc", "stretch", "corporate leverage"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 1200, label: "The Strategy discussion separates bitcoin accumulation from security-level analysis. Nik is interested in Strategy's ability to issue capital and buy more bitcoin, but he treats tranche math, first-loss risk, and instrument-specific valuation as a different specialist toolkit." }], // 20:00
  },
  {
    name: "Eurodollar system",
    keywords: ["eurodollar", "offshore dollars", "non-us banks", "dollar creation", "global banking system"],
    picks: [
      { youtube_id: "nUY39E7-XYI", t: 1556, label: "Nik explains Eurodollars as offshore dollar creation by non-US banks and argues the United States is trying to tame that system so the dollar's network effects accrue back home instead of to offshore banks." }, // 25:56
      { youtube_id: "nUY39E7-XYI", t: 1880, label: "He illustrates Eurodollar creation through FX market-making: offshore banks create dollar balances to settle trades, making the Eurodollar system a settlement layer for global commerce outside direct US control." }, // 31:20
    ],
  },
  {
    name: "Stablecoins as Eurodollar 2.0",
    keywords: ["stablecoins eurodollar", "eurodollar 2.0", "tether treasuries", "digital dollars", "treasury-backed stablecoins"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 1778, label: "Nik frames stablecoins as a new Eurodollar-like system: even when usage is offshore, issuers buying US Treasuries can pull dollar power back toward the United States and support deficit financing." }], // 29:38
  },
  {
    name: "Stablecoin issuers buying Treasuries",
    keywords: ["stablecoin issuers", "stablecoins buying treasuries", "t-bills", "tether treasuries", "treasury demand"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 1778, label: "Nik highlights the treasury-bill demand created when stablecoin issuers back digital dollars with US government debt. The geopolitical shift is that offshore dollar usage can still support US financing if the backing assets are Treasuries." }], // 29:38
  },
  {
    name: "Eurodollar trade settlement",
    keywords: ["eurodollar settlement", "fx settlement", "offshore trade settlement", "bnp paribas barclays", "dollar settlement"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 1880, label: "Nik's Eurodollar example is a foreign-exchange market-making chain where offshore banks create dollar balances to settle trades. This makes Eurodollars less an abstract macro term and more the working settlement fabric of global commerce." }], // 31:20
  },
  {
    name: "Dollar reserve currency",
    keywords: ["dollar reserve currency", "world reserve currency", "dual public good", "us defense", "dollar network effect"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 1880, label: "Nik connects Eurodollars to the dollar's reserve-currency role: global actors have been using US defense and dollar settlement as public goods. His read is that US policy is trying to make that offshore dollar network accrue more directly back to the United States." }], // 31:20
  },
  {
    name: "Bitcoin as pristine collateral",
    keywords: ["bitcoin pristine collateral", "neutral reserve asset", "bitcoin collateral", "gold momentum", "non-us treasury reserve"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 2168, label: "Nik says bitcoin is already rallying the world around the need for a better neutral reserve asset. Gold is larger, but bitcoin has the momentum and does not need a dramatic dollar collapse to keep gaining relevance." }], // 36:08
  },
  {
    name: "Neutral reserve asset",
    keywords: ["neutral reserve asset", "non-us treasury reserve", "better neutral asset", "reserve collateral", "pristine collateral"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 2168, label: "Nik frames bitcoin as the asset already gathering global attention around the need for a neutral reserve asset outside the US Treasury complex. The milestone is not sudden replacement of the dollar, but steady recognition of a better collateral and settlement base." }], // 36:08
  },
  {
    name: "Bitcoin vs. gold",
    keywords: ["bitcoin gold", "gold market cap", "bitcoin momentum", "neutral reserve asset", "digital gold"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 2168, label: "Nik contrasts gold's larger market cap with bitcoin's stronger momentum. Gold remains the older reserve asset, but bitcoin is the one rallying people around a new neutral collateral and settlement thesis." }], // 36:08
  },
  {
    name: "Debt roll",
    keywords: ["debt roll", "75 trillion", "global debt rollover", "300 trillion debt", "rollover debt"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 2322, label: "Nik estimates that roughly $75 trillion of global debt has to roll every year and argues the process can persist for a long time. Bitcoin can rise alongside that system rather than only after a once-in-a-century default cycle." }], // 38:42
  },
  {
    name: "Bitcoin power law",
    keywords: ["bitcoin power law", "power law", "address growth", "price growth", "giovanni"],
    picks: [
      { youtube_id: "nUY39E7-XYI", t: 2727, label: "Nik explains bitcoin's power law as a nonlinear relationship between price and time, with an exponent around six. The framework turns bitcoin's growth from a chart pattern into a network-scaling thesis." }, // 45:27
      { youtube_id: "nUY39E7-XYI", t: 2863, label: "The insight that changed Nik's thinking is that the exponent may decompose into two relationships: address growth roughly as time squared, and price appreciation roughly as the cube of address growth." }, // 47:43
    ],
  },
  {
    name: "Power-law exponent",
    keywords: ["power law exponent", "exponent six", "bitcoin power law", "nonlinear relationship", "scale"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 2727, label: "Nik explains the power-law exponent as the mathematical object that makes bitcoin's price-time relationship nonlinear. The important claim is not just that a curve fits, but that bitcoin's network growth may have a natural scaling law." }], // 45:27
  },
  {
    name: "Bitcoin address growth",
    keywords: ["bitcoin address growth", "address squared", "price cubed", "network growth", "bitcoin network scaling"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 2863, label: "Nik's key power-law insight is that bitcoin address growth and price appreciation may be two linked scaling laws: address growth roughly follows time squared, and price roughly follows the cube of address growth." }], // 47:43
  },
  {
    name: "Bitcoin education",
    keywords: ["bitcoin education", "money education", "layered money", "finance students", "what is money"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 3053, label: "Nik's advice to students is to start with first principles about money: what deposits are, where dollars come from, and how currency, credit, cash, and money differ. Bitcoin education begins by noticing that traditional finance education often skips those questions." }], // 50:53
  },
  {
    name: "Money education",
    keywords: ["money education", "layered money", "currency credit cash", "finance education", "what is money"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 3053, label: "Nik says students need to ask what money, deposits, dollars, currency, credit, and cash actually are. His Layered Money lecture lands because many finance students were never taught to examine where money comes from." }], // 50:53
  },
  {
    name: "Fiat Bitcoin",
    keywords: ["fiat bitcoin", "6102", "bitcoin seizure", "etfs", "treasury companies"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 3190, label: "Asked about fiat bitcoin, ETFs, treasury companies, 401(k)s, and 6102 risk, Nik says seizure cannot be ruled out, but the First, Fourth, and Fifth Amendments matter deeply for bitcoin's legal defense." }], // 53:10
  },
  {
    name: "Bitcoin privacy rights",
    keywords: ["bitcoin privacy rights", "privacy technology", "fourth amendment", "self incrimination", "legal privacy"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 3348, label: "Nik supports private ways to transact with bitcoin but is not convinced the government will simply allow them. He frames privacy as a legal fight around speech, search, self-incrimination, and the realities of transacting on a public ledger." }], // 55:48
  },
  {
    name: "Bitcoin civil liberties",
    keywords: ["bitcoin civil liberties", "first amendment", "fourth amendment", "fifth amendment", "bill of rights"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 3190, label: "Nik ties bitcoin's legal defense to civil liberties: speech, privacy, and the right not to self-incriminate all matter when thinking about seizure risk, privacy tools, and whether people can hold and transact bitcoin under constitutional constraints." }], // 53:10
  },
  {
    name: "Bitcoin privacy",
    keywords: ["bitcoin privacy", "privacy technology", "public ledger", "transaction privacy", "legal privacy"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 3348, label: "Nik's privacy answer is cautious: bitcoin transactions expose users to analysis, so private transaction methods matter, but he expects the right to use them to remain a legal and political fight rather than an uncontested norm." }], // 55:48
  },
  {
    name: "Legal tender laws",
    keywords: ["legal tender laws", "settle debts", "king of england", "civil war", "market chosen tender"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 3500, label: "Nik uses legal tender history to explain why money is what settles debt. The contrast is that bitcoin does not need a king or state to force settlement; it can become de facto tender if markets choose it for global debt settlement." }], // 58:20
  },
  {
    name: "Market-chosen money",
    keywords: ["market chosen money", "market chosen tender", "de facto tender", "neutral settlement layer", "verify with a node"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 3617, label: "Nik's endgame is market-chosen money: bitcoin becomes de facto tender for global settlement because counterparties can verify it with a node, not because legal tender laws force acceptance." }], // 1:00:17
  },
  {
    name: "Bitcoin settlement layer",
    keywords: ["bitcoin settlement layer", "global debt settlement", "layered money bitcoin base", "market chosen tender", "settle debt"],
    picks: [{ youtube_id: "nUY39E7-XYI", t: 3500, label: "Nik's layered-money endgame is large debts settling in bitcoin terms because money is what settles debt. He imagines bitcoin becoming market-chosen tender for global settlement without requiring legal tender laws." }], // 58:20
  },
]);

addTopicDefs([
  {
    name: "Babel Agent",
    keywords: ["babel agent", "babelagent", "live translation", "bitcoin translation", "lightning translation"],
    picks: [{ youtube_id: "lGR7oDDdGJ4", t: 60, label: "Babel Agent is presented as a live translation app for streams and podcasts: listeners choose a language, fund usage with bitcoin over Lightning, and consume the show in another language while it is happening. The hosts treat it as a useful app where bitcoin payments fade into the background." }], // 1:00
  },
  {
    name: "Vibe coding",
    keywords: ["vibe coding", "people between jobs", "build normal app", "bitcoin hackathon", "at bats"],
    picks: [{ youtube_id: "lGR7oDDdGJ4", t: 609, label: "The hosts update the old advice for people between jobs from 'study bitcoin' to 'vibe code.' The segment argues that bitcoin tools and AI coding tools are mature enough that more people should take shots on useful apps, especially ordinary apps that happen to accept bitcoin." }], // 10:09
  },
  {
    name: "Bitcoin Core v31",
    keywords: ["bitcoin core v31", "core v31", "v31 release", "bitcoin core release"],
    picks: [{ youtube_id: "lGR7oDDdGJ4", t: 1044, label: "Bitcoin Core v31 is unpacked as a release whose importance is not only individual features, but the continued health of Core development. Steve frames the release around embedded ASMAP, private transaction improvements, and cluster mempool." }], // 17:24
  },
  {
    name: "Embedded ASMAP",
    keywords: ["embedded asmap", "asmap", "autonomous system map", "node eclipse attack", "node network diversity"],
    picks: [{ youtube_id: "lGR7oDDdGJ4", t: 1272, label: "Embedded ASMAP is highlighted as a Bitcoin Core v31 feature that improves peer selection by accounting for internet routing concentration. The point is to reduce eclipse-style risk by making nodes less likely to connect through the same network-level choke points." }], // 21:12
  },
  {
    name: "Node security",
    keywords: ["node security", "bitcoin node security", "eclipse attack", "asmap", "network-level attack"],
    picks: [{ youtube_id: "lGR7oDDdGJ4", t: 1876, label: "The Core v31 discussion broadens into node security: attackers do not need to break consensus if they can isolate or manipulate what a node sees. ASMAP and related peer-diversity work are framed as practical hardening against network-level attacks." }], // 31:16
  },
  {
    name: "Private transactions",
    keywords: ["private transactions", "bitcoin private transactions", "transaction privacy", "core v31 privacy"],
    picks: [{ youtube_id: "lGR7oDDdGJ4", t: 2387, label: "Private transactions are presented as the second major Bitcoin Core v31 theme. The hosts connect transaction privacy to relay behavior and wallet/node defaults, treating privacy as a continuing engineering concern rather than a solved property." }], // 39:47
  },
  {
    name: "Cluster mempool",
    keywords: ["cluster mempool", "cluster mempool bitcoin", "mempool package", "fee management", "transaction clusters"],
    picks: [{ youtube_id: "lGR7oDDdGJ4", t: 2867, label: "Cluster mempool is explained as a long-running Bitcoin Core project that changes how related transactions are organized and reasoned about in the mempool. The hosts frame it as important plumbing for fee behavior, package relay, and future policy work." }], // 47:47
  },
  {
    name: "Bitcoin fee market",
    keywords: ["cluster mempool", "fee market", "block rewards versus fees", "mempool policy", "package relay"],
    picks: [{ youtube_id: "lGR7oDDdGJ4", t: 2867, label: "The Core v31 segment ties cluster mempool to the long-run fee market: as block rewards decline, mempool policy and fee estimation become more important to how scarce block space is priced and used." }], // 47:47
  },
  {
    name: "Project Loupe",
    keywords: ["project loupe", "loupe", "ai security scanning", "vulnerability discovery", "ai code audit"],
    picks: [{ youtube_id: "lGR7oDDdGJ4", t: 3802, label: "Project Loupe is introduced as an AI security-scanning effort to find vulnerabilities in important open-source projects. The hosts see it as a natural response to a world where AI can both write more code and search for bugs at scale." }], // 1:03:22
  },
  {
    name: "AI security scanning",
    keywords: ["ai security scanning", "ai vulnerability discovery", "ai code audit", "project loupe", "security scanner"],
    picks: [{ youtube_id: "lGR7oDDdGJ4", t: 3802, label: "The Project Loupe discussion treats AI security scanning as a new defensive layer: use models to continuously inspect codebases for vulnerabilities before attackers do, especially in bitcoin and open-source infrastructure." }], // 1:03:22
  },
  {
    name: "Bitcoin as AI honeypot",
    keywords: ["bitcoin honeypot", "ai hack bitcoin", "ai attackers", "largest honeypot", "bitcoin security ai"],
    picks: [{ youtube_id: "lGR7oDDdGJ4", t: 4406, label: "Bitcoin is described as the biggest honeypot for AI-assisted attackers because a successful exploit can directly unlock money. That makes bitcoin an especially urgent test case for AI security scanning and defensive tooling." }], // 1:13:26
  },
  {
    name: "LDK Server",
    keywords: ["ldk server", "ldk server release", "lightning lsp", "run an lsp", "ldk node"],
    picks: [{ youtube_id: "lGR7oDDdGJ4", t: 4832, label: "LDK Server is introduced as a higher-level way to build and operate a Lightning Service Provider. The long-term goal is to make running an LSP closer to a one-line deployment with funded liquidity, instead of a bespoke engineering project." }], // 1:20:32
  },
  {
    name: "LSP infrastructure",
    keywords: ["lsp infrastructure", "lightning service provider", "run an lsp", "ldk server", "wallet liquidity"],
    picks: [{ youtube_id: "lGR7oDDdGJ4", t: 4981, label: "The LDK Server segment explains the wallet-builder bottleneck: building a Lightning wallet is much easier than deciding who runs the LSP and how liquidity is managed. LDK Server is meant to expand the number of teams that can operate that infrastructure." }], // 1:23:01
  },
  {
    name: "Lightning Network",
    keywords: ["lightning network", "ldk", "lnd", "lightspark", "splicing", "bolt 12", "async payments"],
    picks: [{ youtube_id: "lGR7oDDdGJ4", t: 5098, label: "Steve contrasts LDK Server with other Lightning stacks by pointing to LDK's feature lead: splicing, BOLT 12, async payments, and lower-level customizability. The argument is that Lightning infrastructure should be easier to run without giving up protocol-level power." }], // 1:24:58
  },
  {
    name: "Lightning as public good",
    keywords: ["lightning public good", "ldk public good", "decentralized protocol", "open-source public good", "lightning implementation"],
    picks: [{ youtube_id: "lGR7oDDdGJ4", t: 5410, label: "Lightning is framed as a public-good protocol for payments, not a product owned by one company. Steve argues that LDK's value is not just being open source, but welcoming outside maintainers, public communication, and broad adoption so the project can outlast any one funder." }], // 1:30:10
  },
  {
    name: "Cash App",
    keywords: ["cash app 5%", "cash app bitcoin rewards", "5% back in bitcoin", "cash app square terminal", "cash app lightning"],
    picks: [{ youtube_id: "9JL95zG0rQ0", t: 484, label: "Cash App's 5% back in bitcoin at Square terminals is treated as a powerful adoption wedge: a user can pay dollars over Lightning, receive bitcoin rewards, and suddenly have a reason to prefer Cash App over credit cards." }], // 8:04
  },
  {
    name: "Square Bitcoin payments",
    keywords: ["square terminal", "cash app square terminal", "pay dollars over lightning", "5% back bitcoin", "merchant square"],
    picks: [{ youtube_id: "9JL95zG0rQ0", t: 435, label: "A real lunch payment becomes the Square Bitcoin payments case study: the merchant is now excited to accept it, the customer can pay dollars over Lightning, fees are effectively zero, and the 5% bitcoin reward changes the credit-card comparison." }], // 7:15
  },
  {
    name: "Bitcoin merchant adoption",
    keywords: ["merchant adoption", "cash app merchant", "table tents", "pay in bitcoin", "merchant excitement"],
    picks: [{ youtube_id: "9JL95zG0rQ0", t: 319, label: "Cafe RX shows merchant adoption moving from friction to excitement once bitcoin payments are a default option and regular customers use them. The hosts emphasize that usage, tips, and visible customer enthusiasm can turn a skeptical merchant into a promoter." }], // 5:19
  },
  {
    name: "Bitcoin rewards",
    keywords: ["bitcoin rewards", "5% back in bitcoin", "cash back bitcoin", "credit card rewards", "stacking rewards"],
    picks: [{ youtube_id: "9JL95zG0rQ0", t: 543, label: "Bitcoin rewards are framed as psychologically stronger than ordinary credit-card points: if a user wants bitcoin most, 5% back in BTC can make Cash App feel like the best payment option wherever Square accepts it." }], // 9:03
  },
  {
    name: "Bitcoin tipping",
    keywords: ["bitcoin tipping", "tip merchant", "split rewards", "cash app tip", "merchant incentive"],
    picks: [{ youtube_id: "9JL95zG0rQ0", t: 720, label: "The hosts propose routing or splitting the 5% bitcoin reward into tips as a merchant-growth mechanic. If customers can easily share bitcoin rewards with staff, merchant adoption becomes social and incentive-aligned instead of only a checkout feature." }], // 12:00
  },
  {
    name: "Strategy selling bitcoin",
    keywords: ["strategy sell bitcoin", "saylor sell bitcoin", "never sell bitcoin", "selling bitcoin", "mstr sell bitcoin"],
    picks: [{ youtube_id: "9JL95zG0rQ0", t: 3021, label: "The Strategy discussion revisits Saylor's 'never sell your bitcoin' mantra after comments that Strategy could sell bitcoin if needed. The hosts separate the meme from the corporate-finance reality that collateral, securities issuance, and treasury management create multiple levers." }], // 50:21
  },
  {
    name: "Strategy capital structure",
    keywords: ["strategy capital structure", "stretch", "strc", "mstr", "preferred shares", "sell bitcoin"],
    picks: [{ youtube_id: "9JL95zG0rQ0", t: 2522, label: "Strategy's capital structure is analyzed through Stretch/STRC, equity issuance, and the possibility of selling bitcoin. The key point is that Strategy is becoming a complex capital-markets machine, not just a company holding spot BTC." }], // 42:02
  },
  {
    name: "Bitcoin treasury companies",
    keywords: ["bitcoin treasury companies", "strategy", "mstr", "block bitcoin treasury", "coinbase bitcoin"],
    picks: [{ youtube_id: "9JL95zG0rQ0", t: 5834, label: "Block's bitcoin treasury policy is compared with Strategy and Coinbase: Block buys bitcoin through a recurring percentage of bitcoin-related gross profit, which is less dramatic than MSTR-style issuance but still makes BTC a standing treasury practice." }], // 1:37:14
  },
  {
    name: "Block earnings",
    keywords: ["block earnings", "cash app gross profit", "block bitcoin revenue", "block financial results", "jack dorsey block"],
    picks: [{ youtube_id: "9JL95zG0rQ0", t: 5487, label: "Block's earnings are discussed as quietly strong, with Cash App gross profit and bitcoin-related business lines giving the hosts a reason to revisit Block's bitcoin strategy and treasury purchases." }], // 1:31:27
  },
  {
    name: "Block bitcoin treasury",
    keywords: ["block bitcoin treasury", "block buys bitcoin", "cash app gross profit bitcoin", "block bitcoin purchases"],
    picks: [{ youtube_id: "9JL95zG0rQ0", t: 5856, label: "Block's bitcoin treasury policy is described as a recurring commitment to buy BTC with a percentage of bitcoin-related gross profit. The hosts contrast that steady accumulation with the larger and flashier treasury-company playbook." }], // 1:37:36
  },
  {
    name: "Anthropic",
    keywords: ["anthropic xai", "anthropic google", "anthropic amazon", "dario", "enterprise ai", "claude throttling"],
    picks: [{ youtube_id: "9JL95zG0rQ0", t: 5996, label: "Anthropic is framed as a beast of an enterprise AI company whose demand may have outgrown its compute supply. The hosts discuss Amazon and Google compute deals, Claude throttling, and whether Anthropic could become more valuable than Google." }], // 1:39:56
  },
  {
    name: "Anthropic-xAI partnership",
    keywords: ["anthropic xai", "xai partnership", "colossus", "grok compute", "elon dario"],
    picks: [{ youtube_id: "9JL95zG0rQ0", t: 6219, label: "The Anthropic-xAI partnership is treated as one of the strangest and most important AI stories: xAI has massive underused compute, Anthropic has huge model demand, and Elon/Dario social dynamics now intersect with the OpenAI fight." }], // 1:43:39
  },
  {
    name: "AI compute markets",
    keywords: ["ai compute", "compute shortage", "tpu", "trainium", "colossus", "gpu utilization"],
    picks: [{ youtube_id: "9JL95zG0rQ0", t: 6126, label: "The Anthropic segment turns into an AI compute-market map: Google TPUs, Amazon Trainium, xAI Colossus capacity, Nvidia's position, and whether model companies can secure enough compute without overbuilding or depending on weaker chips." }], // 1:42:06
  },
  {
    name: "AI music production",
    keywords: ["ai music", "logic pro", "stem separation", "ai beats", "music models"],
    picks: [{ youtube_id: "9JL95zG0rQ0", t: 120, label: "The episode opens with AI music tools: Logic Pro stem separation and new model-assisted beat production make old creative workflows feel radically easier, while still leaving taste and performance as the hard human layer." }], // 2:00
  },
  {
    name: "Nostr music",
    keywords: ["nostr music", "wave lake", "fountain", "music clients", "bitcoin music"],
    picks: [{ youtube_id: "9JL95zG0rQ0", t: 216, label: "Wave Lake and Nostr music clients are revisited through a quality signal: the hosts finally find music on a Nostr client that they would listen to outside the bitcoin context, suggesting editorial taste may matter more than payment novelty." }], // 3:36
  },
  {
    name: "Strategy",
    keywords: ["strategy", "microstrategy", "mstr", "saylor", "strategy bitcoin"],
    picks: [{ youtube_id: "qJ2Tk6HoqBA", t: 433, label: "The hosts use the claim that Strategy is 'SBF on steroids' as a stress test. They reject the fraud analogy while taking seriously the separate risks of concentration, leverage, custody opacity, and collateral damage if Strategy ever blew up." }], // 7:13
  },
  {
    name: "Strategy blowup risk",
    keywords: ["strategy blowup risk", "mstr blow up", "saylor sbf", "strategy systemic risk", "microstrategy risk"],
    picks: [{ youtube_id: "qJ2Tk6HoqBA", t: 433, label: "The MSTR blowup discussion separates sensational fraud claims from a real systemic-risk question: Strategy owns a large share of bitcoin, uses capital-market leverage, and could create reputational or market collateral damage even if the probability of a near-term failure is low." }], // 7:13
  },
  {
    name: "Strategy capital structure",
    keywords: ["strategy capital structure", "mstr", "strc", "stretch", "preferred shares", "credit products"],
    picks: [
      { youtube_id: "qJ2Tk6HoqBA", t: 1262, label: "The hosts ask how much bitcoin needs to grow to support Strategy's credit products, treating MSTR as a capital-structure machine whose debt and preferred instruments depend on long-run bitcoin appreciation and market confidence." }, // 21:02
      { youtube_id: "qJ2Tk6HoqBA", t: 1939, label: "The MSTR versus STRC segment compares owning Strategy equity with owning its credit-like products. The discussion centers on upside, yield, collateral coverage, and whether investors are underwriting bitcoin exposure or a specific layer of Strategy's financing stack." }, // 32:19
    ],
  },
  {
    name: "STRC yield",
    keywords: ["strc yield", "strc", "stretch", "strategy yield", "mstr vs strc"],
    picks: [{ youtube_id: "qJ2Tk6HoqBA", t: 1939, label: "STRC is discussed as a different bet than MSTR: more yield-like and structure-specific, with the key question being whether its return compensates for the credit, collateral, and Strategy-specific risks." }], // 32:19
  },
  {
    name: "Bitcoin security budget",
    keywords: ["bitcoin security budget", "security budget", "miner revenue", "transaction fees", "hash rate"],
    picks: [
      { youtube_id: "qJ2Tk6HoqBA", t: 3355, label: "The episode zooms out from a transaction-fee paper to the broader security-budget question: as subsidy declines, bitcoin's defense depends on some mix of fees, price, hash rate, miner economics, and real-world attacker constraints." }, // 55:55
      { youtube_id: "qJ2Tk6HoqBA", t: 4300, label: "The hosts argue that the hard part is not just whether bitcoin has a security budget, but that no one really knows what annual security budget is enough. The answer may have to come from markets, miner economics, and observed attacker incentives rather than a top-down target." }, // 1:11:40
    ],
  },
  {
    name: "Nation-state bitcoin attack risk",
    keywords: ["nation-state bitcoin attack", "nation state attack", "attack bitcoin", "bitcoin attack vectors", "china bitcoin attack", "us bitcoin attack"],
    picks: [{ youtube_id: "qJ2Tk6HoqBA", t: 4860, label: "The nation-state segment narrows realistic bitcoin attack candidates to actors with enormous energy, hardware access, money, secrecy, and geopolitical motive. The hosts see the United States and China as theoretically capable, while arguing political and economic incentives make attack less likely as adoption broadens." }], // 1:21:00
  },
  {
    name: "Bitcoin miners and AI compute",
    keywords: ["bitcoin miners ai compute", "miners switching to ai", "hashrate bear market", "ai compute mining", "gpu miners"],
    picks: [{ youtube_id: "qJ2Tk6HoqBA", t: 4690, label: "The security-budget discussion turns to miners shifting energy contracts and facilities toward AI compute. The hosts treat this as a short-run hash-rate concern but also a possible decentralizing force as mining moves toward cheaper stranded energy at the edges." }], // 1:18:10
  },
  {
    name: "Proof of work energy reuse",
    keywords: ["proof of work energy reuse", "bitcoin heat", "bitcoin hot tubs", "mining heat reuse", "proof of work hot tubs"],
    picks: [{ youtube_id: "qJ2Tk6HoqBA", t: 2744, label: "A joke about proof of work for hot tubs becomes a security-budget doorway: if mining energy is reused for heat or industrial work, the economics of bitcoin security may look different than a simple electricity-cost critique." }], // 45:44
  },
  {
    name: "Cashu",
    keywords: ["cashu", "cashu dev kit", "cashu wallet", "cashu mint", "bitcoin ecash"],
    picks: [{ youtube_id: "kedTRhMgnec", t: 232, label: "Calle explains Cashu as Chaumian e-cash built on bitcoin rails: users deposit bitcoin, withdraw private bearer e-cash from a mint, and get fast, cheap, privacy-preserving payments for wallets and applications." }], // 3:52
  },
  {
    name: "Chaumian ecash",
    keywords: ["chaumian ecash", "david chaum", "ecash", "cashu", "private bearer asset"],
    picks: [{ youtube_id: "kedTRhMgnec", t: 232, label: "Calle grounds Cashu in the older Chaumian e-cash lineage: digital cash predates bitcoin, and Cashu reuses that privacy model on top of bitcoin instead of the banking system." }], // 3:52
  },
  {
    name: "Ecash design",
    keywords: ["ecash design", "cashu", "cashu mint", "ecash privacy", "ecash wallet"],
    picks: [{ youtube_id: "kedTRhMgnec", t: 330, label: "The Cashu explanation treats e-cash design as a practical product architecture: mints issue bearer tokens, wallets hold them locally, and the result is private, fast, low-fee bitcoin-denominated payments." }], // 5:30
  },
  {
    name: "Cashu and Lightning",
    keywords: ["cashu lightning", "cashu on lightning", "cashu mint lightning node", "ecash lightning", "lightning cashu"],
    picks: [{ youtube_id: "kedTRhMgnec", t: 367, label: "Calle is precise that Cashu is not a bitcoin layer with unilateral exits, but it composes naturally with Lightning: a mint can sit on top of a Lightning node and Cashu wallets can make Lightning payments through that infrastructure." }], // 6:07
  },
  {
    name: "Agentic money",
    keywords: ["agentic money", "agent payments", "agents pay", "cashu agents", "bitcoin agents"],
    picks: [{ youtube_id: "kedTRhMgnec", t: 416, label: "Calle says agents can use Cashu surprisingly easily because e-cash behaves like a bearer asset: hand the agent a token string, and it can hold value locally, pay directly with e-cash, or route out over Lightning." }], // 6:56
  },
  {
    name: "Agentic commerce",
    keywords: ["agentic commerce", "agent payments", "ai agents payments", "micropayments agents", "bitcoin services agents"],
    picks: [{ youtube_id: "kedTRhMgnec", t: 602, label: "Calle frames bitcoin payments as especially useful for agents because agents need one-off service payments more than subscriptions. Fast, low-value bitcoin payments let agents buy search, email, CAPTCHA solving, or other online services without account-heavy rails." }], // 10:02
  },
  {
    name: "Bitchat",
    keywords: ["bitchat", "bit chat", "bluetooth mesh messenger", "mesh messaging", "offline messenger"],
    picks: [{ youtube_id: "kedTRhMgnec", t: 711, label: "Calle describes Bitchat as a Bluetooth mesh messenger that works without the internet. Messages hop phone to phone, which makes it useful for campuses, outages, activism, and environments where centralized internet infrastructure is surveilled or unavailable." }], // 11:51
  },
  {
    name: "Clawi",
    keywords: ["clawi", "clawi ai", "clawie", "openclaw hosted", "hosted agent platform"],
    picks: [{ youtube_id: "kedTRhMgnec", t: 932, label: "Clawi is described as a hosted platform for deploying personal or organizational AI agents. Users can spin up OpenClaw or Hermes-style agents and connect them to Telegram, Slack, Discord, or similar tools without doing the hard setup themselves." }], // 15:32
  },
  {
    name: "OpenClaw",
    keywords: ["openclaw", "open claw", "clawi", "hosted openclaw", "telegram ai agent"],
    picks: [{ youtube_id: "kedTRhMgnec", t: 1006, label: "Calle places OpenClaw in a third chapter of AI usage: always-online personal agents that can keep working through Telegram or other messaging surfaces even when the user is not actively babysitting a browser chat." }], // 16:46
  },
  {
    name: "Organizational AI agents",
    keywords: ["organizational ai agents", "ai agents organizations", "company ai strategy", "knowledge base agent", "devops agent", "support agent"],
    picks: [{ youtube_id: "kedTRhMgnec", t: 1189, label: "Calle says organizations are starting to ask what their AI strategy should be. He points to knowledge-base agents, DevOps agents, and customer-support agents as practical examples where agent platforms become company infrastructure." }], // 19:49
  },
  {
    name: "Calle",
    keywords: ["calle", "callebtc", "cashu calle", "bitchat calle", "clawi calle"],
    picks: [{ youtube_id: "kedTRhMgnec", t: 0, label: "Calle joins 21 in 21 to connect his work across Cashu, Bitchat, and Clawi: private bitcoin-native payments, offline mesh communication, and accessible AI agents as three parts of a broader builder arc." }], // 0:00
  },
]);

addTopicDefs([
  {
    name: "AI-native livestreaming",
    keywords: ["ai-native livestreaming", "jam chat", "jamchat", "answerbot", "livestream agents"],
    picks: [{ youtube_id: "f6WH9BbbavM", t: 460, label: "Jam Chat turns the PBJ livestream into an AI-native chat surface: viewers can ask Answerbot questions, get web-backed answers in the stream, and potentially attach Lightning payments or tips to the interaction." }], // 7:40
  },
  {
    name: "Buzz",
    keywords: ["buzz", "sprout", "block buzz", "ai-native communications", "multi-agent chat"],
    picks: [{ youtube_id: "f6WH9BbbavM", t: 930, label: "Buzz is introduced as Block's open-source, AI-native communication project. It looks like Slack or Discord on the surface, but starts with multiple agents, channels, DMs, and AI participation as first-class primitives." }], // 15:30
  },
  {
    name: "Nostr identity",
    keywords: ["nostr identity", "open source identity", "nostr for agents", "bitcoin open source money"],
    picks: [{ youtube_id: "f6WH9BbbavM", t: 1526, label: "The hosts compress the bitcoin and Nostr pitch into two simple primitives: bitcoin as open-source money, Nostr as open-source identity. That framing makes Nostr easier to understand as the identity layer for apps, agents, and AI-native communication." }], // 25:26
  },
  {
    name: "Multi-agent workflows",
    keywords: ["multi-agent workflows", "agent collaboration", "agents in channels", "ai group chat", "agent 24/7"],
    picks: [{ youtube_id: "f6WH9BbbavM", t: 1873, label: "Buzz is framed as a place where humans and agents collaborate in channels around projects. A builder can drop an idea into a channel and have a project-specific agent respond later, turning group chat into persistent multi-agent workflow." }], // 31:13
  },
  {
    name: "Agentic commerce",
    keywords: ["buzz wallet", "lexe wallet", "agentic payments", "lightning agents", "channel wallet"],
    picks: [
      { youtube_id: "f6WH9BbbavM", t: 2171, label: "A Lexe wallet integration inside Buzz makes every user and channel closer to having a working Lightning wallet by default. The segment treats wallet-native group chat as a path toward agent payments, shared channel balances, and bitcoin-powered collaboration." }, // 36:11
      { youtube_id: "f6WH9BbbavM", t: 4904, label: "The ARK/BARK discussion broadens into the question of what money agents will actually use. The hosts expect Lightning to remain glue between systems, while autonomous agents may care more than humans about interoperability, permissionlessness, and decentralized settlement." }, // 1:21:44
    ],
  },
  {
    name: "AI personhood",
    keywords: ["ai personhood", "agent personhood", "autonomous agents", "agent companies", "agentic corporation"],
    picks: [{ youtube_id: "f6WH9BbbavM", t: 2430, label: "The AI personhood segment starts from channel wallets and AI-built projects, then moves into whether autonomous agents can coordinate funding, labor, revenue shares, and eventually corporate-like structures without a traditional company in the middle." }], // 40:30
  },
  {
    name: "Anthropic",
    keywords: ["fable 5", "mythos", "glasswing", "anthropic fable", "zero days"],
    picks: [{ youtube_id: "f6WH9BbbavM", t: 3209, label: "Anthropic's Fable 5 and Mythos drama becomes a test case for frontier-model release policy. The hosts weigh restricted access for zero-day discovery against the reality that powerful capabilities will diffuse and be distilled quickly." }], // 53:29
  },
  {
    name: "Open-source AI",
    keywords: ["open models", "open model layers", "local models", "model stack", "open-source models"],
    picks: [{ youtube_id: "f6WH9BbbavM", t: 4054, label: "The hosts map the AI stack across frontier model labs, infrastructure, data, and product layers, then land on excitement for stronger open models and open layers that can compete outside closed lab ecosystems." }], // 1:07:34
  },
  {
    name: "Ark",
    keywords: ["ark", "arc", "bitcoin layer 2", "ark labs", "arc labs", "arcade", "ark service provider", "asp"],
    picks: [{ youtube_id: "f6WH9BbbavM", t: 4211, label: "Ark is introduced as a bitcoin layer-2 technology whose original proposal had novel ideas but weak economics and UX. New implementations like Ark Labs' Arcade make the design more practical by improving capital efficiency and wallet scalability." }], // 1:10:11
  },
  {
    name: "Bark",
    keywords: ["bark", "second", "bark mainnet", "ark implementation", "bitcoin payments layer 2"],
    picks: [{ youtube_id: "f6WH9BbbavM", t: 4291, label: "Bark is presented as Second's Ark implementation, newly launched on mainnet after time on Signet. The hosts contrast Bark's bitcoin-payments focus with Arcade's broader token and stablecoin playbook." }], // 1:11:31
  },
  {
    name: "Base",
    keywords: ["base", "ethereum vs base", "corp chains", "usdc on base", "surge base"],
    picks: [
      { youtube_id: "f6WH9BbbavM", t: 5215, label: "Listener feedback on Surge's use of USDC on Base turns into a decentralization trade-off: Ethereum is more decentralized than Base, but Base may offer cheaper, smoother stablecoin movement for the actual lending use case." }, // 1:26:55
      { youtube_id: "we7gHhi9xiY", t: 1688, label: "Surge's dependencies are broken down as Ethereum, Base, and oracle infrastructure. The hosts view each piece as low risk, but still name the stack explicitly because non-custodial credit inherits risks from every external system it relies on." }, // 28:08
    ],
  },
  {
    name: "Cash App Wand",
    keywords: ["cash app wand", "wand", "nfc payment device", "cash app hardware", "tap to pay wand"],
    picks: [{ youtube_id: "we7gHhi9xiY", t: 56, label: "The Cash App Wand is treated as a surprisingly strong consumer-payments signal: a passive NFC payment accessory, no battery, phone-free tap-to-pay, 10,000-unit batch one, and a sold-out launch with almost no marketing." }], // 0:56
  },
  {
    name: "Cash App",
    keywords: ["cash app wand", "cash app usdc", "cash app stablecoin", "cash app dollars", "cash app nfc"],
    picks: [
      { youtube_id: "we7gHhi9xiY", t: 56, label: "Cash App's Wand extends the payment surface beyond phones and cards into a small passive NFC object, suggesting Cash App can keep experimenting with form factor, youth culture, and bitcoin rewards without making the product feel like crypto." }, // 0:56
      { youtube_id: "we7gHhi9xiY", t: 2321, label: "Cash App's USDC integration is praised because stablecoin deposits appear inside the ordinary dollar balance. Users do not have to manage separate stablecoin and bank-dollar buckets, which makes the crypto rail disappear into familiar money UX." }, // 38:41
    ],
  },
  {
    name: "Surge",
    keywords: ["surge", "bitcoin-backed credit line", "no kyc lending", "self-custody lending", "signer network"],
    picks: [
      { youtube_id: "we7gHhi9xiY", t: 547, label: "Surge launches from Presidio Bitcoin as a self-custodied, no-KYC bitcoin-backed line of credit. The hosts focus on whether it can combine the trust advantages of self-custody with competitive UX, rates, and liquidity." }, // 9:07
      { youtube_id: "we7gHhi9xiY", t: 1288, label: "Surge's oracle and liquidation design is unpacked around price triggers, Base smart contracts, transparency, audits, and whether users can independently inspect the rules that decide when collateral is at risk." }, // 21:28
    ],
  },
  {
    name: "Taproot",
    keywords: ["surge taproot", "taproot scripts", "multiple spending scripts", "taproot lending", "bitcoin script paths"],
    picks: [{ youtube_id: "we7gHhi9xiY", t: 967, label: "Surge is used as a practical Taproot use case: multiple spending scripts can exist behind a single bitcoin output, and only the path actually used needs to be revealed. That privacy and flexibility matter for non-custodial lending design." }], // 16:07
  },
  {
    name: "Bitcoin-backed loans",
    keywords: ["bitcoin-backed credit line", "borrow against bitcoin", "bitcoin collateral ai stocks", "surge credit line", "non-custodial lending"],
    picks: [
      { youtube_id: "we7gHhi9xiY", t: 547, label: "The Surge launch revisits the core borrower job: access dollars without selling bitcoin, while avoiding opaque custody and rehypothecation. The product is framed as a line of credit rather than a conventional term loan." }, // 9:07
      { youtube_id: "we7gHhi9xiY", t: 2254, label: "The hosts identify a large product opportunity: let bitcoin holders post BTC and buy exposure to AI companies like Google, Anthropic, xAI, OpenAI, or Nvidia without selling their bitcoin. The winning version would make that collateralized flow easy and ideally non-custodial." }, // 37:34
    ],
  },
  {
    name: "Stablecoins",
    keywords: ["cash app usdc", "usdc cash app", "stablecoin dollar balance", "base usdc", "stablecoin ux"],
    picks: [{ youtube_id: "we7gHhi9xiY", t: 2321, label: "Cash App's USDC rollout is framed as the best stablecoin UX the hosts have seen because USDC simply shows up as dollars. The deeper product point is that stablecoins become more useful when users do not have to think about which dollar rail they are using." }], // 38:41
  },
  {
    name: "Living design docs",
    keywords: ["living design docs", "canonical github", "ai design docs", "chat with docs", "adversarial architecture"],
    picks: [{ youtube_id: "we7gHhi9xiY", t: 3074, label: "The hosts argue for canonical, GitHub-hosted design docs that users and AI systems can interrogate. For products like Surge, a living design repository could clarify architecture, expose assumptions, and let outsiders ask better adversarial questions." }], // 51:14
  },
  {
    name: "AI liquidity drain",
    keywords: ["ai sucking liquidity", "bitcoin liquidity", "ai bubble", "ai stocks bitcoin", "bitcoin ai rotation"],
    picks: [{ youtube_id: "we7gHhi9xiY", t: 3264, label: "Bitcoin's price weakness is discussed through the possibility that AI is sucking investor liquidity and attention away from BTC. The hosts do not claim hard data, but connect the psychology to AI stocks, treasury products, and bitcoin holders wanting exposure to the AI transition." }], // 54:24
  },
  {
    name: "AI IPO wave",
    keywords: ["spacex ipo", "anthropic ipo", "openai ipo", "ai ipo wave", "exit liquidity"],
    picks: [{ youtube_id: "we7gHhi9xiY", t: 3600, label: "The IPO-wave argument is that SpaceX, Anthropic, OpenAI, and other AI exits could create new wealth that later diversifies back into bitcoin. The hosts contrast that possibility with the near-term pull of AI investments." }], // 1:00:00
  },
  {
    name: "Zcash",
    keywords: ["zcash crash", "zcash inflation bug", "orchard", "turnstile", "auditable supply"],
    picks: [{ youtube_id: "we7gHhi9xiY", t: 3960, label: "The Zcash price crash is treated as a notable break from the usual altcoin reaction to security news. The hosts connect it to an inflation-bug scare and the market finally caring about whether a privacy system can prove its supply." }], // 1:06:00
  },
  {
    name: "Zcash inflation bug",
    keywords: ["zcash inflation bug", "zcash crash", "opus zcash", "orchard bug", "turnstile"],
    picks: [{ youtube_id: "we7gHhi9xiY", t: 3960, label: "The Zcash crash becomes a case study in AI-assisted vulnerability discovery: a model appears to uncover an inflation risk, the price reacts sharply, and the hosts ask how privacy coins recover trust when supply auditability is the question." }], // 1:06:00
  },
  {
    name: "Auditable supply",
    keywords: ["auditable supply", "21 million auditability", "privacy versus auditability", "zcash supply audit", "bitcoin supply"],
    picks: [{ youtube_id: "we7gHhi9xiY", t: 4075, label: "The Zcash segment sharpens the privacy-versus-auditability trade-off. The hosts support financial privacy, but not at the cost of losing confidence that the 21 million supply cap, or any monetary supply cap, can be independently audited." }], // 1:07:55
  },
  {
    name: "Zcash turnstiles",
    keywords: ["zcash turnstile", "orchard", "trusted setup", "shielded pool", "zcash recovery"],
    picks: [{ youtube_id: "we7gHhi9xiY", t: 4279, label: "Zcash turnstiles are explained as a recovery mechanism for moving coins between shielded pools after vulnerabilities. The hosts compare the process to e-cash proof-of-reserves style migrations and note the recurring trust burden from earlier setup bugs." }], // 1:11:19
  },
  {
    name: "Project Loupe",
    keywords: ["project loupe", "ai vulnerability discovery", "bitcoin audits", "model audits", "ai code review"],
    picks: [{ youtube_id: "we7gHhi9xiY", t: 4462, label: "The Zcash bug reinforces why Project Loupe-style AI audits matter for bitcoin. As models improve, the hosts want serious projects to proactively run frontier-model security reviews rather than waiting for attackers to find bugs first." }], // 1:14:22
  },
  {
    name: "Cloudflare",
    keywords: ["cloudflare agents", "ai agents http requests", "agent traffic", "bots over humans", "cloudflare ai"],
    picks: [{ youtube_id: "we7gHhi9xiY", t: 5020, label: "Cloudflare's report that agents overtook humans in HTTP requests is used as evidence that the internet is becoming an agent play space. The hosts ask how much is real productivity versus inflated bot traffic, but treat the direction as important." }], // 1:23:40
  },
  {
    name: "Agentic web",
    keywords: ["agent web traffic", "cloudflare agents", "ai agents browsing", "agents overtake humans", "agentic internet"],
    picks: [{ youtube_id: "we7gHhi9xiY", t: 5020, label: "Agent traffic overtaking human web requests points toward an agentic web where people sit at the edges while agents browse, compare, buy, and coordinate online. The open question is which payment and identity rails those agents default to." }], // 1:23:40
  },
  {
    name: "Model routing",
    keywords: ["model routing", "dynamic model selection", "query complexity", "nvidia model selection", "spiral ai"],
    picks: [{ youtube_id: "we7gHhi9xiY", t: 5252, label: "The episode closes by previewing Spiral's AI work around dynamic model selection and query complexity. The thesis is that routing easy tasks to cheap local or open models and hard tasks to frontier models becomes a central optimization layer." }], // 1:27:32
  },
]);

addTopicDefs([
  {
    name: "Goose",
    keywords: ["goose", "block goose", "goose ai agent", "goose core team", "goose desktop"],
    picks: [
      { youtube_id: "-M_5aSgNqow", t: 832, label: "Goose is introduced as Block's early AI-agent harness: a desktop app that predated Claude Code, Codex, and OpenClaw, with the new direction shifting it from one application into reusable agent infrastructure." }, // 13:52
      { youtube_id: "m7NGzb8m0nk", t: 634, label: "Alex Hancock traces Goose from a 2024 Python CLI into a Rust desktop app, early MCP support, MCP UI/App experiments, ACP support, and skills. The talk positions Goose as both a harness and an incubator for open agent standards." }, // 10:34
    ],
  },
  {
    name: "Goose Development Kit",
    keywords: ["goose development kit", "gdk", "goose gdk", "agent development kit", "goose api"],
    picks: [
      { youtube_id: "m7NGzb8m0nk", t: 299, label: "Steve Lee introduces the Goose Development Kit as the shift from one Goose app to a platform for many agentic applications, with ACP for client interoperability and a Rust API for lower-level Goose components." }, // 4:59
      { youtube_id: "-M_5aSgNqow", t: 1240, label: "PBJ previews GDK as a development layer for many applications, not just an IDE-style Goose client. The shared layer is orchestration: model providers, tool calling, session behavior, and agent primitives that different apps can reuse." }, // 20:40
      { youtube_id: "69uez6D9sTQ", t: 1141, label: "After the Goose team retreat, Steve describes GDK's near-term roadmap: ACP already works as the client-facing standard, while the new Rust API is the immediate engineering priority before deeper bitcoin integrations." }, // 19:01
    ],
  },
  {
    name: "Agent Client Protocol",
    keywords: ["agent client protocol", "acp", "acp agent", "goose acp", "buzz acp"],
    picks: [
      { youtube_id: "m7NGzb8m0nk", t: 1515, label: "Lifei Z explains Goose ACP as the client-facing API surface: applications can run a Goose ACP server and communicate with agents through the emerging Agent Client Protocol instead of each client leaking its own logic." }, // 25:15
      { youtube_id: "-M_5aSgNqow", t: 2366, label: "Buzz becomes the practical ACP demo: it auto-detects local ACP agents such as Goose, Claude Code, and Codex, then lets users pick agents inside one shared workspace." }, // 39:26
      { youtube_id: "69uez6D9sTQ", t: 2544, label: "The PBJ crew uses Buzz to explain ACP as an open interface between clients and agents. Buzz can call Codex, Claude Code, or Goose, while Goose can route to local or cloud models underneath." }, // 42:24
    ],
  },
  {
    name: "Goose Rust API",
    keywords: ["goose rust api", "rust api", "goose crates", "provider crate", "goose components"],
    picks: [{ youtube_id: "m7NGzb8m0nk", t: 1270, label: "Jack Amadeo explains the Rust API side of GDK: Goose is being broken into reusable crates so developers can embed model providers, session management, local inference, and other battle-tested components without dragging in the whole desktop app." }], // 21:10
  },
  {
    name: "MCP apps",
    keywords: ["mcp apps", "mcp ui", "model context protocol", "mcp support", "goose mcp"],
    picks: [{ youtube_id: "m7NGzb8m0nk", t: 634, label: "Goose's history includes early Model Context Protocol support and MCP UI, later MCP Apps. The segment frames Goose as an early standards adopter whose experiments fed into broader agent UX patterns." }], // 10:34
  },
  {
    name: "Spiral",
    keywords: ["spiral goose", "spiral ai", "spiral expanding into ai", "spiral public goods", "spiral open source ai"],
    picks: [
      { youtube_id: "m7NGzb8m0nk", t: 100, label: "Steve explains why Goose is moving into Spiral: Spiral has seven years of public-goods and open-source credibility in bitcoin, and now wants to bring decentralization, permissionless technology, and open-source values to AI." }, // 1:40
      { youtube_id: "69uez6D9sTQ", t: 569, label: "Spiral's AI expansion is presented as additive to bitcoin rather than a retreat from it. Steve argues the AI audience is much larger today, and open-source, decentralized AI work can ultimately be a net win for bitcoin." }, // 9:29
    ],
  },
  {
    name: "Open-source AI",
    keywords: ["open-source ai", "open source ai", "open models", "open-weight models", "open ai stack"],
    picks: [
      { youtube_id: "m7NGzb8m0nk", t: 1928, label: "The Goose talk treats local and open models as a practical part of the agent stack: privacy, lower latency, offline use, and no incremental per-token cost make open models useful even when frontier cloud models remain stronger." }, // 32:08
      { youtube_id: "A7BStVZbSoU", t: 1705, label: "The Open Source AI Summit announcement defines the program around open models, local models, and the philosophy of open AI infrastructure. PBJ connects the summit to the Builder meetup and the localmaxxing movement." }, // 28:25
      { youtube_id: "69uez6D9sTQ", t: 1552, label: "The hosts discuss how developers might orchestrate open-source models alongside Claude, Codex, and other frontier tools, with Buzz and Goose as possible coordination surfaces for mixed open and closed model workflows." }, // 25:52
    ],
  },
  {
    name: "Open Source AI Summit",
    keywords: ["open source ai summit", "opensourceaisummit", "open-source ai summit", "presidio bitcoin open source ai summit"],
    picks: [
      { youtube_id: "m7NGzb8m0nk", t: 0, label: "The Goose event opens by announcing Presidio Bitcoin's Open Source AI Summit, positioning the space's bitcoin values of open source, decentralization, security, privacy, and sovereignty as equally relevant to intelligence." }, // 0:00
      { youtube_id: "A7BStVZbSoU", t: 1705, label: "PBJ announces the September 10-11 Open Source AI Summit, covering open models, local models, and the philosophy of why open-source intelligence infrastructure matters." }, // 28:25
    ],
  },
  {
    name: "Local AI models",
    keywords: ["local ai models", "local models", "open weight models", "unified memory", "on-device ai"],
    picks: [
      { youtube_id: "m7NGzb8m0nk", t: 1928, label: "Jasper Hugo lays out why Goose supports local models: privacy, offline operation, lower latency on capable hardware, and zero marginal token cost once users own the machine." }, // 32:08
      { youtube_id: "A7BStVZbSoU", t: 365, label: "The Builder recap highlights Tomasz Tunguz's localmaxxing workflow and a broader shift from vibe-coding meetups toward deeper technical conversations about local and open AI." }, // 6:05
    ],
  },
  {
    name: "Localmaxxing",
    keywords: ["localmaxxing", "local maxing", "tomasz tunguz", "local ai workflow", "builder local ai"],
    picks: [{ youtube_id: "A7BStVZbSoU", t: 365, label: "Tomasz Tunguz's localmaxxing presentation becomes the anchor for a Builder recap about serious local AI workflows, open models, and how mainstream Silicon Valley operators are now experimenting inside Presidio Bitcoin's AI builder scene." }], // 6:05
  },
  {
    name: "Mesh-LLM",
    keywords: ["mesh-llm", "mesh llm", "meshm", "distributed inference", "peer-to-peer inference"],
    picks: [
      { youtube_id: "m7NGzb8m0nk", t: 2610, label: "Mesh-LLM is presented as a peer-to-peer inference project that grew out of Goose's local-model work, combining heterogeneous machines to make open-weight intelligence more available." }, // 43:30
      { youtube_id: "69uez6D9sTQ", t: 1141, label: "PBJ checks in on Mesh-LLM after the Goose retreat, with Steve noting that contributors beyond Mick are now spending serious time on it and that the project is moving from experiment toward a more substantial shared-compute layer." }, // 19:01
    ],
  },
  {
    name: "Bitcoin compute markets",
    keywords: ["sell compute for bitcoin", "compute marketplace bitcoin", "mesh llm bitcoin", "bitcoin gpu marketplace"],
    picks: [{ youtube_id: "m7NGzb8m0nk", t: 2873, label: "During the Mesh-LLM Q&A, the obvious next question is whether people can sell spare compute for bitcoin. The answer is not built yet, but the team treats paid open compute as an expected future direction." }], // 47:53
  },
  {
    name: "Model routing",
    keywords: ["model routing", "dynamic model routing", "token cost routing", "route to cheaper models", "query routing"],
    picks: [{ youtube_id: "m7NGzb8m0nk", t: 2472, label: "Michael Neale explains model routing as a harness-layer optimization: Goose can decide when a cheaper model is good enough and reserve expensive frontier calls for tasks that actually need them." }], // 41:12
  },
  {
    name: "Prompt caching",
    keywords: ["prompt caching", "anthropic prompt caching", "token efficiency", "cache prefix", "agent token cost"],
    picks: [{ youtube_id: "m7NGzb8m0nk", t: 3010, label: "Filip Kujawa's Goose work finds a silent token-cost bug: prompt caching looked available, but a changing date in the prompt prefix prevented reuse. The segment turns token efficiency from an abstract concern into concrete harness plumbing." }], // 50:10
  },
  {
    name: "Agent harnesses",
    keywords: ["agent harness", "ai harness", "coding harness", "goose harness", "harness engineering"],
    picks: [
      { youtube_id: "m7NGzb8m0nk", t: 3298, label: "The Goose Q&A compares agent harnesses by provider support, token efficiency, model flexibility, and whether a neutral harness can compete with fast-moving first-party coding tools." }, // 54:58
      { youtube_id: "-M_5aSgNqow", t: 832, label: "PBJ defines Goose as a harness rather than a model: the software layer that controls model calls, tools, and workflow around an agent." }, // 13:52
    ],
  },
  {
    name: "Credibly neutral AI agents",
    keywords: ["credible neutrality ai", "neutral ai agent", "neutral agent harness", "goose neutrality", "open agent ecosystem"],
    picks: [{ youtube_id: "m7NGzb8m0nk", t: 3557, label: "A question about Goose's speed turns into the credible-neutrality thesis: the project may not own the zeitgeist yet, but Spiral and the Linux Foundation give Goose a path to be trusted agent infrastructure rather than a single company's product funnel." }], // 59:17
  },
  {
    name: "Harness benchmarks",
    keywords: ["harness benchmarks", "terminal bench", "swe bench", "benchmark overfitting", "agent evals"],
    picks: [{ youtube_id: "m7NGzb8m0nk", t: 4012, label: "The benchmark discussion warns against overfitting agent harnesses to SWE-bench or Terminal-Bench. Goose uses benchmark results to identify general improvements, such as turn awareness, rather than teaching the agent the test set." }], // 1:06:52
  },
  {
    name: "Model-harness tuning",
    keywords: ["model harness tuning", "model harness coevolution", "custom model harness", "tool prompting", "model-specific prompts"],
    picks: [{ youtube_id: "m7NGzb8m0nk", t: 4248, label: "The Q&A explores whether models and harnesses should be tuned together. Frontier models may now work across harnesses, but smaller local models may need model-specific system prompts, tool formats, and handholding." }], // 1:10:48
  },
  {
    name: "Domain-specific agent apps",
    keywords: ["domain-specific agent apps", "specialized agent apps", "custom agent harness", "electrician app", "agent app evaluation"],
    picks: [{ youtube_id: "m7NGzb8m0nk", t: 4520, label: "A question about an electrician-management app captures the GDK opportunity: developers can build domain-specific apps on Goose, then evaluate whether skills, hard-coded logic, or tool calls produce the best result for each workflow." }], // 1:15:20
  },
  {
    name: "AI data privacy",
    keywords: ["ai data privacy", "model data leakage", "prompt injection", "ai membranes", "orchestrator agent"],
    picks: [{ youtube_id: "69uez6D9sTQ", t: 2000, label: "PBJ treats cross-model data leakage as an unsolved problem for mixed frontier, open, and local model workflows. Vora's bitcoin-style paranoia becomes a design lens for protecting prompts, model context, and private data from prompt injection." }], // 33:20
  },
  {
    name: "Model interpretability",
    keywords: ["model interpretability", "mechanistic interpretability", "jspace", "anthropic interpretability", "model thoughts"],
    picks: [{ youtube_id: "69uez6D9sTQ", t: 2282, label: "Anthropic's JSpace work is discussed as a possible window into model planning and internal concepts. The hosts connect interpretability to the bigger question of whether agents have something like a planning space rather than just token-by-token output." }], // 38:02
  },
  {
    name: "AI subscription lock-in",
    keywords: ["ai subscription lock-in", "claude code subscription", "api token pricing", "agent subscription", "model provider lock-in"],
    picks: [{ youtube_id: "69uez6D9sTQ", t: 2856, label: "The Claude Code subscription discussion exposes a business-model lock-in: users can run Anthropic's own interface under subscription pricing, but using the same model through Goose requires API tokens and per-token costs." }], // 47:36
  },
  {
    name: "Buzz",
    keywords: ["buzz", "block buzz", "ai-native communications", "acp buzz", "agents in channels"],
    picks: [
      { youtube_id: "-M_5aSgNqow", t: 2366, label: "Buzz is used as the clearest ACP example: one workspace can coordinate Claude Code, Codex, and Goose, showing how AI-native communication can become a shared control surface for multiple agents." }, // 39:26
      { youtube_id: "69uez6D9sTQ", t: 2544, label: "The follow-up PBJ frames Buzz as the place where ACP becomes tangible: local agents appear automatically, users can pick which agent to run, and Goose can sit underneath as a model-flexible harness." }, // 42:24
    ],
  },
  {
    name: "Open-source development",
    keywords: ["work in public", "open source development in public", "buzz pull requests", "public software development", "agentic open source"],
    picks: [{ youtube_id: "-M_5aSgNqow", t: 3262, label: "Steve argues Buzz can move open-source work even earlier into public view: ideas, debugging, tests, and agent reasoning can happen in shared channels before the polished pull request stage." }], // 54:22
  },
  {
    name: "Agentic developer support",
    keywords: ["agentic developer support", "sdk support agents", "api support agents", "developer support ai", "buzz sdk"],
    picks: [{ youtube_id: "-M_5aSgNqow", t: 3845, label: "Buzz is imagined as the future of SDK and API support: users build in public channels, while maintainers and their agents can watch real integrations, offer suggestions, and correct mistakes before support tickets exist." }], // 1:04:05
  },
  {
    name: "Anthropic",
    keywords: ["fable 5", "claude paternalistic", "claude pilling", "anthropic fable", "anthropic export control"],
    picks: [
      { youtube_id: "-M_5aSgNqow", t: 3845, label: "Max describes getting Claude-pilled and then noticing Claude becoming more paternalistic, while wondering whether the returned Fable model is the same capability people saw before the restriction drama." }, // 1:04:05
      { youtube_id: "A7BStVZbSoU", t: 905, label: "The Fable 5 export-control story is treated as a watershed AI governance moment: if foreign nationals, even inside the United States or inside Anthropic, cannot use a model, release policy and research access start looking like national-security infrastructure." }, // 15:05
    ],
  },
  {
    name: "AI export controls",
    keywords: ["ai export controls", "fable export control", "foreign nationals ai", "model sanctions", "ai national security"],
    picks: [{ youtube_id: "A7BStVZbSoU", t: 905, label: "Fable's export-control sanction becomes a concrete example of AI entering national-security policy. The hosts focus on how impossible compliance could be if foreign-born researchers or foreign nationals on US soil are restricted from model access." }], // 15:05
  },
  {
    name: "AI compute constraints",
    keywords: ["ai compute constraints", "compute shortage", "model compute", "gemini throttling", "frontier lab compute"],
    picks: [{ youtube_id: "-M_5aSgNqow", t: 4205, label: "Compute constraints are treated as a check on runaway AI dominance: even when one lab gets ahead, GPU supply, model-specific infrastructure, and non-fungible compute capacity keep the frontier more competitive than simple leaderboards imply." }], // 1:10:05
  },
  {
    name: "AI moats",
    keywords: ["ai moats", "proprietary data", "ai application moat", "model provider risk", "do you still have a business"],
    picks: [{ youtube_id: "A7BStVZbSoU", t: 2170, label: "The business-moat discussion asks what survives when AI platform providers can recreate application features from usage data. The hosts keep returning to proprietary data, hardware, compute, and energy as the few obvious defensible positions." }], // 36:10
  },
  {
    name: "SpaceX",
    keywords: ["spacex", "spacex ai company", "spacex cursor", "spacex ai infrastructure", "cursor acquisition", "grok second at bat"],
    picks: [{ youtube_id: "A7BStVZbSoU", t: 2425, label: "SpaceX is framed as an AI infrastructure company after Cursor: launch, Starlink, energy, data-center capacity, and developer distribution could combine into a second attempt at competing with OpenAI and Anthropic." }], // 40:25
  },
  {
    name: "Compute in space",
    keywords: ["compute in space", "space data centers", "solar in space", "spacex compute", "terawatt solar"],
    picks: [{ youtube_id: "A7BStVZbSoU", t: 2832, label: "The compute-in-space discussion contrasts Elon's orbital-solar vision with terawatt-scale solar on Earth. The hosts stay bullish on terrestrial solar but acknowledge the civilizational-scale pull of locating compute near the sun's energy." }], // 47:12
  },
  {
    name: "Open USD",
    keywords: ["openusd", "open usd", "ousd", "open usd stablecoin", "corporate stablecoin alliance"],
    picks: [{ youtube_id: "-M_5aSgNqow", t: 4383, label: "Open USD is introduced as a corporate stablecoin alliance led by Stripe with major card networks and fintech brands. The hosts treat it as the most serious coordinated response yet to USDC and Tether." }], // 1:13:03
  },
  {
    name: "Stablecoin revenue sharing",
    keywords: ["stablecoin revenue sharing", "ousd revenue", "treasury yield stablecoin", "stablecoin distribution incentives"],
    picks: [{ youtube_id: "-M_5aSgNqow", t: 4383, label: "OUSD's key business-model difference is revenue sharing: treasury yield is expected to flow to the distribution partners that drive usage, making the stablecoin more incentive-aligned than Tether or the Circle/Coinbase split." }], // 1:13:03
  },
  {
    name: "Google Cloud Universal Ledger",
    keywords: ["google cloud universal ledger", "gcul", "gq", "google stablecoin ledger", "compliant dollar rails", "corporate payment ledger"],
    picks: [{ youtube_id: "-M_5aSgNqow", t: 4550, label: "The Open USD conversation detours into Google's Cloud Universal Ledger as a better fit for regulated dollar rails than a blockchain: efficient, compliant, high-uptime, and explicitly unlike bitcoin." }], // 1:15:50
  },
  {
    name: "Stablecoin interoperability",
    keywords: ["stablecoin interoperability", "stablecoin intranets", "stablecoin bridges", "ousd interoperability", "lightspark stablecoin"],
    picks: [{ youtube_id: "-M_5aSgNqow", t: 4800, label: "The hosts criticize stablecoins as fragmented intranets across Base, Solana, Tron, GQ, and other rails. Lightspark is called out as especially interesting because it can bridge a large dollar asset back toward bitcoin, Lightning, and Spark." }], // 1:20:00
  },
  {
    name: "Tether network effects",
    keywords: ["tether network effects", "tether emerging markets", "usdt africa", "usdt latin america", "ousd vs tether"],
    picks: [{ youtube_id: "-M_5aSgNqow", t: 5000, label: "Even if Open USD wins rich-country transaction volume, the hosts expect Tether to be hard to unseat in Latin America, Africa, and other markets where USDT already has deep liquidity and dollar-access network effects." }], // 1:23:20
  },
  {
    name: "Strategy",
    keywords: ["strategy", "mstr", "microstrategy", "saylor", "strategy reserve"],
    picks: [{ youtube_id: "-M_5aSgNqow", t: 5278, label: "The Strategy update focuses on a selloff across MSTR, STRC, and related securities, followed by policy changes and a renewed dollar reserve meant to reassure investors that dividend obligations can be covered through volatility." }], // 1:27:58
  },
  {
    name: "Strategy capital structure",
    keywords: ["strategy capital structure", "mstr", "strc", "stretch", "strife", "dollar reserve"],
    picks: [{ youtube_id: "-M_5aSgNqow", t: 5278, label: "Strategy's capital structure is discussed through preferred securities trading below par, dividend coverage, and the dollar reserve policy that tries to separate cash obligations from bitcoin price swings." }], // 1:27:58
  },
  {
    name: "Bitcoin forks",
    keywords: ["bitcoin forks", "bitcoin fork", "bitcoin consensus changes", "protocol forks", "soft forks"],
    picks: [{ youtube_id: "A7BStVZbSoU", t: 3056, label: "The fork segment regrounds what people mean by bitcoin forks: consensus changes, competing clients, hard forks, soft forks, and why claims about launching a fork need to be judged by code, adoption, incentives, and user consensus." }], // 50:56
  },
  {
    name: "Consensus change process",
    keywords: ["consensus change process", "bitcoin consensus process", "bitcoin soft fork process", "aj towns", "technical specification"],
    picks: [{ youtube_id: "A7BStVZbSoU", t: 3975, label: "Steve outlines the practical path for a bitcoin consensus change: define the spec, motivate the use case, write code and tests, gather review, and only then work toward user and node adoption." }], // 1:06:15
  },
  {
    name: "BIP 110",
    keywords: ["bip 110", "template hash", "templated bitcoin", "bitcoin templates", "covenant templates"],
    picks: [{ youtube_id: "A7BStVZbSoU", t: 4340, label: "BIP 110 is named among the fork proposals to watch, alongside covenants, Great Consensus Cleanup, drivechains, post-quantum work, and exposed-coin freezing proposals." }], // 1:12:20
  },
  {
    name: "BIP 361",
    keywords: ["bip 361", "freeze satoshi coins", "quantum vulnerable coins", "seize exposed coins", "quantum fork"],
    picks: [{ youtube_id: "A7BStVZbSoU", t: 4340, label: "BIP 361 is described as the proposal to seize or freeze Satoshi's coins and other exposed, quantum-vulnerable coins, making quantum readiness a fork-policy question rather than only a cryptography question." }], // 1:12:20
  },
  {
    name: "Great Consensus Cleanup",
    keywords: ["great consensus cleanup", "consensus cleanup", "bitcoin bug fixes", "soft fork cleanup"],
    picks: [{ youtube_id: "A7BStVZbSoU", t: 4340, label: "Great Consensus Cleanup is grouped with the active fork landscape as a bug-fix-oriented soft fork, distinct from feature-expansion proposals such as covenants or drivechains." }], // 1:12:20
  },
  {
    name: "Drivechain",
    keywords: ["drivechain", "bip 300", "paul sztorc", "bitcoin sidechains", "drive chains"],
    picks: [{ youtube_id: "A7BStVZbSoU", t: 4340, label: "Drivechain and BIP 300 return as long-running fork proposals with a very different flavor from covenant or cleanup work: sidechain-style experimentation tied to Paul Sztorc's decade-plus campaign." }], // 1:12:20
  },
  {
    name: "Post-quantum bitcoin forks",
    keywords: ["post-quantum bitcoin forks", "shrincs", "shrimps", "quantum fork", "post-quantum signatures"],
    picks: [{ youtube_id: "A7BStVZbSoU", t: 4340, label: "Post-quantum signatures such as SHRINCS and SHRIMPS are included in the fork landscape even though exact consensus proposals are still forming. The segment treats quantum migration as inevitable protocol-design work, not only research." }], // 1:12:20
  },
  {
    name: "eCash",
    keywords: ["ecash", "paul sztorc ecash fork", "ecash hard fork", "first bitcoin fork in nine years", "drivechain coin", "fork tax liability"],
    picks: [{ youtube_id: "A7BStVZbSoU", t: 4722, label: "Paul Sztorc's eCash hard fork is treated as the first major fork in years that businesses may have to analyze whether they like it or not, because new coins can create tax, custody, withdrawal, and customer-liability questions." }], // 1:18:42
  },
  {
    name: "Illinois digital asset transfer tax",
    keywords: ["illinois transfer tax", "digital asset transfer tax", "crypto transfer tax", "illinois bitcoin tax", "pritzker crypto tax"],
    picks: [{ youtube_id: "A7BStVZbSoU", t: 5030, label: "The Illinois digital-asset transfer tax sparks a real-time policy check: PBJ works through whether the bill was signed, what a 0.2% transfer tax could mean, and how state-level crypto taxation can collide with ordinary bitcoin movement." }], // 1:23:50
  },
  {
    name: "US sovereign wealth fund",
    keywords: ["us sovereign wealth fund", "sovereign wealth fund ai", "government equity ai companies", "intel government stake", "ai company equity"],
    picks: [{ youtube_id: "A7BStVZbSoU", t: 5295, label: "The sovereign-wealth-fund discussion asks whether the United States should own equity in AI companies, with Intel's government stake, Bernie Sanders's AI tax ideas, and a rapidly shifting Overton window as context." }], // 1:28:15
  },
  {
    name: "Open Name Tags",
    keywords: [
      "open name tags", "self-sovereign names", "global name system", "agent names", "bitcoin names",
      "name data availability", "data availability", "resolver data", "publisher resolver", "name system data",
      "merkle batching", "merkle batch", "merkle root names", "off-chain name data", "bitcoin name batching",
      "name auctions", "bitcoin name auction", "hidden name auction", "open name tags auction", "l1 bond names",
      "peer-to-peer name resolvers", "resolver gossip", "name gossip protocol", "bitcoin-like name network", "resolver network",
      "on-chain names", "inscribed names", "bitcoin name registrations", "names on bitcoin", "name blockspace",
      "name system blockchain", "global namespace blockchain", "custom blockchain names", "bitcoin-level security names", "civilizational namespace",
    ],
    picks: [
      { youtube_id: "69uez6D9sTQ", t: 3277, label: "Open Name Tags is explained as a user-controlled name system for mapping a human-readable name to payment handles, websites, social identities, or other key-value data. The hard problem is data availability: if publishers Merkle-batch name data instead of storing every value on bitcoin, new resolvers need a credible way to obtain and verify the off-chain data later." }, // 54:37
    ],
  },
]);

// 2026-07-16 Builder: The Local AI Stack (0xSero).
addTopicDefs([
  {
    name: "Exo Labs",
    keywords: ["exo labs", "exolabs", "exo run", "vllm", "ollama", "hermes", "local inference engine"],
    picks: [{ youtube_id: "uGv-wH4UYkg", t: 565, label: "0xSero introduces Exo Labs' local-AI tooling as an easier path to faster vLLM inference: exo run pulls the engine and model, then launches it in agent interfaces such as Hermes. The goal is an Ollama-like experience without giving up higher-performance serving or agent workflows." }], // 9:25
  },
  {
    name: "Local model benchmarking",
    keywords: ["local model benchmarking", "local ai benchmarks", "model hardware matching", "vram requirements", "price performance", "quantization benchmark", "terminal-bench 2.0", "swe-bench pro", "tau-bench", "gaia", "gdpval", "reproducible ai benchmarks", "quantization quality loss"],
    picks: [
      { youtube_id: "uGv-wH4UYkg", t: 683, label: "Exo Labs is building an objective guide from budget and hardware to the models, memory needs, speed, and task performance a user can expect. The segment explains why local-model selection is hard: model size, quantization, memory, reasoning behavior, and workload all interact." }, // 11:23
      { youtube_id: "uGv-wH4UYkg", t: 887, label: "The methodology combines Terminal-Bench 2.0, SWE-Bench Pro, tau-bench, GAIA, and GDPval across model quantizations, then reports accuracy alongside task time, thinking tokens, and memory. The suite is open and independently reproducible, but B200 and B300 rental costs make broad verification expensive." }, // 14:47
    ],
  },
  {
    name: "Mixture-of-experts models",
    keywords: ["mixture of experts", "moe", "active parameters", "total parameters", "expert routing", "kimi", "qwen", "vram"],
    picks: [{ youtube_id: "uGv-wH4UYkg", t: 1228, label: "Using Kimi and Qwen as examples, 0xSero distinguishes total parameters, which determine how much fast memory the weights need, from active parameters used for each token. Mixture-of-experts models can offer similar per-token compute while a larger expert pool provides broader specialization, at the cost of enormous memory footprints." }], // 20:28
  },
  {
    name: "LLM compression",
    keywords: ["llm compression", "model quantization", "ternary llm", "1.6-bit model", "expert pruning", "calibration data", "saliency map", "mixed precision", "reap"],
    picks: [{ youtube_id: "uGv-wH4UYkg", t: 1843, label: "0xSero explains three routes to smaller models: low-bit or ternary training, post-training quantization, and pruning low-salience experts from mixture-of-experts models using calibration data. Selectively preserving important weights while compressing or removing the rest can, in his account, reduce a model toward roughly 20% of its original size while keeping useful performance." }], // 30:43
  },
  {
    name: "Continuous model learning",
    keywords: ["continuous model learning", "local model retraining", "synthetic data loop", "personal model training", "overnight fine-tuning", "truffles", "thor"],
    picks: [{ youtube_id: "uGv-wH4UYkg", t: 2385, label: "0xSero describes Truffles' proposed local loop: continually process a user's data, generate synthetic examples, and retrain model weights overnight on a Thor-class machine. He is explicit that the loop exists but its practical value is still uncertain, making this a useful boundary between feasible engineering and unproven personalization." }], // 39:45
  },
  {
    name: "Local AI models",
    keywords: ["local ai automation", "local vision model", "receipt ocr", "structured extraction", "gemma", "small local models", "glm 4.7 flash", "tool calling", "external retrieval", "model size tradeoffs", "long context"],
    picks: [
      { youtube_id: "uGv-wH4UYkg", t: 0, label: "0xSero opens with a local vision model turning a photo of a crumpled receipt into structured spreadsheet rows. The demo grounds local AI in practical automation rather than abstract model benchmarks." }, // 0:00
      { youtube_id: "uGv-wH4UYkg", t: 2209, label: "GLM 4.7 Flash is offered as an example of a small model optimized for long tool-use loops: it can search and act effectively despite limited memorized world knowledge. The tradeoff is that smaller models still struggle with long context, rich concepts, and project-scale reasoning that larger models represent more faithfully." }, // 36:49
    ],
  },
  {
    name: "AI subscription lock-in",
    keywords: ["cloud inference cost", "ai subscription pricing", "api inference cost", "subsidized inference", "cursor pricing"],
    picks: [{ youtube_id: "uGv-wH4UYkg", t: 44, label: "0xSero traces his move toward local inference to rising Cursor and cloud-model costs, contrasting flat subscription fees with 14 billion tokens of usage that would cost far more at API rates. His point is that power users cannot assume subsidized cloud inference will remain cheap or available." }], // 0:44
  },
  {
    name: "AI export controls",
    keywords: ["frontier model access", "civilian ai access", "capability restrictions", "fable", "mythos"],
    picks: [{ youtube_id: "uGv-wH4UYkg", t: 250, label: "Starting from scaling laws and the reported Fable and Mythos capability jump, 0xSero argues that ever-larger models will attract national-security restrictions and that civilians may lose access to the most capable systems. Local ownership becomes an access hedge, not only a cost optimization." }], // 4:10
  },
  {
    name: "Agent harnesses",
    keywords: ["droid harness", "local agent harness", "local coding agents", "file organization", "background automation"],
    picks: [{ youtube_id: "uGv-wH4UYkg", t: 334, label: "Two local models run side by side in the Droid harness to code, analyze data, and organize a downloads folder in the background. The demo shows a harness turning open and local inference into usable autonomous workflows." }], // 5:34
  },
  {
    name: "Localmaxxing",
    keywords: ["local ai independence", "local inference economics", "local ai privacy", "learn the ai stack"],
    picks: [{ youtube_id: "uGv-wH4UYkg", t: 402, label: "0xSero's case for local AI rests on three benefits: eventually lower cost, privacy for sensitive context, and hands-on learning for an AI-shaped labor market. He acknowledges local inference is currently more expensive, keeping the cost claim grounded as a future direction." }], // 6:42
  },
  {
    name: "AI privacy",
    keywords: ["ai profiling", "social graph surveillance", "grok privacy", "medical data ai", "behavioral targeting"],
    picks: [{ youtube_id: "uGv-wH4UYkg", t: 430, label: "0xSero warns that models connected to social graphs can infer identity, location, routines, relationships, and interests, then combines that with the sensitivity of medical and personal prompts. The segment frames local inference as protection against future profiling, targeting, and data reuse." }], // 7:10
  },
  {
    name: "AI compute efficiency",
    keywords: ["reasoning token overhead", "thinking tokens", "inference latency", "reasoning mode", "token efficiency"],
    picks: [{ youtube_id: "uGv-wH4UYkg", t: 746, label: "A Qwen benchmark run spends far more tokens on internal reasoning than on answer and tool output, which 0xSero argues often adds latency without helping local workloads. He recommends evaluating thinking-token overhead, not just benchmark accuracy, when choosing a local model." }], // 12:26
  },
  {
    name: "Open-source AI models",
    keywords: ["qwen 27b", "qwen local model", "claude sonnet 4", "consumer hardware ai", "dense model latency"],
    picks: [{ youtube_id: "uGv-wH4UYkg", t: 803, label: "0xSero presents the Qwen 27B model shown in the talk as a consumer-runnable open model whose benchmark aggregate exceeds the year-old Claude Sonnet 4 result, while warning that dense models can still be slow. The comparison illustrates how quickly open models are improving without pretending benchmark score erases deployment tradeoffs." }], // 13:23
  },
  {
    name: "Local AI hardware",
    keywords: ["m3 ultra", "m5 max", "dgx spark", "rtx 3090", "rtx pro 6000", "unified memory", "vram per dollar", "hugging face hardware"],
    picks: [{ youtube_id: "uGv-wH4UYkg", t: 1305, label: "0xSero compares realistic local-AI hardware paths: Apple unified-memory systems, Huawei Atlas, Ryzen AI and Framework, stacked RTX 3090s, RTX Pro 6000, and DGX Spark. He weighs memory per dollar and Nvidia software support against speed, scale, heat, noise, and clustering complexity, then points to Hugging Face's hardware filter as a practical fit check." }], // 21:45
  },
  {
    name: "AI model risk",
    keywords: ["model weaponization", "autonomous hacking", "cyber weapon", "biological risk", "ai misuse", "persistent agents"],
    picks: [{ youtube_id: "uGv-wH4UYkg", t: 1653, label: "0xSero argues that even consumer-accessible models can be weaponized through continuous hacking, targeted harassment, personal-data discovery, or biological misuse. He uses those concrete abuse paths to explain why labs and governments may treat frontier capability as a security problem." }], // 27:33
  },
  {
    name: "AI compute constraints",
    keywords: ["local ai cost floor", "gpu supply constraints", "rtx 6000", "high-end local inference", "chip manufacturing", "compute affordability"],
    picks: [{ youtube_id: "uGv-wH4UYkg", t: 2436, label: "For truly frontier-like local intelligence, 0xSero estimates users may need $40,000–$50,000 of compute and argues that chip-fabrication complexity, materials, global supply chains, and unmet demand create a hardware cost floor. The closing point is that local AI will improve, but high-end capability may not become arbitrarily cheap." }], // 40:36
  },
]);

// 2026-07-18 PBJ: Kimi K3, AI treasure hunting, and bitcoin versus gold.
addTopicDefs([
  {
    name: "AI music production",
    keywords: ["music generation", "suno", "ai music ip", "artist style prompting"],
    picks: [{ youtube_id: "WisO6hoeUb8", t: 108, label: "Max says current music models still produce only roughly seven-out-of-ten results for the beats he wants, and that prompting often means translating an artist's style into traits such as rhythm, pauses, and BPM. He sees open models as a path toward freer musical experimentation without a platform's IP guardrails." }], // 1:48
  },
  {
    name: "Latent-space creativity",
    keywords: ["latent space", "kevin kelly", "brian eno", "generative creativity", "creative exploration", "human taste", "ai art", "multidimensional model space"],
    picks: [{ youtube_id: "WisO6hoeUb8", t: 207, label: "Kevin Kelly's latent-space essay becomes a model for future creativity: generative models compress patterns into vast multidimensional spaces that artists and researchers can explore by choosing which conceptual dials to turn. Max argues that better models expand the territory while human taste and intention still choose where to go." }], // 3:27
  },
  {
    name: "AI-assisted archaeology",
    keywords: ["ai archaeology", "ancient civilizations", "lidar archaeology", "lost cities", "satellite archaeology", "archaeological discovery", "ancient text translation", "göbekli tepe", "maya", "amazon cities"],
    picks: [{ youtube_id: "WisO6hoeUb8", t: 925, label: "New LiDAR and mapping discoveries suggest how incomplete the accepted picture of ancient civilization remains. Max proposes using AI to plan searches, translate sources, combine maps and remote-sensing data, and identify promising locations for archaeological discovery." }], // 15:25
  },
  {
    name: "AI treasure hunting",
    keywords: ["ai treasure hunting", "there's treasure inside", "john collins-black", "forrest fenn", "treasure puzzle", "word search", "cryptogram", "casascius coin", "strava heatmap", "satellite view"],
    picks: [{ youtube_id: "WisO6hoeUb8", t: 1295, label: "DK uses frontier models to investigate the five-box treasure hunt in There's Treasure Inside, testing puzzle theories that would be prohibitively slow by hand. He combines word searches and cryptograms with Strava heatmaps, topography, user photos, satellite imagery, and Street View to narrow real-world candidate locations." }], // 21:35
  },
  {
    name: "Buzz",
    keywords: ["buzz research workspace", "shared research channel", "bitcoin-funded agents", "collaborative atlantis research"],
    picks: [{ youtube_id: "WisO6hoeUb8", t: 1989, label: "Buzz is proposed as a workspace for collaborative Atlantis research: create a channel, connect an LLM as an agent, invite interested people, and let everyone investigate hypotheses in one shared context. The channel can set budgets and use bitcoin payments to fund costly agent calls or research tasks." }], // 33:09
  },
  {
    name: "Multi-agent workflows",
    keywords: ["shared agents", "collaborative agents", "multi-human agent workflow", "shared agent context", "agent budgets"],
    picks: [{ youtube_id: "WisO6hoeUb8", t: 2022, label: "A Buzz research channel is used to make multi-agent work concrete: multiple humans can prompt shared agents, coordinate hypotheses, retain common context, and allocate budgets from the same place. DK argues that experiencing agents and people together is necessary to understand how different this is from a single-user chatbot." }], // 33:42
  },
  {
    name: "Nostr music",
    keywords: ["groove", "music discovery", "open music models", "collaborative remixing", "nostr music community"],
    picks: [{ youtube_id: "WisO6hoeUb8", t: 2109, label: "The hosts connect Nostr music communities such as Groove with the old discovery culture of invite-only music-piracy communities. Permissionless networks and open models could support collaborative music discovery, generation, and remixing that closed model providers are unlikely to allow." }], // 35:09
  },
  {
    name: "AI and cryptography",
    keywords: ["kryptos k4", "cryptographic puzzle", "codex subagents", "parallel puzzle solving", "agent scale"],
    picks: [{ youtube_id: "WisO6hoeUb8", t: 2229, label: "Kryptos K4 tests whether agent scale alone can crack a decades-old cryptographic puzzle. Matt reports that Codex spun up roughly 150 subagents over three to five days and still failed, showing that more parallel model effort does not automatically produce the missing insight." }], // 37:09
  },
  {
    name: "AI singularity",
    keywords: ["recursive self-improvement", "intelligence allocation", "ai puzzle solving", "present-day human purpose"],
    picks: [{ youtube_id: "WisO6hoeUb8", t: 2371, label: "The treasure and Kryptos experiments lead into the singularity tradeoff: spend intelligence solving human puzzles now, or spend it recursively improving the next generation of models. The hosts answer the existential uncertainty partly with a practical ethic—do worthwhile work with people you value in the present." }], // 39:31
  },
  {
    name: "AI compute constraints",
    keywords: ["recursive improvement constraints", "ai energy bottleneck", "physical ai limits", "scarce compute inputs"],
    picks: [{ youtube_id: "WisO6hoeUb8", t: 2462, label: "DK argues that runaway recursive improvement still meets physical bottlenecks, with compute and energy looking more binding than software in the near term. Even if those constraints ease, he expects another scarce input to become the next limiter." }], // 41:02
  },
  {
    name: "Project Loupe",
    keywords: ["loupe pilot", "ai security scans", "loupe expansion", "audit eligibility", "security policy", "independent public good", "harm reduction", "vulnerability scanning policy", "public-good security", "project adoption", "security subsidy", "project loupe scope", "ai security scanner", "bitcoin knots", "token projects", "which projects deserve audits", "loupe audit decisions"],
    picks: [
      { youtube_id: "WisO6hoeUb8", t: 2551, label: "Project Loupe's first phase is described as unusually high leverage: all eight participating projects found the AI security scans useful, the work uncovered vulnerabilities and bugs, and Bitcoin Core reportedly rated the results five out of five. That success moves Loupe from a pilot into an expansion decision." }, // 42:31
      { youtube_id: "WisO6hoeUb8", t: 2627, label: "Loupe's expansion raises a scope question: anyone can run the open-source scanner with their own models and tokens, but Spiral cannot subsidize every project's compute and human support. The hosts test possible boundaries across public goods, startups, well-funded companies, and token projects." }, // 43:47
      { youtube_id: "WisO6hoeUb8", t: 2888, label: "One proposed audit rule prioritizes potential user harm rather than the curators' taste: even a disliked product may deserve a scan if a vulnerability could wipe out many users. The counterweights are adoption, public-good value, project ethics, available funding, and the cost of ongoing support." }, // 48:08
      { youtube_id: "WisO6hoeUb8", t: 3823, label: "The hosts distinguish a mechanical eligibility checklist from a human taste layer. Loupe needs a stated policy so similar projects receive defensible treatment, but it also needs accountable human judgment for edge cases that no advance rule can encode perfectly." }, // 1:03:43
    ],
  },
  {
    name: "Bitcoin client diversity",
    keywords: ["knots", "libbitcoin", "btcd", "alternative bitcoin implementations", "economic node share", "client audit"],
    picks: [{ youtube_id: "WisO6hoeUb8", t: 2960, label: "Loupe's selection problem reaches alternative bitcoin implementations such as Knots, libbitcoin, and btcd. They have little economic-node share but remain open-source implementations, forcing a distinction between supporting client diversity and spending scarce audit capacity where current users face the most risk." }], // 49:20
  },
  {
    name: "Open-source funding",
    keywords: ["sliding contribution", "security audit funding", "public goods subsidy", "company matching", "skin in the game"],
    picks: [{ youtube_id: "WisO6hoeUb8", t: 3319, label: "For companies, the hosts consider a sliding contribution policy rather than a binary yes or no: underfunded startups and public goods could receive larger subsidies, while well-funded firms should pay or sponsor the work. Even a symbolic match can show that a project or its community values the audit and has skin in the game." }], // 55:19
  },
  {
    name: "Spiral",
    keywords: ["loupe independence", "independent public good", "spiral continuity", "public-good institution"],
    picks: [{ youtube_id: "WisO6hoeUb8", t: 4001, label: "Although Loupe currently sits inside Spiral, Steve wants it to become an independent public good with its own contributors, reputation, and continuity. The goal is for Loupe to survive even if Spiral eventually disappears." }], // 1:06:41
  },
  {
    name: "Stripe–PayPal acquisition",
    keywords: ["stripe paypal acquisition", "stripe bid for paypal", "paypal acquisition", "payments consolidation", "paypal users", "stripe distribution"],
    picks: [{ youtube_id: "WisO6hoeUb8", t: 4100, label: "The hosts discuss a reported roughly $53 billion Stripe bid for PayPal as a way to acquire about 400 million users, including substantial international reach. They argue Stripe need not merge every product or culture immediately; buying distribution and leaving much of the business intact could be enough." }], // 1:08:20
  },
  {
    name: "Stripe Tempo",
    keywords: ["paypal tempo", "paypal stablecoin integration", "open usd migration", "stripe payment rails"],
    picks: [{ youtube_id: "WisO6hoeUb8", t: 4135, label: "The clearest expected product integration is payments infrastructure: the hosts predict PayPal's stablecoin effort would converge toward Stripe's Open USD and Tempo stack. Beyond that rail migration, they see little need to force two different technology organizations into a deep integration." }], // 1:08:55
  },
  {
    name: "Bitcoin vs. gold",
    keywords: ["bitcoin priced in gold", "btc gold ratio", "bitcoin underperformance", "gold denominator", "bitcoin fell further behind gold", "falling behind gold", "roughly half of last year", "half its earlier level"],
    picks: [{ youtube_id: "WisO6hoeUb8", t: 4196, label: "Steve revisits bitcoin priced in gold rather than nominal dollars and finds the ratio dramatically worse than a year earlier—roughly halved, and at one point closer to one-third of the prior level. He argues bitcoiners should track this comparison alongside the unadjusted dollar price rather than selecting only the most flattering denominator." }], // 1:09:56
  },
  {
    name: "China gold accumulation",
    keywords: ["china gold purchases", "shanghai gold futures", "de-dollarization", "china treasuries", "physical gold", "paper gold suppression"],
    picks: [{ youtube_id: "WisO6hoeUb8", t: 4365, label: "China's heavy gold purchases and a reported halt in Shanghai gold-futures trading are discussed as part of a longer move away from dollars and Treasuries. Max presents the idea that paper futures suppress physical gold as a speculative interpretation, not an established conclusion, while noting China's parallel bets on advanced technology and ancient reserve assets." }], // 1:12:45
  },
  {
    name: "Nation-state bitcoin custody",
    keywords: ["sovereign bitcoin allocation", "state bitcoin operations", "gold custody infrastructure", "government bitcoin adoption"],
    picks: [{ youtube_id: "WisO6hoeUb8", t: 4473, label: "Gold still has an institutional advantage because states know how to custody, value, and administer it and trust its millennia-long history; bitcoin lacks the same sovereign operating experience. The hosts nevertheless argue that even a shift from zero to a one-percent bitcoin allocation would be enormously consequential." }], // 1:14:33
  },
  {
    name: "Kimi K3",
    keywords: ["kimi k3", "kimi model", "open-weight race", "chinese open model", "frontier open model", "k3 weights"],
    picks: [{ youtube_id: "WisO6hoeUb8", t: 4551, label: "Kimi K3 is presented as a potentially frontier-competitive Chinese model whose promised open weights could make it one of the most important AI releases in years. The hosts reserve judgment pending hands-on use, but treat its apparent proximity to leading closed models as the key signal." }], // 1:15:51
  },
  {
    name: "Open-source AI models",
    keywords: ["open weights", "open-source definition", "sovereign model", "kimi k3", "self-hosted ai", "controlled gpu", "h200", "open-model economics", "frontier lab margins"],
    picks: [
      { youtube_id: "WisO6hoeUb8", t: 4598, label: "The Kimi discussion separates 'open source' branding from usable open weights: without weights, users cannot independently run the model and remain dependent on someone else's compute environment. Sovereign operation, not merely published code or training details, is the practical threshold the hosts care about." }, // 1:16:38
      { youtube_id: "WisO6hoeUb8", t: 4719, label: "A frontier-quality open-weight model would not necessarily run on a home Mac, but it could run on controlled rented hardware such as an H200. If users pay only for chips, electricity, and compute rather than a proprietary model margin, the economics of frontier labs could change substantially." }, // 1:18:39
    ],
  },
  {
    name: "AI model benchmarks",
    keywords: ["ai benchmarks", "artificial analysis", "benchmark gaming", "model evaluation", "model capability", "token cost", "inference speed", "first-party testing"],
    picks: [{ youtube_id: "WisO6hoeUb8", t: 4787, label: "The hosts warn that model benchmarks are gameable and should be treated as directional evidence behind trusted first-hand use. They like Artificial Analysis as one useful reference and stress that capability, token cost, and speed are separate dimensions—Kimi may rank highly on quality while remaining too slow for some workloads." }], // 1:19:47
  },
  {
    name: "U.S.–China AI race",
    keywords: ["us china ai race", "ai geopolitics", "chinese open models", "frontier lab financing", "ai compute buildout", "chip export controls", "model distillation", "ai ipos"],
    picks: [{ youtube_id: "WisO6hoeUb8", t: 4889, label: "The hosts consider whether China's strong open models are a geopolitical tactic as well as a technical achievement: commoditizing near-frontier capability could compress U.S. lab margins and make America's compute buildout harder to finance. They also note that distillation keeps Chinese models dependent on a prior frontier answer even as the capability gap narrows." }], // 1:21:29
  },
  {
    name: "AI governance",
    keywords: ["ai 2027", "ai regulation", "frontier lab regulation", "ai slowdown", "regulatory capture", "ai safety policy"],
    picks: [{ youtube_id: "WisO6hoeUb8", t: 5055, label: "The new AI 2027 argument for regulation is treated with both urgency and suspicion. The hosts worry about real acceleration risk, regulatory capture by frontier labs, and the geopolitical problem that a unilateral U.S. slowdown could simply hand advantage to China." }], // 1:24:15
  },
  {
    name: "Thinking Machines",
    keywords: ["thinking machines", "american open-weight model", "western open model", "open-weight ai", "chinese model dependence", "frontier ai lab"],
    picks: [{ youtube_id: "WisO6hoeUb8", t: 5147, label: "Thinking Machines' new release is framed as the strongest American open-weight alternative the hosts have seen, offering a possible counterweight to dependence on Chinese models. They are cautiously hopeful that a credible U.S. lab can sustain an open-model strategy even after other American companies moved toward closed systems." }], // 1:25:47
  },
]);

// 2026-08-07 PBJ: Bitcoin security after COLDCARD, PB Media Archive launch, and the Type II Summit.
addTopicDefs([
  {
    name: "Panthalassa",
    keywords: ["panthalassa", "offshore compute", "data centers at sea", "ocean data centers", "floating compute"],
    picks: [{ youtube_id: "QW0Lo2T4pRc", t: 905, label: "Panthalassa is presented as an offshore-compute alternative to grid expansion and space: putting data centers at sea could use abundant cooling and fewer siting constraints, though the conversation treats regulatory freedom and operational feasibility as unresolved tradeoffs." }], // 15:05
  },
  {
    name: "PB Media Archive",
    keywords: ["pb media archive", "pbarchive.ai", "podcast archive search", "timestamped podcast search", "presidio bitcoin archive"],
    picks: [{ youtube_id: "QW0Lo2T4pRc", t: 1050, label: "The PB Media Archive turns Presidio Bitcoin’s timestamped catalogue into an AI-queryable source that returns summaries, episodes, and timestamp links. The hosts see transparent retrieval as useful for research, accountability, and potentially making podcast content more visible to AI systems." }], // 17:30
  },
  {
    name: "COLDCARD hack",
    keywords: ["coldcard hack", "coldcard security incident", "coinkite vulnerability", "post-coldcard security", "coldcard response"],
    picks: [{ youtube_id: "QW0Lo2T4pRc", t: 3990, label: "The COLDCARD hack is treated as a catalyst for Bitcoin’s security response: it has exposed how AI changes the practical threat model while rallying independent researchers, wallet makers, and developers around continuous vulnerability discovery and mitigation." }], // 1:06:30
  },
  {
    name: "BTCPay Server exploit",
    keywords: ["btcpay server exploit", "btcpay drain", "lightning payment drain", "btcpay security incident", "live bitcoin exploit"],
    picks: [{ youtube_id: "QW0Lo2T4pRc", t: 2095, label: "During the livestream, reports of a BTCPay Server drain prompt a cautious discussion of an unfolding Lightning-payment exploit. With its scope still unknown, the event reinforces that payment infrastructure can be attacked in real time and requires continuous incident assessment." }], // 34:55
  },
  {
    name: "Project Loupe",
    keywords: ["project loupe", "ai security audit workflow", "ai vulnerability scans", "bitcoin code audits", "human vulnerability triage"],
    picks: [{ youtube_id: "QW0Lo2T4pRc", t: 3220, label: "Project Loupe’s practitioners describe AI auditing as a repeated, human-guided process rather than a one-time scan. Prompting, agent harnesses, model selection, and nondeterministic results all affect findings, so parallel independent efforts strengthen the Bitcoin ecosystem." }], // 53:40
  },
  {
    name: "AI security scanning",
    keywords: ["ai security scanning", "ai vulnerability scanning", "agent harness security", "nondeterministic security scans", "prompted code audit"],
    picks: [{ youtube_id: "QW0Lo2T4pRc", t: 2210, label: "AI security scanning is portrayed as an ongoing defensive discipline, not a completed checkbox: prompts, agent harnesses, model choice, and repeated runs change results. Teams must assume vulnerabilities exist and continually improve human-guided detection before attackers exploit them." }], // 36:50
  },
  {
    name: "Binary reverse engineering",
    keywords: ["binary reverse engineering", "ai binary analysis", "closed-source security", "reverse engineer binaries", "source code secrecy"],
    picks: [{ youtube_id: "QW0Lo2T4pRc", t: 2480, label: "Closed source provides only temporary concealment: models can analyze binaries and reverse engineer systems without original source code. The hosts argue custodians and other high-value targets therefore need urgent defensive scanning, because obscurity no longer keeps vulnerabilities hidden." }], // 41:20
  },
  {
    name: "Bitcoin Red Team",
    keywords: ["bitcoin red team", "community funded ai audits", "open-source security scanning", "bitcoin security ecosystem", "rob callie security"],
    picks: [{ youtube_id: "QW0Lo2T4pRc", t: 3990, label: "Bitcoin Red Team emerged after the COLDCARD incident as an independent, community-funded effort to scan many open-source projects with AI. Its different model-access and communication approach complements Project Loupe; diversity of security methods and institutions reduces single-point dependence." }], // 1:06:30
  },
  {
    name: "Offline entropy generation",
    keywords: ["offline entropy generation", "dice roll entropy", "diy wallet entropy", "dice-generated seed", "manual seed generation"],
    picks: [{ youtube_id: "QW0Lo2T4pRc", t: 4380, label: "DIY dice entropy can protect a wallet only when users correctly generate and enter genuinely random rolls. A reported user who entered six repeatedly created a predictable key, illustrating why intricate self-custody procedures become dangerous human-error traps." }], // 1:13:00
  },
  {
    name: "Custody diversification",
    keywords: ["custody diversification", "diversified entropy", "split custody risk", "independent bitcoin secrets", "single point of failure custody"],
    picks: [{ youtube_id: "QW0Lo2T4pRc", t: 4710, label: "Entropy should be diversified alongside custody: combine product-generated secrets with independently supplied randomness so either can fail without losing funds. This preserves advanced self-sovereignty for capable users while avoiding a single product—or a user mistake—as the sole security boundary." }], // 1:18:30
  },
  {
    name: "Responsible disclosure",
    keywords: ["responsible disclosure", "ai era disclosure", "90 day disclosure", "private vulnerability reporting", "security update coordination"],
    picks: [{ youtube_id: "QW0Lo2T4pRc", t: 5304, label: "In the AI era, responsible disclosure must be faster than the traditional 90-day norm but cannot be immediate public disclosure. Private reporting gives teams time to assess, fix, and safely distribute updates; premature publicity can drive users toward harmful decisions." }], // 1:28:24
  },
  {
    name: "White-hat recovery",
    keywords: ["white-hat recovery", "white-hat bitcoin hacking", "stolen bitcoin recovery", "bitcoin property rights", "vulnerable wallet rescue"],
    picks: [{ youtube_id: "QW0Lo2T4pRc", t: 6170, label: "White-hat recovery of vulnerable coins creates a property-rights dilemma: a rescuer may beat criminals yet prevent an owner from moving funds and lack a reliable return process. The hosts argue good intentions do not settle ownership, restitution, or timing risks." }], // 1:42:50
  },
  {
    name: "Multi-vendor wallet protocol",
    keywords: ["multi-vendor wallet protocol", "neutral multisig protocol", "spiral wallet protocol", "bitkey interoperability", "multi-vendor signing"],
    picks: [{ youtube_id: "QW0Lo2T4pRc", t: 6890, label: "Spiral is considering a neutral, open protocol for multi-vendor multisignature wallets, informed by Bitkey but not controlled by it. Generalizing the design beyond one tightly coupled product could diversify signing risk, though it demands fresh security and privacy engineering." }], // 1:54:50
  },
]);

// 2026-08-01 PBJ: The COLDCARD hack and future of self-custody.
addTopicDefs([
  {
    name: "COLDCARD hack",
    keywords: ["coldcard hack", "coldcard vulnerability", "coinkite security incident", "coldcard mk2", "coldcard mk3", "coldcard mk4", "coldcard q"],
    picks: [{ youtube_id: "cSXOmwI38Jo", t: 270, label: "Independent researchers linked more than 1,000 BTC in thefts to a recognizable on-chain pattern among COLDCARD users. MK2 and MK3 keys were described as cheaply recoverable, while newer models faced a costlier but still material exposure." }], // 4:30
  },
  {
    name: "Wallet entropy",
    keywords: ["wallet entropy", "coldcard rng", "predictable rng fallback", "weak key generation", "hardware random number generator", "deterministic bitcoin keys"],
    picks: [{ youtube_id: "cSXOmwI38Jo", t: 424, label: "A production build bypassed COLDCARD's hardware random-number generator and fell back to predictable inputs such as timers and device IDs. The tractable search space let attackers reconstruct private keys without touching the device or learning its seed phrase." }], // 7:04
  },
  {
    name: "Offline entropy generation",
    keywords: ["offline entropy generation", "dice roll seed", "dice-generated seed phrase", "user supplied entropy", "coin flip entropy", "air-gapped seed generation"],
    picks: [{ youtube_id: "cSXOmwI38Jo", t: 837, label: "Properly executed dice rolls can add enough independent randomness to protect even an affected device, but the procedure is unforgiving: users must preserve roll order, avoid biased handling, work offline, and generate enough bits rather than improvise memorable inputs." }], // 13:57
  },
  {
    name: "BIP39 passphrases",
    keywords: ["bip39 passphrase", "bip 39 passphrase", "25th word", "13th word", "wallet passphrase entropy", "strong bitcoin passphrase"],
    picks: [{ youtube_id: "cSXOmwI38Jo", t: 1367, label: "A strong BIP39 passphrase can supply an independent security layer even when the underlying seed has weak entropy, but it behaves like an unrestricted password rather than another dictionary seed word; short, predictable strings provide little protection." }], // 22:47
  },
  {
    name: "Custody diversification",
    keywords: ["custody diversification", "split bitcoin custody", "independent custody setups", "uncorrelated custody risk", "multiple custody methods"],
    picks: [{ youtube_id: "cSXOmwI38Jo", t: 2075, label: "The episode's durable recommendation is to split holdings across genuinely independent custody setups—for example, self-custody and a custodian, or hardware and software from different vendors—so one implementation failure cannot remove someone from Bitcoin entirely." }], // 34:35
  },
  {
    name: "Open-source software licensing",
    keywords: ["open-source software licensing", "source available firmware", "permissive software license", "coldcard license change", "published source", "firmware licensing"],
    picks: [{ youtube_id: "cSXOmwI38Jo", t: 2261, label: "COLDCARD's move from permissively licensed firmware to source-available code required a substantial rewrite around 2021, when the vulnerable path was introduced. The discussion distinguishes code that can be inspected from software competitors can freely reuse and improve." }], // 37:41
  },
  {
    name: "Project Loupe",
    keywords: ["project loupe coldcard", "continuous bitcoin code audit", "source available security scan", "bitcoin firmware audit"],
    picks: [{ youtube_id: "cSXOmwI38Jo", t: 2507, label: "Project Loupe can scan source-available Bitcoin repositories with frontier models, but only when code is accessible and maintainers engage with the findings. Its move from an eight-project pilot to recurring scans frames security auditing as an ongoing public good." }], // 41:47
  },
  {
    name: "AI security scanning",
    keywords: ["continuous ai security audit", "frontier model code audit", "coldcard ai audit", "recurring vulnerability scan", "ai vulnerability triage"],
    picks: [{ youtube_id: "cSXOmwI38Jo", t: 2849, label: "Earlier model audits reportedly missed the bug; after disclosure, a stronger model reproduced it in under two hours. Security-critical code needs renewed scans as models improve, while knowledgeable humans still must triage noisy findings and misclassified severity." }], // 47:29
  },
  {
    name: "Wallet ownership proofs",
    keywords: ["wallet ownership proof", "prove stolen bitcoin ownership", "coldcard uid", "signed purchase email", "exchange withdrawal evidence", "on-chain ownership history"],
    picks: [{ youtube_id: "cSXOmwI38Jo", t: 3791, label: "Once an attacker can derive the same private key, a signature cannot distinguish victim from thief. Proposed ownership evidence instead combines device UIDs, cryptographically signed purchase emails, exchange withdrawal records, and on-chain transaction history." }], // 1:03:11
  },
  {
    name: "Multisig",
    keywords: ["multisig", "multi-vendor multisig", "hardware wallet diversity", "two of three bitcoin", "three of five bitcoin", "independent signing devices"],
    picks: [{ youtube_id: "cSXOmwI38Jo", t: 4936, label: "Multisig remains resilient only when its keys span different hardware, firmware, and vendors. A two-of-three or three-of-five setup can tolerate one compromised signer, while a bundle of identical COLDCARD devices repeats the same failure across every key." }], // 1:22:16
  },
  {
    name: "Bitkey",
    keywords: ["bitkey key generation", "bitkey two of three", "bitkey server key", "bitkey reproducible build", "bitkey security model"],
    picks: [{ youtube_id: "cSXOmwI38Jo", t: 5100, label: "Bitkey reduces user-error risk with default two-of-three signing across a phone, hardware device, and Block server, each using a different stack. The trade-off is single-vendor coordination and limited independent verification of server-side and component-level key generation." }], // 1:25:00
  },
]);

// 2026-07-28 21 in 21: 0xSero on local AI, open models, and benchmarking.
addTopicDefs([
  {
    name: "AI subscription lock-in",
    keywords: ["cursor pricing change", "subsidized ai usage", "local ai economics"],
    picks: [{ youtube_id: "ziJy4PuxBhc", t: 119, label: "0xSero traces his turn to local AI to Cursor's pricing change, which exposed how a workflow subsidized at $20 a month could represent at least $5,000 in usage and become unaffordable as soon as the provider changed terms." }], // 1:59
  },
  {
    name: "Model provider lock-in",
    keywords: ["model ownership", "cloud model withdrawal", "model service changes"],
    picks: [{ youtube_id: "ziJy4PuxBhc", t: 156, label: "Beyond cost, 0xSero argues that owning the model matters because a cloud provider can silently vary service, swap models, or withdraw them after a user has built a career and daily workflow on the platform." }], // 2:36
  },
  {
    name: "Local model benchmarking",
    keywords: ["local.ai", "prompt ingestion speed", "first token latency", "model hardware benchmarks"],
    picks: [{ youtube_id: "ziJy4PuxBhc", t: 221, label: "Local.ai benchmarks consumer hardware on prompt ingestion, first-token latency, and generation speed, then evaluates original models and their compressions to find the fastest, smartest, and best-balanced option for each machine." }], // 3:41
  },
  {
    name: "AI compute constraints",
    keywords: ["b200 benchmark cost", "b300 benchmark cost", "multi-shot evaluations"],
    picks: [{ youtube_id: "ziJy4PuxBhc", t: 350, label: "0xSero says reliable evaluations require repeated multi-shot runs on scarce B200 and B300 GPUs, making even one model's results expensive and slow to reproduce." }], // 5:50
  },
  {
    name: "AI model benchmarks",
    keywords: ["artificial analysis", "qwen benchmark", "local model capability"],
    picks: [{ youtube_id: "ziJy4PuxBhc", t: 427, label: "Citing Artificial Analysis, 0xSero argues that a roughly 60 GB Qwen model can outperform a far larger recent Sonnet model on aggregate benchmarks, challenging the idea that locally runnable models are too weak to matter." }], // 7:07
  },
  {
    name: "Open-source AI models",
    keywords: ["qwen local model", "consumer-runnable model", "open model capability"],
    picks: [{ youtube_id: "ziJy4PuxBhc", t: 427, label: "A roughly 60 GB Qwen model can outperform a far larger recent Sonnet model on aggregate benchmarks, illustrating how quickly consumer-runnable open models are closing the capability gap." }], // 7:07
  },
  {
    name: "Open-source AI",
    keywords: ["publicly owned ai", "distributed ai systems", "closed ai backlash"],
    picks: [{ youtube_id: "ziJy4PuxBhc", t: 913, label: "0xSero says each controversial move by a closed AI company produces a new wave of interest in systems that are distributed, publicly owned, and developed in the open." }], // 15:13
  },
  {
    name: "AI agent payments",
    keywords: ["agent payment rails", "agents lightning", "agent usdc", "agent eth"],
    picks: [{ youtube_id: "ziJy4PuxBhc", t: 947, label: "0xSero expects agents to default to familiar rails such as Bitcoin, Lightning, USDC, or ETH rather than bespoke AI-payment networks, arguing that vendor acceptance is the real bottleneck." }], // 15:47
  },
  {
    name: "Agentic web",
    keywords: ["agent-readable commerce", "websites blocking bots", "agent purchase flows"],
    picks: [{ youtube_id: "ziJy4PuxBhc", t: 1015, label: "Models can already create wallets and transfer money, but human-oriented websites often block bots and lack agent-readable purchase flows, making commerce infrastructure rather than model capability the limiting layer." }], // 16:55
  },
  {
    name: "Localmaxxing",
    keywords: ["learning local ai", "free gpu local model", "local ai service skill"],
    picks: [{ youtube_id: "ziJy4PuxBhc", t: 1071, label: "For newcomers, 0xSero recommends running a small model on free GPU access or existing hardware to learn installation, speed, battery, and deployment tradeoffs firsthand, turning local-AI fluency into a practical service skill." }], // 17:51
  },
]);

// 2026-07-25 PBJ: Bitcoin Security Consortium, Buzz, and Wavelength.
addTopicDefs([
  {
    name: "Bitcoin Security Consortium",
    keywords: ["bitcoin security consortium", "bitcoin security funding", "institutional quantum coordination"],
    picks: [{ youtube_id: "y2z-NATJC10", t: 722, label: "The newly announced Bitcoin Security Consortium brings nine major Bitcoin companies together to inform the market and fund Bitcoin security work, with quantum readiness as its first focus and centralization concerns explicitly acknowledged." }], // 12:02
  },
  {
    name: "Quantum readiness coordination",
    keywords: ["quantum scenario planning", "bitcoin quantum communication", "quantum emergency response"],
    picks: [{ youtube_id: "y2z-NATJC10", t: 1104, label: "The consortium's communication mandate is framed between panic and denial: no one knows when a cryptographically relevant quantum computer will arrive, so Bitcoin needs scenario plans spanning an orderly 15-to-20-year horizon through emergency response." }], // 18:24
  },
  {
    name: "Open-source funding",
    keywords: ["consortium grant independence", "bitcoin security grants", "independent funding decisions"],
    picks: [{ youtube_id: "y2z-NATJC10", t: 1364, label: "The consortium will not pool grants into a central committee; Spiral, Blockstream, and other members retain independent funding decisions so new capital does not erase the diversity of Bitcoin's open-source funding ecosystem." }], // 22:44
  },
  {
    name: "Buzz",
    keywords: ["buzz launch", "buzz github trending", "ai-native collaboration launch"],
    picks: [{ youtube_id: "y2z-NATJC10", t: 1649, label: "Buzz's public launch reached the top of GitHub trending and roughly 10,000 stars, reinforcing the prediction that open-source projects will adopt its AI-native collaboration model faster than established companies can migrate from Slack." }], // 27:29
  },
  {
    name: "Nostr identity",
    keywords: ["buzz nostr relay", "portable community identity", "user-owned reputation"],
    picks: [{ youtube_id: "y2z-NATJC10", t: 2338, label: "Buzz shows Nostr's value as a client-server abstraction: a community can begin on Block-hosted infrastructure, later run its own relay, and carry user-owned identity and reputation across either environment with far lower switching costs than Slack or Discord." }], // 38:58
  },
  {
    name: "Agentic commerce",
    keywords: ["buzz payments", "agent tips", "open-source funding payments"],
    picks: [{ youtube_id: "y2z-NATJC10", t: 2633, label: "The first obvious Bitcoin use case for Buzz is paying people and agents: wallet integrations can turn code tips into an open-source funding primitive while each community chooses its own Bitcoin infrastructure." }], // 43:53
  },
  {
    name: "Model provider lock-in",
    keywords: ["buzz multi-model", "neutral agent workspace", "openai anthropic fast follow"],
    picks: [{ youtube_id: "y2z-NATJC10", t: 2954, label: "Buzz's strongest defense against an OpenAI or Anthropic fast-follow is structural: open communities need a neutral multi-vendor, multi-model harness because their members cannot realistically be forced onto one provider." }], // 49:14
  },
  {
    name: "Open-source development",
    keywords: ["stratum v2 fleet benchmark", "buzz public build", "agent-built open source"],
    picks: [{ youtube_id: "y2z-NATJC10", t: 3947, label: "A new Buzz user used agents within hours to integrate Stratum V2 with Proto's open-source fleet software and build a cross-pool benchmark, while the public channel preserved the work as a reusable demonstration for other builders." }], // 1:05:47
  },
  {
    name: "Wavelength",
    keywords: ["wavelength", "lightning labs wavelength", "wavelength ark", "ark lightning"],
    picks: [{ youtube_id: "y2z-NATJC10", t: 4733, label: "Lightning Labs' Wavelength combines Lightning and Ark as the protocol's third independent implementation, giving Ark a healthier multi-vendor ecosystem than a single-implementation system such as Spark." }], // 1:18:53
  },
  {
    name: "Bitcoin payments",
    keywords: ["spark bark lexe mdk wavelength", "bitcoin payment stacks", "payment demand generation"],
    picks: [{ youtube_id: "y2z-NATJC10", t: 4809, label: "Bitcoin payments now have several credible stacks—Spark, Bark, Lexe, MDK, and Wavelength—but infrastructure has outpaced users, making demand generation rather than protocol design the immediate bottleneck." }], // 1:20:09
  },
  {
    name: "BIP 110",
    keywords: ["foundry bip 110 vote", "miner signaling governance", "pool customer vote"],
    picks: [{ youtube_id: "y2z-NATJC10", t: 5277, label: "Foundry's BIP 110 customer vote is criticized as a bad governance precedent because choosing which fork deserves a ballot already exercises pool judgment, while the vote's timing and ambiguity misuse miner signaling and leave dissenting hashers exposed." }], // 1:27:57
  },
  {
    name: "Stratum V2",
    keywords: ["miner rule choice", "pool governance", "individual miner templates"],
    picks: [{ youtube_id: "y2z-NATJC10", t: 5563, label: "Stratum V2 is offered as the cleaner governance path because individual miners can choose and enforce their own rules while the pool retreats to its proper role of smoothing payouts." }], // 1:32:43
  },
  {
    name: "Proof of personhood",
    keywords: ["nostr cross-signing", "bitchat web of trust", "privacy-preserving personhood"],
    picks: [{ youtube_id: "y2z-NATJC10", t: 5843, label: "Instead of biometric proof of personhood, Nostr users could cross-sign encounters through Bitchat, Primal, or Damus and carry that web-of-trust weight into Buzz as a privacy-preserving signal that a key belongs to a real person." }], // 1:37:23
  },
]);

// 2026-07-24 21 in 21: Bradley Axen on Buzz, Goose, and AI at Block.
addTopicDefs([
  {
    name: "Goose",
    keywords: ["brad axen goose", "goose origin", "block internal ai tool"],
    picks: [{ youtube_id: "Prdk7Mf2X0M", t: 45, label: "Brad Axen traces Goose from his 2023 copy-and-paste experiments with unfamiliar languages to an internal Block tool built around the emerging tool-calling loop, then open-sourced at the end of 2024." }], // 0:45
  },
  {
    name: "Local AI models",
    keywords: ["goose gemma", "on-device goose", "local inference quotas"],
    picks: [{ youtube_id: "Prdk7Mf2X0M", t: 232, label: "Goose can keep sensitive work entirely on-device with Gemma-class models that run comfortably on a recent MacBook, while local inference also helps power users escape rising subscription bills and quotas." }], // 3:52
  },
  {
    name: "Harness benchmarks",
    keywords: ["harness token efficiency", "same model different harness", "block agent evaluations"],
    picks: [{ youtube_id: "Prdk7Mf2X0M", t: 307, label: "Block's public and internal evaluations show the same model now scores within roughly one percentage point across agent harnesses, shifting the meaningful competition toward token efficiency rather than raw task completion." }], // 5:07
  },
  {
    name: "Model provider lock-in",
    keywords: ["ai inference critical infrastructure", "model provider outage", "multi-provider resilience"],
    picks: [{ youtube_id: "Prdk7Mf2X0M", t: 504, label: "Block now treats model inference as critical infrastructure: its AI first responders investigate incidents before humans wake up, so multiple providers are stacked to degrade gracefully through an Anthropic or OpenAI outage." }], // 8:24
  },
  {
    name: "Open-source AI",
    keywords: ["agentic ai foundation", "linux foundation goose", "mcp agents.md"],
    picks: [{ youtube_id: "Prdk7Mf2X0M", t: 575, label: "Block helped found the Linux Foundation's Agentic AI Foundation, contributing Goose alongside Anthropic's MCP and OpenAI's agents.md while helping develop shared protocols for the wider agent ecosystem." }], // 9:35
  },
  {
    name: "Organizational AI agents",
    keywords: ["builder bot", "block company knowledge", "block codebase agent"],
    picks: [{ youtube_id: "Prdk7Mf2X0M", t: 623, label: "Builder Bot indexes Block's roughly 200 million lines of code and 50,000 repositories, letting people across engineering, design, sales, and support locate the right services and turn company knowledge directly into code changes." }], // 10:23
  },
  {
    name: "Buzz",
    keywords: ["brad axen buzz", "humans and agents channels", "block collaboration prototype"],
    picks: [{ youtube_id: "Prdk7Mf2X0M", t: 800, label: "Buzz is Block's open-source prototype for the next collaboration model: many humans and many agents sharing Slack-like channels, with agents acting through the permissions of the people they represent." }], // 13:20
  },
  {
    name: "Open-source development",
    keywords: ["buzz open source collaboration", "public agent channels", "upstream pull request collaboration"],
    picks: [{ youtube_id: "Prdk7Mf2X0M", t: 996, label: "Buzz could move open-source collaboration upstream from finished pull requests into shared channels where contributors and maintainers discuss an idea first and let agents build with the work visible to everyone." }], // 16:36
  },
  {
    name: "Career advice",
    keywords: ["engineer role ai", "human value engineering", "ai system architecture"],
    picks: [{ youtube_id: "Prdk7Mf2X0M", t: 1209, label: "As AI removes role specialization as a hard blocker, Brad argues engineers' durable human value is shifting toward choosing ideas, designing experiences, and setting reliable, scalable system architecture." }], // 20:09
  },
  {
    name: "Builder advice",
    keywords: ["open-source ai interface", "prototype experience video", "brad axen builder advice"],
    picks: [{ youtube_id: "Prdk7Mf2X0M", t: 1338, label: "Brad says the highest-leverage opportunity in open-source AI is now the interface layer: prototype the end-to-end experience and use a low-fidelity video to make the idea tangible before polishing the implementation." }], // 22:18
  },
]);

// 2026-07-23 21 in 21: Mic Neale on Goose, Mesh-LLM, and open-source AI.
addTopicDefs([
  {
    name: "Open-source AI models",
    keywords: ["model training data open source", "open model definition", "model as software"],
    picks: [{ youtube_id: "E1RTjt8uPsw", t: 246, label: "Mic Neale argues that model weights alone do not make an AI model open source: users would also need the training data and tooling, forcing the harder question of whether a trained model should be treated as software at all." }], // 4:06
  },
  {
    name: "Goose",
    keywords: ["mic neale goose", "rust agent harness", "goose mcp"],
    picks: [{ youtube_id: "E1RTjt8uPsw", t: 315, label: "Mic describes Goose as a native-Rust, cross-platform agent harness that emerged from an internal Block tool, adopted MCP early, and supports many model providers across desktop and command-line experiences." }], // 5:15
  },
  {
    name: "Goose Development Kit",
    keywords: ["goose development kits", "reusable agent foundations", "gdk provider support"],
    picks: [{ youtube_id: "E1RTjt8uPsw", t: 370, label: "Goose is being decomposed into development kits so teams can reuse its agent foundations across their own experiences and harnesses instead of rebuilding provider, platform, and model support from scratch." }], // 6:10
  },
  {
    name: "Local AI models",
    keywords: ["goose local inference", "native mac local models", "automatic local runtime"],
    picks: [{ youtube_id: "E1RTjt8uPsw", t: 408, label: "Goose makes local inference an out-of-the-box option by selecting platform-appropriate runtimes and using native Mac capabilities, preserving model choice without requiring users to assemble a local stack themselves." }], // 6:48
  },
  {
    name: "Security & privacy of agents",
    keywords: ["goose permission prompts", "safe autonomous agents", "agent harness safety"],
    picks: [{ youtube_id: "E1RTjt8uPsw", t: 548, label: "Rather than treating repeated permission prompts as the safety boundary, Goose assumes users may approve requests without reading them and makes safe autonomous behavior a responsibility of the harness itself." }], // 9:08
  },
  {
    name: "Mesh-LLM",
    keywords: ["heterogeneous device inference", "idle compute mesh", "distributed model layers"],
    picks: [{ youtube_id: "E1RTjt8uPsw", t: 620, label: "Mesh-LLM pools heterogeneous devices—from laptops and gaming rigs to racks—so models can check one another or split layers across machines, using idle compute that no single device could turn into capable inference alone." }], // 10:20
  },
  {
    name: "Verifiable compute",
    keywords: ["paid shared compute", "verifiable llm execution", "idle hardware earnings"],
    picks: [{ youtube_id: "E1RTjt8uPsw", t: 810, label: "Mic says a paid shared-compute network needs trustworthy, safe, verifiable execution before users will fund priority LLM access and hardware owners can reliably earn from idle machines." }], // 13:30
  },
  {
    name: "AI compute efficiency",
    keywords: ["idle hardware efficiency", "embodied compute cost", "mesh llm energy"],
    picks: [{ youtube_id: "E1RTjt8uPsw", t: 942, label: "Mesh-LLM's efficiency case is less about replacing data centers than making better use of the energy and embodied cost already sunk into heterogeneous hardware that otherwise sits idle." }], // 15:42
  },
  {
    name: "Open-source software",
    keywords: ["bitcoin linux governance", "distributed maintainers", "long-lived open source"],
    picks: [{ youtube_id: "E1RTjt8uPsw", t: 1036, label: "Mic links Bitcoin and Linux as rare decades-long distributed software projects, asking how systems with rotating maintainers and no simple central authority preserve coherence and keep evolving." }], // 17:16
  },
  {
    name: "Career advice",
    keywords: ["open-source career", "remote developer contribution", "ai-generated pull requests"],
    picks: [{ youtube_id: "E1RTjt8uPsw", t: 1242, label: "Open-source contribution remains a way for remote or underrepresented developers to build relationships and visibility, even though AI-generated code has made the field noisier and a pull request no longer outshines interviews as automatically as it once did." }], // 20:42
  },
]);

// 2026-07-02 21 in 21: Patrick Ball on Bitcoin, AI, and human rights.
addTopicDefs([
  {
    name: "Human rights data analysis",
    keywords: ["human rights data analysis", "hrdag", "patrick ball", "mass violence statistics", "war crimes data", "human rights evidence"],
    picks: [{ youtube_id: "yN6ho-KQfh8", t: 27, label: "Patrick Ball describes HRDAG's 35-year progression from early databases through inferential statistics, machine learning, and AI to quantify mass violence and hold perpetrators of state crimes accountable." }], // 0:27
  },
  {
    name: "AI provenance",
    keywords: ["human rights evidence provenance", "opentimestamps evidence", "merkle root evidence"],
    picks: [{ youtube_id: "yN6ho-KQfh8", t: 449, label: "To keep future human-rights evidence from being dismissed as AI slop, HRDAG signs and hashes its data and anchors Merkle roots through OpenTimestamps so it can prove the material existed by a specific Bitcoin block." }], // 7:29
  },
  {
    name: "Bitcoin as human rights tool",
    keywords: ["bitcoin evidence timestamp", "free opentimestamps", "proof of age bitcoin"],
    picks: [{ youtube_id: "yN6ho-KQfh8", t: 567, label: "Ball chose Bitcoin timestamping because OpenTimestamps is free, responsive, and easy to use at scale, while Bitcoin's ubiquity makes the resulting proof of age understandable to nontechnical audiences." }], // 9:27
  },
  {
    name: "Bitcoin and human rights",
    keywords: ["nonprofit censorship resistance", "icc sanctions", "decentralized human rights tools"],
    picks: [{ youtube_id: "yN6ho-KQfh8", t: 626, label: "Using sanctioned International Criminal Court judges and prosecutors as the warning, Ball argues that nonprofits challenging governments need decentralized tools that cannot be disabled through pressure on big-tech providers." }], // 10:26
  },
  {
    name: "Open-source AI models",
    keywords: ["hrdag local ai", "human rights gpu server", "private evidence extraction"],
    picks: [{ youtube_id: "yN6ho-KQfh8", t: 732, label: "HRDAG runs open models on its own GPU server for transcription, entity resolution, document extraction, and conversion of heterogeneous evidence into structured data, keeping a sensitive human-rights workflow under organizational control." }], // 12:12
  },
  {
    name: "AI for activists",
    keywords: ["ai human rights evidence", "victim evidence graphs", "ai truth commissions"],
    picks: [{ youtube_id: "yN6ho-KQfh8", t: 754, label: "Ball describes using AI to turn video, audio, and documents into structured graphs that synthesize victims' voices for court cases, truth commissions, lustration, memorialization, and advocacy." }], // 12:34
  },
  {
    name: "Model provider lock-in",
    keywords: ["human rights cloud dependency", "advocacy ai shutdown", "nonprofit infrastructure resilience"],
    picks: [{ youtube_id: "yN6ho-KQfh8", t: 841, label: "Ball says the greater danger is no longer only confidential data leaking but human-rights advocacy depending on AI and cloud tools that powerful actors can have switched off, making control of the stack existential." }], // 14:01
  },
  {
    name: "Decentralized resource discovery",
    keywords: ["decentralized resource discovery", "peer-to-peer resource routing", "node discovery", "distributed compute", "resource sharing"],
    picks: [{ youtube_id: "yN6ho-KQfh8", t: 1010, label: "Ball's magic-wand request is a decentralized network layer where nodes can discover, consume, and offer available resources, because cryptographic guarantees exist but routing and distribution remain unsolved." }], // 16:50
  },
  {
    name: "Decentralized data storage",
    keywords: ["decentralized data storage", "distributed evidence storage", "replicated nonprofit data", "filecoin", "opentimestamps storage"],
    picks: [{ youtube_id: "yN6ho-KQfh8", t: 1108, label: "Five nonprofits share a decentralized storage network of roughly one-gigabyte, OpenTimestamps-backed chunks, separating distributed evidence custody from HRDAG's still-centralized compute server." }], // 18:28
  },
  {
    name: "Security-tool adoption",
    keywords: ["security tool adoption", "privacy ux", "resilience ux", "encrypted software adoption", "secure alternatives", "martus"],
    picks: [{ youtube_id: "yN6ho-KQfh8", t: 1261, label: "Ball argues that security and decentralization tools will not win adoption unless they are at least as usable as incumbents and offer benefits users actively want, because resilience alone feels like being told to eat spinach." }], // 21:01
  },
]);
