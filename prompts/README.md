# Prompt library

Once TraderDaddy Pro is connected (see [`../connectors/`](../connectors/)), your
assistant can call the 12 flow tools directly. These prompts are copy-paste
starting points, grouped by the tool they lean on. Mix and match — the whole
point of MCP is the model chains them itself.

## Smart-money flow — `get_unusual_activity`, `get_market_stats`

- "What did smart money do today? Summarize the biggest unusual options flow in 5 bullets."
- "Show me only ELITE and LEGENDARY tier flow with premium over $500k, and tell me the net bullish/bearish lean."
- "Is today's flow bullish or bearish overall? Use market stats and back it with the top prints."
- "Any repeat/cluster flow on a single ticker today? What's the conviction?"

## Gamma / dealer positioning — `get_gex_overview`, `get_gex_ticker`

- "Is SPY gamma positive or negative right now, and where's the flip point?"
- "Give me the gamma picture for the whole market, then zoom into QQQ."
- "For NVDA, which strikes are the biggest gamma walls above and below spot?"

## Setup finding — `run_screener`, `get_edge_xray`, `get_strategy_ideas`

- "Find me a CSP-wheel setup. Run the screener, then pull edge x-ray and strategy ideas on the top name."
- "Screen for momentum, then for the top 3 tell me which options are rich vs cheap."
- "I want to sell premium on a high-IV name — screen, check IV rank, and suggest a structure."

## Volatility — `get_iv_rank`, `get_put_call_ratios`

- "Is TSLA's IV rich or cheap right now? Should I be a buyer or seller of premium?"
- "Compare IV rank across NVDA, TSLA, and AMD and rank them for premium selling."
- "What's the put/call ratio on SPY and what does it imply?"

## Sector rotation — `get_sector_flow`

- "Where's the sector money going today? Which sectors are bullish vs bearish?"
- "Any thematic flow standing out — AI, energy, biotech?"

## Events — `get_earnings_flow`, `get_economic_calendar`

- "What's reporting this week and where's the pre-earnings flow leaning?"
- "Give me the earnings names with the biggest expected moves and the flow's directional call."
- "What macro events hit this week that could move the market?"

## Multi-tool research (let the model chain)

- "Give me a full morning brief: market stats, top flow, sector rotation, and anything big on the earnings calendar."
- "I'm bullish NVDA into earnings. Check the flow, IV rank, gamma, and suggest a structure with defined risk."
- "Build me a watchlist: run the momentum screener, then for each name pull IV rank and note if flow agrees."

---

Want these as runnable scripts instead of chat prompts? The same reads are
wired up in [`../examples/`](../examples/) via the SDK.
