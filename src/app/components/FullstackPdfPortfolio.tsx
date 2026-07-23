import "./FullstackPdfPortfolio.css";

type CaseStudy = {
  title: string;
  issue: string;
  assumption: string;
  action: string[];
  result: string[];
  evidence: string[];
};

type Project = {
  title: string;
  period: string;
  role: string;
  summary: string;
  stack: {
    frontend: string;
    backend: string;
    quality: string;
  };
  images: string[];
  architectureImage: string;
  metrics: { metric: string; before: string; after: string; note?: string }[];
  architecture: string[];
  cases: CaseStudy[];
};

const projects: Project[] = [
  {
    title: "Game Information Platform",
    period: "2026.05 - 2026.06",
    role: "개인 프로젝트 / 프론트엔드 중심 전체 구현",
    summary:
      "Steam, Epic, ITAD 데이터를 연결해 게임 할인 정보, 관심 상품, 목표 가격 추적을 제공한 서비스입니다. 풀스택 포트폴리오 기준에서는 화면 구현보다 외부 API 응답 차이, 가격 오판, 장애 대응, 테스트 검증을 어떻게 설계했는지에 초점을 둡니다.",
    stack: {
      frontend: "<strong>Next.js, React, TypeScript</strong> - 검색, 할인 목록, 상세, 관심 상품 UI",
      backend: "<strong>Next.js API Routes, Supabase</strong> - 인증, 관심 상품, 가격 기록, 외부 API 중계",
      quality: "<strong>Vitest, Playwright, Fallow</strong> - 가격 계산, cache/rate limit, 주요 사용자 흐름 검증",
    },
    images: ["/1_project/gameinfo_1.png", "/1_project/gameinfo_2.png", "/1_project/gameinfo_3.png"],
    architectureImage: "/pdf-architecture/gameinfo-architecture.png",
    metrics: [
      { metric: "중복 코드", before: "1,006줄 (9.4%)", after: "308줄 (2.9%)", note: "Fallow duplication report 기준" },
      { metric: "미사용 파일", before: "1개", after: "0개", note: "Fallow unused file 분석 기준" },
      { metric: "미사용 export", before: "11개", after: "0개", note: "Fallow unused export 분석 기준" },
      { metric: "유지보수성 점수", before: "91.3", after: "92.1", note: "Fallow maintainability 기준" },
      { metric: "주요 검증", before: "수동 확인 중심", after: "Vitest 21 files / 60 tests passed", note: "가격 계산, cache/rate limit, API route 검증" },
    ],
    architecture: [
      "사용자 화면",
      "Next.js API Route",
      "Adapter / Normalizer",
      "Price Guard",
      "Stale Cache / Rate Limit",
      "Supabase / External APIs",
    ],
    cases: [
      {
        title: "외부 API 응답 차이로 인한 UI 결합 제거",
        issue:
          "Steam, Epic, ITAD의 응답 구조와 필드명이 달라 검색 카드, 상세 화면, 관심 상품 목록이 API별 예외를 직접 처리해야 했습니다. 이 구조에서는 외부 API 응답 하나가 바뀌면 여러 UI 파일을 동시에 수정해야 하고, 테스트도 화면 조합마다 반복해야 했습니다.",
        assumption:
          "문제의 원인은 화면 컴포넌트가 외부 API 포맷을 직접 알고 있는 구조라고 봤습니다. UI가 공통 View Model만 소비하게 만들면 외부 API 차이는 중간 계층에서 흡수되고, 화면 변경 범위는 줄어든다고 판단했습니다.",
        action: [
          "API 호출 결과와 UI 사이에 Adapter/Normalizer 계층을 두었습니다.",
          "GameSummary, StoreProduct처럼 화면이 사용하는 공통 모델을 만들었습니다.",
          "store priority, dedupe, steam app id 추출, 상점 링크 정리를 normalizer와 domain layer로 모았습니다.",
          "검색 결과, 할인 목록, 상세, 관심 상품 UI가 같은 데이터 계약을 사용하도록 정리했습니다.",
        ],
        result: [
          "UI가 Steam/Epic/ITAD의 응답 차이를 직접 알 필요가 줄었습니다.",
          "외부 API 변경 대응 위치가 normalizer 계층으로 좁아졌습니다.",
          "화면 컴포넌트는 표시와 사용자 상호작용에 집중하도록 책임을 나눴습니다.",
        ],
        evidence: ["src/lib/itad-normalizers.ts", "tests/search-api.test.ts", "tests/deals-api.test.ts"],
      },
      {
        title: "0원/null 가격이 최저가로 오판되는 문제 방어",
        issue:
          "출시 예정, 가격 미정, 데이터 미제공 게임에서 0 또는 null 가격이 들어오면 실제 무료 배포가 아닌데도 최저가 또는 목표가 달성 상태처럼 보일 수 있었습니다. 가격 비교 서비스에서 이 문제는 사용자의 구매 판단을 직접 왜곡합니다.",
        assumption:
          "가격 값이 숫자라는 사실만으로 구매 가능한 가격이라고 볼 수 없다고 판단했습니다. 실제 구매 후보로 쓸 수 있는 양수 가격만 best price 후보에 넣어야 목표가 판단과 할인 표시가 안정적이라고 봤습니다.",
        action: [
          "game-score.ts에서 currentPriceCents > 0인 가격만 best price 후보로 사용했습니다.",
          "후보가 없으면 목표 가격 매칭을 false로 처리했습니다.",
          "0원, null, 가격 미정 케이스를 테스트 데이터로 만들어 회귀를 막았습니다.",
        ],
        result: [
          "가격 미정 데이터가 최저가나 목표가 달성으로 표시되는 경로를 차단했습니다.",
          "사용자가 실제 구매 가능한 가격 후보가 있을 때만 할인/목표가 정보를 보게 만들었습니다.",
        ],
        evidence: ["src/lib/game-score.ts", "tests/game-score.test.ts"],
      },
      {
        title: "외부 API 장애와 반복 호출 대응",
        issue:
          "검색, 할인, 인기 목록 같은 공개 route가 외부 가격 API 응답성에 직접 묶여 있으면 timeout, 호출 제한, 반복 새로고침이 곧바로 500 오류나 빈 화면으로 이어질 위험이 있었습니다.",
        assumption:
          "가격 정보 화면은 항상 최신 데이터만 보여주는 것보다, 외부 API가 느리거나 실패할 때도 최근 정상 데이터를 안전하게 보여주는 편이 사용자 경험에 낫다고 판단했습니다.",
        action: [
          "fresh TTL 이후에도 일정 시간 stale 데이터를 반환하는 cache 모듈을 두었습니다.",
          "fixed-window rate limit을 route 경계에 추가했습니다.",
          "cache hit/miss/stale, rate limit 케이스를 route 테스트로 검증했습니다.",
        ],
        result: [
          "외부 API 실패가 곧바로 화면 전체 장애로 번지는 위험을 줄였습니다.",
          "반복 호출과 호출 제한 상황을 코드와 테스트에서 다룰 수 있게 됐습니다.",
        ],
        evidence: ["src/lib/stale-cache.ts", "src/lib/rate-limit.ts", "tests/*api*.test.ts"],
      },
      {
        title: "정적 분석 기반 유지보수성 개선",
        issue:
          "기능을 빠르게 붙이는 과정에서 unused file/export, 중복 테스트, 반복 코드가 생겼고 일부 API route와 테스트 파일이 hotspot으로 커졌습니다. 당장 동작은 해도 이후 수정 비용이 커질 수 있는 상태였습니다.",
        assumption:
          "주관적으로 리팩터링하기보다 정적 분석 결과를 기준으로 중복과 미사용 코드를 줄이면, 변경 위험을 낮추면서 유지보수성을 개선할 수 있다고 봤습니다.",
        action: [
          "Fallow 정적 분석 결과로 unused files/exports, duplication, maintainability를 추적했습니다.",
          "미사용 파일 1개와 미사용 export 11개를 0개로 정리했습니다.",
          "중복 코드를 1,006줄(9.4%)에서 308줄(2.9%)로 줄였습니다.",
        ],
        result: [
          "maintainability가 91.3에서 92.1로 개선됐습니다.",
          "리팩터링 우선순위를 감이 아니라 수치로 정하는 기준을 만들었습니다.",
        ],
        evidence: ["Fallow report", "README.md test section"],
      },
    ],
  },
  {
    title: "AI ChatBot",
    period: "2025.09 - 2025.11",
    role: "2인 팀 / 채팅 UI 및 API 연동 담당",
    summary:
      "학교 공지, 식단, 학사 일정을 대화형 UI에서 확인하는 졸업 프로젝트입니다. 풀스택 포트폴리오 기준에서는 AI 답변 화면 자체보다, 프론트엔드와 백엔드의 응답 경계를 어떻게 나누고 사용자 기록을 어떻게 브라우저 안에서 처리했는지에 초점을 둡니다.",
    stack: {
      frontend: "<strong>Next.js, React, TypeScript, Tailwind CSS</strong> - 채팅 UI, 사이드바, 일정/공지 표시",
      backend: "<strong>Next.js API Routes</strong> - chat/notice 요청 중계와 응답 경계 분리",
      quality: "<strong>ReactMarkdown, localStorage, Blob API</strong> - 응답 가독성, 기록 복원, 대화 내보내기",
    },
    images: ["/3_project/aichat_1.png", "/3_project/aichat_2.png", "/3_project/aichat_3.png"],
    architectureImage: "/pdf-architecture/aichat-architecture.png",
    metrics: [
      { metric: "응답 표시", before: "긴 URL / 비정형 텍스트 직접 노출", after: "Markdown 메시지 렌더링", note: "ReactMarkdown 기반 링크와 목록 표시" },
      { metric: "대화 기록", before: "새로고침 시 유실 위험", after: "localStorage 기반 복원", note: "같은 브라우저/origin 기준 탭 상태 반영" },
      { metric: "내보내기", before: "서버 전송 가능성", after: "Blob 기반 브라우저 파일 생성", note: "서버 재전송 없이 txt 다운로드" },
      { metric: "협업 결과", before: "분산된 학교 정보 접근", after: "채팅 흐름으로 통합", note: "BRIGHT MAKERS EXPO 우수상" },
    ],
    architecture: ["Chat UI", "Message Renderer", "Next.js API Route", "External Backend", "localStorage", "Blob Export"],
    cases: [
      {
        title: "백엔드 응답 형식 차이를 UI에서 분리",
        issue:
          "공지, 식단, 일정 데이터를 백엔드가 각각 다른 방식으로 수집하면서 응답 형태가 일정하지 않았습니다. 프론트엔드가 이를 그대로 받으면 채팅 UI 안에 데이터별 예외 처리가 계속 늘어나는 구조였습니다.",
        assumption:
          "UI 컴포넌트가 endpoint, 날짜 필드명, 응답 전처리 방식을 직접 알면 FE와 BE 변경이 강하게 묶인다고 봤습니다. Next.js API Route를 경계로 두면 UI는 메시지 표시와 사용자 상호작용에 집중할 수 있다고 판단했습니다.",
        action: [
          "Next.js API Routes를 proxy layer로 두고 chat route와 notice route에서 외부 API 호출을 담당하게 했습니다.",
          "UI 컴포넌트는 내부 route/action만 호출하도록 정리했습니다.",
          "긴 URL, 날짜, 목록, 공지 링크 정리는 메시지 표시 규칙으로 분리했습니다.",
        ],
        result: [
          "백엔드 응답 차이가 채팅 입력, 메시지 목록, 공지 표시 컴포넌트로 직접 번지는 범위를 줄였습니다.",
          "FE는 사용자 흐름과 메시지 가독성에 집중하고, BE는 데이터 수집과 응답 제공에 집중하는 경계를 만들었습니다.",
        ],
        evidence: ["app/api/chat/route.ts", "app/api/notice/route.ts", "app/actions/get-notice.ts"],
      },
      {
        title: "긴 URL과 비정형 응답으로 인한 모바일 UI 깨짐 완화",
        issue:
          "학교 공지와 AI 응답에는 긴 URL, 줄바꿈 없는 텍스트, 목록 형태 데이터가 섞여 들어왔습니다. 이를 단순 문자열로 출력하면 모바일 viewport에서 가로 스크롤이 생기고 말풍선이 깨졌습니다.",
        assumption:
          "문제는 응답 내용 자체보다 렌더링 규칙이 부족한 데 있다고 판단했습니다. URL과 목록을 Markdown 구조로 다루고 링크 요소에 줄바꿈 가능한 스타일을 주면 모바일 가독성이 좋아질 것이라고 봤습니다.",
        action: [
          "ReactMarkdown과 remark-gfm 기반으로 메시지를 렌더링했습니다.",
          "URL은 markdown link 형태로 변환하고 링크 요소에 줄바꿈 가능한 스타일을 적용했습니다.",
          "공지 링크와 긴 문장을 말풍선 안에서 읽기 쉬운 단락 구조로 표시했습니다.",
        ],
        result: [
          "모바일에서 긴 URL 때문에 말풍선이 깨지는 문제를 줄였습니다.",
          "사용자가 공지 링크와 핵심 정보를 채팅 흐름 안에서 더 쉽게 읽을 수 있게 됐습니다.",
        ],
        evidence: ["components/enhanced-chat-interface.tsx", "ReactMarkdown", "remark-gfm"],
      },
      {
        title: "로그인 없는 구조에서 대화 기록 복원",
        issue:
          "로그인 없이 사용하는 구조에서는 새로고침하면 대화가 사라질 수 있고, 여러 탭을 열었을 때 채팅 목록과 활성 채팅 상태가 달라질 수 있었습니다.",
        assumption:
          "서버 저장을 추가하지 않고도 브라우저 localStorage와 storage event를 사용하면 같은 브라우저/origin 안에서 대화 기록 복원과 탭 간 상태 반영을 처리할 수 있다고 판단했습니다.",
        action: [
          "useLocalStorage hook으로 localStorage 읽기/쓰기를 감쌌습니다.",
          "storage event를 구독해 다른 탭 변경을 현재 탭 상태에 반영했습니다.",
          "새로고침 후 채팅 목록과 활성 채팅이 복원되도록 구성했습니다.",
        ],
        result: [
          "로그인 없는 구조에서도 사용자가 새로고침 후 대화 기록을 이어볼 수 있게 됐습니다.",
          "같은 브라우저/origin 탭 사이의 대화 목록 불일치 위험을 줄였습니다.",
        ],
        evidence: ["hooks/use-chat-history.ts", "hooks/use-local-storage.ts", "storage event"],
      },
      {
        title: "대화 내역 브라우저 내보내기",
        issue:
          "사용자가 필요한 대화 내용을 파일로 보관하려면 이미 브라우저에 있는 데이터를 다시 서버로 보내 파일을 만드는 방식도 가능했지만, 기능 크기에 비해 데이터 흐름과 개인정보 노출 경로가 커질 수 있었습니다.",
        assumption:
          "대화 내용이 이미 브라우저 메모리와 localStorage에 있으므로, 단순 txt 내보내기는 클라이언트 안에서 끝내는 편이 더 단순하고 안전하다고 판단했습니다.",
        action: [
          "Blob API로 txt 파일 데이터를 만들었습니다.",
          "URL.createObjectURL로 다운로드 URL을 만들고 다운로드 후 revokeObjectURL로 해제했습니다.",
        ],
        result: [
          "서버 재전송 없이 사용자가 필요한 대화 내역을 직접 내보낼 수 있게 됐습니다.",
          "프론트엔드 범위 안에서 기능을 완성해 구현 복잡도와 데이터 이동 범위를 줄였습니다.",
        ],
        evidence: ["Blob API", "URL.createObjectURL", "URL.revokeObjectURL"],
      },
    ],
  },
  {
    title: "PhotoMap",
    period: "2025.12 - 2026.04",
    role: "3인 팀 / 프론트엔드 최적화 및 상태 아키텍처 담당",
    summary:
      "여행 사진을 위치 기반 지도, 앨범, 타임라인, 관계 그래프로 탐색하는 서비스입니다. 풀스택 포트폴리오 기준에서는 백엔드 데이터 흐름을 프론트엔드 상태와 화면에 안정적으로 연결하고, 대량 이미지와 WebGL/canvas가 섞인 화면의 성능 병목을 수치로 줄인 경험을 강조합니다.",
    stack: {
      frontend: "<strong>React, TypeScript, Zustand</strong> - 지도/앨범/타임라인 상태와 사용자 흐름 구성",
      backend: "<strong>Supabase, Mapbox, Unity WebGL iframe</strong> - 사진/위치 데이터 연결과 지도 시각화",
      quality: "<strong>Lighthouse, React Profiler, @tanstack/react-virtual</strong> - 이미지 전송량, 렌더링 범위, DOM 노드 수 개선",
    },
    images: ["/2_project/photoproject_1.png", "/2_project/photoproject_2.png", "/2_project/photoproject_3.png"],
    architectureImage: "/pdf-architecture/photomap-architecture.png",
    metrics: [
      { metric: "Lighthouse Performance", before: "50점", after: "77점", note: "Supabase image transform 적용 전후" },
      { metric: "LCP", before: "63,804ms", after: "4,150ms", note: "Lighthouse 측정 기준" },
      { metric: "초기 payload", before: "12,586KiB", after: "381KiB", note: "이미지 전송량 최적화 기준" },
      { metric: "상태 변경 리렌더링 범위", before: "70여 개 컴포넌트", after: "5개 이하", note: "React Profiler 기준" },
      { metric: "React Profiler 커밋 시간", before: "9.7ms", after: "6.2ms", note: "상태 구조 개선 전후" },
      { metric: "D3 NodeView 렌더링", before: "370회", after: "25회", note: "tick 업데이트를 React state 밖으로 분리" },
      { metric: "대량 사진 DOM 노드", before: "대량 이미지 구간 증가", after: "약 200개 수준 유지", note: "@tanstack/react-virtual 기반" },
    ],
    architecture: ["Photo UI", "Zustand Selectors", "Virtualized Feed", "D3 Hook", "Map/WebGL iframe", "Supabase"],
    cases: [
      {
        title: "대량 이미지 초기 로딩 병목 개선",
        issue:
          "공개 홈과 사진 탐색 화면에서 원본에 가까운 고해상도 이미지를 그대로 요청하면서 Lighthouse LCP와 초기 payload가 이미지 전송량에 크게 묶였습니다.",
        assumption:
          "초기 진입 화면에서는 원본 이미지보다 preview 크기 이미지가 먼저 필요하다고 봤습니다. 이미지 transform, eager/lazy 우선순위, async decoding을 조정하면 첫 화면 렌더링 지표가 개선될 것이라고 판단했습니다.",
        action: [
          "Supabase Storage image transform fallback으로 preview 이미지를 우선 사용했습니다.",
          "상단 카드만 eager/high priority로 두고 나머지는 lazy/async로 조정했습니다.",
          "Lighthouse로 Performance, LCP, 초기 payload를 전후 비교했습니다.",
        ],
        result: [
          "Lighthouse Performance score를 50점에서 77점으로 높였습니다.",
          "LCP를 63,804ms에서 4,150ms로 낮췄습니다.",
          "초기 payload를 12,586KiB에서 381KiB로 줄였습니다.",
        ],
        evidence: ["Lighthouse report", "Supabase image transform", "performance optimization notes"],
      },
      {
        title: "전역 상태 리렌더링 범위 축소",
        issue:
          "Context API 기반 전역 상태 구조에서는 특정 사진 좋아요, 필터, 선택 상태처럼 작은 변경에도 지도, 앨범, 타임라인, 업로드 화면까지 넓게 리렌더링될 위험이 있었습니다.",
        assumption:
          "문제의 핵심은 상태 변경 자체보다 구독 범위가 넓은 구조라고 봤습니다. 화면별로 필요한 slice만 구독하게 바꾸면 리렌더링 범위가 줄어들 것이라고 판단했습니다.",
        action: [
          "상태 관리를 Zustand store로 분리했습니다.",
          "useShallow selector로 화면별 필요한 상태 slice만 구독하게 했습니다.",
          "React Profiler로 상태 변경 범위와 커밋 시간을 전후 비교했습니다.",
        ],
        result: [
          "상태 변경 리렌더링 범위를 70여 개 컴포넌트에서 5개 이하로 줄였습니다.",
          "React Profiler 기준 커밋 시간을 9.7ms에서 6.2ms로 낮췄습니다.",
        ],
        evidence: ["usePhotoStore.ts", "PhotoFeed.tsx", "React Profiler"],
      },
      {
        title: "사진 스크롤과 DOM 노드 수 제어",
        issue:
          "5,000건 이상의 고해상도 사진 데이터를 탐색할 때 DOM 노드와 이미지 요소가 늘어나면서 스크롤 프레임 저하와 일시 프리징이 발생했습니다.",
        assumption:
          "사용자가 보는 구간만 DOM에 유지하면 브라우저가 처리해야 하는 노드 수를 고정할 수 있다고 판단했습니다. 이미지 카드 메모이제이션과 row 가상화를 함께 적용해야 효과가 난다고 봤습니다.",
        action: [
          "@tanstack/react-virtual 기반 row 가상화를 적용했습니다.",
          "이미지 카드 메모이제이션과 불필요한 motion 계산 제거를 함께 진행했습니다.",
          "대량 사진 구간에서 DOM 노드 수와 스크롤 체감을 확인했습니다.",
        ],
        result: [
          "대량 사진 구간에서도 DOM 노드를 약 200개 수준으로 유지했습니다.",
          "사진 스크롤 중 프레임 저하와 일시 프리징을 완화했습니다.",
        ],
        evidence: ["@tanstack/react-virtual", "PerformanceMonitor", "PhotoMap portfolio notes"],
      },
      {
        title: "D3와 WebGL 렌더링 책임 분리",
        issue:
          "D3 force simulation tick 좌표와 Unity WebGL 지도, cobe canvas globe가 React 상태와 섞이면 마우스 이동, zoom, 화면 전환 중 React reconciliation과 SVG diff가 반복될 수 있었습니다.",
        assumption:
          "D3 tick 좌표처럼 매 프레임 바뀌는 값은 React state가 아니라 ref와 DOM 속성 갱신으로 처리해야 한다고 봤습니다. WebGL 지도도 iframe과 postMessage로 분리하면 React 상태 변경과 런타임 수명 주기를 나눌 수 있다고 판단했습니다.",
        action: [
          "D3 force simulation을 custom hook으로 분리했습니다.",
          "tick에서는 ref와 DOM 속성을 직접 갱신하고 React는 구조 변경에 집중하게 했습니다.",
          "Unity WebGL 지도는 iframe으로 분리하고 postMessage/SendMessage로 필요한 위치 데이터만 전달했습니다.",
        ],
        result: [
          "D3 NodeView 렌더링 횟수를 370회에서 25회로 줄였습니다.",
          "지도/그래프 조작 중 React 렌더링 루프가 과도하게 반복되는 위험을 줄였습니다.",
        ],
        evidence: ["useForceSimulation.ts", "frontend_technical_architecture.md", "performance_optimization_final_report.md"],
      },
    ],
  },
];




type ProjectCopyOverride = {
  summary?: string;
  cases?: Record<number, CaseStudy>;
};

const projectCopyOverrides: Record<string, ProjectCopyOverride> = {
  "Game Information Platform": {
    summary:
      "Steam, Epic, ITAD 데이터를 연결해 게임 할인 정보와 관심 상품, 목표 가격 추적을 제공한 서비스입니다. 단순 화면 구현보다 외부 API마다 다른 가격 기준과 응답 형식 때문에 사용자가 잘못된 최저가를 볼 수 있는 문제를 프론트엔드 경계에서 방어한 점에 초점을 뒀습니다.",
    cases: {
      1: {
        title: "0원/null 가격이 최저가로 보이는 문제 방어",
        issue:
          "출시 예정이거나 가격 미정인 게임에서 0원 또는 null 값이 들어오면, 실제 무료 배포가 아닌데도 최저가처럼 보일 수 있었습니다. 가격 비교 서비스에서는 사용자의 구매 판단을 바로 왜곡하는 문제였습니다.",
        assumption:
          "숫자 값이 있다는 이유만으로 구매 가능한 가격이라고 보면 안 된다고 봤습니다. 실제 구매 후보가 될 수 있는 양수 가격만 비교 대상에 넣어야 했습니다.",
        action: [
          "currentPriceCents가 0보다 큰 경우만 best price 후보로 사용했습니다.",
          "가격 후보가 없으면 목표가 달성 여부를 false로 처리했습니다.",
          "0원, null, 가격 미정 케이스를 테스트 데이터로 만들어 회귀를 막았습니다.",
        ],
        result: [
          "가격 미정 데이터가 최저가 또는 목표가 달성으로 표시되는 경로를 차단했습니다.",
          "사용자는 실제 구매 가능한 가격이 있을 때만 할인 정보를 보게 됐습니다.",
        ],
        evidence: [],
      },
    },
  },
  PhotoMap: {
    summary:
      "여행 사진을 지도, 앨범, 타임라인, 관계 그래프로 탐색하는 서비스입니다. 사진 수가 늘어날수록 첫 화면 로딩과 리렌더링이 느려지는 문제를 이미지 전송량, 상태 구독 범위, DOM 노드 수로 나눠 개선했습니다.",
    cases: {
      0: {
        title: "대량 이미지로 느려진 첫 화면 개선",
        issue:
          "공개 앨범과 사진 탐색 화면에서 원본에 가까운 이미지를 그대로 요청해 LCP와 초기 payload가 크게 증가했습니다. 사용자는 첫 화면을 보기 전에 긴 로딩을 기다려야 했습니다.",
        assumption:
          "초기 화면에는 원본 이미지가 아니라 미리보기 크기 이미지가 먼저 필요하다고 봤습니다. 이미지 크기와 로딩 우선순위를 나누면 체감 로딩이 줄어들 것으로 판단했습니다.",
        action: [
          "Supabase Storage image transform으로 preview 이미지를 우선 사용했습니다.",
          "상단 카드만 eager/high priority로 두고 나머지는 lazy/async로 조정했습니다.",
          "Lighthouse로 성능 점수, LCP, 초기 payload를 전후 비교했습니다.",
        ],
        result: [
          "Lighthouse Performance를 50점에서 77점으로 올렸습니다.",
          "LCP를 63,804ms에서 4,150ms로 줄였습니다.",
          "초기 payload를 12,586KiB에서 381KiB로 낮췄습니다.",
        ],
        evidence: [],
      },
    },
  },
  "AI ChatBot": {
    summary:
      "학교 공지, 식단, 학사 일정을 채팅으로 확인하는 서비스입니다. AI 답변 품질 자체보다, 모호한 질문이 들어왔을 때 사용자가 막히지 않도록 fallback 흐름과 메시지 표시 경계를 설계한 경험에 초점을 뒀습니다.",
    cases: {
      0: {
        title: "모호한 질문을 선택지 흐름으로 전환",
        issue:
          "사용자가 '장학 알려줘', '일정 뭐 있어?'처럼 범위가 넓은 질문을 입력하면 AI가 의도를 좁히지 못해 부정확한 답변을 줄 수 있었습니다. 이 경우 사용자는 다시 질문을 고쳐 입력해야 했습니다.",
        assumption:
          "모호한 질문을 억지로 하나의 답변으로 만드는 것보다, 사용자가 의도를 좁힐 수 있는 선택지를 보여주는 편이 안정적이라고 봤습니다.",
        action: [
          "AI가 모호성을 감지하면 버튼형 선택지 UI를 보여주도록 설계했습니다.",
          "선택 결과를 백엔드의 7개 카테고리 API와 연결했습니다.",
          "프론트엔드에서는 선택 상태와 메시지 흐름이 끊기지 않도록 처리했습니다.",
        ],
        result: [
          "모호한 질문이 빈 답변이나 잘못된 답변으로 끝나는 상황을 줄였습니다.",
          "사용자는 질문을 다시 작성하지 않고 선택지만 눌러 원하는 정보에 접근할 수 있게 됐습니다.",
        ],
        evidence: [],
      },
    },
  },
};

function getPdfProject(project: Project): Project {
  const override = projectCopyOverrides[project.title];

  if (!override) {
    return project;
  }

  return {
    ...project,
    summary: override.summary ?? project.summary,
    cases: project.cases.map((caseStudy, index) => override.cases?.[index] ?? caseStudy),
  };
}

function MetricTable({ metrics }: { metrics: Project["metrics"] }) {
  return (
    <table className="pdf-metric-table">
      <thead>
        <tr>
          <th>지표</th>
          <th>Before</th>
          <th>After</th>
          <th>구분</th>
        </tr>
      </thead>
      <tbody>
        {metrics.map((row) => (
          <tr key={row.metric}>
            <th>{row.metric}</th>
            <td>{row.before}</td>
            <td>{row.after}</td>
            <td>{row.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ArchitectureFlow({ items }: { items: string[] }) {
  return (
    <div className="pdf-flow" aria-label="architecture flow">
      {items.map((item, index) => (
        <div className="pdf-flow-step" key={item}>
          <span className="pdf-flow-number">{index + 1}</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}


function CaseBlock({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <article className="pdf-case">
      <h3>{caseStudy.title}</h3>
      <div className="pdf-case-grid">
        <section>
          <h4>이슈</h4>
          <p>{caseStudy.issue}</p>
        </section>
        <section>
          <h4>판단</h4>
          <p>{caseStudy.assumption}</p>
        </section>
        <section>
          <h4>해결</h4>
          <ul>
            {caseStudy.action.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h4>결과</h4>
          <ul>
            {caseStudy.result.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}

function ProjectIntro({ project }: { project: Project }) {
  return (
    <section className="pdf-page pdf-project-intro">
      <div className="pdf-project-header">
        <div>
          <p className="pdf-kicker">{project.period}</p>
          <h2>{project.title}</h2>
          <p>{project.role}</p>
        </div>
      </div>

      <p className="pdf-summary">{project.summary}</p>

      <div className="pdf-architecture-metrics">
        <img
          className="pdf-architecture-image"
          src={project.architectureImage}
          alt={`${project.title} 아키텍처 흐름도`}
        />

      <div className="pdf-stack pdf-stack-under-architecture">
        <section>
          <h3>Frontend</h3>
          <p dangerouslySetInnerHTML={{ __html: project.stack.frontend }} />
        </section>
        <section>
          <h3>Backend / Data</h3>
          <p dangerouslySetInnerHTML={{ __html: project.stack.backend }} />
        </section>
        <section>
          <h3>Quality</h3>
          <p dangerouslySetInnerHTML={{ __html: project.stack.quality }} />
        </section>
      </div>
        <MetricTable metrics={project.metrics} />
      </div>
    </section>
  );
}

function ProjectScreenshots({ project }: { project: Project }) {
  return (
    <section className="pdf-page pdf-screenshots-page">
      <p className="pdf-kicker">{project.title}</p>
      <h2>Project Screenshots</h2>
      <div className="pdf-shot-grid pdf-shot-grid-large pdf-shot-grid-page">
        {project.images.map((src) => (
          <img src={src} alt={`${project.title} screenshot`} key={src} />
        ))}
      </div>
    </section>
  );
}
function ProjectCases({ project }: { project: Project }) {
  const chunks = [project.cases.slice(0, 2), project.cases.slice(2, 4)].filter(
    (chunk) => chunk.length > 0,
  );

  return (
    <>
      {chunks.map((chunk, index) => (
        <section className="pdf-page pdf-cases-page" key={`${project.title}-${index}`}>
          <p className="pdf-kicker">{project.title}</p>
          <h2>{index === 0 ? "이슈 기반 문제 해결" : "검증과 개선"}</h2>
          <div className="pdf-cases">
            {chunk.map((caseStudy) => (
              <CaseBlock caseStudy={caseStudy} key={caseStudy.title} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

export function FullstackPdfPortfolio() {
  const pdfProjects = [projects[0], projects[2], projects[1]].map(getPdfProject);

  return (
    <main className="pdf-portfolio">
      <section className="pdf-page pdf-cover">
        <div>
          <p className="pdf-kicker">Front-End 중심 FullStack Portfolio</p>
          <h1>민사빈</h1>
          <p className="pdf-lead">
            기능을 많이 붙이는 것보다 사용자가 막히는 지점과 코드 구조상 변경 비용이 커지는 지점을
            먼저 찾고, 이슈와 가설, 해결, 검증 결과를 기준으로 개선하는 개발자입니다.
          </p>
          <div className="pdf-contact">
            <span>minsabin1108@gmail.com</span>
            <span>github.com/sabin1108</span>
          </div>
        </div>

        <section className="pdf-skills-panel">
          <h2>기술 스택</h2>
          <div className="pdf-skills-grid">
            <p><strong>Frontend:</strong> React.js, Next.js, TypeScript, JavaScript</p>
            <p><strong>Backend & API:</strong> Node.js, Next.js API Routes, REST API, external API integration</p>
            <p><strong>State & Data:</strong> Zustand, Supabase, PostgreSQL, Redis, data normalization</p>
            <p><strong>Styling:</strong> Tailwind CSS, Shadcn UI, CSS</p>
            <p><strong>협업:</strong> Notion, Slack, GitHub, Git</p>
            <p><strong>개발/검증:</strong> VS Code, Vite, npm, Vitest, Playwright, Lighthouse, Fallow</p>
            <p><strong>배포/인프라:</strong> Vercel, NCP</p>
            <p><strong>AI 개발:</strong> Codex, Claude Code, OpenAI API, Gemini</p>
          </div>
        </section>
      </section>

      {pdfProjects.map((project) => (
        <div key={project.title}>
          <ProjectIntro project={project} />
          <ProjectScreenshots project={project} />
          <ProjectCases project={project} />
        </div>
      ))}

      <section className="pdf-page pdf-closing">
        <p className="pdf-kicker">Experience / Activity / Education</p>
        <h2>경험 / 활동 / 교육</h2>
        <div className="pdf-profile-grid pdf-profile-grid-two">
          <article>
            <h3>대한전자공학회 하계학술대회</h3>
            <p className="pdf-profile-meta">2025.03 - 2025.06 / 학교 정보 질의응답 하이브리드 챗봇 시스템</p>
            <ul>
              <li>백엔드 개발자 1인과 협업해 Rule 기반 Fallback 응답 흐름을 설계했습니다.</li>
              <li>React 채팅 UI와 AI 연동, 모호한 질문 처리, 버튼형 선택지 UI를 담당했습니다.</li>
              <li>Python 크롤러, Spring Boot API, 7개 카테고리 데이터 구조에 맞춰 API 명세를 조율했습니다.</li>
              <li>공동 연구 결과를 2025년도 전자공학회 하계학술대회에 제출하고 포스터로 발표했습니다.</li>
            </ul>
          </article>
          <article>
            <h3>대한전자공학회논문지 / 랩 활동</h3>
            <p className="pdf-profile-meta">2025.12 - 2026.04 / 생성형 AI 기반 포트폴리오 요약 플랫폼</p>
            <ul>
              <li>테크 리더로서 Next.js 컴포넌트 구조와 비즈니스 로직 분리를 주도했습니다.</li>
              <li>Vercel AI SDK 기반 스트리밍 연동과 기술 스택 DB 교차 검증 흐름을 설계했습니다.</li>
              <li>Neon DB, Drizzle ORM, NCP 배포 구조를 팀원에게 설명하고 작업 범위를 나눴습니다.</li>
              <li>AI 추출 데이터의 비표준 명칭을 필터링/치환하는 검증 레이어로 데이터 왜곡 위험을 줄였습니다.</li>
            </ul>
          </article>
          <article>
            <h3>BRIGHT MAKERS EXPO</h3>
            <p className="pdf-profile-meta">한경대학교 / 캠퍼스디자인 경진대회</p>
            <ul>
              <li>학교 정보 접근 문제를 해결하는 AI ChatBot 서비스를 발표해 우수상을 받았습니다.</li>
              <li>공지, 식단, 학사 일정처럼 흩어진 정보를 채팅 흐름으로 연결하는 사용자 경험을 제안했습니다.</li>
              <li>학술대회 챗봇 프로젝트의 사용 시나리오와 발표 성과를 외부 대회 맥락으로 확장했습니다.</li>
            </ul>
          </article>
          <article>
            <h3>교육</h3>
            <ul>
              <li>한경대학교 소프트웨어융합학과 / 2020.03 - 2026.02 졸업</li>
              <li>GPA 3.87 / 4.5</li>
              <li>정보처리기사 / 2025.09.12</li>
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}
