import { resumeDailyPayData } from "./resume_dailypay";

const projects = new Map(
  resumeDailyPayData.projectHighlights.map((project) => [project.title, project]),
);

const photoMap = projects.get("PhotoMap");
const gameInfo = projects.get("Game Information Platform");

if (!photoMap || !gameInfo) {
  throw new Error("SmileDragon resume requires PhotoMap and Game Information Platform.");
}

const smileDragonMotivation = `스마일드래곤을 보면서 주의깊게 보았던 부분은 마케팅을 단순 운영 업무로만 보지 않고, 기술과 콘텐츠, 데이터가 함께 움직이는 서비스로 만들고 있다는 점이었습니다. 인플루언서 마케팅, SNS 자동화, 콘텐츠 운영은 겉으로는 캠페인처럼 보이지만 실제로는 반복 업무를 줄이고, 사용자가 빠르게 판단하고 실행할 수 있게 만드는 웹 서비스의 힘이 중요하다고 생각합니다. 저는 이 지점에서 프론트엔드가 할 수 있는 일이 많다고 봤습니다.

저는 화면을 먼저 만들고 끝내기보다, 사용자가 느끼는 지연이나 오류가 어디서 생기는지 나누고, 그 원인을 상태 구조·API 경계·렌더링 비용·이미지 전송량 같은 단위로 좁혀 왔습니다. PhotoMap에서는 사진 목록, 지도, WebGL iframe, 3D globe, 관계 그래프가 한 화면 흐름에서 함께 동작했습니다. 여기서 상태 변경과 렌더링 수명 주기가 섞이면 화면 전환이나 모바일 탐색이 쉽게 무거워질 수 있었고, 저는 Zustand selector, 목록 가상화, renderer cleanup, 이미지 우선순위 조정으로 영향을 받는 범위를 줄였습니다. 이후 Vercel 배포 환경에서 테스트용 이미지 묶음과 모바일 조건을 고정해 optimized cold 100회로 다시 확인했습니다.

운영 중인 서비스에서 중요한 것은 새 기능을 빠르게 붙이는 것만이 아니라, 이미 쓰고 있는 흐름을 깨지 않으면서 코드와 화면을 계속 정리하는 일이라고 생각합니다. Game Information Platform에서는 외부 API마다 다른 응답을 adapter와 normalizer로 정리해 UI가 예외를 직접 떠안지 않게 했고, 가격 오판·캐시·rate limit·오류 상태를 테스트로 고정했습니다. 기능이 늘어난 뒤에는 Fallow로 미사용 export와 중복 코드를 찾아 줄이면서 유지보수 비용도 같이 관리했습니다.

이러한 경험을 가지고 스마일드래곤에 기여하고 싶습니다. 마케팅 서비스는 내부 운영자와 외부 고객이 모두 빠르게 결과를 확인해야 하는 영역이라, 화면의 작은 지연이나 불안정한 상태 표시가 곧 업무 흐름의 불편으로 이어질 수 있다고 봅니다. 저는 React와 TypeScript 기반 화면에서 상태와 API 경계를 정리하고, 성능 병목을 수치로 확인하며, 기존 기능을 깨지 않는 범위에서 리팩터링하는 데 강점이 있습니다. 자사 서비스가 더 안정적으로 운영되고, 팀이 더 자신 있게 기능을 확장할 수 있는 프론트엔드 구조를 만드는 데 보탬이 되고 싶습니다.`;

export const resumeSmileDragonData = {
  ...resumeDailyPayData,
  profile: {
    ...resumeDailyPayData.profile,
    title: "Front-End Developer",
  },
  summary: [
    "React와 TypeScript 기반 화면에서 상태 구독 범위, API 응답 경계, 렌더링 수명 주기를 분리해 운영형 웹 서비스의 안정성과 유지보수성을 개선해 온 프론트엔드 개발자 민사빈입니다.",
    "PhotoMap에서는 사용자가 사진을 지도·앨범·타임라인·관계 그래프로 탐색하는 화면을 구현하면서 Mapbox 지도, Unity WebGL iframe, 3D globe, 대량 사진 목록이 같은 React 화면 안에서 충돌하지 않도록 구조를 나눴습니다. Zustand selector와 가상화로 과도한 리렌더링과 DOM 부담을 줄였고, Vercel 배포 환경에서 테스트용 이미지 묶음을 고정해 optimized cold 100회 기준 lab LCP p75 2.5초와 첫 사진 p95 2.6초를 확인했습니다.",
    "Game Information Platform에서는 Next.js 서비스에서 Steam/Epic/ITAD API 응답 차이를 adapter와 normalizer로 흡수하고, 0원·null 가격 오판, stale cache, rate limit, 오류 상태를 Vitest와 Playwright로 검증했습니다. Fallow 정적 분석으로 미사용 export 11개를 0개로 줄이고 중복 코드 비율을 9.4%에서 2.9%로 낮추며 코드 품질도 함께 관리했습니다.",
    "AI는 코드 경로 조사, 성능 가설 정리, 반복 측정 runner 구현, QA 관점 점검에 활용했습니다. 다만 병목 판단, 표본 채택, 결과 해석, 최종 반영 여부는 원시 측정값과 테스트 결과를 보고 직접 결정했습니다. 빠르게 시도하되 근거 없이 확정하지 않는 방식으로 작업했습니다.",
    "이러한 경험을 바탕으로 스마일드래곤에서도 자사 서비스의 사용자 흐름을 깨지 않으면서 프론트엔드 구조를 점진적으로 개선하는 데 기여하고 싶습니다. 마케팅 서비스는 내부 운영자와 외부 고객이 모두 빠르게 결과를 확인해야 하는 영역이라, 작은 지연이나 불안정한 상태 표시도 업무 흐름의 불편으로 이어질 수 있다고 봅니다. 저는 상태와 API 경계를 정리하고, 성능 병목을 수치로 확인하며, 기존 기능을 깨지 않는 범위에서 리팩터링하는 데 강점이 있습니다.",
  ].join("\n\n"),
  coreSkills: [
    { title: "Frontend", items: ["React.js", "Next.js", "TypeScript", "JavaScript"] },
    { title: "UI & State", items: ["React Hooks", "App Router", "Responsive UI", "Zustand", "HTML5", "CSS3"] },
    { title: "Quality", items: ["Vitest", "Playwright", "React Profiler", "Lighthouse", "Fallow"] },
    { title: "Tools", items: ["Git", "GitHub", "Vercel", "Codex"] },
  ],
  projectHighlights: [
    {
      ...photoMap,
      keyRoles:
        "React 화면 구조 설계 / 상태 구독 범위 분리 / WebGL iframe·3D globe 렌더링 수명 주기 관리 / 모바일 성능 반복 측정",
      issues: [
        "사진 목록, Mapbox 지도, Unity WebGL iframe, 3D globe, 관계 그래프가 같은 화면 흐름에서 동작해 상태 변경과 렌더링 책임이 쉽게 섞일 수 있었습니다.",
        "5,000건 이상의 사진 탐색에서 DOM 노드, 이미지 요청, 그래프 갱신 비용이 함께 늘어 스크롤과 첫 화면 반응이 느려질 수 있었습니다.",
        "모바일 첫 사진 지연이 React 렌더링, 데이터 조회, 이미지 전송 중 어디에서 발생하는지 반복 가능한 조건으로 분리해야 했습니다.",
      ],
      aiApproach: [
        "원본 이미지가 초기 네트워크 대역폭을 차지해 첫 사진 표시를 늦춘다고 보고, preview 우선 로딩과 lazy load로 첫 사진 p95 개선 여부를 검증했습니다.",
        "AI로 기존 하네스와 이미지 경로를 조사하고 Image Transformations 403을 재현하는 실패 테스트를 작성했습니다. 이후 Playwright runner, WebP 파생본 생성, 화면별 URL·우선순위 정책을 구현했습니다.",
        "측정 자동화도 검증 대상에 포함했습니다. 일부 표본에서 LCP 수집 시점이 실제 이미지 완료 흐름과 어긋나는 문제를 확인해 수집 기준을 보정했고, 기존 결과를 폐기한 뒤 같은 조건에서 baseline과 optimized를 다시 측정했습니다.",
      ],
      resolutions: [
        "Zustand selector와 useShallow로 화면별 상태 구독 범위를 줄이고, 보이는 구간만 DOM에 유지하도록 목록을 가상화했습니다.",
        "Unity WebGL은 iframe과 postMessage 경계로 분리하고, 3D globe renderer와 이벤트 리스너 cleanup 경로를 명시했습니다.",
        "Vercel 배포 URL, 테스트용 이미지 묶음, 모바일 네트워크·CPU 조건을 고정하고 Playwright·CDP 기반으로 optimized cold 100회를 반복 측정했습니다.",
      ],
      achievements: [
        "lab LCP p75를 17.4초에서 2.5초로 85.6%, 첫 사진 p95를 17.6초에서 2.6초로 85.2% 줄였습니다.",
        "관측 전송량을 run당 3,125KB에서 328KB로 89.5% 줄였습니다.",
        "D3 NodeView 렌더링을 370회에서 25회로 93.2% 줄여 과도한 리렌더링 범위를 축소했습니다.",
      ],
    },
    {
      ...gameInfo,
      keyRoles:
        "Next.js 서비스 구현 / 외부 API 응답 정규화 / 오류·캐시·가격 예외 처리 / 테스트와 정적 분석 기반 코드 품질 개선",
      issues: [
        "Steam, Epic, ITAD API 응답 구조가 달라 카드, 상세, 관심 목록 UI가 API별 예외를 직접 처리할 위험이 있었습니다.",
        "0원·null 가격이 최저가나 목표가 달성 상태로 오판될 수 있었고, 외부 API timeout과 rate limit이 화면 실패로 이어질 수 있었습니다.",
        "기능 확장 이후 미사용 export, 중복 코드, 테스트 hotspot이 늘어 유지보수 비용이 커질 수 있었습니다.",
      ],
      aiApproach: [
        "AI 활용을 제품 범위, 데이터 계약, frontend UX, QA, evidence 역할로 나눠 issue #15~#25의 작업·완료 조건을 구체화했습니다.",
        "API key, cache key, RLS, stale 가격, 빈 상태, 모바일 웹뷰 회귀를 검토하게 하고, 제안은 domain rule과 테스트를 통과한 경우만 반영했습니다.",
        "Fallow 결과로 미사용 export, 중복 clone, 복잡도 hotspot을 찾고, 사람이 실제 참조와 테스트 결과를 확인한 뒤 정리했습니다.",
      ],
      resolutions: [
        "Adapter/Normalizer 계층으로 API 응답을 공통 view model로 변환해 UI가 외부 API 포맷을 직접 알지 않도록 했습니다.",
        "currentPriceCents > 0인 가격만 후보로 사용하고, stale cache와 fixed-window rate limit을 route 경계에 두었습니다.",
        "Vitest와 Playwright로 API route, 가격 계산, cache, 관심 목록 흐름을 검증하고 Fallow로 미사용·중복 코드를 추적했습니다.",
      ],
      achievements: [
        "가격 결측값의 최저가·목표가 오판 경로를 차단하고, API 변경의 수정 범위를 normalizer 계층으로 좁혔습니다.",
        "주요 리팩터링 기준 Vitest 21 files / 60 tests 통과 기록을 남겼습니다.",
        "미사용 export를 11개에서 0개로, 중복 코드 비율을 9.4%에서 2.9%로 줄였습니다.",
      ],
    },
  ],
  motivation: smileDragonMotivation,
} as const;