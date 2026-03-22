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

Sin filtro de proyecto (trae todos los cleeps):
```bash
claude mcp add cleep -- npx -y cleep-mcp
```

Con filtro por proyecto (usa el nombre de la carpeta actual):
```bash
claude mcp add cleep -- npx -y cleep-mcp --project
```

Con nombre de proyecto explícito:
```bash
claude mcp add cleep -- npx -y cleep-mcp --project=mi-proyecto
```

### 2. Registrar en Codex

Sin filtro de proyecto:
```toml
[mcp_servers.cleep]
command = "npx"
args = ["-y", "cleep-mcp"]
```

Con filtro por proyecto (carpeta actual):
```toml
[mcp_servers.cleep]
command = "npx"
args = ["-y", "cleep-mcp", "--project"]
```

Con nombre de proyecto explícito:
```toml
[mcp_servers.cleep]
command = "npx"
args = ["-y", "cleep-mcp", "--project=mi-proyecto"]
```

Agregá la configuración elegida en `~/.codex/config.toml`.

---

La URL del servidor ya está fija en el código y la API key se lee de `~/.cleep/config.json`.

**Sobre el flag `--project`:**
- `--project` — usa el nombre de la carpeta donde se ejecuta el MCP
- `--project=nombre` — usa el nombre especificado

Si el proyecto no existe en Cleep, se crea automáticamente al ejecutarse. Esto permite crear proyectos nuevos directamente desde el MCP sin necesidad de usar la app o la web.

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
