export type SkillGroup = {
  title: string;
  items: string[];
};

export type Project = {
  title: string;
  summary: string;
  role: string;
  period: string;
  tech: string[];
  metrics: { label: string; value: string }[];
  workflowTerms?: {
    label: string;
    purpose: string;
    used: string[];
    result: string;
  }[];
  links: {
    live?: string;
    github?: string;
  };
  image?: string;
  imageGallery?: {
    main: {
      src: string;
      alt: string;
    };
    supporting: {
      src: string;
      alt: string;
    }[];
  };
  imageAlt: string;
  achievements: {
    summary: string;
    details: string;
    before: string;
    after: string;
  }[];
  details: {
    context: string;
    role: string;
    architecture: string;
    keyFeatures: string[];
    challenges: string[];
    solutions: string[];
    validation: string[];
    result: string;
    process?: string;
    aiTraceability?: string[];
    operationalEvidence?: string[];
    codeHighlight?: {
      title: string;
      code: string;
    };
  };
};

export type ResumeSection = {
  title: string;
  items: string[];
};

export const portfolio = {
  profile: {
    name: "민사빈",
    title: "Front-End Developer",
    headline: "성능 수치로 말하는 프론트엔드 개발자 — React 최적화 · AI 협업 · 풀스택 배포",
    intro:
      "커밋 시간 36% 단축, 10,000건 데이터에서 60FPS 수준 방어, 소스 코드 중복 81.9% 제거처럼 기능이 동작하는 것에서 멈추지 않고 수치로 개선을 증명합니다. AI를 보조 도구가 아닌 개발 파이프라인의 일부로 통합해 기획부터 배포, 문서화까지 end-to-end로 완성합니다.",
    highlights: [
      "Game Sale Info에서 Steam/Epic 할인 조회, 관심 목록, 목표 가격 추적, Supabase Auth/DB, Vercel 배포까지 직접 구축",
      "PhotoMap에서 Zustand selector, 가상화, D3 DOM 직접 조작으로 대량 데이터 렌더링 병목 개선",
      "PRD, 이슈 분할, 하네스 기반 역할 분리, 핸드오프, 정적 분석, smoke test를 AI agent workflow로 연결",
    ],
    contacts: {
      email: "minsabin1108@gmail.com",
      github: "https://github.com/sabin1108",
    },
  },
  techStack: ["JavaScript", "React", "TypeScript", "GitHub", "Slack", "Notion"],
  projects: [
    {
      title: "Game-information-platform",
      summary:
        "Steam/Epic 할인 정보 조회, 관심 목록, 목표 가격 추적, Vercel 배포 완료 후 기능 개선과 품질 정리를 이어가는 Next.js 게임 할인 정보 추적 서비스",
      role: "프론트엔드 구현, Supabase Auth/DB 연동, AI-assisted workflow 설계, 정적 분석 기반 품질 개선, Vercel production 배포/검증",
      period: "2026",
      tech: ["Next.js", "React", "TypeScript", "Supabase", "Vitest", "Playwright"],
      metrics: [
        { label: "Duplication", value: "81.9% down" },
        { label: "Unused file/export", value: "15 -> 0" },
        { label: "Fallow health", value: "84.7 / B" },
      ],
      workflowTerms: [
        {
          label: "AI Skill",
          purpose:
            "AI를 코드 작성 보조가 아니라 기획, 분석, 정리, 검증까지 각 단계에 맞는 개발 파이프라인 도구로 사용했습니다.",
          used: ["grill-me", "to-prd", "to-issues", "handoff", "caveman"],
          result:
            "모호한 요구사항을 개발 스펙으로 구체화하고, PRD를 GitHub issue 단위로 분할해 반복 구현했습니다.",
        },
        {
          label: "Harness",
          purpose:
            "긴 개발 세션에서 기능 범위, 데이터 계약, UX, QA 관점을 따로 점검하기 위한 작업 운영 방식입니다.",
          used: [
            "5 project agents",
            "5 guardrail skills",
            "game-deal-harness-orchestrator",
          ],
          result:
            "세부 성과는 아래 핵심 성과 항목에서 실제 작업 흐름 중심으로 설명했습니다.",
        },
        {
          label: "Fallow",
          purpose:
            "유지보수 품질을 감으로 판단하지 않고 unused file/export, duplication, complexity hotspot을 수치로 확인했습니다.",
          used: ["dead-code", "dupes", "score", "maintainability"],
          result:
            "소스 중복 668줄 -> 121줄, unused file/export 기준 dead-code 15개 -> 0개로 정리했습니다. 당시 Fallow maintainability 지표는 91.3점 -> 92.1점으로 개선했고, 현재 Fallow health score는 84.7 / B입니다.",
        },
      ],
      links: {
        live: "https://www.gamesaleinfo.site",
        github: "https://github.com/sabin1108/Game-information-platform",
      },
      imageAlt: "Game-information-platform 프로젝트 화면",
      imageGallery: {
        main: {
          src: "/1_project/gameinfo_1.png",
          alt: "Game-information-platform 메인 화면",
        },
        supporting: [
          {
            src: "/1_project/gameinfo_2.png",
            alt: "Game-information-platform 보조 화면 1",
          },
          {
            src: "/1_project/gameinfo_3.png",
            alt: "Game-information-platform 보조 화면 2",
          },
          {
            src: "/1_project/gameinfo_4.png",
            alt: "Game-information-platform 보조 화면 3",
          },
        ],
      },
      achievements: [
        {
          summary: "Fallow로 unused file/export와 중복 코드를 추적해 AI 협업 중 생기는 유지보수성 저하를 최소화",
          details:
            "AI로 빠르게 기능을 확장하면서 생긴 unused file/export와 duplicate clone group을 Fallow 지표로 확인했습니다.\n\nunused file/export 기준 dead-code를 15개에서 0개로 낮추고, 소스 중복을 668줄에서 121줄로 낮춰 유지보수 부담을 줄였습니다. 현재 Fallow 기준 unused dev dependency 1건은 별도 관리 대상으로 남겨 두었습니다.",
          before: "Dead/duplicate",
          after: "Cleaned up",
        },
        {
          summary: "Harness로 product·data·frontend·QA 관점을 분리해 긴 개발 세션의 누락 방지",
          details:
            "프로젝트 전용 agent 5개와 guardrail skill 5개를 구성해 기능 범위, API 계약, UX, 테스트 관점을 나눠 점검했습니다.\n\nhandoff 문서로 세션이 바뀌어도 issue 상태와 검증 기준을 이어가게 만들었습니다.",
          before: "관점 혼재",
          after: "역할 분리",
        },
        {
          summary: "AI 할인 인사이트는 price snapshot evidence만 입력으로 사용하게 제한하고 CI·Fallow 지표로 검증 증거화",
          details:
            "AI가 가격이나 할인율을 지어내지 못하도록 evidence-only prompt가 저장된 price snapshot과 review evidence만 사용하게 제한했습니다.\n\nAI job의 실행 상태, 모델명, 실패 원인과 생성 결과의 evidence JSON을 저장해 결과를 추적할 수 있게 했습니다.",
          before: "AI free-form",
          after: "Evidence-first",
        },
        {
          summary: "AI Skill로 PRD-이슈-구현-검증 흐름 구조화",
          details:
            "grill-me, to-prd, to-issues, handoff를 사용해 큰 요구사항을 실행 가능한 GitHub issue와 검증 기준으로 나눴습니다.",
          before: "큰 로드맵",
          after: "이슈 단위",
        },
      ],
      details: {
        context:
          "Game Sale Info는 Steam/Epic 할인 정보를 조회하고 관심 목록과 목표 가격을 추적하는 Next.js 서비스입니다. 단순 구현보다 실제 사용 흐름, 인증/DB, UX 피드백, 배포 검증, 코드 품질 지표까지 end-to-end로 연결하는 데 집중했습니다.",
        role:
          "프론트엔드 구현과 함께 Supabase Auth/DB, Vercel production 배포, smoke test, AI-assisted workflow를 설계했습니다. PRD, issue slicing, handoff, 정적 분석, 검증 증거를 작업 흐름에 연결했습니다.",
        architecture:
          "Next.js App Router와 Supabase 기반 서비스 위에 Codex/Harness 작업 체계를 붙였습니다. 관심 목록 추가, 삭제 후 복구, 목표 가격 추적 같은 사용자 흐름은 DB 상태와 UI 피드백을 함께 맞췄고, Fallow는 코드 품질 측정과 리팩터링 target 선정에 사용했습니다.",
        keyFeatures: [
          "Steam/Epic 할인 정보 조회와 관심 목록 목표 가격 추적",
          "관심 목록 추가 후 redirect 제거, 카드 인라인 3초 피드백 적용",
          "삭제 후 재추가 시 archived row 복구",
          "handoff로 issue 상태, 검증 결과, secret 처리 규칙을 세션 간 유지",
          "Fallow로 unused file/export, duplication, maintainability, hotspot 측정",
          "CI/CD, smoke test, Supabase Auth/DB, Vercel production 배포",
        ],
        challenges: [
          "auth, Supabase, 외부 API, 관심 목록 UX, CI가 섞여 매 세션마다 맥락 손실 위험이 있었습니다.",
          "AI가 기능 구현만 보고 테스트, 문서, 포트폴리오 증거, 데이터 계약을 놓칠 수 있었습니다.",
          "기능 추가 후 dead-code와 duplication이 쌓여 유지보수 품질을 수치로 확인할 필요가 있었습니다.",
        ],
        solutions: [
          "Harness로 역할별 agent/skill을 만들어 product, data, frontend, QA, portfolio 관점을 분리했습니다.",
          "to-prd/to-issues로 큰 요구사항을 GitHub issue 단위로 나누고, handoff로 다음 세션 기준을 남겼습니다.",
          "Fallow 분석 결과를 기준으로 소스 중복과 dead-code를 줄이고 개선 전후 지표를 남겼습니다.",
        ],
        validation: [
          "Fallow 실행: 소스 중복 668줄(5.73%) -> 121줄(1.03%)",
          "Fallow 실행: 전체 중복 1,006줄(9.4%) -> 308줄(2.9%)",
          "Fallow 실행: unused file/export 기준 dead-code 15개 -> 0개",
          "당시 Fallow maintainability 지표: 91.3점 -> 92.1점(good)",
          "현재 Fallow health score: 84.7 / B, unused dev dependency 1건 별도 관리",
          "Vitest 21 files / 60 tests passed",
          "Playwright smoke 2 tests passed",
          "typecheck, lint, build, Vercel production 배포까지 확인",
        ],
        result:
          "AI를 단순 코드 생성 도구가 아니라 프로젝트 운영 체계로 사용했습니다. 결과를 issue, handoff, smoke test, Fallow 지표, production 배포 증거로 남겨 포트폴리오에서 설명 가능한 성과로 만들었습니다.",
        process:
          "아이디어/피드백 -> grill-me 요구사항 검증 -> to-prd 문서화 -> to-issues 이슈 분할 -> handoff 맥락 유지 -> fallow 품질 측정 -> 구현/검증/배포 -> 포트폴리오 evidence 정리 흐름으로 진행했습니다.",
        aiTraceability: [
          "AI 요약 입력은 저장된 price snapshot과 review evidence로 제한했습니다. 가격, 할인율, 날짜를 새로 만들지 못하게 prompt 계약을 테스트에 남겼습니다.",
          "ai_insight_runs에는 실행 상태, model_name, error_message, 시작/완료 시각을 남겨 실패 지점을 다시 볼 수 있게 했습니다.",
          "ai_game_insights에는 summary와 evidence JSON을 같이 저장해 화면에 나온 문장을 원본 근거와 대조할 수 있게 했습니다.",
          "API route는 status, duration, cache 상태를 header와 structured log로 남겼습니다.",
        ],
        operationalEvidence: [
          "검색/할인/인기 API에는 process-local cache, stale fallback, rate limit을 넣어 외부 API 실패와 반복 호출에 대비했습니다.",
          "관심목록 추가는 redirect 없이 카드 안에서 created, duplicate, restored, failed 상태를 보여주게 바꿨습니다.",
          "Next production build에서 shared 102 kB, home 108 kB, deals 109 kB first load JS를 기록했습니다.",
          "Sentry, Web Vitals, API latency 수집 경로를 구현해 오류와 성능 문제를 확인할 수 있게 했습니다.",
        ],
        codeHighlight: {
          title: "Fallow 품질 측정 명령",
          code: `npx fallow --format json --quiet --score
npx fallow dead-code --format json --quiet
npx fallow dupes --format json --quiet`,
        },
      },
    },
    {
      title: "PhotoMap",
      summary:
        "EXIF 메타데이터 기반 사진 아카이브에서 대량 이미지 탐색, 2D/3D 지도 시각화, D3 관계 그래프의 렌더링 병목을 개선한 프로젝트",
      role: "프론트엔드 UI/UX 구현, Zustand 상태 구조 개선, 가상화 기반 대량 리스트 최적화, D3/Unity WebGL 시각화 연동",
      period: "2025.12 ~ 2026.04",
      tech: ["React", "TypeScript", "Zustand", "@tanstack/react-virtual", "D3.js", "Unity WebGL"],
      metrics: [
        { label: "Render", value: "36% down" },
        { label: "DOM", value: "<200" },
        { label: "Load", value: "50%+ down" },
      ],
      links: {
        github: "https://github.com/sabin1108/Photomap",
      },
      imageAlt: "PhotoMap 프로젝트 화면",
      imageGallery: {
        main: {
          src: "/2_project/photoproject_1.png",
          alt: "PhotoMap 메인 화면",
        },
        supporting: [
          {
            src: "/2_project/photoproject_2.png",
            alt: "PhotoMap 보조 화면 1",
          },
          {
            src: "/2_project/photoproject_3.png",
            alt: "PhotoMap 보조 화면 2",
          },
          {
            src: "/2_project/photoproject_4.gif",
            alt: "PhotoMap 보조 화면 3",
          },
        ],
      },
      achievements: [
        {
          summary: "Context API 전역 리렌더링을 Zustand selector 구독으로 바꿔 커밋 시간 36% 단축",
          details:
            "Context API 기반 상태 공유로 작은 상태 변경에도 70개 이상 컴포넌트가 함께 리렌더링되는 문제가 있었습니다.\n\nZustand selector와 useShallow 패턴으로 필요한 slice만 구독하게 바꿔 React Profiler 기준 커밋 시간을 9.7ms에서 6.2ms로 낮췄습니다.",
          before: "9.7ms",
          after: "6.2ms",
        },
        {
          summary: "@tanstack/react-virtual로 10,000건 사진 목록의 DOM 노드를 200개 미만으로 제한",
          details:
            "기존 grid + map 구조는 5,000건 이상 로드 시 화면이 멈추고 DOM 노드가 급격히 늘어났습니다.\n\nrow 기반 virtualizer와 useGridBreakpoints를 적용해 보이는 row만 렌더링했고, 10,000건 기준 DOM 노드를 200개 미만으로 유지했습니다.",
          before: "Full render",
          after: "Virtual grid",
        },
        {
          summary: "D3 물리 시뮬레이션은 React state에서 분리해 style.setProperty로 직접 갱신",
          details:
            "D3 tick 좌표를 React state로 갱신하면 초당 반복되는 물리 계산이 reconciliation을 계속 발생시켰습니다.\n\n노드와 라인은 ref 기반 DOM 접근과 style.setProperty로 직접 갱신해 React 리렌더링 없이 60FPS 수준으로 방어했습니다.",
          before: "React state",
          after: "Direct DOM",
        },
      ],
      details: {
        context:
          "PhotoMap은 사진을 단순 저장하는 대신 EXIF 위치와 촬영 시간을 기반으로 여행 기록을 지도, 타임라인, 앨범, 관계 그래프로 탐색하는 서비스입니다. 핵심 과제는 10,000건 이상 사진을 다루면서도 스크롤과 시각화가 끊기지 않게 유지하는 것이었습니다.",
        role:
          "3인 팀에서 프론트엔드 화면 구현, 상태 관리 구조, 대량 렌더링 최적화, D3 관계 그래프 UX, Cobe 기반 3D Globe와 Unity WebGL 시각화 연동 화면을 담당했습니다.",
        architecture:
          "React 화면은 Photo Feed, Map View, Timeline, Albums, Favorites, Spatial Node View로 나누고, 서버 데이터와 UI 상태를 Zustand store에서 관리했습니다. 대량 사진 그리드는 @tanstack/react-virtual과 useGridBreakpoints로 row 단위 가상화했고, 각 row 위치는 transform 기반으로 배치했습니다. D3 물리 시뮬레이션은 useForceSimulation hook과 직접 DOM 갱신으로 React 렌더링 경로에서 분리했습니다.",
        keyFeatures: [
          "EXIF 기반 GPS/촬영 시간 추출과 수동 위치 보정",
          "Photo Feed, 2D Map, 3D Globe, Timeline, Albums, Favorites, Spatial Node View",
          "PhotoFeed와 AlbumsView의 row 기반 virtualized grid",
          "Zustand selector/useShallow 기반 상태 구독 분리",
          "D3 NodeView 물리 시뮬레이션 직접 DOM 업데이트",
          "PerformanceMonitor로 FPS, DOM nodes, JS heap, 사진 수 실시간 확인",
          "Admin View mock data 주입으로 1,000건 단위 부하 테스트",
        ],
        challenges: [
          "5,000건 이상 사진 로드 시 DOM 노드가 급증해 화면이 멈추고 스크롤 FPS가 크게 떨어졌습니다. Chrome DevTools Performance에서 스크롤 이벤트마다 많은 이미지 카드 리플로우가 발생하는 것을 확인했습니다.",
          "Context API 기반 전역 상태 공유로 인증/사진 상태의 작은 변경도 많은 컴포넌트를 다시 렌더링했습니다.",
          "D3 zoom, hover, tick 좌표를 React state로 관리하면 매 프레임 reconciliation 비용이 발생했습니다.",
          "FE, DB, Unity 담당이 나뉘어 있어 브리지 로직과 화면 구조에 대한 공통 이해가 필요했습니다.",
        ],
        solutions: [
          "PhotoFeed와 AlbumsView에 @tanstack/react-virtual을 적용해 화면에 보이는 row만 DOM에 유지했습니다.",
          "useGridBreakpoints hook으로 viewport별 column/gap을 계산하고 row 높이와 좌표를 산출해 transform: translateY()로 배치했습니다.",
          "Redux보다 초기 설정과 보일러플레이트가 작은 Zustand를 선택했고, selector와 useShallow로 필요한 상태만 구독하게 바꿨습니다.",
          "D3 이벤트와 tick 갱신은 ref, style.setProperty, setAttribute를 사용해 React state 갱신 없이 처리했습니다. line DOM에는 id와 animationKey를 붙여 뷰 전환 후 이전 요소와 충돌하지 않게 분리했습니다.",
          "Promise.all로 독립적인 초기 데이터 요청을 병렬화해 waterfall 대기 시간을 줄였습니다.",
          "Framer Motion 반복 애니메이션은 CSS animate-in으로 바꾸고, UploadPhotoItem/Input/Popover는 React.memo와 props 비교로 재렌더링 범위를 좁혔습니다.",
        ],
        validation: [
          "React Profiler: 커밋 시간 9.7ms -> 6.2ms",
          "10,000건 사진 로드 시 DOM nodes 200개 미만 유지",
          "5,000건 first mount 지연 1,132ms 수준 문제를 row 가상화로 완화",
          "D3 NodeView 렌더링 370회 -> 25회 수준으로 감소",
          "GlobeView max commit 69.9ms -> 26.6ms",
          "초기 데이터 로딩 Promise.all 전환 후 50% 이상 단축",
          "Chrome DevTools Performance/Network와 Admin View mock data로 개선 전후를 재측정",
          "스크롤 구간에서 60FPS 수준으로 방어되는지 PerformanceMonitor로 확인",
        ],
        result:
          "사진 수가 늘어나도 탐색 흐름이 끊기지 않도록 렌더링 범위를 줄이고, 지도/그래프 시각화는 React state와 분리했습니다. 결과적으로 PhotoMap을 단순 갤러리가 아니라 대량 사진을 다루는 인터랙티브 공간 아카이브로 정리할 수 있었습니다.",
        process:
          "React Profiler와 PerformanceMonitor로 병목을 확인한 뒤 Zustand selector, virtual grid, D3 direct DOM update, Promise.all 병렬 처리 순서로 개선했습니다.",
        operationalEvidence: [
          "PerformanceMonitor에서 FPS, DOM nodes, JS heap, 사진 수를 실시간으로 보며 부하 테스트를 진행했습니다.",
          "Chrome DevTools Performance 탭으로 스크롤 중 main thread 점유와 layout/recalculate style 비용을 확인했습니다.",
          "Chrome DevTools Network 탭으로 초기 데이터 요청 waterfall을 확인하고 Promise.all 전환 효과를 비교했습니다.",
          "Admin View에서 mock photo data를 주입해 1,000건 단위로 부하를 늘리고 가상화 효과를 확인했습니다.",
          "Framer Motion 기반 반복 애니메이션은 CSS animate-in으로 전환해 대량 카드 렌더링 비용을 줄였습니다.",
          "UploadPhotoItem, Input, Popover는 React.memo와 props 비교로 개별 사진 수정 시 전체 업로드 목록이 다시 그려지는 문제를 줄였습니다.",
        ],
        codeHighlight: {
          title: "Row 가상화 배치 예시",
          code: `const renderRow = ({ index, style }) => (
  <div
    style={{
      ...style,
      transform: \`translateY(\${virtualRows[index].start}px)\`,
    }}
  >
    {rowPhotos.map((photo) => (
      <Image key={photo.id} src={photo.url} loading="lazy" />
    ))}
  </div>
);`,
        },
      },
    },
    {
      title: "AIChatBot",
      summary:
        "학사 정보 접근성 개선을 위한 지능형 챗봇입니다. AI 응답을 읽기 쉬운 채팅 UX로 정리하고, 대화 저장·탭 동기화·내보내기를 클라이언트 중심으로 처리했습니다.",
      role: "프론트엔드 전반 담당, 채팅 UI/UX 설계 및 구현, Regex 응답 파싱, Blob API 내보내기, useLocalStorage 탭 동기화, Next.js API Routes Proxy Layer 설계",
      period: "2025.09.10 ~ 2025.11.14",
      tech: ["Next.js", "TypeScript", "React-Markdown", "Tailwind CSS", "Blob API", "useLocalStorage"],
      metrics: [
        { label: "URL noise", value: "90% down" },
        { label: "UI code", value: "30% down" },
        { label: "Export", value: "0 server" },
      ],
      links: {
        github: "https://github.com/sabin1108/graduation-project",
      },
      imageAlt: "AIChatBot 프로젝트 화면",
      imageGallery: {
        main: {
          src: "/3_project/aichat_1.png",
          alt: "AIChatBot 메인 화면",
        },
        supporting: [
          {
            src: "/3_project/aichat_2.png",
            alt: "AIChatBot 보조 화면 1",
          },
          {
            src: "/3_project/aichat_3.png",
            alt: "AIChatBot 보조 화면 2",
          },
          {
            src: "/3_project/aichat_4.gif",
            alt: "AIChatBot 보조 화면 3",
          },
        ],
      },
      achievements: [
        {
          summary: "Regex 응답 파싱으로 긴 URL과 비정형 학사 정보를 읽기 쉬운 메시지 구조로 정리",
          details:
            "외부 API 응답은 긴 URL, 줄바꿈 없는 학식/공지 데이터, 비정형 텍스트가 섞여 출력됐습니다.\n\n렌더링 직전 Regex 파싱 파이프라인으로 URL을 링크 형태로 치환하고 날짜/키워드 패턴에 맞춰 개행과 구분을 적용해 URL 텍스트 노출을 최대 90% 줄였습니다.",
          before: "Raw response",
          after: "Parsed message",
        },
        {
          summary: "Next.js API Routes Proxy Layer로 외부 API 응답을 단일 JSON 구조로 정규화",
          details:
            "외부 API가 JSON과 비정형 텍스트를 혼용해 반환하면서 UI 컴포넌트에 split, regex, 날짜 필드 보정 로직이 섞였습니다.\n\nProxy Layer에서 출처별 응답과 날짜 필드명을 단일 JSON 구조로 정규화해 UI 코드량을 약 30% 줄이고 API 스펙 변경 지점을 한 곳으로 모았습니다.",
          before: "UI coupling",
          after: "Proxy Layer",
        },
        {
          summary: "Blob API와 useLocalStorage로 서버 저장 없이 대화 내역 유지·탭 동기화·내보내기 구현",
          details:
            "로그인이 없는 구조라 서버에 사용자 대화 내역을 저장하지 않고 편의 기능을 제공해야 했습니다.\n\nlocalStorage로 새로고침 후 대화 내역을 복원하고 storage 이벤트로 탭 간 상태를 맞췄습니다. 내보내기는 Blob 객체, URL.createObjectURL, 동적 앵커 트리거로 서버 통신 없이 처리했습니다.",
          before: "Session-only",
          after: "Local export",
        },
      ],
      details: {
        context:
          "학식, 공지사항, 통학, 일정처럼 여러 메뉴에 흩어진 학사 정보를 모바일에서도 쉽게 묻고 확인할 수 있게 만든 지능형 챗봇입니다. AI 응답을 단순 텍스트로 보여주는 데서 그치지 않고, 비정형 응답을 읽기 쉬운 메시지로 정리하고 사용자가 대화 내역을 직접 관리할 수 있게 하는 데 집중했습니다.",
        role:
          "2인 팀에서 프론트엔드 전반을 맡았습니다. 채팅 인터페이스 설계와 구현, Regex 응답 파싱 로직, Blob API 대화 내보내기, useLocalStorage 기반 탭 간 상태 유지, Next.js API Routes Proxy Layer 구조를 설계하고 구현했습니다.",
        architecture:
          "Next.js 기반 UI와 API Routes Proxy Layer로 구성했습니다. 클라이언트는 메시지 렌더링, Blob API 내보내기, localStorage 복원과 storage 이벤트 기반 탭 동기화를 담당했습니다. 외부 API 데이터 정규화는 프록시 계층에서 처리해 UI 컴포넌트가 외부 데이터 형식에 직접 의존하지 않도록 분리했습니다.",
        keyFeatures: [
          "학사 정보(학식, 공지사항, 통학, 일정) 질의응답 채팅 UI",
          "Regex 기반 URL 치환과 응답 텍스트 구조화 파이프라인",
          "React-Markdown 기반 메시지 렌더링",
          "Blob API 기반 대화 내역 내보내기",
          "useLocalStorage와 storage 이벤트 기반 탭 간 상태 동기화",
          "Next.js API Routes Proxy Layer 기반 외부 데이터 JSON 정규화",
        ],
        challenges: [
          "외부 API의 AI 응답 형식이 일정하지 않아 긴 URL, 줄바꿈 없는 학식/공지 데이터, 비정형 텍스트가 메시지 가독성을 떨어뜨렸습니다.",
          "로그인 없는 구조에서 서버에 사용자 대화 내역을 저장하지 않고도 새로고침 복원, 탭 간 동기화, 파일 내보내기를 제공해야 했습니다.",
          "외부 API가 JSON과 비정형 텍스트를 혼용해 반환해 UI 코드 안에 split, regex, 날짜 필드 보정 로직이 섞일 위험이 있었습니다.",
        ],
        solutions: [
          "렌더링 직전 Regex 파이프라인을 적용해 긴 URL을 링크 형태로 치환하고 날짜/키워드 패턴에 맞춰 개행과 구분을 적용했습니다.",
          "Blob API, URL.createObjectURL, 동적 앵커 트리거로 대화 내역 파일을 클라이언트에서 생성해 서버 통신 없이 내보내기를 처리했습니다.",
          "useLocalStorage hook으로 localStorage 복원과 React 상태 업데이트를 묶고, storage 이벤트를 구독해 다른 탭의 변경을 반영했습니다.",
          "Next.js API Routes Proxy Layer에서 JSON/비정형 텍스트 응답과 출처별 날짜 필드명을 단일 JSON 구조로 정규화했습니다.",
        ],
        validation: [
          "URL 텍스트 노출 최대 90% 감소 확인",
          "UI 코드량 약 30% 절감",
          "Blob API 내보내기 서버 통신 없이 동작 확인",
          "storage 이벤트 기반 탭 동기화가 별도 서버 통신 없이 동작하는 것 확인",
          "대한전자공학회 2025 하계종합학술대회 포스터/논문 발표",
          "BRIGHT MAKERS EXPO 2025 캡스톤디자인 경진대회 우수상",
        ],
        result:
          "AI 응답을 사용자가 읽고 다시 활용하기 쉬운 채팅 인터페이스로 개선했습니다. 서버에 대화 내역을 저장하지 않는 구조에서 클라이언트 자원만으로 대화 유지, 탭 동기화, 파일 내보내기를 처리했고, 프록시 계층으로 외부 API 의존도를 UI에서 분리했습니다.",
        codeHighlight: {
          title: "Blob API 내보내기 예시",
          code: `const exportChat = (messages) => {
  const text = messages
    .map((message) => \`\${message.role}: \${message.content}\`)
    .join("\\n\\n");
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "chat-history.txt";
  link.click();
  URL.revokeObjectURL(url);
};`,
        },
      },
    },
  ] satisfies Project[],
  activities: [
    {
      date: "2025.04",
      title: "BRIGHT MAKERS EXPO 캡스톤디자인 경진대회 우수상",
      description:
        "한경국립대학교 AI ChatBot 프로젝트로 학사 정보 접근성 개선 서비스를 발표했습니다.",
    },
    {
      date: "2025.06",
      title: "대한전자공학회 하계종합학술대회 발표",
      description:
        "학교 공지, 학사 일정, 행정 정보를 챗봇으로 묻고 답할 수 있게 만든 질의응답 시스템 논문입니다. 포스터/논문 형태로 발표했습니다.",
      pdf: {
        label: "논문 PDF",
        href: "/files/thesis/interactive-campus-qa-system.pdf",
      },
    },
    {
      date: "2026.05",
      title: "생성형 AI 기반 포트폴리오 요약 플랫폼",
      description:
        "지원자의 프로젝트 자료를 생성형 AI로 요약해 평가자가 핵심 역량과 근거를 빠르게 확인하도록 돕는 플랫폼 논문입니다. 대한전자공학회에 투고했고 심사까지 완료된 XGLAB 랩실 연구 성과입니다.",
      pdf: {
        label: "논문 PDF",
        href: "/files/thesis/generative-ai-portfolio-summary-platform.pdf",
      },
    },
    {
      date: "2025.09.12",
      title: "정보처리기사",
      description: "한국산업인력공단 주관 국가기술자격을 취득했습니다.",
    },
  ],
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
  resume: {
    summary:
      "React/TypeScript 기반 프론트엔드 개발자입니다. 대량 데이터 렌더링 최적화, 외부 API 응답 정규화, Supabase 기반 서비스 구현, Vercel 배포 검증까지 제품 흐름 전체를 다룹니다. AI 도구는 코드 생성에만 쓰지 않고 PRD, 이슈 분할, 정적 분석, handoff, smoke test로 이어지는 작업 파이프라인에 통합했습니다.",
    coreSkills: [
      {
        title: "Frontend",
        items: ["React", "TypeScript", "JavaScript"],
      },
    ] satisfies ResumeSection[],
    projectHighlights: [
      {
        title: "Game-information-platform",
        period: "2026.05 ~ 2026.06",
        github: "https://github.com/sabin1108/Game-information-platform",
        teamRole: "개인 프로젝트 | 프론트엔드, Supabase 연동, 배포/검증 담당",
        techTags: ["Next.js", "TypeScript", "Supabase"],
        bullets: [
          "Steam/Epic 할인 조회, 관심 목록, 목표 가격 추적, Supabase Auth/DB, Vercel production 배포 연결",
          "Fallow 기준 소스 중복 668줄 -> 121줄, unused file/export 15개 -> 0개 정리",
          "AI Skill을 grill-me(요구사항 검증) -> to-prd(PRD 작성) -> to-issues(GitHub issue 분해) -> handoff(세션 인수인계) 순서로 구성, Harness로 product/frontend/QA 관점 분리",
          "Vitest, Playwright smoke test, typecheck, build 기반 주요 사용자 흐름 및 배포 전 동작 검증",
        ],
      },
      {
        title: "PhotoMap",
        period: "2025.12 ~ 2026.04",
        github: "https://github.com/sabin1108/Photomap",
        teamRole: "3인 협업 | 프론트엔드, 상태 구조, 렌더링 최적화, D3 시각화 담당",
        techTags: ["React", "Zustand", "D3.js"],
        bullets: [
          "10,000건 사진 목록 row 기반 가상화 적용, DOM 노드 200개 미만 유지",
          "Context API 전역 리렌더링을 Zustand selector/useShallow 구조로 전환, commit 시간 9.7ms -> 6.2ms 개선",
          "D3 tick 좌표 갱신을 React state에서 분리, ref/style.setProperty 기반 렌더링 병목 개선",
        ],
      },
      {
        title: "AIChatBot",
        period: "2025.09.10 ~ 2025.11.14",
        github: "https://github.com/sabin1108/graduation-project",
        teamRole: "2인 협업 | 프론트엔드, 채팅 UI, 응답 파싱, API 응답 정규화 담당",
        techTags: ["Next.js", "React-Markdown", "Blob API"],
        bullets: [
          "학사 정보 챗봇 프론트엔드 전반, 채팅 UI, Regex 응답 파싱, React-Markdown 렌더링 담당",
          "Next.js API Routes Proxy Layer에서 외부 API 응답을 단일 JSON 구조로 정규화, UI 코드량 약 30% 절감",
          "Blob API와 useLocalStorage 기반 서버 저장 없는 대화 복원, 탭 동기화, 파일 내보내기 구현",
        ],
      },
    ],
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
    ],
  },
} as const;
