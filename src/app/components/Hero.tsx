import { motion } from "motion/react";
import { Github, Mail } from "lucide-react";
import { portfolio } from "../data/portfolio";

export function Hero() {
  const { profile } = portfolio;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <div className="max-w-4xl">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            {profile.name}
          </h1>
          <span className="text-xl font-semibold text-slate-500">{profile.title}</span>
        </div>

        <p className="mb-6 text-lg font-semibold leading-relaxed text-slate-800">
          {profile.headline}
        </p>

        <div className="mb-7 flex flex-wrap gap-3 text-sm text-slate-600">
          <a
            href={`mailto:${profile.contacts.email}`}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 transition-colors hover:border-blue-300 hover:text-blue-700"
          >
            <Mail className="h-4 w-4" />
            {profile.contacts.email}
          </a>
          <a
            href={profile.contacts.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 transition-colors hover:border-blue-300 hover:text-blue-700"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </div>
    </motion.section>
  );
}