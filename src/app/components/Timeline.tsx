import { motion } from "motion/react";
import { ExternalLink, FileText } from "lucide-react";
import { portfolio, portfolioEn } from "../data/portfolio";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

export function Timeline() {
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
        Activities & Achievements
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {data.activities.map((activity, idx) => (
          <motion.div
            key={activity.title}
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <Card className="flex h-full flex-col justify-between border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div>
                <div className="mb-3 text-[0.75rem] font-semibold uppercase tracking-wider text-indigo-600">
                  {activity.date}
                </div>
                <h3 className="mb-2 text-[1rem] font-semibold leading-tight text-slate-800">
                  {activity.title}
                </h3>
                <p className="text-[0.875rem] leading-relaxed text-slate-500">
                  {activity.description}
                </p>
              </div>

              {activity.pdf ? (
                <Button
                  asChild
                  variant="outline"
                  className="mt-5 w-fit border-slate-300 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <a href={activity.pdf.href} target="_blank" rel="noreferrer">
                    <FileText className="mr-2 h-4 w-4" strokeWidth={2} />
                    {activity.pdf.label}
                    <ExternalLink className="ml-2 h-4 w-4" strokeWidth={2} />
                  </a>
                </Button>
              ) : null}
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
