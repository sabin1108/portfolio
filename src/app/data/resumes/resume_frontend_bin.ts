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
  summary: [
    "사용자가 느끼는 지연과 불편을 상태·렌더링·네트워크 문제로 나누고, 지표와 테스트로 개선을 확인하는 프론트엔드 개발자 민사빈입니다.",
    "React와 Next.js 기반 화면에서 검색, 목록, 상세, 지도, 사진 탐색 흐름을 구현했습니다. 화면이 늦게 보이는 구간을 브라우저 측정과 반복 확인으로 찾고, 이미지 로딩·렌더링 범위·API 응답 상태를 나눠 개선했습니다.",
    "PhotoMap에서는 Mapbox, WebGL, Canvas, D3가 함께 동작하는 화면을 안정적으로 구성했고, Game Information Platform에서는 Supabase와 외부 게임 API를 연결해 가격 검색, 상세 조회, 관심 목록 흐름을 만들었습니다.",
  ].join("\n\n"),
  coreSkills: [
    { title: "Frontend", items: ["React", "Next.js", "TypeScript", "JavaScript"] },
    { title: "UI", items: ["반응형 화면", "검색/목록/상세 화면", "모바일 화면 개선"] },
    { title: "Interaction", items: ["Mapbox", "WebGL", "Canvas", "D3"] },
    { title: "Data", items: ["REST API", "Supabase", "API 응답 정리", "오류/빈 화면 처리"] },
    { title: "Quality", items: ["Lighthouse", "첫 화면 속도 확인", "React Profiler", "Playwright", "Vitest"] },
  ],
  projectHighlights: [
    {
      ...photoMap,
      techTags: ["React", "Mapbox", "WebGL", "Canvas", "D3", "Lighthouse", "Playwright"],
      description:
        "여행이나 일상에서 찍은 사진을 지도, 시간 흐름, 사진 목록으로 다시 찾아볼 수 있는 서비스입니다.",
      keyRoles:
        "React 화면 구현, Mapbox 지도 연동, WebGL·Canvas 화면 정리, D3 그래프 표시, 이미지 로딩 개선, 성능 측정 자동화",
      issues: [
        "지도, WebGL, Canvas, D3 그래프, 사진 목록이 한 화면에 함께 있어 모바일 첫 화면과 첫 사진 표시가 느렸습니다.",
        "사진 목록이 길어질수록 렌더링 범위가 커지고, 스크롤과 화면 전환이 답답하게 느껴졌습니다.",
        "성능 개선 전후를 감으로 판단하지 않기 위해 브라우저 측정과 반복 확인이 필요했습니다.",
      ],
      aiApproach: [
        "AI는 이미지 로딩, 렌더링 범위, 네트워크 요청 중 어디가 느린지 후보를 정리하는 데 활용했습니다.",
        "측정은 Playwright 기반 실제 브라우저 실행으로 반복했고, 첫 사진과 첫 화면이 실제로 보이는 시점을 중심으로 비교했습니다.",
        "성능 측정용 데이터는 실제 서비스 데이터와 분리했고, 운영 환경으로 잘못 연결되지 않도록 실행 전 환경 확인 절차를 넣었습니다.",
        "실패한 측정도 제외하지 않고 따로 기록해, 개선 수치가 어떤 실행 조건에서 나왔는지 다시 확인할 수 있게 했습니다.",
      ],
      resolutions: [
        "목록과 상세 화면에서 쓰는 이미지 크기를 나누고, 첫 화면에 필요한 이미지를 우선 불러오도록 로딩 순서를 정리했습니다.",
        "사진 목록은 화면에 보이는 구간 중심으로 렌더링해 많은 사진을 다룰 때도 DOM 부담을 줄였습니다.",
        "Mapbox, WebGL, Canvas, D3 영역이 React 화면 전체를 불필요하게 다시 그리지 않도록 상태와 렌더링 책임을 나눴습니다.",
        "React Profiler로 다시 그려지는 범위를 확인하고, Lighthouse와 Playwright 측정으로 개선 전후를 비교했습니다.",
      ],
      achievements: [
        "같은 모바일 조건을 고정해 반복 측정했을 때 첫 사진 표시를 약 2.6초까지 줄였습니다.",
        "첫 화면 이미지 용량을 1MB 이하로 줄여 사진을 더 빨리 확인할 수 있게 했습니다.",
        "관계 보기와 앨범 화면의 처리 시간을 각각 3분의 1 수준, 절반 이하로 줄였습니다.",
      ],
    },
    {
      ...gameInfo,
      techTags: ["Next.js", "TypeScript", "Supabase", "REST API", "Playwright", "Vitest"],
      description:
        "여러 게임 할인 정보를 검색하고, 가격과 관심 목록을 한 곳에서 확인할 수 있는 웹 서비스입니다.",
      keyRoles:
        "Next.js 화면 구현, Supabase 연동, 외부 API 데이터 정리, 가격 표시 오류 방지, 검색·상세·관심 목록 흐름 개선",
      issues: [
        "Steam, Epic, ITAD처럼 여러 외부 API의 응답 형식이 달라 화면마다 예외 처리가 늘어날 수 있었습니다.",
        "가격이 없거나 0으로 들어온 데이터가 실제 할인 가격처럼 보일 위험이 있었습니다.",
        "외부 API 응답이 늦거나 실패할 때 로딩, 빈 결과, 오류, 이전 데이터 표시 상태를 사용자에게 구분해 보여줘야 했습니다.",
      ],
      aiApproach: [
        "AI는 API 응답 차이, 가격 예외 상황, 테스트 케이스를 빠르게 정리하는 데 활용했습니다.",
        "제안된 내용은 TypeScript 타입, Vitest, Playwright, 실제 화면 확인을 거친 뒤 필요한 부분만 반영했습니다.",
      ],
      resolutions: [
        "외부 API에서 받은 게임 정보를 화면에서 쓰기 좋은 공통 형태로 먼저 정리해 UI의 조건문을 줄였습니다.",
        "가격이 명확한 데이터만 할인 판단에 사용해 잘못된 가격 표시를 줄였습니다.",
        "Supabase 관심 목록과 목표 가격 흐름을 검색·상세 화면과 자연스럽게 연결했습니다.",
        "로딩, 빈 결과, 오류, 이전 데이터 표시 상태를 나눠 사용자가 현재 상황을 이해하기 쉽게 했습니다.",
      ],
      achievements: [
        "검색, 상세, 관심 목록 흐름을 하나의 서비스로 연결하고, 미사용 파일 1개와 미사용 export 11개를 정리했습니다.",
        "Vitest 60개 테스트와 Playwright 화면 테스트로 가격 표시, 로그인, 관심 목록의 주요 흐름을 확인했습니다.",
        "API가 늦거나 실패하는 경우까지 확인해 잘못된 가격과 빈 화면이 그대로 보이지 않게 했습니다.",
      ],
    },
  ],
  motivation: "",
} as const;