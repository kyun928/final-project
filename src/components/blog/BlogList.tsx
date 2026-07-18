import { useEffect, useState } from "react";
import { Calendar, ChevronRight } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";

import { BlogDetailDialog } from "@/components/blog/BlogDetailDialog";
import type { BlogPost } from "@/data/blogs";
import { formatBlogDate } from "@/data/blogs";
import { fetchPublishedBlogs } from "@/lib/blog.functions";

type BlogListProps = {
  onCountChange?: (count: number) => void;
};

export function BlogList({ onCountChange }: BlogListProps) {
  const loadBlogs = useServerFn(fetchPublishedBlogs);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<BlogPost | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await loadBlogs();
        if (!cancelled) {
          setPosts(data);
          onCountChange?.(data.length);
        }
      } catch {
        if (!cancelled) {
          setError("블로그 글을 불러오지 못했습니다.");
          onCountChange?.(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [loadBlogs, onCountChange]);

  const openPost = (post: BlogPost) => {
    setSelected(post);
    setOpen(true);
  };

  if (loading) {
    return (
      <div className="mt-10 rounded-2xl border border-border bg-surface px-6 py-16 text-center text-text-muted">
        블로그 글을 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10 rounded-2xl border border-border bg-surface px-6 py-16 text-center text-destructive">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-border bg-surface px-6 py-16 text-center text-text-muted">
        등록된 블로그 글이 없습니다.
      </div>
    );
  }

  return (
    <>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-md"
          >
            <button
              type="button"
              onClick={() => openPost(post)}
              className="flex h-full flex-col text-left"
            >
              {post.image ? (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.imageAlt || post.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                    {post.category}
                  </span>
                </div>
              ) : (
                <div className="relative flex aspect-[16/10] items-end bg-surface-blue/60 p-5">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                    {post.category}
                  </span>
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <h2 className="text-[16px] font-bold leading-snug text-text-strong group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-text-muted">
                  {post.summary}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-text-muted">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    {formatBlogDate(post.date)}
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium text-primary">
                    자세히 보기
                    <ChevronRight className="size-3.5" />
                  </span>
                </div>
              </div>
            </button>
          </article>
        ))}
      </div>

      <BlogDetailDialog
        post={selected}
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setSelected(null);
        }}
      />
    </>
  );
}
