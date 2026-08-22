import { resumeWacusData } from "./resume_wacus";

export const manualResumePathKeyword = "typee_griun_web";

const manualMotivation = `타이비에 관심을 가진 이유는 손글씨 폰트 제작 서비스 그리운이 사용자의 개인적인 표현을 디지털 제품 경험으로 바꾸는 서비스라고 보았기 때문입니다. 폰트 제작은 결과물이 시각적으로 좋아 보이는 것뿐 아니라, 사용자가 글씨를 입력하거나 이미지를 전달하고 결과를 확인하는 과정이 끊기지 않아야 신뢰가 생기는 흐름이라고 생각했습니다.

저는 PhotoMap에서 이미지가 많은 화면을 다루며 사용자가 처음 보는 결과를 빠르게 보여주기 위해 렌더링 범위와 이미지 로딩 순서를 나누어 개선했습니다. Zustand selector, 가상화, D3 tick 분리로 복합 UI의 변경 범위를 줄였고, 고정 모바일 조건에서 첫 사진 표시와 LCP를 반복 측정했습니다. 이 경험은 그리운처럼 이미지와 결과 미리보기, 진행 상태, 최종 결과 확인이 중요한 웹 서비스에서 사용자가 기다리는 시간을 줄이고 화면 상태를 명확히 보여주는 데 연결될 수 있다고 봅니다.

Game Information Platform에서는 서로 다른 외부 API 응답을 공통 view model로 정리하고, 0원·null·timeout·rate limit 같은 예외 경로를 테스트로 확인했습니다. 서비스 규모가 작더라도 입력값, 처리 상태, 실패 상황, 결과 표시 기준을 분리해두면 기능을 빠르게 붙이면서도 기존 흐름을 깨지 않을 수 있다고 배웠습니다.

입사 후에는 신입 웹 개발자로서 먼저 그리운 서비스의 사용자 흐름과 기존 코드 구조를 정확히 이해하고, 작은 화면 개선도 측정 가능한 기준과 테스트 가능한 구조로 남기며 기여하고 싶습니다. AI는 요구사항 분해와 기존 코드 조사, 반복 검증을 돕는 도구로 사용하되, 최종 판단은 실제 사용자 흐름과 코드 근거, build와 테스트 결과를 기준으로 하겠습니다.`;

export const resumeTypeEGriunData = {
  ...resumeWacusData,
  motivation: manualMotivation,
} as const;

export const resumePathKeyword = manualResumePathKeyword;
export const resumeVariantData = resumeTypeEGriunData;