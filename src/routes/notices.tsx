import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { NoticeList } from "@/components/notices/NoticeList";
import { Reveal } from "@/components/motion/Reveal";

export const Route = createFileRoute("/notices")({
  head: () => ({
    meta: [
      { title: "공지사항 | 와이즈인컴퍼니" },
      {
        name: "description",
        content: "와이즈인컴퍼니의 공지사항을 확인하세요.",
      },
    ],
  }),
  component: NoticesPage,
});

function NoticesPage() {
  const [count, setCount] = useState(0);

  return (
    <SiteLayout>
      <Reveal immediate delay={60}>
        <section className="section-y bg-white">
          <div className="container-wisein">
            <p className="eyebrow">NOTICE</p>
            <h1 className="mt-4 text-[30px] md:text-[44px] font-extrabold tracking-tight text-text-strong">
              공지사항
            </h1>
            <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-text-muted">
              와이즈인컴퍼니의 주요 소식과 운영 안내를 확인하실 수 있습니다. 제목을 클릭하면
              상세 내용을 확인할 수 있습니다.
            </p>

            <NoticeList onCountChange={setCount} />

            <p className="mt-6 text-sm text-text-muted">총 {count}건의 공지사항이 있습니다.</p>
          </div>
        </section>
      </Reveal>
    </SiteLayout>
  );
}
