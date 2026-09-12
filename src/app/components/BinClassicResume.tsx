import { wacusPhotoMapStories, wacusGameInfoStories } from "../data/resumes/resume_wacus";
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
    "배포 환경에서 동일 SVG를 사용하는 합성 사진 항목 1,000개와 모바일 화면 조건으로 가상화 유무를 30쌍 비교했습니다. 스크롤 직후 사진 클릭부터 모달 이미지 준비까지의 지연 중앙값을 59.6ms에서 13.2ms로 줄였습니다. 사진 목록 단독 실험이며, 실제 화면의 픽셀 표시 완료 시점이나 실사용자 지표를 측정한 결과는 아닙니다.",
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

function getResumeStories(projectTitle: string, isWacus: boolean) {
  if (isWacus && projectTitle === "PhotoMap") return wacusPhotoMapStories;
  if (isWacus && projectTitle === "Game Information Platform") return wacusGameInfoStories;
  const selectedStories = [
    ...(binCaseNarratives[projectTitle] ?? []).filter((story) => story.kind === "ux").slice(0, 1),
    ...(binCaseNarratives[projectTitle] ?? []).filter((story) => story.kind === "tech").slice(0, 1),
  ];

  return selectedStories.map((story) => {
    if (projectTitle === "PhotoMap" && story.title === "모바일에서 첫 사진이 늦게 나타난 문제") {
      return {
        ...story,
        situation: "모바일 QA에서 화면이 열린 뒤에도 첫 사진이 늦게 나타나는 문제를 확인했습니다.",
        check: "첫 사진 표시 시점과 초기 이미지 전송량을 따로 측정하고,",
        goal: "같은 모바일 조건에서 첫 사진을 약 2~3초 안에 보여주는 것을 목표로 했습니다.",
        action: "목록에서는 사진을 작은 카드로 보여주기 때문에 원본 크기의 이미지가 필요하지 않았습니다. 목록에는 작은 이미지를, 상세 화면에는 큰 이미지를 불러오도록 나누고 이미지 주소를 선택하는 코드를 한곳에 모았습니다. 첫 줄의 사진은 바로 불러오되 높은 요청 우선순위는 첫 사진에만 지정하며, 나머지 사진은 화면에 가까워질 때 요청하도록 바꿔 초기 요청이 한꺼번에 몰리지 않게 했습니다.",
        result: firstPhotoSyntheticResult,
        emphasis: [...(story.emphasis ?? []), "목록에는 작은 이미지를, 상세 화면에는 큰 이미지를", "높은 요청 우선순위는 첫 사진에만", firstPhotoSyntheticEmphasis, "첫 사진 표시 시점과 초기 이미지 전송량을 따로 측정", "첫 사진을 약 2~3초 안에"],
      };
    }

    if (projectTitle === "PhotoMap" && story.title === "사진이 많아질수록 목록이 끊긴 문제") {
      if (isWacus) {
        return {
          ...story,
          title: "기술 선택의 변화 · Context API에서 Zustand로",
          situation: "Context API로 사진과 분류 등의 공유 상태를 관리하던 중, 상태 변경과 관계없는 화면까지 갱신되는 문제를 확인했습니다.",
          check: "공유 상태를 사용하는 화면마다 필요한 값이 달랐기 때문에,",
          goal: "어떤 상태 변경이 어느 화면을 갱신해야 하는지를 기준으로 구독 범위를 나누는 것을 목표로 했습니다.",
          action: "공유 상태 관리를 Zustand로 전환하고, 각 화면이 필요한 값만 selector로 구독하도록 바꿨습니다. 여러 값을 함께 읽는 구독에는 useShallow를 적용했습니다. 사진 필터링과 열 배치 계산은 useMemo로 재사용하되, 상태 구독과 계산 재사용은 서로 다른 역할로 구분했습니다.",
          result: "공유 상태 전체를 읽는 방식에서 화면별로 필요한 값을 선택해 읽는 방식으로 바꿨습니다. 선택한 값이 같을 때 불필요한 갱신을 줄이도록 구성하고, 화면에서 구독하는 상태를 코드로 확인할 수 있게 했습니다.",
          emphasis: ["상태 변경과 관계없는 화면까지 갱신", "각 화면이 필요한 값만 selector로 구독", "화면별로 필요한 값을 선택해 읽는 방식"],
        };
      }

      return {
        ...story,
        title: "많은 사진 목록에서 렌더링 부담과 선택 지연 줄이기",
        situation: "사진 목록의 모든 항목을 한꺼번에 렌더링하면 화면 밖 카드까지 처리해야 했습니다.",
        check: "렌더링 범위를 줄이는 것이 사진 선택 반응에도 영향을 주는지 확인하기 위해",
        goal: "같은 목록에서 가상화 유무만 바꾸고, 스크롤 직후 사진 클릭부터 모달 이미지가 준비될 때까지의 지연을 비교했습니다.",
        action: "사진 목록을 행 단위로 가상화해 현재 화면에 보이는 구간과 주변 행을 렌더링했습니다. 필터링과 열 배치 계산은 useMemo로 재사용하고, Zustand selector로 필요한 상태만 구독하도록 구성했습니다. 비교 실험에서는 같은 카드·상태 관리·이미지 정책을 유지한 채 가상화만 켜고 꺼, 다른 변경의 효과가 섞이지 않도록 했습니다.",
        emphasis: ["화면 밖 카드까지 처리", "가상화만 켜고 꺼", "59.6ms에서 13.2ms"],
        result: resumeResultOverrides[`${projectTitle}::${story.title}`] ?? story.result,
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

export function BinClassicResume({ data, isWacus = false }: { data: ResumeData; isWacus?: boolean }) {
  const { profile, summary, coreSkills, projectHighlights, activityGroups, education } = data;
  return (
    <main className={isWacus ? "bin-classic-page bin-classic-wacus" : "bin-classic-page"}>
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

        {data.motivation?.trim() ? (
          <ResumeSection title="지원동기">
            {data.motivation.split(/\n\s*\n/).map((paragraph) => (
              <p className="bin-classic-summary" key={paragraph}>{paragraph}</p>
            ))}
          </ResumeSection>
        ) : null}

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
                  {getResumeStories(project.title, isWacus).map((story) => (
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
