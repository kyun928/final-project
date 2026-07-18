import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { Reveal } from "@/components/motion/Reveal";

export const Route = createFileRoute("/expertise")({
  head: () => ({
    meta: [
      { title: "전문역량 | 와이즈인컴퍼니" },
      {
        name: "description",
        content: "와이즈인컴퍼니의 데이터 분석 및 AI 솔루션 수행 프로세스와 전문 역량을 소개합니다.",
      },
    ],
  }),
  component: ExpertisePage,
});

function ExpertisePage() {
  return (
    <SiteLayout>
      <Reveal immediate delay={60}>
        <ProcessSection />
      </Reveal>
    </SiteLayout>
  );
}
