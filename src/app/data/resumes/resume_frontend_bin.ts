import { resumeFrontendData } from "./frozen/resume_frontend";

const hiddenSkillItems = ["Adapter / Normalizer", "Image Delivery", "GitHub Actions"];
const filteredSkillGroups = ["State & Data", "Performance", "Test & Quality"];

export const resumePathKeyword = "frontend_bin";

export const resumeVariantData = {
  ...resumeFrontendData,
  coreSkills: resumeFrontendData.coreSkills.map((group) =>
    filteredSkillGroups.includes(group.title)
      ? {
          ...group,
          items: group.items.filter((item) => !hiddenSkillItems.includes(item)),
        }
      : group,
  ),
  motivation: "",
} as const;
