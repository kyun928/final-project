import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { company } from "@/data/site";
import type { LegalDocument } from "@/data/legal";

type LegalDocumentDialogProps = {
  document: LegalDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function formatEffectiveDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}

export function LegalDocumentDialog({
  document,
  open,
  onOpenChange,
}: LegalDocumentDialogProps) {
  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:rounded-2xl [&>button]:right-3 [&>button]:top-3 [&>button]:rounded-full [&>button]:bg-white/90 [&>button]:text-navy [&>button]:shadow-sm [&>button]:hover:bg-white">
        <div className="shrink-0 border-b border-border bg-surface-blue/40 px-6 pb-4 pt-6 pr-14">
          <DialogHeader className="gap-2 text-left">
            <p className="text-xs font-semibold tracking-wide text-primary">
              {company.nameKo}
            </p>
            <DialogTitle className="text-left text-xl font-bold leading-snug text-text-strong md:text-2xl">
              {document.title}
            </DialogTitle>
            <DialogDescription className="text-left text-sm text-text-muted">
              시행일 {formatEffectiveDate(document.effectiveDate)}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <p className="text-[14px] leading-[1.85] text-text-strong/90">{document.intro}</p>

          <div className="mt-6 space-y-7">
            {document.sections.map((section) => (
              <section key={section.id} className="space-y-3">
                <h3 className="text-[15px] font-bold text-navy">{section.title}</h3>

                {section.paragraphs?.map((paragraph, index) => (
                  <p key={index} className="text-[14px] leading-[1.85] text-text-muted">
                    {paragraph}
                  </p>
                ))}

                {section.bullets && section.bullets.length > 0 ? (
                  <ul className="list-disc space-y-1.5 pl-5 text-[14px] leading-[1.75] text-text-muted">
                    {section.bullets.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : null}

                {section.subsections?.map((sub) => (
                  <div key={sub.title} className="space-y-2 rounded-xl bg-surface px-4 py-3">
                    <h4 className="text-[13px] font-semibold text-text-strong">{sub.title}</h4>
                    {sub.paragraphs?.map((paragraph, index) => (
                      <p key={index} className="text-[13px] leading-[1.75] text-text-muted">
                        {paragraph}
                      </p>
                    ))}
                    {sub.bullets && sub.bullets.length > 0 ? (
                      <ul className="list-disc space-y-1 pl-4 text-[13px] leading-[1.75] text-text-muted">
                        {sub.bullets.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </section>
            ))}
          </div>
        </div>

        <div className="shrink-0 border-t border-border bg-white px-6 py-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground hover:opacity-95 sm:ml-auto sm:w-auto"
          >
            확인
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
