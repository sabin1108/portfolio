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
    "React와 Next.js로 사진 탐색, 지도, 가격 비교 화면을 만들었습니다. 이미지 전송량, 렌더링 범위, API 응답 경로를 나눠 확인하고 화면 구조와 데이터 처리 방식을 고쳤습니다.",
  coreSkills: [
    { title: "프론트엔드", items: ["React", "Next.js", "TypeScript", "JavaScript"] },
    { title: "성능", items: ["React Profiler", "Lighthouse", "목록 가상화", "이미지 요청 우선순위"] },
  ],
  projectHighlights: [
    {
      ...photoMap,
      techTags: ["React", "TypeScript", "Zustand", "Mapbox", "D3", "Playwright"],
      description:
        "사진을 장소·시간으로 탐색하고, 지도·앨범·타임라인에서 다시 찾아보는 웹 서비스입니다.",
      keyRoles:
        "3인 팀(FE·BE·Unity 각 1명) 프론트엔드 담당 · 지도·앨범·타임라인·상세 UI · Mapbox·D3 연동 · 상태 관리",
      achievements: [
        "이미지 응답 본문 4.22MB → 237KB · 94.4% 감소 — 목록에는 썸네일을, 상세 화면에는 큰 이미지를 제공하도록 이미지 주소 선택을 분리했습니다. 같은 사진 16장을 큰 이미지로 제공하는 조건과 썸네일 조건을 동일 배포에서 비교했습니다.",
        "렌더링 카드 3,000개 → 최대 57개 · 모바일 크기 PC 실험 — 사진 목록을 행 단위로 가상화해 화면 주변 카드만 남겼습니다. 390×844, DPR 2, 동일 SVG 반복 조건의 합성 3,000개 목록에서 렌더링 카드 수를 확인했습니다.",
        "뒤로가기로 검색 조건과 목록 위치 복원 — 검색·상세 UI는 공유하되 화면별 검색 조건과 액션은 분리했습니다. 탐색 조건은 URL, 사진·좋아요는 Zustand, 모달은 local state에 두고 다른 화면을 다녀온 뒤 이전 탐색으로 돌아오는지 확인했습니다.",
        "D3 좌표 갱신을 React state에서 분리 — React는 노드 구조와 선택 상태를 관리하고 D3 tick은 좌표와 SVG 선만 갱신하도록 했습니다. 데이터 변경이나 화면 이탈 시 기존 simulation을 중지했습니다.",
      ],
    },
    {
      ...gameInfo,
      techTags: ["Next.js", "TypeScript", "Supabase", "REST API", "Playwright", "Vitest"],
      description:
        "게임을 검색해 상점별 가격을 비교하고 관심 목록에 저장하는 Next.js 개인 프로젝트입니다.",
      keyRoles:
        "개인 개발 · 검색·가격 비교·관심 목록 UI/API 연동 · Supabase Auth·DB · 캐시·렌더링 개선 · 테스트 자동화",
      achievements: [
        "mock GameCard 호출 6회 → 2회 · 실패·재시도·추가 로딩 실험 — 액션 JSX 참조가 매번 바뀌어 카드와 액션을 같은 memo 경계로 묶었습니다. 고정 데이터로 실패·재시도·추가 로딩을 재현해 호출 수를 비교했습니다.",
        "동일 제목 동시 요청 4건 → 후보 조회 1회 · 모의 공급자 테스트 — 필터가 달라도 제목 후보는 같아서 후보 캐시와 진행 중 Promise를 공유했습니다. 태그·스토어·가격 필터는 가져온 후보에 적용하고 모의 공급자 테스트로 조회 공유를 확인했습니다.",
        "가격 응답 정규화 — ITAD 응답의 금액·상점·구매 링크를 공통 모델로 바꿔 화면이 외부 API 형식을 직접 알지 않게 했습니다. 양수 가격만 최저가 후보로 삼아 결측값과 0원 오판을 막았습니다.",
        "API 예외와 주요 화면 자동 검증 — 가격 변환과 API 실패 처리는 단위 테스트로 확인하고 핵심 화면에는 Playwright smoke를 적용했습니다. GitHub Actions에서 타입 검사·린트·테스트·빌드를 함께 실행합니다.",
      ],
    },
  ],
  activityGroups: resumeFrontendData.activityGroups.map((group) =>
    group.title === "생성형 AI 기반 포트폴리오 요약 플랫폼"
      ? {
          ...group,
          title: "생성형 인공지능 기반 포트폴리오 요약 및 검증 시스템 및 그 방법",
          venue: "특허 출원 · 10-2026-0186451 · 2026.09.30",
          href: "/files/patents/generative-ai-portfolio-summary-verification.pdf",
          linkLabel: "특허 명세서 PDF",
          items: [
            "공동 발명자로 특허 출원에 참여",
            "포트폴리오 요약에 포함된 기술정보를 지식정보와 비교하고, 기술 명칭을 표준화하거나 확인되지 않은 정보를 제외하는 요약·검증 방식을 공동 발명",
          ],
        }
      : group,
  ),
  motivation: "",
} as const;
