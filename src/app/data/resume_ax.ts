import { resumeData } from "./resume";

const projects = new Map(
  resumeData.projectHighlights.map((project) => [project.title, project]),
);
const gameInfo = projects.get("Game Information Platform");
const photoMap = projects.get("PhotoMap");
const aiChatBot = projects.get("AI ChatBot");

if (!gameInfo || !photoMap || !aiChatBot) {
  throw new Error("AX resume requires Game Information Platform, PhotoMap, and AI ChatBot.");
}

export const resumeAxData = {
  ...resumeData,
  profile: {
    ...resumeData.profile,
    title: "AI-Native Product Engineer",
  },
  summary: [
    "목표만 주어져도 문제를 정의하고 구현부터 검증까지 마무리하는 개발자 민사빈입니다. AI는 코드 생성에만 쓰지 않습니다. 요구사항을 PRD와 작은 issue로 나눈 뒤, 필요한 역할을 AI에 맡겨 탐색 속도를 높입니다. 최종 판단은 업무 규칙, 테스트, 정적 분석, 성능 지표를 보고 내립니다.",
    "Game Information Platform에서는 1인 개발의 기획·데이터·UI·QA 역할을 Harness로 분리했습니다. 큰 로드맵은 GitHub issue #15~#25의 vertical slice로 나눴고, AI 인사이트에는 저장된 price snapshot과 review evidence만 사용하도록 guardrail을 뒀습니다. 기능을 바꿀 때마다 typecheck, lint, Vitest, build, Playwright smoke를 돌렸습니다. 그 결과 중복 코드를 1,006줄(9.4%)에서 308줄(2.9%)로 줄였고 unit·component·API·E2E spec 25개 파일과 69개 케이스를 갖췄습니다.",
    "PhotoMap에서는 ‘모바일에서 사진이 늦게 보인다’는 문제를 이미지 요청 경쟁 가설로 좁혔습니다. AI로 Playwright A/B 하네스와 WebP 파생본 전달 정책을 구현했습니다. staging에서 허용할 테스트 범위를 정하고, 어떤 원시 결과를 성과로 인정할지는 직접 판단했습니다. 통제된 모바일 4G 콜드 실험에서 첫 사진 p95를 79.05초에서 3.59초로 95.5% 줄였습니다. 보호 로그인 화면이나 불공정한 캐시처럼 잘못된 실행은 결과에서 제외하고 한계까지 문서에 남겼습니다.",
    "코드를 빨리 만드는 것만으로는 부족합니다. 무엇을 만들지 판단하고 결과까지 책임져야 합니다. 제품 목표를 기술 과제로 바꾸고, AI의 속도에 기본기와 검증을 더해 사용자가 확인할 수 있는 결과로 연결하겠습니다.",
  ].join("\n\n"),
  coreSkills: [
    { title: "Frontend", items: ["React.js", "Next.js", "TypeScript", "JavaScript"] },
    { title: "Data & Integration", items: ["Supabase", "Redis", "REST API", "Adapter / Normalizer"] },
    { title: "AI Product", items: ["OpenAI API", "Evidence-only Prompt", "Human-in-the-loop", "Response Boundary"] },
    { title: "Tools", items: [] },
    { title: "Tools - AI 개발", items: ["Codex", "Claude", "Gemini", "Harness", "PRD / Issue Slicing", "Handoff"] },
    { title: "Tools - 테스트 및 품질", items: ["Vitest", "Testing Library", "Playwright", "k6", "Fallow"] },
    { title: "Tools - 배포 및 자동화", items: ["GitHub Actions", "Vercel", "Supabase staging"] },
  ],
  projectHighlights: [
    {
      ...gameInfo,
      keyRoles: "제품 목표 구조화 / Harness 역할 설계 / 외부 API·AI 데이터 guardrail / 구현·테스트·증거화 전 과정",
      issues: [
        "가격 비교 서비스라는 목표 아래 검색, 관심 목록, AI 인사이트, 웹뷰, 분석, 모니터링이 함께 얽혀 있었습니다. 큰 요청부터 그대로 구현하면 사용자 가치와 완료 기준이 흐려지고 가격·인증·테스트 경계가 빠지기 쉬웠습니다.",
        "생성형 AI가 할인 설명을 만들 때 실제 price snapshot 밖의 가격이나 할인율을 보태면 사용자의 구매 판단을 해칠 수 있었습니다.",
      ],
      aiApproach: [
        "제품 목표를 PRD로 정리하고 AI 인사이트, scale readiness, analytics, bundle, CI·demo 작업을 GitHub issue #15~#25의 vertical slice로 나눴습니다.",
        "product, data contract, frontend UX, QA, evidence 관점을 맡는 agent 5개와 skill 5개를 구성해 구현 누락과 역할 혼선을 줄였습니다.",
        "AI 인사이트는 deterministic 코드가 후보를 고른 뒤 저장된 price snapshot과 review evidence만 요약하게 제한했습니다. AI는 가격 계산을 맡지 않았습니다.",
      ],
      resolutions: [
        "Steam·Epic·ITAD 응답은 Adapter/Normalizer와 공통 view model로 변환하고, currentPriceCents > 0인 값만 최저가 후보로 사용했습니다.",
        "기능 변경 뒤 typecheck, lint, Vitest, production build, Playwright smoke를 CI에서 실행했습니다. Fallow로 dead code, duplication, maintainability를 재측정했습니다.",
        "AI 인사이트 job은 JOB_SECRET, evidence-only prompt, stale snapshot 표시 정책, empty state, API·컴포넌트 테스트까지 한 작업으로 완료했습니다.",
      ],
      achievements: [
        "unit·component·API·E2E spec 25개 파일과 69개 케이스를 구성했고, 주요 리팩터에서 Vitest 21 files / 60 tests 통과 기록을 남겼습니다.",
        "unused file 1개와 unused export 11개를 0개로 정리하고, 중복 코드를 1,006줄(9.4%)에서 308줄(2.9%)로 낮췄습니다.",
        "AI는 저장된 근거를 설명하는 일만 맡겼습니다. 가격 판단은 동일 입력에 같은 결과를 내는 업무 규칙으로 처리해 잘못된 구매 정보를 막았습니다.",
      ],
    },
    {
      ...photoMap,
      techTags: ["React", "TypeScript", "Supabase", "Playwright", "k6", "WebP", "Zustand", "D3.js"],
      keyRoles: "성능 문제 정의 / AI 활용 실험 도구·이미지 정책 구현 / staging 테스트 범위 통제 / 원시 결과 검토",
      issues: [
        "모바일에서 첫 사진이 늦게 보였지만 React 렌더링, Supabase DB, 이미지 전송 중 어느 경로가 병목인지 구분되지 않았습니다.",
        "기준 구현은 첫 화면 주변의 522,002B JPEG 약 30장을 동시에 요청했고 여러 이미지에 높은 우선순위를 줘, 1.6Mbps 환경에서 약 15.66MB의 후보가 대역폭을 나눠 쓰고 있었습니다.",
      ],
      aiApproach: [
        "원본‘원본 이미지 요청 경쟁을 줄이면 첫 사진 p95가 낮아진다’는 falsifiable hypothesis를 세웠습니다.",
        "같은 Vercel Preview에서 baseline/optimized query mode를 고정하고 CPU, RTT, 대역폭, 콜드·웜 캐시를 통제하는 Playwright 하네스를 구현했습니다.",
        "AI로 구현과 분석 속도를 높였습니다. 환경변수·Preview 인증·Production 접근 제한은 직접 관리했고, 원시 JSON과 실패 실행의 채택 여부도 사람이 결정했습니다.",
      ],
      resolutions: [
        "업로드 시 480px thumbnail WebP와 1600px display WebP를 생성해 원본과 분리했습니다. 목록은 thumbnail, 모달은 thumbnail을 먼저 보여준 뒤 display로 교체했습니다.",
        "첫 이미지 후보 하나만 fetchPriority=high로 두고 나머지는 lazy loading했습니다. Image Transformations 403 경로는 제거하고 레거시 레코드는 public original URL로 fallback했습니다.",
        "보호 로그인 화면, 잘못 선택한 DOM 이미지, DB 교체 경쟁 조건, 불공정한 캐시가 포함된 실행은 결과에서 폐기하고 한계를 문서화했습니다.",
      ],
      achievements: [
        "통제된 모바일 4G 콜드 A/B에서 첫 실제 사진 p95를 79.05초에서 3.59초로 95.5% 단축했습니다.",
        "초기 이미지 후보 모델 바이트를 약 15.66MB에서 0.91MB로 94.2% 줄였습니다. 관계 보기 p95는 35.8%, 앨범 p95는 74.4% 줄어 사용자가 사진을 탐색할 때 기다리는 시간을 낮췄습니다.",
        "Supabase staging의 synthetic media 10,000건 읽기에서 최대 56.35 API RPS, p95 약 208ms, HTTP 실패·429·5xx 0건을 확인했습니다. DB 포화 근거가 없어 불필요한 index는 추가하지 않았습니다.",
      ],
    },
    {
      ...aiChatBot,
      keyRoles: "사용자 문제 정의 / 웹 챗봇 UX 기획 / AI·백엔드 응답 경계 설계 / FE·BE 협업",
      issues: [
        "학식, 공지, 일정 정보가 여러 화면에 흩어져 사용자가 원하는 내용을 찾기까지 여러 단계를 거쳐야 했습니다. 카카오톡 챗봇은 접근성은 높지만 전시와 기능 확장에 제약이 있었습니다.",
        "AI와 외부 백엔드 응답에 JSON, 일반 문장, 긴 URL, 날짜·목록이 섞여 이를 그대로 출력하면 모바일 말풍선이 깨지고 기능별 예외 처리가 UI에 쌓였습니다.",
      ],
      aiApproach: [
        "AI를 붙이는 것보다 사용자가 어떤 질문으로 어떤 학교 정보를 확인할지 먼저 정의하고, 학식·공지·일정·빠른 링크를 한 채팅 흐름으로 묶었습니다.",
        "생성형 AI 응답을 고정된 화면 데이터로 가정하지 않고 Next.js API Routes를 proxy boundary로 두어 외부 endpoint와 응답 차이를 UI 밖에서 흡수했습니다.",
      ],
      resolutions: [
        "ReactMarkdown과 remark-gfm으로 링크와 목록을 렌더링하고, 긴 URL에는 줄바꿈 가능한 스타일을 적용했습니다.",
        "FE는 내부 route와 메시지 구조만 바라보게 해 BE의 데이터 수집 책임과 프론트의 사용자 대화 책임을 나눴습니다.",
        "localStorage와 storage event로 대화를 복원·탭 동기화하고, Blob API로 서버 재전송 없이 대화 내역을 내보냈습니다.",
      ],
      achievements: [
        "외부 응답 포맷 변경이 채팅 입력과 메시지 목록 전체로 번지는 범위를 줄이고, 모바일 가로 스크롤과 말풍선 깨짐을 완화했습니다.",
        "2인 협업에서 데이터 수집과 사용자 대화 흐름의 수정 지점을 분리해 경진대회 발표와 논문 산출물까지 제품 흐름을 완성했습니다.",
        "학교 정보 접근성 개선 AI ChatBot으로 BRIGHT MAKERS EXPO 2025 캡스톤디자인 경진대회 우수상을 받았습니다.",
      ],
    },
  ],
  activityGroups: [
    {
      title: "생성형 AI 기반 포트폴리오 요약 플랫폼",
      venue: "대한전자공학회 투고 및 심사 완료",
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