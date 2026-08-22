import { resumeWacusData } from "./resume_wacus";

export const manualResumePathKeyword = "blink";// 링크 바꾸는곳

// 지원동기 작성부분
const manualMotivation = `지원동기 적기.`;


export const resumeManualData = {
  ...resumeWacusData,
  motivation: manualMotivation,
} as const;

export const resumePathKeyword = manualResumePathKeyword;
export const resumeVariantData = resumeManualData;
