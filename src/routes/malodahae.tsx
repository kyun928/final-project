import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { MalodahaeSection } from "@/components/sections/MalodahaeSection";
import { Reveal } from "@/components/motion/Reveal";

export const Route = createFileRoute("/malodahae")({
  head: () => ({
    meta: [
      { title: "말로다해 | 와이즈인컴퍼니" },
      {
        name: "description",
        content: "재직자를 위한 데이터·AI 실무 교육 브랜드 말로다해를 소개합니다.",
      },
    ],
  }),
  component: MalodahaePage,
});

function MalodahaePage() {
  const navigate = useNavigate();

  return (
    <SiteLayout>
      <Reveal immediate delay={60}>
        <MalodahaeSection onRequestConsult={() => navigate({ to: "/contact" })} />
      </Reveal>
    </SiteLayout>
  );
}
