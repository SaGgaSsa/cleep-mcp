#!/usr/bin/env node
import { basename } from "node:path";
import { performLogin } from "./login.js";

const args = process.argv.slice(2);

const projectArg = args.find((a) => a === "--project" || a.startsWith("--project="));
const command = projectArg !== undefined ? args.find((a) => !a.startsWith("-")) : args[0];

if (projectArg !== undefined) {
  const explicitValue = projectArg.includes("=") ? projectArg.split("=")[1] : undefined;
  process.env.CLEEP_PROJECT = explicitValue ?? basename(process.cwd());
}

switch (command) {
  case "login": {
    try {
      await performLogin();
      process.stdout.write(
        `Login exitoso. Tu clave API fue guardada en ~/.cleep/config.json\n`,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      process.stderr.write(`Error: ${message}\n`);
      process.exit(1);
    }
    break;
  }

  case undefined:
  case "serve": {
    // Start the MCP server
    await import("./server.js");
    break;
  }

  default: {
    process.stderr.write(`Uso: cleep-mcp <login|serve>\n`);
    process.exit(1);
  }
}
