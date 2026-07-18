export type BlogPost = {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  image: string;
  imageAlt: string;
  content: string[];
  published: boolean;
};

export const blogCategories = [
  "데이터 인사이트",
  "AI 트렌드",
  "사례 공유",
  "회사 소식",
] as const;

export const blogPosts: BlogPost[] = [
  {
    id: "blog-001",
    title: "공공데이터 분석, 어디서부터 시작해야 할까?",
    date: "2026-06-25",
    category: "데이터 인사이트",
    summary:
      "공공기관과 기업이 보유한 데이터를 분석에 활용하기 위한 첫 단계와 실무에서 자주 겪는 어려움을 정리했습니다.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=960&h=480&q=80",
    imageAlt: "공공데이터를 분석하는 대시보드 화면",
    content: [
      "많은 기관과 기업이 데이터를 보유하고 있지만, 분석에 바로 활용하기 어려운 경우가 많습니다.",
      "와이즈인컴퍼니는 데이터 수집·정제·구조화 과정을 거쳐 분석 가능한 형태로 만드는 것부터 함께합니다.",
      "특히 공공데이터는 출처와 형식이 다양해 표준화 작업이 선행되어야 의미 있는 인사이트를 도출할 수 있습니다.",
      "프로젝트 초기에 분석 목적과 활용 범위를 명확히 정의하면, 불필요한 작업을 줄이고 효율적으로 진행할 수 있습니다.",
    ],
    published: true,
  },
  {
    id: "blog-002",
    title: "생성형 AI를 업무에 도입할 때 알아야 할 3가지",
    date: "2026-06-10",
    category: "AI 트렌드",
    summary:
      "생성형 AI 도입을 검토하는 조직이 반드시 확인해야 할 데이터 보안, 업무 적합성, 운영 방식을 소개합니다.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=960&h=480&q=80",
    imageAlt: "AI 기술과 업무 자동화를 상징하는 이미지",
    content: [
      "생성형 AI는 문서 작성, 요약, 코드 보조 등 다양한 업무에 활용될 수 있습니다.",
      "다만 도입 전에는 내부 데이터 보안 정책과 AI 서비스의 데이터 처리 방식을 반드시 검토해야 합니다.",
      "모든 업무에 AI를 적용하기보다, 반복성이 높고 효과가 큰 영역부터 단계적으로 확대하는 것이 현실적입니다.",
      "와이즈인컴퍼니는 고객 환경에 맞는 AI 활용 시나리오 설계와 구현을 지원합니다.",
    ],
    published: true,
  },
  {
    id: "blog-003",
    title: "설문조사 데이터, 통계 분석으로 의미 있는 결과 만들기",
    date: "2026-05-20",
    category: "사례 공유",
    summary:
      "설문 응답 데이터를 단순 집계를 넘어 정책·사업 의사결정에 활용하는 분석 접근법을 공유합니다.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=960&h=480&q=80",
    imageAlt: "설문 분석 결과를 시각화한 차트",
    content: [
      "설문조사는 정책 수립과 서비스 개선에 중요한 근거를 제공합니다.",
      "응답률, 표본 대표성, 문항 설계를 함께 검토해야 신뢰할 수 있는 결과를 얻을 수 있습니다.",
      "교차 분석과 통계 검정을 통해 응답 집단별 차이를 파악하면 더 구체적인 시사점을 도출할 수 있습니다.",
      "분석 결과는 보고서와 시각화 자료로 정리해 이해관계자가 바로 활용할 수 있도록 제공하는 것이 중요합니다.",
    ],
    published: true,
  },
];

export function formatBlogDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${year}.${month}.${day}`;
}
