import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { frontendPortfolio } from "../data/main";
import "../../styles/project-presentation.css";

type Case = { title: string; problem: string; check: string; action: string[]; result: string; metric?: { label: string; value: string; change: string }; note?: string };
type Notes = { summary: string; role: string; cases: Case[]; implementation: { title: string; reason: string; steps: { title: string; body: string }[]; note: string }[] };
const chapterPages = [0, 1, 2, 4, 6, 8];
const chapterLabels = ["서비스 소개", "아키텍처", "구조와 구현", "해결한 문제 01", "해결한 문제 02", "측정 근거와 적용 기술"];

const emphasisPhrases = ["action 슬롯", "게임 ID를 기준으로 중복 없이", "기존 카드는 유지", "value/onChange 기반 제어 컴포넌트","입력·초기화 UI는 공유","필요한 액션을 조합","Zustand","검색·태그·앨범 조건은 URL","모달·편집 입력은 local state", "이미지 크기와 품질만 바꿔", "목록에는 썸네일을, 상세 화면에는 큰 이미지를", "가상화만 켜고 껐습니다", "보이는 구간과 주변 행만 렌더링", "CSS 좌표와 SVG 선 위치만 직접 바꿉니다", "기존 시뮬레이션을 중지", "각 화면이 필요한 상태만 selector로 구독", "Zustand로 전환", "공통 TypeScript 모델로 변환", "5초 제한", "이전 응답을 경고 정보와 함께 반환"];
function HighlightedCopy({ text }: { text: string }) {
  const matches = emphasisPhrases.map(phrase => ({ phrase, index: text.indexOf(phrase) }))
    .filter(match => match.index >= 0).sort((a, b) => a.index - b.index);
  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const { phrase, index } of matches) {
    if (index < cursor) continue;
    parts.push(text.slice(cursor, index), <strong className="bin-deck-emphasis" key={index}>{phrase}</strong>);
    cursor = index + phrase.length;
  }
  parts.push(text.slice(cursor));
  return <>{parts}</>;
}

export function ProjectPresentation({ project, index, notes }: { project: typeof frontendPortfolio.projects[number]; index: number; notes: Notes }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const photo = index === 0;
  const slug = photo ? "photomap" : "gameinfo";
  const stills = project.imageGallery.supporting.filter(item => !item.src.endsWith(".gif"));
  const main = photo ? stills[1] ?? project.imageGallery.main : project.imageGallery.main;
  const id = (page: number) => `project-${index}-scene-${page}`;
  const total = 9;
  const scrollStep = 100;
  useEffect(() => {
    const media = matchMedia("(min-width: 1100px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnhanced(media.matches);
    update(); media.addEventListener("change", update);
    const beforePrint = () => setEnhanced(false);
    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", update);
    return () => { media.removeEventListener("change", update); window.removeEventListener("beforeprint", beforePrint); window.removeEventListener("afterprint", update); };
  }, []);
  useEffect(() => {
    let observer: IntersectionObserver | undefined;
    let pendingFrame = 0;
    const updateActive = () => {
      pendingFrame = 0;
      const markers = root.current?.querySelectorAll<HTMLElement>(".bin-deck-marker");
      if (!markers || markers.length < 2) return;
      const step = markers[1].offsetTop - markers[0].offsetTop;
      if (step <= 0) return;
      const anchorOffset = parseFloat(getComputedStyle(markers[0]).scrollMarginTop) || 0;
      const progress = (anchorOffset - markers[0].getBoundingClientRect().top) / step;
      setActive(Math.max(0, Math.min(total - 1, Math.round(progress))));
    };
    const scheduleUpdate = () => {
      if (!pendingFrame) pendingFrame = requestAnimationFrame(updateActive);
    };
    if (enhanced) {
      // One position has one active page, regardless of scroll direction or input device.
      updateActive();
      window.addEventListener("scroll", scheduleUpdate, { passive: true });
      window.addEventListener("resize", scheduleUpdate);
    } else {
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.page));
      }, { rootMargin: "-25% 0px -50% 0px" });
      root.current?.querySelectorAll(".bin-deck-page").forEach(el => observer?.observe(el));
    }
    const frame = requestAnimationFrame(() => {
      if (location.hash.startsWith(`#project-${index}-scene-`)) document.getElementById(location.hash.slice(1))?.scrollIntoView({block:"start",behavior:"instant"});
    });
    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pendingFrame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [enhanced, index]);

  const chapters = (current: number) => <nav className="bin-deck-chapters" aria-label={`${project.title} 목차`}>{chapterLabels.map((label, i) => <a key={label} href={`#${id(chapterPages[i])}`} aria-current={current >= chapterPages[i] && current < (chapterPages[i + 1] ?? total) ? "step" : undefined}><span>0{i + 1}</span>{label}</a>)}</nav>;
  const links = <div className="bin-work-links"><a href={project.links.github} target="_blank" rel="noreferrer"><Github size={15} />소스 코드</a>{project.links.live && <a href={project.links.live} target="_blank" rel="noreferrer">서비스 열기 <ArrowUpRight size={15} /></a>}</div>;
  const pages: { kind: string; label: string; content: ReactNode }[] = [
    { kind: "overview", label: "서비스 소개", content: <>
      <div className="bin-deck-overview-heading"><div><p className="bin-work-eyebrow">프로젝트 0{index + 1} · {photo ? "PhotoMap" : "GameInfo"}</p><h2>{photo ? <>사진을 지도와<br />시간순으로.</> : <>게임을 찾고,<br />가격을 비교합니다.</>}</h2></div><div><p>{notes.summary}</p><p className="bin-deck-role">{notes.role}</p>{links}</div></div>
      <figure className="bin-deck-product"><img src={main.src} alt={photo ? "PhotoMap 지도에서 사진을 찾는 화면" : "GameInfo 게임 검색 화면"} width="1440" height="960" /><figcaption>{photo ? "사진 탐색 · 상세 확인 · 좋아요 · 화면 이동 후 이전 탐색 조건 복원" : "게임 검색 · 상점별 가격 비교 · 관심 목록 등록"}</figcaption></figure>
    </> },
    { kind: "architecture", label: "아키텍처", content: <>
      <div className="bin-deck-architecture-heading"><p className="bin-work-eyebrow">02 · 아키텍처</p><h2>{photo ? "사진 상태가 화면으로 이어지는 구조" : "검색 요청이 가격 정보가 되기까지"}</h2></div>
      <div className="bin-deck-architecture-layout"><aside><span>{photo ? "상태의 저장 위치" : "검색 요청 처리"}</span><p>{photo ? "사진·좋아요는 Zustand.\n검색·필터는 URL.\n편집 입력은 local state.\n화면에 필요한 값만 구독합니다." : "검색 조건 전달\n캐시된 응답 확인\n필요하면 ITAD 조회\n관심 목록은 인증 후 저장"}</p></aside><figure><img src={`/architecture/${slug}-dark-preview.png`} alt={photo ? "기존 PhotoMap 아키텍처: 사진 상태, PhotoFeed, 이미지 주소 선택, 지도 iframe, D3, Supabase 관계도" : "기존 GameInfo 아키텍처: 검색 API, 캐시, ITAD, 가격 변환, 관심 목록 관계도"} width="2448" height="1516" /><figcaption>{photo ? "PhotoMap · 화면과 상태 갱신" : "GameInfo · 검색과 데이터 처리"}</figcaption></figure><aside><span>{photo ? "React와 D3의 역할" : "가격 응답 정규화"}</span><p>{photo ? "React: 노드 구조·선택\nD3: CSS 좌표·SVG 선\n데이터 변경·화면 이탈 시 기존 simulation 중지" : "금액·상점·구매 링크를 공통 모델로 변환합니다.\n양수 가격만 최저가 후보로 삼아 결측값·0원 오판을 막습니다."}</p></aside></div>
    </> },
    ...notes.implementation.map((part, i) => ({ kind: "story", label: "구조와 구현", content: <><p className="bin-work-eyebrow">구조와 구현 · 0{i + 1}</p><h2>{part.title}</h2><p className="bin-deck-story-lead">{part.reason}</p><ol className="bin-deck-process bin-deck-key-points">{part.steps.map((step, n) => <li key={step.title}><span>0{n + 1}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></li>)}</ol></> })),
    ...notes.cases.flatMap((item, i) => [
      { kind: "story", label: `해결한 문제 0${i + 1} · 판단`, content: <><p className="bin-work-eyebrow">해결한 문제 0{i + 1} · 무엇을 확인했나</p><h2>{item.title}</h2><div className="bin-deck-narrative"><span>문제</span><p><HighlightedCopy text={item.problem} /></p></div><div className="bin-deck-narrative"><span>확인 방법</span><p><HighlightedCopy text={item.check} /></p></div></> },
      { kind: "story", label: `해결한 문제 0${i + 1} · 변경`, content: <><p className="bin-work-eyebrow">해결한 문제 0{i + 1} · 어떻게 바꿨나</p><h2>{photo ? ["목록에는 썸네일,\n상세에는 큰 이미지.", "화면 주변의 카드만\n렌더링합니다."][i] : ["카드와 액션을\n함께 memo로 감쌌습니다.", "같은 제목의 요청이\n조회 결과를 공유합니다."][i]}</h2><div className="bin-deck-result"><span>{item.metric?.label ?? "결과"}</span>{item.metric && <div className="bin-deck-metric"><strong>{item.metric.value}</strong><span>{item.metric.change}</span></div>}<p>{item.result}</p></div><ol className="bin-deck-process">{item.action.map((step, n) => <li key={step}><span>0{n + 1}</span><p><HighlightedCopy text={step} /></p></li>)}</ol></> },
    ]),
    { kind: "evidence", label: "측정 근거와 적용 기술", content: <><p className="bin-work-eyebrow">측정 근거와 적용 기술</p><h2>{photo ? "비교 조건과 확인한 범위" : "호출 수와 화면 동작의 근거"}</h2><div className="bin-deck-evidence">{notes.cases.map((item, i) => <article key={item.title}><h3>{photo ? ["이미지 응답 본문", "최대 렌더링 카드"][i] : ["mock 카드 호출", "제목 후보 조회 공유"][i]}</h3><ul>{item.note?.split("\n").map(line => <li key={line}>{line}</li>)}</ul></article>)}{notes.implementation.map((part, i) => <article key={part.title}><h3>{photo ? ["화면 분할·공통 UI", "입력 요청·탐색 복원"][i] : ["가격 처리·자동 검증", "입력 분리·서버 스트리밍"][i]}</h3><ul>{part.note.split("\n").map(line => <li key={line}>{line}</li>)}</ul></article>)}</div></> },
  ];
  return <section ref={root} id={`project-${index}`} className={`bin-work-project bin-deck ${enhanced ? "is-enhanced" : ""}`} aria-label={`${project.title} 프로젝트`}>
    <div className="bin-deck-track" style={enhanced ? {height:`${(total - 1) * scrollStep + 100}svh`} : undefined}>
      {enhanced && pages.map((page, i) => <div className="bin-deck-marker" key={i} id={id(i)} data-page={i} style={{top:`${i * scrollStep}svh`,height:`${scrollStep}svh`}} aria-hidden="true" />)}
      <div className="bin-deck-frame">
        {pages.map((page, i) => <section key={i} id={enhanced ? undefined : id(i)} data-page={i} data-kind={page.kind} aria-label={page.label} aria-hidden={enhanced && active !== i ? true : undefined} ref={el => { if(el) el.inert = enhanced && active !== i; }} className={`bin-deck-page bin-deck-${page.kind} ${active === i ? "is-active" : active > i ? "is-before" : "is-after"}`}>
          <div className="bin-deck-page-body">
            {page.kind === "story" && <aside className="bin-deck-sidebar"><div className="bin-deck-project-name"><span>0{index + 1}</span>{photo ? "PhotoMap" : "GameInfo"}</div><figure><img src={(i === 2 && photo ? main : i === 3 && photo ? stills[1] ?? main : !photo && i >= 4 ? stills[Math.min(i >= 6 ? 1 : 0,stills.length - 1)] ?? main : main).src} alt={photo ? "PhotoMap 지도와 사진 탐색" : "GameInfo 게임 가격 비교와 검색"} width="1440" height="960" loading="lazy" /></figure>{chapters(i)}{links}</aside>}
            <div className="bin-deck-copy">{page.content}</div>
          </div>
          <nav className="bin-deck-controls" aria-label={`${project.title} ${i + 1}장 이동`}><span>{String(i + 1).padStart(2,"0")} <span>/ {String(total).padStart(2,"0")}</span> · {page.label}</span><div>{i > 0 && <a href={`#${id(i - 1)}`} aria-label="이전 슬라이드"><ArrowLeft size={17} /></a>}<a href={i < total - 1 ? `#${id(i + 1)}` : photo ? "#project-1" : "#activities-title"}>{i < total - 1 ? "다음 장" : photo ? "다음 프로젝트" : "프로젝트 외 활동"}<ArrowRight size={17} /></a></div></nav>
        </section>)}
      </div>
    </div>
  </section>;
}
