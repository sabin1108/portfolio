export type ResumeSection = {
  title: string;
  items: string[];
};

export type ProjectHighlight = {
  title: string;
  period: string;
  github: string;
  teamRole: string;
  description: string;
  techTags: string[];
  keyRoles: string;
  issues: string[];
  resolutions: string[];
  achievements: string[];
};

export type ActivityGroup = {
  title: string;
  venue?: string;
  href?: string;
  linkLabel?: string;
  items: string[];
};

export const resumeEliceData = {
  profile: {
    name: "민사빈",
    title: "Front-End Developer",
    image: "/minsbain.jpg",
    contacts: {
      email: "minsabin1108@gmail.com",
      github: "https://github.com/sabin1108",
    },
  },
  education: {
    school: "한경국립대학교",
    degree: "소프트웨어융합학과",
    status: "졸업",
    period: "2020.03 ~ 2026.02",
    gpa: "3.87 / 4.5",
    certificates: [
      {
        name: "정보처리기사",
        issuer: "한국산업인력공단",
        date: "2025.09.12",
      },
    ],
  },
  summary:
    `저는 호기심으로 넓게 기술을 배우려 하고, 판단으로 좁게 적용하는 프론트엔드 개발자 민사빈입니다. 궁금한 건 파보고 배우며, 적용은 엄격하게 판단합니다.

PhotoMap에서는 Context API를 Zustand Selector 구조로 전환해 리렌더링 범위를 70여 개 컴포넌트에서 5개 이하 컴포넌트로 좁히고 React Profiler 측정 기준 커밋 시간을 9.7ms에서 6.2ms로 약 36% 단축했고, @tanstack/react-virtual 기반 가상화로 DOM 노드를 200개 미만으로 유지하며 60FPS를 확보했습니다. D3 물리 시뮬레이션은 React State 대신 Ref와 DOM 직접 조작으로 처리해 리렌더링 횟수를 370회에서 25회로 줄였습니다.
Game Information Platform에서는 캐시 매니저 등 인프라 유틸리티에 제네릭을 적용해 여러 데이터 타입에 재사용 가능한 구조로 만들었습니다. 또한 Vitest 단위 테스트와 Playwright E2E, 로컬 부하 테스트 스크립트를 배포 파이프라인에 포함시켜 릴리즈 전 자동 검증 체계를 구축했습니다.
Fallow 정적 분석으로 중복 코드를 668줄에서 121줄로(약 82% 감소) 정리해 유지보수성도 함께 관리했습니다.

저는 화면 구현을 넘어 아키텍처와 품질을 함께 설계하는 프론트엔드 엔지니어로 성장하고 싶습니다. 지표 기반으로 성능을 진단·개선하고 설계했던 경험을 바탕으로, 유지보수 가능한 코드베이스와 팀의 개발 표준까지 함께 만들어가고 싶습니다. 나아가 AI 도구를 단순 생성기가 아닌 프로세스 차원에서 전략적으로 통합해온 경험을 살려, AI 기반 기능을 제품 흐름에 자연스럽게 녹여내는 엔지니어가 되어 여러 직군과 경계 없이 소통으로 조직에 기여하고 싶습니다.`,
  coreSkills: [
    { title: "Frontend", items: ["React.js", "Next.js", "TypeScript", "JavaScript"] },
    { title: "State & DB", items: ["Zustand", "Supabase", "Redis"] },
    { title: "Styling", items: ["Tailwind CSS", "Shadcn UI", "CSS"] },
    { title: "Tools", items: [] },
    { title: "Tools - 협업 툴", items: ["Notion", "Slack", "GitHub"] },
    { title: "Tools - 개발 및 빌드", items: ["VS Code", "Vite"] },
    { title: "Tools - 테스트 및 품질", items: ["Vitest", "Playwright", "Fallow"] },
    { title: "Tools - 배포 및 인프라", items: ["Vercel", "NCP"] },
    { title: "Tools - AI 툴", items: ["Gemini", "gemini code assist", "OpenAI API", "Codex", "Claude"] },
  ] satisfies ResumeSection[],
  projectHighlights: [
    {
      title: "Game Information Platform",
      period: "2026.05 ~ 2026.06",
      github: "https://github.com/sabin1108/Game-information-platform",
      teamRole: "개인 프로젝트 (1인 개발)",
      description: "Steam/Epic 게임 할인 조회 및 관심 상품 가격 추적 서비스",
      techTags: ["Next.js", "TypeScript", "React", "Supabase", "Vercel", "Vitest", "Playwright"],
      keyRoles: "서비스 전체 프론트엔드 설계 및 구현 / Supabase Auth/DB 연동 / 테스트 및 배포 환경 구축",
      issues: [
        "외부 API 응답 형식이 백엔드마다 다르고 수시로 변해, 프론트엔드 UI 컴포넌트와 API 간의 강한 결합이 생기고 유지보수가 까다로워졌습니다.",
        "출시 예정이거나 가격 미정인 신작 게임의 API 리턴값(0 또는 null)이 단순 비교 로직에서 '100% 할인'이나 '최저가 도달'로 오판되어 사용자 대시보드에 잘못된 알림이 노출되었습니다.",
        "외부 게임 가격 조회 API(ITAD) 서버에 일시적 장애가 나거나 호출 한도가 초과될 시 클라이언트 전체가 500 에러를 반환하며 마비되는 구조적 취약점이 존재했습니다."
      ],
      resolutions: [
        "API 호출 결과와 UI Layer 사이에 Adapter 패턴의 정규화 레이어를 구축하고, 비즈니스 로직과 View Model을 분리해 API 명세 변경 시 영향을 최소화하도록 아키텍처를 설계했습니다.",
        "game-score.ts에서 currentPriceCents > 0인 가격만 최저가 후보로 사용하도록 수정해, 0원·가격 미정 데이터가 할인/목표가 달성으로 오판되는 문제를 막았습니다.",
        "fresh TTL(5분) 만료 이후에도 최대 6시간 동안 데이터를 유지하는 stale-safe 캐시 모듈을 작성해, 외부 API 실패 시 stale 데이터로 자동 폴백(Fallback)하도록 설계했습니다.",
        "Vitest로 API route, 정규화 함수, cache hit/miss/stale, rate limit, 목표가 계산을 검증하고, Playwright로 홈·인증·관심 목록·모바일 웹뷰 흐름을 E2E 시나리오로 확인했습니다."
      ],
      achievements: [
        "소스 코드 중복율 81.9% 감소(668줄 → 121줄), Fallow 정적 분석 기준 미사용 파일/export(dead-code)를 15개에서 0개로 완전 제거하여 유지보수성 점수를 91.3점에서 92.1점으로 높였습니다.",
        "외부 API 장애 상황에서도 중단 없이 stale 데이터로 지속 대응하는 안정적인 서비스 회복 탄력성을 확보했습니다.",
        "Vitest 단위 테스트 및 Playwright E2E/웹뷰 시나리오, 로컬 부하 검증 스크립트를 배포 파이프라인에 포함해 릴리즈 전 자동 무장애 검증 체계를 마련했습니다.",
        "unit/component/API/E2E spec 25개 파일과 69개 케이스를 정리했고, 주요 리팩터 검증에서 Vitest 21 files / 60 tests 통과 기록을 남겨 회귀 위험을 낮췄습니다."
      ]
    },
    {
      title: "PhotoMap",
      period: "2025.12 ~ 2026.04",
      github: "https://github.com/sabin1108/Photomap",
      teamRole: "3인 협업 (FE 1명, BE 2명 / FE 최적화 및 상태 아키텍처 담당)",
      description: "대용량 사진 데이터를 지도 기반으로 탐색하는 웹 서비스",
      techTags: ["React", "TypeScript", "Zustand", "D3.js"],
      keyRoles: "상태 관리 구조 개선 / 렌더링 성능 최적화 / D3 시각화 구현",
      issues: [
        "5,000건 이상의 고해상도 이미지 데이터 로딩 시 브라우저 내 DOM 노드가 과다해져 스크롤 프레임이 심하게 끊어지고 브라우저가 일시 프리징되는 병목이 생겼습니다.",
        "Context API 기반 전역 상태 설계로 인해, 특정 사진 한 장의 즐겨찾기 변경 같은 사소한 상태 업데이트에도 70여 개 하위 컴포넌트가 전부 리렌더링되어 렌더링 폭포 현상이 일어났습니다.",
        "D3.js 물리 시뮬레이션의 실시간 변동 좌표(tick)를 React state에 바인딩하면서 Virtual DOM 비교 연산 오버헤드로 인해 심각한 프레임 드랍이 유발되었습니다.",
        "사용자가 노드 그래프 뷰에서 다른 화면으로 전환한 뒤에도 D3 시뮬레이션 루프가 백그라운드에서 CPU 자원을 지속적으로 점유하고 메모리 누수가 발생했습니다."
      ],
      resolutions: [
        "@tanstack/react-virtual을 도입하여 뷰포트 가시 영역 내의 row만 DOM에 실시간 유지하는 가상 그리드(Virtualized Grid)를 구축하고 transform 절대 배치로 리플로우를 방지했습니다.",
        "상태 관리를 Zustand로 전면 개편하고, 컴포넌트별로 상태 슬라이스만 구독하는 Selector 패턴 및 useShallow를 적용해 무관한 리렌더링을 차단했습니다.",
        "D3 좌표 연산과 React 렌더 사이클을 완전히 격리하여, SVG 요소를 Ref로 바인딩하고 tick 이벤트 내부에서 style.setProperty와 setAttribute로 DOM 속성을 직접 조작했습니다.",
        "useEffect cleanup 함수를 통해 탭 전환 시 D3 물리 엔진 인스턴스의 simulation.stop()을 호출하고 모든 리스너와 바인딩을 해제하는 안전한 수명 주기 클린업을 구현했습니다.",
        "BE 2명과 협업하며 서버의 사진·위치·카테고리 데이터 흐름은 유지하고, FE 상태 구독 범위와 렌더링 방식을 조정해 팀 전체 수정 범위를 줄였습니다."
      ],
      achievements: [
        "10,000건 이상의 대량 이미지 데이터를 처리할 때도 DOM 노드를 200개 이하로 상시 제어하며 안정적인 60FPS 수준의 부드러운 스크롤 성능을 확보했습니다.",
        "React Profiler 측정 기준 컴포넌트 렌더링 커밋 시간을 약 36% 단축(9.7ms → 6.2ms)시켰습니다.",
        "물리 시뮬레이션의 React 리렌더링 횟수를 기존 370회에서 25회 수준으로 줄여 장기 실행 안정성을 개선했습니다.",
        "백엔드 데이터 구조 변경 없이 프론트엔드 병목을 분리해 해결하며, 팀원이 제공한 데이터 계약을 유지한 채 화면 성능 문제를 개선했습니다.",
        "FE-BE 역할 경계를 데이터 계약과 렌더링 책임 기준으로 나눠, 병목 원인과 수정 범위를 팀 안에서 명확히 설명할 수 있는 협업 기준을 만들었습니다."
      ]
    },
    {
      title: "AI ChatBot",
      period: "2025.09.10 ~ 2025.11.14",
      github: "https://github.com/sabin1108/graduation-project",
      teamRole: "2인 협업 (FE 1명, BE 1명 / FE 채팅 UI 및 API 연동 담당)",
      description: "학사 정보(식단, 공지, 학사일정)를 수집·안내하는 AI 챗봇 서비스",
      techTags: ["Next.js (App Router)", "TypeScript", "Tailwind CSS", "Shadcn UI", "React-Markdown", "Blob API"],
      keyRoles: "채팅 UI 및 AI 응답 파싱 파이프라인 구현 / API 응답 정규화 프록시 레이어 설계 / 서버 없는 로컬 대화 저장·동기화 구조 구축",
      issues: [
        "학사 공지에 포함된 긴 원시 URL이 채팅 말풍선에 그대로 노출되어 모바일 뷰포트에서 가로 스크롤이 생기거나 UI가 깨지는 문제가 있었습니다.",
        "다양한 포맷의 외부 API 응답 처리 로직이 UI 컴포넌트 내부에 산만하게 뒤섞여 코드 유지보수성이 낮았습니다.",
        "로그인이 없는 로컬스토리지 대화 관리 하에 여러 브라우저 탭을 띄우고 대화할 때 탭 간 데이터가 상호 덮어쓰는 상태 꼬임 현상이 생겼습니다.",
        "대화 내역 내보내기 시 학사 정보나 대화 텍스트가 외부 서버에 임시 저장되거나 전송될 경우 보안 및 개인정보가 유출되는 심각한 문제가 있었습니다."
      ],
      resolutions: [
        "Markdown 파서가 생성하는 a 태그에 word-break: break-all 등 CSS를 적용하고, 메시지 전처리 단계에서 정규식으로 긴 URL을 [관련 링크 바로가기] 형태로 치환하는 파이프라인을 구현했습니다.",
        "Next.js API Routes 내에 Proxy Layer를 구축해, 외부 API의 서로 다른 응답 포맷을 백엔드 호출 시점에 표준 스키마로 정규화한 뒤 클라이언트에는 단일 JSON 구조로만 내려주도록 설계했습니다.",
        "useEffect 내에서 window.addEventListener('storage', ...)로 다른 탭의 로컬스토리지 변경을 실시간 감지해, 비활성 탭의 React state를 즉각 동기화하도록 구현했습니다.",
        "대화 내역 내보내기 기능은 서버 전송 없이 브라우저 Blob API와 URL.createObjectURL을 연동해 클라이언트 메모리 내에서 대화 내역 저장/복원/내보내기 파일 생성을 처리하여 다운로드 후 메모리를 해제하도록 구현했습니다.",
        "BE 담당자와 API 응답 경계를 맞추며 공지·식단·일정 응답을 채팅 UI가 다루기 쉬운 메시지 구조로 정리해 FE-BE 수정 지점을 분리했습니다."
      ],
      achievements: [
        "메시지 뷰 내 지저분한 URL 노출률을 최대 90% 감소시켜 모바일 UI 안정성과 가독성을 높였습니다.",
        "API 정규화 레이어 도입으로 UI 코드량 약 30% 절감, API 규격 변경 시 대응 지점을 프록시 레이어 1곳으로 단일화했습니다.",
        "인프라 유지 비용 0원(Zero Server Cost)으로 로컬 탭 간 정합성이 실시간 일치하며, 대화 데이터가 브라우저 외부로 전송되거나 노출되지 않는 철저한 개인정보 보호 구조를 완성했습니다.",
        "2인 협업에서 백엔드 응답 포맷 차이를 프론트엔드 경계 계층에서 흡수해, 채팅 입력·메시지 목록·공지 표시 컴포넌트의 수정 범위를 줄였습니다.",
        "백엔드 담당자는 데이터 수집과 응답 제공에 집중하고, 프론트엔드는 대화 흐름과 표시 안정성에 집중할 수 있도록 협업 경계를 정리했습니다."
      ]
    }
  ] satisfies ProjectHighlight[],
  activityGroups: [
    {
      title: "BRIGHT MAKERS EXPO 2025 캡스톤디자인 경진대회 우수상",
      venue: "한경국립대학교",
      items: [
        "제17회 캡스톤디자인 경진대회 팀 캔버스 참가, 학사 정보 접근성 개선 AI ChatBot 서비스 발표",
        "공지, 학식, 일정처럼 흩어진 정보를 채팅 흐름으로 연결해 필요한 정보를 빠르게 찾는 문제 해결 방향 제시",
        "프론트엔드 UI, 응답 가독성 개선, 대화 내역 관리 기능을 실제 사용 흐름으로 구현한 점을 성과로 인정",
      ],
    },
    {
      title: "생성형 AI 기반 포트폴리오 요약 플랫폼",
      venue: "대한전자공학회 투고 및 심사 완료",
      href: "/files/thesis/generative-ai-portfolio-summary-platform.pdf",
      linkLabel: "논문 PDF",
      items: [
        "AI 스트리밍 구조 적용, 평균 TTFT 18,279ms -> 607ms 개선 및 체감 대기시간 약 96.7% 단축 성능 평가",
        "컴포넌트·라우트 분리로 관리자 대시보드 LoC 231줄 -> 172줄 감소, 구조적 가독성 약 40%+ 개선 근거 정리",
        "생성형 AI 요약, 지식 기반 검증, DB 저장, 시각화 흐름을 분리한 AI 활용 및 유지보수 가능 아키텍처 중심 구성",
      ],
    },
    {
      title: "학교 정보 접근성 향상을 위한 대화형 질의응답 시스템",
      venue: "대한전자공학회 2025 하계종합학술대회 포스터/논문 발표",
      href: "/files/thesis/interactive-campus-qa-system.pdf",
      linkLabel: "논문 PDF",
      items: [
        "학사 정보 접근성 개선을 위해 공지, 일정, 행정 정보를 질의응답 흐름으로 연결하는 사용자 흐름 설계",
        "AI 응답 직접 노출 대신 응답 파싱, 링크 정리, 메시지 구조화 적용으로 URL 텍스트 노출 최대 90% 절감",
        "외부 데이터와 UI 결합도 완화를 위한 응답 정규화 계층 구성, UI 코드량 약 30% 절감 관점 정리",
      ],
    },
  ] satisfies ActivityGroup[],
  motivation:
    `엘리스 프론트엔드팀은 대규모 트래픽과 복잡한 상태/권한 관리 속에서 아키텍처와 성능 지표를 함께 설계·진단해야 하는 팀으로 조사했습니다. 저는 PhotoMap에서 실제로 지표 기반 성능 개선과 Zustand를 활용한 복잡한 상태 아키텍처 설계를 주도해본 경험이 있고, AI 도구를 코드 생성 단계가 아닌 개발 프로세스 전반에 통합해 생산성을 높여온 경험도 있습니다. 이 두 경험을 바탕으로 엘리스의 확장 가능한 컴포넌트 구조 설계와 AI 기반 기능 통합에 곧바로 기여할 수 있다고 판단해 지원하게 되었습니다.`,
} as const;
