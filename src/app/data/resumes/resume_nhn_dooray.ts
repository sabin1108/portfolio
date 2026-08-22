import { resumeFrontendData } from "./resume_frontend";

export const resumeNhnDoorayData = {
  ...resumeFrontendData,
  summary: [
    "상태·렌더링·네트워크 경계를 나누고 테스트 가능한 구조로 개선해온 프론트엔드 개발자 민사빈입니다.",
    "PhotoMap에서는 Zustand selector, 가상화, D3 tick 분리로 복합 UI의 변경 범위를 줄이고, 고정 모바일 조건에서 이미지 전달 정책을 100회 반복 검증했습니다. Game Information Platform에서는 외부 API 차이를 공통 view model로 흡수하고 0원·null·timeout·rate limit 경로를 자동화 테스트로 확인했습니다.",
    "AI는 코드를 대신 결정하는 도구가 아니라 요구사항 분해, 기존 코드 조사, 실패 테스트와 반복 검증을 돕는 도구로 사용합니다. 최종 채택은 domain rule, 원시 측정값, Vitest·Playwright·build 결과를 기준으로 판단합니다.",
  ].join("\n\n"),
  motivation: `NHN Dooray! 공고에서 협업 서비스의 프론트엔드 개발과 운영, 디자인 시스템 컴포넌트 유지보수, AI 기능 도입을 하나의 역할로 다룬다는 점에 관심을 가졌습니다. 협업 도구는 기능 수보다 많은 사용자가 같은 흐름을 반복해도 화면 상태와 상호작용이 예측 가능하고, 변경이 기존 업무 흐름을 깨지 않는 것이 중요하다고 생각합니다.

PhotoMap에서 지도·앨범·타임라인·WebGL 화면이 같은 사진 상태를 공유할 때 Zustand selector로 구독 범위를 나누고, D3 tick과 대량 목록 렌더링을 React 생명주기 밖의 책임으로 분리했습니다. Game Information Platform에서는 검색·할인·상세·관심 목록이 공통 view model만 사용하도록 API 경계를 정리하고, Vitest·Playwright·CI로 가격 예외와 주요 사용자 흐름을 검증했습니다. 이 경험은 구축 후에도 계속 바뀌는 협업 서비스와 공통 컴포넌트의 영향 범위를 관리하는 일에 연결될 수 있습니다.

또한 AI를 요구사항 분해, 코드 경로 조사, 테스트 보강에 사용하되 결과는 명시적인 규칙과 자동화 테스트로 검증해왔습니다. Dooray!에서도 React·TypeScript 기반 화면을 안정적으로 운영하고, AI 기능을 기존 협업 흐름 안에 넣을 때 입력·실패·빈 상태·사용자 피드백까지 검증 가능한 프론트엔드로 만드는 데 기여하고 싶습니다.`,
} as const;
