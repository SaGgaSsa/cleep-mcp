import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// ── Types ──────────────────────────────────────────────────────────────────

interface Cleep {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

interface GetCleepsResponse {
  cleeps: Cleep[];
  count: number;
}

interface DeleteCleepsResponse {
  deleted: number;
  remaining: number;
}

// ── Config validation ──────────────────────────────────────────────────────

const apiKey = process.env.CLEEP_API_KEY;
const serverUrl = process.env.CLEEP_SERVER_URL;

if (!apiKey) {
  process.stderr.write("Error: CLEEP_API_KEY environment variable is required\n");
  process.exit(1);
}

if (!serverUrl) {
  process.stderr.write("Error: CLEEP_SERVER_URL environment variable is required\n");
  process.exit(1);
}

const BASE_URL = serverUrl.replace(/\/$/, "");

// ── API helpers ────────────────────────────────────────────────────────────

function authHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

async function getCleeps(): Promise<GetCleepsResponse> {
  const res = await fetch(`${BASE_URL}/cleeps`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GET /cleeps failed: ${res.status} ${res.statusText}${body ? ` — ${body}` : ""}`);
  }

  return res.json() as Promise<GetCleepsResponse>;
}

async function deleteCleeps(ids: string[]): Promise<DeleteCleepsResponse> {
  const res = await fetch(`${BASE_URL}/cleeps`, {
    method: "DELETE",
    headers: authHeaders(),
    body: JSON.stringify({ ids }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`DELETE /cleeps failed: ${res.status} ${res.statusText}${body ? ` — ${body}` : ""}`);
  }

  return res.json() as Promise<DeleteCleepsResponse>;
}

// ── Formatting ─────────────────────────────────────────────────────────────

function formatCleep(cleep: Cleep): string {
  const date = new Date(cleep.createdAt).toLocaleString("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  return `[${cleep.id}]\n${cleep.content}\nCapturado: ${date}`;
}

function formatCleepList(data: GetCleepsResponse): string {
  if (data.cleeps.length === 0) {
    return "No hay cleeps pendientes.";
  }

  const items = data.cleeps.map(formatCleep).join("\n\n---\n\n");
  return `${data.count} cleep${data.count !== 1 ? "s" : ""} pendiente${data.count !== 1 ? "s" : ""}:\n\n${items}`;
}

// ── MCP Server ─────────────────────────────────────────────────────────────

const server = new McpServer({
  name: "cleep-mcp",
  version: "1.0.0",
});

server.tool("get_cleeps", "Trae los cleeps (ideas capturadas) pendientes del usuario", {}, async () => {
  try {
    const data = await getCleeps();
    return {
      content: [{ type: "text", text: formatCleepList(data) }],
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: "text", text: `Error al obtener cleeps: ${message}` }],
      isError: true,
    };
  }
});

server.tool(
  "delete_cleeps",
  "Borra cleeps por IDs",
  { ids: z.array(z.string()).min(1).describe("IDs de los cleeps a borrar") },
  async ({ ids }) => {
    try {
      const data = await deleteCleeps(ids);
      return {
        content: [
          {
            type: "text",
            text: `Borrado${data.deleted !== 1 ? "s" : ""}: ${data.deleted} cleep${data.deleted !== 1 ? "s" : ""}. Restantes: ${data.remaining}.`,
          },
        ],
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text", text: `Error al borrar cleeps: ${message}` }],
        isError: true,
      };
    }
  }
);

// ── Start ──────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
