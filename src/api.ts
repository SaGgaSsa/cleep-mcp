import type { DeleteCleepsResponse, GetCleepsResponse } from "./types.js";

// ── Auth error ──────────────────────────────────────────────────────────────

export class AuthError extends Error {
  constructor() {
    super("Tu clave API es inválida o expiró. Ejecutá: npx cleep-mcp login");
    this.name = "AuthError";
  }
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function authHeaders(apiKey: string): Record<string, string> {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

async function checkResponse(res: Response, label: string): Promise<void> {
  if (res.status === 401) throw new AuthError();
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `${label} failed: ${res.status} ${res.statusText}${body ? ` — ${body}` : ""}`,
    );
  }
}

// ── API calls ───────────────────────────────────────────────────────────────

export async function getCleeps(
  baseUrl: string,
  apiKey: string,
): Promise<GetCleepsResponse> {
  const res = await fetch(`${baseUrl}/cleeps`, {
    method: "GET",
    headers: authHeaders(apiKey),
  });
  await checkResponse(res, "GET /cleeps");
  return res.json() as Promise<GetCleepsResponse>;
}

export async function deleteCleeps(
  baseUrl: string,
  apiKey: string,
  ids: string[],
): Promise<DeleteCleepsResponse> {
  const res = await fetch(`${baseUrl}/cleeps`, {
    method: "DELETE",
    headers: authHeaders(apiKey),
    body: JSON.stringify({ ids }),
  });
  await checkResponse(res, "DELETE /cleeps");
  return res.json() as Promise<DeleteCleepsResponse>;
}
