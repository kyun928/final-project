import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

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
const supabase = createClient(env.SUPABASE_URL || env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const id = randomUUID();
const inquiry = {
  id,
  name: "테스트",
  company: "테스트회사",
  phone: "010-0000-0000",
  email: "test@example.com",
  category: "기타 문의",
  budget: "",
  schedule: "",
  message: "문의 저장 테스트입니다.",
  consent: true,
  replied: false,
  repliedAt: null,
  adminNote: "",
  createdAt: new Date().toISOString(),
};

const bytes = new TextEncoder().encode(JSON.stringify(inquiry));
const { error } = await supabase.storage.from("inquiries").upload(`entries/${id}.json`, bytes, {
  contentType: "application/json",
  upsert: true,
});

if (error) {
  console.error("upload failed:", error.message);
  process.exit(1);
}

const { data, error: listError } = await supabase.storage.from("inquiries").list("entries");
if (listError) {
  console.error("list failed:", listError.message);
  process.exit(1);
}

console.log("upload ok", id);
console.log("files", data.length);

await supabase.storage.from("inquiries").remove([`entries/${id}.json`]);
console.log("cleanup ok");
