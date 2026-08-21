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

const gameInfoCaseTitles: Record<string, string> = {
  "외부 API 응답 포맷 차이로 인한 UI 결합 제거": "Adapter·Normalizer로 외부 API 응답을 공통 view model로 변환",
  "0원/null 가격 데이터가 할인/목표가로 오판되는 문제 해결": "currentPriceCents 조건으로 0원/null 가격 오판 방지",
  "외부 API 장애와 호출 한도 초과 대응": "stale cache·rate limit으로 외부 API 실패 화면 방어",
  "기능 확장 이후 테스트와 검증 루틴 구축": "Vitest·Playwright로 API route와 사용자 흐름 회귀 검증",
  "비동기 UI cleanup과 generic 유틸로 상태 누수·타입 손실 방지": "useEffect cleanup·generic 유틸로 비동기 상태와 타입 보존",
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
  summary:
    "Steam·Epic·ITAD 게임 데이터를 검색, 할인 피드, 상세, 관심 목록, 목표 가격 화면으로 연결한 Next.js 서비스입니다. 핵심 근거는 외부 API 응답을 UI에 직접 붙이지 않고 Adapter/Normalizer와 공통 view model로 고정한 점, 0원·null 가격 오판을 도메인 규칙과 테스트로 막은 점, stale cache·rate limit·오류 상태를 사용자 화면 기준으로 검증한 점입니다.",
  responsibilities: [
    "Next.js App Router 기반 검색·할인·상세·관심 목록 화면 구현",
    "Steam·Epic·ITAD 응답을 GameSummary/StoreProduct view model로 정규화해 카드·상세·관심 목록의 props 계약 통일",
    "Supabase Auth/DB와 watchlist, target price, price snapshot 흐름을 사용자 상태 UI와 연결",
    "Vitest, Testing Library, Playwright로 API route, 가격 계산, cache/rate limit, 관심 목록 UI 상태 검증",
  ],
  metricRows: baseGameInfo.metricRows,
  frontendFundamentals: [
    {
      concept: "서버/클라이언트 경계",
      application: "Next.js route handler와 client UI를 나누어 브라우저가 직접 외부 API key와 응답 포맷을 알지 않게 했습니다.",
      result: "UI는 정규화된 view model만 사용하고, 외부 API 변경은 route/adapter 경계에서 먼저 흡수합니다.",
    },
    {
      concept: "비동기 상태와 오류 상태",
      application: "검색, 할인 피드, 관심 상품 흐름에서 loading, empty, stale cache, rate limit, error 상태를 화면 상태로 분리했습니다.",
      result: "외부 API timeout이나 호출 제한이 곧바로 빈 화면/500 화면처럼 보이지 않게 방어했습니다.",
    },
    {
      concept: "데이터 정규화와 props 계약",
      application: "Steam·Epic·ITAD 응답을 adapter/normalizer로 공통 GameSummary/StoreProduct 모델에 맞췄습니다.",
      result: "카드, 상세, 관심 목록 컴포넌트가 API별 필드명 차이를 직접 처리하지 않습니다.",
    },


    {
      concept: "순수 함수와 테스트 가능한 규칙",
      application: "가격 후보 산정, 0원/null 제외, 목표가 달성 판단을 UI 밖의 함수와 테스트로 고정했습니다.",
      result: "currentPriceCents > 0 규칙을 기준으로 잘못된 최저가/목표가 표시를 차단했습니다.",
    },
    {
      concept: "사용자 상태를 기준으로 한 테스트",
      application: "게임 카드, 관심 목록 폼, 목표 조건 폼, AI 인사이트 UI를 구현 세부사항보다 role, label, status, alert 기준으로 검증했습니다.",
      result: "외부 API 실패, 캐시 상태, 빈 화면, 목표가 입력 같은 예외 흐름을 사용자가 보는 문구와 상태로 확인했습니다.",
    },
  ],
  aiEngineering: undefined,
  architecture: {
    title: "외부 API 응답을 UI 계약으로 고정한 FE 구조",
    description:
      "화면 컴포넌트는 Steam, Epic, ITAD 응답 포맷을 직접 알지 않고 Next.js route와 normalizer가 만든 view model만 사용합니다. 가격 계산, 캐시, 호출 제한, 오류 상태는 route/domain 경계에서 먼저 처리합니다.",
    columns: [
      { title: "Client UI", nodes: [{ label: "Search / Deals", detail: "검색, 할인 피드, 신작 목록" }, { label: "Watchlist", detail: "관심 상품, 목표 가격, 상태 피드백" }] },
      { title: "Next.js Boundary", nodes: [{ label: "Route Handler", detail: "외부 API 호출과 key 보호" }, { label: "View Model", detail: "화면이 쓰는 표시 데이터 구성" }] },
      { title: "Domain Rules", nodes: [{ label: "Adapter / Normalizer", detail: "상점별 응답을 공통 모델로 변환" }, { label: "Price Guard", detail: "0원/null 가격 후보 제외" }] },
      { title: "Reliability", nodes: [{ label: "Stale Cache", detail: "외부 API 실패 시 기존 데이터 표시" }, { label: "Rate Limit", detail: "반복 호출 429와 retry metadata" }] },
    ],
    flow: [
      "사용자가 검색, 할인, 상세, 관심 목록 화면에서 데이터를 요청합니다.",
      "Next.js route가 외부 API를 호출하고 normalizer가 응답 차이를 공통 view model로 변환합니다.",
      "UI는 같은 props 계약으로 카드, 상세, 관심 목록을 렌더링합니다.",
      "가격 계산, stale cache, rate limit, 오류 상태는 테스트로 고정한 규칙을 통과한 뒤 화면에 표시합니다.",
    ],
  },
  caseStudies: [
    ...baseGameInfo.caseStudies
      .filter((item) =>
        [
          "외부 API 응답 포맷 차이로 인한 UI 결합 제거",
          "0원/null 가격 데이터가 할인/목표가로 오판되는 문제 해결",
          "외부 API 장애와 호출 한도 초과 대응",
          "기능 확장 이후 테스트와 검증 루틴 구축",
          "Fallow 지표 기반 dead code와 중복 코드 정리",
        ].includes(item.title),
      )
      .map((item) => retitleCaseStudy(item, gameInfoCaseTitles[item.title] ?? item.title)),
    {
      title: gameInfoCaseTitles["비동기 UI cleanup과 generic 유틸로 상태 누수·타입 손실 방지"],
      issue: "관심 목록 추가 후 토스트 메시지를 일정 시간 뒤 닫고, 무한 로딩은 IntersectionObserver로 다음 데이터를 불러오는 구조였습니다. 화면 전환 뒤 timer나 observer가 남으면 이미 사라진 컴포넌트의 상태를 갱신할 수 있고, API timeout/cache 유틸을 route마다 따로 만들면 결과 타입이 쉽게 흐려질 수 있었습니다.",
      cause: "setTimeout과 IntersectionObserver는 React 렌더링과 별도로 동작합니다. cleanup 없이 남기면 unmount 이후에도 callback이 실행될 수 있습니다. 또 timeout, fresh cache, stale fallback은 여러 API route에서 반복되는 비동기 처리인데, any나 넓은 타입으로 묶으면 route별 응답 타입과 cache entry 필드 보장이 약해집니다.",
      resolution: "AddToWatchlistForm에서는 timerRef를 두고 useEffect cleanup에서 clearTimeout을 호출했습니다. useIntersectionLoader에서는 cleanup으로 observer.disconnect()를 실행했습니다. 비동기 유틸은 withTimeout<T>로 원래 Promise 결과 타입을 유지했고, stale cache는 T extends TimedCacheEntry 제약으로 expiresAt과 staleUntil 필드를 보장했습니다.",
      result: "토스트와 무한 로딩 관찰자가 화면 전환 뒤 상태를 갱신하는 경로를 막았습니다. timeout과 cache 처리는 여러 route에서 재사용하면서도 API 응답 타입과 cache entry 타입 정보를 잃지 않게 됐습니다.",
      evidence: ["add-to-watchlist-form.tsx", "use-intersection-loader.ts", "async-utils.ts", "stale-cache.ts"],
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
