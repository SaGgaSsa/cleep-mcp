# cleep-mcp

MCP server local (stdio) que expone los cleeps (ideas capturadas) del usuario consumiendo la API REST de `cleep-server`.

## Tools disponibles

| Tool | Descripción |
|------|-------------|
| `get_cleeps` | Trae los cleeps pendientes del usuario |
| `delete_cleeps` | Borra cleeps por IDs |

## Setup

### 1. Instalar dependencias y compilar

```bash
npm install
npm run build
```

### 2. Configurar en Claude Code

```bash
claude mcp add cleep -- env CLEEP_API_KEY=clp_xxx CLEEP_SERVER_URL=https://cleep-server.onrender.com node /ruta/absoluta/al/build/index.js
```

Reemplazá:
- `clp_xxx` con tu API key real
- `/ruta/absoluta/al/build/index.js` con la ruta absoluta al archivo compilado (ej: `/home/usuario/workspaces/projects/cleep/cleep-mcp/build/index.js`)

### 3. Verificar configuración

```bash
claude mcp list
```

## Variables de entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `CLEEP_API_KEY` | API key del usuario (`Authorization: Bearer <key>`) | Sí |
| `CLEEP_SERVER_URL` | Base URL del backend (ej: `https://cleep-server.onrender.com`) | Sí |

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
