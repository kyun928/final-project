import type { BlogPost } from "@/data/blogs";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type BlogPostRow = Tables<"blog_posts">;

export function rowToBlogPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    title: row.title,
    date: row.published_at,
    category: row.category,
    summary: row.summary,
    image: row.image_url ?? "",
    imageAlt: row.image_alt ?? "",
    content: row.content ?? [],
    published: row.published,
  };
}

export function blogPostToInsert(
  post: Pick<BlogPost, "title" | "category" | "summary" | "image" | "imageAlt" | "content" | "published" | "date">,
): TablesInsert<"blog_posts"> {
  return {
    title: post.title,
    category: post.category,
    summary: post.summary,
    image_url: post.image.trim(),
    image_alt: post.imageAlt.trim(),
    content: post.content,
    published: post.published,
    published_at: post.date,
  };
}

export function blogPostToUpdate(
  post: Pick<BlogPost, "title" | "category" | "summary" | "image" | "imageAlt" | "content" | "published" | "date">,
): TablesUpdate<"blog_posts"> {
  return blogPostToInsert(post);
}
