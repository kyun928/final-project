import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  const env = {};
  const content = readFileSync(resolve(process.cwd(), ".env"), "utf8");
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
    env[key] = value;
  }
  return env;
}

const env = loadEnv();
const url = (env.SUPABASE_URL || env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
const key = env.SUPABASE_SERVICE_ROLE_KEY;
const sql = readFileSync(resolve(process.cwd(), "supabase/inquiries.sql"), "utf8");

if (!url || !key) {
  console.error("Missing Supabase env");
  process.exit(1);
}

const candidates = [
  `${url}/pg/query`,
  `${url}/postgres/v1/query`,
  `${url}/rest/v1/rpc/exec_sql`,
];

for (const endpoint of candidates) {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ query: sql }),
    });
    const text = await res.text();
    console.log("---", endpoint, res.status);
    console.log(text.slice(0, 500));
  } catch (err) {
    console.log("---", endpoint, "ERROR", err.message);
  }
}
