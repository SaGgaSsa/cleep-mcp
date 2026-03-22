import { exec } from "node:child_process";
import type { AuthStatusResponse, CleepConfig } from "./types.js";
import { resolveServerUrl, writeConfig } from "./config.js";

// ── Browser opener ──────────────────────────────────────────────────────────

function openBrowser(url: string): void {
  let command: string;
  if (process.env.WSL_DISTRO_NAME !== undefined) {
    command = `wslview "${url}" 2>/dev/null || xdg-open "${url}"`;
  } else if (process.platform === "darwin") {
    command = `open "${url}"`;
  } else if (process.platform === "win32") {
    command = `start "" "${url}"`;
  } else {
    command = `xdg-open "${url}"`;
  }
  exec(command);
}

// ── Polling ─────────────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 2000;
const TIMEOUT_MS = 120_000;

async function pollStatus(
  serverUrl: string,
  state: string,
): Promise<AuthStatusResponse> {
  const url = `${serverUrl}/auth/status?state=${encodeURIComponent(state)}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok && res.status !== 202) {
    const body = await res.text().catch(() => "");
    throw new Error(`Error al verificar estado de login: ${res.status}${body ? ` — ${body}` : ""}`);
  }
  return res.json() as Promise<AuthStatusResponse>;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Main login flow ─────────────────────────────────────────────────────────

export async function performLogin(): Promise<CleepConfig> {
  const serverUrl = resolveServerUrl();
  const state = crypto.randomUUID();
  const loginUrl = `${serverUrl}/auth/google?state=${encodeURIComponent(state)}`;

  process.stdout.write(`Abriendo el navegador para iniciar sesión...\n`);
  process.stdout.write(`Si el navegador no se abre, visitá:\n${loginUrl}\n\n`);
  openBrowser(loginUrl);

  const deadline = Date.now() + TIMEOUT_MS;

  while (Date.now() < deadline) {
    await sleep(POLL_INTERVAL_MS);

    const status = await pollStatus(serverUrl, state);

    if (status.status === "complete") {
      const config: CleepConfig = { apiKey: status.apiKey };
      writeConfig(config);
      return config;
    }
  }

  throw new Error("Tiempo de espera agotado. Intentá correr `npx cleep-mcp login` de nuevo.");
}
