export type Metric = {
  label: string;
  value: string;
  basis: string;
};

export type MetricRow = {
  metric: string;
  before: string;
  after: string;
  basis: string;
  category?: string;
};

export type ArchitectureColumn = {
  title: string;
  nodes: {
    label: string;
    detail: string;
  }[];
};

export type CaseStudy = {
  title: string;
  issue: string;
  cause: string;
  resolution: string;
  result: string;
  evidence: string[];
};

export type Project = {
  title: string;
  subtitle: string;
  period: string;
  team: string;
  summary: string;
  responsibilities: string[];
  tech: string[];
  links: {
    live?: string;
    github: string;
  };
  imageGallery: {
    main: { src: string; alt: string };
    supporting: { src: string; alt: string }[];
  };
  metrics: Metric[];
  metricRows?: MetricRow[];
  architecture: {
    title: string;
    description: string;
    columns: ArchitectureColumn[];
    flow: string[];
  };
  caseStudies: CaseStudy[];
};

export type Activity = {
  date: string;
  title: string;
  description: string;
  pdf?: { label: string; href: string };
};

export const portfolio = {
  profile: {
    name: "민사빈",
    title: "Front-End Developer",
    headline:
      "호기심으로 넓게 탐구하고, 지표와 판단으로 엄격하게 적용하는 프론트엔드 엔지니어입니다.",
    contacts: {
      email: "minsabin1108@gmail.com",
      github: "https://github.com/sabin1108",
    },
  },

  projects: [
    {
      title: "Game Information Platform",
      subtitle: "Steam/Epic 게임 할인 조회와 관심 상품 가격 추적 서비스",
      period: "2026.05 - 2026.06",
      team: "개인 프로젝트",
      summary:
        "Steam/Epic 게임 할인 정보, 신작, 관심 목록, 목표 가격 추적을 제공하는 Next.js 서비스입니다. 핵심 과제는 외부 API 응답 차이를 UI에서 직접 처리하지 않도록 정규화 계층을 두고, API 장애나 0원 가격 데이터가 사용자 화면에 잘못 표시되지 않게 방어하는 것이었습니다.",
      responsibilities: [
        "서비스 전체 프론트엔드 설계와 구현",
        "Supabase Auth/DB 연동과 관심 상품, 목표 가격 추적 UX 구현",
        "Steam/Epic/ITAD API 응답을 Adapter/Normalizer 계층으로 정규화",
        "가격 계산, 0원/null 방어 로직, stale cache와 rate limit 처리",
        "Vitest와 Playwright 기반 테스트 및 배포 검증 흐름 정리",
      ],
      tech: ["Next.js", "React", "TypeScript", "Supabase", "Vitest", "Playwright"],
      links: {
        live: "https://www.gamesaleinfo.site",
        github: "https://github.com/sabin1108/Game-information-platform",
      },
      imageGallery: {
        main: { src: "/1_project/gameinfo_1.png", alt: "Game Information Platform 메인 화면" },
        supporting: [
          { src: "/1_project/gameinfo_2.png", alt: "게임 할인 목록 화면" },
          { src: "/1_project/gameinfo_3.png", alt: "관심 목록 화면" },
          { src: "/1_project/gameinfo_4.png", alt: "게임 상세 또는 보조 화면" },
        ],
      },
      metrics: [],
      metricRows: [
        { metric: "미사용 파일", before: "1개", after: "0개", basis: "fallow 사용전 코드.md / fallow 최종 지표.md" },
        { metric: "미사용 export", before: "11개", after: "0개", basis: "fallow 사용전 코드.md / fallow 최종 지표.md" },
        { metric: "중복 코드 비율", before: "1,006줄 (9.4%)", after: "308줄 (2.9%)", basis: "Fallow duplication report" },
        { metric: "유지보수성 점수", before: "91.3 (good)", after: "92.1 (good)", basis: "Fallow complexity metrics" },
        { metric: "테스트/스펙 파일", before: "수동 확인 중심", after: "25개 파일 / 69 cases", basis: "README.md 테스트와 검증 방식" },
        { metric: "주요 리팩터 검증", before: "개별 기능 확인", after: "Vitest 21 files / 60 tests passed", basis: "README.md / handoff 기록" },
      ],
      architecture: {
        title: "외부 게임 API 정규화와 장애 완충 구조",
        description:
          "UI가 Steam, Epic, ITAD 응답 포맷을 직접 알지 않도록 Adapter/Normalizer를 두고, 캐시와 rate limit을 API route 경계에 배치했습니다.",
        columns: [
          { title: "Client", nodes: [{ label: "Search / Deals", detail: "검색, 할인 피드, 신작 목록" }, { label: "Watchlist", detail: "관심 상품, 목표 가격, 상태 피드백" }] },
          { title: "Next.js Route", nodes: [{ label: "API Routes", detail: "외부 API 호출 경계" }, { label: "View Model", detail: "UI가 쓰는 표시 데이터 구성" }] },
          { title: "Domain Layer", nodes: [{ label: "Adapter / Normalizer", detail: "ITAD 응답을 GameSummary/StoreProduct로 변환" }, { label: "Price Guard", detail: "0원/null 가격을 best price 후보에서 제외" }] },
          { title: "Persistence / Guard", nodes: [{ label: "Supabase", detail: "auth, profiles, watchlist, price_snapshots" }, { label: "Stale Cache", detail: "fresh TTL 이후 stale fallback" }, { label: "Rate Limit", detail: "fixed-window 요청 제한" }] },
        ],
        flow: [
          "사용자가 검색, 할인 피드, 관심 목록 화면에서 데이터를 요청합니다.",
          "Next.js route가 외부 API 호출을 담당하고, normalizer가 응답 차이를 공통 모델로 변환합니다.",
          "가격 계산과 watchlist 상태는 view model로 가공되어 UI에 전달되고, Supabase에는 사용자 상태와 가격 snapshot이 저장됩니다.",
        ],
      },
      caseStudies: [
        {
          title: "외부 API 응답 포맷 차이로 인한 UI 결합 제거",
          issue: "검색, 할인 피드, 관심 목록을 같은 카드 UI로 묶는 과정에서 Steam/Epic/ITAD 응답의 필드명과 누락 방식이 서로 달라, 화면 컴포넌트가 API별 예외를 직접 알게 되는 결합 문제를 발견했습니다.",
          cause: "외부 API 응답을 화면에 바로 연결해보니 같은 게임 정보라도 식별자는 app id, slug, plain id처럼 다르게 들어오고, 가격/할인/이미지/상점 링크도 서비스마다 필드명과 결측 규칙이 달랐습니다. 이 차이를 카드, 상세, 관심 목록 컴포넌트에서 각각 처리하면 API 응답 하나가 바뀔 때 여러 UI 파일을 동시에 고쳐야 하고, 테스트도 화면 조합마다 반복해야 하는 구조가 됩니다.",
          resolution: "API 호출 결과와 UI layer 사이에 Adapter/Normalizer 계층을 두고, GameSummary와 StoreProduct 같은 공통 도메인 모델로 변환했습니다. store priority, dedupe, steam app id 추출도 한곳으로 모았습니다.",
          result: "UI는 정규화된 view model만 소비하게 되어 검색 결과, 할인 목록, 상세 화면, 관심 목록이 외부 API 포맷을 직접 알 필요가 없어졌습니다. 이후 API 응답 차이는 normalizer 계층에서 흡수하고, 화면 컴포넌트는 동일한 데이터 계약을 기준으로 렌더링하게 되어 수정 범위와 중복 분기 위험을 줄였습니다.",
          evidence: ["itad-normalizers.ts", "commit f313957", "commit b90c474"],
        },
        {
          title: "0원/null 가격 데이터가 할인/목표가로 오판되는 문제 해결",
          issue: "가격 비교 로직을 테스트하던 중 미출시, 가격 미정, 데이터 미제공 게임의 0/null 값이 정상 최저가 후보로 들어가 100% 할인이나 목표가 도달처럼 오판될 수 있는 문제를 발견했습니다.",
          cause: "외부 가격 API에서 0, null, 미제공 값은 실제 무료 배포가 아니라 가격 미정이나 데이터 결측을 뜻할 수 있습니다. 그런데 best price 계산이 숫자 여부만 보고 후보를 고르면 결측값이 최저가로 채택되고, 사용자는 구매 가능한 할인 가격이나 목표가 알림으로 오해할 수 있습니다. 특히 관심 목록의 목표 가격 판단과 할인율 배지처럼 사용자의 구매 판단에 직접 연결되는 UI에서 위험이 컸습니다.",
          resolution: "game-score.ts에서 currentPriceCents가 0보다 큰 가격만 best price 후보로 사용하고, 후보가 없으면 목표 가격 매칭을 false로 처리했습니다.",
          result: "가격 판단을 보수적으로 바꾸면서 결측 가격이 최저가나 목표가 달성 상태로 표시되는 경로를 차단했습니다. 사용자는 실제 구매 가능한 가격 후보가 있을 때만 할인/목표가 정보를 보게 되었고, 테스트로 0/null 가격이 best price 후보에서 제외되는 흐름을 확인했습니다.",
          evidence: ["game-score.ts", "tests/game-score.test.ts", "멘토링 PDF Game 사례"],
        },
        {
          title: "외부 API 장애와 호출 한도 초과 대응",
          issue: "검색/할인/인기 같은 공개 route를 점검하면서 외부 가격 API timeout, 호출 한도 초과, 반복 새로고침이 그대로 500 오류나 빈 화면으로 이어질 수 있는 안정성 문제를 발견했습니다.",
          cause: "가격 정보 화면은 사용자가 페이지를 열 때마다 외부 API 응답성에 묶입니다. 공개 API route가 query/filter/country/store 조합별 캐시 없이 매번 외부 요청을 보내면 반복 호출에 취약하고, timeout이나 rate limit이 발생했을 때 기존 캐시가 있어도 route 실패로 끝납니다. 그 결과 사용자는 일부 데이터 소스 장애를 서비스 전체 장애처럼 경험하게 됩니다.",
          resolution: "fresh TTL 이후에도 일정 시간 stale 데이터를 유지하는 cache 모듈과 fixed-window rate limit을 route 경계에 추가했습니다.",
          result: "외부 API가 느리거나 실패해도 fresh TTL 이후의 stale 데이터를 반환할 수 있어 검색/할인 화면이 바로 500 오류로 무너지지 않게 됐습니다. 반복 호출은 서버 route에서 429와 retry metadata로 제어해 외부 API 한도 초과 위험을 줄였고, cache hit, stale fallback, rate limit 케이스를 route 테스트로 검증했습니다.",
          evidence: ["stale-cache.ts", "rate-limit.ts", "commit 19468b7", "commit 4297605"],
        },
        {
          title: "기능 확장 이후 테스트와 검증 루틴 구축",
          issue: "검색, 할인 피드, 관심 목록, 목표가 계산, 웹뷰, analytics, monitoring까지 기능 범위가 넓어지면서 수동 확인만으로는 API 응답 형식 변경, cache 상태, rate limit, 인증 흐름, 모바일 웹뷰 회귀를 안정적으로 잡기 어려웠습니다.",
          cause: "핵심 흐름이 외부 ITAD API, Supabase Auth/DB, Next.js API route, 클라이언트 UI, 모바일 웹뷰 bridge에 걸쳐 있어 한 지점의 변경이 다른 화면의 가격 표시나 관심 목록 저장 흐름에 영향을 줄 수 있었습니다. 특히 외부 API는 테스트 때 직접 과도 호출하면 결과가 불안정하고, server-only API key 노출 여부처럼 화면만 봐서는 확인하기 어려운 조건도 있었습니다.",
          resolution: "Vitest로 API route, 정규화 함수, cache hit/miss/stale, rate limit, 목표가 계산, 추천, analytics payload, monitoring ingest를 검증하고, Testing Library로 관심 목록 UI 상태를 확인했습니다. Playwright는 홈 smoke, auth flow, watchlist flow, mobile webview safe-area와 bridge fallback을 맡겼고, load:public 스크립트로 home/search/deals 공개 route의 status, cache status, p50/p95/max latency를 기록할 수 있게 했습니다.",
          result: "최근 정리 기준으로 unit/component/API/E2E spec 25개 파일과 69개 케이스를 갖췄고, 주요 리팩터 검증에서 Vitest 21 files / 60 tests를 통과했습니다. 외부 API는 mock/cache 경로로 반복 가능하게 검증하고, 사용자가 보는 버튼 이름, status 문구, URL, 응답 JSON shape를 기준으로 테스트해 릴리즈 전 회귀 위험을 줄였습니다.",
          evidence: ["README.md 테스트와 검증 방식", "tests/search-api.test.ts", "tests/deals-api.test.ts", "tests/e2e/webview.spec.ts", "scripts/load-public-routes.mjs"],
        },
        {
          title: "Fallow 지표 기반 dead code와 중복 코드 정리",
          issue: "기능 개발 이후 Fallow 정적 분석을 돌리며 unused file/export, 테스트 중복, 타입 반복 코드가 남아 있고 일부 API route와 테스트 파일이 복잡도 hotspot으로 커진 것을 발견했습니다.",
          cause: "검색, 할인, watchlist, AI insight, route 테스트를 빠르게 붙이면서 임시 wrapper와 중복 테스트 셋업이 남았습니다. Fallow 리포트에서 unused files 1개, unused exports 11개, 중복 코드 1,006줄(9.4%), deals/search/jobs 테스트와 API route hotspot이 드러났습니다. 런타임 오류는 아니지만 변경 시 잘못된 의존성을 남기고 테스트 수정 범위를 넓히는 유지보수 비용으로 이어질 수 있었습니다.",
          resolution: "로컬 성능지표 문서의 Fallow 사용 전/후/최종 지표를 기준으로 unused files/exports, duplication, maintainability를 추적하고 정리 우선순위를 정했습니다.",
          result: "unused files 1개와 unused exports 11개를 0으로 정리했고, 중복 코드는 1,006줄(9.4%)에서 308줄(2.9%)로 낮췄습니다. maintainability는 91.3에서 92.1로 개선됐고, deals/search/jobs 테스트와 API route hotspot을 명확히 파악해 이후 리팩터링 우선순위를 수치 기반으로 잡을 수 있게 됐습니다.",
          evidence: ["fallow 사용전 코드.md", "fallow 최종 지표.md", "portfolio-frontend-resume-content.md"],
        },
      ],
    },
    {
      title: "PhotoMap",
      subtitle: "대량 사진 데이터를 지도, 앨범, 타임라인, 노드 그래프로 탐색하는 서비스",
      period: "2025.12 - 2026.04",
      team: "3인 팀 / Frontend 담당",
      summary:
        "EXIF 위치와 촬영 시간을 기반으로 사진을 지도, 앨범, 타임라인, 관계 그래프로 탐색하는 서비스입니다. 초기 요청 병렬화, 전역 상태 분리, D3 시뮬레이션 분리, 가상화로 대량 사진에서도 화면이 버티는 구조로 정리했습니다.",

      responsibilities: [
        "EXIF 메타데이터를 읽어 사진, 위치, 시간 데이터를 화면에서 바로 쓸 수 있게 정리",
        "Zustand selector로 사진, 필터, 선택 상태를 분리하고 전역 리렌더링 범위를 축소",
        "대량 사진 구간을 row 가상화로 바꾸고 D3 tick 업데이트를 React state 밖으로 분리",
        "지도, 앨범, 타임라인, 관계 그래프 화면을 같은 데이터 흐름으로 연결",
        "Supabase 데이터 연동과 Unity WebGL 지도 화면 통합",
        "cobe 기반 canvas globe와 Unity WebGL iframe/postMessage 흐름의 렌더링 수명 주기 분리",
        "BE 2명과 데이터 흐름을 맞추며 FE 상태 구조와 렌더링 책임 분리",
      ],
      tech: ["React", "TypeScript", "Zustand", "Supabase", "D3.js", "@tanstack/react-virtual", "Unity WebGL", "Canvas", "cobe"],
      links: {
        live: "https://photomap-three.vercel.app/",
        github: "https://github.com/sabin1108/Photomap",
      },
      imageGallery: {
        main: { src: "/2_project/photoproject_1.png", alt: "PhotoMap 메인 화면" },
        supporting: [
          { src: "/2_project/photoproject_2.png", alt: "PhotoMap 사진 탐색 화면" },
          { src: "/2_project/photoproject_3.png", alt: "PhotoMap 앨범 또는 보조 화면" },
          { src: "/2_project/photoproject_4.gif", alt: "PhotoMap 인터랙션 GIF" },
        ],
      },
      metrics: [],
      metricRows: [
        { category: "Lighthouse / 전송", metric: "Performance", before: "50점", after: "77점", basis: "2026-07-14-nexon-webgl-transform-lighthouse-analysis.md" },
        { category: "Lighthouse / 전송", metric: "LCP", before: "63,804ms", after: "4,150ms", basis: "Lighthouse / Supabase image transform 적용 전후" },
        { category: "Lighthouse / 전송", metric: "초기 payload", before: "12,586KiB", after: "381KiB", basis: "Lighthouse / image delivery audit" },
        { category: "React Profiler", metric: "상태 변경 범위", before: "70여 개", after: "5개 이하", basis: "React Profiler / PhotoMap 포트폴리오 콘텐츠.md" },
        { category: "React Profiler", metric: "커밋 시간", before: "9.7ms", after: "6.2ms", basis: "React Profiler / PhotoMap 포트폴리오 콘텐츠.md" },
        { category: "React Profiler", metric: "UI 렌더 폭주", before: "16,030회", after: "불필요 렌더 제거", basis: "React Profiler / performance_optimization_final_report.md" },
        { category: "대량 UI / D3", metric: "D3 NodeView", before: "370회", after: "25회", basis: "React Profiler / performance_optimization_final_report.md" },
        { category: "대량 UI / D3", metric: "Framer Motion", before: "2,142회", after: "0회", basis: "React Profiler / performance_optimization_final_report.md" },
        { category: "대량 UI / D3", metric: "사진 스크롤", before: "프리징 발생", after: "프레임 저하 완화", basis: "PerformanceMonitor / PhotoMap 포트폴리오 콘텐츠.md" },
        { category: "WebGL / canvas", metric: "GlobeView Commit", before: "69.9ms", after: "26.6ms", basis: "React Profiler / performance_optimization_final_report.md" },
        { category: "WebGL / canvas", metric: "Frame probe", before: "측정 없음", after: "frame budget 기록", basis: "issue-nexon-webgl-after-dev-frame-budget.json" },
      ],
      architecture: {
        title: "브라우저에서 사진을 탐색하는 흐름",
        description: "",
        columns: [],
        flow: [],
      },
      caseStudies: [
        {
          title: "WebGL 지도와 canvas globe 렌더링 수명 주기 분리",
          issue: "지도 화면에서는 React UI, Mapbox, Unity WebGL iframe, cobe canvas globe가 함께 동작해, 화면 전환이나 필터 변경 때 렌더링 책임이 섞이면 WebGL 런타임과 React 상태가 서로 영향을 주는 문제가 생길 수 있었습니다.",
          cause: "WebGL 기반 화면은 React 컴포넌트처럼 렌더마다 새로 계산되면 비용이 크고, iframe 내부 Unity 런타임이나 canvas renderer는 별도 수명 주기를 가집니다. React 상태 변경을 그대로 WebGL 렌더링 루프와 연결하면 지도 마커, 사진 데이터, globe marker 갱신이 한 흐름에 묶이고, 언마운트 후에도 이벤트 리스너나 렌더러 인스턴스가 남을 위험이 있었습니다.",
          resolution: "Unity WebGL 지도는 iframe으로 분리하고 postMessage/SendMessage로 필요한 사진·위치 데이터만 전달했습니다. cobe 기반 GlobeView는 idle mount, marker memoization, contain: layout paint size, globe.destroy() cleanup으로 canvas 렌더러의 영향 범위와 수명 주기를 명확히 했습니다. frame budget probe를 추가해 canvas 렌더링 비용을 React commit 비용과 따로 기록할 수 있게 했습니다.",
          result: "React 상태 변경과 WebGL/canvas 렌더링 책임을 분리해 지도·글로브 화면을 별도 런타임처럼 관리할 수 있게 됐습니다. 화면 전환 시 renderer cleanup 경로가 생겼고, WebGL 보조 뷰는 React 전체 리렌더링 최적화와 별개로 샘플링·레이아웃 격리·메시지 브릿지를 기준으로 성능 병목을 설명할 수 있게 됐습니다. frame budget 기록도 생겨 이후 WebGL/canvas FPS 개선 작업을 같은 기준으로 비교할 수 있게 됐습니다.",
          evidence: ["Map2DView.tsx", "public/unity-map/mapbox.html", "GlobeView.tsx", "issue-nexon-webgl-after-dev-frame-budget.json"],
        },
        {
          title: "이미지 전송량 병목을 Supabase transform으로 축소",
          issue: "public home의 사진 preview 카드가 원본 1920px급 이미지를 그대로 요청하면서, WebGL/canvas 최적화와 무관하게 Lighthouse LCP와 전체 payload가 이미지 전송량에 묶이는 병목을 발견했습니다.",
          cause: "카드 영역에는 작은 preview만 필요했지만 브라우저는 큰 원본 이미지를 내려받고 있었습니다. 이 구조에서는 React 렌더링이나 canvas mount를 조정해도 네트워크 payload와 LCP resource 비용이 먼저 점수를 깎고, 사용자는 첫 화면에서 이미지 다운로드가 끝날 때까지 긴 대기 시간을 경험합니다.",
          resolution: "Supabase Storage image transform fallback을 만들어 카드 preview는 320px급 URL을 우선 사용하게 했고, 상단 카드만 eager/high priority로 두고 나머지는 lazy/async로 낮췄습니다. Lighthouse raw JSON을 before/after로 저장하고 분석 문서를 `E:\\memory\\photomap\\characteristic`에 남겼습니다.",
          result: "Lighthouse Performance score는 50점에서 77점으로 올랐고, LCP는 63,804ms에서 4,150ms로 낮아졌으며, 초기 payload는 12,586KiB에서 381KiB로 줄었습니다. 병목이 React micro-optimization이 아니라 이미지 전송 경로에 있음을 지표로 분리해 설명할 수 있게 됐습니다.",
          evidence: ["imageUrl.ts", "PhotoFeed.tsx", "2026-07-14-nexon-webgl-transform-lighthouse-analysis.md"],
        },
        {
          title: "가상화와 메모이제이션으로 5,000장 부하 방어",
          issue: "부하 테스트로 사진 수를 늘리며 확인한 결과 5,000장 구간에서 첫 mount가 1.13초까지 늘고, 10,000장 기준 DOM 노드가 약 40,000개까지 증가해 스크롤이 사실상 멈추는 문제를 발견했습니다.",
          cause: "기존 구조는 `filteredAlbums.map()`처럼 전체 목록을 기준으로 카드를 DOM에 유지했습니다. 화면에 보이지 않는 카드도 이미지 로딩, hover/transition, motion 진입 애니메이션 비용을 계속 갖고 있었고, 가상화 중 요소가 재생성될 때 애니메이션도 반복됐습니다. 사진 수가 늘어날수록 DOM 노드, 이미지 요소, 애니메이션 계산이 선형으로 증가해 스크롤 FPS와 메모리 사용량이 함께 악화됐습니다.",
          resolution: "row 가상화로 보이는 구간만 DOM에 두고, 불필요한 motion 연산은 CSS 전환으로 바꾸며 이미지 카드를 메모이제이션했습니다.",
          result: "row 가상화 적용 후 10,000장 기준 DOM을 약 200개 수준으로 유지할 수 있게 되어 대량 사진에서도 브라우저가 감당해야 하는 노드 수가 고정됐습니다. 5,000장 first mount 지연은 1.13초 수준의 화면 멈춤에서 1프레임 단위 렌더링을 목표로 하는 구조로 바뀌었고, motion 기반 반복 애니메이션 비용도 제거했습니다.",
          evidence: ["virtualization_changes.md", "performance_optimization_final_report.md"],
        },
        {
          title: "Context API 전역 리렌더링을 Zustand selector로 축소",
          issue: "React Profiler 확인 중 즐겨찾기, 태그, 업로드 입력처럼 작은 상태 변경만으로 지도, 앨범, 타임라인, 업로드 화면까지 넓게 다시 그려지는 전역 리렌더링 문제를 발견했습니다.",
          cause: "사진 목록, 선택 사진, 필터, 즐겨찾기, 업로드 입력 상태가 큰 context value나 새 객체를 반환하는 selector에 묶여 있었습니다. React Context는 value 참조가 바뀌면 구독 하위 트리를 넓게 다시 평가하고, selector가 매번 새 배열/객체를 반환하면 얕은 비교도 실패합니다. 그 결과 실제로는 한 사진의 제목이나 즐겨찾기만 바뀌어도 관련 없는 지도, 앨범, 타임라인이 렌더링 후보가 됐습니다.",
          resolution: "상태를 store로 분리하고 `useShallow` selector로 필요한 slice만 구독하게 바꿔, 화면별 반응 범위를 잘라냈습니다.",
          result: "상태 변경이 관련 화면 안에서 끝나도록 구독 범위가 좁아졌고, 즐겨찾기나 태그 변경이 지도, 앨범, 타임라인 전체를 다시 그리는 흐름을 줄였습니다. store slice와 `useShallow` selector를 기준으로 렌더링 책임이 분리되어 이후 기능 추가 시에도 상태 변경의 영향 범위를 더 예측하기 쉬워졌습니다.",
          evidence: ["frontend_technical_architecture.md", "performance_optimization_final_report.md"],
        },
        {
          title: "D3 tick 업데이트를 React state에서 분리",
          issue: "NodeView에서 마우스를 움직이거나 zoom을 조작할 때마다 좌표 변경이 React state로 올라가 전체 SVG 트리가 다시 계산되고, React Profiler 기준 D3 NodeView 렌더링이 370회까지 증가하는 병목을 발견했습니다.",
          cause: "D3 force simulation의 tick 좌표와 zoom/mouse 이벤트는 초당 여러 번 갱신됩니다. 이 좌표를 React state에 올리면 tick마다 reconciliation과 SVG diff가 발생하고, 노드 위치처럼 DOM 속성만 바꿔도 되는 작업이 React 렌더링 루프에 포함됩니다. 마우스 이동, zoom, force tick이 한꺼번에 누적되면서 그래프 이동이 끊기고 전체 SVG가 흔들리는 증상이 나타났습니다.",
          resolution: "시뮬레이션은 custom hook으로 분리하고, tick에서는 ref와 DOM 속성을 직접 갱신해 React는 구조 변경에만 집중하게 했습니다.",
          result: "노드 그래프 상호작용이 React 렌더링 루프에서 분리되어 마우스 이동과 zoom 중에도 SVG 전체가 반복 계산되는 현상이 줄었습니다. React Profiler 기준 D3 NodeView 렌더링 수는 370회에서 25회로 낮아졌고, 좌표 갱신은 ref와 DOM 속성 변경으로 처리해 그래프 조작이 더 안정적으로 보이게 됐습니다.",
          evidence: ["frontend_technical_architecture.md", "performance_optimization_final_report.md"],
        },
        {
          title: "초기 데이터 요청을 병렬화해 진입 지연 완화",
          issue: "초기 진입 흐름을 확인하던 중 카테고리, 사진 목록, 사용자 상태 요청이 순서대로 실행되어 지도와 앨범 화면이 필요한 데이터 일부를 갖고도 렌더링을 기다리는 지연 문제를 발견했습니다.",
          cause: "초기 화면에서 필요한 사진 목록, 카테고리, 사용자 상태 요청은 서로 의존성이 낮았는데도 같은 초기화 함수 안에서 순차적으로 `await` 처리됐습니다. 이 구조에서는 앞 요청이 끝나기 전까지 다음 요청이 시작되지 않아 network waterfall이 생깁니다. 또한 지도와 앨범처럼 일부 데이터만 먼저 있어도 skeleton이나 부분 렌더링이 가능한 화면까지 모든 응답 완료를 기다리게 되어 체감 진입 시간이 길어졌습니다.",
          resolution: "초기화 단계에서 `Promise.all`로 묶어 동시에 요청하고, 공통 상태는 먼저 store에 적재한 뒤 화면은 준비되는 즉시 그리도록 정리했습니다.",
          result: "초기 진입 시 서로 독립적인 요청이 동시에 시작되도록 바뀌어 network waterfall이 줄었고, 사진 목록과 앨범/지도에 필요한 공통 상태를 먼저 채울 수 있게 됐습니다. 사용자는 모든 데이터 응답이 끝날 때까지 빈 화면을 보는 대신 준비된 화면부터 확인할 수 있는 흐름으로 개선됐습니다.",
          evidence: ["performance_optimization_final_report.md", "frontend_technical_architecture.md"],
        },

        {
          title: "백엔드 데이터 흐름과 FE 상태 경계 정리",
          issue: "3인 협업에서 백엔드가 제공하는 사진·위치·카테고리 데이터를 여러 화면이 동시에 사용하면서, 화면별 상태 처리 방식이 달라지면 팀 전체 수정 범위가 커질 수 있는 문제가 있었습니다.",
          cause: "사진 목록, 위치, 카테고리, 즐겨찾기 상태는 백엔드 데이터 구조와 프론트엔드 화면 요구가 만나는 지점입니다. 이 데이터를 각 화면에서 제각각 가공하면 백엔드 응답이나 필드 의미가 바뀔 때 지도, 앨범, 타임라인, 노드 그래프를 모두 확인해야 하고, 성능 병목 원인도 데이터 문제인지 렌더링 문제인지 구분하기 어려워집니다.",
          resolution: "서버 데이터 흐름은 유지한 채 FE store와 selector를 기준으로 화면별 구독 범위를 나누고, 대량 렌더링과 D3 시뮬레이션은 프론트엔드 내부 책임으로 분리했습니다.",
          result: "백엔드 데이터 구조 변경 없이 프론트엔드 병목을 줄일 수 있었고, 팀원이 제공한 데이터 계약을 유지하면서도 화면 성능 문제를 FE 레이어에서 해결했습니다. 이후 기능 추가 시에도 데이터 계약과 렌더링 책임을 분리해 논의할 수 있는 기준이 생겨, 팀 안에서 병목 원인과 수정 범위를 더 빠르게 공유할 수 있었습니다.",
          evidence: ["usePhotoStore.ts", "PhotoFeed.tsx", "useForceSimulation.ts", "frontend_technical_architecture.md"],
        },
      ],
    },
    {
      title: "AI ChatBot",
      subtitle: "학교 정보를 묻고 확인하는 Next.js 챗봇 UI",
      period: "2025.09 - 2025.11",
      team: "2인 팀 / Frontend 담당",
      summary:
        "학식, 공지, 학사 일정 같은 학교 정보를 대화형 UI에서 확인하는 졸업 프로젝트입니다. 핵심 과제는 외부 백엔드 응답을 읽기 쉬운 메시지로 바꾸고, 로그인 없는 구조에서 채팅 기록 저장과 내보내기를 클라이언트 중심으로 처리하는 것이었습니다.",
      responsibilities: [
        "채팅 UI, 사이드바, 캘린더, 가이드 화면 구현",
        "ReactMarkdown 기반 메시지 렌더링과 긴 URL/비정형 응답 표시 개선",
        "Next.js API route로 외부 백엔드 호출 경계 분리",
        "localStorage 기반 대화 내역 저장, 복원, 탭 동기화 처리",
        "Blob API를 활용한 대화 내역 txt 내보내기 구현",
        "BE 담당자와 API 응답 경계를 맞추고 채팅 UI용 메시지 구조 정리",
      ],
      tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
      links: { github: "https://github.com/sabin1108/graduation-project" },
      imageGallery: {
        main: { src: "/3_project/aichat_1.png", alt: "AI ChatBot 메인 화면" },
        supporting: [
          { src: "/3_project/aichat_2.png", alt: "AI ChatBot 채팅 화면" },
          { src: "/3_project/aichat_3.png", alt: "AI ChatBot 보조 화면" },
          { src: "/3_project/aichat_4.gif", alt: "AI ChatBot 인터랙션 GIF" },
        ],
      },
      metrics: [],
      architecture: {
        title: "챗봇 UI와 외부 백엔드 경계 분리 구조",
        description:
          "메시지 렌더링, 로컬 저장, 파일 내보내기, 외부 API 호출을 각각 분리해 UI 컴포넌트가 백엔드 응답 포맷에 직접 묶이지 않게 했습니다.",
        columns: [
          { title: "Client UI", nodes: [{ label: "Chat Interface", detail: "질문 입력, 메시지 목록, 자동 스크롤" }, { label: "Sidebar / Calendar", detail: "새 채팅, 빠른 링크, 학사 일정" }] },
          { title: "Client Logic", nodes: [{ label: "ReactMarkdown", detail: "링크, 목록, markdown 응답 렌더링" }, { label: "useChatHistory", detail: "채팅 목록/활성 채팅 관리" }, { label: "Blob Export", detail: "대화 내역 txt 다운로드" }] },
          { title: "Next.js Boundary", nodes: [{ label: "API Routes Proxy", detail: "/api/chat, /api/notice" }, { label: "getNotice action", detail: "공지/식단 데이터를 UI용으로 전달" }] },
          { title: "External Backend", nodes: [{ label: "Spring/API Server", detail: "팀 백엔드 영역" }, { label: "Crawler / DB / AI", detail: "README 기준 백엔드 구성" }] },
        ],
        flow: [
          "사용자가 채팅 UI에서 질문을 입력합니다.",
          "Client는 내부 Next.js API route를 호출하고, route가 외부 백엔드 API로 전달합니다.",
          "응답은 ReactMarkdown으로 렌더링되고, 채팅 기록은 localStorage에 저장되며 Blob으로 내보낼 수 있습니다.",
        ],
      },
      caseStudies: [
        {
          title: "학식 접근성 문제에서 웹 챗봇 방향으로 전환",
          issue: "초기 논의에서 학식 확인 흐름이 앱, 식단 메뉴, 홈페이지로 나뉘어 있어 사용자가 원하는 정보를 확인하기까지 여러 단계를 거쳐야 하는 문제가 드러났습니다. 카카오톡 챗봇은 접근성이 높지만 전시와 기능 확장에는 한계가 있었고, 웹페이지형 챗봇은 UI 완성도와 기능 확장에 유리했습니다.",
          cause: "교내 정보는 학식, 학사 일정, 장학 공지, 일반 공지처럼 출처와 사용 방식이 달랐고, 초기 조사 과정에서 중앙 제공 Open API 여부도 명확하지 않았습니다. 단순히 학식만 답하는 챗봇이면 접근성은 높지만 프로젝트 완성도와 전시 설명력이 약해질 수 있었고, 여러 정보를 다루려면 사용자가 어떤 질문을 어떻게 입력해야 하는지 안내하는 UI가 필요했습니다.",
          resolution: "카카오톡 챗봇과 웹페이지형 챗봇을 비교한 뒤, 전시 가능성과 기능 확장성을 고려해 웹 기반 챗봇 UI로 방향을 잡았습니다. 학사 일정, 학식 메뉴, 빠른 링크, 월/날짜 기반 공지 조회 예시를 사용 안내에 정리하고, 프론트엔드는 사용자가 질문 흐름을 이해할 수 있는 채팅 UI와 보조 화면을 구성했습니다.",
          result: "학식 앱에서 여러 단계를 거치던 문제를 채팅 흐름으로 줄이는 방향을 잡았고, 학식뿐 아니라 학사 일정, 공지, 빠른 링크까지 포함하는 학교 정보 접근성 개선 서비스로 확장했습니다.",
          evidence: ["Talk_2025.12.10 20_53-1.txt", "enhanced-chat-interface.tsx", "학교 정보 접근성 향상을 위한 대화형 질의응답 시스템.pdf"],
        },
        {
          title: "긴 URL과 비정형 응답으로 인한 모바일 UI 깨짐 완화",
          issue: "실제 학교 공지/학식/일정 응답을 채팅 말풍선에 넣어보면서 긴 URL과 줄바꿈 없는 비정형 텍스트가 모바일 viewport를 밀어내고, 핵심 정보가 한 덩어리로 보여 가독성이 떨어지는 문제를 발견했습니다.",
          cause: "외부 API의 AI 응답은 JSON처럼 일정한 구조가 아니라 일반 문장, 긴 URL, 날짜, 목록, markdown 비슷한 텍스트가 섞여 들어왔습니다. 단순 문자열로 출력하면 브라우저가 긴 URL을 적절히 줄바꿈하지 못하고, 학식/공지 데이터가 줄바꿈 없이 붙어 사용자가 날짜와 링크를 구분하기 어려웠습니다. 포트폴리오 자료 기준 URL 텍스트 노출을 줄여야 할 정도로 시각적 노이즈가 컸습니다.",
          resolution: "ReactMarkdown과 remark-gfm을 사용해 메시지를 렌더링하고, URL은 markdown link 형태로 변환했습니다. 링크 요소에는 줄바꿈 가능한 스타일을 적용했습니다.",
          result: "공지 링크와 긴 답변을 채팅 말풍선 안에서 읽기 쉬운 문단과 링크 형태로 보여줄 수 있게 됐습니다. 긴 URL 텍스트 노출을 줄이고 날짜/목록 구조를 살리면서 모바일 viewport에서 가로 스크롤이나 말풍선 깨짐이 줄었고, 사용자가 필요한 공지 링크와 핵심 정보를 더 빠르게 찾을 수 있게 됐습니다.",
          evidence: ["enhanced-chat-interface.tsx", "ReactMarkdown", "commit b43617a"],
        },
        {
          title: "외부 API 응답 처리 로직을 UI에서 분리",
          issue: "채팅, 공지, 식단 API를 연결하면서 외부 백엔드 응답이 JSON과 비정형 텍스트를 혼용하고 날짜 필드명도 달라, split/regex/예외 처리가 UI 컴포넌트 안으로 번지는 문제를 발견했습니다.",
          cause: "채팅 UI가 백엔드 endpoint, notice category, 날짜 필드명, 응답 전처리 방식을 직접 알면 화면 컴포넌트가 데이터 호출과 표시 책임을 동시에 갖게 됩니다. 외부 API가 새 응답 형식을 추가하거나 필드명을 바꾸면 입력 폼, 메시지 목록, 공지 표시 컴포넌트까지 수정 범위가 퍼지고, 화면별 문자열 처리 로직이 중복될 수 있었습니다.",
          resolution: "Next.js API Routes를 proxy layer로 두고, chat route와 notice route에서 외부 API 호출을 담당하게 했습니다. UI는 내부 route와 action만 호출합니다.",
          result: "외부 API 경계가 Next.js route 파일로 모이면서 UI 컴포넌트의 책임이 메시지 표시와 사용자 상호작용으로 줄었습니다. 백엔드 endpoint나 날짜 필드명, 응답 포맷이 바뀌어도 proxy layer에서 먼저 흡수할 수 있어 채팅 입력, 메시지 목록, 공지 표시 컴포넌트의 수정 범위가 작아졌습니다.",
          evidence: ["app/api/chat/route.ts", "app/api/notice/route.ts", "app/actions/get-notice.ts"],
        },
        {
          title: "로그인 없는 로컬 채팅 기록 저장과 탭 동기화",
          issue: "로그인 없이 사용하는 구조에서 새로고침하면 대화가 사라질 수 있고, 여러 탭을 열어 한쪽에서 채팅을 추가/삭제했을 때 다른 탭의 채팅 목록과 활성 대화가 어긋나는 상태 불일치 문제를 발견했습니다.",
          cause: "로그인 없이 서버 DB를 쓰지 않으면 채팅 기록은 브라우저 localStorage에만 남습니다. localStorage 자체는 탭 사이에 공유되지만 각 탭의 React state는 독립적으로 유지되므로, 한 탭에서 채팅을 추가하거나 삭제해도 다른 탭은 기존 메모리 상태를 계속 보여줍니다. storage 이벤트를 구독하지 않으면 저장소와 화면 상태가 새로고침 전까지 어긋날 수 있었습니다.",
          resolution: "useLocalStorage hook에서 localStorage 읽기/쓰기를 감싸고, storage 이벤트를 구독해 다른 탭의 변경을 현재 탭 상태에 반영했습니다.",
          result: "대화 기록 전용 서버 저장 없이도 새로고침 후 채팅 목록과 활성 채팅을 복원할 수 있게 됐고, storage 이벤트를 통해 다른 탭의 변경을 현재 탭 상태에 반영했습니다. 로그인 없는 구조를 유지하면서도 사용자가 여러 탭을 열었을 때 대화 목록이 어긋나는 위험을 줄였습니다.",
          evidence: ["use-chat-history.ts", "use-local-storage.ts", "storage event"],
        },
        {
          title: "대화 내역 내보내기 시 서버 재전송 방지",
          issue: "대화 내역 내보내기 기능을 설계하면서 이미 브라우저에 있는 사용자 대화를 txt 파일 생성을 위해 서버로 다시 보내면 불필요한 개인정보 노출 경로와 서버 저장 책임이 생기는 문제를 발견했습니다.",
          cause: "대화 내용은 이미 브라우저 메모리와 localStorage에 존재하는 사용자 데이터입니다. 단순 txt 파일 생성을 위해 이를 서버로 전송하면 개인정보가 네트워크를 한 번 더 지나가고, 서버 로그/저장 여부/삭제 책임까지 고려해야 합니다. 로그인 없는 가벼운 챗봇 UX라는 기능 성격에 비해 데이터 흐름과 관리 부담이 과해지는 구조였습니다.",
          resolution: "브라우저 Blob API와 URL.createObjectURL을 사용해 클라이언트 메모리에서 txt 파일을 만들고, 다운로드 후 revokeObjectURL로 URL을 해제했습니다.",
          result: "대화 내역 내보내기 흐름은 서버 저장/재전송 없이 브라우저 메모리에서 처리했습니다. Blob과 URL.createObjectURL로 txt 파일을 만들고 다운로드 후 revokeObjectURL로 해제해, 백엔드 인프라와 별개로 프론트엔드 담당 범위의 대화 파일 생성 과정에서 추가 저장 서버나 삭제 정책이 필요하지 않게 했습니다.",
          evidence: ["enhanced-chat-interface.tsx", "Blob", "URL.createObjectURL", "URL.revokeObjectURL"],
        },
        {
          title: "FE-BE 응답 경계를 정리한 협업 구조",
          issue: "2인 협업에서 백엔드가 공지·식단·일정 데이터를 수집하고, 프론트엔드는 이를 채팅 UI로 보여줘야 했습니다. 응답 형식 차이를 UI 컴포넌트가 직접 처리하면 FE와 BE 변경이 서로 강하게 묶이는 문제가 있었습니다.",
          cause: "백엔드 응답은 기능별로 JSON, 텍스트, 날짜·링크 구조가 달랐고, AI 응답까지 섞이면서 화면 컴포넌트가 endpoint와 응답 포맷을 모두 알아야 하는 형태가 되기 쉬웠습니다. 이 상태에서는 BE 응답 필드가 바뀔 때 채팅 입력, 메시지 렌더링, 공지 표시를 함께 고쳐야 합니다.",
          resolution: "Next.js API Routes를 FE-BE 경계로 두고, 프론트엔드는 내부 route와 메시지 구조만 바라보게 했습니다. 긴 URL, 날짜, 목록, 공지 링크 정리는 채팅 UI 표시 규칙으로 분리했습니다.",
          result: "백엔드 담당자는 데이터 수집과 응답 제공에 집중하고, 프론트엔드는 사용자 대화 흐름과 표시 안정성에 집중할 수 있었습니다. 응답 포맷 차이를 경계 계층에서 흡수해 팀 내 수정 지점을 명확히 나눴고, 경진대회 발표와 논문 산출물까지 이어지는 사용자 흐름을 안정적으로 완성했습니다.",
          evidence: ["app/api/chat/route.ts", "app/api/notice/route.ts", "enhanced-chat-interface.tsx", "학교 정보 접근성 향상을 위한 대화형 질의응답 시스템.pdf"],
        },
      ],
    },
  ] satisfies Project[],
  activities: [
    { date: "2025.04", title: "BRIGHT MAKERS EXPO 캡스톤디자인 경진대회", description: "AI ChatBot 프로젝트로 학교 정보 접근성 개선 서비스를 발표했습니다." },
    { date: "2025.06", title: "학교 정보 접근성 향상을 위한 대화형 질의응답 시스템", description: "학교 공지, 학식, 학사 일정 정보를 질의응답 흐름으로 연결한 졸업 프로젝트 기반 논문입니다.", pdf: { label: "논문 PDF", href: "/files/thesis/interactive-campus-qa-system.pdf" } },
    { date: "2026.05", title: "생성형 AI 기반 포트폴리오 요약 플랫폼", description: "지원자의 프로젝트 자료를 생성형 AI로 요약하고 평가자가 핵심 역량과 근거를 빠르게 확인하도록 돕는 플랫폼 논문입니다.", pdf: { label: "논문 PDF", href: "/files/thesis/generative-ai-portfolio-summary-platform.pdf" } },
    { date: "2025.09.12", title: "정보처리기사", description: "한국산업인력공단 주관 국가기술자격을 취득했습니다." },
  ] satisfies Activity[],
  education: {
    school: "한경국립대학교",
    degree: "소프트웨어융합학과",
    status: "졸업",
    period: "2020.03 - 2026.02",
    gpa: "3.87 / 4.5",
    certificates: [{ name: "정보처리기사", issuer: "한국산업인력공단", date: "2025.09.12" }],
  },
} as const;
