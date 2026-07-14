import { resumeData } from "./resume";

const woojinMotivation = `우진지앤에스를 보며 가장 먼저 연결된 지점은 공공·국방 정보체계와 GIS 기반 서비스였습니다. 공식 사이트에서 COP와 공간정보시스템, 국방정보체계, 공공분야 정보체계, GIS DB, AI·빅데이터·사이버보안을 주요 사업으로 소개하고 있었고, 공고 우대사항에도 CesiumJS, OpenLayers, Mapbox 등 Web GIS 경험이 포함되어 있었습니다.

공공·국방 계열 웹 시스템에서는 새 기술을 많이 쓰는 것보다 데이터 흐름을 안정적으로 정리하고, 변경에 강한 화면 구조를 만드는 일이 더 중요하다고 생각합니다. PhotoMap에서 저는 Mapbox 기반 지도 화면에 위치 기반 사진 데이터를 표시하고, Unity WebGL iframe과 cobe canvas globe를 React UI 흐름에 통합했습니다. Unity WebGL 지도는 iframe으로 분리해 postMessage로 위치 데이터만 전달하는 방식으로 React 상태 변경과 WebGL 런타임의 책임을 나눴고, Supabase image transform과 이미지 로딩 우선순위 조정을 통해 Lighthouse 기준 Performance score를 50점에서 77점으로, LCP를 63,804ms에서 4,150ms로, 초기 payload를 12,586KiB에서 381KiB로 개선했습니다. 상태 변경 리렌더링 범위는 70여 개 컴포넌트에서 5개 이하로 줄이고, React Profiler 기준 커밋 시간은 9.7ms에서 6.2ms로 낮췄습니다.

Game Information Platform에서는 Steam과 Epic, ITAD 등 외부 API 응답 차이를 UI가 직접 처리하지 않도록 Adapter와 Normalizer 계층으로 정리했고, 0원이나 null 가격이 최저가로 오판되지 않도록 방어 로직을 뒀습니다. stale cache와 rate limit으로 외부 API 장애가 화면 전체를 무너뜨리지 않게 했고, Vitest 60개 테스트와 Playwright E2E 9개 시나리오로 주요 로직과 사용자 흐름을 검증했습니다. 이는 공공 SI나 정보체계 프로젝트에서 필요한 데이터 계약, 예외 처리, 테스트 기반 품질 관리와 맞닿아 있다고 생각합니다.

아직 Java·JSP나 전자정부프레임워크 실무 경험은 부족하지만, Mapbox 기반 Web GIS 화면 구현, Unity WebGL iframe 연동, canvas 렌더링 수명 주기 분리, API 경계 분리와 성능 측정 경험은 확실히 쌓아왔습니다. 우진지앤에스에서 기존 공공·국방 정보체계의 개발 방식과 도메인 규칙을 빠르게 배우면서, 사용자가 오래 안정적으로 쓰는 웹 화면과 데이터 흐름을 만드는 개발자로 기여하고 싶습니다.`;

export const resumeWoojinData = {
  ...resumeData,
  summary: `저는 화면 구현만이 아니라 데이터 흐름, 예외 처리, 성능, 테스트까지 함께 보는 프론트엔드 개발자 민사빈입니다.

PhotoMap에서는 Mapbox 기반 지도 화면에 위치 기반 사진 데이터를 표시하고, Unity WebGL iframe과 cobe canvas globe를 React 화면 흐름에 통합했습니다. Lighthouse 측정 기준 Supabase image transform 적용 후 Performance score를 50점에서 77점으로 높이고, LCP를 63,804ms에서 4,150ms로 낮췄으며, 초기 payload를 12,586KiB에서 381KiB로 줄였습니다. React Profiler 기준 상태 변경 범위는 70여 개 컴포넌트에서 5개 이하로 줄이고, 커밋 시간은 9.7ms에서 6.2ms로 낮췄습니다.

Game Information Platform에서는 Steam/Epic/ITAD API 응답 차이를 Adapter/Normalizer 계층으로 정리하고, 0원/null 가격 오판 방지, stale cache, rate limit, Vitest/Playwright 테스트를 통해 장애와 회귀에 대비했습니다. Fallow 정적 분석으로 중복 코드를 1,006줄(9.4%)에서 308줄(2.9%)로 줄이고 미사용 파일/export를 0개로 정리했습니다.

HTML/CSS/JavaScript 기반 화면 구현, API 경계 분리, 공공 정보 접근성 개선 챗봇, Mapbox·WebGL 기반 지도 데이터 탐색 UI 경험을 바탕으로 공공·국방 정보체계 웹 개발에 빠르게 적응하겠습니다.`,
  coreSkills: resumeData.coreSkills.map((group) =>
    group.title === "Frontend"
      ? { ...group, items: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React.js", "Next.js"] }
      : group.title === "State & DB"
        ? { ...group, items: ["Zustand", "Supabase", "Redis", "API Routes"] }
        : group.title === "Tools - 테스트 및 품질"
          ? { ...group, items: ["Vitest", "Playwright", "Lighthouse", "React Profiler", "Fallow"] }
          : group
  ),
  projectHighlights: resumeData.projectHighlights.map((project) => {
    if (project.title === "PhotoMap") {
      return {
        ...project,
        techTags: ["React", "TypeScript", "Zustand", "Mapbox", "Web GIS", "Unity WebGL", "Canvas", "Lighthouse", "React Profiler"],
        keyRoles: "Mapbox·WebGL 기반 위치 데이터 탐색 UI 구현 / Lighthouse·React Profiler 성능 측정 / 렌더링 책임 분리",
        issues: [
          "Mapbox 기반 지도 화면, Unity WebGL iframe, cobe canvas globe, React UI가 함께 동작해 지도 데이터 흐름과 렌더링 책임이 섞일 위험이 있었습니다.",
          "WebGL/canvas가 포함된 public home에서 작은 preview 카드도 원본 1920px급 이미지를 요청해 Lighthouse LCP와 초기 payload가 이미지 전송량에 묶이는 병목이 있었습니다.",
          "Context API 기반 전역 상태 구조로 인해 작은 상태 변경에도 지도, 앨범, 타임라인 등 여러 화면이 함께 리렌더링되는 문제가 있었습니다."
        ],
        resolutions: [
          "Unity WebGL 지도는 iframe으로 분리하고 postMessage/SendMessage로 사진·위치 데이터만 전달해 React 상태 변경과 WebGL 런타임을 분리했습니다.",
          "Supabase image transform fallback으로 preview 이미지를 320px급으로 요청하게 하고, 상단 이미지만 eager/high priority로 두며 나머지는 lazy/async로 조정했습니다.",
          "cobe canvas GlobeView는 idle mount, 동일한 aspect-ratio placeholder, globe.destroy() cleanup을 적용하고 frame budget probe로 canvas 비용을 별도 기록했습니다.",
          "Zustand store와 useShallow selector를 적용해 필요한 slice만 구독하게 만들고, 무관한 화면 리렌더링을 줄였습니다."
        ],
        achievements: [
          "Mapbox 기반 지도 화면에 위치 기반 사진 데이터를 표시하고, Unity WebGL iframe과 cobe canvas globe를 React UI 흐름에 통합했습니다.",
          "Lighthouse 기준 Performance score를 50점에서 77점으로 개선했고, LCP를 63,804ms에서 4,150ms로 낮췄으며, 초기 payload를 12,586KiB에서 381KiB로 줄였습니다.",
          "상태 변경 리렌더링 범위를 70여 개 컴포넌트에서 5개 이하로 줄이고, React Profiler 기준 커밋 시간을 9.7ms에서 6.2ms로 낮췄습니다.",
          "cobe canvas GlobeView에 frame budget probe를 추가해 WebGL/canvas 렌더링 비용을 React 렌더링 지표와 분리해 추적할 수 있는 기준을 마련했습니다."
        ],
      };
    }

    if (project.title === "Game Information Platform") {
      return {
        ...project,
        techTags: ["Next.js", "TypeScript", "React", "Supabase", "API Routes", "Vitest", "Playwright"],
        keyRoles: "외부 API 정규화 / 예외 데이터 방어 / 캐시·rate limit / 테스트 기반 검증",
        issues: [
          "Steam/Epic/ITAD API 응답의 식별자, 가격, 할인율, 이미지, 상점 링크 필드가 달라 UI가 API별 예외를 직접 처리해야 했습니다.",
          "출시 예정, 가격 미정, 데이터 미제공 게임의 0원/null 값이 최저가나 목표가 달성으로 오판될 수 있었습니다.",
          "공개 route가 외부 가격 API 응답성에 직접 묶여 timeout, 호출 한도 초과, 반복 새로고침이 500 오류로 이어질 수 있었습니다.",
          "기능이 늘어나면서 수동 확인만으로 API 응답 형식 변경, 인증 흐름, 관심 목록 회귀를 안정적으로 잡기 어려웠습니다."
        ],
        resolutions: [
          "API 호출 결과와 UI 사이에 Adapter/Normalizer 계층을 두고 GameSummary, StoreProduct 같은 공통 view model로 변환했습니다.",
          "currentPriceCents > 0인 가격만 best price 후보로 사용하고, 후보가 없으면 목표 가격 매칭을 false로 처리했습니다.",
          "fresh TTL 이후에도 일정 시간 stale 데이터를 유지하는 cache 모듈과 fixed-window rate limit을 route 경계에 추가했습니다.",
          "Vitest로 API route, 정규화 함수, cache, rate limit, 목표가 계산을 검증하고 Playwright로 주요 사용자 흐름을 확인했습니다."
        ],
        achievements: [
          "외부 API 응답 차이를 UI 밖에서 흡수해 화면 컴포넌트가 공통 view model만 소비하도록 만들었습니다.",
          "0원/null 가격이 최저가나 목표가 달성 상태로 표시되는 경로를 차단했습니다.",
          "외부 API 실패 시 stale 데이터를 반환할 수 있게 해 검색/할인 화면이 즉시 500 오류로 무너지지 않도록 완충했습니다.",
          "unit/component/API/E2E spec 25개 파일과 69개 케이스를 정리하고, 주요 리팩터 검증에서 Vitest 21 files / 60 tests 통과 기록을 남겼습니다."
        ],
      };
    }

    if (project.title === "AI ChatBot") {
      return {
        ...project,
        techTags: ["Next.js", "TypeScript", "HTML/CSS", "Tailwind CSS", "React-Markdown", "Blob API"],
        keyRoles: "학교 정보 접근성 개선 UI / API 응답 경계 분리 / 로컬 대화 저장·내보내기 구현",
        issues: [
          "학식, 공지, 학사 일정 정보가 여러 출처와 화면에 흩어져 있어 사용자가 원하는 정보를 찾기까지 여러 단계를 거쳐야 했습니다.",
          "긴 원시 URL과 비정형 텍스트가 채팅 말풍선에 그대로 노출되어 모바일 viewport에서 가로 스크롤이나 말풍선 깨짐이 생겼습니다.",
          "외부 백엔드 응답이 JSON과 비정형 텍스트를 혼용해 split/regex/예외 처리가 UI 컴포넌트 안으로 번질 위험이 있었습니다.",
          "로그인 없는 localStorage 구조에서 새로고침과 여러 탭 사용 시 대화 목록과 활성 대화가 어긋날 수 있었습니다."
        ],
        resolutions: [
          "학식, 공지, 학사 일정, 빠른 링크를 채팅 UI와 보조 화면에서 함께 확인할 수 있게 사용자 흐름을 정리했습니다.",
          "ReactMarkdown과 remark-gfm으로 메시지를 렌더링하고, URL은 markdown link 형태로 변환해 줄바꿈 가능한 스타일을 적용했습니다.",
          "Next.js API Routes를 proxy layer로 두고 외부 API 호출과 응답 경계를 route 파일로 모았습니다.",
          "useLocalStorage hook과 storage 이벤트로 대화 기록 복원과 탭 간 상태 동기화를 처리했습니다."
        ],
        achievements: [
          "학교 정보 접근성 개선 AI ChatBot 서비스로 BRIGHT MAKERS EXPO 2025 캡스톤디자인 경진대회 우수상을 받았습니다.",
          "공지 링크와 긴 답변을 읽기 쉬운 문단과 링크 형태로 보여 모바일 가독성과 화면 안정성을 개선했습니다.",
          "외부 API 경계가 Next.js route 파일로 모이면서 UI 컴포넌트 책임을 메시지 표시와 사용자 상호작용 중심으로 줄였습니다.",
          "대화 내역 내보내기를 서버 저장/재전송 없이 브라우저 Blob API로 처리했습니다."
        ],
      };
    }

    return project;
  }).sort((a, b) => {
    const order = ["PhotoMap", "Game Information Platform", "AI ChatBot"];
    return order.indexOf(a.title) - order.indexOf(b.title);
  }),
  activityGroups: resumeData.activityGroups.filter((group) =>
    group.title.includes("학교 정보 접근성") ||
    group.title.includes("생성형 AI") ||
    group.title.includes("BRIGHT MAKERS")
  ),
  motivation: woojinMotivation,
} as const;