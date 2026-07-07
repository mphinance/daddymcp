# Example agents

Runnable, multi-step research scripts built on
[`@traderdaddy/sdk`](https://github.com/mphinance/traderdaddy-sdk). Each one
**runs keyless in demo mode** out of the box (the SDK's built-in fixtures), so
you can clone and run immediately — no API key, no network.

## Setup

```bash
npm install          # pulls in @traderdaddy/sdk
```

> Uses the local SDK via `file:../../traderdaddy-sdk` while the package is
> pre-publish. Once `@traderdaddy/sdk` is on npm, flip the dependency in
> `package.json` to `^0.1.0`.

## Run

```bash
node 01-research-recap.mjs        # or: npm run recap
node 02-setup-finder.mjs momentum # or: npm run setups
node 03-gamma-check.mjs SPY       # or: npm run gamma
node 04-earnings-radar.mjs 14     # or: npm run earnings
```

| File | What it does | Tools chained |
|---|---|---|
| `01-research-recap.mjs` | "What did smart money do today?" — a morning brief | `marketStats` + `unusualActivity` + `sectorFlow` |
| `02-setup-finder.mjs` | "Find me a CSP-wheel setup" — ranked, explained shortlist | `runScreener` → `ivRank` + `strategyIdeas` |
| `03-gamma-check.mjs` | "Is SPY gamma positive or negative?" — walls + flip point | `gexOverview` + `gexTicker` |
| `04-earnings-radar.mjs` | Biggest expected moves + is IV rich/cheap | `earningsFlow` + `ivRank` |

## Going live

Every script flips to your real account the moment a key is present — the
`mock: !process.env.TD_API_KEY` line does the switch:

```bash
TD_API_KEY=td_live_... node 01-research-recap.mjs
```

No key yet? See [`../scripts/get-your-key.md`](../scripts/get-your-key.md).

## Making them real agents

These scripts stop at assembling the data (and a ready-to-send text brief). To
turn a recap into an LLM-written narrative, drop the brief into Claude —
`01-research-recap.mjs` has the 6-line seam at the bottom, commented out. That's
the whole "agent" step: the SDK does the tool-calling, the LLM does the prose.
