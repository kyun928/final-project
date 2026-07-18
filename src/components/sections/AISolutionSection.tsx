import { Workflow, TrendingUp, Sparkles } from "lucide-react";
import { aiServices } from "@/data/site";

const icons = [Workflow, TrendingUp, Sparkles];

export function AISolutionSection() {
  return (
    <section id="ai-solution" className="section-y bg-white">
      <div className="container-wisein">
        <p className="eyebrow">AI SOLUTION</p>
        <h2 className="mt-4 text-[30px] md:text-[44px] leading-[1.25] font-extrabold tracking-tight text-text-strong">
          데이터 분석을 기반으로
          <br />
          실제 업무에 적용되는 AI를 만듭니다
        </h2>
        <p className="mt-6 max-w-3xl text-[16px] md:text-[17px] leading-[1.8] text-text-muted">
          와이즈인컴퍼니는 유행하는 기술을 단순히 적용하는 것이 아니라, 고객의 데이터와 업무 환경을
          이해하고 실제 활용할 수 있는 AI 솔루션을 개발합니다.
        </p>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {aiServices.map((s, i) => {
            const Icon = icons[i];
            return (
              <div
                key={s.title}
                className="rounded-xl border border-border bg-white p-8 transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_10px_30px_-18px_rgba(16,24,40,0.18)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-surface-blue text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="mt-6 text-[20px] font-bold text-text-strong">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.75] text-text-muted">{s.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}