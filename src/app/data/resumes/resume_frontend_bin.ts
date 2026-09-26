import { resumeFrontendData } from "./frozen/resume_frontend";

const projects = new Map(
  resumeFrontendData.projectHighlights.map((project) => [project.title, project]),
);
const photoMap = projects.get("PhotoMap");
const gameInfo = projects.get("Game Information Platform");

if (!photoMap || !gameInfo) {
  throw new Error("frontend_bin resume requires PhotoMap and Game Information Platform.");
}

export const resumePathKeyword = ["frontend_bin", "bin_resume"] as const;

export const resumeVariantData = {
  ...resumeFrontendData,
  summary:
    "React·Next.js로 사진 탐색과 게임 가격 비교 서비스를 만들었습니다. 이미지가 늦게 뜨거나 목록이 끊기는 원인을 찾고, 화면과 데이터 요청 방식을 고쳤습니다.",
  coreSkills: [
    { title: "프론트엔드", items: ["React", "Next.js", "TypeScript", "JavaScript"] },
    { title: "지도·시각화", items: ["Mapbox", "Unity WebGL", "Canvas", "D3"] },
    { title: "상태·데이터", items: ["Zustand", "Supabase", "REST API"] },
    { title: "성능·테스트", items: ["Lighthouse", "React Profiler", "Playwright", "Vitest"] },
  ],
  projectHighlights: [
    {
      ...photoMap,
      techTags: ["React", "Mapbox", "WebGL", "Canvas", "D3", "Lighthouse", "Playwright"],
      description:
        "여행이나 일상에서 찍은 사진을 지도, 시간 흐름, 사진 목록으로 다시 찾아볼 수 있는 서비스입니다.",
      keyRoles:
        "3인 팀 프론트엔드 담당 · 사진 탐색 UI·Mapbox 연동 · 이미지 로딩·목록 성능 개선 · 공통 컴포넌트 설계",
      achievements: [
        "첫 사진 표시 p95 17.55초 → 2.62초 · 85.1% 단축 — 작은 카드도 원본 이미지를 받고 있어 목록·상세 이미지 크기를 나누고 첫 사진 요청을 우선했습니다. 모바일 4G 합성 비교 결과입니다.",
        "사진 선택 지연 59.6ms → 13.2ms · 77.9% 감소 — 화면에 보이는 행만 렌더링하도록 가상화했습니다. 같은 카드·이미지 정책의 목록 단독 비교이며, 클릭부터 모달 이미지 준비까지의 중앙값입니다.",
        "지도·피드·관계 그래프에서 상세 UI 공유 — 사진 모달을 이미지·메타데이터·액션으로 나눠 조합했습니다. 탐색 조건은 URL, 공유 데이터는 Zustand, 입력값은 local state에 뒀습니다.",
      ],
    },
    {
      ...gameInfo,
      techTags: ["Next.js", "TypeScript", "Supabase", "REST API", "Playwright", "Vitest"],
      description:
        "여러 게임 할인 정보를 검색하고, 가격과 관심 목록을 한 곳에서 확인할 수 있는 웹 서비스입니다.",
      keyRoles:
        "개인 프로젝트 · 검색·가격 비교·관심 목록 UI · React 렌더링 최적화 · 검색 캐시·서버 스트리밍",
      achievements: [
        "카드 렌더 호출 6회 → 2회 · 약 67% 감소 — 액션 JSX의 참조가 매번 바뀌어 카드와 액션을 같은 memo 경계로 묶었습니다. 고정 데이터의 실패·재시도·추가 로딩 흐름에서 mock GameCard 호출을 비교했습니다.",
        "동일 제목의 동시 요청 4건 → 후보 조회 1회 — 후보 캐시와 진행 중 요청을 공유했습니다. 태그·스토어·가격 필터는 가져온 후보에 적용해 같은 제목의 후보를 다시 조회하지 않게 했습니다.",
        "가격 조회가 끝나기 전에 검색 조건부터 제공 — 검색 폼과 결과를 서버 Suspense로 나눴습니다. 입력값은 폼에서 관리하고 적용한 조건은 URL에 남겼습니다.",
      ],
    },
  ],
  motivation: "",
} as const;
