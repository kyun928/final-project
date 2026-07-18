import type { Notice } from "@/data/notices";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type NoticeRow = Tables<"notices">;

export function rowToNotice(row: NoticeRow): Notice {
  return {
    id: row.id,
    title: row.title,
    date: row.published_at,
    category: row.category,
    pinned: row.pinned,
    image: row.image_url ?? "",
    imageAlt: row.image_alt ?? "",
    content: row.content ?? [],
    summary: row.summary ?? "",
    author: row.author ?? "관리자",
    published: row.published,
  };
}

export function noticeToInsert(
  notice: Pick<
    Notice,
    "title" | "category" | "summary" | "image" | "imageAlt" | "content" | "pinned" | "published" | "date" | "author"
  >,
): TablesInsert<"notices"> {
  return {
    title: notice.title,
    category: notice.category,
    summary: notice.summary?.trim() ?? "",
    image_url: notice.image.trim(),
    image_alt: notice.imageAlt.trim(),
    content: notice.content,
    pinned: notice.pinned ?? false,
    published: notice.published ?? false,
    published_at: notice.date,
    author: notice.author?.trim() || "관리자",
  };
}

export function noticeToUpdate(
  notice: Pick<
    Notice,
    "title" | "category" | "summary" | "image" | "imageAlt" | "content" | "pinned" | "published" | "date" | "author"
  >,
): TablesUpdate<"notices"> {
  return noticeToInsert(notice);
}

export function sortNotices(notices: Notice[]) {
  return [...notices].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.date.localeCompare(a.date);
  });
}
