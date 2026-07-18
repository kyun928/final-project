import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export function PrivacyModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="max-h-full w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 md:p-8 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h3 id="privacy-title" className="text-[20px] font-bold text-text-strong">
            개인정보 수집 및 이용 안내
          </h3>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="닫기"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-text-muted hover:bg-surface"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-6 space-y-6 text-[14px] leading-[1.75] text-text-strong/90">
          <section>
            <h4 className="font-bold text-primary">수집 항목</h4>
            <p className="mt-1 text-text-muted">
              이름, 회사명, 연락처, 이메일, 문의 분야, 예산, 일정, 문의 내용
            </p>
          </section>
          <section>
            <h4 className="font-bold text-primary">수집 목적</h4>
            <p className="mt-1 text-text-muted">
              문의 접수, 상담 진행, 답변 제공, 서비스 제공 가능 여부 검토
            </p>
          </section>
          <section>
            <h4 className="font-bold text-primary">보유 기간</h4>
            <p className="mt-1 text-text-muted">
              문의 처리 완료 후 1년 또는 관련 법령에 따른 기간
            </p>
          </section>
          <p className="text-[12px] text-text-muted">
            수집한 개인정보는 문의 처리 목적 외로 이용되지 않으며, 관계 법령에 따라 안전하게
            관리됩니다.
          </p>
        </div>
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}