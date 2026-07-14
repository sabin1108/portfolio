import { resumeData } from "./resume";

const nexonMotivation = `메이플AX실 공고에서 끌렸던 지점은 AI 모델 자체보다, 그 결과물을 사용자가 브라우저 안에서 직접 보고 고치고 함께 다루는 제작 도구를 만든다는 점이었습니다. 저는 프론트엔드를 화면을 배치하는 일보다, 사용자가 복잡한 작업을 끊기지 않고 이어가게 만드는 일에 가깝다고 생각합니다.

PhotoMap을 만들면서 비슷한 문제를 많이 겪었습니다. 대량 이미지, 지도, 타임라인, 관계 그래프, Unity WebGL iframe, cobe canvas globe가 한 화면 흐름 안에 섞이면서 어디서 느려지는지부터 분리해야 했습니다. Lighthouse 측정 기준, Supabase image transform 기반 preview 전송 최적화 후 Performance score를 50점에서 77점으로 높이고, LCP를 63,804ms에서 4,150ms로 낮췄으며, 초기 payload를 12,586KiB에서 381KiB로 줄인 기록을 남겼습니다. WebGL/canvas 영역은 React 상태 변경과 분리하고, idle mount와 cleanup, frame budget 측정으로 따로 추적할 수 있게 정리했습니다.

생성형 AI 기반 포트폴리오 요약 플랫폼 논문에서는 AI 응답을 보여주는 것보다, 사용자가 그 결과를 어떻게 신뢰하고 판단할 수 있을지를 더 많이 고민했습니다. 스트리밍 응답, 근거 확인, 평가자 화면을 나누어 설계했던 경험이 있어서, 멀티모달 AI 결과물을 실제 제작 흐름 안에 녹이는 일에도 관심이 큽니다.

Three.js나 Yjs를 깊게 다뤄본 경험은 아직 부족합니다. 그래서 이 포지션에서 배우고 싶은 지점도 분명합니다. 다만 Canvas/WebGL 계열 화면에서 병목을 측정하고 React 상태 흐름과 분리해본 경험은 있기 때문에, 렌더링 최적화와 실시간 협업 구조도 빠르게 따라가며 실제 제작 도구의 품질로 연결해보고 싶습니다.`;

export const resumeNexonData = {
  ...resumeData,
  summary: `${resumeData.summary}

Nexon 메이플AX실 직무와 연결되는 강점은 WebGL 계열 시각화와 React 렌더링 최적화 경험입니다. PhotoMap에서 Unity WebGL 지도 뷰, cobe 기반 canvas globe, D3 force simulation, 대량 이미지 가상화가 함께 있는 화면을 다루며 렌더링 책임을 React state와 분리했습니다. 이후 Supabase image transform 기반 preview 전송 최적화로 Lighthouse Performance 50점에서 77점, LCP 63,804ms에서 4,150ms까지 개선한 측정 기록도 확보했습니다. Three.js 직접 사용 근거는 아직 약하므로 이력서에서는 WebGL 기반 렌더링/로딩/수명 주기 최적화 경험으로 안전하게 표현합니다.`,
  coreSkills: resumeData.coreSkills.map((group) =>
    group.title === "Frontend"
      ? { ...group, items: [...group.items, "Canvas", "WebGL"] }
      : group.title === "Tools - 개발 및 빌드"
        ? { ...group, items: [...group.items, "React Profiler", "Lighthouse"] }
        : group
  ),
  projectHighlights: resumeData.projectHighlights.map((project) => {
    if (project.title !== "PhotoMap") return project;

    return {
      ...project,
      techTags: ["React", "TypeScript", "Zustand", "D3.js", "Unity WebGL", "Canvas", "cobe", "Lighthouse"],
      keyRoles: "WebGL/canvas 수명 주기 분리 / 이미지 전송 병목 개선 / React 렌더링 성능 측정 및 최적화",
      issues: [
        "대량 이미지, React UI, Unity WebGL iframe, cobe canvas globe가 같은 화면에 함께 동작하면서 초기 로딩 병목과 렌더링 책임이 섞이는 문제가 있었습니다.",
        "작은 preview 카드에서도 원본 1920px급 이미지를 요청해 Lighthouse LCP와 초기 payload가 크게 악화됐고, 실제 병목이 React 렌더링인지 네트워크 전송인지 구분하기 어려웠습니다.",
        "Unity WebGL iframe과 cobe canvas renderer는 React 컴포넌트와 다른 렌더링 루프와 cleanup 시점을 가져, 화면 전환 뒤 리소스 잔존이나 frame 비용을 별도로 추적할 기준이 필요했습니다.",
      ],
      resolutions: [
        "Supabase image transform fallback으로 public home preview 이미지를 320px급으로 요청하도록 바꾸고, 상단 이미지만 eager/high priority로 두며 나머지는 lazy/async로 조정했습니다.",
        "Unity WebGL 지도 화면은 React 라우트 내부에 iframe으로 통합하고, postMessage로 사진/위치 데이터만 전달해 React 상태 변경과 WebGL 런타임을 분리했습니다.",
        "cobe 기반 GlobeView는 idle mount, contain: layout paint size, globe.destroy() cleanup을 적용해 canvas 렌더러의 영향 범위와 수명 주기를 명확히 했습니다.",
        "React Profiler와 Lighthouse, frame budget probe를 함께 기록해 React commit 비용, 이미지 전송 병목, WebGL/canvas frame 비용을 분리해서 비교할 수 있게 했습니다.",
      ],
      achievements: [
        "Lighthouse 기준 Performance score를 50점에서 77점으로 개선했고, LCP를 63,804ms에서 4,150ms로 낮췄으며, 초기 payload를 12,586KiB에서 381KiB로 줄였습니다.",
        "WebGL/canvas 영역을 React 전체 리렌더링 최적화와 분리해 iframe 메시지 브릿지, idle mount, cleanup, frame budget 측정 기준으로 설명할 수 있게 했습니다.",
        "Context API 기반 전역 리렌더링을 Zustand selector 구조로 바꿔 상태 변경 리렌더링 범위를 70여 개 컴포넌트에서 5개 이하로 줄이고, React Profiler 기준 커밋 시간을 9.7ms에서 6.2ms로 단축했습니다.",
        "D3 force simulation의 tick 업데이트를 React state 밖으로 분리해 NodeView 렌더링 수를 370회에서 25회로 줄이고, 대량 사진 구간은 가상화로 DOM 노드를 200개 이하로 유지했습니다.",
      ],
    };
  }).sort((a, b) => {
    if (a.title === "PhotoMap") return -1;
    if (b.title === "PhotoMap") return 1;
    return 0;
  }),
  motivation: nexonMotivation,
} as const;
