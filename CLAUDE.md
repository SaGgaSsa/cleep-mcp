# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build   # compile TypeScript → build/
npm run dev     # watch mode
npm publish     # publish to npm (runs build automatically via prepublishOnly)
```

No linter or test suite configured.

## Architecture

stdio MCP server published to npm as `cleep-mcp`. Entry point is `src/cli.ts` (bin), which parses CLI args and either runs the login flow or starts the MCP server.

**Request flow:**
```
cli.ts → (dynamic import) server.ts → api.ts → cleep-server REST API
```

**Source files:**
- `cli.ts` — parses `login` command and `--project`/`--project=name` flag; sets `CLEEP_PROJECT` env var before importing `server.ts`
- `server.ts` — registers MCP tools (`get_cleeps`, `delete_cleeps`) using `@modelcontextprotocol/sdk`; reads config at startup
- `api.ts` — raw fetch calls to `cleep-server`; `getCleeps` accepts optional `project` param → appended as `?project=` query string
- `config.ts` — API key resolution (`CLEEP_API_KEY` env var → `~/.cleep/config.json`); server URL is hardcoded as `DEFAULT_SERVER_URL`
- `login.ts` — Google OAuth polling flow; opens browser, polls `/auth/status`, writes API key to `~/.cleep/config.json`
- `format.ts` — formats cleep list as human-readable text for MCP responses
- `types.ts` — shared TypeScript interfaces

**Key design decisions:**
- Server URL (`https://cleep-server.onrender.com`) is hardcoded — do not make it configurable via env var
- `--project` flag uses `basename(cwd)` as project name; `--project=name` uses the explicit value
- `server.ts` is imported dynamically so `CLEEP_PROJECT` can be set on `process.env` before the module initializes
- Only `build/` is included in the npm package (`files` field in `package.json`)
