import { useEffect, useRef, useState } from "react";
import { CalendarCheck, History, Briefcase, Building2, Users } from "lucide-react";
import { stats } from "@/data/site";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  CalendarCheck,
  History,
  Briefcase,
  Building2,
  Users,
};

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || target === 0) {
      setVal(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return val;
}

function StatItem({
  raw,
  label,
  suffix,
  icon,
  format,
  active,
}: {
  raw: string;
  label: string;
  suffix: string;
  icon: string;
  format?: "raw";
  active: boolean;
}) {
  const numeric = Number(raw.replace(/,/g, ""));
  const isNumber = !Number.isNaN(numeric) && raw.match(/^[\d,]+$/);
  const counted = useCountUp(isNumber ? numeric : 0, active);
  const display =
    format === "raw" ? raw : isNumber ? counted.toLocaleString("ko-KR") : raw;
  const Icon = iconMap[icon] || Users;
  return (
    <div className="flex flex-col items-center md:items-start rounded-xl border border-border bg-white p-5 md:p-6 shadow-sm">
      <Icon className="h-5 w-5 text-primary" aria-hidden />
      <p className="mt-3 text-xs md:text-sm text-text-muted/80">{label}</p>
      <div className="mt-1.5 flex items-baseline gap-0.5 text-primary">
        <span className="text-[30px] md:text-[38px] font-extrabold tracking-tight leading-none tabular-nums">
          {display}
        </span>
        <span className="text-[15px] md:text-[17px] font-bold text-navy">{suffix}</span>
      </div>
    </div>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section className="section-y bg-surface">
      <div className="container-wisein">
        <h2 className="text-center md:text-left text-[28px] md:text-[40px] font-extrabold tracking-tight text-text-strong">
          신뢰는 경험에서 시작됩니다
        </h2>
        <div
          ref={ref}
          className="mt-12 grid gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 md:gap-8"
        >
          {stats.map((s) => (
            <StatItem
              key={s.label}
              raw={s.value}
              label={s.label}
              suffix={s.suffix}
              icon={s.icon}
              format={s.format}
              active={active}
            />
          ))}
        </div>
      </div>
    </section>
  );
}