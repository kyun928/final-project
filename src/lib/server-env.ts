import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

let fileEnv: Record<string, string> | null = null;

function loadEnvFile(): Record<string, string> {
  if (fileEnv) return fileEnv;

  fileEnv = {};
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return fileEnv;

  const content = readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key) fileEnv[key] = value;
  }

  return fileEnv;
}

/** Server-only env lookup: process.env first, then .env file (dev). */
export function getServerEnv(key: string): string | undefined {
  const fromProcess = process.env[key];
  if (fromProcess) return fromProcess;
  return loadEnvFile()[key];
}
