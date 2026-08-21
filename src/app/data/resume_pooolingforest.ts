import { resumeData } from "./resume";

const pooolingforestMotivation = `풀링포레스트 공고를 보며 가장 먼저 눈에 들어온 것은 “문제 해결이 먼저이고, 코딩은 수단”이라는 관점이었습니다. 정해진 요청을 구현하는 데서 멈추지 않고, 스스로 문제를 좁혀 보고 해결 결과까지 책임지는 태도를 중요하게 본다는 점도 제가 프로젝트를 진행해온 방식과 맞았습니다.

저는 기능을 먼저 많이 붙이기보다, 사용자가 막히는 지점과 코드 구조상 변경 비용이 커지는 지점을 먼저 찾으려고 합니다. Game Information Platform에서는 외부 API 응답 차이가 가격 오판으로 이어질 위험을 Adapter/Normalizer와 테스트로 막았습니다. PhotoMap에서는 대량 이미지 탐색의 병목을 이미지 전송량, DOM 노드 수, 상태 구독 범위로 나눠 측정하고 개선했습니다.

AI Agent 솔루션 페이지에서 말하는 중앙 Agent Backend, 데이터·업무 흐름·권한 연결, Human-in-the-Loop 구조도 인상 깊었습니다. AI를 단순 답변 화면으로 붙이는 것이 아니라, 조직의 데이터와 실행 흐름 안에서 신뢰할 수 있게 쓰이도록 만드는 방향이라고 이해했습니다.
`;

export const resumePooolingforestData = {
  ...resumeData,
  profile: {
    ...resumeData.profile,
    title: "FullStack Developer",
  },
  summary: `문제를 그냥 넘기지 않고, 원인을 나눠 검증하는 개발자 민사빈입니다.

저는 단순히 기능을 구현하는 것보다 사용자가 어떤 지점에서 잘못된 정보를 보거나 흐름이 막히는지, 그리고 그 문제가 코드 구조 안에서 왜 반복되는지를 먼저 보려고 합니다. 궁금한 기술은 직접 파보되, 실제 적용은 지표와 유지보수성으로 판단합니다.

Game Information Platform에서는 Steam, Epic, ITAD 가격 데이터 차이로 인해 사용자가 잘못된 최저가나 목표가 달성 상태를 볼 수 있는 문제가 있었습니다. 화면이 외부 API 포맷을 직접 알면 카드, 상세, 관심목록마다 예외 처리가 늘어난다고 판단해 Adapter/Normalizer 계층과 공통 view model로 정리했습니다. currentPriceCents > 0인 가격만 후보로 사용했고, 0원/null/가격 미정 케이스는 Vitest로 검증했습니다. CI에는 typecheck, lint, Vitest, production build, Playwright smoke 테스트를 구성했고, Fallow 정적 분석으로 중복 코드를 1,006줄(9.4%)에서 308줄(2.9%)로 줄였습니다.


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
    const order = ["Game Information Platform", "PhotoMap"];
    const aIndex = order.includes(a.title) ? order.indexOf(a.title) : 999;
    const bIndex = order.includes(b.title) ? order.indexOf(b.title) : 999;
    return aIndex - bIndex;
  }),  activityGroups: resumeData.activityGroups.filter((group) =>
    group.title.includes("생성형 AI")
  ),
  motivation: pooolingforestMotivation,
} as const;
