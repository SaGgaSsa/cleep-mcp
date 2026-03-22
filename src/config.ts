import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import type { CleepConfig } from "./types.js";

// ── Constants ───────────────────────────────────────────────────────────────

export const DEFAULT_SERVER_URL = "https://cleep-server.onrender.com";

const CONFIG_PATH = join(homedir(), ".cleep", "config.json");

// ── Read / Write ────────────────────────────────────────────────────────────

export function readConfig(): CleepConfig | null {
  try {
    const raw = readFileSync(CONFIG_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "apiKey" in parsed &&
      typeof (parsed as Record<string, unknown>).apiKey === "string"
    ) {
      return parsed as CleepConfig;
    }
    return null;
  } catch {
    return null;
  }
}

export function writeConfig(config: CleepConfig): void {
  mkdirSync(dirname(CONFIG_PATH), { recursive: true });
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), {
    encoding: "utf8",
    mode: 0o600,
  });
}

// ── Resolution ──────────────────────────────────────────────────────────────

export function resolveApiKey(): string | null {
  return process.env.CLEEP_API_KEY ?? readConfig()?.apiKey ?? null;
}

export function resolveServerUrl(): string {
  const url =
    process.env.CLEEP_SERVER_URL ?? readConfig()?.serverUrl ?? DEFAULT_SERVER_URL;
  return url.replace(/\/$/, "");
}
