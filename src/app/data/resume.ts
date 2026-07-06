export type ResumeSection = {
  title: string;
  items: string[];
};

export type ProjectHighlight = {
  title: string;
  period: string;
  github: string;
  teamRole: string;
  description: string;
  techTags: string[];
  keyRoles: string;
  troubleshoot: {
    issue: string;
    resolution: string;
  }[];
  achievements: string[];
};

export type ActivityGroup = {
  title: string;
  venue?: string;
  href?: string;
  linkLabel?: string;
  items: string[];
};

export const RESUME_PASSCODE = "sabin011108";

export const resumeData = {
  profile: {
    name: "민사빈",
    title: "Front-End Developer",
    image: "/minsbain.jpg",
    contacts: {
      email: "minsabin1108@gmail.com",
      github: "https://github.com/sabin1108",
    },
  },
  education: {
    school: "한경국립대학교",
    degree: "소프트웨어융합학과",
    status: "졸업",
    period: "2020.03 ~ 2026.02",
    gpa: "3.87 / 4.5",
    certificates: [
      {
        name: "정보처리기사",
        issuer: "한국산업인력공단",
        date: "2025.09.12",
      },
    ],
  },
  summary:
    `저는 호기심으로 넓게 기술을 배우려 하고, 판단으로 좁게 적용하는 프론트엔드 개발자 민사빈입니다. 궁금한 건 파보고 배우며, 적용은 엄격하게 판단합니다.

PhotoMap에서는 Context API를 Zustand Selector 구조로 전환해 리렌더링 범위를 70여 개 컴포넌트에서 5개 이하 컴포넌트로 좁히고 React Profiler 측정 기준 커밋 시간을 9.7ms에서 6.2ms로 약 36% 단축했고, @tanstack/react-virtual 기반 가상화로 DOM 노드를 200개 미만으로 유지하며 60FPS를 확보했습니다. D3 물리 시뮬레이션은 React State 대신 Ref와 DOM 직접 조작으로 처리해 리렌더링 횟수를 370회에서 25회로 줄였습니다.
Game Deal Watch에서는 캐시 매니저 등 인프라 유틸리티에 제네릭을 적용해 여러 데이터 타입에 재사용 가능한 구조로 만들었습니다. 또한 Vitest 단위 테스트와 Playwright E2E, 로컬 부하 테스트 스크립트를 배포 파이프라인에 포함시켜 릴리즈 전 자동 검증 체계를 구축했습니다.
Fallow 정적 분석으로 중복 코드를 668줄에서 121줄로(약 82% 감소) 정리해 유지보수성도 함께 관리했습니다.

저는 화면 구현을 넘어 아키텍처와 품질을 함께 설계하는 프론트엔드 엔지니어로 성장하고 싶습니다. 지표 기반으로 성능을 진단·개선하고 설계했던 경험을 바탕으로, 유지보수 가능한 코드베이스와 팀의 개발 표준까지 함께 만들어가고 싶습니다. 나아가 AI 도구를 단순 생성기가 아닌 프로세스 차원에서 전략적으로 통합해온 경험을 살려, AI 기반 기능을 제품 흐름에 자연스럽게 녹여내는 엔지니어가 되어 여러 직군과 경계 없이 소통으로 조직에 기여하고 싶습니다.`,
  coreSkills: [
    { title: "Frontend", items: ["React.js", "Next.js", "TypeScript", "JavaScript"] },
    { title: "State & DB", items: ["Zustand", "Supabase", "Redis"] },
    { title: "Styling", items: ["Tailwind CSS", "Shadcn UI", "CSS"] },
    { title: "Tools", items: [] },
    { title: "Tools - 협업 툴", items: ["Notion", "Slack", "GitHub"] },
    { title: "Tools - 개발 및 빌드", items: ["VS Code", "Vite"] },
    { title: "Tools - 테스트 및 품질", items: ["Vitest", "Playwright", "Fallow"] },
    { title: "Tools - 배포 및 인프라", items: ["Vercel", "NCP"] },
    { title: "Tools - AI 툴", items: ["Gemini", "gemini code assist", "OpenAI API", "Codex", "Claude"] },
  ] satisfies ResumeSection[],
  projectHighlights: [
    {
      title: "Game Information Platform",
      period: "2026.05 ~ 2026.06",
      github: "https://github.com/sabin1108/Game-information-platform",
      teamRole: "개인 프로젝트",
      description: "Steam/Epic 게임 할인 정보 조회, 관심 목록 및 목표가 추적, Supabase 기반 인증/DB 연동, Vercel production 배포까지 담당한 개인 서비스 프로젝트",
      techTags: ["Next.js (App Router) 14", "React", "TypeScript", "Zustand", "Supabase (PostgreSQL, Realtime DB, Auth)", "Tailwind CSS", "Shadcn UI", "Vitest", "Testing Library", "Playwright", "Fallow (정적 분석)"],
      keyRoles: "서비스 전체 프론트엔드 아키텍처 설계 및 구현 / Supabase Auth·DB 연동 / 테스트 자동화 및 배포 파이프라인 구축 / AI 개발 워크플로우 설계",
      troubleshoot: [
        {
          issue: "출시 예정이거나 가격 미확정인 게임의 가격값이 0 또는 null로 반환되어, 단순 비교 로직에서 '100% 할인' '최저가 도달'로 오판해 유저에게 거짓 알림이 노출되고 대시보드가 오염되는 문제가 있었습니다.",
          resolution: "game-score.ts의 가격 검증 파이프라인에서 releaseStatus === 'upcoming' 또는 currentPriceCents === 0인 경우를 명시적으로 판별해 최저가 뱃지 및 목표 조건 충족 판정에서 제외하는 예외 필터를 구현했습니다."
        },
        {
          issue: "비인증 사용자가 보호된 페이지로 접근 시 로그인 이후 원래 가려던 경로 정보가 유실되어 홈으로만 이동하고, 로그인 완료 후에도 헤더가 인증 상태를 실시간 반영하지 못하는 동기화 버그가 있었습니다.",
          resolution: "미들웨어 리다이렉트 시 /login?next={currentPath} 쿼리를 동봉해 로그인 성공 후 원래 경로로 복귀시키고, TopNav가 Supabase Auth of onAuthStateChange 이벤트를 전역에서 리스닝해 세션 변화 시 즉시 갱신되도록 구조를 변경했습니다."
        },
        {
          issue: "AI 어시스턴트를 활용해 빠르게 기능을 확장하다 보니 미사용 컴포넌트, 중복 유틸리티, clone 코드가 다량 발생해 유지보수성이 급격히 악화될 위험이 있었습니다.",
          resolution: "fallow 정적 분석 도구를 빌드 파이프라인에 통합해 중복·미사용 코드를 정밀 측정하고, 중복도가 높았던 GameCard를 이미지/가격정보/액션버튼 등 소형 컴포넌트로 기능 분할하며 캐시 매니저, 공통 유틸리티를 추출해 모듈화했습니다."
        },
        {
          issue: "외부 게임 가격 조회 API(ITAD)에 일시적 장애가 발생하거나 호출 한도를 초과하면 서비스 전체가 500 에러로 마비되는 구조적 약점이 있었습니다.",
          resolution: "hit/miss/stale 상태를 관리하는 커스텀 캐시 모듈을 작성해, fresh TTL(5분) 만료 이후에도 최대 6시간까지 데이터를 보관하고 외부 API 장애 시 이 stale 데이터로 폴백시켜 서비스 중단 없이 마지막 정상 데이터를 노출하도록 설계했습니다."
        },
        {
          issue: "Windows(PowerShell)와 CI(Unix shell) 간 환경 변수 설정 구문 차이로 번들 분석 빌드가 로컬에서만 실패하는 크로스플랫폼 호환성 문제가 있었습니다.",
          resolution: "cross-env 같은 외부 의존성 대신, OS에 구애받지 않는 경량 Node.js 실행 래퍼 스크립트를 직접 작성해 번들 분석 빌드를 트리거하도록 우회했습니다."
        },
        {
          issue: "AI와 협업하며 개발할 때 일관된 요구사항 해석과 검증, 작업 내역 인계가 이루어지지 않아 컨텍스트 유실 및 중복 구현이 발생했습니다.",
          resolution: "AI Skill을 grill-me(요구사항 검증) → to-prd(PRD 작성) → to-issues(GitHub issue 분해) → handoff(세션 인수인계) 순서로 파이프라인화하고, Harness로 product/frontend/QA 관점을 분리해 AI 협업 구조를 설계했습니다."
        }
      ],
      achievements: [
        "소스 코드 중복율 81.9% 감소 (668줄(5.73%) → 121줄(1.03%)), 미사용 파일/export 15개 → 0개로 완전 제거, Fallow 유지보수성 지표 91.3점 → 92.1점 상승",
        "외부 API 장애 상황에서도 서비스 다운 없이 stale 데이터로 지속 대응 가능한 회복 탄력성 확보",
        "Vitest 단위 테스트, Playwright E2E/웹뷰 시나리오, Load Smoke Test(p50/p95 latency, 캐시 hit율 검증)를 배포 파이프라인에 포함해 릴리즈 전 자동 검증 체계 구축"
      ]
    },
    {
      title: "PhotoMap",
      period: "2025.12 ~ 2026.04",
      github: "https://github.com/sabin1108/Photomap",
      teamRole: "3인 협업 (프론트엔드 담당)",
      description: "여행 사진의 메타데이터(EXIF)를 3D 지구본·지도·물리 그래프로 시각화하는 아카이브 플랫폼에서, 대규모 데이터 렌더링 성능 최적화와 상태 아키텍처 설계를 담당",
      techTags: ["React", "TypeScript", "Vite", "Zustand", "D3.js", "MapBox", "Leaflet", "Unity WebGL", "Tailwind CSS", "Radix UI", "Supabase (PostgreSQL, Auth/Storage)", "@tanstack/react-virtual"],
      keyRoles: "상태 관리 아키텍처 설계 (Context API → Zustand 전환) / 대규모 이미지 렌더링 성능 최적화 / D3 물리 시뮬레이션-React 렌더링 분리 설계",
      troubleshoot: [
        {
          issue: "5,000건 이상의 고해상도 사진을 로드할 때 DOM 노드가 급격히 늘어나 브라우저가 멈추거나 스크롤 시 심한 버벅임이 발생했습니다.",
          resolution: "@tanstack/react-virtual을 도입해 viewport 내 가시 영역의 row만 DOM에 렌더링하는 가상 그리드를 구현하고, 커스텀 훅으로 반응형 컬럼 개수와 좌표를 계산해 transform: translateY()로 절대 배치했습니다."
        },
        {
          issue: "AuthContext, PhotoContext 등 Context API 기반 전역 상태에서 사진 한 장의 찜 상태 변경 같은 사소한 업데이트에도 하위 컴포넌트 70여 개가 동시에 리렌더링되어 커밋 시간이 지연되는 문제가 있었습니다.",
          resolution: "상태 관리를 Zustand로 전면 개편하고, 컴포넌트별로 필요한 상태 슬라이스만 구독하는 Selector 패턴과 useShallow를 적용해 무관한 컴포넌트의 리렌더링을 차단했습니다."
        },
        {
          issue: "D3 물리 시뮬레이션(d3-force)의 tick 좌표를 React state로 바인딩하면서, 초당 수십 회의 물리 연산마다 Virtual DOM 비교가 발생해 프레임 드랍이 생겼습니다.",
          resolution: "D3 좌표 갱신을 React state에서 완전히 분리해, SVG 요소를 Ref로 직접 바인딩하고 tick 이벤트 핸들러 내부에서 style.setProperty/setAttribute로 DOM을 직접 갱신하도록 설계했습니다."
        },
        {
          issue: "인증 상태, 사진 피드, 카테고리 등 서로 의존 관계가 없는 초기 데이터를 순차(Waterfall) 방식으로 요청해 초기 화면 진입 시간이 길어졌습니다.",
          resolution: "상호 독립적인 초기 API 요청들을 Promise.all로 병렬 처리하고, 3D 지구본·2D 지도처럼 무거운 컴포넌트는 React.lazy/Suspense로 지연 로딩했습니다."
        },
        {
          issue: "화면 전환 후에도 D3 force simulation 루프가 백그라운드에서 계속 동작해 CPU 점유율을 차지하고 메모리 누수가 발생했습니다.",
          resolution: "useEffect cleanup 함수 내에서 simulation.stop()을 명시적으로 호출하고 모든 tick 리스너와 DOM 바인딩을 해제하는 클린업 로직을 구현했습니다."
        }
      ],
      achievements: [
        "10,000건 이상의 이미지가 있어도 실제 DOM 노드를 200개 미만으로 유지하며 스크롤 시 안정적인 60FPS 확보",
        "React Profiler 측정 기준 컴포넌트 렌더링 커밋 시간 약 36% 단축 (9.7ms → 6.2ms)",
        "물리 뷰 컴포넌트의 React 리렌더링 횟수를 370회 → 25회로 급감시키며 매끄러운 60FPS 인터랙션 구현",
        "초기 데이터 로딩 속도 50% 이상 단축, 화면 전환 후 CPU 점유율 즉시 0%로 복귀"
      ]
    },
    {
      title: "AIChatBot",
      period: "2025.09.10 ~ 2025.11.14",
      github: "https://github.com/sabin1108/graduation-project",
      teamRole: "2인 협업 (프론트엔드 담당)",
      description: "학사 정보(식단, 공지, 학사일정)를 수집·안내하는 AI 챗봇의 채팅 UI, 응답 파싱, API 정규화, 로컬 기반 대화 저장 구조를 담당",
      techTags: ["Next.js (App Router)", "TypeScript", "Tailwind CSS", "Shadcn UI", "React-Markdown", "Blob API"],
      keyRoles: "채팅 UI 및 AI 응답 파싱 파이프라인 구현 / API 응답 정규화 프록시 레이어 설계 / 서버 없는 로컬 대화 저장·동기화 구조 구축",
      troubleshoot: [
        {
          issue: "학사 공지에 포함된 수십 글자가 넘는 긴 원시 URL이 채팅 말풍선에 그대로 노출되어 모바일 뷰포트에서 가로 스크롤이 생기거나 UI가 깨지는 문제가 있었습니다.",
          resolution: "Markdown 파서가 생성하는 a 태그에 word-break: break-all 등 CSS를 적용하고, 메시지 전처리 단계에서 정규식으로 긴 URL을 [관련 링크 바로가기] 형태로 치환하는 파이프라인을 구현했습니다."
        },
        {
          issue: "식단·공지사항 API가 각각 다른 포맷(JSON/텍스트, 필드명 불일치 등)으로 응답해, UI 컴포넌트 내부에 split(), regex 매칭, 날짜 보정 코드가 뒤섞여 API가 바뀔 때마다 여러 곳을 수정해야 했습니다.",
          resolution: "Next.js API Routes 내에 Proxy Layer를 구축해, 외부 API의 서로 다른 응답 포맷을 백엔드 호출 시점에 표준 스키마로 정규화한 뒤 클라이언트에는 단일 JSON 구조로만 내려주도록 설계했습니다."
        },
        {
          issue: "로그인 기능이 없어 로컬스토리지로 대화를 관리하다 보니, 브라우저 탭 두 개를 열고 각각 대화를 진행하면 한쪽 탭의 데이터가 다른 탭의 최신 상태를 덮어써 대화 이력이 꼬이는 문제가 있었습니다.",
          resolution: "useEffect 내에서 window.addEventListener('storage', ...)로 다른 탭의 로컬스토리지 변경을 실시간 감지해, 비활성 탭의 React state를 즉시 동기화하도록 구현했습니다."
        },
        {
          issue: "대화 이력을 파일로 내보내는 기능을 만들 때, 개인정보(학사 대화 이력)를 외부 서버로 전송하지 않고 처리해야 하는 보안 요구가 있었습니다.",
          resolution: "대화 내보내기 기능은 서버로 재전송하지 않고 브라우저의 Blob 객체로 클라이언트 메모리 상에서 텍스트를 인코딩한 뒤 가상 a 태그로 다운로드시키고 메모리를 즉시 해제하도록 구현했습니다."
        }
      ],
      achievements: [
        "메시지 뷰 내 지저분한 URL 노출률 최대 90% 감소",
        "API 정규화 레이어 도입으로 UI 코드량 약 30% 절감, API 규격 변경 시 대응 지점을 프록시 레이어 1곳으로 단일화",
        "서버 인프라 유지 비용 0원(Zero Server Cost) 아키텍처 달성, 대화 정보가 브라우저 외부로 전송되지 않는 프라이버시 보장형 구조 완성"
      ]
    }
  ] satisfies ProjectHighlight[],
  activityGroups: [
    {
      title: "BRIGHT MAKERS EXPO 2025 캡스톤디자인 경진대회 우수상",
      venue: "한경국립대학교",
      items: [
        "제17회 캡스톤디자인 경진대회 팀 캔버스 참가, 학사 정보 접근성 개선 AI ChatBot 서비스 발표",
        "공지, 학식, 일정처럼 흩어진 정보를 채팅 흐름으로 연결해 필요한 정보를 빠르게 찾는 문제 해결 방향 제시",
        "프론트엔드 UI, 응답 가독성 개선, 대화 내역 관리 기능을 실제 사용 흐름으로 구현한 점을 성과로 인정",
      ],
    },
    {
      title: "생성형 AI 기반 포트폴리오 요약 플랫폼",
      venue: "대한전자공학회 투고 및 심사 완료",
      href: "/files/thesis/generative-ai-portfolio-summary-platform.pdf",
      linkLabel: "논문 PDF",
      items: [
        "AI 스트리밍 구조 적용, 평균 TTFT 18,279ms -> 607ms 개선 및 체감 대기시간 약 96.7% 단축 성능 평가",
        "컴포넌트·라우트 분리로 관리자 대시보드 LoC 231줄 -> 172줄 감소, 구조적 가독성 약 40%+ 개선 근거 정리",
        "생성형 AI 요약, 지식 기반 검증, DB 저장, 시각화 흐름을 분리한 AI 활용 및 유지보수 가능 아키텍처 중심 구성",
      ],
    },
    {
      title: "학교 정보 접근성 향상을 위한 대화형 질의응답 시스템",
      venue: "대한전자공학회 2025 하계종합학술대회 포스터/논문 발표",
      href: "/files/thesis/interactive-campus-qa-system.pdf",
      linkLabel: "논문 PDF",
      items: [
        "학사 정보 접근성 개선을 위해 공지, 일정, 행정 정보를 질의응답 흐름으로 연결하는 사용자 흐름 설계",
        "AI 응답 직접 노출 대신 응답 파싱, 링크 정리, 메시지 구조화 적용으로 URL 텍스트 노출 최대 90% 절감",
        "외부 데이터와 UI 결합도 완화를 위한 응답 정규화 계층 구성, UI 코드량 약 30% 절감 관점 정리",
      ],
    },
  ] satisfies ActivityGroup[],
  motivation: "",
} as const;
