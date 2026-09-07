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
    "사용자가 느끼는 지연과 불편을 상태·렌더링·네트워크 문제로 나누고, 지표와 테스트로 개선을 확인하는 프론트엔드 개발자 민사빈입니다. React와 Next.js로 사진 탐색 서비스와 게임 가격 비교 서비스를 개발했습니다.",
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
        "3인 팀 프로젝트 프론트엔드 담당, React 화면 구현, Mapbox 지도 연동, WebGL·Canvas 화면 정리, D3 그래프 표시, 이미지 로딩 개선, 성능 측정 자동화",
    },
    {
      ...gameInfo,
      techTags: ["Next.js", "TypeScript", "Supabase", "REST API", "Playwright", "Vitest"],
      description:
        "여러 게임 할인 정보를 검색하고, 가격과 관심 목록을 한 곳에서 확인할 수 있는 웹 서비스입니다.",
      keyRoles:
        "Next.js 화면 구현, Supabase 연동, 외부 API 데이터 정리, 가격 표시 오류 방지, 검색·상세·관심 목록 흐름 개선",
    },
  ],
  motivation: "",
} as const;
