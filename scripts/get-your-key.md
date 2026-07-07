# Get your API key

Everything in DaddyMCP — the connectors and the example agents — runs **keyless
in demo mode**. To point them at live TraderDaddy Pro data, you bring your own
`td_live_` key.

## Steps

1. Sign in at [traderdaddy.pro](https://traderdaddy.pro).
2. Upgrade to a plan with **Developer API access** (the `has_api_access` gate).
3. In the dashboard, generate an API key. It looks like `td_live_…`.
4. Use it wherever a connector or example asks:
   - **Cursor / Claude Desktop:** paste it into
     [`../connectors/cursor.json`](../connectors/cursor.json) or
     [`../connectors/claude-desktop.json`](../connectors/claude-desktop.json).
   - **Claude web/mobile:** paste it on the OAuth authorize page — see
     [`../connectors/claude-connectors.md`](../connectors/claude-connectors.md).
   - **Example agents:** `TD_API_KEY=td_live_... node examples/01-research-recap.mjs`

## Keep it safe

- A `td_live_` key is a **personal** credential. It belongs in a local config
  or an environment variable — never committed to a repo, pasted into a public
  page, or shipped inside a distributed extension.
- The OAuth shim stores only your key's **hash**, never the raw key.
- Rotate the key from the dashboard any time to revoke access.

## Limits

Requests inherit your plan's per-key rate limit and are usage-logged. The SDK
and the raw endpoint both return HTTP `429` (JSON-RPC `-32000`) when you're over
— the [`@traderdaddy/sdk`](https://github.com/mphinance/traderdaddy-sdk) handles
that with automatic backoff.
