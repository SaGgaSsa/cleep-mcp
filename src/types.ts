// ── Domain types ───────────────────────────────────────────────────────────

export interface Cleep {
  readonly id: string;
  readonly userId: string;
  readonly content: string;
  readonly createdAt: string;
}

export interface GetCleepsResponse {
  readonly cleeps: Cleep[];
  readonly count: number;
}

export interface DeleteCleepsResponse {
  readonly deleted: number;
  readonly remaining: number;
}

// ── Config types ────────────────────────────────────────────────────────────

export interface CleepConfig {
  readonly apiKey: string;
}

export interface AuthStatusPending {
  readonly status: "pending";
}

export interface AuthStatusComplete {
  readonly status: "complete";
  readonly apiKey: string;
  readonly email: string;
}

export type AuthStatusResponse = AuthStatusPending | AuthStatusComplete;
