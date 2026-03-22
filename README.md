# cleep-mcp

MCP server local (stdio) que expone los cleeps (ideas capturadas) del usuario consumiendo la API REST de `cleep-server`.

## Tools disponibles

| Tool | Descripción |
|------|-------------|
| `get_cleeps` | Trae los cleeps pendientes del usuario |
| `delete_cleeps` | Borra cleeps por IDs |

## Setup

### 1. Clonar, instalar y compilar

```bash
git clone <repo-url>
cd cleep-mcp
npm install
npm run build
```

### 2. Instalar globalmente

```bash
npm install -g .
```

Esto registra el comando `cleep-mcp` en el sistema. Solo hay que hacerlo una vez.

### 3. Autenticarse

```bash
cleep-mcp login
```

Abre el navegador para iniciar sesión con Google y guarda la API key en `~/.cleep/config.json`.

### 4. Registrar en Claude Code

```bash
claude mcp add cleep -- cleep-mcp
```

No hace falta configurar nada más: la URL del servidor ya está fija en el código y la API key se lee de `~/.cleep/config.json`.

### 5. Verificar

```bash
claude mcp list
```

---

**Alternativa sin instalación global:** pasá la ruta absoluta al binario compilado:

```bash
claude mcp add cleep -- env CLEEP_API_KEY=clp_xxx node /ruta/al/build/cli.js
```

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
