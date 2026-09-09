import { resumeVariantData as latestResumeData } from "./resume_frontend_bin";

export const resumeWacusData = {
  ...latestResumeData,
  projectHighlights: latestResumeData.projectHighlights.map((project) =>
    project.title === "PhotoMap"
      ? { ...project, keyRoles: "3인 팀 프로젝트에서 프론트엔드를 담당했습니다. React 화면과 Mapbox 지도를 구현하고, Unity WebGL 지도와 사진 선택을 연동했습니다. D3 관계 그래프와 이미지 로딩 개선도 담당했습니다." }
      : project,
  ),
  motivation: "와커스가 웹과 마케팅을 연결하고, 브랜드의 메시지가 사용자의 행동으로 이어지는 경험을 만든다는 점에 관심을 갖고 지원했습니다. 화면의 시각적인 완성도와 함께 첫 콘텐츠가 나타나는 속도, 정보를 찾는 흐름, 오류가 났을 때의 안내까지 챙기는 프론트엔드 개발자로 기여하고 싶습니다.\n\nPhotoMap에서는 사진을 탐색하는 React 화면과 지도·그래프를 구현했습니다. 모바일에서 첫 사진이 늦게 보이는 문제를 확인한 뒤 목록과 상세 화면에 필요한 이미지 크기를 나누고, 첫 사진의 요청 우선순위를 조정했습니다. 고정 모바일 4G 환경의 합성 실험 100회에서 첫 사진 표시 p95 약 2.6초를 확인했습니다. 이 경험을 바탕으로 고객사 웹사이트에서도 사용자가 처음 마주하는 콘텐츠와 주요 상호작용을 먼저 점검하겠습니다.\n\n게임 가격 비교 서비스에서는 Next.js로 검색·상세·관심 목록 화면을 만들고, 서로 다른 외부 응답을 공통 데이터 구조로 정리했습니다. 정상 화면뿐 아니라 빈 결과와 요청 실패를 구분하고 테스트로 확인했습니다. 와커스에서도 기획과 디자인의 의도를 화면으로 구체화하고, 모바일 동작과 예외 상황을 함께 검증하며 신규 구축과 유지보수에 기여하겠습니다.",
} as const;
