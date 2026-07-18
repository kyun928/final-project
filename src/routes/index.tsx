import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { Reveal } from "@/components/motion/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "와이즈인컴퍼니 | 데이터 분석 및 AI 솔루션 전문기업" },
      {
        name: "description",
        content:
          "와이즈인컴퍼니는 2007년 설립 이후 공공기관과 기업을 대상으로 데이터 분석, AI 솔루션 개발, 데이터·AI 교육, 맞춤형 B2C 플랫폼 개발을 제공하는 전문기업입니다.",
      },
      { property: "og:title", content: "와이즈인컴퍼니 | 데이터 분석 및 AI 솔루션 전문기업" },
      {
        property: "og:description",
        content:
          "데이터 분석, AI 솔루션 개발, 데이터·AI 교육, 맞춤형 B2C 플랫폼 개발을 제공하는 전문기업입니다.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      <HeroSection />
      <Reveal>
        <StatsSection />
      </Reveal>
    </SiteLayout>
  );
}
