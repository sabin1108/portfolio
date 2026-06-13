import { motion } from "motion/react";
import { Blocks, Code2, Github, Layers, MessageSquare, NotebookTabs } from "lucide-react";
import { portfolio, portfolioEn } from "../data/portfolio";
import { Card } from "./ui/card";

const icons = {
  JavaScript: Code2,
  React: Layers,
  TypeScript: Blocks,
  GitHub: Github,
  Slack: MessageSquare,
  Notion: NotebookTabs,
};

export function TechStack() {
  const isEn = window.location.pathname === "/en" || window.location.pathname === "/resume/en" || window.location.pathname === "/resume-en";
  const data = isEn ? portfolioEn : portfolio;
  return (
    <motion.section
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="mb-20"
    >
      <h2 className="mb-8 text-[1.75rem] font-semibold tracking-tight text-slate-800">
        Tech Stack
      </h2>

      <div className="flex flex-wrap gap-4">
        {data.techStack.map((tech) => {
          const Icon = icons[tech] ?? Code2;

          return (
            <Card
              key={tech}
              className="flex items-center gap-3 border-slate-200 bg-white px-5 py-3 shadow-sm transition-shadow hover:shadow-md"
            >
              <Icon className="h-5 w-5 text-slate-600" strokeWidth={2} />
              <span className="text-[0.9375rem] font-medium text-slate-700">
                {tech}
              </span>
            </Card>
          );
        })}
      </div>
    </motion.section>
  );
}
