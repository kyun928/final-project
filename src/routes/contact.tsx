import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ContactSection } from "@/components/sections/ContactSection";
import { Reveal } from "@/components/motion/Reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "문의하기 | 와이즈인컴퍼니" },
      {
        name: "description",
        content: "데이터 분석, AI 솔루션, 교육, 플랫폼 개발 문의를 남겨주세요.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteLayout>
      <Reveal immediate delay={60}>
        <ContactSection />
      </Reveal>
    </SiteLayout>
  );
}
