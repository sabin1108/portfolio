import { motion } from "motion/react";
import { portfolio } from "../data/portfolio";
import { Card } from "./ui/card";

export function Timeline() {
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
        {portfolio.activities.map((activity, idx) => (
          <motion.div
            key={activity.title}
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <Card className="h-full border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-3 text-[0.75rem] font-semibold uppercase tracking-wider text-indigo-600">
                {activity.date}
              </div>
              <h3 className="mb-2 text-[1rem] font-semibold leading-tight text-slate-800">
                {activity.title}
              </h3>
              <p className="text-[0.875rem] leading-relaxed text-slate-500">
                {activity.description}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
