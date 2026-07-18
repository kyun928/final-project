import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { BusinessSection } from "@/components/sections/BusinessSection";
import { DataAnalyticsSection } from "@/components/sections/DataAnalyticsSection";
import { AISolutionSection } from "@/components/sections/AISolutionSection";
import { PlatformSection } from "@/components/sections/PlatformSection";
import { Reveal } from "@/components/motion/Reveal";

export const Route = createFileRoute("/business")({
  head: () => ({
    meta: [
      { title: "사업영역 | 와이즈인컴퍼니" },
      {
        name: "description",
        content:
          "데이터 분석, AI 솔루션 개발, 데이터·AI 교육, 고객사 맞춤형 B2C 플랫폼 개발 서비스를 소개합니다.",
      },
    ],
  }),
  component: BusinessPage,
});

function BusinessPage() {
  return (
    <SiteLayout>
      <Reveal immediate delay={60}>
        <BusinessSection />
      </Reveal>
      <Reveal delay={80}>
        <DataAnalyticsSection />
      </Reveal>
      <Reveal delay={80}>
        <AISolutionSection />
      </Reveal>
      <Reveal delay={80}>
        <PlatformSection />
      </Reveal>
    </SiteLayout>
  );
}
