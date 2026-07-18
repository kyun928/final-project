export const company = {
  nameEn: "WiseIN Company",
  nameKo: "와이즈인컴퍼니",
  address: "경기도 고양시 덕양구 화신로 190",
  email: "wisein@wisein.co.kr",
  phone: "070-3344-5566",
  phoneHref: "tel:+8270-3344-5566",
  founded: "2007.05",
};

export type NavItem = {
  id: string;
  label: string;
  to:
    | "/"
    | "/about"
    | "/business"
    | "/expertise"
    | "/malodahae"
    | "/notices"
    | "/blog"
    | "/contact";
};

export const navItems: NavItem[] = [
  { id: "about", label: "회사소개", to: "/about" },
  { id: "business", label: "사업영역", to: "/business" },
  { id: "expertise", label: "전문역량", to: "/expertise" },
  { id: "malodahae", label: "말로다해", to: "/malodahae" },
  { id: "notices", label: "공지사항", to: "/notices" },
  { id: "blog", label: "블로그", to: "/blog" },
  { id: "contact", label: "문의하기", to: "/contact" },
];

export const headerNavItems = navItems.filter((item) => item.id !== "contact");

export const stats = [
  { value: "2007", label: "설립연도", suffix: "", icon: "CalendarCheck", format: "raw" as const },
  { value: "20", label: "축적된 업력", suffix: "년+", icon: "History" },
  { value: "2,000", label: "프로젝트 경험", suffix: "건+", icon: "Briefcase" },
  { value: "1,400", label: "공공·기업 협업 경험", suffix: "개+", icon: "Building2" },
  { value: "25", label: "전문 인력", suffix: "명", icon: "Users" },
];

export const coreValues = [
  {
    key: "trust",
    title: "신뢰",
    body: "책임감과 원칙을 바탕으로 고객의 데이터와 비즈니스를 다룹니다.",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=960&h=220&q=80",
    imageAlt: "신뢰를 바탕으로 협업하는 비즈니스 파트너",
  },
  {
    key: "expertise",
    title: "전문성",
    body: "축적된 경험과 기술 역량을 바탕으로 문제에 적합한 해답을 제시합니다.",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=960&h=220&q=80",
    imageAlt: "전문가들이 데이터를 분석하는 회의 장면",
  },
  {
    key: "practical",
    title: "실용성",
    body: "기술 자체보다 현장에서 실제로 활용할 수 있는 결과를 중요하게 생각합니다.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=960&h=220&q=80",
    imageAlt: "실무에 활용되는 데이터 분석 화면",
  },
  {
    key: "sustain",
    title: "지속성",
    body: "일회성 결과에 그치지 않고 지속 가능한 데이터 활용과 성장을 지원합니다.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=960&h=220&q=80",
    imageAlt: "지속적인 성장을 상징하는 팀 협업 모습",
  },
];

export const businessAreas = [
  {
    title: "데이터 분석",
    emphasis: true,
    description:
      "데이터를 수집·정제·분석하여 정책, 사업, 경영 및 마케팅 의사결정에 필요한 인사이트를 도출합니다.",
    keywords: [
      "통계 분석",
      "설문 분석",
      "공공데이터 분석",
      "데이터 시각화",
      "대시보드",
      "분석 보고서",
    ],
    anchor: "data-analytics",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=220&q=80",
    imageAlt: "데이터 대시보드와 분석 차트",
    published: true,
    sortOrder: 0,
  },
  {
    title: "AI 솔루션 개발",
    emphasis: false,
    description:
      "업무 자동화, 예측 모델, 추천 시스템 등 고객의 목적에 맞는 AI 솔루션을 개발합니다.",
    keywords: ["업무 자동화", "예측 모델", "추천 시스템"],
    anchor: "ai-solution",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=960&h=220&q=80",
    imageAlt: "AI와 머신러닝 기술을 활용하는 개발 환경",
    published: true,
    sortOrder: 1,
  },
  {
    title: "데이터·AI 교육",
    emphasis: false,
    description:
      "실제 프로젝트 경험을 기반으로 재직자가 현업에서 활용할 수 있는 데이터·AI 실무 교육을 준비합니다.",
    keywords: ["말로다해", "재직자 교육", "실무 중심", "자체 커리큘럼"],
    anchor: "malodahae",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=960&h=220&q=80",
    imageAlt: "재직자 대상 데이터·AI 실무 교육 장면",
    published: true,
    sortOrder: 2,
  },
  {
    title: "고객사 맞춤형 B2C 플랫폼 개발",
    emphasis: false,
    description:
      "고객사의 서비스 목적과 사용자 요구를 반영한 맞춤형 B2C 플랫폼을 개발합니다.",
    keywords: ["고객사 맞춤형", "사용자 중심", "데이터 기반", "서비스 개발"],
    anchor: "platform",
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=960&h=220&q=80",
    imageAlt: "모바일과 웹 서비스 플랫폼 개발",
    published: true,
    sortOrder: 3,
  },
] as const;

export const dataAnalyticsCategories = [
  {
    step: "01",
    title: "데이터 준비",
    description: "분석에 필요한 데이터를 수집하고 정제하며, 활용 가능한 형태로 구조화합니다.",
    items: ["데이터 수집", "데이터 정제", "데이터 결합", "데이터 분류", "분석 데이터셋 구축"],
  },
  {
    step: "02",
    title: "데이터 분석",
    description: "목적에 맞는 통계적 방법과 분석 기법을 적용하여 데이터의 의미를 도출합니다.",
    items: [
      "설문조사 데이터 분석",
      "공공데이터 분석",
      "정책 및 연구 데이터 분석",
      "경영·매출 데이터 분석",
      "고객 데이터 분석",
      "마케팅 데이터 분석",
      "통계 분석",
      "예측 분석",
    ],
  },
  {
    step: "03",
    title: "시각화 및 리포팅",
    description: "복잡한 분석 결과를 누구나 이해할 수 있는 시각 자료와 보고서로 제공합니다.",
    items: ["데이터 시각화", "대시보드 구축", "분석 보고서 작성", "리포트 자동화"],
  },
  {
    step: "04",
    title: "의사결정 지원",
    description: "분석 결과가 실제 정책과 사업, 경영 의사결정에 활용될 수 있도록 지원합니다.",
    items: [
      "데이터 활용 컨설팅",
      "정책 의사결정 지원",
      "사업 성과 분석",
      "경영 의사결정 지원",
      "데이터 기반 개선 방향 제안",
    ],
  },
];

export const analyticsNeeds = [
  "데이터를 보유하고 있지만 어떻게 활용해야 할지 모르는 경우",
  "정책이나 사업의 성과를 객관적으로 측정해야 하는 경우",
  "설문조사 결과를 전문적으로 분석해야 하는 경우",
  "경영과 마케팅 의사결정을 위한 근거가 필요한 경우",
  "복잡한 데이터를 보고서와 시각화 자료로 정리해야 하는 경우",
  "반복적인 데이터 분석과 보고서 업무를 자동화하고 싶은 경우",
  "미래의 수요나 성과를 예측하고 싶은 경우",
  "실시간 데이터 대시보드가 필요한 경우",
];

export const aiServices = [
  {
    title: "업무 자동화",
    description: "반복적인 데이터 처리와 업무 과정을 자동화하여 운영 효율을 높입니다.",
  },
  {
    title: "예측 모델",
    description: "과거와 현재의 데이터를 분석하여 수요, 성과, 위험 가능성 등을 예측합니다.",
  },
  {
    title: "추천 시스템",
    description: "사용자 및 고객 데이터를 기반으로 개인화된 콘텐츠, 상품 또는 서비스를 추천합니다.",
  },
];

export const processSteps = [
  { step: "01", title: "문제 정의", body: "고객의 목표와 현재 상황, 해결해야 할 문제를 파악합니다." },
  {
    step: "02",
    title: "데이터 구조화",
    body: "분석에 필요한 데이터를 수집, 정제, 분류하고 활용 가능한 형태로 구성합니다.",
  },
  {
    step: "03",
    title: "분석 및 인사이트 도출",
    body: "통계 분석, 시각화, 모델링을 통해 의사결정에 필요한 의미를 도출합니다.",
  },
  {
    step: "04",
    title: "솔루션 구현",
    body: "분석 결과를 바탕으로 실제 업무에 적용 가능한 시스템과 솔루션을 구현합니다.",
  },
  {
    step: "05",
    title: "운영 개선",
    body: "적용 이후 데이터와 사용 결과를 기반으로 지속적인 개선 방향을 제안합니다.",
  },
];

export const experienceAreas = [
  "공공기관 데이터 분석",
  "설문조사 및 통계 분석",
  "정책 및 사업 성과 분석",
  "기업 경영 데이터 분석",
  "고객 및 마케팅 데이터 분석",
  "데이터 시각화 및 대시보드",
  "업무 자동화",
  "예측 모델 개발",
  "추천 시스템 개발",
  "데이터·AI 실무 교육",
  "고객사 맞춤형 B2C 플랫폼 개발",
];

export const historyEntries: { date?: string; label: string }[] = [
  { date: "2007.05", label: "와이즈인컴퍼니 설립" },
  { label: "데이터 분석 중심의 전문성 축적" },
  { label: "공공기관 및 기업 프로젝트 수행 경험 확대" },
  { label: "AI 솔루션과 교육, 플랫폼 개발 분야로 역량 확장" },
];

export const malodahaeFeatures = [
  "재직자 대상 교육",
  "데이터 분석 실무",
  "AI 활용 실무",
  "실제 프로젝트 경험 기반",
  "내부 자체 커리큘럼",
  "국비지원 교육 운영 예정",
];

export const inquiryCategories = [
  "데이터 분석",
  "AI 솔루션 개발",
  "데이터·AI 교육",
  "B2C 플랫폼 개발",
  "기업·기관 교육",
  "기타 문의",
];

export const budgetOptions = [
  "1,000만 원 미만",
  "1,000만 원~3,000만 원",
  "3,000만 원~5,000만 원",
  "5,000만 원~1억 원",
  "1억 원 이상",
  "미정",
];

export const scheduleOptions = [
  "즉시 진행",
  "1개월 이내",
  "3개월 이내",
  "6개월 이내",
  "일정 미정",
];