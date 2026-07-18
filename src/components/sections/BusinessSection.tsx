import { ArrowRight, BarChart3, Cpu, GraduationCap, LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import { CardImageBanner } from "@/components/common/CardImageBanner";
import type { BusinessArea } from "@/data/business-areas";
import { businessAreas as staticBusinessAreas } from "@/data/site";
import { fetchPublishedBusinessAreas } from "@/lib/business-area.functions";
import { cn } from "@/lib/utils";

const icons = [BarChart3, Cpu, GraduationCap, LayoutGrid];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function staticFallback(): BusinessArea[] {
  return staticBusinessAreas.map((area, index) => ({
    id: `static-${area.anchor}`,
    title: area.title,
    description: area.description,
    keywords: [...area.keywords],
    anchor: area.anchor,
    image: area.image,
    imageAlt: area.imageAlt,
    emphasis: area.emphasis ?? false,
    published: true,
    sortOrder: area.sortOrder ?? index,
  }));
}

export function BusinessSection() {
  const loadAreas = useServerFn(fetchPublishedBusinessAreas);
  const [areas, setAreas] = useState<BusinessArea[]>(staticFallback);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await loadAreas();
        if (!cancelled && data.length > 0) {
          setAreas(data);
        }
      } catch {
        // keep static fallback
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [loadAreas]);

  return (
    <section id="business" className="section-y bg-white">
      <div className="container-wisein">
        <p className="eyebrow">BUSINESS</p>
        <h2 className="mt-4 text-[30px] md:text-[44px] leading-[1.25] font-extrabold tracking-tight text-text-strong">
          데이터 분석을 중심으로
          <br />
          확장되는 기술 역량
        </h2>
        <p className="mt-6 max-w-3xl text-[16px] md:text-[17px] leading-[1.8] text-text-muted">
          와이즈인컴퍼니는 데이터 분석을 핵심으로 AI 솔루션, 데이터·AI 교육, 고객사 맞춤형 플랫폼
          개발까지 연결된 서비스를 제공합니다.
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {areas.map((area, i) => {
            const Icon = icons[i % icons.length];
            return (
              <button
                key={area.id}
                onClick={() => scrollToId(area.anchor)}
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-2xl border text-left transition-all duration-200 hover:-translate-y-1",
                  area.emphasis
                    ? "border-primary/40 bg-gradient-to-br from-surface-blue to-white shadow-[0_10px_40px_-20px_rgba(36,87,230,0.45)] md:col-span-2"
                    : "border-border bg-white hover:border-primary/50 hover:shadow-[0_10px_30px_-18px_rgba(16,24,40,0.18)]",
                )}
              >
                {area.image ? <CardImageBanner src={area.image} alt={area.imageAlt || area.title} /> : null}

                <div className="flex flex-1 flex-col p-8 md:p-10">
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-lg",
                        area.emphasis
                          ? "bg-primary text-white"
                          : "bg-surface-blue text-primary",
                      )}
                    >
                      <Icon className="h-6 w-6" strokeWidth={1.75} />
                    </div>
                    <ArrowRight className="h-5 w-5 text-text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <h3
                    className={cn(
                      "mt-6 font-bold text-text-strong",
                      area.emphasis ? "text-[26px] md:text-[30px]" : "text-[20px] md:text-[22px]",
                    )}
                  >
                    {area.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-[15px] leading-[1.75] text-text-muted">
                    {area.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {area.keywords.map((k) => (
                      <span
                        key={k}
                        className={cn(
                          "inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium",
                          area.emphasis
                            ? "border border-primary/20 bg-white text-primary"
                            : "border border-border bg-surface text-text-strong/80",
                        )}
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
