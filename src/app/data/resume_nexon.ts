import { resumeEliceData } from "./resume_elice";

const nexonMotivation = `메이플AX실 공고에서 가장 먼저 눈에 들어온 부분은 "AI API 호출"이 아니라, 브라우저 안에서 시각적 요소를 직접 편집하고 실시간으로 협업하는 제작 도구를 만든다는 점이었습니다. 저는 프론트엔드를 단순 화면 구현이 아니라 사용자가 복잡한 작업을 끊기지 않고 이어가게 만드는 도구 설계 문제로 보고 있습니다.

PhotoMap에서는 대량 이미지와 지도, 타임라인, 관계 그래프, WebGL 기반 보조 뷰가 함께 동작하는 화면에서 전역 상태와 렌더링 병목을 분리했습니다. Context API 기반 전역 리렌더링을 Zustand selector 구조로 바꾸고, D3 force simulation의 tick 업데이트를 React state 밖으로 분리해 SVG/DOM 속성만 직접 갱신하도록 정리했습니다. 또한 Unity WebGL 지도 뷰와 React 화면을 iframe/postMessage 흐름으로 연결하며 WebGL 콘텐츠의 로딩, 메시지 전달, 화면 전환 시 수명 주기 관리 문제를 다뤘습니다.

생성형 AI 기반 포트폴리오 요약 플랫폼 논문에서는 AI 응답을 그대로 보여주는 수준이 아니라, 스트리밍 응답, 검증 가능한 근거, 평가자 화면 구성을 나누어 사용자가 결과를 판단할 수 있는 제품 흐름으로 만드는 데 집중했습니다. 이 경험은 메이플AX실이 지향하는 멀티모달 생성형 AI 기반 제작 도구와 맞닿아 있다고 생각합니다.

현재 Three.js를 직접 사용한 프로젝트 근거는 강하지 않지만, Canvas/WebGL 계열 화면의 로딩과 렌더링 병목을 측정하고 React 상태 흐름과 분리해 본 경험은 있습니다. 입사 후에는 Three.js/WebGL 렌더링 최적화와 Yjs/WebSocket 기반 협업 구조까지 빠르게 학습해, 게임 개발자가 브라우저에서 에셋을 생성하고 편집하는 경험을 안정적인 리치 UI로 구현하는 데 기여하고 싶습니다.`;

export const resumeNexonData = {
  ...resumeEliceData,
  summary: `${resumeEliceData.summary}

Nexon 메이플AX실 직무와 연결되는 강점은 WebGL 계열 시각화와 React 렌더링 최적화 경험입니다. PhotoMap에서 Unity WebGL 지도 뷰, cobe 기반 canvas globe, D3 force simulation, 대량 이미지 가상화가 함께 있는 화면을 다루며 렌더링 책임을 React state와 분리했습니다. Three.js 직접 사용 근거는 아직 약하므로 이력서에서는 WebGL 기반 렌더링/로딩/수명 주기 최적화 경험으로 안전하게 표현합니다.`,
  coreSkills: resumeEliceData.coreSkills.map((group) =>
    group.title === "Frontend"
      ? { ...group, items: [...group.items, "Canvas", "WebGL"] }
      : group.title === "Tools - 개발 및 빌드"
        ? { ...group, items: [...group.items, "React Profiler", "Lighthouse"] }
        : group
  ),
  projectHighlights: resumeEliceData.projectHighlights.map((project) => {
    if (project.title !== "PhotoMap") return project;

    return {
      ...project,
      techTags: ["React", "TypeScript", "Zustand", "D3.js", "Unity WebGL", "Canvas", "cobe"],
      keyRoles: "상태 관리 구조 개선 / 렌더링 성능 최적화 / D3 및 WebGL 계열 시각화 연동",
      resolutions: [
        ...project.resolutions.filter((resolution) => resolution !== "BE 2명과 협업하며 서버의 사진·위치·카테고리 데이터 흐름은 유지하고, FE 상태 구독 범위와 렌더링 방식을 조정해 팀 전체 수정 범위를 줄였습니다."),
        "Unity WebGL 지도 화면은 React 라우트 내부에 iframe으로 통합하고, postMessage로 사진/위치 데이터를 전달해 React 상태 변경과 WebGL 런타임을 분리했습니다.",
        "GlobeView는 cobe canvas 렌더러를 lazy loading으로 분리하고, 언마운트 시 globe.destroy()를 호출해 WebGL/canvas 렌더링 리소스가 화면 전환 뒤 남지 않도록 처리했습니다.",
      ],
      achievements: [
        "cobe 기반 canvas globe의 mapSamples를 20,000에서 12,000으로 낮추고, contain: layout paint size와 globe.destroy() cleanup을 적용해 WebGL/canvas 렌더링 비용과 화면 전환 후 리소스 잔존 위험을 줄였습니다.",
        ...project.achievements,
      ],
    };
  }),
  motivation: nexonMotivation,
} as const;
