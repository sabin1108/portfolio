import { axPortfolio } from "./portfolio_ax";
import { portfolio, type Project } from "./portfolio";

function getProject(title: string): Project {
  const project = axPortfolio.projects.find((item) => item.title === title);
  if (!project) throw new Error(`Frontend portfolio project not found: ${title}`);
  return project;
}

const photoMap = getProject("PhotoMap");
const gameInfo = getProject("Game Information Platform");
const aiChatBot = getProject("AI ChatBot");
const basePhotoMap = portfolio.projects.find((item) => item.title === "PhotoMap");
const webGlCase = basePhotoMap?.caseStudies.find(
  (item) => item.title === "WebGL 지도와 canvas globe 렌더링 수명 주기 분리",
);

const photoMapFrontend: Project = {
  ...photoMap,
  subtitle: "지도·WebGL·canvas·D3 인터랙션으로 사진을 탐색하는 반응형 웹 서비스",
  summary:
    "React 화면에 Mapbox 지도, Unity WebGL iframe, cobe canvas globe, D3 관계 그래프를 통합한 3인 팀 프로젝트입니다. 반응형 화면에서 여러 렌더링 계층이 충돌하지 않도록 수명 주기와 상태 경계를 나눴고, 5,000건 이상의 사진 탐색에서 대량 DOM·D3 tick·이미지 네트워크 경쟁을 측정해 개선했습니다. 모바일 첫 사진 지연은 고정 Preview와 합성 fixture에서 optimized cold 100회로 반복 검증했습니다.",
  responsibilities: [
    "Mapbox 지도, 앨범, 타임라인, Unity WebGL·canvas 화면을 React UI에 통합",
    "Zustand selector, 가상화, D3 tick 분리로 상태 변경과 렌더링 범위 최적화",
    "AI로 코드 경로 조사·성능 가설·실패 테스트·Playwright runner·WebP 정책 구현 보조",
    "고정 모바일 조건의 A/B 테스트 설계, 100회 원시 표본 검토, 오류와 한계 기록",
  ],
  metrics: [
    { label: "lab LCP p75", value: "17.4s → 2.5s", basis: "85.6% 단축 · baseline cold 30회 / optimized cold 100회" },
    { label: "첫 사진 p95", value: "17.6s → 2.6s", basis: "85.2% 단축 · baseline cold 30회 / optimized cold 100회" },
    { label: "관측 전송량 / run", value: "3.20MB → 335KB", basis: "89.5% 감소 · CDP encodedDataLength" },
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
  aiEngineering: {
    title: "AI를 성능 판단자가 아니라 조사·구현·검증 보조로 사용",
    description:
      "AI가 이미지 경로 조사, 가설 후보, 테스트 하네스와 전달 정책 구현을 보조했습니다. 병목 판정, 표본 폐기, 완료 기준, 결과 해석은 원시 JSON과 브라우저 측정값을 직접 확인해 결정했습니다.",
    practices: [
      {
        group: "개발 과정 AI",
        name: "병목 조사와 가설 수립",
        usedFor: "React 렌더링, DB, 이미지 전송 경로를 나눠 조사하고 ‘원본 요청 경쟁을 줄이면 첫 사진 p95가 낮아진다’는 가설 구체화",
        outcome: "작은 카드의 원본 JPEG와 다중 high-priority 요청이 첫 사진 후보와 경쟁하는 경로를 측정 대상으로 고정",
      },
      {
        group: "개발 과정 AI",
        name: "실패 테스트와 측정 runner 보강",
        usedFor: "baseline·optimized 조건을 분리한 Playwright 반복 실행, 오류 수집, 환경 metadata와 raw sample 저장 코드 구현 보조",
        outcome: "LCP observer race를 찾아 수정 전 결과를 폐기하고 baseline·optimized 전체를 다시 실행",
      },
      {
        group: "개발 과정 AI",
        name: "이미지 전달 정책 구현",
        usedFor: "480px thumbnail·1600px display WebP, progressive modal, 첫 후보 우선순위와 legacy fallback 구현 보조",
        outcome: "유료 transform runtime 의존을 제거하고 화면 용도별 전송량과 우선순위를 분리",
      },
    ],
    humanControls: [
      "같은 commit·Preview·browser profile을 유지하고 query parameter만 바꿔 비교",
      "실패 표본도 성공률 분모에 포함하고 request·HTTP·console 오류를 함께 확인",
      "측정 race가 있던 결과는 사용하지 않고 runner 수정 뒤 전 구간 재실행",
      "결과를 단일 physical runner의 synthetic lab 측정으로 제한하고 field RUM처럼 표현하지 않음",
    ],
  },
  caseStudies: [
    ...(webGlCase ? [webGlCase] : []),
    ...photoMap.caseStudies.filter((item) =>
      [
        "느리다는 인상을 반복 가능한 이미지 evidence로 바꾸기",
        "Context API 전역 리렌더링을 Zustand selector로 축소",
        "D3 tick 업데이트를 React state에서 분리",
      ].includes(item.title),
    ),
  ],
};

const gameInfoFrontend: Project = {
  ...gameInfo,
  summary:
    "Steam·Epic·ITAD 가격을 한 화면에서 비교하고 관심 상품의 목표 가격을 추적하는 개인 Next.js 서비스입니다. 외부 API 차이를 화면 밖의 Adapter/Normalizer로 모으고, 0원·null 오판, timeout, cache와 rate limit을 테스트 가능한 경계로 정리했습니다. AI는 작업 분해와 계약 검토, 테스트 보강, 정적 분석 결과 해석에 사용했습니다.",
  responsibilities: [
    "검색·할인·상세·관심 목록 프론트엔드와 Supabase Auth/DB 흐름 설계·구현",
    "Steam·Epic·ITAD 응답을 공통 view model로 정규화해 UI의 API별 분기 제거",
    "0원·null 가격 방어, stale cache, rate limit과 사용자 상태 피드백 구현",
    "AI-assisted issue 분해·계약 검토 후 Vitest·Playwright·CI·Fallow로 결과 검증",
  ],
  aiEngineering: {
    title: "개인 프로젝트에서 AI를 역할별 검토자와 반복 작업 보조로 사용",
    description:
      "기능 생성을 한 번에 맡기지 않고 제품 범위, 데이터 계약, 프론트엔드 UX, QA, 근거 검토로 역할을 나눴습니다. AI 제안은 명시적인 가격 규칙, 테스트, build, 정적 분석 결과를 통과한 경우만 반영했습니다.",
    practices: [
      {
        group: "개발 과정 AI",
        name: "Issue slicing",
        usedFor: "가격 인사이트, scale readiness, analytics, bundle, CI·demo 작업을 독립 검증 가능한 GitHub issue로 분해",
        outcome: "기능 범위와 완료 조건을 #15~#25에서 추적하고 날짜가 바뀌어도 handoff로 검증 상태 유지",
      },
      {
        group: "개발 과정 AI",
        name: "데이터 계약·QA 검토",
        usedFor: "API key, cache key, RLS, stale 가격, 0원/null, 빈 상태, 모바일 웹뷰 회귀 점검",
        outcome: "화면은 정규화된 view model만 사용하고 가격 판단은 코드 조건으로 고정",
      },
      {
        group: "개발 과정 AI",
        name: "Fallow 정적 분석",
        usedFor: "미사용 파일·export, 중복 clone, 복잡도 hotspot을 측정해 정리 순서 결정",
        outcome: "미사용 export 11개를 0개로, 중복 코드 비율을 9.4%에서 2.9%로 축소",
      },
    ],
    humanControls: [
      "가격 계산과 0원·null 제외는 명시적인 domain rule로 처리",
      "외부 AI를 연결하지 않은 mock summarizer 상태를 실제 AI 서비스처럼 과장하지 않음",
      "typecheck·lint·Vitest·production build와 필요한 Playwright smoke 결과 직접 확인",
      "문서와 실제 analytics event 이름처럼 AI가 놓친 불일치도 코드 기준으로 재검토",
    ],
  },
  caseStudies: gameInfo.caseStudies,
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
      "React·Next.js로 반응형 UI와 WebGL·canvas 인터랙션을 구현하고, 렌더링·상태·네트워크 병목을 반복 테스트로 개선하는 프론트엔드 개발자입니다.",
  },
  projects: [photoMapFrontend, gameInfoFrontend, aiChatBotFrontend],
} as const;
