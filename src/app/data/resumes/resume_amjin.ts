import { resumeVariantData as baseResumeData } from "./resume_frontend_bin";

export const resumePathKeyword = "amjin_frontend";

// Job posting: https://www.jobkorea.co.kr/Recruit/GI_Read/50109520
// Company solutions: https://www.amgine.co.kr/
// The posting identifies information security and a frontend role.
// Its detailed requirements were inaccessible; no specific stack is assumed.
const motivation = `앰진이 네트워크 위협과 이상행위를 분석하는 보안 솔루션을 만든다는 점에 관심을 갖고 지원했습니다. 분석 결과를 사용자가 이해하고 필요한 정보를 찾아볼 수 있도록 화면으로 연결하는 일을 하고 싶습니다. 여러 곳에서 받은 데이터를 정리하고, 조회에 실패했을 때도 현재 상황을 알 수 있게 만든 경험을 앰진의 프론트엔드 개발에 활용하겠습니다.

Game Information Platform에서는 상점마다 다른 가격 정보를 한 가지 형식으로 정리하고, 가격이 없는 항목이 최저가로 표시되지 않도록 처리했습니다. 요청 실패와 재시도 상황을 테스트하고, 같은 게임을 조건만 바꿔 찾을 때는 이미 받아온 목록을 재사용했습니다. PhotoMap에서는 여러 화면의 검색창과 사진 상세를 공통으로 만들고, 다른 화면을 다녀와도 이전 검색 조건과 목록 위치로 돌아오도록 했습니다. 이 경험을 바탕으로 데이터 표시 기준과 사용자의 작업 흐름을 함께 살피겠습니다.

입사 후에는 제품에서 다루는 정보의 의미와 사용자의 업무부터 익히겠습니다. 이후 조회·검색·상세 확인 과정에서 혼동하거나 반복하는 작업을 찾아 개선하고 싶습니다. 수정한 화면은 정상 응답뿐 아니라 빈 결과와 오류 상황에서도 확인하며, 변경 내용을 팀과 공유하겠습니다.`;

export const resumeVariantData = {
  ...baseResumeData,
  summary:
    "React·Next.js로 검색·가격 비교·사진 탐색 화면을 만든 프론트엔드 개발자입니다. 외부 데이터를 화면에서 쓰기 쉬운 형식으로 정리하고, 공통 화면과 조회 결과를 재사용했습니다. 구현한 기능은 측정과 테스트로 확인하며 개선했습니다.",
  motivation,
} as const;
