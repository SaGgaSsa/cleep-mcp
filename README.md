# cleep-mcp

MCP server local (stdio) que expone los cleeps (ideas capturadas) del usuario consumiendo la API REST de `cleep-server`.

## Public documentation

La guía pública para login, Claude Code, Codex, tools y project scoping vive en:

`https://cleep-web.vercel.app/documentation`

## Tools disponibles

| Tool | Descripción |
|------|-------------|
| `get_cleeps` | Trae los cleeps pendientes del usuario |
| `delete_cleeps` | Borra cleeps por IDs |

## Setup summary

1. Ejecutá `npx cleep-mcp login`
2. Terminá el login en el navegador
3. Registrá el MCP en Claude Code o Codex siguiendo la guía pública

La API key se guarda en `~/.cleep/config.json`.

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
