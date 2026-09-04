import type { resumeManualData } from "./resume_manual";

type ResumeRegistryData = typeof resumeManualData;

type ResumeRegistryModule = {
  resumePathKeyword: string | readonly string[];
  resumeVariantData: ResumeRegistryData;
};

const resumeModules = import.meta.glob<Partial<ResumeRegistryModule>>("./resume*.ts", {
  eager: true,
});

function isResumeRegistryModule(
  module: Partial<ResumeRegistryModule>,
): module is ResumeRegistryModule {
  const hasKeyword = Array.isArray(module.resumePathKeyword)
    ? module.resumePathKeyword.some((keyword) => keyword.trim().length > 0)
    : typeof module.resumePathKeyword === "string" && module.resumePathKeyword.trim().length > 0;

  return hasKeyword && Boolean(module.resumeVariantData);
}

export const resumeRegistry = Object.values(resumeModules)
  .filter(isResumeRegistryModule)
  .flatMap((module) => {
    const keywords = Array.isArray(module.resumePathKeyword)
      ? module.resumePathKeyword
      : [module.resumePathKeyword];

    return keywords
      .filter((keyword) => keyword.trim().length > 0)
      .map((keyword) => ({
        keyword,
        data: module.resumeVariantData,
      }));
  });