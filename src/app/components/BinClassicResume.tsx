import { ExternalLink, FileText, Github, Mail, Printer } from "lucide-react";
import type { resumeFrontendData } from "../data/main";
import { binCaseNarratives } from "../data/binCaseNarratives";
import "../../styles/bin-resume.css";

type ResumeData = typeof resumeFrontendData;
const firstPhotoSyntheticResult =
  "고정 모바일 4G 환경에서 캐시를 비우고 최적화 버전을 100회 측정해 첫 사진 표시 p95 약 2.6초를 기록했습니다. 실제 사용자 통계가 아닌 합성 실험 결과입니다.";
const firstPhotoSyntheticEmphasis = "첫 사진 표시 p95 약 2.6초";
const resumeResultOverrides: Record<string, string> = {
  "PhotoMap::사진이 많아질수록 목록이 끊긴 문제":
    "많은 사진을 불러오는 상황에서도 현재 보고 있는 영역이 먼저 표시되고, 화면 밖 항목까지 한 번에 그리던 부담을 줄였습니다.",
  "Game Information Platform::상점 응답이 늦을 때 화면이 비던 문제":
    "빈 화면 대신 현재 상태와 다음 행동을 보여주게 됐고, API가 일시적으로 불안정한 상황에서도 기존 정보나 재시도 안내를 확인할 수 있게 했습니다.",
};

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

function getResumeStories(projectTitle: string) {
  const selectedStories = [
    ...(binCaseNarratives[projectTitle] ?? []).filter((story) => story.kind === "ux").slice(0, 1),
    ...(binCaseNarratives[projectTitle] ?? []).filter((story) => story.kind === "tech").slice(0, 1),
  ];

  return selectedStories.map((story) => {
    if (projectTitle === "PhotoMap" && story.title === "모바일에서 첫 사진이 늦게 나타난 문제") {
      return {
        ...story,
        check: "같은 화면을 여러 번 재현하면서 첫 사진이 실제로 보이는 시점과 처음 내려받는 이미지 양을 따로 확인하였고, 화면이 열린 시간만으로는 사용자가 느끼는 불편을 설명하기 어려웠습니다.",
        action: "목록에서는 사진을 작은 카드로 보여주기 때문에 원본 크기의 이미지가 필요하지 않았습니다. 목록에는 작은 이미지를, 상세 화면에는 큰 이미지를 불러오도록 나누고 이미지 주소를 선택하는 코드를 한곳에 모았습니다. 첫 줄의 사진은 바로 불러오되 높은 요청 우선순위는 첫 사진에만 지정했습니다. 나머지 사진은 화면에 가까워질 때 요청하도록 바꿔 초기 요청이 한꺼번에 몰리지 않게 했습니다. 작은 이미지가 없는 기존 사진은 원본 주소를 사용하도록 처리했습니다.",
        result: firstPhotoSyntheticResult,
        emphasis: [...(story.emphasis ?? []), "목록에는 작은 이미지를, 상세 화면에는 큰 이미지를", "높은 요청 우선순위는 첫 사진에만", firstPhotoSyntheticEmphasis],
      };
    }

    const resultOverride = resumeResultOverrides[`${projectTitle}::${story.title}`];
    if (projectTitle === "Game Information Platform" && story.title === "상점 응답이 늦을 때 화면이 비던 문제") {
      return {
        ...story,
        action: story.action.replace(
          "구분했습니다. 각 상황에 맞는 안내는 별도 컴포넌트로 표시했습니다.",
          "구분하고, 각 상황에 맞는 안내를 별도 컴포넌트로 표시했습니다.",
        ),
        result: resultOverride ?? story.result,
      };
    }
    if (resultOverride) {
      return { ...story, result: resultOverride };
    }

    return story;
  });
}

export function BinClassicResume({ data }: { data: ResumeData }) {
  const { profile, summary, coreSkills, projectHighlights, activityGroups, education } = data;
  return (
    <main className="bin-classic-page">
      <article className="bin-classic-resume">
        <header className="bin-classic-header">
          <div>
            <h1>{profile.name}</h1>
            <p className="bin-classic-role">{profile.title}</p>
            <div className="bin-classic-contact">
              <a href={`mailto:${profile.contacts.email}`}><Mail />{profile.contacts.email}</a>
              <a href={profile.contacts.github} target="_blank" rel="noreferrer"><Github />github.com/sabin1108</a>
              <a href="/portfolio_bin" target="_blank" rel="noreferrer"><ExternalLink />포트폴리오</a>
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
                  {getResumeStories(project.title).map((story) => (
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
          <dl className="bin-classic-skills">
            {coreSkills.filter((group) => group.items.length > 0).map((group) => (
              <div className="bin-classic-skill-row" key={group.title}>
                <dt>{group.title}</dt>
                <dd>{group.items.map(item => <span key={item}>{item}</span>)}</dd>
              </div>
            ))}
          </dl>
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
