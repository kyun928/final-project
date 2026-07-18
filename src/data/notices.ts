export type Notice = {
  id: string;
  title: string;
  date: string;
  category: string;
  pinned?: boolean;
  image: string;
  imageAlt: string;
  content: string[];
  summary?: string;
  author?: string;
  published?: boolean;
};

export const noticeCategories = [
  "서비스 안내",
  "교육",
  "운영 안내",
  "회사 소식",
] as const;

export const notices: Notice[] = [
  {
    id: "notice-001",
    title: "2026년 상반기 데이터 분석·AI 솔루션 상담 운영 안내",
    date: "2026-06-18",
    category: "서비스 안내",
    pinned: true,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=960&h=220&q=80",
    imageAlt: "데이터 대시보드와 분석 차트가 보이는 업무 환경",
    content: [
      "안녕하세요. 와이즈인컴퍼니입니다.",
      "2026년 상반기 데이터 분석, AI 솔루션 개발, 데이터 시각화 및 대시보드 구축 관련 상담을 정상적으로 운영합니다.",
      "공공기관·기업 고객의 프로젝트 문의는 홈페이지 문의하기 또는 대표 이메일(wisein@wisein.co.kr)로 접수해 주시면 담당자가 영업일 기준 1~2일 이내에 회신드립니다.",
      "상담 시 프로젝트 목적, 보유 데이터 현황, 희망 일정을 함께 알려주시면 보다 정확한 안내가 가능합니다.",
      "많은 관심과 문의 부탁드립니다.",
    ],
  },
  {
    id: "notice-002",
    title: "재직자 대상 데이터·AI 실무 교육 브랜드 '말로다해' 오픈 예정",
    date: "2026-05-02",
    category: "교육",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=960&h=220&q=80",
    imageAlt: "강의실에서 데이터 교육을 듣는 재직자들",
    content: [
      "와이즈인컴퍼니는 재직자를 위한 데이터·AI 실무 교육 브랜드 '말로다해'를 준비하고 있습니다.",
      "말로다해는 실제 프로젝트 경험을 바탕으로 데이터 분석, AI 활용, 업무 자동화 등 현업에서 바로 적용할 수 있는 실무 중심 커리큘럼을 제공할 예정입니다.",
      "교육 과정 세부 일정, 수강 대상, 국비지원 연계 여부는 확정되는 대로 본 공지사항을 통해 순차적으로 안내드리겠습니다.",
      "교육 상담이 필요하신 경우 홈페이지 문의하기에서 '데이터·AI 교육' 항목을 선택해 주세요.",
    ],
  },
  {
    id: "notice-003",
    title: "2026년 추석 연휴 고객지원 및 업무 안내",
    date: "2026-09-10",
    category: "운영 안내",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=960&h=220&q=80",
    imageAlt: "정돈된 사무실 공간과 업무 환경",
    content: [
      "와이즈인컴퍼니를 이용해 주시는 고객 여러분께 감사드립니다.",
      "2026년 추석 연휴 기간 고객지원 및 사무실 운영 일정을 아래와 같이 안내드립니다.",
      "■ 휴무 기간: 2026년 10월 8일(목) ~ 10월 11일(일)",
      "■ 업무 재개: 2026년 10월 12일(월) 오전 9시부터 정상 운영",
      "연휴 기간 중 접수된 문의는 업무 재개 후 순차적으로 답변드리며, 긴급한 프로젝트 이슈는 사전에 협의된 담당자 연락처로 문의해 주시기 바랍니다.",
      "편안한 추석 연휴 보내시기 바랍니다.",
    ],
  },
];

export function formatNoticeDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${year}.${month}.${day}`;
}
