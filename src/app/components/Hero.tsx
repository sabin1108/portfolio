import { motion } from "motion/react";
import { CheckCircle2, Download, Github, Mail } from "lucide-react";
import { portfolio } from "../data/portfolio";
import { Button } from "./ui/button";

export function Hero() {
  const { profile } = portfolio;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mb-20"
    >
      <div className="max-w-4xl">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-800">
            {profile.name} | {profile.title}
          </h1>

          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <a
              href={`mailto:${profile.contacts.email}`}
              className="flex items-center gap-1.5 transition-colors hover:text-indigo-600"
            >
              <Mail className="h-4 w-4" />
              <span>{profile.contacts.email}</span>
            </a>
            <a
              href={profile.contacts.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-indigo-600"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
          </div>

          <p className="mb-4 text-lg font-medium leading-relaxed text-slate-700">
            {profile.headline}
          </p>

          <ul className="mb-4 space-y-3 text-base leading-relaxed text-slate-600">
            {profile.highlights.map((achievement) => (
              <li key={achievement} className="flex gap-2">
                <CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-indigo-500" />
                <span className="break-keep">{achievement}</span>
              </li>
            ))}
          </ul>

          <p className="mb-6 leading-relaxed text-slate-600">{profile.intro}</p>

          <Button
            asChild={profile.resume.enabled}
            disabled={!profile.resume.enabled}
            variant="outline"
            className="border-slate-300 text-slate-700"
          >
            {profile.resume.enabled ? (
              <a href={profile.resume.href} download>
                <Download className="mr-2 h-4 w-4" />
                이력서 PDF
              </a>
            ) : (
              <span>
                <Download className="mr-2 h-4 w-4" />
                {profile.resume.label}
              </span>
            )}
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
