import { axPortfolio } from "./portfolio_ax";
import { portfolio, type CaseStudy, type Project } from "./portfolio";

function getProject(title: string): Project {
  const project = axPortfolio.projects.find((item) => item.title === title);
  if (!project) throw new Error(`Frontend portfolio project not found: ${title}`);
  return project;
}

function getBaseProject(title: string): Project {
  const project = portfolio.projects.find((item) => item.title === title);
  if (!project) throw new Error(`Base portfolio project not found: ${title}`);
  return project;
}

const photoMap = getProject("PhotoMap");
const gameInfo = getProject("Game Information Platform");
const aiChatBot = getProject("AI ChatBot");
const basePhotoMap = getBaseProject("PhotoMap");
const baseGameInfo = getBaseProject("Game Information Platform");
const webGlCase = basePhotoMap.caseStudies.find(
  (item) => item.title === "WebGL 지도와 3D globe 렌더링 수명 주기 분리",
);

function retitleCaseStudy(caseStudy: CaseStudy, title: string): CaseStudy {
  return { ...caseStudy, title };
}

const photoMapCaseTitles: Record<string, string> = {
  "WebGL 지도와 3D globe 렌더링 수명 주기 분리": "iframe·renderer cleanup으로 WebGL 렌더링 수명 주기 분리",
  "느리다는 인상을 반복 가능한 이미지 evidence로 바꾸기": "Playwright·CDP로 이미지 LCP와 전송량 반복 측정",
  "D3 tick 업데이트를 React state에서 분리": "과도한 리렌더링을 줄이기 위한 D3 그래프 갱신 범위 분리",
};

const photoMapFrontend: Project = {
  ...photoMap,
  subtitle: "지도·WebGL·관계 그래프로 사진을 탐색하는 반응형 웹 서비스",
  summary:
    "여행이나 일상에서 찍은 사진을 위치와 시간 흐름으로 다시 탐색하는 사진 지도 서비스입니다. 사용자는 EXIF 위치 정보를 바탕으로 지도에서 촬영 장소를 확인하고, 앨범·타임라인·관계 그래프를 오가며 사진 묶음과 이동 경로를 살펴볼 수 있습니다. 3인 팀 프로젝트에서 저는 프론트엔드를 맡아 React 화면에 Mapbox 지도, Unity WebGL iframe, 3D globe, D3 관계 그래프를 연결했고, 대량 사진 탐색에서도 화면이 끊기지 않도록 렌더링 수명 주기와 상태 경계를 분리했습니다.",
  responsibilities: [
    "Mapbox 지도, 앨범, 타임라인, Unity WebGL iframe, 3D globe, D3 관계 그래프를 React 화면에 통합",
    "Zustand selector와 useShallow로 상태 구독 범위를 줄이고, 대량 목록은 가상화로 DOM 수를 제한",
    "D3 tick 좌표를 React state에서 ref/DOM 속성 갱신으로 분리해 초당 반복 이벤트의 reconciliation 비용 축소",
    "Vercel Preview, Playwright, CDP encodedDataLength, React Profiler 기준으로 성능 개선 전후를 반복 측정",
  ],
  metrics: [
    { label: "lab LCP p75", value: "17.4s → 2.5s", basis: "85.6% 단축 · baseline cold 30회 / optimized cold 100회" },
    { label: "첫 사진 p95", value: "17.6s → 2.6s", basis: "85.2% 단축 · baseline cold 30회 / optimized cold 100회" },
    { label: "관측 전송량 / run", value: "3,125KB → 328KB", basis: "89.5% 감소 · CDP encodedDataLength" },
    { label: "D3 NodeView 렌더링", value: "370회 → 25회", basis: "93.2% 감소 · React Profiler" },
  ],
  frontendFundamentals: [
    {
      concept: "상태 변경과 리렌더 전파",
      application: "큰 Context value를 Zustand store로 나누고 화면마다 필요한 상태 slice만 구독했습니다.",
      result: "상태 변경 반응 범위 70여 개 컴포넌트 → 5개 이하",
    },
    {
      concept: "참조 동일성과 얕은 비교",
      application: "selector가 새 배열·객체를 반환할 때 생기는 재평가를 이해하고 useShallow로 참조 비교 기준을 고정했습니다.",
      result: "React Profiler commit 9.7ms → 6.2ms, 약 36% 단축",
    },


    {
      concept: "state와 ref의 역할 구분",
      application: "초당 반복되는 D3 tick 좌표는 React state에 올리지 않고 ref와 DOM 속성으로 직접 갱신했습니다.",
      result: "D3 NodeView 렌더링 370회 → 25회, 93.2% 감소",
    },

    {
      concept: "reconciliation 비용과 컴포넌트 경계",
      application: "보이는 row만 렌더링하고 이미지 카드를 memoization해 대량 목록의 비교·DOM 생성 범위를 제한했습니다.",
      result: "10,000장 조건에서도 DOM 약 200개 수준 유지",
    },
    {
      concept: "생명주기와 cleanup",
      application: "Unity WebGL을 iframe 경계로 분리하고 canvas renderer·event listener·simulation 종료 경로를 명시했습니다.",
      result: "React 상태 변경과 WebGL·D3 런타임의 갱신 책임 분리",
    },
  ],
  aiEngineering: undefined,
  caseStudies: [
    ...(webGlCase ? [retitleCaseStudy(webGlCase, photoMapCaseTitles[webGlCase.title] ?? webGlCase.title)] : []),
    ...photoMap.caseStudies
      .filter((item) =>
        [
          "느리다는 인상을 반복 가능한 이미지 evidence로 바꾸기",
          "Context API 전역 리렌더링을 Zustand selector로 축소",
          "D3 tick 업데이트를 React state에서 분리",
        ].includes(item.title),
      )
      .map((item) => retitleCaseStudy(item, photoMapCaseTitles[item.title] ?? item.title)),
    {
      title: "useMemo·useCallback으로 지도/사진 목록 재계산 범위 제한",
      issue: "Mapbox iframe 지도, 사진 grid, 검색·카테고리 필터가 같은 사진 목록을 바라보면서 검색어 입력이나 선택 상태 변경 때 marker 배열, grid 계산, iframe 전송 함수가 함께 흔들릴 수 있었습니다.",
      cause: "React에서는 렌더마다 새 배열과 새 함수가 만들어지면 의존성 배열이 바뀌고, 그 결과 useEffect나 하위 컴포넌트가 실제 데이터 변경보다 넓게 다시 실행될 수 있습니다. 대량 사진 목록에서는 이 작은 재계산도 지도 marker 생성, virtual row 계산, 이미지 카드 렌더링 비용으로 이어집니다.",
      resolution: "Map2DView에서 filteredPhotos, mapMarkers, selectedPhoto를 useMemo로 분리하고, iframe payload 생성과 postMessage 전송 함수는 useCallback으로 고정했습니다. PhotoFeed에서는 displayPhotos와 effectiveColumns를 useMemo로 계산하고, 가상 row는 virtualRow.index, 사진 카드는 photo.id를 key로 사용해 row 위치와 사진 데이터의 identity를 나눴습니다.",
      result: "검색어, 카테고리, 사진 목록처럼 실제 입력이 바뀔 때만 지도 marker와 grid 계산이 다시 만들어지도록 범위를 좁혔습니다. iframe 연동 effect의 의존성도 명확해져 지도 런타임과 React 렌더링이 불필요하게 맞물리는 경로를 줄였습니다.",
      evidence: ["Map2DView.tsx", "PhotoFeed.tsx", "useMemo", "useCallback", "photo.id key"],
    },
  ],
};

const gameInfoFrontend: Project = {
  ...gameInfo,
  subtitle: baseGameInfo.subtitle,
  imageGallery: {
    main: { src: "/1_project/gameinfo-home-20260922.png", alt: "게임 할인 플랫폼의 다크 스토어 홈과 할인 가격" },
    supporting: [
      { src: "/1_project/gameinfo-search-20260922.png", alt: "게임 제목·태그·스토어·가격 조건으로 검색하는 화면" },
      { src: "/1_project/gameinfo-home-20260922.png", alt: "게임 표지와 가격을 비교하는 할인 피드" },
    ],
  },
  summary:
    "Steam·Epic·ITAD 게임 데이터를 검색, 할인 피드, 상세, 관심 목록 화면으로 연결한 Next.js 서비스입니다. 할인 피드 카드 렌더 호출을 6회 → 2회로 줄이고, 동일 제목 동시 조건 요청 4건의 제목 후보 조회를 1회로 공유해 검색·목록 화면의 반복 작업을 줄였습니다.",
  responsibilities: [
    "React.memo와 stable key로 할인 피드 실패·재시도·추가 로딩 흐름의 기존 카드 반복 렌더링 축소",
    "제목 후보 캐시와 진행 중 요청 공유로 동일 제목 동시 조건 요청 4건의 후보 조회를 1회로 통합",
    "SearchControls를 uncontrolled GET form과 URL query로 구성해 입력 상태와 결과 목록 갱신 경계 분리",
    "서버 Suspense/스트리밍 경계와 이미지 eager/lazy 우선순위로 첫 화면과 후속 목록 로딩 역할 분리",
  ],
  metrics: [
    { label: "할인 피드 카드 렌더 호출", value: "6회 → 2회", basis: "약 67% 감소 · 실패·재시도·추가 로딩 흐름" },
    { label: "동일 제목의 동시 요청", value: "4건 → 조회 1회", basis: "제목 후보 캐시·진행 중 요청 공유" },
  ],
  metricRows: undefined,
  frontendFundamentals: [
    {
      concept: "렌더링 경계와 memoization",
      application: "GameCard와 관심 목록 액션을 같은 memo 경계에서 다루고, game.id key로 기존 카드의 identity를 유지했습니다.",
      result: "할인 피드 실패·재시도·추가 로딩 흐름의 카드 호출 6회 → 2회",
    },
    {
      concept: "요청 중복 제거",
      application: "정규화한 제목을 기준으로 후보 캐시와 진행 중 요청 Promise를 공유했습니다.",
      result: "동일 제목 동시 조건 요청 4건의 제목 후보 조회 1회 공유",
    },
    {
      concept: "입력 상태와 결과 렌더링 분리",
      application: "SearchControls는 uncontrolled GET form과 URL query로 두고, 결과 목록은 서버 Suspense/스트리밍 경계에서 갱신했습니다.",
      result: "검색 조건 UI와 결과 목록의 갱신 범위를 분리",
    },
    {
      concept: "이미지 로딩 우선순위",
      application: "첫 표지 이미지는 eager/high priority로, 후속 이미지는 lazy로 분리했습니다.",
      result: "첫 화면과 후속 목록 이미지의 로딩 역할 구분",
    },
  ],
  aiEngineering: undefined,
  architecture: {
    title: "검색·할인 피드의 반복 작업을 줄인 FE 구조",
    description:
      "검색 조건은 URL 상태로 공유하고, 결과 목록은 서버 경계에서 갱신합니다. 할인 피드는 카드 memo 경계와 stable key로 기존 카드의 반복 렌더링을 줄이고, 제목 후보 조회는 캐시와 진행 중 요청 공유로 중복 실행을 막습니다.",
    columns: [
      { title: "Search UI", nodes: [{ label: "GET Form", detail: "입력 상태와 URL query 연결" }, { label: "Suspense Boundary", detail: "조건 UI와 결과 목록 갱신 분리" }] },
      { title: "Deal Feed", nodes: [{ label: "Memo Card", detail: "카드·액션 렌더 경계 고정" }, { label: "Stable Key", detail: "game.id 기준 카드 identity 유지" }] },
      { title: "Request Sharing", nodes: [{ label: "Title Cache", detail: "정규화 제목 후보 재사용" }, { label: "Inflight Promise", detail: "진행 중 후보 조회 공유" }] },
      { title: "Image Priority", nodes: [{ label: "First Cover", detail: "eager/high priority" }, { label: "Rest Covers", detail: "lazy loading" }] },
    ],
    flow: [
      "사용자가 검색 조건을 제출하면 URL query가 조건의 기준이 됩니다.",
      "서버 경계에서 결과 목록을 준비하고, 조건 UI는 결과 fetch와 분리해 표시합니다.",
      "할인 피드는 memoized GameCard와 game.id key로 기존 카드의 반복 호출을 줄입니다.",
      "같은 제목의 후보 조회는 cache/inflight 공유로 4건 동시 요청에서도 1회만 실행합니다.",
    ],
  },
  caseStudies: [
    {
      title: "카드 렌더 호출을 약 67% 줄였습니다",
      issue: "할인 피드에서 실패·재시도·추가 로딩이 이어질 때 기존 카드까지 반복 호출되어 목록이 길어질수록 렌더링 비용이 커질 수 있었습니다.",
      cause: "부모가 매번 생성하는 액션 JSX의 참조가 달라져, GameCard에 memo만 적용해도 기존 카드가 다시 호출됐습니다.",
      resolution: "FeedGameCard 안에서 카드와 액션을 함께 생성하도록 memo 경계를 옮기고, 목록 병합 시 기존 게임 객체의 참조를 유지했습니다.",
      result: "고정 데이터 Vitest/jsdom 실험에서 할인 피드 누적 카드 호출이 6회 → 2회로 줄었고, 기존 카드의 추가 호출은 4회 → 0회가 됐습니다.",
      evidence: ["feed-render-evidence.md", "feed-game-card.tsx", "React.memo", "game.id key"],
    },
    {
      title: "동시 요청 4건을 후보 조회 1회로 묶었습니다",
      issue: "같은 제목의 조건 요청이 동시에 들어올 때 제목 후보 조회가 중복 실행될 수 있었습니다.",
      cause: "요청별로 후보 조회를 따로 시작하면 같은 제목을 찾는 중에도 같은 작업이 반복됩니다.",
      resolution: "제목 후보 캐시와 진행 중 요청을 공유하고, 태그·스토어·가격 조건은 가져온 후보에 적용하도록 분리했습니다.",
      result: "동일 제목의 동시 필터 요청 4건에서 제목 후보 조회가 1회만 실행되는 것을 테스트로 확인했습니다.",
      evidence: ["search-behavior.test.ts", "home-streaming.test.tsx", "title candidate cache", "inflight request sharing"],
    },
  ],
};

const aiChatBotFrontend: Project = {
  ...aiChatBot,
  summary:
    "학교 공지·학식·일정을 한 채팅 흐름에서 확인하는 2인 졸업 프로젝트입니다. 생성형 AI와 백엔드의 비정형 응답을 신뢰 가능한 화면 데이터로 가정하지 않고, Next.js API route와 메시지 표시 규칙으로 경계를 보완한 프로젝트입니다.",
  responsibilities: [
    "ReactMarkdown 기반 채팅 UI와 모바일 응답 가독성 개선",
    "Next.js API route로 외부 AI·백엔드 응답 차이를 UI 밖에서 흡수",
  ],
  caseStudies: aiChatBot.caseStudies.filter(
    (item) => item.title === "AI 응답을 신뢰 가능한 화면 데이터로 가정하지 않기",
  ),
};

export const frontendPortfolio = {
  ...axPortfolio,
  profile: {
    ...axPortfolio.profile,
    title: "Front-End Developer",
    headline:
      "React·Next.js 화면에서 상태 전파, API 계약, 렌더링 수명 주기, 이미지 전송 병목을 코드 구조와 반복 측정으로 증명하는 프론트엔드 개발자입니다.",
  },
  projects: [photoMapFrontend, gameInfoFrontend],
  activities: [
    {
      date: "2025.09 - 2025.11",
      title: "AI ChatBot - 캡스톤디자인 경진대회 우수상",
      description: "학교 공지·식단·학사 일정 정보를 채팅 UI로 제공한 2인 졸업 프로젝트입니다. ReactMarkdown로 긴 답변과 링크를 읽기 쉽게 표시하고, Next.js API route로 백엔드 응답 경계를 분리했습니다. 이 프로젝트로 BRIGHT MAKERS EXPO 2025 캡스톤디자인 경진대회 우수상을 받았고, 관련 내용을 학술대회 포스터/논문으로 발표했습니다.",
      pdf: { label: "논문 PDF", href: "/files/thesis/interactive-campus-qa-system.pdf" },
    },
    ...portfolio.activities.filter((activity) => activity.date !== "2025.04" && activity.pdf?.href !== "/files/thesis/interactive-campus-qa-system.pdf"),
  ],
} as const;
