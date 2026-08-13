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
    title: "agent 5개·skill 5개로 API·웹뷰·QA 검토 기준을 고정",
    issue: "외부 가격 API, Supabase 인증·DB, 모바일 웹뷰, analytics, 인사이트 작업을 1인 개발로 함께 진행했습니다. 기능별 확인 기준이 없으면 구현 속도는 빨라도 API key 노출, cache key 누락, 오래된 가격 오표시, 웹뷰 회귀, 테스트·문서 누락을 놓칠 수 있었습니다.",
    cause: "한 번의 AI 요청에 제품 범위, 데이터 계약, 화면 UX, 테스트, 문서화를 모두 맡기면 서로 다른 검토 기준이 섞였습니다. 여러 날짜에 걸친 작업에서는 이전 결정과 검증 명령을 다시 찾는 비용도 생겼습니다.",
    resolution: "Harness plugin으로 product, data contract, frontend UX, QA, evidence 관점을 프로젝트 전용 agent 5개와 skill 5개로 분리했습니다. 큰 작업은 to-issues로 AI insight, scale readiness, analytics, bundle, CI·demo를 GitHub issue #15~#25에 나누고, handoff에 변경 파일·검증 명령·남은 위험을 기록했습니다.",
    aiApproach: "product architect는 기능 범위와 issue 분해, data integration agent는 ITAD·Steam·Supabase·RLS·cache key, frontend agent는 웹뷰와 store bridge, QA agent는 Vitest·Playwright·회귀 검증, documentation 역할은 README·CI·demo 근거를 점검하는 데 사용했습니다.",
    result: "AI 인사이트 작업에서는 인증, 가격 규칙, 오래된 데이터 표시, 빈 화면, API·컴포넌트 테스트를 함께 확인했습니다. analytics 검토에서는 문서의 experiment_exposed와 실제 코드 이벤트명 experiment_exposure 불일치를 찾아 수정했습니다. 기능 완료 뒤 typecheck·lint·test·build와 필요한 smoke test 결과를 남기는 기준을 유지했습니다.",
    evidence: ["README.md - AI Skill 활용 방식과 성과", "GitHub issues #15~#25", "src/lib/analytics/events.ts", "CI workflow"],
  },
  {
    title: "외부 모델 연결 전, mock 요약기로 가격 근거 입력 계약 검증",
    issue: "향후 외부 AI를 연결했을 때 저장된 가격·할인율·리뷰 밖의 내용을 생성하면 구매 판단을 해칠 수 있었습니다. 실제 모델 연결 전에 어떤 데이터만 입력하고 어떤 조건에서 결과를 만들지 검증할 필요가 있었습니다.",
    cause: "가격이 0원인 상품은 목표가 달성으로 오판할 수 있고, source snapshot이나 가격 근거가 없는 상품은 인사이트 후보가 되어서는 안 됩니다. 오래된 snapshot은 현재 가격과 구분해 표시해야 했습니다.",
    resolution: "historical_low, deep_discount, high_review_discount 후보를 코드 조건으로 만들고 source snapshot이나 가격 근거가 없으면 후보를 생성하지 않았습니다. 요약 입력에는 game·product·snapshot ID, 가격, 할인율, 리뷰, 관측 시점만 넣었습니다. 현재 구현과 테스트는 외부 모델 대신 mock-evidence-summarizer-v1을 사용합니다.",
    aiApproach: "game-data-contracts skill로 외부 가격 API, cache, RLS, price snapshot과 요약 입력의 경계를 검토했습니다. 실제 AI 연결 전에도 동일한 입력 계약과 저장 성공·실패 경로를 반복 검증할 수 있도록 mock summarizer를 유지했습니다.",
    result: "후보 선정과 가격 계산은 코드가 담당하고 요약기는 저장된 근거만 사용하도록 분리했습니다. 인사이트 저장 실패 시 run을 failed로 기록하고 job route는 500을 반환하되 공개 사용자 API는 독립적으로 동작합니다. #16~#17 완료 시 후보·job 관련 10개 테스트가 통과했고, 현재 전체 test/spec 자산은 25개 파일·69개 케이스입니다.",
    evidence: ["src/lib/jobs/ai-insight-candidates.ts", "src/lib/jobs/ai-insight-summaries.ts", "tests/jobs-api.test.ts", "GitHub issues #16~#17"],
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
  summary: "게임 가격을 검색하고 관심 상품의 가격 변화를 추적하는 서비스입니다. AI 적용을 전제로 저장된 가격·리뷰 근거만 사용하는 인사이트 파이프라인을 설계했으며, 현재 구현과 테스트는 외부 AI 대신 mock-evidence-summarizer-v1을 사용합니다. 개발 과정에서는 AI를 작업 분해·코드 검토·테스트·문서화에 활용했습니다.",
  responsibilities: [
    "ITAD·Steam 가격 응답을 공통 모델로 정규화하고 Supabase에 상품·가격 snapshot 저장",
    "AI 인사이트 후보 선정과 가격 계산을 코드 기반 규칙으로 구현",
    "프로젝트 전용 agent 5개·skill 5개로 API 계약, 웹뷰 UX, QA, 문서 검토",
  ],
  tech: [...gameInfo.tech, "AI Harness", "GitHub Issues"],
  metrics: [
    { label: "검증 자산", value: "25 files / 69 cases", basis: "전체 test/spec 집계" },
    { label: "중복 코드", value: "9.4% → 2.9%", basis: "여러 Fallow 정리 구간 누적" },
    { label: "미사용 export", value: "11 → 0", basis: "Fallow 1차 정리" },
  ],
  aiEngineering: {
    title: "게임 할인 플랫폼에서 AI가 실제로 맡은 일",
    description: "서비스용 AI 파이프라인과 개발 과정의 AI 활용을 구분했습니다. 서비스 파이프라인은 저장된 근거만 받도록 설계했고 현재는 외부 모델 없이 mock summarizer로 동작·검증합니다. 개발 AI는 이슈 분해와 역할별 검토를 도왔으며, 가격 계산·보안 경계·최종 검증은 코드 규칙과 테스트로 통제했습니다.",
    practices: [
      {
        group: "서비스 기능 AI",
        name: "AI 인사이트 파이프라인",
        usedFor: "저장된 price snapshot과 review evidence만 입력받는 요약 경로를 설계하고 mock-evidence-summarizer-v1으로 구현·테스트",
        outcome: "후보 선정과 가격 계산은 코드가 담당하며, 현재 외부 AI를 호출하지 않는 상태에서도 저장 근거만 사용하는 입력 계약을 반복 검증",
      },
      {
        group: "개발 과정 AI",
        name: "Harness plugin",
        usedFor: "product, data contract, frontend UX, QA, evidence 관점을 프로젝트 전용 agent 5개와 skill 5개로 분리",
        outcome: "AI 인사이트 구현 때 JOB_SECRET 인증, 같은 입력에 같은 결과를 내는 후보 생성, 오래된 가격 표시, 빈 상태 화면, API·컴포넌트 테스트를 함께 점검",
      },
      {
        group: "개발 과정 AI",
        name: "to-issues",
        usedFor: "AI insight, scale readiness, analytics, bundle, CI·demo 작업을 독립 실행 가능한 단위로 분해",
        outcome: "GitHub issue #15~#25에 작업 범위와 완료 여부를 기록하고 추적",
      },
      {
        group: "개발 과정 AI",
        name: "game-data-contracts",
        usedFor: "외부 가격 API, Supabase, cache, RLS, price snapshot 변경 시 데이터 경계를 검토",
        outcome: "API key 노출, cache key 누락, 오래된 가격을 현재가처럼 표시하는 경로를 점검하고 저장 근거만 사용하는 입력 규칙을 유지",
      },
      {
        group: "개발 과정 AI",
        name: "analytics-experiment-guardrails",
        usedFor: "analytics event 이름·payload·문서·테스트의 일치 여부를 확인",
        outcome: "문서의 experiment_exposed를 실제 코드 이벤트명 experiment_exposure로 수정",
      },
      {
        group: "개발 과정 AI",
        name: "fallow",
        usedFor: "dead code, unused export, duplicate clone, complexity hotspot을 측정해 정리 대상을 선택",
        outcome: "1차 정리에서 미사용 export 11개 → 0개, 이후 정리를 포함해 중복률 9.4% → 2.9%",
      },
      {
        group: "개발 과정 AI",
        name: "handoff · evidence review",
        usedFor: "여러 날짜에 걸친 작업의 상태, 변경 파일, 검증 명령, 남은 위험을 기록",
        outcome: "typecheck·test·build·E2E smoke 결과를 README, CI, demo guide, bundle 문서와 연결",
      },
    ],
    humanControls: [
      "가격 계산과 인사이트 후보 선정은 코드의 명시적인 조건으로 처리",
      "AI 입력은 저장된 price snapshot과 review evidence로 제한",
      "secret·service role key·demo password·실제 env 값은 기록에서 제외",
      "typecheck·lint·test·build와 필요한 smoke test 결과를 직접 확인",
    ],
  },
  architecture: {
    title: "AI 적용 전에도 가격 근거를 통제한 구조",
    description: "ITAD·Steam 응답은 코드에서 정규화하고 후보를 선정합니다. 현재 mock summarizer는 선택된 근거만 요약하며, 향후 외부 AI를 연결해도 같은 입력 계약을 유지하도록 설계했습니다.",
    columns: [
      { title: "입력 데이터", nodes: [{ label: "가격 API", detail: "상점별 응답 정규화" }, { label: "Snapshot", detail: "관측 시점과 가격 저장" }] },
      { title: "코드 규칙", nodes: [{ label: "후보 선정", detail: "명시적인 코드 조건" }, { label: "가격 판단", detail: "0원·null·stale 처리" }] },
      { title: "요약 경계", nodes: [{ label: "입력 제한", detail: "저장된 근거만 사용" }, { label: "현재 구현", detail: "mock summarizer 사용" }] },
      { title: "검증", nodes: [{ label: "전체 테스트 자산", detail: "25 files·69 cases" }, { label: "Fallow / Docs", detail: "품질 수치와 재현 명령" }] },
    ],
    flow: [
      "외부 가격 데이터를 공통 모델로 정규화합니다.",
      "코드 규칙이 인사이트 후보와 가격 상태를 결정합니다.",
      "현재 mock summarizer가 저장된 근거만 요약합니다.",
      "테스트와 정적 분석 결과를 확인한 뒤 반영합니다.",
    ],
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
