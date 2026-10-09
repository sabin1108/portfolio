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
    "구현한 기능을 측정과 테스트로 검증하는 프론트엔드 개발자입니다. React·Next.js로 사진 탐색과 가격 비교 화면을 만들며 이미지 용량과 불필요한 화면 갱신을 줄였습니다. AI 서비스 구현·논문 발표·공동 특허 출원에도 참여했습니다.",
  coreSkills: [
    { title: "프론트엔드", items: ["React", "Next.js", "TypeScript", "JavaScript"] },
    { title: "성능", items: ["React Profiler", "Lighthouse"] },
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
        "작은 이미지로 받아오는 용량 줄이기 · 4.22MB → 237KB, 94.4% 감소 — 작은 사진 카드에는 썸네일을, 상세 화면에는 큰 이미지를 불러오도록 바꿨습니다. 같은 사진 16장을 큰 이미지로 제공하는 조건과 썸네일 조건을 동일한 배포 환경에서 비교했습니다.",
        "화면 주변의 사진 카드만 생성 · 3,000개 → 최대 57개 — 보이는 사진과 그 주변 카드만 만들고, 스크롤하면 필요한 카드로 바꿨습니다. 한 번에 만드는 카드 수를 제한한 효과를 테스트용 목록과 모바일 크기의 PC 화면에서 확인했습니다.",
        "검색창·사진 상세 화면 재사용과 이전 검색 복원 — 공통 기능은 여러 화면에서 재사용하고, 화면마다 필요한 버튼과 검색 조건만 더했습니다. 검색 조건은 URL, 사진·좋아요는 Zustand에 저장해 다른 화면을 다녀와도 이전 검색과 목록 위치로 돌아오도록 했습니다.",
        "필요한 화면만 불러오고, 입력을 멈추면 장소 검색 — React.lazy로 지도·앨범·타임라인을 필요할 때 불러오고, 준비 중에는 로딩 화면을 보여줬습니다. 장소 입력은 바로 표시하고, 2자 이상이면 입력을 멈춘 뒤 0.4초 후 검색하도록 했습니다.",
        "사진이 움직일 때 필요한 부분만 갱신 — 사진 관계 그래프에서 React는 사진 간 연결과 선택을 맡고, D3는 움직이는 사진의 위치와 연결선만 바꾸도록 했습니다. 데이터가 바뀌거나 화면을 나가면 진행 중이던 작업을 멈췄습니다.",
      ],
    },
    {
      ...gameInfo,
      techTags: ["Next.js", "TypeScript", "Supabase", "REST API", "Playwright", "Vitest"],
      description:
        "게임을 검색해 상점별 가격을 비교하고 관심 목록에 저장하는 Next.js 개인 프로젝트입니다.",
      keyRoles:
        "개인 개발 · 검색·가격 비교·관심 목록 UI/API 연동 · Supabase Auth·DB · 중복 조회·화면 갱신 개선 · 테스트 자동화",
      achievements: [
        "바뀌지 않은 카드의 반복 처리 줄이기 · 모의 카드 처리 6회 → 2회 — 카드와 관심 목록 버튼을 함께 묶어, 내용이 같으면 다시 처리하지 않도록 했습니다. 같은 데이터로 실패·재시도·목록 추가 상황을 재현해 처리 횟수를 비교했습니다.",
        "게임 목록을 재사용해 반복 조회 방지 · 조건 변경 후 추가 제목 조회 0회 — 받아온 게임 목록을 제목별로 저장하고, 상점·가격 조건이 바뀌면 그 목록에서 맞는 게임만 다시 골랐습니다. 저장된 결과가 유효한 동안 다시 조회하지 않는지 테스트용 응답으로 확인했습니다.",
        "상점마다 다른 가격 정보를 한 가지 형식으로 처리 — ITAD에서 받은 금액·상점·구매 링크를 같은 형식으로 정리해 화면에서 함께 쓰도록 했습니다. 가격이 없거나 0원인 항목은 최저가 비교에서 제외했습니다.",
        "코드 수정 후 오류와 주요 화면 동작 자동 확인 — 가격 정보 처리와 요청 실패 처리를 테스트하고, Playwright로 주요 화면이 정상 작동하는지 확인했습니다. GitHub Actions에서 코드 검사·테스트·빌드를 자동 실행합니다.",
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
      : group.title === "학교 정보 접근성 향상을 위한 대화형 질의응답 시스템"
        ? {
            ...group,
            items: [
              group.items[0],
              "AI 답변을 문장·목록·링크로 정리해, 긴 답변도 읽기 쉽게 표시",
              ...group.items.slice(2),
            ],
          }
        : group,
  ),
  motivation: "",
} as const;
