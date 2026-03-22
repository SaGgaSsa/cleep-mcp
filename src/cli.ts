#!/usr/bin/env node
import { performLogin } from "./login.js";

const command = process.argv[2];

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
