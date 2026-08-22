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
    title: "느리다는 인상을 반복 가능한 이미지 evidence로 바꾸기",
    issue: "모바일에서 첫 사진이 매우 늦게 보였지만 React 렌더링, Supabase DB, 이미지 전송 중 어디가 병목인지 구분되지 않았습니다. 감으로 코드를 바꾸면 개선 원인을 설명할 수 없는 상태였습니다.",
    cause: "기준 fixture는 grid와 detail에 같은 510KB JPEG를 사용하고 여러 이미지 요청이 제한된 모바일 대역폭을 함께 점유했습니다. 작은 카드와 상세 화면의 전달 정책이 분리되지 않아 첫 LCP 후보가 나머지 요청과 경쟁했습니다.",
    resolution: "실제 사용자 데이터와 Production DB를 쓰지 않고, Vercel에 배포된 같은 Preview URL에서 반복 측정할 수 있는 benchmark를 만들었습니다. 390×844, DPR 2, CPU 4배 slowdown, RTT 150ms, 다운로드 1.6Mbps, 업로드 0.75Mbps를 고정하고, 같은 commit·deployment에서 query parameter만 baseline/optimized로 바꿨습니다. optimized 100회와 baseline 30회를 매번 새 브라우저 환경에서 1회씩 순서대로 실행했습니다.",
    aiApproach: "AI는 이미지 경로 조사, 가설 수립, 실패 테스트, runner 보강, WebP 전달 정책 구현에 사용했습니다. 원시 분포에서 LCP observer race를 발견한 뒤 Performance Timeline 직접 조회와 100ms settle을 적용했고, 수정 전 결과를 폐기한 뒤 두 mode 전체를 다시 측정했습니다.",
    result: "optimized cold 100회에서 lab LCP p75 2.5초, 첫 사진 완료 p95 2.6초, 최대 2.7초를 기록했습니다. 첫 사진과 모달 이미지는 100/100회 성공했고, 총 1,300개 request에서 request failure·HTTP 오류·console 오류는 모두 0건이었습니다. raw JSON에는 각 sample과 실행 환경·commit 메타데이터를 함께 보존했습니다.",
    evidence: ["docs/performance/image-delivery-evidence-2026-08-14.md", "image-final-optimized-100.json", "image-final-baseline-30.json", "vercel-modal-usability.mjs"],
  },
  {
    title: "이미지 전달 정책을 물리 파생본과 우선순위로 재설계",
    issue: "작은 카드에서도 원본 이미지를 썼고, Supabase Image Transformations가 꺼진 환경에서는 transform URL이 403을 반환했습니다. 이미지 문제를 DB 문제로 오인해 index를 먼저 추가할 가능성도 있었습니다.",
    cause: "썸네일, 화면 표시용 이미지, 원본의 용도가 나뉘지 않았고 실제 LCP 후보와 나머지 이미지가 높은 우선순위로 경쟁했습니다. frontend와 DB를 함께 측정하면 병목 위치도 흐려졌습니다.",
    resolution: "업로드 시 브라우저 Canvas로 480px thumbnail WebP(quality 0.72)와 1600px display WebP(quality 0.80)를 생성했습니다. grid·cover·timeline·relation·favorite는 thumbnail을 사용하고, 모달은 이미 받은 thumbnail을 즉시 보여준 뒤 display WebP로 교체했습니다. 첫 LCP 후보 하나만 fetchPriority=high로 두고 나머지는 auto/lazy로 분리했습니다.",
    aiApproach: "AI로 Image Transformations 403 경로를 재현하고 thumbnail/display WebP 생성, URL 선택, priority, progressive modal loading 정책을 구현했습니다. benchmark fixture는 Supabase와 VITE_DEMO_USER_ID에서 격리해 Preview 설정이나 DB 상태가 측정을 바꾸지 않게 했습니다.",
    result: "optimized cold run당 CDP 관측 전송량은 328KB였고 첫 사진 완료 p95는 2.6초였습니다. 유료 Image Transformations runtime 의존을 제거하고 legacy record는 public original URL로 fallback했습니다. TypeScript, image delivery·traffic policy 테스트 8/8, production build를 통과했습니다.",
    evidence: ["src/lib/imageVariants.ts", "tests/image-delivery.test.mjs", "tests/performance/virtual-traffic-policy.test.mjs", "raw JSON SHA-256"],
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
  links: {
    ...photoMap.links,
    evidence: "https://github.com/sabin1108/Photomap/blob/main/docs/performance/image-delivery-evidence-2026-08-14.md",
  },
  summary: "‘사진이 늦게 보인다’는 문제를 네트워크 경쟁 가설로 좁히고, AI-assisted 하네스와 사람이 검토한 원시 측정값으로 개선을 증명한 성능 실험입니다.",
  responsibilities: ["성능 가설과 A/B 완료 기준 수립", "AI-assisted 하네스·이미지 정책 구현", "staging 안전 통제와 실패 실행 폐기"],
  tech: [...photoMap.tech.filter((item) => item !== "Lighthouse"), "Playwright", "k6", "WebP", "AI Harness"],
  metrics: [
    { label: "lab LCP p75", value: "2.5s", basis: "optimized cold 100회" },
    { label: "첫 사진 p95", value: "2.6s", basis: "optimized cold 100회" },
    { label: "반복 성공", value: "100 / 100", basis: "request·HTTP·console 오류 0" },
  ],
  validationSetup: {
    title: "성능 수치가 만들어진 가상 테스트 환경",
    description: "실제 사용자 지표처럼 보이지 않도록 대상·기기·네트워크·데이터·표본 생성·오류 판정을 고정했습니다. 최종 주장은 아래 synthetic lab 범위로 제한합니다.",
    tracks: [
      {
        name: "가상 모바일 이미지 A/B",
        purpose: "원본 이미지 요청 경쟁을 줄인 뒤 최종 사용자 체감과 Web Vital이 반복 실행에서도 유지되는지 검증",
        environment: "Vercel에 배포된 같은 Preview URL을 Windows PC 한 대에서 Headless Chrome과 Playwright로 반복 측정 · 모바일 화면 크기 390×844 / DPR 2 / touch 조건 · CPU 4배 느리게, RTT 150ms, 다운로드 1.6Mbps, 업로드 0.75Mbps로 제한 · 한 번에 하나씩 실행",
        dataset: "실제 사용자 사진과 Production DB/Storage는 쓰지 않고, 테스트용 이미지 묶음을 고정해 비교 · baseline JPEG 510KB · optimized thumbnail WebP 30KB / display WebP 255KB",
        procedure: "같은 코드와 같은 Vercel 배포 URL을 유지하고 query parameter만 baseline/optimized로 변경 · optimized cold 100회 / baseline cold 30회 · 매번 새 브라우저 환경에서 실행 · 이미지 완료 후 100ms 기다린 뒤 Performance Timeline의 마지막 LCP entry 수집",
        criteria: "첫 사진 p50·p75·p95·max · lab LCP p75·p95 · FCP·TTFB·CLS · 첫 사진·모달 성공률 · CDP encodedDataLength · request failure·HTTP 4xx/5xx·console error",
        result: "optimized: lab LCP p75 2.5초 · 첫 사진 p95 2.6초 / max 2.7초 · 첫 사진·모달 100/100 성공 · 1,300 requests에서 request·HTTP·console 오류 0 · 관측 전송량 328KB/run",
        limitation: "실제 사용자 전체 통계가 아니라 한 대의 PC에서 만든 반복 측정값 · 새 브라우저로 실행해도 Vercel edge, DNS, OS cache 영향은 남을 수 있음 · baseline 30회와 optimized 100회를 순서대로 실행",
      },
      {
        name: "측정값이 흔들리지 않게 확인한 방법",
        purpose: "실제 서비스 데이터가 섞이거나 로그인 화면을 잘못 측정하거나 실패한 실행을 빼고 계산하는 일을 막기 위해 확인 기준을 고정",
        environment: "측정 전 Vercel Preview URL이 정상 화면을 반환하는지 먼저 확인 · 실제 Production Supabase가 잡히면 즉시 중단 · 테스트용 이미지와 테스트 사용자를 실제 서비스 데이터와 분리",
        dataset: "각 실행마다 시간, 성공 여부, request 수, 전송량(KB), 오류 목록을 저장 · 실행한 commit, 브랜치, Node/Chrome/Playwright/OS 정보도 함께 raw JSON으로 보존",
        procedure: "실패한 실행도 성공률 계산에 포함 · LCP 측정 방식에 오류가 보여 수집 방식을 고친 뒤 이전 결과를 버리고 baseline/optimized 전체를 다시 실행 · raw 파일과 재현 명령을 문서화",
        criteria: "요청한 실행 횟수와 실제 저장된 표본 수가 같은지 확인 · 같은 commit에서 실행했는지 확인 · Production Supabase 접속이 없었는지 확인 · 첫 사진/모달 성공률 100%, request/HTTP/console 오류 0건, 테스트와 build 통과",
        result: "optimized 100회와 baseline 30회 표본을 모두 보존 · 두 조건 모두 첫 사진과 모달 성공률 100% · request/HTTP/console 오류 0건 · image delivery/policy 테스트 8/8, TypeScript, production build 통과",
        limitation: "측정 중 생성된 raw 파일 때문에 git dirty 표시가 남았지만, 실제 앱 소스는 기록된 commit과 일치 · 장기적인 실제 사용자 성능 판단은 7~14일 이상 RUM 수집이 필요",
      },
    ],
  },
  metricRows: [
    { category: "Web Vital", metric: "lab LCP p75", before: "17.4초", after: "2.5초", basis: "baseline 30 / optimized 100 cold" },
    { category: "Latency", metric: "첫 실제 사진 p95", before: "17.6초", after: "2.6초", basis: "동일 Preview·profile" },
    { category: "Traffic", metric: "관측 전송량 / run", before: "3,125KB", after: "328KB", basis: "CDP encodedDataLength" },
    { category: "Reliability", metric: "첫 사진 성공률", before: "30 / 30", after: "100 / 100", basis: "실패 표본 포함" },
  ],
  architecture: {
    title: "AI-assisted 성능 실험과 사람 검증 경계",
    description: "AI는 runner와 이미지 정책 구현을 도왔지만, 환경 고정·표본 채택·오류 판정·한계 해석은 사람이 통제했습니다. 좋은 값만 고르지 않고 측정 race가 있던 전체 결과를 폐기한 뒤 다시 실행했습니다.",
    columns: [
      { title: "측정 대상", nodes: [{ label: "배포 환경", detail: "같은 Vercel Preview URL" }, { label: "테스트 데이터", detail: "사용자 DB와 분리한 이미지 묶음" }] },
      { title: "가상 Profile", nodes: [{ label: "Device", detail: "390×844·DPR 2·CPU 4×" }, { label: "Network", detail: "RTT 150ms·1.6Mbps" }] },
      { title: "표본 생성", nodes: [{ label: "Sampling", detail: "optimized 100·baseline 30" }, { label: "Cold", detail: "매회 fresh context·동시성 1" }] },
      { title: "Evidence", nodes: [{ label: "Metrics", detail: "LCP·첫 사진·KB·오류" }, { label: "Raw", detail: "sample JSON·환경 meta·SHA-256" }] },
    ],
    flow: ["Production과 분리된 Vercel Preview URL과 테스트용 이미지 묶음을 만듭니다.", "기기·네트워크·commit을 고정하고 mode만 바꿔 반복 측정합니다.", "실패 표본과 환경 metadata를 raw JSON에 함께 남깁니다.", "측정 오류를 고친 뒤 전체를 다시 실행하고, 한 대의 PC에서 만든 반복 측정값으로만 해석합니다."],
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
