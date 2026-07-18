import { ShieldCheck, Lightbulb, Wrench, Infinity as InfinityIcon } from "lucide-react";
import { CardImageBanner } from "@/components/common/CardImageBanner";
import { coreValues } from "@/data/site";

const icons = [ShieldCheck, Lightbulb, Wrench, InfinityIcon];

export function VisionValuesSection() {
  return (
    <section className="section-y bg-surface">
      <div className="container-wisein">
        <h2 className="text-center text-[30px] font-extrabold tracking-tight text-text-strong md:text-[44px]">
          우리가 지향하는 가치
        </h2>

        <div className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-2xl border border-border bg-white text-center">
          <CardImageBanner
            src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&h=220&q=80"
            alt="데이터와 AI로 함께 성장하는 와이즈인컴퍼니 팀"
            className="h-24 md:h-28"
          />
          <div className="p-8 md:p-12">
            <p className="eyebrow">VISION</p>
            <h3 className="mt-4 text-[24px] font-bold leading-[1.35] text-navy md:text-[32px]">
              데이터와 AI 분야에서
              <br />
              가장 신뢰받는 비즈니스 파트너
            </h3>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-muted md:text-[16px]">
              우리는 데이터와 AI를 통해 고객이 더 정확하게 판단하고, 더 나은 방향으로 실행할 수
              있도록 돕습니다.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {coreValues.map((v, i) => {
            const Icon = icons[i];
            return (
              <div
                key={v.key}
                className="group overflow-hidden rounded-xl border border-border bg-white transition-all duration-200 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_10px_30px_-16px_rgba(36,87,230,0.35)]"
              >
                <CardImageBanner src={v.image} alt={v.imageAlt} />
                <div className="p-7">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-surface-blue text-primary">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h4 className="mt-5 text-[18px] font-bold text-text-strong">{v.title}</h4>
                  <p className="mt-2 text-[14px] leading-[1.7] text-text-muted">{v.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
