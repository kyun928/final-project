import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { BlogList } from "@/components/blog/BlogList";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Reveal } from "@/components/motion/Reveal";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "블로그 | 와이즈인컴퍼니" },
      {
        name: "description",
        content: "데이터 분석, AI, 디지털 전환에 관한 와이즈인컴퍼니의 인사이트를 확인하세요.",
      },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const [count, setCount] = useState(0);

  return (
    <SiteLayout>
      <Reveal immediate delay={60}>
        <section className="section-y bg-white">
          <div className="container-wisein">
            <p className="eyebrow">BLOG</p>
            <h1 className="mt-4 text-[30px] md:text-[44px] font-extrabold tracking-tight text-text-strong">
              블로그
            </h1>
            <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-text-muted">
              데이터 분석, AI, 디지털 전환에 관한 인사이트와 사례를 공유합니다. 카드를 클릭하면
              전체 내용을 확인할 수 있습니다.
            </p>

            <BlogList onCountChange={setCount} />

            <p className="mt-6 text-sm text-text-muted">총 {count}건의 글이 있습니다.</p>
          </div>
        </section>
      </Reveal>
    </SiteLayout>
  );
}
