import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Github, X } from "lucide-react";
import { portfolio, type Project } from "../data/portfolio";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "./ui/hover-card";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";

type Achievement = Project["achievements"][number];
type WorkflowTerm = NonNullable<Project["workflowTerms"]>[number];

const fallowMetrics = [
  {
    label: "소스 중복 lines",
    before: "668줄 (5.73%)",
    after: "121줄 (1.03%)",
    accent: true,
  },
  {
    label: "전체 중복 (프로젝트 기준)",
    before: "1,006줄 (9.4%)",
    after: "308줄 (2.9%)",
    accent: true,
  },
  { label: "Unused file/export", before: "15개", after: "0개", accent: true },
  { label: "Fallow health", before: "현재", after: "84.7 / B", accent: true },
] as const;



const aiSkillCards = [
  {
    name: "fallow",
    role: "정적 분석 자동화, unused file/export·중복 측정, 리팩터링 근거 수치화",
    result: "소스 중복 81.9% 감소, unused file/export 기준 15개 -> 0개",
  },
  {
    name: "hand-off",
    role: "장기 개발 맥락 유지, 이전 agent 인수인계서 확인 및 이어받기",
    result: "멀티 세션 개발 컨텍스트 연속성 확보",
  },
  {
    name: "grill-me",
    role: "요구사항 심층 분석, 엣지케이스 탐색, 모호한 기획 -> 개발 스펙 구체화",
    result: "구현 전 잠재 이슈 사전 제거",
  },
  {
    name: "to-prd / to-issues",
    role: "아이디어 -> PRD -> GitHub 이슈 자동 분할, 마일스톤 설정",
    result: "기획부터 티켓까지 일관된 흐름",
  },
  {
    name: "caveman",
    role: "긴 세션 진행 상황·분석 결과 압축 보고, 토큰 절약",
    result: "핵심 지표 중심 커뮤니케이션",
  },
  {
    name: "Playwright",
    role: "E2E smoke test, production build 검증, 모바일 safe-area 동작 확인",
    result: "배포 후 수동 검증 자동화",
  },
] as const;



function AchievementItem({
  achievement,
  open,
  onOpen,
}: {
  achievement: Achievement;
  open: boolean;
  onOpen: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        onMouseEnter={onOpen}
        className="flex w-full gap-3 text-left text-[0.875rem] leading-relaxed text-slate-600 transition-colors hover:text-indigo-600"
      >
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
        <span className="border-b border-dashed border-slate-300 transition-colors hover:border-indigo-400">
          {achievement.summary}
        </span>
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{
              opacity: 0,
              y: -4,
              height: 0,
              marginTop: 0,
              paddingTop: 0,
              paddingBottom: 0,
              borderWidth: 0,
            }}
            animate={{
              opacity: 1,
              y: 0,
              height: "auto",
              marginTop: 8,
              paddingTop: 12,
              paddingBottom: 12,
              borderWidth: 1,
              transition: { duration: 0.24, ease: "easeInOut" },
            }}
            exit={{
              opacity: 0,
              y: 10,
              height: 0,
              marginTop: 0,
              paddingTop: 0,
              paddingBottom: 0,
              borderWidth: 0,
              transition: { duration: 0.55, ease: "easeInOut" },
            }}
            className="ml-4 overflow-hidden rounded-lg border-slate-200 bg-slate-50 px-3"
          >
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {achievement.details}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </li>
  );
}

function WorkflowTermItem({ term }: { term: WorkflowTerm }) {
  const label = term.label.toLowerCase();
  const metrics = fallowMetrics;
  const cards = aiSkillCards;

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          className="cursor-help border-b border-blue-400 text-sm font-semibold text-blue-600 transition-colors hover:border-blue-600 hover:text-blue-700"
        >
          {term.label}
        </button>
      </HoverCardTrigger>
      <HoverCardContent
        side={label === "ai skill" ? "bottom" : "top"}
        align="start"
        className={
          label === "fallow" || label === "ai skill"
            ? "w-[min(92vw,46rem)] border-slate-200 bg-white p-0 text-slate-800 shadow-xl"
            : "w-80 border-blue-100 bg-white shadow-lg"
        }
      >
        {label === "fallow" ? (
          <div className="rounded-lg bg-white p-5">
            <h4 className="mb-5 text-sm font-semibold text-slate-800">
              {isEn ? "Fallow Code Quality Metrics - Before -> After" : "Fallow 코드 품질 지표 - 사용 전 -> 확인 기준"}
            </h4>
            <div className="space-y-0">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-4 border-b border-slate-200 py-2 text-xs last:border-b-0"
                >
                  <span className="font-medium text-slate-700">{metric.label}</span>
                  <span className="text-right text-slate-500">{metric.before}</span>
                  <span className="text-slate-400">-&gt;</span>
                  <span
                    className={`text-right font-semibold ${
                      metric.accent ? "text-emerald-600" : "text-slate-600"
                    }`}
                  >
                    {metric.after}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[0.6875rem] leading-relaxed text-slate-500">
              {isEn
                ? "Source duplication excludes test files / Overall duplication includes all files / 1 unused dev dependency is managed separately."
                : "소스 중복은 테스트 파일 제외 기준 / 전체 중복은 프로젝트 전체(테스트 포함) 기준 / unused dev dependency 1건은 별도 관리"}
            </p>
          </div>
        ) : label === "ai skill" ? (
          <div className="rounded-lg bg-white p-5">
            <p className="mb-2 text-xs font-semibold text-slate-500">
              {isEn ? "AI Collaboration Workflows" : "AI 협업 워크플로우"}
            </p>
            <p className="mb-5 text-sm font-semibold leading-relaxed text-slate-700">
              {isEn
                ? "Integrating AI as a core component of the dev pipeline rather than a simple code generator - structuring tools for planning, analysis, documentation, and verification."
                : "AI를 단순 코드 생성 도구가 아닌 개발 파이프라인 일부로 통합 - 기획·분석·정리·검증까지 각 단계에 맞는 tool을 직접 구성해 사용"}
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {cards.map((card) => (
                <div key={card.name} className="rounded-md border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-2">
                    <span className="inline-flex rounded-md border border-slate-200 bg-white/80 px-2 py-1 font-mono text-xs font-semibold text-slate-950 shadow-sm backdrop-blur-sm">
                      {card.name}
                    </span>
                  </p>
                  <p className="text-xs leading-relaxed text-slate-600">{card.role}</p>
                  <p className="mt-3 text-xs font-semibold leading-relaxed text-emerald-600">
                    {card.result}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
                Why
              </p>
              <p className="text-sm leading-relaxed text-slate-600">{term.purpose}</p>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
                Used
              </p>
              <div className="flex flex-wrap gap-1.5">
                {term.used.map((item) => (
                  <span
                    key={item}
                    className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-md bg-emerald-50 p-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                Result
              </p>
              <p className="text-sm leading-relaxed text-emerald-800">{term.result}</p>
            </div>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}

function WorkflowTerms({ terms }: { terms: readonly WorkflowTerm[] }) {
  return (
    <div className="mb-5 rounded-lg border border-blue-100 bg-blue-50/50 p-4">
      <p className="mb-3 text-sm leading-relaxed text-slate-600">
        주요 단어에 마우스를 올리면 어떤 스킬을 왜 썼고, 어떤 성과가 있었는지 볼 수 있습니다.
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {terms.map((term) => (
          <WorkflowTermItem key={term.label} term={term} />
        ))}
      </div>
    </div>
  );
}

function ProjectVisual({ project }: { project: Project }) {
  const galleryImages = project.imageGallery
    ? [project.imageGallery.main, ...project.imageGallery.supporting]
    : [];
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const selectedImage =
    selectedImageIndex === null ? null : galleryImages[selectedImageIndex];

  const showPreviousImage = () => {
    setSelectedImageIndex((currentIndex) =>
      currentIndex === null
        ? currentIndex
        : (currentIndex - 1 + galleryImages.length) % galleryImages.length,
    );
  };

  const showNextImage = () => {
    setSelectedImageIndex((currentIndex) =>
      currentIndex === null ? currentIndex : (currentIndex + 1) % galleryImages.length,
    );
  };

  if (project.imageGallery) {
    return (
      <>
        <div className="grid h-full grid-cols-[minmax(0,1fr)_minmax(5.5rem,32%)] gap-2 bg-white p-2 sm:gap-3 sm:p-3">
          <button
            type="button"
            onClick={() => setSelectedImageIndex(0)}
            className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label={`${project.imageGallery.main.alt} 확대`}
          >
            <img
              src={project.imageGallery.main.src}
              alt={project.imageGallery.main.alt}
              className="h-full w-full cursor-zoom-in object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </button>
          <div className="grid min-h-0 grid-rows-3 gap-2 sm:gap-3">
            {project.imageGallery.supporting.map((image, imageIndex) => (
              <button
                key={image.src}
                type="button"
                onClick={() => setSelectedImageIndex(imageIndex + 1)}
                className="group min-h-0 overflow-hidden rounded-md border border-slate-200 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-label={`${image.alt} 확대`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full cursor-zoom-in object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {selectedImage ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] flex items-center justify-center bg-white/95 p-4 backdrop-blur-sm sm:p-8"
              role="dialog"
              aria-modal="true"
              aria-label="Project image preview"
              onClick={() => setSelectedImageIndex(null)}
            >
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedImageIndex(null);
                }}
                className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-label="닫기"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPreviousImage();
                }}
                className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-label="이전 이미지"
              >
                <ChevronLeft className="h-6 w-6" strokeWidth={2} />
              </button>

              <motion.img
                key={selectedImage.src}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                src={selectedImage.src}
                alt={selectedImage.alt}
                onClick={(event) => event.stopPropagation()}
                className="max-h-[86vh] max-w-[86vw] rounded-lg border border-slate-200 bg-white object-contain shadow-2xl"
              />

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNextImage();
                }}
                className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-label="다음 이미지"
              >
                <ChevronRight className="h-6 w-6" strokeWidth={2} />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-md">
                {selectedImageIndex + 1} / {galleryImages.length}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </>
    );
  }

  if (project.image) {
    return (
      <img
        src={project.image}
        alt={project.imageAlt}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-full flex-col justify-between bg-slate-900 p-6 text-white">
      <div>
        <div className="mb-3 h-2 w-20 rounded-full bg-indigo-400" />
        <div className="mb-2 h-3 w-40 rounded-full bg-white/70" />
        <div className="h-3 w-28 rounded-full bg-white/30" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {project.metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg bg-white/10 p-3">
            <div className="mb-2 h-2 w-10 rounded-full bg-white/40" />
            <div className="h-2 w-16 rounded-full bg-indigo-300" />
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold text-slate-800">{title}</h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-relaxed text-slate-600">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectDetailsBody({ project }: { project: Project }) {

  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 text-sm font-semibold text-slate-800">Context</h4>
        <p className="text-sm leading-relaxed text-slate-600">{project.details.context}</p>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-semibold text-slate-800">Role</h4>
        <p className="text-sm leading-relaxed text-slate-600">{project.details.role}</p>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-semibold text-slate-800">Architecture</h4>
        <p className="text-sm leading-relaxed text-slate-600">
          {project.details.architecture}
        </p>
      </div>

      <DetailList title="Key Features" items={project.details.keyFeatures} />
      <DetailList title="Challenges" items={project.details.challenges} />
      <DetailList title="Solutions" items={project.details.solutions} />
      <DetailList title="검증 기록" items={project.details.validation} />
      {project.details.aiTraceability ? (
        <DetailList title="AI 작업 추적" items={project.details.aiTraceability} />
      ) : null}
      {project.details.operationalEvidence ? (
        <DetailList title="운영 확인" items={project.details.operationalEvidence} />
      ) : null}

      {project.details.process ? (
        <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4">
          <h4 className="mb-2 text-sm font-semibold text-indigo-900">Process</h4>
          <p className="text-sm leading-relaxed text-indigo-900/80">
            {project.details.process}
          </p>
        </div>
      ) : null}

      <div>
        <h4 className="mb-2 text-sm font-semibold text-slate-800">Result</h4>
        <p className="text-sm leading-relaxed text-slate-600">{project.details.result}</p>
      </div>

    </div>
  );
}

function ProjectDetails({ project }: { project: Project }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="border-slate-300 text-slate-500 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
        >
          Technical Details
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="text-slate-800">{project.title}</SheetTitle>
          <SheetDescription className="text-slate-500">
            문제, 구현, 검증, 결과를 자세히 정리했습니다.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 px-4 pb-8">
          <ProjectDetailsBody project={project} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const isReversed = index % 2 === 1;
  const cardRef = useRef<HTMLDivElement>(null);
  const [openAchievementIndexes, setOpenAchievementIndexes] = useState<number[]>([]);

  const openAllAchievements = () => {
    setOpenAchievementIndexes(
      project.achievements.slice(0, 3).map((_, achievementIndex) => achievementIndex),
    );
  };

  useEffect(() => {
    if (openAchievementIndexes.length === 0) {
      return;
    }

    const closeAchievementsOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !cardRef.current?.contains(event.target)
      ) {
        setOpenAchievementIndexes([]);
      }
    };

    document.addEventListener("pointerdown", closeAchievementsOnOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", closeAchievementsOnOutsideClick);
    };
  }, [openAchievementIndexes.length]);

  return (
    <motion.div
      ref={cardRef}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      className="flex min-h-[calc(100vh-7rem)] scroll-mt-8 items-center rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div
        className="grid w-full items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12"
      >
        <div className={`relative ${isReversed ? "lg:order-2" : ""}`}>
          <div className="relative pb-6">
            <div className="aspect-[16/10] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              <ProjectVisual project={project} />
            </div>

            <div
              className={`absolute -bottom-3 ${
                isReversed ? "left-4" : "right-4"
              } flex max-w-[calc(100%-2rem)] flex-wrap justify-end gap-2`}
            >
              {project.metrics.map((metric, idx) => (
                <motion.div
                  key={metric.label}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                >
                  <Badge
                    variant="secondary"
                    className="flex w-[5.75rem] flex-col items-center gap-0.5 border border-slate-200 bg-white px-2 py-1.5 text-center shadow-md"
                  >
                    <span className="text-[0.6875rem] font-semibold leading-none text-slate-800">
                      {metric.value}
                    </span>
                    <span className="text-[0.625rem] leading-none text-slate-500">
                      {metric.label}
                    </span>
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className={`flex flex-col justify-center pt-4 lg:pt-0 ${isReversed ? "lg:order-1" : ""}`}>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h3 className="text-[1.5rem] font-semibold leading-tight text-slate-800">
              {project.title}
            </h3>
            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
              {project.period}
            </Badge>
          </div>

          <p className="mb-3 text-[0.9375rem] leading-relaxed text-slate-600">
            {project.summary}
          </p>
          <p className="mb-5 text-[0.875rem] leading-relaxed text-slate-500">
            <span className="font-semibold text-slate-700">Role: </span>
            {project.role}
          </p>

          {project.workflowTerms ? <WorkflowTerms terms={project.workflowTerms} /> : null}

          <div className="mb-5 flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="border-transparent bg-slate-100 text-xs text-slate-700"
              >
                {tech}
              </Badge>
            ))}
          </div>

          <ul className="mb-6 space-y-2.5">
            {project.achievements.slice(0, 3).map((achievement, achievementIndex) => (
              <AchievementItem
                key={achievement.summary}
                achievement={achievement}
                open={openAchievementIndexes.includes(achievementIndex)}
                onOpen={openAllAchievements}
              />
            ))}
          </ul>

          <div className="flex flex-wrap gap-3">
            {project.links.live ? (
              <Button asChild className="bg-indigo-600 text-white hover:bg-indigo-700">
                <a href={project.links.live} target="_blank" rel="noreferrer">
                  View Live
                  <ExternalLink className="ml-2 h-4 w-4" strokeWidth={2} />
                </a>
              </Button>
            ) : null}

            {project.links.github ? (
              <Button
                asChild
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                <a href={project.links.github} target="_blank" rel="noreferrer">
                  <Github className="mr-2 h-4 w-4" strokeWidth={2} />
                  GitHub
                </a>
              </Button>
            ) : null}

            <ProjectDetails project={project} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Projects() {
  return (
    <motion.section
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="mb-20"
    >
      <h2 className="mb-12 text-[1.75rem] font-semibold tracking-tight text-slate-800">
        Featured Projects
      </h2>

      <div className="space-y-14">
        {portfolio.projects.map((project, idx) => (
          <ProjectCard key={project.title} project={project} index={idx} />
        ))}
      </div>
    </motion.section>
  );
}
