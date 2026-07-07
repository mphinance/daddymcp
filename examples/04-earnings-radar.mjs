/**
 * 04 — Earnings radar: what's reporting and where's the pre-earnings flow leaning.
 *
 * Pulls the earnings-flow calendar and, for the names with the biggest expected
 * moves, checks whether IV is rich or cheap. Keyless demo by default.
 *
 *   node 04-earnings-radar.mjs
 *   node 04-earnings-radar.mjs 14      # look 14 days out
 */
import "dotenv/config"; // load a local .env so TD_API_KEY can live in a file
import { TraderDaddy } from "@traderdaddy/sdk";

const days = Number(process.argv[2] ?? 7);
const td = new TraderDaddy({ mock: !process.env.TD_API_KEY });
const pct = (n) => (n == null ? "n/a" : n.toFixed(1) + "%"); // expectedMovePct is a whole percent

const { earnings, count } = await td.earningsFlow({ days });
console.log(`EARNINGS RADAR — next ${days} days (${count} names)` +
  `${process.env.TD_API_KEY ? "" : "  [DEMO DATA]"}\n`);

const byMove = earnings
  .slice()
  .sort((a, b) => (b.event.expectedMovePct ?? 0) - (a.event.expectedMovePct ?? 0))
  .slice(0, 5);

for (const item of byMove) {
  const e = item.event;
  const iv = await td.ivRank(e.symbol);
  console.log(`${e.symbol}  ${e.earningsDate} ${e.earningsTime}  (${e.sector})`);
  console.log(`  Expected move ${pct(e.expectedMovePct)} | IV rank ${iv.ivRank} (${iv.interpretation})`);
  console.log(`  Flow call: ${item.summary.direction} — ${item.summary.confidence}. ${item.summary.note}`);
  console.log();
}
