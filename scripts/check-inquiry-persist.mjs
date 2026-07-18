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

if (!url || !key) {
  console.error("Missing Supabase env");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

console.log("=== TABLE public.inquiries ===");
const table = await supabase
  .from("inquiries")
  .select("id,name,company,category,replied,created_at")
  .order("created_at", { ascending: false })
  .limit(10);

if (table.error) {
  console.log("STATUS: MISSING/ERROR");
  console.log(table.error.message);
} else {
  console.log("STATUS: EXISTS");
  console.log("ROW_COUNT_SAMPLE:", table.data?.length ?? 0);
  console.log(JSON.stringify(table.data, null, 2));
}

console.log("\n=== STORAGE bucket inquiries ===");
const buckets = await supabase.storage.listBuckets();
const names = (buckets.data || []).map((b) => b.name);
console.log("buckets:", names.join(", ") || "(none)");

const listed = await supabase.storage.from("inquiries").list("entries", { limit: 50 });
if (listed.error) {
  console.log("storage list ERROR:", listed.error.message);
} else {
  console.log("storage files:", listed.data?.length ?? 0);
  for (const file of listed.data || []) {
    console.log("-", file.name);
  }
}
