import type { Cleep, GetCleepsResponse } from "./types.js";

export function formatCleep(cleep: Cleep): string {
  const date = new Date(cleep.createdAt).toLocaleString("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  return `[${cleep.id}]\n${cleep.content}\nCapturado: ${date}`;
}

export function formatCleepList(data: GetCleepsResponse): string {
  if (data.cleeps.length === 0) {
    return "No hay cleeps pendientes.";
  }

  const items = data.cleeps.map(formatCleep).join("\n\n---\n\n");
  const count = data.count;
  return `${count} cleep${count !== 1 ? "s" : ""} pendiente${count !== 1 ? "s" : ""}:\n\n${items}`;
}
