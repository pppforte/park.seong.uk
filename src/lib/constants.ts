export const SKILLS = [
  {
    name: "Node.js",
    level: 95,
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
  },
  {
    name: "JavaScript",
    level: 92,
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
  },
  {
    name: "MongoDB",
    level: 92,
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
  },
  {
    name: "TypeScript",
    level: 88,
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
  },
  {
    name: "NestJS",
    level: 80,
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg",
  },
  {
    name: "Express",
    level: 90,
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
  },
];

export const PROJECTS = [
  {
    title: "챗봇 엔진 아키텍처 재설계",
    description:
      "레거시 절차지향 코드를 OOP 기반으로 전면 리팩토링. 20+ 종류의 블록 타입 통합 관리 체계 구축, 비동기 메시지 처리 파이프라인으로 처리량 증가, 멀티채널 메시지 라우팅 시스템 설계.",
    tags: ["Node.js", "MongoDB", "TypeScript"],
  },
  {
    title: "해피싱크 — OAuth 기반 간편가입 SaaS",
    description:
      "OAuth 2.0 기반 멀티 프로바이더(카카오, 네이버, 구글) 통합 설계. Strategy 패턴으로 확장 가능한 인증 아키텍처 구축. 복합 인덱스 전략으로 조회 성능 5배 향상. ISMS-P 인증 대응.",
    tags: ["NestJS", "MongoDB", "TypeScript", "OAuth 2.0"],
  },
  {
    title: "사내 인트라넷 시스템",
    description:
      "120명 사용 엔터프라이즈 시스템. 결재/출퇴근/비용처리 등 전사 업무 프로세스 디지털화. Google Sheets + App Script 연동 자동화. 실시간 데이터 동기화로 결재 처리 시간 80% 단축.",
    tags: ["Node.js", "MongoDB", "React", "AWS"],
  },
  {
    title: "SKT Galaxy S21 무인개통 이벤트",
    description:
      "분당 만 단위 트래픽 처리 가능한 고가용성 아키텍처 설계. CloudFront + Load Balancer 구성으로 안정적인 서비스 제공.",
    tags: ["Node.js", "MongoDB", "AWS", "CloudFront"],
  },
];

export const EXPERIENCE = [
  {
    period: "2025.09 — 현재",
    role: "AI 챗봇 개발자",
    company: "㈜서티라이프",
    tasks: ["서티라이프 내 AI 챗봇 시스템 전체 개발 담당"],
  },
  {
    period: "2021.04 — 2025.09",
    role: "챗봇개발팀 팀장",
    company: "엠비아이솔루션 → 블룸에이아이",
    tasks: [
      "챗봇 엔진 아키텍처 전면 재설계 (OOP 기반)",
      "해피싱크 SaaS 플랫폼 프로젝트 리드",
      "OAuth 2.0 통합 인증 시스템 구축",
      "MongoDB 쿼리 최적화 및 성능 개선",
      "멀티채널 통합 (카카오톡, 네이버, 라인, 페이스북)",
      "99.9% 가동률 달성",
    ],
  },
  {
    period: "2020.01 — 2021.04",
    role: "백엔드 개발자",
    company: "에프엠테크놀로지 → 에프엠커뮤니케이션즈",
    tasks: [
      "120명 규모 사내 인트라넷 시스템 개발",
      "SKT Galaxy S21 무인개통 이벤트 시스템 (만 단위 트래픽)",
      "다수 온오프라인 프로모션 프로젝트 수행",
    ],
  },
  {
    period: "2018.06 — 2019.03",
    role: "IT 교육 강사",
    company: "㈜에듀앤텍",
    tasks: [
      "강남대학교/수원상공회의소 Java Programming 교육",
      "해외취업교육과정 수행",
    ],
  },
];

export const NAV_LINKS = [
  { href: "#about", label: "소개" },
  { href: "#skills", label: "기술" },
  { href: "#projects", label: "프로젝트" },
  { href: "#experience", label: "경력" },
  { href: "#contact", label: "연락" },
  { href: "/blog", label: "블로그" },
];

export const ABOUT_DETAILS = [
  { label: "위치", value: "서울 용산구" },
  { label: "이메일", value: "developer@park.seong.uk", href: "mailto:developer@park.seong.uk" },
  { label: "경력", value: "6년 11개월" },
  { label: "학력", value: "대전대학교 컴퓨터공학(소프트웨어공학) 석사" },
  { label: "전문", value: "Node.js / MongoDB" },
];
