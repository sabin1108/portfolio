import { motion } from "motion/react";
import { portfolio, portfolioEn } from "../data/portfolio";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

export function Education() {
  const isEn = window.location.pathname === "/en" || window.location.pathname === "/resume/en" || window.location.pathname === "/resume-en";
  const data = isEn ? portfolioEn : portfolio;
  const { education } = data;
  const educationDescription =
    "description" in education
      ? education.description
      : `${education.status} (GPA ${education.gpa}) (${education.period})`;

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
        <div className="mb-6">
          <div>
            <h3 className="mb-2 text-[1.25rem] font-semibold leading-tight text-slate-800">
              {education.school}
            </h3>
            <p className="text-[0.9375rem] text-slate-600">{education.degree}</p>
          </div>
        </div>

        <p className="mb-5 text-[0.9375rem] leading-relaxed text-slate-600">
          {educationDescription}
        </p>

        {education.certificates.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {education.certificates.map((certificate) => {
              const certificateLabel =
                typeof certificate === "string"
                  ? certificate
                  : `${certificate.name} | ${certificate.issuer} (${certificate.date})`;

              return (
                <Badge
                  key={certificateLabel}
                  variant="secondary"
                  className="bg-slate-100 text-slate-700"
                >
                  {certificateLabel}
                </Badge>
              );
            })}
          </div>
        ) : null}
      </Card>
    </motion.section>
  );
}
