import { resumeAxData } from "./resume_ax";

const projects = new Map(
  resumeAxData.projectHighlights.map((project) => [project.title, project]),
);
const photoMap = projects.get("PhotoMap");
const gameInfo = projects.get("Game Information Platform");

if (!photoMap || !gameInfo) {
  throw new Error("Frontend resume requires PhotoMap and Game Information Platform.");
}

export const resumeFrontendData = {
  ...resumeAxData,
  profile: {
    ...resumeAxData.profile,
    title: "Front-End Developer",
  },
  summary: [
    "사용자가 느끼는 지연과 불편을 상태·렌더링·네트워크 문제로 나누고, 지표와 테스트로 개선을 확인하는 프론트엔드 개발자 민사빈입니다.",
    "PhotoMap에서는 React·Mapbox·Unity WebGL·canvas가 함께 동작하는 화면을 구현하고, Zustand selector·가상화·D3 tick 분리로 렌더링 범위를 줄였습니다. 모바일 이미지 지연은 AI로 조사·가설·실패 테스트·측정 runner 구현을 보조한 뒤, 고정 mobile-mid 4G 조건의 optimized cold 100회에서 lab LCP p75 2.5초와 첫 사진 p95 2.6초를 기록했습니다.",
    "개인 프로젝트 Game Information Platform에서는 외부 가격 API를 Adapter/Normalizer로 정규화하고, 0원·null 오판과 API 장애를 domain rule·stale cache·rate limit으로 방어했습니다. AI는 issue 분해, 데이터 계약·QA 검토, 테스트 보강, Fallow 분석에 사용했으며 결과는 25개 test/spec 파일·69개 케이스와 build로 검증했습니다.",
  ].join("\n\n"),
  coreSkills: [
    { title: "Frontend", items: ["React.js", "Next.js", "TypeScript", "JavaScript"] },
    { title: "UI & Interaction", items: ["Responsive UI", "Mapbox", "Unity WebGL", "D3.js", "Canvas"] },
    { title: "State & Data", items: ["Zustand", "Supabase", "REST API", "Adapter / Normalizer"] },
    { title: "Performance", items: ["React Profiler", "Lighthouse", "Virtualization", "Image Delivery"] },
    { title: "Test & Quality", items: ["Vitest", "Testing Library", "Playwright", "GitHub Actions", "Fallow"] },
  ],
  projectHighlights: [
    {
      ...photoMap,
      keyRoles: "지도·앨범·타임라인·WebGL UI 구현 / 상태·렌더링·이미지 전송 최적화 / AI-assisted 반복 성능 실험 설계·검증",
    },
    {
      ...gameInfo,
      keyRoles: "서비스 전체 프론트엔드 / 외부 API 정규화 / 가격·장애 방어 / AI-assisted 작업 분해·QA / 테스트·배포",
      issues: [
        "Steam·Epic·ITAD 응답의 식별자·가격·할인율·링크가 달라 UI가 API별 예외를 직접 알게 되는 문제가 있었습니다.",
        "0원·null 가격이 최저가나 목표가 달성으로 오판될 수 있었고, timeout·호출 제한이 검색·할인 화면 장애로 이어질 수 있었습니다.",
        "1인 개발에서 기능 범위, 데이터 계약, UI, 테스트, 문서 검토를 한 번에 처리하면 누락을 발견하기 어려웠습니다.",
      ],
      aiApproach: [
        "AI 활용을 제품 범위, 데이터 계약, frontend UX, QA, evidence, 테스트 하네스 역할로 나눠 issue #15~#25의 작업·완료 조건을 구체화했습니다.",
        "API key·cache key·RLS·stale 가격·빈 상태·모바일 웹뷰 회귀를 검토하게 하고, 제안은 domain rule과 테스트를 통과한 경우만 반영했습니다.",
        "Fallow 결과로 미사용 export·중복 clone·복잡도 hotspot을 찾고, 사람이 실제 참조와 테스트 결과를 확인한 뒤 정리했습니다.",
      ],
      resolutions: [
        "Adapter/Normalizer에서 외부 응답을 공통 view model로 변환해 검색·할인·상세·관심 목록이 API 포맷을 직접 알지 않게 했습니다.",
        "currentPriceCents > 0만 가격 후보로 사용하고 stale cache·fixed-window rate limit으로 외부 API 실패와 반복 호출을 완충했습니다.",
        "typecheck·lint·Vitest·production build와 필요한 Playwright smoke를 완료 기준으로 두고 handoff에 변경·검증·남은 위험을 기록했습니다.",
      ],
      achievements: [
        "가격 결측값의 할인·목표가 오판 경로를 차단하고, API 변경의 수정 범위를 normalizer 계층으로 좁혔습니다.",
        "전체 test/spec 자산 25개 파일·69개 케이스를 구성했고, 주요 리팩터 구간에서 Vitest 21 files / 60 tests 통과 기록을 남겼습니다.",
        "미사용 export를 11개에서 0개로, 중복 코드 비율을 9.4%에서 2.9%로 줄였습니다.",
      ],
    },  ],
  motivation: "",
} as const;
