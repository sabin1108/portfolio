import { motion } from "motion/react";
import { portfolio } from "../data/portfolio";

export function TechStack() {
  return (
    <motion.section
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="mb-20"
    >
      <div className="mb-8">
        <p className="text-sm font-semibold text-slate-500">핵심 역량</p>
        <h2 className="text-[1.75rem] font-semibold tracking-tight text-slate-900">
          기술 스택
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {portfolio.capabilityGroups.map((group) => (
          <section
            key={group.title}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h3 className="mb-3 text-sm font-semibold text-slate-900">{group.title}</h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>
    </motion.section>
  );
}