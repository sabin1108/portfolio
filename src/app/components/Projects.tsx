import { motion } from "motion/react";
import { ExternalLink, Github, Sparkles } from "lucide-react";
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

function AchievementItem({ achievement }: { achievement: Achievement }) {
  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <li className="flex cursor-default gap-3 text-[0.875rem] leading-relaxed text-slate-600 transition-colors hover:text-indigo-600">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
          <span className="border-b border-dashed border-slate-300 transition-colors hover:border-indigo-400">
            {achievement.summary}
          </span>
        </li>
      </HoverCardTrigger>
      <HoverCardContent
        side="top"
        align="start"
        className="w-80 border-slate-200 bg-white shadow-lg"
      >
        <div className="space-y-3">
          <p className="text-sm leading-relaxed text-slate-600">{achievement.details}</p>
          <div className="flex gap-3 border-t border-slate-100 pt-2">
            <div className="flex-1 rounded-md bg-red-50 px-3 py-2 text-center">
              <p className="text-[10px] font-medium uppercase tracking-wide text-red-400">
                Before
              </p>
              <p className="text-sm font-semibold text-red-600">{achievement.before}</p>
            </div>
            <div className="flex-1 rounded-md bg-emerald-50 px-3 py-2 text-center">
              <p className="text-[10px] font-medium uppercase tracking-wide text-emerald-400">
                After
              </p>
              <p className="text-sm font-semibold text-emerald-600">{achievement.after}</p>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

function WorkflowTermItem({ term }: { term: WorkflowTerm }) {
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
        side="top"
        align="start"
        className="w-80 border-blue-100 bg-white shadow-lg"
      >
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

function ProjectDetails({ project }: { project: Project }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="border-slate-300 text-slate-500 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
        >
          <Sparkles className="mr-2 h-4 w-4" strokeWidth={2} />
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

        <div className="mt-6 space-y-6 px-4 pb-8">
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
          <DetailList title="Validation" items={project.details.validation} />

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

          {project.details.codeHighlight ? (
            <div>
              <h4 className="mb-2 text-sm font-semibold text-slate-800">
                {project.details.codeHighlight.title}
              </h4>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4">
                <code className="whitespace-pre text-xs text-slate-300">
                  {project.details.codeHighlight.code}
                </code>
              </pre>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const isReversed = index % 2 === 1;

  return (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      className={`flex flex-col gap-8 lg:flex-row lg:gap-12 ${
        isReversed ? "lg:flex-row-reverse" : ""
      }`}
    >
      <div className="relative flex-1">
        <div className="relative pb-6">
          <div className="aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
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
                  className="border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-md"
                >
                  {metric.value} {metric.label}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center pt-4 lg:pt-0">
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
          {project.achievements.slice(0, 3).map((achievement) => (
            <AchievementItem key={achievement.summary} achievement={achievement} />
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

      <div className="space-y-20">
        {portfolio.projects.map((project, idx) => (
          <ProjectCard key={project.title} project={project} index={idx} />
        ))}
      </div>
    </motion.section>
  );
}
