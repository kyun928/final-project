import { CardImageBanner } from "@/components/common/CardImageBanner";

export function AboutSection() {
  return (
    <section id="about" className="section-y bg-white">
      <div className="container-wisein grid items-start gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <p className="eyebrow">ABOUT WISEIN</p>
          <h2 className="mt-4 text-[30px] font-extrabold leading-[1.25] tracking-tight text-text-strong md:text-[44px]">
            데이터를 통해
            <br />
            복잡한 문제를 명확하게 만듭니다
          </h2>
          <div className="mt-8 space-y-5 text-[16px] leading-[1.8] text-text-muted md:text-[17px]">
            <p>
              와이즈인컴퍼니는 데이터 수집과 정제, 통계 분석, 시각화, 예측 분석, AI 솔루션
              개발까지 데이터 활용의 전 과정을 지원합니다.
            </p>
            <p>
              공공기관과 기업이 보유한 데이터를 실제 의사결정에 활용할 수 있도록 분석하며,
              기술 자체보다 고객의 문제를 해결하는 실용적인 결과를 중요하게 생각합니다.
            </p>
            <p>
              2007년부터 축적해온 프로젝트 경험을 바탕으로 고객의 상황과 목적에 맞는 분석 방법과
              기술을 제안합니다.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <CardImageBanner
            src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=960&h=320&q=80"
            alt="와이즈인컴퍼니 데이터 분석 전문가들의 협업 장면"
            className="h-40 md:h-48"
          />
          <div className="space-y-4 p-6 md:p-8">
            <p className="text-sm font-semibold text-primary">Since 2007</p>
            <h3 className="text-[20px] font-bold leading-snug text-text-strong md:text-[22px]">
              공공기관과 기업이 신뢰하는
              <br />
              데이터·AI 전문 파트너
            </h3>
            <p className="text-[14px] leading-[1.75] text-text-muted">
              2,000건 이상의 프로젝트 경험과 1,400개 이상의 공공·기업 협업 경험을 바탕으로
              고객의 데이터 활용 여정을 함께합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
