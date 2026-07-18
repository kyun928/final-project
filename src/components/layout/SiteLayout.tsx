import { useState, type ReactNode } from "react";
import { LegalDocumentDialog } from "@/components/common/LegalDocumentDialog";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getLegalDocument } from "@/data/legal";

export function SiteLayout({ children }: { children: ReactNode }) {
  const [legalOpen, setLegalOpen] = useState(false);
  const [legalId, setLegalId] = useState<"privacy" | "terms">("privacy");

  const openLegal = (id: "privacy" | "terms") => {
    setLegalId(id);
    setLegalOpen(true);
  };

  return (
    <div className="min-h-dvh bg-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[200] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        본문으로 건너뛰기
      </a>
      <Header />
      <main id="main" className="pt-[72px]">
        {children}
      </main>
      <Footer
        onOpenPrivacy={() => openLegal("privacy")}
        onOpenTerms={() => openLegal("terms")}
      />
      <LegalDocumentDialog
        document={getLegalDocument(legalId)}
        open={legalOpen}
        onOpenChange={setLegalOpen}
      />
    </div>
  );
}
