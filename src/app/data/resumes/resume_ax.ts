import { resumeData } from "./resume";

const projects = new Map(
  resumeData.projectHighlights.map((project) => [project.title, project]),
);
const gameInfo = projects.get("Game Information Platform");
const photoMap = projects.get("PhotoMap");
const axProjectOrder = ["PhotoMap", "Game Information Platform"];

if (!gameInfo || !photoMap) {
  throw new Error("AX resume requires Game Information Platform and PhotoMap.");
}

export const resumeAxData = {
  ...resumeData,
  profile: {
    ...resumeData.profile,
    title: "AI-Native Product Engineer",
  },
  summary: [
    "문제를 먼저 정의하고 AI로 탐색과 구현 속도를 높이되, 결과는 코드 규칙과 테스트로 검증하는 개발자 민사빈입니다.",
    "Game Information Platform에서는 외부 모델을 연결하기 전에 mock-evidence-summarizer-v1으로 저장된 가격 snapshot과 review evidence만 사용하는 입력 계약을 검증했습니다. 인증된 job route, 코드 기반 후보 선정, 저장, 오래된 데이터 표시, 빈 화면, API·컴포넌트 테스트를 하나의 기능 범위로 구현했습니다.",
    "개발 과정에서는 프로젝트 전용 agent 5개와 skill 5개로 제품 범위, 데이터 계약, 웹뷰 UX, QA, 문서 근거를 나눠 점검했습니다. 전체 test/spec 자산 25개 파일·69개 케이스를 구성했고, 여러 Fallow 정리 구간을 거쳐 중복률을 9.4%에서 2.9%로 낮췄습니다.",
    "PhotoMap에서는 모바일 사진 지연을 이미지 요청 경쟁 문제로 좁히고 AI를 조사·가설 수립·실패 테스트·Playwright 하네스·WebP 전달 정책 구현에 활용했습니다. 통제된 mobile-mid 4G 환경에서 최적화 버전을 100회 콜드 실행해 lab LCP p75 2.5초, 첫 사진 완료 p95 2.6초를 기록했으며, 실제 사용자 RUM이 아닌 합성 실험이라는 한계도 함께 기록했습니다.",
  ].join("\n\n"),
  coreSkills: [
    { title: "Frontend", items: ["React.js", "Next.js", "TypeScript", "JavaScript"] },
    { title: "Data & Integration", items: ["Supabase", "Redis", "REST API", "Adapter / Normalizer"] },
    { title: "AI 경계 설계", items: ["저장 근거 전용 입력", "Mock Summarizer", "코드 기반 후보 선정", "사람의 결과 검토"] },
    { title: "AI 개발 운영", items: ["Harness", "Issue Slicing", "Handoff", "Evidence Review", "Fallow"] },
    { title: "테스트 및 품질", items: ["Vitest", "Testing Library", "Playwright", "k6", "GitHub Actions"] },
    { title: "배포", items: ["Vercel", "Supabase staging"] },
  ],
  projectHighlights: [
    {
      ...gameInfo,
      keyRoles: "가격 데이터 정규화 / 저장 근거 전용 AI 입력 계약 / Harness 운영 / 구현·테스트·문서화",
      issues: [
        "AI 인사이트는 화면뿐 아니라 JOB_SECRET 인증, 가격 근거 기반 후보 선정, Supabase 저장, 오래된 데이터 표시, 빈 화면, 실패 처리까지 연결된 기능이었습니다.",
        "외부 AI가 저장된 snapshot 밖의 가격·할인율·리뷰를 만들면 사용자의 구매 판단을 해칠 수 있어, 실제 모델 연결 전에 입력과 출력 경계를 검증해야 했습니다.",
      ],
      aiApproach: [
        "historical_low, deep_discount, high_review_discount 후보를 코드 조건으로 선정하고, source snapshot이나 가격 근거가 없으면 후보를 만들지 않았습니다.",
        "요약 경로에는 저장된 price snapshot과 review evidence만 전달했습니다. 현재 구현·테스트는 외부 AI가 아닌 mock-evidence-summarizer-v1을 사용합니다.",
        "Harness plugin으로 product, data contract, frontend UX, QA, evidence 관점을 agent 5개와 skill 5개로 분리했습니다. to-issues로 AI insight, scale readiness, analytics, bundle, CI·demo를 GitHub issue #15~#25로 추적했습니다.",
      ],
      resolutions: [
        "ITAD 응답을 Adapter/Normalizer로 공통 모델에 맞추고 Steam 가격으로 보강한 뒤 Supabase에 상품·가격 snapshot을 저장했습니다. 0원 가격은 목표가 판정에서 제외하고, source snapshot이나 가격 근거가 없으면 인사이트 후보를 만들지 않았습니다. 오래된 snapshot은 UI에서 현재 가격과 구분했습니다.",
        "JOB_SECRET job route, 저장 근거 전용 prompt, 오래된 가격 표시, 빈 화면, 저장 실패 시 failed 기록과 500 응답, API·컴포넌트 테스트를 구현했습니다.",
        "기능 변경 뒤 typecheck, lint, Vitest, build와 필요한 Playwright smoke를 실행하고 Fallow·evidence review로 검증 결과를 기록했습니다.",
      ],
      achievements: [
        "#16~#17 완료 시 후보·job 관련 10개 테스트가 통과했습니다. 현재 전체 test/spec 자산은 25개 파일·69개 케이스이며 주요 리팩터 구간에서 Vitest 21 files / 60 tests 통과 기록을 남겼습니다.",
        "Fallow 1차 정리에서 미사용 export 11개를 0개로 줄였고, 여러 정리 구간을 거쳐 중복률을 9.4%에서 2.9%로 낮췄습니다.",
        "외부 AI를 아직 연결하지 않은 상태에서도 저장 근거만 사용하는 입력 계약, 코드 기반 가격 판단, 저장 실패 경로를 반복 검증할 수 있게 했습니다.",
      ],
    },
    {
      ...photoMap,
      evidence: "https://github.com/sabin1108/Photomap/blob/main/docs/performance/image-delivery-evidence-2026-08-14.md",
      techTags: ["React", "TypeScript", "Supabase", "Playwright", "k6", "WebP", "Zustand", "D3.js"],
      keyRoles: "성능 문제 정의 / AI 활용 실험 도구·이미지 정책 구현 / staging 테스트 범위 통제 / 원시 결과 검토",
      issues: [
        "모바일에서 첫 사진이 늦게 보였지만 React 렌더링, Supabase DB, 이미지 전송 중 어느 경로가 병목인지 구분되지 않았습니다.",
        "기준 구현은 작은 카드에도 원본 JPEG를 사용하고 여러 이미지에 높은 우선순위를 줘, 제한된 모바일 대역폭에서 첫 사진 후보와 나머지 요청이 경쟁하고 있었습니다.",
      ],
      aiApproach: [
        "“원본 이미지 요청 경쟁을 줄이면 첫 사진 p95가 낮아진다”는 검증 가능한 가설을 세웠습니다.",
        "AI로 기존 하네스와 이미지 경로를 조사하고 Image Transformations 403을 재현하는 실패 테스트를 작성했습니다. 이후 Playwright runner, WebP 파생본 생성, 화면별 URL·우선순위 정책을 구현했습니다.",
        "측정 자동화도 검증 대상에 포함했습니다. 일부 표본에서 LCP 수집 시점이 실제 이미지 완료 흐름과 어긋나는 문제를 확인해 수집 기준을 보정했고, 기존 결과를 폐기한 뒤 같은 조건에서 baseline과 optimized를 다시 측정했습니다.",
      ],
      testEnvironment: [
        {
          title: "격리 범위",
          metric: "고정 Vercel Preview · synthetic fixture",
          description: "실제 사용자 사진과 Production DB를 사용하지 않았습니다. preflight에서 Production Supabase ref 미접속과 app main 응답을 확인했습니다.",
        },
        {
          title: "모바일 4G 조건",
          metric: "1.6Mbps · CPU 4배 slowdown",
          description: "390×844, DPR 2, RTT 150ms, 업로드 0.75Mbps로 기기와 네트워크 조건을 고정했습니다.",
        },
        {
          title: "A/B 표본",
          metric: "optimized 100회 · baseline 30회",
          description: "같은 commit·Preview·browser profile에서 query parameter만 바꿨습니다. 매회 새 Chromium context, concurrency 1로 실행했습니다.",
        },
        {
          title: "판정 기준",
          metric: "LCP · 첫 사진 · 성공률 · 오류",
          description: "p50·p75·p95·max, CDP 전송량, request failure, HTTP·console 오류를 기록하고 실패 표본도 성공률 분모에 포함했습니다.",
        },
      ],
      resolutions: [
        "baseline에서 원본 JPEG와 다중 high-priority 요청이 제한된 대역폭을 점유하는 네트워크 경쟁을 병목으로 좁혔습니다.",
        "업로드 시 480px thumbnail WebP와 1600px display WebP를 생성했습니다. 목록은 thumbnail, 모달은 thumbnail을 즉시 보여준 뒤 display로 교체해 첫 시각 피드백과 고해상도 로딩을 분리했습니다.",
        "첫 이미지 후보 하나만 fetchPriority=high로 두고 나머지는 lazy loading했습니다. 403을 만들던 Image Transformations 의존은 제거하고, 파생본이 없는 레거시 레코드는 public original URL로 fallback했습니다.",
        "benchmark fixture를 Supabase와 Preview 환경변수에서 격리하고, Production Supabase 접속 시 중단하는 preflight를 추가했습니다. 실패 실행을 결과 배열에 남기고 commit·Chrome·Playwright·OS 메타데이터와 raw JSON을 저장했습니다.",
      ],
      achievements: [
        "optimized cold 100회에서 lab LCP p75 2.5초, 첫 사진 완료 p95 2.6초, 최대 2.7초를 기록했습니다.",
        "첫 사진과 모달 이미지 모두 100/100회 성공했습니다. 총 1,300개 request에서 request failure·HTTP 오류·console 오류는 모두 0건이었습니다.",
        "CDP 기준 cold run당 관측 전송량은 328KB였습니다. 같은 조건의 522KB JPEG baseline 30회 결과도 별도 raw JSON으로 보존했습니다.",
        "결과는 단일 physical runner의 synthetic lab 측정입니다. fresh browser context를 사용했지만 Vercel edge·DNS·OS cache까지 초기화한 field RUM은 아닙니다.",
      ],
    },  ].sort(
    (left, right) =>
      axProjectOrder.indexOf(left.title) - axProjectOrder.indexOf(right.title),
  ),
  activityGroups: [
    {
      title: "생성형 AI 기반 포트폴리오 요약 플랫폼",
      venue: "대한전자공학회논문지 투고 및 심사 완료",
      href: "/files/thesis/generative-ai-portfolio-summary-platform.pdf",
      linkLabel: "논문 PDF",
      items: [
        "평가자가 긴 프로젝트 자료에서 핵심 역량과 근거를 빠르게 찾기 어렵다는 문제를 생성형 AI 요약·검증·시각화 흐름으로 구조화",
        "AI 스트리밍을 적용해 평균 TTFT를 18,279ms에서 607ms로 줄이고 체감 대기시간을 약 96.7% 단축",
        "생성 결과를 바로 노출하지 않고 지식 기반 검증, DB 저장, 시각화 단계를 분리한 구조를 논문으로 정리",
      ],
    },
    ...resumeData.activityGroups.filter(
      (group) => group.title !== "생성형 AI 기반 포트폴리오 요약 플랫폼",
    ),
  ],
  motivation: "",
} as const;
