import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdminAuth } from "@/lib/admin-auth-middleware";
import { blogPostToInsert, blogPostToUpdate, rowToBlogPost } from "@/lib/blog-mapper";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const SaveBlogSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1),
  category: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  image: z.string().optional().default(""),
  imageAlt: z.string().optional().default(""),
  content: z.array(z.string().trim().min(1)).min(1),
  published: z.boolean(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

function blogErrorMessage(action: string, error: { message: string }) {
  if (error.message.includes("permission denied")) {
    return "데이터베이스 권한이 없습니다. Supabase SQL Editor에서 supabase/blog_posts_grants.sql 을 실행해 주세요.";
  }
  if (error.message.includes("Could not find the table")) {
    return "blog_posts 테이블이 없습니다. Supabase SQL Editor에서 블로그 테이블 생성 SQL을 먼저 실행해 주세요.";
  }
  return `${action}에 실패했습니다: ${error.message}`;
}

const DeleteBlogSchema = z.object({
  id: z.string().uuid(),
});

export const fetchPublishedBlogs = createServerFn({ method: "GET" }).handler(async () => {
  const supabaseAdmin = getSupabaseAdmin();

  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[blog] fetchPublishedBlogs:", error.message);
    throw new Error(blogErrorMessage("블로그 글 불러오기", error));
  }

  return (data ?? []).map(rowToBlogPost);
});

export const fetchAdminBlogs = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .handler(async () => {
    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("[blog] fetchAdminBlogs:", error.message);
      throw new Error(blogErrorMessage("블로그 글 불러오기", error));
    }

    return (data ?? []).map(rowToBlogPost);
  });

export const saveBlogPost = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => SaveBlogSchema.parse(data))
  .middleware([requireAdminAuth])
  .handler(async ({ data }) => {
    const supabaseAdmin = getSupabaseAdmin();
    const today = new Date().toISOString().slice(0, 10);
    const publishedAt = data.date ?? today;

    const payload = {
      title: data.title,
      category: data.category,
      summary: data.summary,
      image: data.image?.trim() ?? "",
      imageAlt: data.imageAlt?.trim() ?? "",
      content: data.content,
      published: data.published,
      date: publishedAt,
    };

    if (data.id) {
      const { data: updated, error } = await supabaseAdmin
        .from("blog_posts")
        .update(blogPostToUpdate(payload))
        .eq("id", data.id)
        .select("*")
        .single();

      if (error) {
        console.error("[blog] saveBlogPost update:", error.message);
        throw new Error(blogErrorMessage("블로그 글 수정", error));
      }

      return rowToBlogPost(updated);
    }

    const { data: inserted, error } = await supabaseAdmin
      .from("blog_posts")
      .insert(blogPostToInsert(payload))
      .select("*")
      .single();

    if (error) {
      console.error("[blog] saveBlogPost insert:", error.message);
      throw new Error(blogErrorMessage("블로그 글 등록", error));
    }

    return rowToBlogPost(inserted);
  });

export const removeBlogPost = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => DeleteBlogSchema.parse(data))
  .middleware([requireAdminAuth])
  .handler(async ({ data }) => {
    const supabaseAdmin = getSupabaseAdmin();

    const { error } = await supabaseAdmin.from("blog_posts").delete().eq("id", data.id);

    if (error) {
      console.error("[blog] removeBlogPost:", error.message);
      throw new Error(blogErrorMessage("블로그 글 삭제", error));
    }

    return { ok: true as const };
  });
