import { resumeData } from "./resume";

const lsscMotivation = `LSSC에 지원한 이유는 여러 자체 브랜드를 동시에 운영하는 미디어커머스 환경에서, 개발자가 상품·콘텐츠·판매 흐름을 빠르게 연결하는 역할을 할 수 있다고 봤기 때문입니다. 브랜드와 카테고리가 늘어날수록 운영 데이터, 고객 접점 화면, 내부 관리 도구가 함께 복잡해지기 때문에 화면 구현만이 아니라 데이터 계약과 API 경계를 안정적으로 잡는 개발 역량이 중요하다고 생각했습니다.

제가 기여할 수 있는 일은 세 가지입니다. 첫째, Game Information Platform에서 외부 API 3종의 응답 차이를 공통 view model로 정리한 경험을 바탕으로 브랜드별 데이터 흐름이 화면에 직접 새지 않도록 경계를 만들 수 있습니다. 둘째, PhotoMap에서 LCP 63,804ms를 4,150ms로 줄이고 초기 payload를 12,586KiB에서 381KiB로 낮춘 경험을 바탕으로 고객이 직접 보는 페이지의 로딩 병목을 수치로 추적하고 개선할 수 있습니다. 셋째, Vitest 21개 파일 60개 테스트와 Playwright 흐름 검증, Fallow 기반 중복 코드 1,006줄에서 308줄 감소 경험을 바탕으로 빠르게 만든 기능도 검증 가능한 상태로 유지할 수 있습니다.

입사 후에는 LSSC의 브랜드 운영과 고객 경험을 연결하는 웹 기능, 사내 업무를 줄이는 관리 도구, 데이터 기반 의사결정을 돕는 화면을 빠르게 구현하고 싶습니다. 단순히 기능을 붙이는 데서 끝내지 않고, 문제가 생겼을 때 원인을 좁혀 다시 개선할 수 있는 구조와 검증 흐름까지 함께 만드는 개발자로 기여하겠습니다.`;

const lsscProjectHighlights = resumeData.projectHighlights.map((project) => {
  if (project.title === "Game Information Platform") {
    return {
      ...project,
      keyRoles:
        "Next.js 화면/API route 설계 및 구현 / 외부 API 응답 정규화 / 캐시·rate limit·테스트 기반 안정화",
      issues: [
        "Steam/Epic/ITAD API 응답 구조가 달라 화면 컴포넌트가 API별 예외 처리에 묶일 위험이 있었습니다.",
        "0원/null/가격 미정 데이터가 최저가나 목표가 달성 상태로 잘못 표시될 수 있었습니다.",
        "외부 API timeout, 호출 제한, 반복 요청이 검색·할인 화면 장애로 바로 이어질 수 있었습니다.",
        "기능 확장 과정에서 테스트 중복과 미사용 export가 남아 유지보수 비용이 커질 수 있었습니다.",
      ],
      resolutions: [
        "Adapter/Normalizer 계층과 공통 view model을 두어 UI가 외부 API 포맷을 직접 알지 않게 정리했습니다.",
        "currentPriceCents > 0인 가격만 후보로 사용하고, 가격 미정 케이스를 테스트로 검증했습니다.",
        "stale cache와 fixed-window rate limit을 route 경계에 두고 API route, 가격 계산, 캐시, 관심 목록 흐름을 Vitest/Playwright로 확인했습니다.",
        "Fallow 정적 분석으로 미사용 파일/export와 중복 코드를 추적하고 정리 우선순위를 잡았습니다.",
      ],
      achievements: [
        "검색, 할인 목록, 상세, 관심 목록이 정규화된 데이터만 사용하도록 만들어 API 변경 시 수정 범위를 줄였습니다.",
        "0원/null 가격 오판 경로를 차단해 실제 구매 가능한 가격 후보가 있을 때만 할인·목표가 정보를 보여주도록 했습니다.",
        "Vitest 21 files / 60 tests 통과 기록과 Playwright 기반 주요 사용자 흐름 검증으로 기능 단위 구현·검증 흐름을 만들었습니다.",
        "unused files 1개와 unused exports 11개를 0개로 정리하고, 중복 코드를 1,006줄(9.4%)에서 308줄(2.9%)로 낮췄습니다.",
      ],
    };
  }

  if (project.title === "PhotoMap") {
    return {
      ...project,
      keyRoles:
        "React 상태 구조 개선 / 지도·사진·WebGL 렌더링 경계 분리 / Vercel 기준 성능 병목 개선",
      issues: [
        "지도, 대량 사진, D3 관계 그래프, Unity WebGL iframe이 함께 동작하며 상태 변경과 렌더링 책임이 섞였습니다.",
        "Context API 기반 전역 상태 때문에 작은 상태 변경에도 넓은 범위의 컴포넌트가 다시 렌더링되었습니다.",
        "초기 이미지 전송량과 지도 marker 초기화/클릭 이동 race로 사용자가 직접 보는 진입·탐색 안정성이 흔들렸습니다.",
        "5,000건 이상의 고해상도 사진 구간에서 DOM 노드와 이미지 카드 렌더링 비용이 스크롤 프레임 저하로 이어졌습니다.",
      ],
      resolutions: [
        "Zustand selector 구조로 필요한 상태 slice만 구독하게 바꾸고, D3 tick 업데이트를 React state 밖으로 분리했습니다.",
        "@tanstack/react-virtual과 이미지 카드 메모이제이션으로 대량 사진 구간의 DOM·렌더링 부담을 줄였습니다.",
        "Supabase image transform, preload/preconnect, public demo seed, marker payload 재전송과 style load 이후 적용으로 Vercel 기준 진입 흐름을 보정했습니다.",
        "보이는 사진 구간만 DOM에 유지하도록 가상화하고, 이미지 카드 메모이제이션으로 반복 렌더링 부담을 줄였습니다.",
      ],
      achievements: [
        "React Profiler 기준 리렌더링 범위를 70여 개 컴포넌트에서 5개 이하로 줄이고 커밋 시간을 9.7ms에서 6.2ms로 낮췄습니다.",
        "Lighthouse 측정 기준 Performance 50점에서 77점, LCP 63,804ms에서 4,150ms, 초기 payload 12,586KiB에서 381KiB까지 개선한 기록을 확보했습니다.",
        "지도 marker 초기화와 cluster 클릭 이동 보정까지 정리해 사용자가 체감하는 지도 인터랙션 안정성을 개선했습니다.",
        "대량 이미지 구간에서도 DOM 노드를 약 200개 수준으로 유지해 브라우저가 감당해야 하는 렌더링 범위를 고정했습니다.",
      ],
    };
  }

  if (project.title === "AI ChatBot") {
    return {
      ...project,
      keyRoles:
        "채팅 UI 구현 / Fallback 선택지 흐름 / Next.js API route proxy / 응답 가독성·로컬 저장 흐름 개선",
      issues: [
        "모호한 질문이 들어왔을 때 AI가 의도를 좁히지 못하고, 공지·식단·일정 데이터와 긴 URL이 섞이며 모바일 채팅 UI를 깨뜨렸습니다.",
        "외부 백엔드 응답 형식 차이를 UI 컴포넌트가 직접 처리하면 수정 범위가 계속 커질 수 있었습니다.",
        "로그인 없는 구조에서도 새로고침 후 대화 복원과 사용자가 필요한 대화 내역 내보내기가 필요했습니다.",
        "전시용 서비스로 보여주기 위해 학식·공지·일정·빠른 링크를 한 흐름에서 탐색할 수 있는 방향이 필요했습니다.",
      ],
      resolutions: [
        "Fallback 선택지 UI로 질문 범위를 좁히고, ReactMarkdown과 markdown link 변환으로 긴 URL과 목록형 응답을 읽기 쉬운 메시지 구조로 바꿨습니다.",
        "Next.js API Routes를 proxy layer로 두어 UI는 메시지 표시와 상호작용에 집중하도록 분리했습니다.",
        "localStorage 기반 대화 복원, storage event 동기화, Blob API 기반 txt 내보내기 흐름을 구현했습니다.",
        "카카오톡 챗봇과 웹페이지형 챗봇을 비교한 뒤, 전시 가능성과 기능 확장성을 고려해 웹 기반 챗봇 UI로 방향을 정했습니다.",
      ],
      achievements: [
        "공지 링크와 학사 정보를 모바일 채팅 말풍선 안에서 읽기 쉬운 구조로 보여주도록 개선했습니다.",
        "FE-BE 응답 경계를 나누어 백엔드 응답 형식 변화가 UI 전체 수정으로 번지는 위험을 줄였습니다.",
        "학교 정보 접근성 개선 AI ChatBot 서비스로 BRIGHT MAKERS EXPO 2025 캡스톤디자인 경진대회 우수상을 받았습니다.",
        "공지, 학식, 일정처럼 흩어진 정보를 채팅 흐름으로 연결해 사용자가 필요한 정보를 빠르게 찾는 방향을 제시했습니다.",
      ],
    };
  }

  return project;
});

export const resumeLsscData = {
  ...resumeData,
  profile: {
    ...resumeData.profile,
    title: "Full-Stack Developer",
  },
  summary:
    `문제를 먼저 구조화하고, 화면 구현부터 API 경계, 데이터 흐름, 테스트까지 함께 다루는 풀스택 지향 개발자 민사빈입니다.

Game Information Platform에서는 Steam/Epic/ITAD 외부 API 3종의 응답 차이를 adapter/normalizer와 공통 view model로 정리해 UI가 API별 예외에 직접 묶이지 않도록 만들었습니다. 0원/null 가격 오판을 방어하고, stale cache와 rate limit을 route 경계에 두었으며, Vitest 21개 파일 60개 테스트와 Playwright 흐름 검증으로 가격 계산·캐시·관심 목록·모바일 플로우를 확인했습니다. Fallow 정적 분석으로 중복 코드는 1,006줄(9.4%)에서 308줄(2.9%)로 줄이고, 미사용 파일 1개와 미사용 export 11개를 0개로 정리했습니다.

PhotoMap에서는 지도, 사진, 타임라인, WebGL 화면이 함께 동작하는 구조에서 성능 병목을 수치로 분리했습니다. Lighthouse 기준 Performance를 50점에서 77점으로 올리고, LCP를 63,804ms에서 4,150ms로 줄였으며, 초기 payload를 12,586KiB에서 381KiB로 낮췄습니다. Context API를 Zustand selector 구조로 전환해 리렌더링 범위를 70여 개 컴포넌트에서 5개 이하로 줄이고, React Profiler 기준 commit 시간을 9.7ms에서 6.2ms로 낮췄습니다. D3 force simulation 업데이트는 React state 밖으로 분리해 렌더링 횟수를 370회에서 25회로 줄였습니다.` ,
  motivation: lsscMotivation,
  coreSkills: [
    { title: "Frontend", items: ["React.js", "Next.js", "TypeScript", "JavaScript"] },
    { title: "Backend & API", items: ["Node.js", "Next.js API Routes", "REST API", "external API integration"] },
    { title: "State & Data", items: ["Zustand", "Supabase", "PostgreSQL", "Redis", "data normalization"] },
    { title: "Styling", items: ["Tailwind CSS", "Shadcn UI", "CSS"] },
    { title: "Tools - 협업", items: ["Notion", "Slack", "GitHub", "Git"] },
    { title: "Tools - 개발/검증", items: ["VS Code", "Vite", "npm", "Vitest", "Playwright", "Lighthouse", "Fallow"] },
    { title: "Tools - 배포/인프라", items: ["Vercel", "NCP"] },
    { title: "Tools - AI 개발", items: ["Codex", "Claude Code", "OpenAI API", "Gemini"] },
  ],
  activityGroups: resumeData.activityGroups.map((group) => {
    if (group.title === "생성형 AI 기반 포트폴리오 요약 플랫폼") {
      return {
        ...group,
        items: [
          "Vercel AI SDK 기반 스트리밍 연동과 기술 스택 DB 교차 검증 흐름을 설계했습니다.",
          "AI 추출 데이터의 비표준 명칭을 필터링/치환하는 검증 레이어로 데이터 왜곡 위험을 줄였습니다.",
          "컴포넌트·라우트 분리로 관리자 대시보드 LoC 231줄 -> 172줄 감소, 구조적 가독성 약 40%+ 개선 근거를 정리했습니다.",
        ],
      };
    }

    return group;
  }),
  projectHighlights: lsscProjectHighlights,
};