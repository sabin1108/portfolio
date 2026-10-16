import { useEffect } from "react";
import { ArrowUpRight, FileText, Github, Mail, Printer } from "lucide-react";
import { aiApplication as data } from "../data/aiApplication";
import "../../styles/ai-application.css";

function Research() {
  return <div className="ai-research-list">{data.research.map((item) => <article key={item.title}>
    <p className="ai-eyebrow">{item.status}</p><h3>{item.title}</h3><p>{item.description}</p>
    <a href={item.href} target="_blank" rel="noreferrer">{item.linkLabel}<ArrowUpRight size={15} /></a>
  </article>)}</div>;
}

function Education() {
  return <div className="ai-education"><h3>{data.education.school} · {data.education.degree}</h3>
    <p>{data.education.period} · 졸업 · 학점 {data.education.gpa}</p><p>{data.education.certificate}</p></div>;
}

function Skills() {
  return <dl className="ai-skills">{data.skills.map((group) => <div key={group.title}><dt>{group.title}</dt><dd>{group.items.join(" · ")}</dd></div>)}</dl>;
}

export function AiApplication({ resume = false }: { resume?: boolean }) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `민사빈 | AI ${resume ? "Resume" : "Portfolio"}`;
    return () => { document.title = previousTitle; };
  }, [resume]);

  return <div className={`ai-application ${resume ? "ai-resume" : "ai-portfolio"}`}>
    <a className="ai-skip" href="#ai-main">본문으로 이동</a>
    <nav className="ai-nav" aria-label="AI 지원 자료">
      <a className="ai-brand" href="/ai-portfolio">SABIN MIN<span>AI / DEVELOPMENT</span></a>
      <div><a href="/ai-portfolio" aria-current={!resume ? "page" : undefined}>Portfolio</a><a href="/ai-resume" aria-current={resume ? "page" : undefined}>Resume</a>
        <button type="button" onClick={() => window.print()}><Printer size={16} /><span>PDF 저장</span></button></div>
    </nav>
    <main id="ai-main" className="ai-main">
      <header className="ai-hero">
        <div>
          <p className="ai-eyebrow">{resume ? "AI RESUME" : "SELECTED WORK / AI PORTFOLIO"}</p>
          <h1>{resume ? data.profile.name : <>AI의 답변을<br />사용자의 작업으로.</>}</h1>
          <p className="ai-role">{resume ? data.profile.title : "민사빈 · AI 서비스 개발자"}</p>
          <p className="ai-intro">{data.intro}</p>
          <div className="ai-contacts"><a href={`mailto:${data.profile.email}`}><Mail size={15} />{data.profile.email}</a><a href={data.profile.github} target="_blank" rel="noreferrer"><Github size={15} />GitHub</a></div>
          {!resume && <a className="ai-primary-link" href="/ai-resume">이력서 보기<ArrowUpRight size={19} /></a>}
        </div>
        {resume ? <img className="ai-portrait" src={data.profile.image} alt="민사빈" /> : <aside className="ai-index" aria-label="프로젝트 목차">
          <p className="ai-eyebrow">CONTENTS</p>
          {data.projects.map((project, index) => <a href={`#${project.id}`} key={project.id}><span>0{index + 1}</span><div><strong>{project.title}</strong><small>{project.subtitle}</small></div><ArrowUpRight size={18} /></a>)}
          <a href="#research"><span>05</span><div><strong>논문 · 특허</strong><small>연구와 구현을 잇는 근거</small></div><ArrowUpRight size={18} /></a>
        </aside>}
      </header>

      {resume && <section className="ai-section ai-motivation"><h2>지원동기 <span>교원그룹 · AI 플랫폼 개발</span></h2>{data.motivation.map(text => <p key={text}>{text}</p>)}</section>}

      <section className="ai-section ai-projects" aria-labelledby="ai-project-heading">
        <div className="ai-section-heading"><p className="ai-eyebrow">SELECTED WORK</p><h2 id="ai-project-heading">{resume ? "프로젝트·연구 경험" : "대화부터 검증까지, 연결한 경험"}</h2></div>
        {data.projects.map((project, index) => <article className="ai-project" id={project.id} key={project.id}>
          <div className="ai-project-heading"><span className="ai-number">0{index + 1}</span><div><p className="ai-eyebrow">{project.period}</p><h3>{project.title}</h3>{!resume && <p className="ai-subtitle">{project.subtitle}</p>}</div></div>
          <p className="ai-project-role">{project.role}</p><p className="ai-project-summary">{project.summary}</p>
          {!resume && <>
            {project.image ? <figure className="ai-project-image"><img src={project.image} alt={`${project.title} 실제 서비스 화면`} loading="lazy" /><figcaption>실제 프로젝트 화면 · {project.tech.join(" / ")}</figcaption></figure>
              : <ol className="ai-flow" aria-label="요약 플랫폼 처리 흐름">{["문서 수집", "텍스트 정제", "AI 요약", "지식 기반 검증", "저장·시각화"].map((step, i) => <li key={step}><small>0{i + 1}</small><span>{step}</span></li>)}</ol>}
            <div className="ai-steps">{project.steps.map(step => <div key={step.title}><h4>{step.title}</h4><p>{step.body}</p></div>)}</div>
          </>}
          <div className="ai-result"><p className="ai-eyebrow">{resume ? "결과·검증" : "RESULT & EVIDENCE"}</p><p className="ai-result-title">{project.result}</p><p className="ai-scope">{project.scope}</p></div>
          <div className="ai-project-links"><span>{project.tech.join(" · ")}</span>
            {project.github && <a href={project.github} target="_blank" rel="noreferrer">소스 코드<ArrowUpRight size={14} /></a>}
            {index === 0 && <a href={data.research[0].href} target="_blank" rel="noreferrer">논문 DOI<ArrowUpRight size={14} /></a>}
            {resume && <a href={`/ai-portfolio#project-${index}-scene-2`}>구현 과정<ArrowUpRight size={14} /></a>}
          </div>
        </article>)}
      </section>
      <section className="ai-section" id="research"><div className="ai-section-heading"><p className="ai-eyebrow">RESEARCH & PATENT</p><h2>논문·특허</h2></div><Research /></section>
      <section className="ai-section ai-background"><div><h2>기술 역량</h2><Skills /></div><div><h2>학력·자격</h2><Education /></div></section>
      <footer className="ai-footer"><p>민사빈 · AI 서비스 개발자</p><a href={resume ? "/ai-portfolio" : "/ai-resume"}><FileText size={16} />{resume ? "AI 포트폴리오" : "AI 이력서"}<ArrowUpRight size={16} /></a></footer>
    </main>
  </div>;
}
