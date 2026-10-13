import { resumeVariantData as baseResumeData } from "./resume_frontend_bin";

export const resumePathKeyword = "marketpilot_frontend";

// Official role: https://www.marketpilot.it/careers/frontend-engineer
// Product: https://www.marketpilot.it/ (checked 2026-10-13)
// Radix usage, D3 graphs and AI-assisted development are supported by project evidence.
// Do not imply production design-system ownership, business charts, SEO/i18n or React Query experience.
const motivation = `마켓파일럿의 파이 챗과 마케팅 진단 화면에서 사용자가 결과를 이해하고 다음에 할 일을 정하기 쉽게 돕고 싶어 지원했습니다. 매장 진단과 상품 순위처럼 서로 다른 정보를 다루는 서비스에서는 필요한 내용을 읽기 쉽게 보여주고, 조회가 늦거나 실패했을 때도 상황을 알 수 있어야 한다고 생각합니다. 검색·가격 비교·사진 탐색 화면을 만들며 데이터 표시와 반복 작업을 개선한 경험을 이 과정에 활용하겠습니다.

PhotoMap에서는 3인 팀의 프론트엔드를 맡아 검색 조건과 목록 위치를 복원하고, 검색창과 사진 상세 화면을 공통으로 만들었습니다. Radix 기반 대화상자·선택 UI를 화면에 적용했으며, 사진과 태그의 관계를 D3 그래프로 탐색하도록 구현했습니다. Game Information Platform에서는 상점마다 다른 가격을 같은 기준으로 정리하고, 조건을 바꿀 때 받아 둔 목록을 재사용했습니다. 개발 중에는 AI 도구로 작업을 나누고 구현·테스트를 보조하되, 제안한 내용은 코드와 실행 결과를 확인한 뒤 반영했습니다.

입사 후에는 파이의 답변과 진단 결과를 모바일에서도 읽기 쉽게 구성하고, 로딩·빈 결과·오류 상황에서 다음 행동을 안내하겠습니다. 반복되는 UI는 공통 컴포넌트로 정리하고, 디자이너·백엔드 담당자와 정보의 표시 기준과 예외 처리를 맞추겠습니다. 변경한 기능은 테스트와 화면 검증으로 확인하고, 개선 효과가 확인된 방법을 다음 개발에 반영하겠습니다.`;

export const resumeVariantData = {
  ...baseResumeData,
  summary:
    "React·Next.js와 TypeScript로 검색·가격 비교·사진 탐색 화면을 만든 프론트엔드 개발자입니다. Radix 기반 UI를 활용하고 D3 관계 그래프를 구현했습니다. AI 도구를 조사·구현·테스트에 활용하며 결과를 코드와 측정으로 검증합니다.",
  projectHighlights: baseResumeData.projectHighlights.map((project) => {
    if (project.title === "PhotoMap") {
      return {
        ...project,
        techTags: [...project.techTags, "Radix UI", "Tailwind CSS"],
        achievements: project.achievements.map((achievement, index) => {
          if (index === 2) {
            return "공통 UI 재사용과 이전 검색 복원 — 검색 조건은 URL, 사진·좋아요는 Zustand로 관리하고 검색창·사진 상세를 공통으로 만들었습니다. Radix 기반 대화상자와 선택 UI를 앨범·업로드 화면에 적용했습니다. 다른 화면을 다녀와도 이전 검색과 목록 위치로 돌아오도록 했습니다.";
          }
          if (index === 4) {
            return "D3로 사진·태그 관계를 탐색하는 그래프 구현 — 연결된 사진과 태그를 시각적으로 탐색하도록 D3 그래프를 만들었습니다. React는 연결과 선택을, D3는 움직이는 사진의 위치와 연결선을 맡도록 나눴습니다. 데이터가 바뀌거나 화면을 나가면 진행 중인 작업을 멈췄습니다.";
          }
          return achievement;
        }),
      };
    }
    return {
      ...project,
      achievements: project.achievements.map((achievement, index) =>
        index === 3
          ? "AI 도구로 개발을 보조하고 코드·테스트로 검증 — 작업 분해와 API·화면·테스트 검토에 AI 도구를 활용했습니다. 제안은 가격 정보·요청 실패 테스트와 Playwright 화면 검사로 확인한 뒤 반영했습니다. GitHub Actions에서 코드 검사·테스트·빌드를 자동 실행합니다."
          : achievement,
      ),
    };
  }),
  motivation,
} as const;
