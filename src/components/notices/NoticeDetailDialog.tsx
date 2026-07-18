import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Notice } from "@/data/notices";
import { formatNoticeDate } from "@/data/notices";

type NoticeDetailDialogProps = {
  notice: Notice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function NoticeDetailDialog({ notice, open, onOpenChange }: NoticeDetailDialogProps) {
  if (!notice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl gap-0 overflow-hidden p-0 sm:rounded-2xl [&>button]:right-3 [&>button]:top-3 [&>button]:rounded-full [&>button]:bg-white/90 [&>button]:text-navy [&>button]:shadow-sm [&>button]:hover:bg-white">
        {notice.image ? (
          <div className="relative h-24 shrink-0 overflow-hidden md:h-28">
            <img
              src={notice.image}
              alt={notice.imageAlt || notice.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-navy/15 to-transparent" />
          </div>
        ) : null}

        <div className={`overflow-y-auto px-6 pb-6 ${notice.image ? "pt-5" : "pt-6"}`}>
          <DialogHeader className="gap-3 border-b border-border pb-4 text-left">
            <div className="flex flex-wrap items-center gap-2 pr-8">
              <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                {notice.category}
              </span>
              {notice.pinned && (
                <span className="inline-flex rounded-full bg-navy px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  중요
                </span>
              )}
            </div>
            <DialogTitle className="text-left text-xl font-bold leading-snug text-text-strong md:text-2xl">
              {notice.title}
            </DialogTitle>
            <DialogDescription className="text-left text-sm text-text-muted">
              등록일 {formatNoticeDate(notice.date)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4 text-[15px] leading-[1.85] text-text-muted">
            {notice.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
