import { motion } from "motion/react";
import { ExternalLink, FileText } from "lucide-react";
import { portfolio } from "../data/portfolio";
import { Button } from "./ui/button";

export function Timeline() {
  return (
    <motion.section
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="mb-20"
    >
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-700">Activities</p>
        <h2 className="text-[1.75rem] font-semibold tracking-tight text-slate-900">
          활동과 논문
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {portfolio.activities.map((activity, idx) => (
          <motion.article
            key={activity.title}
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: idx * 0.08 }}
            className="flex h-full flex-col justify-between rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div>
              <div className="mb-3 text-xs font-semibold uppercase text-blue-700">
                {activity.date}
              </div>
              <h3 className="mb-2 text-base font-semibold leading-tight text-slate-900">
                {activity.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {activity.description}
              </p>
            </div>

            {activity.pdf ? (
              <Button
                asChild
                variant="outline"
                className="mt-5 w-fit border-slate-300 text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                <a href={activity.pdf.href} target="_blank" rel="noreferrer">
                  <FileText className="mr-2 h-4 w-4" strokeWidth={2} />
                  {activity.pdf.label}
                  <ExternalLink className="ml-2 h-4 w-4" strokeWidth={2} />
                </a>
              </Button>
            ) : null}
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}