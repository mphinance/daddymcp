/**
 * 03 — Gamma check: "Is SPY gamma positive or negative, and where's the flip?"
 *
 * Reads the market-wide gamma picture, then zooms into one symbol and draws its
 * biggest gamma walls above and below spot. Keyless demo by default.
 *
 *   node 03-gamma-check.mjs
 *   node 03-gamma-check.mjs SPY
 */
import { TraderDaddy } from "@traderdaddy/sdk";

const symbol = (process.argv[2] ?? "SPY").toUpperCase();
const td = new TraderDaddy({ mock: !process.env.TD_API_KEY });
const bn = (n) => (n >= 0 ? "+" : "") + (n / 1e9).toFixed(2) + "B";

const overview = await td.gexOverview();
const ms = overview.marketSummary;
console.log(`GAMMA CHECK${process.env.TD_API_KEY ? "" : "  [DEMO DATA]"}`);
console.log(`Market: total GEX ${bn(ms.totalGEX)} — ${ms.bias}. ${ms.interpretation}\n`);

const t = await td.gexTicker(symbol);
console.log(`${t.symbol}: total GEX ${bn(t.totalGEX)}, net ${bn(t.netGex)}, ` +
  `bias ${t.bias}, flip point ${t.flipPoint}`);

const walls = t.byStrike
  .slice()
  .sort((a, b) => Math.abs(b.netGex) - Math.abs(a.netGex))
  .slice(0, 6)
  .sort((a, b) => b.strike - a.strike);

console.log("\nBiggest gamma walls:");
for (const s of walls) {
  const side = s.isAboveSpot ? "above" : "below";
  console.log(`  ${String(s.strike).padStart(7)}  net ${bn(s.netGex).padStart(8)}  (${side} spot)`);
}
