import { dataAnalyticsCategories, analyticsNeeds } from "@/data/site";
import { Check } from "lucide-react";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function DataAnalyticsSection() {
  return (
    <section id="data-analytics" className="section-y bg-surface">
      <div className="container-wisein">
        <p className="eyebrow">DATA ANALYTICS</p>
        <h2 className="mt-4 text-[30px] md:text-[44px] leading-[1.25] font-extrabold tracking-tight text-text-strong">
          데이터에서
          <br />
          의사결정의 근거를 찾습니다
        </h2>
        <p className="mt-6 max-w-3xl text-[16px] md:text-[17px] leading-[1.8] text-text-muted">
          데이터를 보유하고 있지만 활용 방법을 찾기 어려운 조직부터 정책과 사업 성과 분석, 경영
          의사결정, 고객 및 마케팅 분석이 필요한 기관과 기업까지 목적에 맞는 데이터 분석 서비스를
          제공합니다.
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {dataAnalyticsCategories.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-border bg-white p-8 md:p-10 transition hover:border-primary/40"
            >
              <span className="text-sm font-bold text-primary tracking-widest">{c.step}</span>
              <h3 className="mt-3 text-[22px] md:text-[24px] font-bold text-text-strong">
                {c.title}
              </h3>
              <p className="mt-3 text-[15px] leading-[1.75] text-text-muted">{c.description}</p>
              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
                {c.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-[14px] text-text-strong/85"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Needs sub-section */}
      <div id="needs" className="container-wisein mt-24 md:mt-32">
        <h3 className="text-[26px] md:text-[36px] leading-[1.3] font-extrabold tracking-tight text-text-strong text-center">
          이런 상황이라면
          <br />
          데이터 분석이 필요합니다
        </h3>
        <div className="mt-12 grid gap-3 sm:grid-cols-2">
          {analyticsNeeds.map((n) => (
            <div
              key={n}
              className="flex items-start gap-3 rounded-xl border border-border bg-white px-5 py-4"
            >
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </div>
              <p className="text-[15px] leading-[1.65] text-text-strong">{n}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-2xl bg-navy px-8 py-10 md:px-12 md:py-12 text-center">
          <p className="text-[18px] md:text-[22px] font-semibold text-white leading-[1.55]">
            보유한 데이터를 어떻게 활용해야 할지 고민하고 계신가요?
          </p>
          <button
            onClick={() => scrollToId("contact")}
            className="mt-7 inline-flex h-12 items-center rounded-md bg-primary px-8 text-[15px] font-semibold text-white hover:brightness-110 transition"
          >
            문의하기
          </button>
        </div>
      </div>
    </section>
  );
}