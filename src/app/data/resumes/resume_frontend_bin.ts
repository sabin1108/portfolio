import { resumeFrontendData } from "./frozen/resume_frontend";

export const resumePathKeyword = "frontend_bin";

export const resumeVariantData = {
  ...resumeFrontendData,
  motivation: "",
} as const;
