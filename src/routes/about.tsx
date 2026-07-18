import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { AboutSection } from "@/components/sections/AboutSection";
import { VisionValuesSection } from "@/components/sections/VisionValuesSection";
import { ExperienceHistorySection } from "@/components/sections/ExperienceHistorySection";
import { StatsSection } from "@/components/sections/StatsSection";
import { Reveal } from "@/components/motion/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "회사소개 | 와이즈인컴퍼니" },
      {
        name: "description",
        content:
          "와이즈인컴퍼니는 2007년부터 데이터 분석과 AI 솔루션 개발 경험을 축적해온 데이터 전문기업입니다. 회사의 비전과 핵심 가치, 연혁을 소개합니다.",
      },
      { property: "og:title", content: "회사소개 | 와이즈인컴퍼니" },
      {
        property: "og:description",
        content: "와이즈인컴퍼니의 정체성, 비전, 핵심 가치와 축적된 경험을 소개합니다.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <Reveal immediate delay={60}>
        <AboutSection />
      </Reveal>
      <Reveal delay={80}>
        <StatsSection />
      </Reveal>
      <Reveal delay={80}>
        <VisionValuesSection />
      </Reveal>
      <Reveal delay={80}>
        <ExperienceHistorySection />
      </Reveal>
    </SiteLayout>
  );
}