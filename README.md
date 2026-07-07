# DaddyMCP

> Connect TraderDaddy Pro's options-flow data to your **AI assistant** (Claude,
> Cursor, ChatGPT) — one-click MCP connector configs, a curated prompt library,
> and runnable example agents.

**Status:** ✅ Built (v0.1.0) — connector configs, a curated prompt library, and
four runnable keyless example agents. The MCP **server** already exists
(`POST /api/v1/mcp` + OAuth shim); this repo is the packaging, configs, and
examples around it, all riding the built-and-publish-ready
[`@traderdaddy/sdk`](https://github.com/mphinance/traderdaddy-sdk) (v0.1.0).

Part of the [TraderDaddy Pro](https://traderdaddy.pro) open-source family,
alongside [DaddyBoard](https://github.com/mphinance/daddyboard) (wall display),
[DaddyLens](https://github.com/mphinance/daddylens) (browser extension), and
[DaddyBot](https://github.com/mphinance/daddybot) (Discord bot).

**Extending it?** Grab a prompt from [`PROMPTS.md`](PROMPTS.md) and paste it into
Claude Code / Cursor. Agents working in this repo should read [`CLAUDE.md`](CLAUDE.md).

---

## Why this exists

TraderDaddy Pro already runs a **public customer MCP endpoint** with an OAuth
shim — built for exactly this. DaddyMCP packages the "add options flow to your
AI" story into a clean, discoverable repo, riding the wave of people wiring MCP
servers into their assistants. It's the most on-brand distribution channel the
platform has: **your data, inside the tool the customer is already asking
questions in.** No new backend — just make it a two-minute setup.

## What it does

Three tracks, none of which is a new server:

1. **Connector configs** — copy-paste setup for Claude Desktop, Claude
   web/mobile Connectors (via the OAuth shim), Cursor, and any MCP-capable
   client. Plus a short "get + paste your `td_live_` key" walkthrough.
2. **Prompt library** — curated prompts that show off the tool surface:
   *"what did smart money do today?"*, *"find me a CSP-wheel setup"*,
   *"is SPY gamma positive or negative right now?"*
3. **Example agents** — small scripts (a plain loop + a LangChain variant) that
   call the API through [`@traderdaddy/sdk`](https://github.com/mphinance/traderdaddy-sdk)
   to do multi-step research. They double as living SDK documentation and all
   run **keyless in demo mode** out of the box.

## Proposed repo layout

```
daddymcp/
  README.md                     # this — the connector + examples hub
  connectors/
    claude-desktop.json         # mcpServers config (via mcp-remote bridge)
    cursor.json                 # ~/.cursor/mcp.json — native remote url+headers
    claude-connectors.md        # OAuth-shim walkthrough (+ screenshots)
    generic.md                  # any MCP client: endpoint, auth, tool list
  prompts/
    README.md                   # curated prompt library, grouped by tool
  examples/
    package.json                # depends on @traderdaddy/sdk
    01-research-recap.mjs       # morning brief: marketStats + unusualActivity + sectorFlow
    02-setup-finder.mjs         # runScreener → edgeXray → strategyIdeas
    03-gamma-check.mjs          # gexOverview + gexTicker one-shot
    04-earnings-radar.mjs       # earningsFlow + ivRank for the week ahead
    README.md
  scripts/
    get-your-key.md             # Developer API upgrade → td_live_ key
```

## Connector surfaces (from the platform's existing shim)

The endpoint is stateless StreamableHTTP JSON-RPC 2.0 — a bare `tools/call` is
accepted, no `initialize` handshake, one POST per call.

- **Static-header clients (Cursor, and Claude Desktop via `mcp-remote`)** send
  the key straight to `/api/v1/mcp`:
  - `Authorization: Bearer td_live_…` **or** `X-API-Key: td_live_…`
  - Cursor supports remote MCP natively (`url` + `headers`); Claude Desktop's
    `mcpServers` bridges to a remote server through the `npx mcp-remote` proxy.
- **Claude web/mobile Connectors UI** can't send a static header, so it uses the
  OAuth shim — `.well-known/oauth-*` + `/oauth/{register,authorize,token}`
  (PKCE). The user pastes their own `td_live_` key on the authorize page; the
  shim stores only the key's **hash**, never the raw key.

### Cursor (`~/.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "traderdaddy": {
      "url": "https://api.traderdaddy.pro/api/v1/mcp",
      "headers": { "Authorization": "Bearer td_live_YOUR_KEY" }
    }
  }
}
```

### Claude Desktop (`claude_desktop_config.json`, via `mcp-remote`)

```json
{
  "mcpServers": {
    "traderdaddy": {
      "command": "npx",
      "args": [
        "-y", "mcp-remote",
        "https://api.traderdaddy.pro/api/v1/mcp",
        "--header", "Authorization: Bearer td_live_YOUR_KEY"
      ]
    }
  }
}
```

### Claude web / mobile (Connectors UI)

Add a custom connector pointing at the OAuth shim base, click through
authorize, paste your `td_live_` key. Walkthrough + screenshots in
`connectors/claude-connectors.md`.

## Available tools (what the AI can call)

`get_market_stats`, `get_unusual_activity`, `get_put_call_ratios`,
`get_gex_overview`, `get_gex_ticker`, `get_sector_flow`, `get_iv_rank`,
`run_screener`, `get_strategy_ideas`, `get_edge_xray`, `get_earnings_flow`,
`get_economic_calendar`.

The example agents call these through the SDK's typed methods (`unusualActivity`,
`gexTicker`, `runScreener`, …) — same tools, one line each. See the
[SDK method table](https://github.com/mphinance/traderdaddy-sdk#methods).

## Example-agent sketches (all SDK-grounded, run keyless)

```js
// 01-research-recap.mjs — "what did smart money do today?"
import { TraderDaddy } from "@traderdaddy/sdk";
const td = new TraderDaddy({ mock: !process.env.TD_API_KEY }); // keyless demo by default

const [stats, flow, sectors] = await Promise.all([
  td.marketStats(),
  td.unusualActivity({ minPremium: 250_000, limit: 15 }),
  td.sectorFlow("today"),
]);
// → hand the three payloads to an LLM, ask for a 5-bullet morning brief
```

```js
// 02-setup-finder.mjs — "find me a CSP-wheel setup"
const ideas = await td.runScreener("csp-wheel", { limit: 10 });
for (const s of ideas.slice(0, 3)) {
  const xray = await td.edgeXray(s.symbol);       // why it scored
  const plan = await td.strategyIdeas(s.symbol);  // concrete structures
  // → LLM ranks + explains the top setup
}
```

Because the SDK ships keyless demo mode, every example runs right after clone
(`node examples/01-research-recap.mjs`) and flips to live the instant a
`TD_API_KEY` is present — the same demo→live funnel the rest of the family uses.

## Key-safety model

Personal-use only: each user brings **their own** `td_live_` key — set in a
local MCP config, or pasted into the OAuth authorize page (hash stored, never
the raw key). **No secrets in this repo.** This is the safe pattern; unlike a
public embed, an MCP config lives on the user's own machine.

## Build milestones

1. `connectors/` — Cursor + Claude Desktop JSON, Claude Connectors OAuth
   walkthrough with screenshots, generic-client doc.
2. `prompts/README.md` — curated prompt library grouped by tool.
3. `examples/` — 3–4 agents on `@traderdaddy/sdk` (research recap, setup finder,
   gamma check, earnings radar). Keyless-first, live via `TD_API_KEY`.
4. `scripts/get-your-key.md` — "get your key" walkthrough linking the Developer
   API upgrade.

## Picking this up in a new session

The server side already exists (public `/api/v1/mcp` endpoint + OAuth shim), so
this is **packaging and examples, not backend work.** The connector docs are
independent of everything; the example agents depend only on the already-built
[`@traderdaddy/sdk`](https://github.com/mphinance/traderdaddy-sdk) (v0.1.0, its
method names are in the sketches above). Good parallel-track project any time.

## License

MIT
