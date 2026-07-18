import type { Inquiry } from "@/data/inquiries";
import { inquiryToInsert, rowToInquiry } from "@/lib/inquiry-mapper";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const INQUIRIES_BUCKET = "inquiries";

type InquiryInput = {
  name: string;
  company: string;
  phone: string;
  email: string;
  category: string;
  budget?: string;
  schedule?: string;
  message: string;
  consent: boolean;
};

function isMissingTable(error: { message: string }) {
  const message = error.message.toLowerCase();
  return (
    message.includes("could not find the table") ||
    message.includes("schema cache") ||
    message.includes("does not exist")
  );
}

async function ensureInquiriesBucket() {
  const supabaseAdmin = getSupabaseAdmin();
  const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
  if (listError) {
    console.error("[inquiry-store] listBuckets:", listError.message);
    throw new Error(`문의 저장소를 확인하지 못했습니다: ${listError.message}`);
  }

  if (buckets?.some((bucket) => bucket.name === INQUIRIES_BUCKET)) {
    return;
  }

  const { error } = await supabaseAdmin.storage.createBucket(INQUIRIES_BUCKET, {
    public: false,
    fileSizeLimit: 1024 * 1024,
    allowedMimeTypes: ["application/json"],
  });

  if (error && !error.message.toLowerCase().includes("already exists")) {
    console.error("[inquiry-store] createBucket:", error.message);
    throw new Error(`문의 저장소 생성에 실패했습니다: ${error.message}`);
  }
}

function inquiryFilePath(id: string) {
  return `entries/${id}.json`;
}

async function saveInquiryToStorage(inquiry: Inquiry) {
  await ensureInquiriesBucket();
  const supabaseAdmin = getSupabaseAdmin();
  const bytes = new TextEncoder().encode(JSON.stringify(inquiry, null, 2));

  const { error } = await supabaseAdmin.storage
    .from(INQUIRIES_BUCKET)
    .upload(inquiryFilePath(inquiry.id), bytes, {
      contentType: "application/json",
      upsert: true,
      cacheControl: "0",
    });

  if (error) {
    console.error("[inquiry-store] upload:", error.message);
    throw new Error(`문의 저장에 실패했습니다: ${error.message}`);
  }

  return inquiry;
}

async function listInquiriesFromStorage(): Promise<Inquiry[]> {
  await ensureInquiriesBucket();
  const supabaseAdmin = getSupabaseAdmin();

  const { data: files, error } = await supabaseAdmin.storage
    .from(INQUIRIES_BUCKET)
    .list("entries", { limit: 1000, sortBy: { column: "name", order: "desc" } });

  if (error) {
    console.error("[inquiry-store] list:", error.message);
    throw new Error(`문의 목록을 불러오지 못했습니다: ${error.message}`);
  }

  const inquiries: Inquiry[] = [];

  for (const file of files ?? []) {
    if (!file.name.endsWith(".json")) continue;

    const { data, error: downloadError } = await supabaseAdmin.storage
      .from(INQUIRIES_BUCKET)
      .download(`entries/${file.name}`);

    if (downloadError || !data) {
      console.error("[inquiry-store] download:", downloadError?.message);
      continue;
    }

    try {
      inquiries.push(JSON.parse(await data.text()) as Inquiry);
    } catch (parseError) {
      console.error("[inquiry-store] parse:", parseError);
    }
  }

  return inquiries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function getInquiryFromStorage(id: string): Promise<Inquiry | null> {
  await ensureInquiriesBucket();
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin.storage
    .from(INQUIRIES_BUCKET)
    .download(inquiryFilePath(id));

  if (error || !data) {
    return null;
  }

  return JSON.parse(await data.text()) as Inquiry;
}

export async function persistInquiry(input: InquiryInput): Promise<Inquiry> {
  const supabaseAdmin = getSupabaseAdmin();
  const insertPayload = inquiryToInsert(input);

  const { data, error } = await supabaseAdmin
    .from("inquiries")
    .insert(insertPayload)
    .select("*")
    .single();

  if (!error && data) {
    return rowToInquiry(data);
  }

  if (error && !isMissingTable(error)) {
    console.error("[inquiry-store] insert:", error.message);
    throw new Error(`문의 접수에 실패했습니다: ${error.message}`);
  }

  console.warn("[inquiry-store] inquiries table missing — using Storage fallback");

  const now = new Date().toISOString();
  const inquiry: Inquiry = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    company: input.company.trim(),
    phone: input.phone.trim(),
    email: input.email.trim(),
    category: input.category.trim(),
    budget: input.budget?.trim() ?? "",
    schedule: input.schedule?.trim() ?? "",
    message: input.message.trim(),
    consent: input.consent,
    replied: false,
    repliedAt: null,
    adminNote: "",
    createdAt: now,
  };

  return saveInquiryToStorage(inquiry);
}

export async function loadAdminInquiries(): Promise<Inquiry[]> {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (!error) {
    return (data ?? []).map(rowToInquiry);
  }

  if (!isMissingTable(error)) {
    console.error("[inquiry-store] select:", error.message);
    throw new Error(`문의 목록 불러오기에 실패했습니다: ${error.message}`);
  }

  console.warn("[inquiry-store] inquiries table missing — reading from Storage");
  return listInquiriesFromStorage();
}

export async function setInquiryReply(input: {
  id: string;
  replied: boolean;
  adminNote?: string;
}): Promise<Inquiry> {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("inquiries")
    .update({
      replied: input.replied,
      replied_at: input.replied ? new Date().toISOString() : null,
      admin_note: input.adminNote?.trim() ?? "",
    })
    .eq("id", input.id)
    .select("*")
    .single();

  if (!error && data) {
    return rowToInquiry(data);
  }

  if (error && !isMissingTable(error)) {
    console.error("[inquiry-store] update:", error.message);
    throw new Error(`회신 상태 업데이트에 실패했습니다: ${error.message}`);
  }

  const existing = await getInquiryFromStorage(input.id);
  if (!existing) {
    throw new Error("문의를 찾을 수 없습니다.");
  }

  const updated: Inquiry = {
    ...existing,
    replied: input.replied,
    repliedAt: input.replied ? new Date().toISOString() : null,
    adminNote: input.adminNote?.trim() ?? "",
  };

  return saveInquiryToStorage(updated);
}
