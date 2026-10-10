import { resumeVariantData as baseResumeData } from "./resume_frontend_bin";

export const resumePathKeyword = "adrock";

// Job posting: https://www.jobkorea.co.kr/Recruit/GI_Read/49800917
// Official product: https://www.drivingplus.me/
// Publisher listing: https://play.google.com/store/apps/details?id=com.adrock.driverlicense300
// Confirmed role: mobile/frontend developer. The accessible posting does not name a stack.
const motivation = `애드락애드버테인먼트의 운전면허 PLUS가 문제 풀이부터 오답 복습, 운전학원 찾기까지 제공한다는 점에 관심을 갖고 지원했습니다. 작은 화면에서도 필요한 정보를 찾고, 이전에 보던 내용으로 돌아갈 수 있는 사용 흐름을 만드는 일을 하고 싶습니다. 사진 탐색과 게임 가격 비교 서비스를 개발하며 쌓은 모바일 웹 화면과 상태 관리 경험을 모바일·프론트엔드 개발에 활용하겠습니다.

PhotoMap에서는 지도·앨범·타임라인에 공통 검색창과 사진 상세 화면을 적용하고, 다른 화면을 다녀와도 검색 조건과 목록 위치를 복원하도록 했습니다. 작은 사진 카드에는 썸네일을 사용하고 화면 주변의 카드만 만들어, 한 번에 받아오는 이미지 용량과 생성하는 카드 수를 줄였습니다. Game Information Platform에서는 외부 가격 데이터를 같은 형식으로 정리하고 요청 실패와 재시도를 테스트했습니다. 사용자가 정보를 찾아보고 다시 확인하는 과정에서 화면과 데이터가 어떻게 이어져야 하는지 고민한 경험입니다.

입사 후에는 서비스의 화면 구성과 개발 방식을 익히고, 문제 풀이·복습·정보 탐색 과정에서 사용자가 불편을 겪는 지점을 살피겠습니다. 여러 화면에서 반복되는 기능은 함께 사용할 수 있도록 만들고, 변경한 화면은 작은 화면 크기와 빈 결과·요청 실패 상황에서도 확인하겠습니다. 기획·디자인·개발 동료와 의도를 맞추며 기존 서비스를 꾸준히 개선하는 개발자가 되겠습니다.`;

export const resumeVariantData = {
  ...baseResumeData,
  summary:
    "React·Next.js로 사진 탐색과 가격 비교 서비스를 만든 프론트엔드 개발자입니다. 모바일 화면에서 검색·상세 확인이 이어지도록 공통 UI와 상태 관리를 구현했습니다. 이미지 용량과 불필요한 처리를 줄이고, 변경한 기능은 측정과 테스트로 확인했습니다.",
  motivation,
} as const;
