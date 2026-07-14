export type ResumeSection = {
  title: string;
  items: string[];
};

export type ProjectHighlight = {
  title: string;
  period: string;
  github: string;
  live?: string;
  teamRole: string;
  description: string;
  techTags: string[];
  keyRoles: string;
  issues: string[];
  resolutions: string[];
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

PhotoMap에서는 Context API를 Zustand Selector 구조로 전환해 리렌더링 범위를 70여 개 컴포넌트에서 5개 이하 컴포넌트로 좁히고 React Profiler 측정 기준 커밋 시간을 9.7ms에서 6.2ms로 약 36% 단축했고, @tanstack/react-virtual 기반 가상화로 DOM 노드를 200개 미만으로 유지해 대량 사진 구간의 스크롤 프레임 저하를 완화했습니다. D3 물리 시뮬레이션은 React State 대신 Ref와 DOM 직접 조작으로 처리해 리렌더링 횟수를 370회에서 25회로 줄였습니다.
Game Information Platform에서는 캐시 매니저 등 인프라 유틸리티에 제네릭을 적용해 여러 데이터 타입에 재사용 가능한 구조로 만들었습니다. 또한 Vitest 단위 테스트와 Playwright E2E, 로컬 부하 테스트 스크립트를 배포 파이프라인에 포함시켜 릴리즈 전 자동 검증 체계를 구축했습니다.
Fallow 정적 분석으로 중복 코드를 1,006줄(9.4%)에서 308줄(2.9%)로 줄이고, 미사용 파일/export를 0개로 정리해 유지보수성도 함께 관리했습니다.

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
      live: "https://www.gamesaleinfo.site",
      teamRole: "개인 프로젝트 (1인 개발)",
      description: "Steam/Epic 게임 할인 조회 및 관심 상품 가격 추적 서비스",
      techTags: ["Next.js", "TypeScript", "React", "Supabase", "Vercel", "Vitest", "Playwright"],
      keyRoles: "서비스 전체 프론트엔드 설계 및 구현 / Supabase Auth/DB 연동 / 테스트 및 배포 환경 구축",
      issues: [
        "Steam/Epic/ITAD API 응답의 식별자, 가격, 할인율, 이미지, 상점 링크 필드가 서로 달라 UI 컴포넌트가 API별 예외를 직접 처리해야 하는 결합 문제가 있었습니다.",
        "출시 예정, 가격 미정, 데이터 미제공 게임의 0원/null 값이 최저가 후보로 들어가 100% 할인이나 목표가 도달처럼 오판될 수 있는 문제가 있었습니다.",
        "검색/할인/인기 공개 route가 외부 가격 API 응답성에 직접 묶여 timeout, 호출 한도 초과, 반복 새로고침이 500 오류나 빈 화면으로 이어질 수 있었습니다.",
        "관심 목록, 목표 가격 계산, 웹뷰, analytics, monitoring까지 기능 범위가 넓어지면서 수동 확인만으로 API 응답 형식 변경과 회귀를 안정적으로 잡기 어려웠습니다.",
        "기능을 빠르게 붙이는 과정에서 unused file/export, 테스트 중복, 타입 반복 코드가 남고 일부 API route와 테스트 파일이 복잡도 hotspot으로 커졌습니다."
      ],
      resolutions: [
        "API 호출 결과와 UI layer 사이에 Adapter/Normalizer 계층을 두고, GameSummary와 StoreProduct 같은 공통 view model로 변환해 화면 컴포넌트가 외부 API 포맷을 직접 알지 않게 했습니다.",
        "store priority, dedupe, steam app id 추출, 가격/할인 표시 규칙을 normalizer와 domain layer로 모아 API 응답 차이를 한곳에서 흡수하도록 정리했습니다.",
        "game-score.ts에서 currentPriceCents > 0인 가격만 best price 후보로 사용하고, 후보가 없으면 목표 가격 매칭을 false로 처리해 0원/null 가격 오판을 막았습니다.",
        "fresh TTL 이후에도 일정 시간 stale 데이터를 유지하는 cache 모듈과 fixed-window rate limit을 route 경계에 추가해 외부 API 실패와 반복 호출을 완충했습니다.",
        "Vitest로 API route, 정규화 함수, cache hit/miss/stale, rate limit, 목표가 계산, analytics payload를 검증하고 Playwright로 홈, 인증, 관심 목록, 모바일 웹뷰 흐름을 확인했습니다.",
        "Fallow 정적 분석 결과를 기준으로 unused files/exports, duplication, maintainability를 추적하고 정리 우선순위를 정했습니다."
      ],
      achievements: [
        "검색 결과, 할인 목록, 상세 화면, 관심 목록이 정규화된 view model만 소비하게 되어 외부 API 응답 변경 시 수정 범위와 중복 분기 위험을 줄였습니다.",
        "0원/null 가격이 최저가나 목표가 달성 상태로 표시되는 경로를 차단하고, 실제 구매 가능한 가격 후보가 있을 때만 할인/목표가 정보를 보여주도록 만들었습니다.",
        "외부 API가 느리거나 실패해도 stale 데이터를 반환할 수 있어 검색/할인 화면이 바로 500 오류로 무너지지 않게 했고, rate limit 케이스를 route 테스트로 검증했습니다.",
        "unit/component/API/E2E spec 25개 파일과 69개 케이스를 정리했고, 주요 리팩터 검증에서 Vitest 21 files / 60 tests 통과 기록을 남겼습니다.",
        "unused files 1개와 unused exports 11개를 0개로 정리했고, 중복 코드는 1,006줄(9.4%)에서 308줄(2.9%)로 낮췄으며 maintainability를 91.3에서 92.1로 개선했습니다."
      ]
    },
    {
      title: "PhotoMap",
      period: "2025.12 ~ 2026.04",
      github: "https://github.com/sabin1108/Photomap",
      live: "https://photomap-three.vercel.app/",
      teamRole: "3인 협업 (FE 1명, BE 2명 / FE 최적화 및 상태 아키텍처 담당)",
      description: "대용량 사진 데이터를 지도 기반으로 탐색하는 웹 서비스",
      techTags: ["React", "TypeScript", "Zustand", "D3.js", "Supabase", "@tanstack/react-virtual", "Unity WebGL", "Canvas", "cobe", "Lighthouse"],
      keyRoles: "상태 관리 구조 개선 / 렌더링 성능 최적화 / D3 및 WebGL 계열 시각화 연동 / 성능 측정 자동화",
      issues: [
        "public home의 사진 preview 카드가 원본 1920px급 이미지를 그대로 요청하면서 Lighthouse LCP와 전체 payload가 이미지 전송량에 묶이는 병목이 있었습니다.",
        "지도 화면에서 React UI, Mapbox, Unity WebGL iframe, cobe canvas globe가 함께 동작해 화면 전환이나 필터 변경 때 렌더링 책임과 수명 주기가 섞일 위험이 있었습니다.",
        "5,000건 이상의 고해상도 이미지 데이터 로딩 시 DOM 노드와 이미지 요소, hover/transition 비용이 선형으로 증가해 스크롤 프레임이 끊기고 브라우저가 일시 프리징되는 병목이 생겼습니다.",
        "Context API 기반 전역 상태 설계로 인해 특정 사진 한 장의 즐겨찾기 변경 같은 작은 상태 업데이트에도 지도, 앨범, 타임라인, 업로드 화면까지 넓게 리렌더링됐습니다.",
        "D3 force simulation의 tick 좌표와 zoom/mouse 이벤트를 React state에 올리면서 reconciliation과 SVG diff가 반복되어 NodeView 렌더링이 370회까지 증가했습니다.",
        "초기 진입 흐름에서 카테고리, 사진 목록, 사용자 상태 요청이 순차 실행되어 지도와 앨범 화면이 필요한 데이터 일부를 갖고도 렌더링을 기다리는 network waterfall이 있었습니다.",
        "백엔드가 제공하는 사진·위치·카테고리 데이터를 여러 화면이 동시에 사용하면서, 화면별 상태 처리 방식이 달라지면 팀 전체 수정 범위가 커질 수 있었습니다."
      ],
      resolutions: [
        "Supabase Storage image transform fallback으로 preview 이미지는 320px급 URL을 우선 사용하게 하고, 상단 카드만 eager/high priority로 두며 나머지는 lazy/async로 조정했습니다.",
        "Unity WebGL 지도는 iframe으로 분리하고 postMessage/SendMessage로 필요한 사진·위치 데이터만 전달해 React 상태 변경과 WebGL 런타임을 분리했습니다.",
        "cobe 기반 GlobeView는 idle mount, marker memoization, contain: layout paint size, globe.destroy() cleanup을 적용하고 frame budget probe로 canvas 렌더링 비용을 따로 기록할 수 있게 했습니다.",
        "@tanstack/react-virtual 기반 row 가상화로 보이는 구간만 DOM에 유지하고, 불필요한 motion 연산은 CSS 전환으로 바꾸며 이미지 카드를 메모이제이션했습니다.",
        "상태 관리를 Zustand store로 분리하고 useShallow selector로 필요한 slice만 구독하게 바꿔 화면별 반응 범위를 줄였습니다.",
        "D3 시뮬레이션은 custom hook으로 분리하고, tick에서는 ref와 DOM 속성을 직접 갱신해 React는 구조 변경에만 집중하게 했습니다.",
        "초기화 단계에서 서로 독립적인 요청을 Promise.all로 병렬화하고, 공통 상태는 먼저 store에 적재해 화면이 준비되는 즉시 렌더링되도록 정리했습니다.",
        "서버 데이터 흐름은 유지한 채 FE store와 selector를 기준으로 화면별 구독 범위를 나누고, 대량 렌더링과 D3 시뮬레이션은 프론트엔드 내부 책임으로 분리했습니다."
      ],
      achievements: [
        "Lighthouse 측정 기준 Supabase image transform 적용 후 Performance score를 50점에서 77점으로 높이고, LCP를 63,804ms에서 4,150ms로 낮췄으며, 초기 payload를 12,586KiB에서 381KiB로 줄였습니다.",
        "WebGL/canvas 영역을 React 전체 리렌더링 최적화와 분리해 iframe 메시지 브릿지, idle mount, cleanup, frame budget 측정 기준으로 설명할 수 있게 했습니다.",
        "10,000건 이상의 대량 이미지 데이터를 처리할 때도 DOM 노드를 약 200개 수준으로 유지해 브라우저가 감당해야 하는 노드 수를 고정했습니다.",
        "Context API 기반 전역 리렌더링을 Zustand selector 구조로 바꿔 상태 변경 리렌더링 범위를 70여 개 컴포넌트에서 5개 이하로 줄였습니다.",
        "React Profiler 측정 기준 컴포넌트 렌더링 커밋 시간을 9.7ms에서 6.2ms로 약 36% 단축했습니다.",
        "D3 NodeView 렌더링 수를 370회에서 25회로 낮추고, 좌표 갱신은 ref와 DOM 속성 변경으로 처리해 그래프 조작 중 반복 계산을 줄였습니다.",
        "초기 데이터 요청의 network waterfall을 줄이고, 사진 목록과 앨범/지도에 필요한 공통 상태를 먼저 채울 수 있는 흐름으로 개선했습니다.",
        "백엔드 데이터 구조 변경 없이 프론트엔드 병목을 줄이고, 데이터 계약과 렌더링 책임을 분리해 팀 안에서 병목 원인과 수정 범위를 더 빠르게 공유할 수 있게 했습니다."
      ]
    },
    {
      title: "AI ChatBot",
      period: "2025.09.10 ~ 2025.11.14",
      github: "https://github.com/sabin1108/graduation-project",
      teamRole: "2인 협업 (FE 1명, BE 1명 / FE 채팅 UI 및 API 연동 담당)",
      description: "학사 정보(식단, 공지, 학사일정)를 수집·안내하는 AI 챗봇 서비스",
      techTags: ["Next.js (App Router)", "TypeScript", "Tailwind CSS", "Shadcn UI", "React-Markdown", "Blob API"],
      keyRoles: "채팅 UI 및 AI 응답 파싱 파이프라인 구현 / API 응답 정규화 프록시 레이어 설계 / 서버 없는 로컬 대화 저장·동기화 구조 구축",
      issues: [
        "학사 공지에 포함된 긴 원시 URL과 줄바꿈 없는 비정형 텍스트가 채팅 말풍선에 그대로 노출되어 모바일 viewport에서 가로 스크롤이나 말풍선 깨짐이 생겼습니다.",
        "채팅, 공지, 식단 API를 연결하면서 외부 백엔드 응답이 JSON과 비정형 텍스트를 혼용하고 날짜 필드명도 달라, split/regex/예외 처리가 UI 컴포넌트 안으로 번졌습니다.",
        "로그인 없이 localStorage로 대화 기록을 관리하는 구조에서 새로고침하면 대화가 사라질 수 있고, 여러 탭을 열었을 때 채팅 목록과 활성 대화가 어긋날 수 있었습니다.",
        "대화 내역 내보내기 기능에서 이미 브라우저에 있는 사용자 대화를 파일 생성을 위해 서버로 다시 보내면 불필요한 개인정보 노출 경로와 서버 저장 책임이 생길 수 있었습니다.",
        "학식 확인 흐름이 앱, 식단 메뉴, 홈페이지로 분산되어 있어 사용자가 원하는 정보를 찾기까지 여러 단계를 거쳐야 하는 접근성 문제가 있었습니다.",
        "카카오톡 챗봇은 접근성이 높지만 전시와 기능 확장에는 제약이 있고, 웹페이지형 챗봇은 UI 완성도와 기능 확장에 유리해 제품 방향을 정해야 했습니다.",
        "초기 조사 과정에서 교내 Open API 제공 여부가 명확하지 않고 부서별 문의가 필요한 상황이 확인되어, 공지·학식·일정 데이터를 안정적으로 가져오는 방식을 별도로 검토해야 했습니다.",
        "2인 협업에서 백엔드가 공지·식단·일정 데이터를 수집하고 프론트엔드는 채팅 UI로 보여줘야 했기 때문에, 응답 형식 차이를 UI가 직접 처리하면 FE와 BE 변경이 강하게 묶이는 문제가 있었습니다."
      ],
      resolutions: [
        "ReactMarkdown과 remark-gfm으로 메시지를 렌더링하고, URL은 markdown link 형태로 변환했으며 링크 요소에는 줄바꿈 가능한 스타일을 적용했습니다.",
        "Next.js API Routes를 proxy layer로 두고 chat route와 notice route에서 외부 API 호출과 응답 경계를 담당하게 해 UI는 내부 route와 action만 호출하도록 정리했습니다.",
        "useLocalStorage hook으로 localStorage 읽기/쓰기를 감싸고, storage 이벤트를 구독해 다른 탭의 변경을 현재 탭 상태에 반영했습니다.",
        "브라우저 Blob API와 URL.createObjectURL로 클라이언트 메모리에서 txt 파일을 만들고, 다운로드 후 revokeObjectURL로 URL을 해제했습니다.",
        "긴 URL, 날짜, 목록, 공지 링크 정리는 채팅 UI 표시 규칙으로 분리하고, 백엔드 응답 포맷 차이는 API route 경계에서 먼저 흡수하도록 했습니다.",
        "카카오톡 챗봇과 웹페이지형 챗봇을 비교한 뒤, 전시 가능성과 기능 확장성을 고려해 학사 일정, 학식, 공지, 빠른 링크를 함께 제공하는 웹 기반 챗봇 UI로 방향을 정했습니다.",
        "초기 조사 과정에서 교내 API 제공 여부가 명확하지 않았기 때문에, 백엔드가 크롤링·캐싱으로 데이터를 최신화하는 방향을 검토했고, 프론트엔드는 월/날짜 입력 예시와 기능별 사용 안내를 제공하는 방식으로 사용자 흐름을 정리했습니다."
      ],
      achievements: [
        "공지 링크와 긴 답변을 채팅 말풍선 안에서 읽기 쉬운 문단과 링크 형태로 보여주어 모바일 viewport의 가로 스크롤과 말풍선 깨짐을 줄였습니다.",
        "외부 API 경계가 Next.js route 파일로 모이면서 채팅 입력, 메시지 목록, 공지 표시 컴포넌트의 책임을 메시지 표시와 사용자 상호작용 중심으로 줄였습니다.",
        "로그인 없는 구조를 유지하면서도 새로고침 후 채팅 목록과 활성 채팅을 복원하고, 여러 탭에서 대화 목록이 어긋나는 위험을 줄였습니다.",
        "대화 내역 내보내기를 서버 저장/재전송 없이 브라우저 메모리에서 처리해 추가 저장 서버나 삭제 정책이 필요하지 않게 했습니다.",
        "백엔드 담당자는 데이터 수집과 응답 제공에 집중하고, 프론트엔드는 사용자 대화 흐름과 표시 안정성에 집중할 수 있도록 협업 경계를 나눴습니다.",
        "BRIGHT MAKERS EXPO 2025 캡스톤디자인 경진대회에서 학교 정보 접근성 개선 AI ChatBot 서비스로 우수상을 받았습니다.",
        "학사 일정, 학식 메뉴, 빠른 링크, 월/날짜 기반 공지 조회 예시를 사용 안내에 정리해 전시 현장에서 처음 쓰는 사용자도 기능 범위를 이해할 수 있게 했습니다.",
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
        "AI 응답 직접 노출 대신 응답 파싱, 링크 정리, 메시지 구조화 적용으로 긴 URL과 비정형 텍스트의 가독성 개선",
        "외부 데이터와 UI 결합도 완화를 위한 응답 정규화 계층 구성, API 응답 변경 대응 지점 단일화 관점 정리",
      ],
    },
  ] satisfies ActivityGroup[],
  motivation: "",
} as const;
