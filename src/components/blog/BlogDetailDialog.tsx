import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { BlogPost } from "@/data/blogs";
import { formatBlogDate } from "@/data/blogs";

type BlogDetailDialogProps = {
  post: BlogPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BlogDetailDialog({ post, open, onOpenChange }: BlogDetailDialogProps) {
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl gap-0 overflow-hidden p-0 sm:rounded-2xl [&>button]:right-3 [&>button]:top-3 [&>button]:rounded-full [&>button]:bg-white/90 [&>button]:text-navy [&>button]:shadow-sm [&>button]:hover:bg-white">
        {post.image ? (
          <div className="relative h-40 shrink-0 overflow-hidden md:h-48">
            <img
              src={post.image}
              alt={post.imageAlt || post.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-navy/20 to-transparent" />
          </div>
        ) : null}

        <div className={`overflow-y-auto px-6 pb-6 ${post.image ? "pt-5" : "pt-6"}`}>
          <DialogHeader className="gap-3 border-b border-border pb-4 text-left">
            <span className="inline-flex w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
              {post.category}
            </span>
            <DialogTitle className="text-left text-xl font-bold leading-snug text-text-strong md:text-2xl">
              {post.title}
            </DialogTitle>
            <DialogDescription className="text-left text-sm text-text-muted">
              {formatBlogDate(post.date)}
            </DialogDescription>
          </DialogHeader>

          <p className="pt-4 text-[15px] font-medium leading-relaxed text-text-strong">{post.summary}</p>

          <div className="space-y-4 pt-4 text-[15px] leading-[1.85] text-text-muted">
            {post.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
