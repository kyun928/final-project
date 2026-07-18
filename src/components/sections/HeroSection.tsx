import { Link } from "@tanstack/react-router";
import { HeroReveal } from "@/components/motion/HeroReveal";

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-surface-blue/30 via-white to-white pt-32 md:pt-40 pb-20 md:pb-28"
    >
      <HeroReveal variant="bg" delay={0}>
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
          <svg
            className="absolute right-[-10%] top-[8%] w-[720px] max-w-[80%] opacity-[0.55]"
            viewBox="0 0 720 720"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="hg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#EEF4FF" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="360" cy="360" r="320" fill="url(#hg)" />
            <g stroke="#2457E6" strokeOpacity="0.18" strokeWidth="1">
              {Array.from({ length: 12 }).map((_, i) => (
                <circle key={i} cx="360" cy="360" r={40 + i * 25} fill="none" />
              ))}
            </g>
            <g stroke="#2457E6" strokeOpacity="0.22" strokeWidth="1">
              <line x1="60" y1="500" x2="660" y2="220" />
              <line x1="100" y1="200" x2="600" y2="600" />
              <line x1="360" y1="40" x2="360" y2="680" />
            </g>
            <g fill="#2457E6">
              {[
                [200, 300],
                [520, 220],
                [420, 500],
                [280, 580],
                [560, 460],
                [360, 360],
                [140, 420],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={i === 5 ? 6 : 3.5} />
              ))}
            </g>
          </svg>
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-surface-blue/40 to-transparent" />
        </div>
      </HeroReveal>

      <div className="container-wisein relative">
        <HeroReveal delay={80}>
          <p className="eyebrow">DATA · AI · PLATFORM</p>
        </HeroReveal>
        <HeroReveal delay={160}>
          <h1 className="mt-5 text-[38px] leading-[1.2] md:text-[64px] md:leading-[1.15] font-extrabold tracking-[-0.02em] text-text-strong">
            데이터를 이해하고,
            <br />
            더 나은 의사결정을 만듭니다
          </h1>
        </HeroReveal>
        <HeroReveal delay={240}>
          <div className="mt-8 max-w-2xl space-y-5 text-[16px] md:text-[18px] leading-[1.75] text-text-muted">
            <p>
              와이즈인컴퍼니는 2007년 설립 이후 데이터 분석을 중심으로 AI 솔루션 개발,
              데이터·AI 교육, 고객사 맞춤형 B2C 플랫폼 개발을 수행해온 데이터·AI 전문기업입니다.
            </p>
            <p>
              2,000건 이상의 프로젝트 경험과 1,400개 이상의 공공·기업 협업 경험을 바탕으로
              신뢰할 수 있는 데이터 파트너가 됩니다.
            </p>
          </div>
        </HeroReveal>
        <HeroReveal delay={320}>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex h-12 items-center rounded-md bg-primary px-7 text-[15px] font-semibold text-white shadow-sm hover:brightness-110 transition"
            >
              문의하기
            </Link>
            <Link
              to="/business"
              className="inline-flex h-12 items-center rounded-md border border-border bg-white px-7 text-[15px] font-semibold text-text-strong hover:border-primary hover:text-primary transition"
            >
              사업영역 보기
            </Link>
          </div>
        </HeroReveal>
      </div>
    </section>
  );
}
