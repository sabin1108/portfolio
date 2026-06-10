import { motion } from "motion/react";
import { portfolio } from "../data/portfolio";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

export function Education() {
  const { education } = portfolio;

  return (
    <motion.section
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="mb-16"
    >
      <h2 className="mb-8 text-[1.75rem] font-semibold tracking-tight text-slate-800">
        Education & Certificates
      </h2>

      <Card className="border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="mb-2 text-[1.25rem] font-semibold leading-tight text-slate-800">
              {education.school}
            </h3>
            <p className="text-[0.9375rem] text-slate-600">{education.degree}</p>
          </div>
          <Badge
            variant="secondary"
            className="w-fit bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            공개 정보만 요약
          </Badge>
        </div>

        <p className="mb-5 text-[0.9375rem] leading-relaxed text-slate-600">
          {education.description}
        </p>

        {education.certificates.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {education.certificates.map((certificate) => (
              <Badge key={certificate} variant="secondary" className="bg-slate-100 text-slate-700">
                {certificate}
              </Badge>
            ))}
          </div>
        ) : null}
      </Card>
    </motion.section>
  );
}
