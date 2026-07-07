# Claude web & mobile — Custom Connector

Claude's web and mobile apps connect to MCP servers through the **Connectors**
UI, which can't send a static API-key header. TraderDaddy Pro handles this with
an **OAuth shim**: you add the connector by URL, click through an authorize
page, and paste your own `td_live_` key there once. The shim stores only the
key's **hash** — never the raw key.

> Static-header clients (Cursor, Claude Desktop) don't need any of this — see
> [`cursor.json`](cursor.json) and [`claude-desktop.json`](claude-desktop.json).

## Steps

1. **Settings → Connectors → Add custom connector.**
2. **Name:** `TraderDaddy Pro`
3. **URL:** `https://api.traderdaddy.pro/api/v1/mcp`
   Claude discovers the OAuth endpoints automatically via
   `.well-known/oauth-authorization-server` and
   `.well-known/oauth-protected-resource`.
4. Claude registers itself (`/oauth/register`) and opens the **authorize** page
   (`/oauth/authorize`, PKCE).
5. On that page, **paste your `td_live_` key** and approve. The shim exchanges
   the code for a token bound to your key's hash (`/oauth/token`).
6. Done — start a chat and ask Claude to *"check today's unusual options flow."*

## What the shim exposes

- `GET /.well-known/oauth-authorization-server`
- `GET /.well-known/oauth-protected-resource`
- `POST /oauth/register` — dynamic client registration
- `GET  /oauth/authorize` — the paste-your-key page (PKCE)
- `POST /oauth/token` — code → access token

## Key safety

Your raw `td_live_` key never leaves the authorize page in a reusable form — the
shim persists only its hash and issues a scoped token. Revoke access any time
from the TraderDaddy Pro dashboard by rotating the key.

_Screenshots: TODO — capture the Add-connector dialog and the authorize page._
