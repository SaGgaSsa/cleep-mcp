# cleep-mcp

MCP server local (stdio) que expone los cleeps (ideas capturadas) del usuario consumiendo la API REST de `cleep-server`.

## Tools disponibles

| Tool | Descripción |
|------|-------------|
| `get_cleeps` | Trae los cleeps pendientes del usuario |
| `delete_cleeps` | Borra cleeps por IDs |

## Setup

### 1. Autenticarse

```bash
npx cleep-mcp login
```

Abre el navegador para iniciar sesión con Google y guarda la API key en `~/.cleep/config.json`.

### 2. Registrar en Claude Code

```bash
claude mcp add cleep -- npx -y cleep-mcp
```

### 2. Registrar en Codex

Agregá esto en `~/.codex/config.toml`:

```toml
[mcp_servers.cleep]
command = "npx"
args = ["-y", "cleep-mcp"]
```

---

No hace falta configurar nada más: la URL del servidor ya está fija en el código y la API key se lee de `~/.cleep/config.json`.

## Desarrollo

```bash
npm run dev    # compilación con watch
npm run build  # compilación única
```

## Estructura

```
cleep-mcp/
├── src/
│   └── index.ts    ← entry point, tools y server
├── build/          ← output compilado (generado por tsc)
├── package.json
├── tsconfig.json
└── README.md
```
