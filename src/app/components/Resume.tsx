import { useState, useEffect } from "react";
import { ExternalLink, FileText, Github, Globe, Mail, Printer, Lock, Key } from "lucide-react";
import { resumeData, RESUME_PASSCODE } from "../data/resume";
import { resumeEliceData } from "../data/resume_elice";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

function ResumeHeader({
  profile,
  summary,
}: {
  profile: typeof resumeData.profile;
  summary: string;
}) {
  return (
    <header className="resume-header mb-8 border-b border-slate-200 pb-6">
      <div className="mb-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {profile.image && (
            <div className="h-52 w-44 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm print:h-52 print:w-44">
              <img
                src={profile.image}
                alt={profile.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
              이력서
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {profile.name}
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-lg font-semibold text-slate-700">{profile.title}</span>
              <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold py-0.5 px-2">
                신입
              </Badge>
            </div>
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
              포트폴리오
            </a>
          </Button>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2 text-[0.95rem] text-slate-600">
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
        <a
          href="https://binportfolio.site/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-indigo-600"
        >
          <Globe className="h-4 w-4" />
          binportfolio.site
        </a>
      </div>

      <div className="max-w-4xl text-[1.025rem] leading-relaxed text-slate-700 whitespace-pre-line space-y-3">
        {summary}
      </div>
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
      <h2 className="mb-4 border-b border-slate-200 pb-2 text-[1.2rem] font-bold uppercase tracking-wide text-slate-900">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function Resume() {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [inputKey, setInputKey] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    // 1. Check URL query param '?key=...'
    const params = new URLSearchParams(window.location.search);
    const urlKey = params.get("key");
    if (urlKey === RESUME_PASSCODE) {
      setAuthorized(true);
      sessionStorage.setItem("resume_auth_key", urlKey);
      return;
    }

    // 2. Check sessionStorage
    const savedKey = sessionStorage.getItem("resume_auth_key");
    if (savedKey === RESUME_PASSCODE) {
      setAuthorized(true);
    }
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = inputKey.trim();
    if (cleanKey === RESUME_PASSCODE) {
      setAuthorized(true);
      sessionStorage.setItem("resume_auth_key", cleanKey);
      setErrorMsg("");
    } else {
      setErrorMsg("올바르지 않은 비밀번호입니다. 다시 입력해주세요.");
    }
  };

  const currentPath = window.location.pathname;
  const isElicePath = currentPath.includes("elice_a3b2c");
  const activeResumeData = isElicePath ? resumeEliceData : resumeData;

  const { summary, coreSkills, projectHighlights, activityGroups, education, profile } = activeResumeData;

  if (!authorized && !isElicePath) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <Lock className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">비공개 이력서</h2>
            <p className="mt-2 text-sm text-slate-500">
              이 이력서는 비공개 설정되어 있습니다. <br />
              비밀번호를 입력하여 잠금을 해제해주세요.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label htmlFor="auth-key" className="sr-only">
                비밀번호
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Key className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  id="auth-key"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="block w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              {errorMsg && (
                <p className="mt-2 text-xs font-medium text-red-500">{errorMsg}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              잠금 해제
            </Button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <a href="/" className="text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors">
              포트폴리오 홈으로 돌아가기
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 print:bg-white print:px-0 print:py-0">
      <article className="resume-sheet mx-auto max-w-5xl bg-white px-6 py-8 shadow-sm print:max-w-none print:px-0 print:py-0 print:shadow-none sm:px-10">
        <ResumeHeader profile={profile} summary={summary} />

        <div className="resume-first-page-grid">
          {activeResumeData.motivation && (
            <Section title="지원 동기" className="resume-motivation-section">
              <div className="resume-copy resume-motivation-copy max-w-4xl text-[0.95rem] leading-relaxed text-slate-700 whitespace-pre-line">
                {activeResumeData.motivation}
              </div>
            </Section>
          )}

          <Section title="기술 스택" className="resume-skills-section">
            <div className="resume-copy resume-skills-copy text-[0.975rem] leading-relaxed text-slate-700 space-y-2.5 pl-1">
              <div className="resume-primary-skills">
                {coreSkills
                  .filter((group) => group.items.length > 0 && !group.title.startsWith("Tools - "))
                  .map((group) => (
                    <div key={group.title}>
                      <span className="font-bold text-slate-800">• {group.title}</span>: {group.items.join(", ")}
                    </div>
                  ))}
              </div>

              <div className="resume-tool-skills">
                <span className="font-bold text-slate-800">• Tools:</span>
                <ul className="pl-6 mt-1 space-y-1.5 list-disc text-slate-600">
                  {coreSkills
                    .filter((group) => group.title.startsWith("Tools - "))
                    .map((sub) => (
                      <li key={sub.title}>
                        <span className="font-semibold text-slate-700">{sub.title.replace("Tools - ", "")}</span>: {sub.items.join(", ")}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </Section>
        </div>

        <Section title="프로젝트" className="resume-projects-section">
          <div className="resume-projects space-y-6">
            {projectHighlights.map((project, projectIndex) => (
              <div
                key={project.title}
                className={`resume-project break-inside-avoid ${
                  projectIndex === 0 ? "resume-project-first" : ""
                }`}
              >
                <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[1.125rem] font-bold text-slate-900">{project.title}</h3>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="print:hidden inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <Github className="h-3.5 w-3.5" />
                      GitHub 바로가기
                    </a>
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        className="print:hidden inline-flex items-center gap-1 rounded-md border border-indigo-300 bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 hover:border-indigo-400 hover:bg-indigo-100"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        서비스 바로가기
                      </a>
                    )}
                  </div>
                  <span className="text-[0.95rem] font-medium text-slate-500">{project.period}</span>
                </div>
                <p className="mb-2 text-[0.875rem] font-semibold leading-relaxed text-indigo-700">
                  {project.teamRole}
                </p>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {project.techTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[0.775rem] font-semibold text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-2.5 text-[0.95rem] text-slate-700 leading-relaxed space-y-3">
                  <div className="text-slate-600">
                    <span className="font-bold text-slate-900">프로젝트 설명: </span>{project.description}
                  </div>
                  <div className="text-slate-600">
                    <span className="font-bold text-slate-900">핵심 역할: </span>{project.keyRoles}
                  </div>
                  
                  {project.issues && project.issues.length > 0 && (
                    <div className="mt-4 space-y-1">
                      <div className="font-bold text-slate-900 text-[1rem] project-subheading">이슈</div>
                      <ul className="list-disc pl-5 mt-1 space-y-1.5 text-slate-600 text-[0.95rem] leading-relaxed">
                        {project.issues.map((issue, idx) => (
                          <li key={idx}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {project.resolutions && project.resolutions.length > 0 && (
                    <div className="mt-4 space-y-1">
                      <div className="font-bold text-slate-900 text-[1rem] project-subheading">해결</div>
                      <ul className="list-disc pl-5 mt-1 space-y-1.5 text-slate-600 text-[0.95rem] leading-relaxed">
                        {project.resolutions.map((res, idx) => (
                          <li key={idx}>{res}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {project.achievements && project.achievements.length > 0 && (
                    <div className="mt-4 space-y-1">
                      <div className="font-bold text-slate-900 text-[1rem] project-subheading">성과</div>
                      <ul className="list-disc pl-5 mt-1 space-y-1.5 text-slate-600 text-[0.95rem] leading-relaxed">
                        {project.achievements.map((ach, idx) => (
                          <li key={idx}>{ach}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="활동 및 수상" className="resume-activities-section">
          <div className="resume-activities space-y-4">
            {activityGroups.map((group) => (
              <article
                key={`${group.title}-${group.items[0]}`}
                className="resume-activity-card break-inside-avoid rounded-lg border border-slate-200 bg-white p-5"
              >
                <div className="mb-3">
                  <h3 className="text-[1.05rem] font-bold text-slate-900">{group.title}</h3>
                  {group.venue ? (
                    <p className="mt-1 text-[0.925rem] font-medium text-indigo-700">{group.venue}</p>
                  ) : null}
                </div>
                <ul className="space-y-1.5">
                  {group.items.map((activity) => (
                    <li key={activity} className="flex gap-2 text-[0.975rem] leading-relaxed text-slate-700">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
                {group.href && group.linkLabel ? (
                  <Button
                    asChild
                    variant="outline"
                    className="mt-4 border-slate-300 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <a
                      href={group.href.startsWith("http") ? group.href : `${window.location.origin}${group.href}`}
                      target="_blank"
                      rel="noreferrer"
                    >
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

        <Section title="학력 및 자격증">
          <h3 className="text-[1.05rem] font-bold text-slate-900">{education.school}</h3>
          <p className="mt-1 text-[0.95rem] text-slate-600">{education.degree}</p>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-slate-700">
            {education.status} (GPA {education.gpa}) ({education.period})
          </p>
          <div className="mt-4 space-y-1">
            {education.certificates.map((certificate) => (
              <p key={certificate.name} className="text-[0.95rem] leading-relaxed text-slate-700">
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
