import { ExternalLink, FileText, Github, Mail, Printer } from "lucide-react";
import type { resumeFrontendData } from "../data/main";
import { binCaseNarratives } from "../data/binCaseNarratives";

type ResumeData = typeof resumeFrontendData;

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="bin-classic-section"><h2>{title}</h2>{children}</section>;
}

function EmphasizedText({ text, phrases = [] }: { text: string; phrases?: readonly string[] }) {
  const matches = phrases
    .map((phrase) => ({ phrase, index: text.indexOf(phrase) }))
    .filter((match) => match.index >= 0)
    .sort((a, b) => a.index - b.index);
  const content: React.ReactNode[] = [];
  let cursor = 0;

  matches.forEach(({ phrase, index }) => {
    content.push(text.slice(cursor, index));
    content.push(<mark className="bin-classic-emphasis" key={phrase + index}>{phrase}</mark>);
    cursor = index + phrase.length;
  });
  content.push(text.slice(cursor));

  return <>{content}</>;
}
export function BinClassicResume({ data }: { data: ResumeData }) {
  const { profile, summary, coreSkills, projectHighlights, activityGroups, education } = data;
  const narratives = binCaseNarratives;
  return (
    <main className="bin-classic-page">
      <article className="bin-classic-resume">
        <header className="bin-classic-header">
          <div>
            <p className="bin-classic-kicker">FRONT-END DEVELOPER</p>
            <h1>{profile.name}</h1>
            <p className="bin-classic-role">{profile.title}</p>
            <div className="bin-classic-contact">
              <a href={`mailto:${profile.contacts.email}`}><Mail />{profile.contacts.email}</a>
              <a href={profile.contacts.github} target="_blank" rel="noreferrer"><Github />github.com/sabin1108</a>
              <a href="https://binportfolio.site/" target="_blank" rel="noreferrer"><ExternalLink />binportfolio.site</a>
            </div>
          </div>
          {profile.image ? <img className="bin-classic-photo" src={profile.image} alt={profile.name} /> : null}
        </header>

        <ResumeSection title="자기소개">
          <p className="bin-classic-summary">{summary}</p>
        </ResumeSection>

        <ResumeSection title="프로젝트 경험">
          <div className="bin-classic-projects">
            {projectHighlights.map((project) => (
              <article className="bin-classic-project" key={project.title}>
                <div className="bin-classic-project-heading">
                  <div><h3>{project.title}</h3><p>{project.description}</p></div>
                  <span>{project.period}</span>
                </div>
                <p className="bin-classic-role-line"><strong>담당</strong>{project.keyRoles}</p>
<div className="bin-classic-story">
                  {[...(narratives[project.title] ?? []).filter((story) => story.kind === "ux").slice(0, 1), ...(narratives[project.title] ?? []).filter((story) => story.kind === "tech").slice(0, 1)].map((story) => (
                    <div key={story.title}>
                      <h4>{story.title}</h4>
                      <p><strong>문제와 목표</strong><EmphasizedText text={[story.situation, story.check, story.goal].join(" ")} phrases={story.emphasis} /></p>
<p><strong>처리 과정</strong><EmphasizedText text={story.action} phrases={story.emphasis} /></p>
                      <p><strong>결과</strong><EmphasizedText text={story.result} phrases={story.emphasis} /></p>

                    </div>
                  ))}
                </div>
                <div className="bin-classic-links">
                  <span>{project.techTags.join(" · ")}</span>
                  <a href={project.github} target="_blank" rel="noreferrer"><Github />소스</a>
                  {project.live ? <a href={project.live} target="_blank" rel="noreferrer"><ExternalLink />서비스</a> : null}
                  {"evidence" in project && typeof project.evidence === "string" ? <a href={project.evidence} target="_blank" rel="noreferrer"><FileText />근거</a> : null}
                </div>
              </article>
            ))}
          </div>
        </ResumeSection>

        <ResumeSection title="발표·논문·자격">
          <div className="bin-classic-activities">
            {activityGroups.map((group) => (
              <article key={`${group.title}-${group.items[0]}`}>
                <div><strong>{group.title}</strong><span>{group.period}</span></div>
                {group.venue ? <p className="bin-classic-venue">{group.venue}</p> : null}
                {group.items.map((item) => <p key={item}>{item}</p>)}
                {group.href ? <a href={group.href} target="_blank" rel="noreferrer"><FileText />{group.linkLabel ?? "자료 보기"}</a> : null}
              </article>
            ))}
          </div>
        </ResumeSection>

        <ResumeSection title="기술 역량">
          <div className="bin-classic-skills">
            {coreSkills.filter((group) => group.items.length > 0).map((group) => (
              <p key={group.title}><strong>{group.title}</strong>{group.items.join(" · ")}</p>
            ))}
          </div>
        </ResumeSection>

        <ResumeSection title="학력">
          <div className="bin-classic-education"><div><strong>{education.school}</strong><p>{education.degree}</p></div><div><p>{education.status}</p><p>GPA {education.gpa} · {education.period}</p></div></div>
          <div className="bin-classic-certificates">{education.certificates.map((certificate) => <p key={certificate.name}><strong>{certificate.name}</strong> · {certificate.issuer} · {certificate.date}</p>)}</div>
        </ResumeSection>
      </article>
      <button type="button" className="bin-classic-print print:hidden" onClick={() => window.print()}><Printer />PDF 저장</button>
    </main>
  );
}
