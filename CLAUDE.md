# CLAUDE.md — agent ground-truth for DaddyMCP

> Read this first. The short, factual map for working in this repo. Tool-agnostic
> — copy to `AGENTS.md` if you use Cursor/other.
>
> **Want to add a connector / agent by talking to your AI?** See [`PROMPTS.md`](PROMPTS.md).

## What this is

The "connect TraderDaddy Pro to your AI assistant" repo. It is **packaging, not a
backend** — the MCP server (`POST /api/v1/mcp` + OAuth shim) already exists. This
repo is three tracks around it:

1. **`connectors/`** — copy-paste MCP client configs (Cursor, Claude Desktop,
   Claude web/mobile Connectors via OAuth, any generic client).
2. **`prompts/`** — a curated prompt library grouped by tool.
3. **`examples/`** — small runnable agents built on
   [`@traderdaddy/sdk`](https://github.com/mphinance/traderdaddy-sdk) that do
   multi-step research. They double as living SDK docs and run **keyless in demo
   mode**.

## Repo map

| Path | What |
|---|---|
| `connectors/cursor.json` | `~/.cursor/mcp.json` — native remote `url` + `headers`. |
| `connectors/claude-desktop.json` | `mcpServers` via the `npx mcp-remote` bridge. |
| `connectors/claude-connectors.md` | Claude web/mobile OAuth-shim walkthrough. |
| `connectors/generic.md` | Any MCP client: endpoint, auth, tool list, curl. |
| `prompts/README.md` | The prompt library, grouped by tool. |
| `examples/01-research-recap.mjs` | `marketStats` + `unusualActivity` + `sectorFlow` morning brief. |
| `examples/02-setup-finder.mjs` | `runScreener` → `ivRank` + `strategyIdeas`. |
| `examples/03-gamma-check.mjs` | `gexOverview` + `gexTicker` one-shot. |
| `examples/04-earnings-radar.mjs` | `earningsFlow` + `ivRank` for the week ahead. |
| `examples/package.json` | Depends on `@traderdaddy/sdk`; `recap`/`setups`/`gamma`/`earnings` scripts. |
| `scripts/get-your-key.md` | Developer-API upgrade → `td_live_` key walkthrough. |

## Running the examples

```bash
cd examples
npm install
node 01-research-recap.mjs      # or: npm run recap / setups / gamma / earnings
```

All four run **keyless** (`mock: !process.env.TD_API_KEY`) against SDK demo
fixtures — no key needed. Set `TD_API_KEY=td_live_…` to flip any of them to live.

## Connector surface (the server that already exists)

Stateless StreamableHTTP JSON-RPC 2.0 at `https://api.traderdaddy.pro/api/v1/mcp`
— a bare `tools/call` is accepted, no `initialize` handshake, one POST per call.

- **Static-header clients** (Cursor; Claude Desktop via `mcp-remote`) send
  `Authorization: Bearer td_live_…` **or** `X-API-Key: td_live_…`.
- **Claude web/mobile Connectors** can't send a static header → OAuth shim
  (`.well-known/oauth-*` + `/oauth/{register,authorize,token}`, PKCE). The user
  pastes their own key on the authorize page; the shim stores only its **hash**.

The 12 tools: `get_market_stats`, `get_unusual_activity`, `get_put_call_ratios`,
`get_gex_overview`, `get_gex_ticker`, `get_sector_flow`, `get_iv_rank`,
`run_screener`, `get_strategy_ideas`, `get_edge_xray`, `get_earnings_flow`,
`get_economic_calendar`. Example agents call them via the SDK's typed methods.

## Conventions (match these)

- **Examples stay keyless-first.** Every agent must run with no key against
  fixtures, and flip to live the instant `TD_API_KEY` is set. Adding an agent →
  copy the `mock: !process.env.TD_API_KEY` pattern.
- **Connector configs use `td_live_YOUR_KEY` placeholders — never a real key.**
- **Prompts are grouped by tool** in `prompts/README.md`; add new ones under the
  right tool heading.

## Gotchas

- **No backend work here.** If a task sounds like changing the server or OAuth
  shim, it's the wrong repo — this is configs, prompts, and example agents only.
- **Key safety: personal-use only.** Each user brings their own `td_live_` key in
  a local MCP config or the OAuth authorize page. **No secrets in this repo.**
- **SDK dep is `file:../../traderdaddy-sdk`** (from `examples/`) — the SDK's
  gitignored `dist/` must be built. Flip to `^0.1.0` on npm publish.
- **`expectedMovePct` fixtures are a whole percent** (`8.4` = 8.4%), not a
  fraction — don't multiply by 100 when formatting.

## Where to look when unsure

- The SDK's methods + response shapes → [SDK README](https://github.com/mphinance/traderdaddy-sdk#methods)
- Prompts to extend this repo → [`PROMPTS.md`](PROMPTS.md)
