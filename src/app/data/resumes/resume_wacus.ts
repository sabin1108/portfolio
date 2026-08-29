import { resumeFrontendData } from "./frozen/resume_frontend";
import { resumeDailyPayData } from "./frozen/resume_dailypay";

const projects = new Map(
  resumeFrontendData.projectHighlights.map((project) => [project.title, project]),
);
const photoMap = projects.get("PhotoMap");
const dailyPayGameInfo = resumeDailyPayData.projectHighlights.find(
  (project) => project.title === "Game Information Platform",
);

if (!photoMap || !dailyPayGameInfo) {
  throw new Error("WACUS resume requires PhotoMap and Game Information Platform.");
}

export const resumeWacusData = {
  ...resumeFrontendData,
  summary: [
    "React·Next.js 기반 반응형 웹 UI를 구현하고, 이미지·렌더링·인터랙션 성능까지 함께 개선해 온 프론트엔드 개발자 민사빈입니다. 디자인 시안을 실제 서비스 화면으로 옮기는 구현력과, 배포 후 사용자가 느끼는 속도를 측정·개선하는 습관을 강점으로 가지고 있습니다.",
    "PhotoMap에서는 Mapbox 지도, Unity WebGL iframe, cobe canvas globe, D3 관계 그래프를 React 화면 안에 통합했습니다. 상태 구독 범위와 렌더링 수명주기를 분리하고 이미지 로딩 순서를 재설계해, 고정 mobile-mid 4G 조건에서 lab LCP p75를 17.4초에서 2.5초로, 첫 사진 p95를 17.6초에서 2.6초로 개선했습니다.",
    "AI는 코드 작성 대체가 아니라 문제 분해와 검증 속도를 높이는 도구로 사용했습니다. 병목 경로 조사, 성능 가설 정리, 실패 테스트, Playwright 반복 측정 하네스 구현에 활용했고, 최종 반영 여부는 원시 측정값과 테스트 결과를 기준으로 직접 판단했습니다.",
  ].join("\n\n"),
  coreSkills: [
    { title: "Frontend", items: ["React.js", "Next.js", "TypeScript", "JavaScript", "HTML5"] },
    { title: "Publishing & UI", items: ["Responsive UI", "CSS3", "Tailwind CSS", "Shadcn UI", "디자인 시안 구현"] },
    { title: "Interaction", items: ["Unity WebGL", "Canvas", "D3.js", "Mapbox", "cobe"] },
    { title: "State & Data", items: ["Zustand", "Supabase", "REST API", "Adapter / Normalizer"] },
    { title: "Quality & Delivery", items: ["Lighthouse", "React Profiler", "Vitest", "Playwright", "성능 측정", "QA 검증"] },
  ],
  projectHighlights: [
    {
      ...photoMap,
      description:
        "위치·시간 기반 사진을 지도, 앨범, 타임라인, WebGL·canvas·D3 인터랙션으로 탐색하는 반응형 웹 서비스",
      keyRoles:
        "반응형 React UI 구현 / Mapbox·Unity WebGL·canvas·D3 통합 / 상태·렌더링 수명주기 분리 / 이미지 로딩 최적화 / 모바일 성능 100회 검증",
      issues: [
        "지도, 앨범, 타임라인, WebGL, canvas, D3 그래프가 한 화면에서 함께 동작해 시각 구현뿐 아니라 상태 변경, 렌더링 책임, 자원 로딩 순서를 함께 정리해야 했습니다.",
        "고해상도 사진 목록에서 작은 카드와 상세 화면이 같은 원본 이미지를 요청해 모바일 첫 화면과 스크롤 반응성이 느려졌습니다.",
        "첫 사진 지연이 React 렌더링, DB 조회, 이미지 전송 중 어디서 발생하는지 명확하지 않아 반복 가능한 측정 조건과 완료 기준이 필요했습니다.",
      ],
      aiApproach: [
        "AI로 이미지 로딩 경로와 렌더링 병목 후보를 빠르게 조사하고, 원본 이미지 요청이 초기 네트워크 대역폭을 차지한다는 가설을 세웠습니다.",
        "실패를 재현하는 Playwright 측정 하네스와 고정 mobile-mid 4G 조건을 구성해 최적화 전후를 반복 비교했습니다.",
        "AI 제안은 바로 반영하지 않고 원시 측정값, 브라우저 오류, request failure, 테스트 결과를 확인한 뒤 채택 여부를 직접 결정했습니다.",
      ],
      resolutions: [
        "Unity WebGL은 iframe과 postMessage로 필요한 위치 데이터만 전달하고, cobe globe는 idle mount·marker memoization·contain·destroy cleanup으로 React와 별도 수명주기로 관리했습니다.",
        "Zustand selector와 useShallow로 화면별 구독 범위를 나누고, 가상화로 보이는 구간만 DOM에 유지했습니다. D3 tick 좌표는 ref와 DOM 속성으로 갱신해 React 렌더링 루프와 분리했습니다.",
        "480px thumbnail·1600px display WebP를 생성하고 첫 이미지 후보 하나만 high priority로 두어 목록·상세 화면의 이미지 용도와 로딩 순서를 분리했습니다.",
        "390x844, DPR 2, CPU 4배 slowdown, RTT 150ms, 1.6Mbps 조건을 고정하고 매회 fresh Chromium context로 optimized cold 100회를 실행했습니다.",
      ],
      achievements: [
        "지도, 앨범, 타임라인 화면을 React 컴포넌트로 나누고 props·state·event handler 흐름을 정리해 화면 전환과 사용자 조작이 예측 가능하게 동작하도록 구현했습니다.",
        "lab LCP p75를 17.4초에서 2.5초로 85.6%, 첫 사진 p95를 17.6초에서 2.6초로 85.2% 단축했습니다.",
        "CDP 관측 전송량을 run당 3,125KB에서 328KB로 89.5% 줄였습니다.",
        "상태 변경 리렌더링 범위를 70여 개 컴포넌트에서 5개 이하로 줄이고 React Profiler commit 시간을 9.7ms에서 6.2ms로 낮췄습니다.",
        "D3 NodeView 렌더링을 370회에서 25회로 93.2% 줄여 그래프 상호작용 부담을 낮췄습니다.",
      ],
    },
    {
      ...dailyPayGameInfo,
      keyRoles:
        "Next.js 서비스 구현 / 외부 API 응답 정규화 / 검색·할인·상세·관심 목록 UI / 오류·캐시·가격 규칙 테스트 / 유지보수성 개선",
      issues: [
        "Steam·Epic·ITAD 응답의 식별자, 가격, 할인율, 링크 구조가 달라 UI가 API별 예외를 직접 알게 될 위험이 있었습니다.",
        "0원·null 가격이 최저가나 목표가 달성으로 오판될 수 있었고, timeout·호출 제한이 검색·할인 화면 장애로 이어질 수 있었습니다.",
        "1인 개발에서 기능 범위, 데이터 계약, UI 상태, 테스트, 문서 검토를 함께 처리해야 해 누락을 줄이는 작업 단위와 검증 기준이 필요했습니다.",
      ],
      aiApproach: [
        "AI로 제품 범위, 데이터 계약, frontend UX, QA, evidence, 테스트 하네스 관점의 작업을 issue 단위로 분해했습니다.",
        "API key, cache key, stale 가격, 빈 상태, 모바일 safe-area 같은 위험 지점을 점검하게 하고 domain rule과 테스트를 통과한 제안만 반영했습니다.",
        "Fallow 분석으로 미사용 export와 중복 코드를 찾고, 실제 참조와 테스트 결과를 확인한 뒤 정리했습니다.",
      ],
      resolutions: [
        "Adapter/Normalizer에서 외부 응답을 공통 view model로 변환해 검색·할인·상세·관심 목록이 API 포맷을 직접 알지 않게 했습니다.",
        "currentPriceCents > 0만 가격 후보로 사용하고 stale cache·fixed-window rate limit으로 외부 API 실패와 반복 호출을 완충했습니다.",
        "게임 카드, 관심 목록 폼, 목표 조건 폼을 role·label·status 기준으로 테스트해 사용자가 실제로 보는 상태 문구와 예외 흐름을 확인했습니다.",
      ],
      achievements: [
        "검색, 할인 목록, 상세, 관심 목록 화면을 React 컴포넌트로 구성하고 controlled input, list rendering, conditional rendering으로 입력값·빈 상태·오류 상태를 명확히 분기했습니다.",
        "가격 결측값의 할인·목표가 오판 경로를 차단하고, API 변경의 수정 범위를 normalizer 계층으로 좁혔습니다.",
        "전체 test/spec 자산 25개 파일·69개 케이스를 구성했고, 주요 리팩터 구간에서 Vitest 21 files / 60 tests 통과 기록을 남겼습니다.",
        "미사용 export를 11개에서 0개로, 중복 코드 비율을 9.4%에서 2.9%로 줄였습니다.",
      ],
    },
  ],
  motivation: `WACUS는 웹사이트 제작, 이커머스 구축, 검색 최적화, 마케팅 성과 분석을 함께 다루며 빠르게 열리고 안정적으로 운영되는 웹 경험을 강조한다고 이해했습니다. 그래서 WACUS에서 필요한 프론트엔드 개발자는 화면을 예쁘게 구현하는 데서 멈추지 않고, 디자인 시안을 반응형 UI로 정확히 옮기고, 이미지·렌더링·상태·QA까지 함께 챙겨 고객사 웹사이트의 완성도를 높이는 사람이라고 봅니다.

저는 PhotoMap에서 React 화면 안에 Mapbox 지도, Unity WebGL iframe, cobe canvas globe, D3 관계 그래프를 통합하며 이런 문제를 직접 다뤘습니다. 여러 렌더링 계층이 한 화면에 섞일 때 상태 구독 범위, postMessage 경계, idle mount, cleanup을 나눠 성능을 침범하지 않게 했고, 이미지 로딩 순서를 재설계해 모바일 첫 화면 지연을 줄였습니다. 그 결과 고정 mobile-mid 4G 조건에서 lab LCP p75 2.5초, 첫 사진 p95 2.6초를 기록했습니다.

AI도 실무 도구처럼 사용해 왔습니다. 코드 경로 조사, 병목 가설 정리, 실패 테스트 작성, Playwright 반복 측정 하네스 구현에는 AI를 활용했지만, 측정 오류가 의심되는 결과는 폐기하고 원시 측정값과 테스트 결과를 기준으로 다시 검증했습니다. WACUS에서도 React·Next.js 기반 신규 구축과 유지보수 과정에서 빠른 구현력, 반응형 완성도, 성능 개선, QA 검증을 함께 책임지는 개발자로 기여하겠습니다.`,
} as const;
