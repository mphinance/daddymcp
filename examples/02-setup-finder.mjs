/**
 * 02 — Setup finder: "Find me a CSP-wheel setup."
 *
 * Chains tools the way an agent would: screen for candidates, then for the top
 * few pull IV rank + edge x-ray + concrete strategy structures. The output is a
 * ranked, explained shortlist. Keyless demo by default; TD_API_KEY goes live.
 *
 *   node 02-setup-finder.mjs
 *   node 02-setup-finder.mjs momentum
 */
import "dotenv/config"; // load a local .env so TD_API_KEY can live in a file
import { TraderDaddy } from "@traderdaddy/sdk";

const screener = process.argv[2] ?? "csp-wheel";
const td = new TraderDaddy({ mock: !process.env.TD_API_KEY });
const usd = (n) => (n == null ? "n/a" : "$" + Math.round(n).toLocaleString());

const { screener: meta, results } = await td.runScreener(screener, { limit: 10 });
console.log(`SETUP FINDER — ${meta.name}${process.env.TD_API_KEY ? "" : "  [DEMO DATA]"}\n`);

const top = results.slice(0, 3);
for (const row of top) {
  // Fan out the deep-dive reads per candidate.
  const [iv, ideas] = await Promise.all([
    td.ivRank(row.ticker),
    td.strategyIdeas(row.ticker),
  ]);

  const best = ideas.structures[0];
  console.log(`${row.ticker}  (score ${row.score}, ${row.sector})`);
  console.log(`  IV rank ${iv.ivRank} — ${iv.interpretation}: ${iv.note}`);
  if (best) {
    console.log(`  Idea: ${best.archetype} — POP ${(best.pop * 100).toFixed(0)}%, ` +
      `max profit ${usd(best.maxProfit)} / max loss ${usd(best.maxLoss)}, ${best.dte} DTE`);
    console.log(`        ${best.rationale}`);
  }
  console.log();
}

// The three payloads per name (screen row + iv + strategy ideas) are exactly
// what you'd hand an LLM to rank and explain the single best setup. See the
// LLM seam in 01-research-recap.mjs for the drop-in.
