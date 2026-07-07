# Generic MCP client

Any MCP-capable client can reach TraderDaddy Pro directly — the endpoint is a
stateless StreamableHTTP JSON-RPC 2.0 server. A bare `tools/call` is accepted;
there's no `initialize` handshake, one POST per call.

## Endpoint

```
POST https://api.traderdaddy.pro/api/v1/mcp
Content-Type: application/json
```

## Auth

Send your own key. The server accepts **either** header (send both if unsure):

```
Authorization: Bearer td_live_YOUR_KEY
X-API-Key: td_live_YOUR_KEY
```

Requests inherit the `has_api_access` gate, the per-key rate limit, and usage
logging. Don't have a key yet? See [`../scripts/get-your-key.md`](../scripts/get-your-key.md).

## Listing tools

```bash
curl -s https://api.traderdaddy.pro/api/v1/mcp \
  -H "Authorization: Bearer td_live_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

## Calling a tool

```bash
curl -s https://api.traderdaddy.pro/api/v1/mcp \
  -H "Authorization: Bearer td_live_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "get_unusual_activity",
      "arguments": { "minPremium": 250000, "limit": 15 }
    }
  }'
```

## The 12 tools

| Tool | Arguments |
|---|---|
| `get_market_stats` | — |
| `get_unusual_activity` | `ticker?`, `direction?`, `minPremium?`, `limit?` |
| `get_put_call_ratios` | `ticker?` (default `SPY`) |
| `get_gex_overview` | — |
| `get_gex_ticker` | `symbol` |
| `get_sector_flow` | `window?` (default `today`) |
| `get_iv_rank` | `symbol?` |
| `run_screener` | `screener`, `limit?` |
| `get_strategy_ideas` | `symbol?` |
| `get_edge_xray` | `symbol?` |
| `get_earnings_flow` | `days?` (default `7`) |
| `get_economic_calendar` | — |

Prefer a typed client? [`@traderdaddy/sdk`](https://github.com/mphinance/traderdaddy-sdk)
wraps every one of these as a one-line method — see [`../examples/`](../examples/).
