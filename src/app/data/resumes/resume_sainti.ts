import { resumeWacusData } from "./resume_wacus";

const projects = new Map(
  resumeWacusData.projectHighlights.map((project) => [project.title, project]),
);
const photoMap = projects.get("PhotoMap");
const gameInfo = projects.get("Game Information Platform");

if (!photoMap || !gameInfo) {
  throw new Error("Sainti resume requires PhotoMap and Game Information Platform.");
}

export const manualResumePathKeyword = "sainti_frontend";

const saintiMotivation = `세인티가 MES를 중심으로 SPC와 AI까지 확장 가능한 제조 산업용 스마트팩토리 플랫폼을 만든다는 점에 관심을 갖고 지원했습니다. 제조 현장의 프론트엔드는 단순히 보기 좋은 화면이 아니라, 생산·품질·설비 데이터를 사용자가 빠르게 이해하고 업무 판단으로 연결할 수 있게 만드는 인터페이스라고 생각합니다. 저는 React와 Next.js 기반 화면 구현, 대량 데이터와 이미지 렌더링 최적화, 외부 API 응답 정규화, 테스트 기반 검증 경험을 바탕으로 실제 사용자가 신뢰하고 반복해서 쓸 수 있는 웹 화면을 만들고 싶습니다.

PhotoMap에서는 지도, 앨범, 타임라인, Unity WebGL, canvas, D3 관계 그래프가 함께 동작하는 복합 UI를 구현했습니다. 여러 렌더링 계층이 한 화면에 섞일 때 생기는 성능 문제를 줄이기 위해 Zustand selector, 가상화, D3 tick 분리, iframe 경계, 이미지 우선순위 조정을 적용했고, 모바일 4G 조건에서 lab LCP p75 2.5초와 첫 사진 p95 2.6초를 반복 측정했습니다. 이 경험은 제조 현장의 설비 현황, 품질 지표, 공정 흐름처럼 데이터가 많고 상호작용이 잦은 화면을 안정적으로 구현하는 데 활용할 수 있다고 봅니다.

Game Information Platform에서는 Steam·Epic·ITAD처럼 서로 다른 외부 API 응답을 Adapter/Normalizer로 공통 view model에 맞추고, 0원·null 가격 오판, timeout, rate limit, stale cache 같은 예외 흐름을 화면 밖의 도메인 규칙과 테스트로 방어했습니다. 스마트팩토리 서비스에서도 설비·품질·생산 데이터는 출처와 상태가 다를 수 있기 때문에, UI가 데이터 차이를 직접 떠안지 않도록 계약을 정리하고 예외 상태를 명확하게 표현하는 역량이 중요하다고 생각합니다.

입사 후에는 먼저 세인티 서비스의 사용자 흐름과 기존 코드 구조를 정확히 이해하고, 작은 화면 개선도 측정 가능한 기준과 테스트 가능한 구조로 남기며 기여하겠습니다. 고객이 필요한 기능을 실제 사용자가 이해하기 쉬운 화면으로 구현하고, 스마트팩토리와 AI 솔루션의 사용성과 안정성을 높이는 프론트엔드 개발자로 성장하겠습니다.`;

export const resumeSaintiData = {
  ...resumeWacusData,
  profile: {
    ...resumeWacusData.profile,
    title: "Web Front-End Developer",
  },
  summary: [
    "React·Next.js로 업무 화면의 상태, 데이터 계약, 렌더링 성능을 함께 설계하는 프론트엔드 개발자 민사빈입니다.",
    "PhotoMap에서는 Mapbox 지도, Unity WebGL iframe, canvas globe, D3 관계 그래프, 대량 이미지 목록을 React UI에 통합했습니다. Zustand selector·가상화·이미지 우선순위 분리로 화면별 리렌더링과 전송 병목을 줄였고, 고정 모바일 4G 조건에서 optimized cold 100회를 실행해 lab LCP p75 2.5초와 첫 사진 p95 2.6초를 기록했습니다.",
    "Game Information Platform에서는 Steam·Epic·ITAD API 응답을 Adapter/Normalizer로 공통 view model에 맞추고, 가격 결측값·API 장애·호출 제한을 도메인 규칙과 테스트로 방어했습니다. 제조 현장의 생산·품질·설비 데이터처럼 출처와 상태가 다른 정보를 사용자 화면에서 일관되게 다루는 역량으로 연결하고 싶습니다.",
  ].join("\n\n"),
  coreSkills: [
    { title: "Frontend", items: ["React.js", "Next.js", "TypeScript", "JavaScript", "HTML5"] },
    { title: "UI & Interaction", items: ["Responsive UI", "Tailwind CSS", "Shadcn UI", "Mapbox", "Unity WebGL", "Canvas", "D3.js"] },
    { title: "State & Data", items: ["Zustand", "Supabase", "REST API", "Adapter / Normalizer", "Domain Rule"] },
    { title: "Performance", items: ["React Profiler", "Lighthouse", "Virtualization", "Image Delivery", "Playwright Measurement"] },
    { title: "Test & Quality", items: ["Vitest", "Testing Library", "Playwright", "GitHub Actions", "Fallow"] },
  ],
  projectHighlights: [
    {
      ...photoMap,
      description:
        "위치·시간 기반 사진 데이터를 지도, 앨범, 타임라인, WebGL, canvas, D3 관계 그래프로 탐색하는 반응형 웹 서비스",
      keyRoles:
        "React UI 구현 / 지도·WebGL·canvas·D3 통합 / 대량 데이터 렌더링 최적화 / 모바일 성능 반복 측정 / 상태 구독 범위 분리",
      issues: [
        "지도, 앨범, 타임라인, Unity WebGL iframe, canvas globe, D3 관계 그래프가 한 화면 흐름에서 동작해 상태 변경과 렌더링 책임이 섞일 위험이 있었습니다.",
        "5,000건 이상의 사진을 탐색할 때 DOM 수, 이미지 요청, hover·transition 비용이 함께 늘어 사용자가 첫 화면과 스크롤 지연을 체감할 수 있었습니다.",
        "모바일 첫 사진 지연이 React 렌더링, DB, 이미지 전송 중 어디서 발생하는지 구분하기 어려워 반복 가능한 측정 조건과 완료 기준이 필요했습니다.",
      ],
      resolutions: [
        "Unity WebGL은 iframe과 postMessage로 필요한 위치 데이터만 전달하고, canvas globe는 idle mount·marker memoization·cleanup으로 React와 수명 주기를 분리했습니다.",
        "Zustand selector와 useShallow로 화면별 상태 구독 범위를 나누고, 대량 목록은 가상화로 보이는 구간만 DOM에 유지했습니다. D3 tick 좌표는 ref와 DOM 속성으로 갱신했습니다.",
        "thumbnail·display WebP와 첫 이미지 high priority 정책을 적용하고, 390×844·DPR 2·CPU 4배 slowdown·모바일 4G 조건에서 optimized cold 100회를 측정했습니다.",
      ],
      achievements: [
        "lab LCP p75를 17.4초에서 2.5초로 85.6%, 첫 사진 p95를 17.6초에서 2.6초로 85.2% 단축했습니다.",
        "CDP 관측 전송량을 run당 3,125KB에서 328KB로 89.5% 줄였습니다.",
        "상태 변경 리렌더링 범위를 70여 개 컴포넌트에서 5개 이하로 줄이고, D3 NodeView 렌더링을 370회에서 25회로 줄였습니다.",
      ],
    },
    {
      ...gameInfo,
      description:
        "Steam·Epic·ITAD 게임 데이터를 검색, 할인 피드, 상세, 관심 목록, 목표 가격 화면으로 연결한 Next.js 서비스",
      keyRoles:
        "Next.js 화면 구현 / 외부 API 응답 정규화 / 가격·장애 예외 방어 / Supabase 연동 / 테스트·배포 검증",
      issues: [
        "외부 API마다 식별자, 가격, 할인율, 이미지, 링크 필드가 달라 UI 컴포넌트가 API별 예외를 직접 처리할 위험이 있었습니다.",
        "0원·null 가격이 최저가나 목표가 달성으로 오판될 수 있었고, timeout·호출 제한이 검색과 할인 화면 장애로 이어질 수 있었습니다.",
        "검색, 할인, 상세, 관심 목록 등 사용자 흐름이 늘어나면서 수동 확인만으로 API 응답 변경과 회귀를 안정적으로 잡기 어려웠습니다.",
      ],
      resolutions: [
        "Adapter/Normalizer에서 외부 응답을 공통 view model로 변환해 검색·할인·상세·관심 목록이 API 포맷을 직접 알지 않게 했습니다.",
        "currentPriceCents > 0만 가격 후보로 사용하고 stale cache·fixed-window rate limit으로 외부 API 실패와 반복 호출을 완충했습니다.",
        "Vitest, Testing Library, Playwright로 API route, 가격 계산, cache/rate limit, 관심 목록 UI 상태를 검증했습니다.",
      ],
      achievements: [
        "가격 결측값의 할인·목표가 오판 경로를 차단하고, API 변경의 수정 범위를 normalizer 계층으로 좁혔습니다.",
        "전체 test/spec 자산 25개 파일·69개 케이스를 구성했고, 주요 리팩터 구간에서 Vitest 21 files / 60 tests 통과 기록을 남겼습니다.",
        "미사용 export를 11개에서 0개로, 중복 코드 비율을 9.4%에서 2.9%로 줄였습니다.",
      ],
    },
  ],
  motivation: saintiMotivation,
} as const;

export const resumePathKeyword = manualResumePathKeyword;
export const resumeVariantData = resumeSaintiData;
