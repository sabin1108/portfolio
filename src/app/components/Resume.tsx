import { ExternalLink, FileText, Github, Mail, Printer } from "lucide-react";
import { portfolio } from "../data/portfolio";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

function ResumeHeader() {
  const { profile } = portfolio;

  return (
    <header className="resume-header mb-8 border-b border-slate-200 pb-6">
      <div className="mb-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Resume
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {profile.name}
            </h1>
            <p className="mt-2 text-lg font-semibold text-slate-700">{profile.title}</p>
          </div>
        </div>

        <div className="print:hidden flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() => window.print()}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Printer className="mr-2 h-4 w-4" />
            PDF 저장
          </Button>
          <Button asChild variant="outline" className="border-slate-300 text-slate-700">
            <a href="/" aria-label="포트폴리오로 이동">
              <ExternalLink className="mr-2 h-4 w-4" />
              Portfolio
            </a>
          </Button>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
        <a
          href={`mailto:${profile.contacts.email}`}
          className="inline-flex items-center gap-1.5 hover:text-indigo-600"
        >
          <Mail className="h-4 w-4" />
          {profile.contacts.email}
        </a>
        <a
          href={profile.contacts.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-indigo-600"
        >
          <Github className="h-4 w-4" />
          github.com/sabin1108
        </a>
      </div>

      <p className="max-w-4xl text-[0.95rem] leading-relaxed text-slate-700">
        {portfolio.resume.summary}
      </p>
    </header>
  );
}

function Section({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`resume-section mb-8 break-inside-avoid ${className}`}>
      <h2 className="mb-4 border-b border-slate-200 pb-2 text-[1.05rem] font-bold uppercase tracking-wide text-slate-900">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function Resume() {
  const { resume, education } = portfolio;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 print:bg-white print:px-0 print:py-0">
      <article className="resume-sheet mx-auto max-w-5xl bg-white px-6 py-8 shadow-sm print:max-w-none print:px-0 print:py-0 print:shadow-none sm:px-10">
        <ResumeHeader />

        <Section title="Core Skills">
          <div className="grid gap-4 sm:grid-cols-2">
            {resume.coreSkills.map((group) => (
              <div key={group.title} className="rounded-lg border border-slate-200 p-4 print:p-3">
                <h3 className="mb-3 text-sm font-semibold text-slate-800">{group.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Badge key={item} variant="secondary" className="bg-slate-100 text-slate-700">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Projects">
          <div className="resume-projects space-y-6">
            {resume.projectHighlights.map((project) => (
              <div key={project.title} className="break-inside-avoid">
                <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{project.title}</h3>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="print:hidden inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <Github className="h-3.5 w-3.5" />
                      GitHub
                    </a>
                  </div>
                  <span className="text-sm font-medium text-slate-500">{project.period}</span>
                </div>
                <p className="mb-2 text-[0.8rem] font-medium leading-relaxed text-indigo-700">
                  {project.teamRole}
                </p>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {project.techTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[0.7rem] font-semibold text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <ul className="space-y-1.5">
                  {project.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2 text-[0.92rem] leading-relaxed text-slate-700">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Activities" className="resume-activities-section">
          <div className="resume-activities space-y-4">
            {resume.activityGroups.map((group) => (
              <article
                key={`${group.title}-${group.items[0]}`}
                className="resume-activity-card break-inside-avoid rounded-lg border border-slate-200 bg-white p-5"
              >
                <div className="mb-3">
                  <h3 className="text-base font-bold text-slate-900">{group.title}</h3>
                  {"venue" in group ? (
                    <p className="mt-1 text-sm font-medium text-indigo-700">{group.venue}</p>
                  ) : null}
                </div>
                <ul className="space-y-1.5">
                  {group.items.map((activity) => (
                    <li key={activity} className="flex gap-2 text-[0.92rem] leading-relaxed text-slate-700">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
                {"href" in group ? (
                  <Button
                    asChild
                    variant="outline"
                    className="mt-4 border-slate-300 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <a href={group.href} target="_blank" rel="noreferrer">
                      <FileText className="mr-2 h-4 w-4" />
                      {group.linkLabel}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                ) : null}
              </article>
            ))}
          </div>
        </Section>

        <Section title="Education & Certifications">
          <h3 className="text-base font-bold text-slate-900">{education.school}</h3>
          <p className="mt-1 text-sm text-slate-600">{education.degree}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            {education.status} (GPA {education.gpa}) ({education.period})
          </p>
          <div className="mt-4 space-y-1">
            {education.certificates.map((certificate) => (
              <p key={certificate.name} className="text-sm leading-relaxed text-slate-700">
                <span className="font-semibold text-slate-900">{certificate.name}</span>
                <span className="text-slate-500"> | </span>
                {certificate.issuer}
                <span className="text-slate-500"> ({certificate.date})</span>
              </p>
            ))}
          </div>
        </Section>
      </article>
    </main>
  );
}


