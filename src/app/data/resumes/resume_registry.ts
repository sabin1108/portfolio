import type { resumeManualData } from "./resume_manual";

type ResumeRegistryData = typeof resumeManualData;

type ResumeRegistryModule = {
  resumePathKeyword: string;
  resumeVariantData: ResumeRegistryData;
};

const resumeModules = import.meta.glob<Partial<ResumeRegistryModule>>("./resume*.ts", {
  eager: true,
});

function isResumeRegistryModule(
  module: Partial<ResumeRegistryModule>,
): module is ResumeRegistryModule {
  return (
    typeof module.resumePathKeyword === "string" &&
    module.resumePathKeyword.trim().length > 0 &&
    Boolean(module.resumeVariantData)
  );
}

export const resumeRegistry = Object.values(resumeModules)
  .filter(isResumeRegistryModule)
  .map((module) => ({
    keyword: module.resumePathKeyword,
    data: module.resumeVariantData,
  }));