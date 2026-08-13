import { portfolio, type CaseStudy, type Project } from "./portfolio";

function getProject(title: string): Project {
  const project = portfolio.projects.find((item) => item.title === title);
  if (!project) throw new Error(`Portfolio project not found: ${title}`);
  return project;
}

const gameInfo = getProject("Game Information Platform");
const photoMap = getProject("PhotoMap");
const aiChatBot = getProject("AI ChatBot");

function getCaseStudy(project: Project, title: string): CaseStudy {
  const caseStudy = project.caseStudies.find((item) => item.title === title);
  if (!caseStudy) throw new Error(`Portfolio case study not found: ${title}`);
  return caseStudy;
}

const gameInfoCases: CaseStudy[] = [
  {
    title: "모호한 목표를 검증 가능한 작업으로 바꾼 개발 운영",
    issue: "가격 비교 서비스라는 목표 아래 검색, 관심 목록, AI 인사이트, 웹뷰, 분석, 모니터링이 함께 얽혀 있었습니다. 1인 개발에서 큰 요청부터 그대로 구현하면 사용자 가치와 완료 기준이 흐려지기 쉬웠습니다.",
    cause: "기획부터 데이터 계약, UI, QA까지 혼자 맡아야 했습니다. AI에게 넓은 범위를 한꺼번에 맡기면 기능은 빨리 늘어도 가격 규칙, 인증 경계, 테스트, 문서가 빠질 위험이 컸습니다.",
    resolution: "제품 목표를 PRD로 정리한 뒤 AI 인사이트, scale readiness, analytics, bundle, CI·demo 작업을 GitHub issue #15~#25의 vertical slice로 나눴습니다. Harness에는 product, data contract, frontend UX, QA, evidence 관점을 맡는 agent 5개와 skill 5개를 두고 구현과 검증이 함께 끝나도록 작업 순서를 고정했습니다.",
    aiApproach: "AI를 한 명의 만능 개발자처럼 쓰지 않았습니다. product architect가 범위와 완료 기준을 점검하고, data integration agent가 API·cache·RLS 계약을 검토하며, frontend와 QA agent가 웹뷰 UX와 회귀 위험을 확인하게 했습니다. to-issues로 작업을 쪼개고 handoff로 다음 세션에 결정 근거와 검증 명령을 넘겼습니다.",
    result: "AI 인사이트도 요약 UI에서 끝내지 않고 job route 인증, deterministic 후보 생성, evidence-only prompt, stale snapshot 표시 정책, empty state, API·컴포넌트 테스트까지 한 흐름으로 완성했습니다. 여러 날 이어진 작업은 handoff에 변경 파일, 검증 명령, 남은 위험을 기록해 맥락을 이어갔습니다.",
    evidence: ["README - AI Skill 활용 방식", "GitHub issues #15~#25", "CI workflow", "handoff records"],
  },
  {
    title: "AI가 가격을 지어내지 못하게 데이터 계약으로 제한",
    issue: "생성형 AI가 읽기 쉬운 할인 설명을 만들더라도 실제로 존재하지 않는 가격이나 할인율을 보태면 사용자의 구매 판단을 해칠 수 있었습니다.",
    cause: "가격은 API마다 필드와 갱신 시점이 다르고 출시 예정 상품은 0원이나 null로 들어옵니다. 자유로운 prompt만으로는 현재가, 과거 최저가, 리뷰 근거의 출처를 보장하기 어려웠습니다.",
    resolution: "AI가 설명할 후보는 코드에서 deterministic 조건으로 먼저 결정했습니다. prompt에는 저장된 price snapshot과 review evidence만 넣고, 외부 AI 없이 mock summarizer로 후보 생성부터 저장까지 테스트했습니다. 오래된 evidence는 현재가처럼 보이지 않도록 UI 정책도 분리했습니다.",
    aiApproach: "game-data-contracts skill로 AI 입력 경계를 price snapshot과 review evidence로 제한했습니다. AI는 후보 선택이나 가격 계산에는 관여하지 않고, 코드가 고른 근거를 읽기 쉬운 문장으로 요약하는 역할만 맡았습니다. mock summarizer로 외부 모델 없이 같은 계약을 반복 검증했습니다.",
    result: "AI는 저장된 근거를 요약하는 일만 맡겼습니다. 가격 계산과 후보 선정은 업무 규칙으로 처리해 가격 미정 상품이 최저가나 목표가 달성으로 표시되는 경로를 막았습니다. 사용자의 구매 판단을 보호하면서 spec 25개 파일, 69개 케이스를 갖췄고 중복 코드는 1,006줄(9.4%)에서 308줄(2.9%)로 줄었습니다.",
    evidence: ["ai-insights.ts", "game-score.ts", "25 spec files / 69 cases", "Fallow reports"],
  },
];

const photoMapCases: CaseStudy[] = [
  {
    title: "느리다는 인상을 반증 가능한 이미지 가설로 바꾸기",
    issue: "모바일에서 첫 사진이 매우 늦게 보였지만 React 렌더링, Supabase DB, 이미지 전송 중 어디가 병목인지 구분되지 않았습니다. 감으로 코드를 바꾸면 개선 원인을 설명할 수 없는 상태였습니다.",
    cause: "기준 구현은 첫 화면 주변의 522,002B JPEG 약 30장을 동시에 요청하고 여러 이미지에 `eager/high`를 줬습니다. 1.6Mbps 환경에서 약 15.66MB의 초기 후보가 대역폭을 나눠 쓰며 첫 이미지 완료를 밀어냈습니다.",
    resolution: "AI로 이미지 경로를 조사하고 ‘원본 요청 경쟁을 줄이면 첫 사진 p95가 낮아진다’는 검증 가능한 가설을 세웠습니다. 실제 사용자 데이터와 운영 환경은 건드리지 않고, 고정된 Vercel Preview와 Supabase staging의 합성 이미지 120건으로 Playwright 하네스를 구성했습니다. viewport 390×844, DPR 2, CPU 4배 slowdown, RTT 150ms, 다운로드 1.6Mbps, 업로드 0.75Mbps를 적용했습니다. 같은 코드와 데이터에서 query parameter만 baseline/optimized로 바꾸고, 서로 다른 Chromium context를 5회씩 실행해 브라우저 캐시가 비교를 흐리지 않게 했습니다.",
    aiApproach: "AI는 기존 성능 하네스와 이미지 경로를 조사하고, 병목 후보를 검증 가능한 가설로 정리하며, 실패 테스트부터 Playwright 하네스와 WebP 전달 정책 구현까지 이어가는 데 사용했습니다. Vercel 환경변수 설정과 측정 중 Preview Authentication 해제는 직접 관리했습니다.",
    result: "유효 표본 10회(모드별 5회)의 통제된 모바일 4G 콜드 A/B에서 첫 실제 사진 p95가 79.05초에서 3.59초로 95.5% 줄었습니다. Playwright가 기록한 원시 JSON을 직접 검토했고, 보호 로그인 화면, 잘못 선택한 DOM 이미지, 불공정한 캐시 조건 등 5가지 오류 유형에 해당한 실행은 결과에서 제외했습니다. 합성 실험이므로 실제 사용자 전체의 p95로 확대 해석하지 않았습니다.",
    evidence: ["image A/B raw JSON", "Playwright harness", "PR #22", "discarded-run log"],
  },
  {
    title: "이미지 전달 정책을 바꾸고 DB 과잉 최적화를 피하기",
    issue: "작은 카드에서도 원본 이미지를 썼고, Supabase Image Transformations가 꺼진 환경에서는 transform URL이 403을 반환했습니다. 이미지 문제를 DB 문제로 오인해 index를 먼저 추가할 가능성도 있었습니다.",
    cause: "썸네일, 화면 표시용 이미지, 원본의 용도가 나뉘지 않았고 실제 LCP 후보와 나머지 이미지가 높은 우선순위로 경쟁했습니다. frontend와 DB를 함께 측정하면 병목 위치도 흐려졌습니다.",
    resolution: "업로드 시 브라우저 Canvas로 480px thumbnail WebP(quality 0.72)와 1600px display WebP(quality 0.80)를 만들고, 화면별 URL과 로딩 우선순위를 분리했습니다. DB 성능은 이미지 A/B와 분리했습니다. Supabase staging에 category 10건, location 1,000건, media 10,000건, description 8,000건, favorites 1,000건의 합성 데이터를 만들고, k6의 각 iteration에서 카테고리·최근 media 50건과 관계 데이터·favorites를 조회했습니다. smoke 5분, peak 30분, spike 6분 순으로 읽기 경로만 부하 테스트했습니다.",
    aiApproach: "AI로 Supabase Image Transformations의 403 경로를 재현하고, 업로드 시 thumbnail/display WebP 생성과 URL·우선순위 정책을 구현했습니다. 같은 합성 원본에서 JPEG/WebP fixture를 만들고 측정 결과를 4 Golden Signals 기준으로 분석·문서화하는 데도 활용했습니다.",
    result: "초기 이미지 후보 모델 바이트는 약 15.66MB에서 0.91MB로 94.2% 줄어 사진 탐색 전환의 대기 시간을 낮췄습니다. spike에서 평균 56.35 read API RPS, p95 207.93ms, p99 223.18ms를 기록했고 HTTP 실패·429·5xx·dropped iteration은 모두 0건이었습니다. Supabase 대시보드에서도 CPU 2%, memory 51%, connection 15/60 수준이라 DB 포화 근거가 없었고 추가 index를 넣지 않았습니다. 중단된 2시간 soak 결과는 성과에서 제외했습니다.",
    evidence: ["imageVariants.ts", "image tests 8/8", "k6 results", "Supabase dashboard"],
  },
  ...photoMap.caseStudies.filter((item) =>
    ["Context API 전역 리렌더링을 Zustand selector로 축소", "D3 tick 업데이트를 React state에서 분리"].includes(item.title),
  ),
];

const gameInfoAx: Project = {
  ...gameInfo,
  summary: "제품 목표를 PRD와 vertical slice로 구조화하고, AI agent·skill을 역할별로 나눠 구현 속도와 검증 책임을 함께 관리한 1인 제품 개발 사례입니다.",
  responsibilities: ["제품 목표를 PRD와 issue #15~#25로 분해", "product·data·UX·QA·evidence 역할을 나눈 Harness 운영", "AI 출력을 domain rule, 테스트, CI, Fallow로 검증"],
  tech: [...gameInfo.tech, "AI Harness", "GitHub Issues"],
  metrics: [
    { label: "검증 자산", value: "25 files / 69 cases", basis: "unit·component·API·E2E" },
    { label: "중복 코드", value: "9.4% → 2.9%", basis: "여러 Fallow 정리 구간 누적" },
    { label: "미사용 export", value: "11 → 0", basis: "Fallow 결과" },
  ],
  aiEngineering: {
    title: "게임 할인 플랫폼에서 AI를 개발 시스템으로 사용한 방식",
    description: "코드 생성만 맡긴 것이 아니라 목표 분해, 역할별 검토, 도메인 제약, 품질 측정, 작업 인수인계를 하나의 개발 루프로 구성했습니다.",
    workflow: [
      "제품 목표를 PRD로 구조화",
      "GitHub issue #15~#25로 분해",
      "역할별 agent로 구현·검토",
      "테스트·정적 분석으로 검증",
      "handoff·evidence로 기록",
    ],
    practices: [
      {
        name: "Harness plugin",
        usedFor: "product, data contract, frontend UX, QA, evidence 관점을 agent 5개와 skill 5개로 분리",
        outcome: "AI 인사이트를 UI만 만들고 끝내지 않고 인증·가격 규칙·empty state·테스트·문서까지 한 흐름으로 점검",
      },
      {
        name: "to-issues",
        usedFor: "큰 roadmap을 독립 실행 가능한 vertical slice로 분해",
        outcome: "AI insight, scale readiness, analytics, bundle, CI·demo를 issue #15~#25로 추적",
      },
      {
        name: "game-data-contracts",
        usedFor: "외부 가격 API, cache, RLS, price snapshot과 AI 입력 경계를 검토",
        outcome: "AI가 가격을 만들지 못하도록 저장된 snapshot·review evidence만 사용하는 guardrail 유지",
      },
      {
        name: "analytics-experiment-guardrails",
        usedFor: "analytics event 이름과 payload, 문서, 테스트의 계약을 비교",
        outcome: "experiment_exposed와 실제 experiment_exposure의 불일치를 찾아 taxonomy 정리",
      },
      {
        name: "fallow",
        usedFor: "dead code, unused export, duplicate clone, complexity hotspot을 수치로 탐색",
        outcome: "여러 정리 구간을 거쳐 중복 코드 9.4% → 2.9%, 미사용 export 11개 → 0개",
      },
      {
        name: "handoff · evidence review",
        usedFor: "여러 날짜에 걸친 작업의 결정, 변경 파일, 검증 명령, 남은 위험을 보존",
        outcome: "CI, E2E smoke, bundle report, demo guide까지 재현 가능한 근거로 연결",
      },
    ],
    humanControls: [
      "가격 계산과 AI 후보 선정은 deterministic domain rule로 고정",
      "secret·인증·RLS·운영 데이터 경계는 직접 검토",
      "typecheck·lint·test·build와 evidence가 남아야 작업 완료",
    ],
  },
  architecture: {
    title: "AI-assisted 제품 개발을 통제한 작업 구조",
    description: "문제 구조화, 역할 분리, domain guardrail, 자동 검증, evidence 기록을 한 작업 단위로 묶었습니다.",
    columns: [
      { title: "Problem", nodes: [{ label: "PRD", detail: "사용자 가치와 완료 기준" }, { label: "Issue", detail: "vertical slice" }] },
      { title: "AI Roles", nodes: [{ label: "Product / Data", detail: "범위와 계약 점검" }, { label: "Frontend / QA", detail: "UX와 회귀 검증" }] },
      { title: "Human Control", nodes: [{ label: "Domain Rules", detail: "가격·stale 정책" }, { label: "Security", detail: "secret·RLS 경계" }] },
      { title: "Evidence", nodes: [{ label: "CI / Tests", detail: "typecheck부터 E2E" }, { label: "Fallow / Docs", detail: "품질 수치와 재현" }] },
    ],
    flow: ["목표를 PRD와 완료 기준으로 바꿉니다.", "AI 구현 후보에 domain guardrail을 적용합니다.", "검증 결과가 남아야 issue를 닫습니다."],
  },
  caseStudies: gameInfoCases,
};

const photoMapAx: Project = {
  ...photoMap,
  summary: "‘사진이 늦게 보인다’는 문제를 네트워크 경쟁 가설로 좁히고, AI-assisted 하네스와 사람이 검토한 원시 측정값으로 개선을 증명한 성능 실험입니다.",
  responsibilities: ["성능 가설과 A/B 완료 기준 수립", "AI-assisted 하네스·이미지 정책 구현", "staging 안전 통제와 실패 실행 폐기"],
  tech: [...photoMap.tech.filter((item) => item !== "Lighthouse"), "Playwright", "k6", "WebP", "AI Harness"],
  metrics: [
    { label: "첫 사진 p95", value: "79.05s → 3.59s", basis: "모바일 4G 콜드 합성 A/B" },
    { label: "초기 이미지 후보", value: "15.66MB → 0.91MB", basis: "fixture 모델" },
    { label: "Supabase read", value: "56.35 RPS / p95 208ms", basis: "synthetic 10,000건, 오류 0" },
  ],
  validationSetup: {
    title: "성능 수치가 만들어진 테스트 환경",
    description: "운영 서비스의 실사용 지표처럼 보이지 않도록 이미지 체감 속도와 DB 처리량을 별도의 가상 환경에서 측정했습니다.",
    tracks: [
      {
        name: "모바일 이미지 전달 A/B",
        purpose: "원본 이미지 요청 경쟁을 줄였을 때 첫 실제 사진 표시 시간이 개선되는지 확인",
        environment: "Vercel Preview + Supabase staging · Playwright Chromium · 390×844 / DPR 2 · CPU 4× slowdown · RTT 150ms · 다운로드 1.6Mbps / 업로드 0.75Mbps",
        dataset: "개인정보가 없는 합성 media 120건 · 기준 JPEG 522,002B · Production DB/Storage 미사용",
        procedure: "같은 코드·데이터에서 query parameter만 baseline/optimized로 변경 · 새 Chromium context로 모드별 5회, 유효 표본 총 10회 측정 · Playwright 원시 JSON 검토",
        criteria: "첫 실제 사진 완료 p50·p95, 관계 보기·앨범 전환 p95, 이미지 표시 성공률을 동일 조건에서 비교",
        result: "첫 실제 사진 p95 79.05초 → 3.59초(-95.5%) · 초기 이미지 후보 15.66MB → 0.91MB(-94.2%)",
        limitation: "모드별 5회의 통제된 합성 실험이며 RUM이 아님 · 조건이 깨진 실행은 제외 · 실제 사용자 전체 성능으로 확대 해석하지 않음",
      },
      {
        name: "Supabase 읽기 부하 테스트",
        purpose: "이미지 지연과 DB 병목을 분리하고, 목표 읽기 부하에서 추가 index가 필요한지 판단",
        environment: "Production과 분리된 동일 Region Supabase staging · k6 · REST 읽기 경로만 측정 · Vercel CDN·Storage 이미지·write flow 제외",
        dataset: "category 10건 · location 1,000건 · media 10,000건 · description 8,000건 · favorites 1,000건의 합성 데이터",
        procedure: "iteration마다 category, 최근 media 50건과 관계 데이터, favorites 조회 · smoke 5분 → peak 30분 → spike 6분 실행",
        criteria: "checks >99% · HTTP failure <1% · p95 <300ms · p99 <800ms · 429·5xx·dropped iteration 0건",
        result: "spike 평균 56.35 API RPS · p95 207.93ms / p99 223.18ms · HTTP 실패·429·5xx·dropped iteration 0건",
        limitation: "읽기 중심 합성 workload 기준 · 대시보드는 rolling window 값 · 중단된 2시간 soak는 결과에서 제외",
      },
    ],
  },
  metricRows: [
    { category: "Latency", metric: "첫 실제 사진 p95", before: "79.05초", after: "3.59초", basis: "모바일 4G 콜드 A/B" },
    { category: "Traffic", metric: "초기 이미지 후보", before: "약 15.66MB", after: "약 0.91MB", basis: "fixture 기반 모델" },
    { category: "Latency", metric: "관계 보기 p95", before: "7.62초", after: "4.90초", basis: "navigation A/B" },
    { category: "Latency", metric: "앨범 p95", before: "15.37초", after: "3.94초", basis: "navigation A/B" },
  ],
  architecture: {
    title: "AI-assisted 성능 실험과 사람 검증 경계",
    description: "이미지 체감 속도와 DB 처리량을 한 수치로 섞지 않았습니다. 서로 다른 staging 실험으로 분리하고, 환경 고정과 원시 결과 채택, 한계 해석은 사람이 맡았습니다.",
    columns: [
      { title: "Image A/B", nodes: [{ label: "Preview", detail: "Vercel + 합성 이미지 120건" }, { label: "Mobile 4G", detail: "390×844·CPU 4×·1.6Mbps" }] },
      { title: "Playwright", nodes: [{ label: "Comparison", detail: "동일 코드·데이터, query mode만 변경" }, { label: "Sampling", detail: "콜드 context 모드별 5회" }] },
      { title: "Load Test", nodes: [{ label: "Supabase staging", detail: "media 10,000건 + 관계 데이터" }, { label: "k6", detail: "5분 smoke·30분 peak·6분 spike" }] },
      { title: "Human Control", nodes: [{ label: "Validity", detail: "원시 JSON·대시보드 교차 검토" }, { label: "Limits", detail: "RUM 아님·미완료 soak 제외" }] },
    ],
    flow: ["운영 데이터와 분리된 staging 환경을 만듭니다.", "baseline과 optimized 조건을 고정해 반복 측정합니다.", "부하 테스트는 별도 데이터와 읽기 경로로 실행합니다.", "원시 결과와 한계를 함께 기록한 뒤 주장 범위를 정합니다."],
  },
  caseStudies: photoMapCases,
};

const aiChatBotAx: Project = {
  ...aiChatBot,
  summary: "사용자가 흩어진 학교 정보를 어떻게 묻고 확인할지 먼저 정했습니다. 불규칙한 AI·백엔드 응답이 UI로 새지 않게 경계를 나눈 2인 협업 사례입니다.",
  responsibilities: ["학식 접근 문제에서 웹 챗봇 방향 결정", "AI·백엔드 응답을 API route 경계에서 분리", "FE·BE 응답 계약과 사용자 메시지 UX 조율"],
  caseStudies: [
    getCaseStudy(aiChatBot, "학식 접근성 문제에서 웹 챗봇 방향으로 전환"),
    {
      title: "AI 응답을 신뢰 가능한 화면 데이터로 가정하지 않기",
      issue: "채팅, 공지, 식단 응답에는 JSON, 문장, 긴 URL, 날짜와 목록이 섞였습니다. 이를 그대로 출력하면 모바일 말풍선이 깨지고 예외 처리가 UI에 쌓였습니다.",
      cause: "생성형 AI와 외부 백엔드는 화면이 원하는 고정 형식을 항상 보장하지 않습니다. UI가 endpoint와 응답 변형을 모두 알면 백엔드 변경이 메시지 목록까지 번집니다.",
      resolution: "Next.js API Routes를 proxy boundary로 두고 외부 호출 책임을 모았습니다. ReactMarkdown으로 링크·목록을 렌더링하고 긴 URL은 줄바꿈 가능한 링크로 바꿨습니다.",
      result: "UI는 메시지 표시와 상호작용에 집중하게 됐고 모바일 가로 스크롤과 말풍선 깨짐을 줄였습니다. 학교 정보 접근성 개선 흐름은 BRIGHT MAKERS EXPO 2025 우수상으로 이어졌습니다.",
      evidence: ["app/api/chat/route.ts", "enhanced-chat-interface.tsx", "ReactMarkdown", "캡스톤 우수상"],
    },
    getCaseStudy(aiChatBot, "로그인 없는 로컬 채팅 기록 저장과 탭 동기화"),
    getCaseStudy(aiChatBot, "대화 내역 브라우저 내보내기"),
  ],
};

export const axPortfolio = {
  ...portfolio,
  profile: {
    ...portfolio.profile,
    title: "AI-Native Product Engineer",
    headline: "모호한 목표를 문제와 검증 기준으로 바꾸고, AI와 함께 빠르게 구현하되 테스트와 지표로 결과를 책임집니다.",
  },
  projects: [photoMapAx, gameInfoAx, aiChatBotAx],
} as const;
