import { processSteps } from "@/data/site";

export function ProcessSection() {
  return (
    <section id="expertise" className="section-y bg-white">
      <div className="container-wisein">
        <p className="eyebrow">EXPERTISE</p>
        <h2 className="mt-4 text-[30px] md:text-[44px] leading-[1.25] font-extrabold tracking-tight text-text-strong">
          문제를 이해하고,
          <br />
          데이터로 구조화하며,
          <br />
          기술로 해결합니다
        </h2>

        {/* Desktop horizontal */}
        <div className="mt-16 hidden lg:block">
          <div className="relative">
            <div
              aria-hidden
              className="absolute left-0 right-0 top-6 h-px bg-gradient-to-r from-transparent via-border to-transparent"
            />
            <div className="relative grid grid-cols-5 gap-4">
              {processSteps.map((s) => (
                <div key={s.step} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-white text-[15px] font-bold text-primary">
                    {s.step}
                  </div>
                  <h4 className="mt-6 text-[17px] font-bold text-text-strong">{s.title}</h4>
                  <p className="mt-2 px-2 text-[13px] leading-[1.7] text-text-muted">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile / tablet vertical timeline */}
        <ol className="mt-12 lg:hidden space-y-6">
          {processSteps.map((s, i) => (
            <li key={s.step} className="relative pl-14">
              <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-primary-foreground">
                {s.step}
              </div>
              {i < processSteps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-5 top-10 h-full w-px -translate-x-1/2 bg-border"
                />
              )}
              <h4 className="text-[17px] font-bold text-text-strong">{s.title}</h4>
              <p className="mt-1.5 text-[14px] leading-[1.7] text-text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}