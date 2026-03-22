import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { AuthError, deleteCleeps, getCleeps } from "./api.js";
import { resolveApiKey, resolveServerUrl } from "./config.js";
import { formatCleepList } from "./format.js";

// ── Config ──────────────────────────────────────────────────────────────────

const apiKey = resolveApiKey();
const baseUrl = resolveServerUrl();

const NO_KEY_MESSAGE =
  "No hay clave API configurada. Ejecutá: npx cleep-mcp login";

function errorMessage(err: unknown): string {
  if (err instanceof AuthError) return err.message;
  return err instanceof Error ? err.message : String(err);
}

// ── MCP Server ──────────────────────────────────────────────────────────────

const server = new McpServer({
  name: "cleep-mcp",
  version: "1.0.0",
});

server.tool("get_cleeps", "Trae los cleeps (ideas capturadas) pendientes del usuario", {}, async () => {
  if (apiKey === null) {
    return {
      content: [{ type: "text", text: NO_KEY_MESSAGE }],
      isError: true,
    };
  }

  try {
    const data = await getCleeps(baseUrl, apiKey);
    return {
      content: [{ type: "text", text: formatCleepList(data) }],
    };
  } catch (err) {
    return {
      content: [{ type: "text", text: `Error al obtener cleeps: ${errorMessage(err)}` }],
      isError: true,
    };
  }
});

server.tool(
  "delete_cleeps",
  "Borra cleeps por IDs",
  { ids: z.array(z.string()).min(1).describe("IDs de los cleeps a borrar") },
  async ({ ids }) => {
    if (apiKey === null) {
      return {
        content: [{ type: "text", text: NO_KEY_MESSAGE }],
        isError: true,
      };
    }

    try {
      const data = await deleteCleeps(baseUrl, apiKey, ids);
      return {
        content: [
          {
            type: "text",
            text: `Borrado${data.deleted !== 1 ? "s" : ""}: ${data.deleted} cleep${data.deleted !== 1 ? "s" : ""}. Restantes: ${data.remaining}.`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Error al borrar cleeps: ${errorMessage(err)}` }],
        isError: true,
      };
    }
  },
);

// ── Start ───────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
