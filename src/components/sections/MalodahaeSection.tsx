import { malodahaeFeatures } from "@/data/site";

export function MalodahaeSection({
  onRequestConsult,
}: {
  onRequestConsult: () => void;
}) {
  return (
    <section id="malodahae" className="section-y bg-white">
      <div className="container-wisein">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-surface-blue via-white to-white p-8 md:p-16">
          <p className="eyebrow">EDUCATION BRAND</p>
          <h2 className="mt-4 text-[40px] md:text-[64px] leading-none font-black tracking-[-0.03em] text-navy">
            말로다해
          </h2>
          <p className="mt-4 text-[17px] md:text-[20px] font-semibold text-text-strong">
            재직자를 위한 데이터·AI 실무 교육 브랜드
          </p>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-4 text-[15px] md:text-[16px] leading-[1.85] text-text-muted">
              <p>
                말로다해는 와이즈인컴퍼니가 준비하고 있는 재직자 대상 데이터·AI 교육 브랜드입니다.
              </p>
              <p>
                실제 데이터 분석과 AI 프로젝트 경험을 바탕으로 업무 현장에서 활용할 수 있는 실무
                중심 교육과정을 제공합니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 content-start">
              {malodahaeFeatures.map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center rounded-md border border-primary/20 bg-white px-3 py-1.5 text-[13px] font-medium text-primary"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white/70 border border-border px-6 py-5">
            <p className="text-[14px] text-text-muted">
              <span className="mr-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                PREPARING
              </span>
              현재 교육과정을 준비하고 있습니다.
            </p>
            <button
              onClick={onRequestConsult}
              className="inline-flex h-11 items-center rounded-md bg-navy px-6 text-[14px] font-semibold text-white hover:bg-navy/90 transition"
            >
              교육 상담 신청
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}