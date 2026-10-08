import { resumeVariantData as baseResumeData } from "./resume_frontend_bin";

export const resumePathKeyword = "powercube_frontend";

// https://www.jobkorea.co.kr/Recruit/GI_Read/49976162
const motivation = `파워큐브코리아가 충전 운영·관제·정산에 필요한 정보를 웹 화면으로 연결하는 업무를 한다는 점에 관심을 갖고 지원했습니다. 사용자가 화면에서 현재 상태를 파악하고 필요한 작업을 이어갈 수 있도록, 데이터 표시 방식과 화면 흐름을 함께 설계하는 개발을 하고 싶습니다.

PhotoMap에서는 지도·앨범·타임라인의 검색과 사진 상세를 공통 UI로 구성하고, 화면을 오간 뒤에도 검색 조건과 목록 위치를 복원하도록 만들었습니다. Game Information Platform에서는 외부 API의 금액·상점·구매 링크를 공통 모델로 정리하고, 가격 결측값과 API 실패를 테스트로 확인했습니다. 관리자·관제 화면의 공통 UI를 정리하고 API 응답과 화면 표시 기준을 맞추는 데 이 경험을 활용하겠습니다.

개발 과정에서는 AI 도구를 기존 코드 조사와 반복 구현·검증에 활용해 왔습니다. 생성된 코드는 요구사항과 실제 동작을 대조하고, 테스트 결과를 확인한 뒤 반영했습니다. 입사 후에도 기존 충전·정산 업무의 흐름부터 익히고, 조회·필터·상태 표시처럼 자주 쓰는 화면부터 개선하겠습니다. 작은 변경도 실제 화면과 테스트로 확인하며 운영 중인 서비스를 안정적으로 고쳐 나가겠습니다.`;

export const resumeVariantData = {
  ...baseResumeData,
  motivation,
} as const;
