import { resumeFrontendData } from "./resume_frontend";

const projects = new Map(
  resumeFrontendData.projectHighlights.map((project) => [project.title, project]),
);
const photoMap = projects.get("PhotoMap");
const gameInfo = projects.get("Game Information Platform");

if (!photoMap || !gameInfo) {
  throw new Error("WACUS resume requires PhotoMap and Game Information Platform.");
}

export const resumeWacusData = {
  ...resumeFrontendData,
  summary: [
    "React·Next.js로 반응형 화면과 동적인 인터랙션을 구현하고, WebGL·canvas와 대량 이미지가 함께 동작하는 환경을 최적화해온 프론트엔드 개발자 민사빈입니다.",
    "PhotoMap에서는 Mapbox 지도, Unity WebGL iframe, cobe canvas globe, D3 관계 그래프를 React UI에 통합했습니다. Zustand selector·가상화·이미지 우선순위 분리로 렌더링과 전송 병목을 줄였고, 고정 mobile-mid 4G 조건에서 optimized cold 100회를 실행해 lab LCP p75 2.5초와 첫 사진 p95 2.6초를 기록했습니다.",
    "개인 Next.js 서비스에서는 검색·할인·상세·관심 목록을 구현하고 외부 API 차이와 장애를 화면 밖에서 처리했습니다. AI는 인터랙션과 성능 문제의 코드 경로 조사, 실패 테스트, 측정 자동화에 활용하고 결과는 브라우저 측정값과 테스트로 검증했습니다.",
  ].join("\n\n"),
  coreSkills: [
    { title: "Frontend", items: ["React.js", "Next.js", "TypeScript", "JavaScript", "HTML5"] },
    { title: "UI & Styling", items: ["CSS3", "Tailwind CSS", "Responsive UI", "Shadcn UI"] },
    { title: "Interaction", items: ["Unity WebGL", "Canvas", "D3.js", "Mapbox", "cobe"] },
    { title: "State & Data", items: ["Zustand", "Supabase", "REST API", "Adapter / Normalizer"] },
    { title: "Performance & Test", items: ["React Profiler", "Lighthouse", "Vitest", "Playwright", "Virtualization"] },
    { title: "AI 활용", items: ["코드 경로 조사", "성능 가설", "실패 테스트", "측정 자동화", "근거 검토"] },
  ],
  projectHighlights: [
    {
      ...photoMap,
      description: "위치·시간 기반 사진을 Mapbox 지도, 앨범, 타임라인, Unity WebGL·canvas·D3 인터랙션으로 탐색하는 반응형 웹 서비스",
      keyRoles: "React UI·Mapbox·Unity WebGL·canvas 통합 / 반응형 인터랙션 / 렌더링 수명 주기 분리 / 이미지·상태 성능 최적화 / 100회 모바일 검증",
      issues: [
        "React UI, Mapbox, Unity WebGL iframe, cobe canvas globe, D3 관계 그래프가 한 화면 흐름에서 동작해 상태 변경과 화면 전환 때 렌더링 책임이 섞일 위험이 있었습니다.",
        "5,000건 이상의 고해상도 사진을 탐색할 때 전체 DOM, 이미지 요청, hover·transition 비용이 함께 늘어 스크롤과 첫 화면 반응이 느려졌습니다.",
        "모바일 첫 사진 지연이 React, DB, 이미지 전송 중 어디서 발생하는지 구분되지 않아 반복 가능한 조건과 완료 기준이 필요했습니다.",
      ],
      resolutions: [
        "Unity WebGL은 iframe과 postMessage로 필요한 위치 데이터만 전달하고, cobe globe는 idle mount·marker memoization·contain·destroy cleanup으로 React와 별도 수명 주기로 관리했습니다.",
        "Zustand selector와 useShallow로 화면별 구독 범위를 나누고, 가상화로 보이는 구간만 DOM에 유지했습니다. D3 tick 좌표는 ref와 DOM 속성으로 갱신했습니다.",
        "480px thumbnail·1600px display WebP를 생성하고 첫 이미지 후보 하나만 high priority로 두어 목록·모달의 이미지 용도와 로딩 순서를 분리했습니다.",
        "390×844, DPR 2, CPU 4배 slowdown, RTT 150ms, 1.6Mbps 조건을 고정하고 매회 fresh Chromium context로 optimized cold 100회를 실행했습니다.",
      ],
      achievements: [
        "lab LCP p75를 17.4초에서 2.5초로 85.6%, 첫 사진 p95를 17.6초에서 2.6초로 85.2% 단축했습니다. baseline cold 30회와 optimized cold 100회를 같은 조건에서 비교했습니다.",
        "CDP 관측 전송량을 run당 3,125KB에서 328KB로 89.5% 줄였습니다.",
        "상태 변경 리렌더링 범위를 70여 개 컴포넌트에서 5개 이하로 줄이고 React Profiler commit 시간을 9.7ms에서 6.2ms로 낮췄습니다.",
        "D3 NodeView 렌더링을 370회에서 25회로 93.2% 줄여 그래프 상호작용을 React 렌더링 루프에서 분리했습니다.",
      ],
    },
    {
      ...gameInfo,
      keyRoles: "Next.js 반응형 서비스 전체 구현 / 검색·할인·상세·관심 목록 UI / 공통 UI 계약 / 외부 API 정규화 / 테스트·배포·유지보수",
      issues: [
        "검색, 할인, 상세, 관심 목록처럼 반복되는 화면에서 외부 API별 응답 차이가 카드 UI와 상태 표시로 새면 화면 추가와 수정 비용이 커질 수 있었습니다.",
        "웹에이전시 업무처럼 여러 화면을 빠르게 구축·수정해야 하는 상황에서는 HTML/CSS/React 구현뿐 아니라 로딩, 빈 결과, 오류 상태가 같은 기준으로 보여야 했습니다.",
      ],
      resolutions: [
        "Next.js 화면과 API route 경계를 나누고 Steam, Epic, ITAD 응답을 공통 view model로 정규화해 카드, 상세, 관심 목록이 같은 props 계약을 사용하게 했습니다.",
        "loading, empty, stale cache, rate limit, error 상태를 화면 상태로 분리하고 role, label, status 기준 테스트로 사용자가 보는 문구와 흐름을 확인했습니다.",
        "Git 기반으로 typecheck, lint, Vitest, production build, Playwright smoke를 확인하며 변경 후 깨지는 화면을 줄였습니다.",
      ],
      achievements: [
        "반복 화면의 API별 분기를 줄여 신규 화면이나 클라이언트 수정 때 확인 범위를 normalizer와 공통 UI 상태로 좁혔습니다.",
        "Vitest, Testing Library, Playwright로 가격 판단, 캐시, 오류 상태, 관심 목록 흐름을 검증했습니다.",
        "Fallow 분석으로 미사용 export 11개를 0개로, 중복 코드 비율을 9.4%에서 2.9%로 줄였습니다.",
      ],
    },  ],
  motivation: `WACUS 공고의 React·Next.js 기반 웹 UI, 동적인 인터랙션, 반응형 퍼블리싱, WebGL 경험 우대 항목은 제가 가장 구체적인 결과를 만든 PhotoMap과 맞닿아 있습니다. PhotoMap에서 위치 기반 사진을 Mapbox 지도와 연결하고 Unity WebGL iframe, cobe canvas globe, D3 관계 그래프를 React 화면 안에 통합했습니다. 단순히 시각 요소를 붙이는 데서 끝내지 않고 postMessage 경계, idle mount, cleanup, 상태 구독 범위를 나눠 여러 렌더링 계층이 서로의 성능을 침범하지 않게 했습니다.

사용자가 실제로 보는 결과도 반복 검증했습니다. 작은 카드와 상세 화면이 같은 원본 이미지를 요청하던 구조를 thumbnail·display WebP로 나누고 첫 이미지 후보 하나만 높은 우선순위로 처리했습니다. 고정된 모바일 기기·4G·CPU 조건에서 optimized cold 100회를 실행해 lab LCP p75 2.5초, 첫 사진 p95 2.6초, 첫 사진과 모달 100/100 성공을 기록했습니다. AI는 이미지 경로 조사, 가설 수립, 실패 테스트와 Playwright runner 구현을 보조했고, 측정 오류가 발견된 결과는 폐기한 뒤 전 구간을 다시 실행했습니다.

WACUS에서도 시안을 반응형 UI로 옮기는 구현력에 더해, 인터랙션이 많은 화면의 상태·렌더링·자원 로딩을 함께 설계하고 싶습니다. React·Next.js 경험과 WebGL·canvas 통합 경험을 바탕으로 신규 구축과 유지보수 모두에서 사용자가 빠르고 자연스럽게 반응을 느끼는 웹 경험을 만들겠습니다.`,
} as const;
