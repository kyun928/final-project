import { useEffect, useState } from "react";
import { ChevronRight, Pin } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";

import { NoticeDetailDialog } from "@/components/notices/NoticeDetailDialog";
import { formatNoticeDate, type Notice } from "@/data/notices";
import { fetchPublishedNotices } from "@/lib/notice.functions";
import { cn } from "@/lib/utils";

type NoticeListProps = {
  onCountChange?: (count: number) => void;
};

export function NoticeList({ onCountChange }: NoticeListProps) {
  const loadNotices = useServerFn(fetchPublishedNotices);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Notice | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await loadNotices();
        if (!cancelled) {
          setNotices(data);
          onCountChange?.(data.length);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "공지사항을 불러오지 못했습니다.";
          setError(message);
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
  }, [loadNotices, onCountChange]);

  const openNotice = (notice: Notice) => {
    setSelected(notice);
    setOpen(true);
  };

  if (loading) {
    return (
      <div className="mt-10 rounded-2xl border border-border bg-surface px-6 py-16 text-center text-text-muted">
        공지사항을 불러오는 중...
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

  if (notices.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-border bg-surface px-6 py-16 text-center text-text-muted">
        등록된 공지사항이 없습니다.
      </div>
    );
  }

  return (
    <>
      <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-white">
        <div className="hidden md:grid grid-cols-[1fr_120px_100px] gap-4 border-b border-border bg-surface px-6 py-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
          <span>제목</span>
          <span>분류</span>
          <span>등록일</span>
        </div>

        <ul>
          {notices.map((notice) => (
            <li key={notice.id} className="border-b border-border last:border-b-0">
              <button
                type="button"
                onClick={() => openNotice(notice)}
                className="group flex w-full flex-col gap-2 px-5 py-5 text-left transition-colors hover:bg-surface-blue/40 md:grid md:grid-cols-[1fr_120px_100px] md:items-center md:gap-4 md:px-6"
              >
                <span className="flex min-w-0 items-start gap-2">
                  {notice.pinned && (
                    <Pin
                      className="mt-1 h-4 w-4 shrink-0 text-primary"
                      aria-label="중요 공지"
                    />
                  )}
                  <span
                    className={cn(
                      "text-[15px] font-semibold leading-snug text-text-strong group-hover:text-primary transition-colors",
                      notice.pinned && "text-navy",
                    )}
                  >
                    {notice.title}
                  </span>
                  <ChevronRight
                    className="ml-auto mt-0.5 h-4 w-4 shrink-0 text-text-muted opacity-0 transition-opacity group-hover:opacity-100 md:hidden"
                    aria-hidden
                  />
                </span>
                <span className="text-sm text-text-muted md:text-center">{notice.category}</span>
                <span className="text-sm text-text-muted md:text-center">
                  {formatNoticeDate(notice.date)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <NoticeDetailDialog
        notice={selected}
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setSelected(null);
        }}
      />
    </>
  );
}
