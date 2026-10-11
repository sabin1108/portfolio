import { resumeVariantData as baseResumeData } from "./resume_frontend_bin";

export const resumePathKeyword = "smiledragon_frontend";

// Job posting: https://www.jobkorea.co.kr/Recruit/GI_Read/49839010
// Company product: https://www.smiledragon.co.kr/project/chvu
// The posting title is a general developer role; frontend/backend hiring is not assumed.
const motivation = `스마일드래곤이 만드는 마케팅 플랫폼에서 사용자의 반복 작업을 줄이는 프론트엔드 개발을 하고 싶어 지원했습니다. 인플루언서 마케팅 협업 도구인 체험뷰처럼 여러 정보와 진행 상황을 다루는 서비스에서는 필요한 정보를 쉽게 찾고 다음 작업으로 이어갈 수 있는 화면이 중요하다고 생각합니다. React·Next.js로 검색과 탐색 화면을 만들며 쌓은 경험을 이런 업무 흐름을 개선하는 데 활용하고 싶습니다.

PhotoMap에서는 지도·앨범·타임라인의 검색창과 사진 상세 화면을 공통으로 만들고, 다른 화면을 다녀와도 이전 검색 조건과 목록 위치로 돌아오도록 했습니다. 사진 목록에는 작은 이미지를 사용하고 화면 주변의 카드만 생성해 탐색에 필요한 처리량을 줄였습니다. Game Information Platform에서는 상점마다 다른 가격 정보를 같은 기준으로 정리하고, 검색 조건이 바뀌어도 이미 받아온 게임 목록을 재사용했습니다. 요청이 실패하거나 결과가 없을 때의 동작도 테스트했습니다. 이 과정에서 화면을 구현하는 것뿐 아니라 사용자가 같은 작업을 반복하거나 잘못된 정보를 보는 상황을 줄이는 데 관심을 갖게 됐습니다.

입사 후에는 서비스의 사용자와 실제 업무 흐름을 먼저 익히겠습니다. 자주 쓰는 조회·검색 화면에서 불편한 점을 찾고, 백엔드 개발자와 데이터 형식과 오류 처리 기준을 맞추며 개선하겠습니다. 반복되는 화면은 공통으로 만들고, 수정한 기능은 모바일과 오류 상황에서도 확인해 팀이 안심하고 기능을 이어서 개발할 수 있도록 기여하겠습니다.`;

export const resumeVariantData = {
  ...baseResumeData,
  motivation,
} as const;
