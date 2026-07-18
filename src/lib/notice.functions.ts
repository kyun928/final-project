import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdminAuth } from "@/lib/admin-auth-middleware";
import { noticeToInsert, noticeToUpdate, rowToNotice, sortNotices } from "@/lib/notice-mapper";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const SaveNoticeSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1),
  category: z.string().trim().min(1),
  summary: z.string().optional().default(""),
  image: z.string().optional().default(""),
  imageAlt: z.string().optional().default(""),
  content: z.array(z.string().trim().min(1)).min(1),
  pinned: z.boolean().optional().default(false),
  published: z.boolean(),
  author: z.string().optional().default("관리자"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

const DeleteNoticeSchema = z.object({
  id: z.string().uuid(),
});

function noticeErrorMessage(action: string, error: { message: string }) {
  if (error.message.includes("permission denied")) {
    return "데이터베이스 권한이 없습니다. Supabase SQL Editor에서 supabase/notices.sql 을 실행해 주세요.";
  }
  if (error.message.includes("Could not find the table")) {
    return "notices 테이블이 없습니다. Supabase SQL Editor에서 공지사항 테이블 생성 SQL을 먼저 실행해 주세요.";
  }
  return `${action}에 실패했습니다: ${error.message}`;
}

export const fetchPublishedNotices = createServerFn({ method: "GET" }).handler(async () => {
  const supabaseAdmin = getSupabaseAdmin();

  const { data, error } = await supabaseAdmin
    .from("notices")
    .select("*")
    .eq("published", true)
    .order("pinned", { ascending: false })
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[notice] fetchPublishedNotices:", error.message);
    throw new Error(noticeErrorMessage("공지사항 불러오기", error));
  }

  return sortNotices((data ?? []).map(rowToNotice));
});

export const fetchAdminNotices = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .handler(async () => {
    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from("notices")
      .select("*")
      .order("pinned", { ascending: false })
      .order("published_at", { ascending: false });

    if (error) {
      console.error("[notice] fetchAdminNotices:", error.message);
      throw new Error(noticeErrorMessage("공지사항 불러오기", error));
    }

    return (data ?? []).map(rowToNotice);
  });

export const saveNotice = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => SaveNoticeSchema.parse(data))
  .middleware([requireAdminAuth])
  .handler(async ({ data }) => {
    const supabaseAdmin = getSupabaseAdmin();
    const today = new Date().toISOString().slice(0, 10);
    const publishedAt = data.date ?? today;

    const payload = {
      title: data.title,
      category: data.category,
      summary: data.summary?.trim() || data.title.trim(),
      image: data.image?.trim() ?? "",
      imageAlt: data.imageAlt?.trim() ?? "",
      content: data.content,
      pinned: data.pinned ?? false,
      published: data.published,
      author: data.author?.trim() || "관리자",
      date: publishedAt,
    };

    if (data.id) {
      const { data: updated, error } = await supabaseAdmin
        .from("notices")
        .update(noticeToUpdate(payload))
        .eq("id", data.id)
        .select("*")
        .single();

      if (error) {
        console.error("[notice] saveNotice update:", error.message);
        throw new Error(noticeErrorMessage("공지사항 수정", error));
      }

      return rowToNotice(updated);
    }

    const { data: inserted, error } = await supabaseAdmin
      .from("notices")
      .insert(noticeToInsert(payload))
      .select("*")
      .single();

    if (error) {
      console.error("[notice] saveNotice insert:", error.message);
      throw new Error(noticeErrorMessage("공지사항 등록", error));
    }

    return rowToNotice(inserted);
  });

export const removeNotice = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => DeleteNoticeSchema.parse(data))
  .middleware([requireAdminAuth])
  .handler(async ({ data }) => {
    const supabaseAdmin = getSupabaseAdmin();

    const { error } = await supabaseAdmin.from("notices").delete().eq("id", data.id);

    if (error) {
      console.error("[notice] removeNotice:", error.message);
      throw new Error(noticeErrorMessage("공지사항 삭제", error));
    }

    return { ok: true as const };
  });
