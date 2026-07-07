/**
 * 01 — Research recap: "What did smart money do today?"
 *
 * A multi-step read that fans out three tools in parallel, then assembles a
 * research brief. Runs keyless in demo mode out of the box; set TD_API_KEY to
 * hit your live account.
 *
 *   node 01-research-recap.mjs
 *   TD_API_KEY=td_live_... node 01-research-recap.mjs
 */
import { TraderDaddy } from "@traderdaddy/sdk";

const td = new TraderDaddy({ mock: !process.env.TD_API_KEY });
const usd = (n) => "$" + Math.round(n).toLocaleString();

const [stats, flow, sectors] = await Promise.all([
  td.marketStats(),
  td.unusualActivity({ minPremium: 250_000, limit: 15 }),
  td.sectorFlow("today"),
]);

const topPrints = flow.data
  .slice(0, 5)
  .map((r) => `  • ${r.ticker} ${r.type} ${usd(r.premium)} — ${r.sentiment} [${r.tier}] ${r.flowDescription}`)
  .join("\n");

const hotSectors = sectors.sectors
  .slice()
  .sort((a, b) => Math.abs(b.flowNet) - Math.abs(a.flowNet))
  .slice(0, 4)
  .map((s) => `  • ${s.name} (${s.sym}): ${usd(s.flowNet)} net, ${s.flowSide}`)
  .join("\n");

// A plain-text brief you'd hand to an LLM (or print as-is).
const brief = `SMART-MONEY RECAP — ${stats.tradingDate}${process.env.TD_API_KEY ? "" : "  [DEMO DATA]"}

Market: ${stats.overallSentiment} (score ${stats.sentimentScore}), dominant flow ${stats.dominantFlow}.
Total premium ${usd(stats.totalFlowPremium)}, bull/bear ratio ${stats.bullishBearishRatio.toFixed(2)}, SPY P/C ${stats.putCallRatioSPY.toFixed(2)}.
Largest single trade: ${stats.largestTrade.ticker} ${stats.largestTrade.type} ${usd(stats.largestTrade.premium)} (${stats.largestTrade.sentiment}).

Top unusual flow (>= $250k):
${topPrints}

Sector rotation (biggest net flow):
${hotSectors}

Macro read: ${sectors.macro.label} — ${sectors.macro.description}`;

console.log(brief);

// --- Turn this into a real agent -------------------------------------------
// Drop the brief into an LLM for a narrative summary. Uncomment after
// `npm i @anthropic-ai/sdk` and setting ANTHROPIC_API_KEY:
//
//   import Anthropic from "@anthropic-ai/sdk";
//   const ai = new Anthropic();
//   const msg = await ai.messages.create({
//     model: "claude-sonnet-4-6",
//     max_tokens: 400,
//     messages: [{ role: "user", content: `Summarize this options-flow recap in 5 punchy bullets:\n\n${brief}` }],
//   });
//   console.log("\n" + msg.content[0].text);
