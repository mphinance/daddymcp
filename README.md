# DaddyMCP

> Connect TraderDaddy Pro's options-flow data to your **AI assistant** (Claude,
> Cursor, ChatGPT) — a one-click MCP connector plus example agents.

**Status:** 🚧 Spec only — not built yet. This README is the build brief.

Part of the [TraderDaddy Pro](https://traderdaddy.pro) open-source family, alongside
[DaddyBoard](https://github.com/mphinance/daddyboard). Mostly independent of the
SDK — can be built any time; its example agents showcase the SDK.

---

## Why this exists

TraderDaddy Pro already runs a **public customer MCP endpoint** with an OAuth
shim (built for exactly this). DaddyMCP packages the "add options flow to your
AI" story into a clean, discoverable repo — riding the 2026 wave of people wiring
MCP servers into their assistants. It's the most on-brand distribution channel
the platform has: your data, inside the tool the customer is already asking
questions in.

## What it does

This repo is **config + docs + examples**, not a new server (the server already
exists at `POST /api/v1/mcp`):

- **One-click connector configs** for Claude Desktop, Claude web/mobile
  Connectors (via the existing OAuth shim), Cursor, and any MCP-capable client.
  Copy-paste JSON + a short "paste your `td_live_` key" walkthrough.
- **Example prompts** — "what did smart money do today?", "find me a CSP-wheel
  setup", "is SPY gamma positive or negative right now?"
- **Example agents** — small scripts (LangChain / a plain loop) that call the API
  via [`@traderdaddy/sdk`](https://github.com/mphinance/traderdaddy-sdk) to do
  multi-step research. These double as SDK documentation.

## Connector surfaces (from the platform's existing shim)

- Static-header clients (Cursor, Claude Desktop): `Authorization: Bearer td_live_…`
  or `X-API-Key: td_live_…` straight to `/api/v1/mcp`.
- Claude web/mobile Connectors UI (can't send a static header): uses the OAuth
  shim — `.well-known/oauth-*` + `/oauth/{register,authorize,token}` (PKCE). The
  user pastes their own `td_live_` key on the authorize page.

## Available tools (what the AI can call)

`get_market_stats`, `get_unusual_activity`, `get_put_call_ratios`,
`get_gex_overview`, `get_gex_ticker`, `get_sector_flow`, `get_iv_rank`,
`run_screener`, `get_strategy_ideas`, `get_edge_xray`, `get_earnings_flow`,
`get_economic_calendar`.

## Key-safety model

Personal-use: each user brings their own `td_live_` key (static header, or pasted
into the OAuth authorize page — which stores only the key's hash, never the raw
key). No secrets in this repo.

## Build milestones

1. Write the connector configs (Claude Desktop JSON, Cursor, Claude Connectors
   via OAuth) with screenshots.
2. Curated example-prompt library.
3. 2–3 example agents on `@traderdaddy/sdk` (research recap, setup finder).
4. Short "get your key" walkthrough linking to the Developer API upgrade.

## Picking this up in a new session

Reference the TraderDaddy Pro MCP docs (public endpoint + OAuth shim) — the
server side already exists, so this is packaging and examples, not backend work.
Independent of the SDK for the connector docs; the example agents need
[`traderdaddy-sdk`](https://github.com/mphinance/traderdaddy-sdk). Good
parallel-track project any time.
