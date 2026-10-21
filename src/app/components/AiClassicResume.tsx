import { ExternalLink, FileText, Github, Mail, Printer } from "lucide-react";
import { aiApplication as data } from "../data/aiApplication";
import "../../styles/bin-resume.css";

export function AiClassicResume() {
  return <main className="bin-classic-page bin-classic-editorial bin-classic-application">
    <article className="bin-classic-resume">
      <header className="bin-classic-header">
        <div><h1>{data.profile.name}</h1><p className="bin-classic-role">{data.profile.title}</p>
          <p className="bin-classic-intro">{data.intro}</p>
          <div className="bin-classic-contact">
            <a href={`mailto:${data.profile.email}`}><Mail />{data.profile.email}</a>
            <a href={data.profile.github} target="_blank" rel="noreferrer"><Github />github.com/sabin1108</a>
            <a href="/ai-portfolio" target="_blank" rel="noreferrer"><ExternalLink />포트폴리오</a>
          </div>
        </div><img className="bin-classic-photo" src={data.profile.image} alt={data.profile.name} />
      </header>
      <section className="bin-classic-section bin-classic-motivation"><h2>지원동기</h2>{data.motivation.map(text => <p className="bin-classic-summary" key={text}>{text}</p>)}</section>
      <section className="bin-classic-section"><h2>프로젝트 경험</h2>
        <div className="bin-classic-projects">{data.projects.map((project, index) => <article className="bin-classic-project" key={project.id}>
          <div className="bin-classic-project-heading"><div><h3>{project.title}</h3><p>{project.subtitle}</p></div><span>{project.period}</span></div>
          <p className="bin-classic-role-line"><strong>담당</strong>{project.role}</p>
          <ul className="bin-classic-achievements" aria-label={`${project.title} 문제 해결 경험`}>
            {project.cases.map(item => <li className="bin-classic-featured-result" key={item.title}>
              <h4>{item.title}</h4><p>{item.problem} {item.action}</p><p>{item.result}</p>
            </li>)}
          </ul>
          <div className="bin-classic-links"><span>{project.tech.join(" · ")}</span>
            <a href={`/ai-portfolio#project-${index}-scene-2`} target="_blank" rel="noreferrer"><ExternalLink />구현 과정·측정 근거</a>
            {project.github && <a href={project.github} target="_blank" rel="noreferrer"><Github />소스</a>}
            {index === 0 && <a href={data.research[0].href} target="_blank" rel="noreferrer"><FileText />논문 DOI</a>}
          </div>
        </article>)}</div>
      </section>
      <section className="bin-classic-section bin-classic-supporting"><h2>특허·논문·발표</h2>
        <div className="bin-classic-activities">{data.research.map(item => <article key={item.title}>
          <div><strong>{item.title}</strong><span>{item.status}</span></div>{item.resumeDescription.map(text => <p key={text}>{text}</p>)}
          <a href={item.href} target="_blank" rel="noreferrer"><FileText />{item.linkLabel}</a>
          {item.pdfHref && <p><a href={item.pdfHref} target="_blank" rel="noreferrer"><FileText />{item.pdfLabel}</a></p>}
        </article>)}</div>
      </section>
      <section className="bin-classic-section"><h2>기술 역량</h2><p className="bin-classic-summary">React · Next.js · TypeScript · REST API</p></section>
      <section className="bin-classic-section"><h2>학력</h2>
        <div className="bin-classic-education"><div><strong>{data.education.school}</strong><p>{data.education.degree}</p></div><div><p>졸업</p><p>GPA {data.education.gpa} · {data.education.period}</p></div></div>
        <div className="bin-classic-certificates"><p>{data.education.certificate}</p></div>
      </section>
    </article>
    <button type="button" className="bin-classic-print print:hidden" onClick={() => window.print()}><Printer />PDF 저장</button>
  </main>;
}
