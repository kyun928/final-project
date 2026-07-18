import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const env = {};
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) {
    throw new Error(".env not found");
  }

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

console.log("Existing buckets:", buckets.map((b) => b.name).join(", ") || "(none)");

const existing = buckets.find((b) => b.name === "blog-images");
if (existing) {
  console.log("blog-images already exists");
  process.exit(0);
}

const { data, error } = await supabase.storage.createBucket("blog-images", {
  public: true,
  fileSizeLimit: 5242880,
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
});

if (error) {
  console.error("createBucket failed:", error.message);
  process.exit(1);
}

console.log("Created bucket:", data?.name || "blog-images");
