import { experienceAreas, historyEntries } from "@/data/site";

export function ExperienceHistorySection() {
  return (
    <section className="section-y bg-surface">
      <div className="container-wisein">
        <h2 className="text-[30px] md:text-[44px] leading-[1.25] font-extrabold tracking-tight text-text-strong">
          공개하지 않아도
          <br />
          축적된 경험은 분명합니다
        </h2>
        <div className="mt-6 grid gap-8 md:grid-cols-[1.2fr_1fr] md:gap-14">
          <p className="text-[16px] md:text-[17px] leading-[1.85] text-text-muted">
            와이즈인컴퍼니는 공공기관과 민간기업을 대상으로 데이터 분석, AI 솔루션 개발, 데이터·AI
            교육, 플랫폼 개발 프로젝트를 수행해왔습니다.
            <br />
            <br />
            보안과 계약상의 이유로 세부 고객명과 프로젝트명은 공개하지 않지만, 2,000건 이상의
            프로젝트 수행 경험과 1,400개 이상의 공공·기업 협업 경험이 와이즈인컴퍼니의 전문성을
            증명합니다.
          </p>
          <p className="self-end text-[13px] text-text-muted italic">보안과 계약을 존중합니다.</p>
        </div>

        <div className="mt-10 flex flex-wrap gap-2.5">
          {experienceAreas.map((e) => (
            <span
              key={e}
              className="inline-flex items-center rounded-full border border-border bg-white px-4 py-2 text-[13px] font-medium text-text-strong/85"
            >
              {e}
            </span>
          ))}
        </div>

        {/* History */}
        <div className="mt-24 md:mt-32 grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <div>
            <h3 className="text-[26px] md:text-[36px] leading-[1.3] font-extrabold tracking-tight text-text-strong">
              2007년부터
              <br />
              데이터의 가치를 만들어왔습니다
            </h3>
          </div>
          <ul className="space-y-5 border-l border-border pl-8">
            {historyEntries.map((h, i) => (
              <li key={i} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[35px] top-2 h-2.5 w-2.5 rounded-full bg-primary"
                />
                {h.date ? (
                  <div className="flex flex-wrap items-baseline gap-4">
                    <span className="text-[15px] font-bold text-primary tabular-nums">
                      {h.date}
                    </span>
                    <span className="text-[16px] font-semibold text-text-strong">{h.label}</span>
                  </div>
                ) : (
                  <p className="text-[15px] text-text-muted">{h.label}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}