import { portfolio } from "./portfolio";

export const fullstackPortfolio = {
  ...portfolio,
  profile: {
    ...portfolio.profile,
    title: "Front-End 중심 FullStack Developer",
    headline:
      "호기심으로 넓게 탐구하고, 지표와 판단으로 엄격하게 적용하는 프론트엔드 중심 풀스택 개발자입니다.",
  },
} as const;
