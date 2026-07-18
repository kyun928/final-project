import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

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
const url = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: buckets, error: listError } = await supabase.storage.listBuckets();
if (listError) {
  console.error("listBuckets failed:", listError.message);
  process.exit(1);
}

if (buckets.some((b) => b.name === "inquiries")) {
  console.log("inquiries bucket already exists");
  process.exit(0);
}

const { error } = await supabase.storage.createBucket("inquiries", {
  public: false,
  fileSizeLimit: 1024 * 1024,
  allowedMimeTypes: ["application/json"],
});

if (error) {
  console.error("createBucket failed:", error.message);
  process.exit(1);
}

console.log("Created inquiries storage bucket");
