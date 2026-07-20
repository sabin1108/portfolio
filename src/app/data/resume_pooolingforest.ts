import { resumeData } from "./resume";

const pooolingforestMotivation = `풀링포레스트 공고를 보며 가장 먼저 눈에 들어온 것은 “문제 해결이 먼저이고, 코딩은 수단”이라는 관점이었습니다. 정해진 요청을 구현하는 데서 멈추지 않고, 스스로 문제를 좁혀 보고 해결 결과까지 책임지는 태도를 중요하게 본다는 점도 제가 프로젝트를 진행해온 방식과 맞았습니다.

저는 기능을 먼저 많이 붙이기보다, 사용자가 막히는 지점과 코드 구조상 변경 비용이 커지는 지점을 먼저 찾으려고 합니다. Game Information Platform에서는 외부 API 응답 차이가 가격 오판으로 이어질 위험을 Adapter/Normalizer와 테스트로 막았습니다. AI ChatBot에서는 백엔드 응답 형식 차이가 채팅 UI 예외 처리로 번지지 않도록 API 응답 경계를 분리했습니다. PhotoMap에서는 대량 이미지 탐색의 병목을 이미지 전송량, DOM 노드 수, 상태 구독 범위로 나눠 측정하고 개선했습니다.

AI Agent 솔루션 페이지에서 말하는 중앙 Agent Backend, 데이터·업무 흐름·권한 연결, Human-in-the-Loop 구조도 인상 깊었습니다. AI를 단순 답변 화면으로 붙이는 것이 아니라, 조직의 데이터와 실행 흐름 안에서 신뢰할 수 있게 쓰이도록 만드는 방향이라고 이해했습니다. 이력서 두 번째 프로젝트인 AI ChatBot에서 공지·식단·일정 데이터를 채팅 UI로 연결하며 FE와 BE 책임을 나누고, 대화 기록 복원과 사용자가 필요한 대화 내역을 직접 내보내는 흐름을 만든 경험이 이 방향과 맞닿아 있다고 봤습니다.

Game Information Platform에서의 Next.js·Node.js 기반 API 경계 분리와 테스트 검증, AI ChatBot에서의 응답 경계 설계, PhotoMap에서의 성능 측정과 상태 구조 개선 경험을 바탕으로 풀링포레스트에서도 빠르게 만들되 근거 없이 밀어붙이지 않고, 문제정의와 검증 결과를 기준으로 제품을 개선하는 FullStack Developer로 기여하고 싶습니다.`;

export const resumePooolingforestData = {
  ...resumeData,
  profile: {
    ...resumeData.profile,
    title: "FullStack Developer",
  },
  summary: `문제를 그냥 넘기지 않고, 원인을 나눠 검증하는 개발자 민사빈입니다.

저는 단순히 기능을 구현하는 것보다 사용자가 어떤 지점에서 잘못된 정보를 보거나 흐름이 막히는지, 그리고 그 문제가 코드 구조 안에서 왜 반복되는지를 먼저 보려고 합니다. 궁금한 기술은 직접 파보되, 실제 적용은 지표와 유지보수성으로 판단합니다.

Game Information Platform에서는 Steam, Epic, ITAD 가격 데이터 차이로 인해 사용자가 잘못된 최저가나 목표가 달성 상태를 볼 수 있는 문제가 있었습니다. 화면이 외부 API 포맷을 직접 알면 카드, 상세, 관심목록마다 예외 처리가 늘어난다고 판단해 Adapter/Normalizer 계층과 공통 view model로 정리했습니다. currentPriceCents > 0인 가격만 후보로 사용했고, 0원/null/가격 미정 케이스는 Vitest로 검증했습니다. CI에는 typecheck, lint, Vitest, production build, Playwright smoke 테스트를 구성했고, Fallow 정적 분석으로 중복 코드를 1,006줄(9.4%)에서 308줄(2.9%)로 줄였습니다.

AI ChatBot에서는 공지, 식단, 일정 데이터를 백엔드가 각각 다른 방식으로 수집하면서 응답 형태가 일정하지 않은 문제가 있었습니다. 프론트엔드가 이를 그대로 받으면 채팅 UI 안에 데이터별 예외 처리가 계속 늘어나는 구조라고 판단했습니다. Next.js API Routes를 응답 경계로 두고, UI 컴포넌트는 메시지 표시와 사용자 상호작용에 집중하도록 분리했습니다. localStorage로 대화 기록을 복원하고, Blob API로 사용자가 필요한 대화 내역을 직접 내보낼 수 있게 했습니다. 이 프로젝트로 BRIGHT MAKERS EXPO 2025 캡스톤디자인 경진대회 우수상을 받았습니다.

PhotoMap에서는 5,000건 이상의 고해상도 사진을 지도, 앨범, 타임라인에서 탐색할 때 초기 로딩과 스크롤 프레임 저하가 발생했습니다. Supabase image transform, @tanstack/react-virtual, Zustand selector 구조를 적용해 Lighthouse Performance score를 50점에서 77점으로 높이고, LCP를 63,804ms에서 4,150ms로 낮췄습니다. Context API를 Zustand selector 구조로 바꿔 리렌더링 범위를 70여 개 컴포넌트에서 5개 이하로 좁혔고, React Profiler 기준 커밋 시간은 9.7ms에서 6.2ms로 줄였습니다.

앞으로도 반복해서 확인해야 하는 일은 구조와 자동화로 줄이고, 팀이 더 중요한 판단과 제품 개선에 집중할 수 있는 기반을 만들고 싶습니다. 제품의 사용 흐름과 실패 지점을 기준으로 개선 방향을 제시하고, 그 판단이 다시 검증 가능한 기준으로 남도록 일하겠습니다.`,
  coreSkills: resumeData.coreSkills.map((group) =>
    group.title === "Frontend"
      ? { ...group, items: ["React", "TypeScript", "Next.js", "JavaScript", "HTML5", "CSS3"] }
      : group.title === "State & DB"
        ? { ...group, items: ["Zustand", "Supabase", "SQL", "Redis", "API Routes"] }
        : group.title === "Tools - 개발 및 빌드"
          ? { ...group, items: ["Node.js", "Vite", "Docker", "Vercel", "GitHub"] }
          : group.title === "Tools - 테스트 및 품질"
            ? { ...group, items: ["Vitest", "Playwright", "Lighthouse", "React Profiler", "Fallow"] }
            : group
  ),
  projectHighlights: resumeData.projectHighlights.map((project) => {
    if (project.title === "Game Information Platform") {
      return {
        ...project,
        techTags: ["Next.js", "TypeScript", "React", "Node.js", "Supabase", "SQL", "Vitest", "Playwright"],
        keyRoles: "가격 데이터 정규화 / 목표가 오판 방어 / 외부 API 장애 완충 / 테스트 기반 검증",
        issues: [
          "문제정의: 사용자는 여러 스토어의 가격을 한 화면에서 비교하려고 들어오지만, Steam/Epic/ITAD의 식별자·가격·할인율·상점 링크 필드가 달라 카드, 상세, 관심목록 화면이 API별 예외를 직접 알아야 했습니다.",
          "문제정의: 출시 예정, 가격 미정, 데이터 미제공 게임의 0원/null 값이 최저가나 목표가 달성 상태로 오판될 수 있어 가격 비교 서비스의 신뢰도를 떨어뜨릴 위험이 있었습니다.",
        ],
        resolutions: [
          "가설 수립: 카드, 상세, 관심목록 화면이 외부 API 포맷을 직접 아는 것이 구조적 원인이라고 봤습니다. 중간에 공통 view model을 두면, 화면은 API 변경과 무관하게 동작할 것이라고 가정했습니다.",
          "가설 수립: 0원/null 가격 오판은 가격 후보의 유효성 기준이 불명확해서 생긴 문제라고 봤습니다. 구매 가능한 양수 가격만 후보로 제한하면 목표가 달성 판단의 신뢰도를 높일 수 있다고 가정했습니다.",
          "액션 및 검증: Adapter/Normalizer 계층을 만들고 GameSummary, StoreProduct 같은 공통 모델로 변환했습니다. Steam/Epic/ITAD 응답 차이를 정규화 함수 테스트로 확인했습니다.",
          "액션 및 검증: currentPriceCents > 0인 가격만 best price 후보로 쓰고, 후보가 없으면 목표가 매칭을 false로 처리했습니다. 0원/null/가격 미정 케이스를 Vitest로 검증했습니다.",
          "액션 및 검증: stale cache와 fixed-window rate limit을 route 경계에 추가해 외부 API 실패와 반복 호출을 완충했습니다. cache hit/miss/stale, rate limit 케이스를 테스트했습니다.",
        ],
        achievements: [
          "결과: 0원/null 가격이 최저가나 목표가 달성 상태로 표시되는 경로를 차단해 가격 정보의 신뢰도를 높였습니다.",
          "정량 결과: Vitest 21 files / 60 tests 통과 기록을 남겼고, Playwright로 인증, 관심목록, 모바일 필터 등 주요 사용자 흐름을 확인했습니다.",
          "성공 판단 기준: UI가 API별 예외를 직접 처리하지 않고 공통 view model만 소비하며, 가격 미정 데이터가 구매 가능한 최저가로 표시되지 않으면 성공으로 봤습니다.",
          "러닝포인트: 이후 API 연동 기능을 볼 때 먼저 '화면이 외부 데이터 포맷을 직접 알고 있는가'를 확인하게 됐고, 가격·상태처럼 사용자 판단에 영향을 주는 값은 normalizer와 테스트를 먼저 두는 원칙을 세웠습니다.",
        ],
      };
    }

    if (project.title === "AI ChatBot") {
      return {
        ...project,
        techTags: ["Next.js", "TypeScript", "React", "Node.js", "API Routes", "React-Markdown", "localStorage", "Blob API"],
        keyRoles: "학교 정보 접근성 개선 / 채팅 UI / API 경계 분리 / 로컬 대화 저장·내보내기",
        issues: [
          "문제정의: 공지, 식단, 일정 데이터를 백엔드가 각각 다른 방식으로 수집하면서 응답 형태가 일정하지 않았고, 프론트엔드가 이를 그대로 받으면 채팅 UI 안에 데이터별 예외 처리가 계속 늘어나는 구조였습니다.",
          "문제정의: 2인 협업에서 백엔드는 데이터 수집과 응답 생성을 맡고 프론트엔드는 채팅 경험을 구현해야 했기 때문에, API 응답 경계가 흐리면 작은 응답 형식 변경도 UI 수정으로 이어질 위험이 있었습니다.",
        ],
        resolutions: [
          "가설 수립: 채팅 UI 예외 처리가 늘어나는 원인은 공지·식단·일정 응답을 화면이 각각 다르게 해석해야 하는 구조라고 봤습니다. 백엔드 응답을 UI가 소비하기 쉬운 형태로 모으면 예외 처리를 줄일 수 있다고 가정했습니다.",
          "가설 수립: 협업 중 변경 전파가 커지는 원인은 FE와 BE 사이의 API 응답 경계가 흐린 점이라고 봤습니다. route/API 계층에 경계를 두면 백엔드 변경이 UI 컴포넌트로 번지는 범위를 줄일 수 있다고 가정했습니다.",
          "액션 및 검증: Next.js API Routes를 proxy layer로 두고 백엔드 응답을 채팅 UI가 소비하기 쉬운 형태로 받게 했습니다. UI 컴포넌트는 메시지 표시와 사용자 상호작용에 집중하도록 분리했습니다.",
          "액션 및 검증: ReactMarkdown과 remark-gfm으로 긴 URL, 공지 링크, 목록형 답변을 모바일에서 읽기 쉬운 문단과 링크 형태로 표시했습니다.",
          "액션 및 검증: useLocalStorage hook과 storage 이벤트로 대화 기록 복원과 탭 간 상태 동기화를 처리하고, Blob API로 사용자가 필요한 대화 내역을 직접 내보낼 수 있게 했습니다.",
        ],
        achievements: [
          "결과: 학교 정보 접근성 개선 AI ChatBot 서비스로 BRIGHT MAKERS EXPO 2025 캡스톤디자인 경진대회 우수상을 받았습니다.",
          "정량·객관 결과: 논문과 발표 산출물 기준으로 공지·식단·일정 정보 접근 흐름, 채팅 UI, API 응답 경계, 로컬 대화 저장·내보내기 구조를 구현했습니다.",
          "성공 판단 기준: 처음 쓰는 사용자도 공지·학식·일정 기능 범위를 이해하고, 새로고침 뒤에도 대화 내역을 잃지 않으며, FE와 BE 변경이 한 컴포넌트에 함께 번지지 않으면 성공으로 봤습니다.",
          "러닝포인트: AI 기능은 모델 답변만 붙여서는 제품이 되기 어렵고, 데이터 출처·권한·저장 범위·사용자 확인 흐름을 함께 설계해야 신뢰할 수 있다는 기준이 생겼습니다. 이 점이 풀링포레스트 AI Agent의 업무 데이터·권한·Human-in-the-Loop 구조와 가장 잘 맞닿아 있다고 봤습니다.",
        ],
      };
    }

    if (project.title === "PhotoMap") {
      return {
        ...project,
        techTags: ["React", "TypeScript", "Zustand", "Supabase", "Mapbox", "@tanstack/react-virtual", "Lighthouse", "React Profiler"],
        keyRoles: "대량 이미지 탐색 UX 개선 / 렌더링 병목 분석 / 상태 구조 개선 / 성능 측정",
        issues: [
          "문제정의: 여행 사진이 많아질수록 사용자는 지도와 앨범을 빠르게 오가며 사진을 훑어야 했지만, 5,000건 이상의 고해상도 이미지 구간에서 초기 로딩과 스크롤 프레임 저하가 발생했습니다.",
          "문제정의: Context 기반 전역 상태와 Mapbox·Unity WebGL·canvas 렌더링이 같은 사용자 흐름에 얽혀, 작은 상태 변경에도 여러 화면이 함께 리렌더링될 위험이 있었습니다.",
        ],
        resolutions: [
          "가설 수립: 초기 로딩과 스크롤 저하는 원본급 이미지 전송량과 과도한 DOM 노드 수가 주요 원인이라고 봤습니다. preview 이미지 크기와 렌더링 노드 수를 줄이면 Lighthouse와 체감 스크롤이 함께 개선될 것이라고 가정했습니다.",
          "가설 수립: 작은 상태 변경에도 여러 화면이 리렌더링되는 원인은 전역 상태 구독 범위와 렌더링 책임이 넓게 묶인 점이라고 봤습니다. 필요한 slice만 구독하게 만들면 리렌더링 범위를 해당 화면으로 좁힐 수 있다고 가정했습니다.",
          "액션 및 검증: Supabase image transform fallback으로 preview 이미지를 320px급으로 요청하고, 상단 이미지만 eager/high priority로 두며 나머지는 lazy/async로 조정했습니다. Lighthouse로 전후 지표를 비교했습니다.",
          "액션 및 검증: @tanstack/react-virtual 기반 row 가상화로 보이는 구간만 DOM에 유지하고, 이미지 카드를 메모이제이션했습니다. 대량 사진 구간에서 DOM 노드 수가 고정되는지 확인했습니다.",
          "액션 및 검증: Context API 기반 전역 상태를 Zustand store와 useShallow selector 구조로 바꾸고, React Profiler로 상태 변경 리렌더링 범위와 커밋 시간을 다시 측정했습니다.",
        ],
        achievements: [
          "결과: Lighthouse Performance score를 50점에서 77점으로 개선했고, LCP를 63,804ms에서 4,150ms로 낮췄으며, 초기 payload를 12,586KiB에서 381KiB로 줄였습니다.",
          "정량 결과: 상태 변경 리렌더링 범위를 70여 개 컴포넌트에서 5개 이하로 줄이고, React Profiler 기준 커밋 시간을 9.7ms에서 6.2ms로 낮췄습니다.",
          "성공 판단 기준: 화면별 반응 범위를 해당 화면 관련 컴포넌트로 좁히고, 이미지 전송량과 DOM 노드 수를 줄였을 때 Lighthouse와 Profiler 수치가 함께 개선되면 성공으로 봤습니다.",
          "러닝포인트: 성능 문제는 'React가 느리다'처럼 단정하지 않고, 이미지 전송량·DOM 수·상태 구독 범위·WebGL/canvas 수명 주기를 나눠 측정해야 원인을 정확히 줄일 수 있다는 기준을 세웠습니다.",
        ],
      };
    }

    return project;
  }).sort((a, b) => {
    const order = ["Game Information Platform", "AI ChatBot", "PhotoMap"];
    const aIndex = order.includes(a.title) ? order.indexOf(a.title) : 999;
    const bIndex = order.includes(b.title) ? order.indexOf(b.title) : 999;
    return aIndex - bIndex;
  }),  activityGroups: resumeData.activityGroups.filter((group) =>
    group.title.includes("BRIGHT MAKERS") ||
    group.title.includes("학교 정보 접근성") ||
    group.title.includes("생성형 AI")
  ),
  motivation: pooolingforestMotivation,
} as const;
