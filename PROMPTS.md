# Prompt pack — extend DaddyMCP

DaddyMCP connects TraderDaddy Pro's options-flow data to AI assistants (Claude,
Cursor, ChatGPT). This repo is **configs, prompts, and runnable example agents** —
no backend. Pick a prompt, paste it into your AI tool inside a clone of this repo,
and let it drive. The example agents run **keyless** so you can test with no key.

> **First, always:** tell your AI to read `CLAUDE.md` in this repo. It's the map.

---

## 1. Write a new example agent

```
I want to add a new runnable example agent to examples/. Read CLAUDE.md and one
existing agent (e.g. examples/01-research-recap.mjs) first to match the shape.

The agent's job: [describe it — e.g. "scan the biggest bullish flow, then pull
gamma for each of the top 3 tickers and summarize"].

Rules from CLAUDE.md:
- Instantiate keyless-first: `new TraderDaddy({ mock: !process.env.TD_API_KEY })`.
- Use the SDK's typed methods (see the SDK method table linked in CLAUDE.md).
- It must run with NO key against demo fixtures: `node examples/NN-name.mjs`.
- Add a script for it in examples/package.json.

Show me the plan and which methods you'll chain before writing code. Then run it
keyless and show me the output.
```

---

## 2. Add a connector config for another MCP client

```
I use [name your MCP client — e.g. Windsurf, Cline, a custom agent]. Help me add a
connector config for it to connectors/. Read CLAUDE.md and the existing
connectors/ files first (cursor.json, claude-desktop.json, generic.md).

Requirements:
- Point at https://api.traderdaddy.pro/api/v1/mcp (stateless JSON-RPC 2.0, one
  POST per call, bare tools/call — no initialize handshake).
- Auth is `Authorization: Bearer td_live_…` OR `X-API-Key: td_live_…`.
- Use a `td_live_YOUR_KEY` placeholder — NEVER a real key.
- Add a short "how to install this config" note matching the style of the others.

If the client can't send a static header, explain the OAuth-shim route instead
(see connectors/claude-connectors.md).
```

---

## 3. Add prompts to the library

```
Help me add prompts to prompts/README.md that show off what the AI can do with
this data. Read CLAUDE.md and the existing prompts/README.md first — prompts are
grouped by tool, so add mine under the right tool heading.

Ideas I want covered: [e.g. "a daily options-flow recap", "finding oversold names
with cheap IV", "checking if SPY gamma is positive right now"].

For each: write it as a natural-language prompt a user would type to their AI, and
note which tool(s) it exercises. Keep them concise and genuinely useful.
```

---

## 4. Set up your own assistant to use this

```
I'm a beginner and I want to connect TraderDaddy Pro's options-flow tools to my AI
assistant. Read CLAUDE.md and the connectors/ folder first. I use [Cursor / Claude
Desktop / Claude web / other].

Walk me through, step by step:
1. Getting my own td_live_ key (see scripts/get-your-key.md).
2. Which connector file applies to my client and exactly where the config goes.
3. Pasting my key in safely (personal-use only — it stays in my local config).
4. A first prompt to try from prompts/README.md to confirm it works.
Explain like I've never set up an MCP server before.
```

---

## 5. Contribute your addition back

```
I added something useful (an example agent, a connector, or prompts). Help me
contribute it back as a pull request. Read CLAUDE.md first.

Before opening the PR:
1. If it's an example agent, run it keyless (`node examples/NN-name.mjs`) and fix
   anything broken.
2. Double-check no real td_live_ key is anywhere in my changes — placeholders only.
3. Help me write a clear commit message and open the PR against `main` on GitHub.
Explain each step so I learn the flow.
```

---

## Tips

- **Everything runs keyless.** The example agents default to demo fixtures — test
  with no key, flip to live only when you set `TD_API_KEY`.
- **Never commit a real `td_live_` key.** Connector configs use
  `td_live_YOUR_KEY` placeholders; keys live in each user's local config only.
- **This repo has no backend.** If a change sounds like editing the MCP server or
  OAuth shim, it belongs elsewhere — here it's configs, prompts, and examples.
- **Data shapes** are in the [SDK README](https://github.com/mphinance/traderdaddy-sdk#methods).
