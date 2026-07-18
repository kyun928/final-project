import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const env = {};
  for (const line of readFileSync(resolve(process.cwd(), ".env"), "utf8").split(/\r?\n/)) {
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
const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

console.log("=== business_areas table ===");
const table = await supabase.from("business_areas").select("id").limit(1);
if (table.error) {
  console.log("TABLE: MISSING —", table.error.message);
  console.log("Run supabase/business_areas.sql in Supabase SQL Editor.");
} else {
  console.log("TABLE: EXISTS");
}

console.log("=== business-areas storage bucket ===");
const buckets = await supabase.storage.listBuckets();
const names = (buckets.data || []).map((b) => b.name);
if (names.includes("business-areas")) {
  console.log("BUCKET: EXISTS");
} else {
  const { error } = await supabase.storage.createBucket("business-areas", {
    public: false,
    fileSizeLimit: 1024 * 1024,
    allowedMimeTypes: ["application/json"],
  });
  if (error) {
    console.log("BUCKET CREATE FAILED:", error.message);
  } else {
    console.log("BUCKET: CREATED");
  }
}
