import { resumeFrontendData } from "./resume_frontend";

const dailyPayMotivation = `데일리페이에 관심을 가진 이유는 미션이 실제 셀러의 자금 흐름 문제와 바로 이어져 있었기 때문입니다. 온라인 셀러에게 정산 대기 시간은 단순한 불편이 아니라 재고 확보, 광고 집행, 다음 판매 준비까지 늦추는 문제라고 봅니다. 데일리페이는 이 시간을 줄여 셀러가 필요한 자금을 더 빨리 확보하도록 돕고, 신청 과정에서 신용조회가 진행되더라도 신용도에는 영향을 주지 않는다고 안내합니다. 빠르게 받을 수 있다는 점만큼, 안심하고 신청할 수 있다는 점도 사용자 신뢰를 만드는 요소라고 생각했습니다.

이 서비스에서 프론트엔드는 단순히 화면을 구현하는 역할에 머물지 않는다고 봅니다. 신청, 심사, 전자계약, 선정산 실행으로 이어지는 흐름에서 사용자가 지금 어떤 단계에 있는지, 다음에 무엇을 해야 하는지, 예외가 생겼다면 왜 멈췄는지를 지연이나 오해 없이 이해해야 합니다. 저는 PhotoMap과 Game Information Platform을 만들며 사용자가 직접 보는 화면의 속도, 상태, 예외 처리를 감으로 판단하지 않고 숫자와 테스트로 확인해 왔습니다.

PhotoMap에서는 React UI, Mapbox, Unity WebGL iframe, canvas, D3가 함께 동작하는 화면에서 상태 구독 범위와 렌더링 생명주기를 분리했습니다. 모바일 첫 화면 지연 원인을 렌더링 범위와 이미지 로딩 순서로 나누어 확인했고, Vercel Preview에서 테스트용 이미지 묶음을 고정해 optimized cold 100회 기준 lab LCP p75 2.5초, 첫 사진 p95 2.6초를 기록했습니다. D3 렌더 횟수는 370회에서 25회로 줄였습니다. 빠르게 고치되, 결과는 측정값으로 확인하는 방식으로 작업했습니다.

Game Information Platform에서는 Next.js 기반 서비스에서 외부 API마다 다른 응답 구조를 adapter와 normalizer로 정리해 UI가 API 예외를 직접 떠안지 않도록 했습니다. 가격 후보, 캐시, rate limit, 오류 상태는 Vitest와 Playwright로 검증했고, 버튼명·라벨·상태 문구처럼 사용자가 보는 기준을 테스트 대상으로 삼았습니다. 외부 API가 느리거나 실패해도 stale cache와 사용자 상태 표시로 화면이 바로 무너지지 않게 만드는 경험은 금융 신청 흐름의 예외 처리와도 맞닿아 있다고 봅니다.

입사 후에는 선정산 과정의 상태와 예외를 사용자가 이해하기 쉬운 화면으로 풀어내고 싶습니다. 작은 변경이라도 근거를 남기고, 빠르게 시도하되 결과를 확인하는 프론트엔드 개발자로 기여하겠습니다.`;

const projects = new Map(
  resumeFrontendData.projectHighlights.map((project) => [project.title, project]),
);

const photoMap = projects.get("PhotoMap");
const gameInfo = projects.get("Game Information Platform");
if (!photoMap || !gameInfo) {
  throw new Error("DailyPay resume requires PhotoMap and Game Information Platform.");
}

export const resumeDailyPayData = {
  ...resumeFrontendData,
  profile: {
    ...resumeFrontendData.profile,
    title: "Front-End Developer",
  },
  summary: [
    "React 기반 SPA에서 상태 전파, 렌더링 생명주기, API 응답 경계를 분리해 화면 속도와 안정성을 개선해 온 프론트엔드 개발자 민사빈입니다. 화면을 구현한 뒤 감으로 판단하지 않고, 병목을 나눠 보고 재현 가능한 환경을 만든 다음 테스트와 측정값으로 확인하는 방식으로 작업해 왔습니다.",
    "PhotoMap에서는 React UI 안에 Mapbox, Unity WebGL iframe, canvas, D3가 함께 동작하는 화면을 구현했습니다. React 상태 변경이 필요한 영역과 WebGL·canvas·D3처럼 별도 수명주기를 가진 렌더링 계층을 분리했고, Zustand selector와 D3 tick 분리로 불필요한 리렌더링 범위를 줄였습니다. 모바일 첫 화면 지연도 같은 방식으로 접근했습니다. Vercel 배포 환경에서 테스트용 이미지 묶음과 mobile-mid 4G 조건을 고정하고 optimized cold 100회를 반복 측정해 lab LCP p75 2.5초, 첫 사진 p95 2.6초를 확인했습니다.",
    "Game Information Platform에서는 Next.js 서비스에서 Steam/Epic/ITAD API 응답 차이를 adapter와 normalizer로 정리했습니다. UI 컴포넌트가 외부 API의 필드명, 결측값, 장애 상태를 직접 처리하지 않도록 공통 view model을 두었고, 0원/null 가격 오판, stale cache, rate limit, 오류 화면은 테스트로 검증했습니다. 게임 카드, 관심 목록 폼, 목표 조건 폼은 구현 세부보다 role, label, status처럼 사용자가 실제로 보는 기준으로 확인했습니다.",
    "AI는 코드 경로 조사, 성능 가설 정리, 반복 측정 하네스 구현, QA 관점 점검에 활용했습니다. 다만 병목 판단, 표본 채택, 결과 해석, 최종 반영 여부는 원시 측정값과 테스트 결과를 보고 직접 결정했습니다. 빠르게 시도하되 근거 없이 확정하지 않는 방식으로, 데일리페이의 신청·심사·전자계약·선정산 실행 흐름에서 사용자가 상태와 예외를 오해 없이 이해하는 웹 프론트엔드 플랫폼 개발에 기여하겠습니다.",
  ].join("\n\n"),
  coreSkills: [
    { title: "Frontend", items: ["React.js", "Next.js", "TypeScript", "ES6+ JavaScript"] },
    { title: "UI & State", items: ["React Hooks", "SPA", "HTML5", "CSS3", "Tailwind CSS", "Zustand"] },
    { title: "Quality", items: ["Vitest", "Playwright", "React Profiler", "Lighthouse"] },
    { title: "Tools", items: ["Git", "GitHub", "Slack", "Codex"] },
  ],
  projectHighlights: [
    {
      ...photoMap,
      keyRoles:
        "React SPA 화면 구현 / 상태 구독 범위 분리 / WebGL·canvas·D3 렌더링 생명주기 관리 / 모바일 성능 측정·개선",
      aiApproach: [
        "AI로 이미지 로딩 병목과 렌더링 경로를 조사하고, 원본 이미지 요청 경쟁이 첫 화면 지연을 만든다는 가설을 세웠습니다.",
        "실패를 재현하는 Playwright 측정 하네스와 고정 mobile-mid 4G 조건을 구성해 최적화 전후를 반복 비교했습니다.",
        "측정 오류가 의심되는 결과는 폐기하고, 원시 측정값과 테스트 결과를 확인한 뒤 최종 반영 여부를 직접 결정했습니다.",
      ],
      issues: [
        "React UI, Mapbox 지도, Unity WebGL iframe, cobe canvas, D3 관계 그래프가 한 화면에서 동작해 상태 변경과 렌더링 책임이 쉽게 섞일 수 있었습니다.",
        "고해상도 사진 목록에서 원본 이미지 요청과 hover/transition 비용이 겹쳐 모바일 첫 화면 반응성이 떨어졌습니다.",
        "초기 사진 지연이 React 렌더링, DB 조회, 이미지 전송 중 어디서 발생하는지 반복 가능한 조건으로 분리해야 했습니다.",
      ],
      resolutions: [
        "Zustand selector와 useShallow로 화면별 구독 범위를 줄이고, D3 tick 좌표 갱신은 ref와 DOM 속성 갱신으로 분리했습니다.",
        "목록과 상세 화면에서 필요한 이미지 크기와 로딩 순서를 분리하고, 첫 화면에 실제로 필요한 이미지 후보만 먼저 불러오도록 조정했습니다.",
        "390x844, DPR 2, CPU 4배 slowdown, RTT 150ms, 1.6Mbps 조건에서 fresh Chromium context로 반복 측정했습니다.",
      ],
      achievements: [
        "lab LCP p75를 17.4초에서 2.5초로 85.6%, 첫 사진 p95를 17.6초에서 2.6초로 85.2% 줄였습니다.",
        "관측 전송량을 run당 3,125KB에서 328KB로 89.5% 줄였습니다.",
        "D3 NodeView 렌더링을 370회에서 25회로 93.2% 줄여 상호작용 렌더링 부담을 낮췄습니다.",
      ],
    },
    {
      ...gameInfo,
      keyRoles:
        "Next.js 서비스 구현 / 외부 API 응답 정규화 / 가격·캐시·오류 경계 설계 / 테스트 기반 유지보수",
      aiApproach: [
        "AI로 제품 범위, 데이터 계약, frontend UX, QA, evidence, 테스트 하네스 관점의 작업을 issue 단위로 분해했습니다.",
        "API key, cache key, stale 가격, 비어 있는 상태, 모바일 safe-area 같은 위험 지점을 점검하게 하고 domain rule과 테스트를 통과한 제안만 반영했습니다.",
        "Fallow 분석으로 미사용 export와 중복 clone을 찾고, 실제 참조와 테스트 결과를 확인한 뒤 정리했습니다.",
      ],
      issues: [
        "Steam, Epic, ITAD API 응답 구조가 달라 검색/할인/상세/관련 목록 UI가 API별 예외를 직접 처리할 위험이 있었습니다.",
        "0원 또는 null 가격이 최저가와 목표가 달성 상태로 오판될 수 있었습니다.",
        "외부 API timeout, 호출 제한, 반복 요청이 화면 실패로 바로 이어질 수 있었습니다.",
      ],
      resolutions: [
        "Adapter/Normalizer 계층과 공통 view model을 두어 UI가 API별 포맷을 직접 알지 않도록 정리했습니다.",
        "currentPriceCents > 0 가격만 후보로 사용하고 가격 미정 케이스를 테스트로 검증했습니다.",
        "stale cache와 fixed-window rate limit을 route 경계에 두고 API route, 가격 계산, 캐시, 관련 목록 흐름을 검증했습니다.",
        "useEffect cleanup으로 토스트 timer와 IntersectionObserver를 정리하고, withTimeout<T>·stale cache generic 유틸로 timeout/cache 결과 타입을 유지했습니다.",
        "게임 카드, 관심 목록 폼, 목표 조건 폼을 role/label/status 기준으로 테스트해 사용자가 보는 상태 문구와 예외 흐름을 확인했습니다.",
      ],
      achievements: [
        "API 변경이 UI 전체로 번지는 범위를 줄이고, 가격 판단 규칙을 도메인 레벨에서 고정했습니다.",
        "Vitest와 Playwright 기반으로 주요 사용자 흐름과 가격/캐시/오류 케이스를 검증했습니다.",
        "외부 API 지연이나 실패가 바로 빈 화면으로 보이지 않도록 캐시 상태와 오류 상태를 화면 기준으로 나눴습니다.",
        "Fallow 분석으로 미사용 export와 중복 코드를 줄여 유지보수 비용을 낮췄습니다.",
      ],
    },
  ],
  motivation: dailyPayMotivation,
} as const;
