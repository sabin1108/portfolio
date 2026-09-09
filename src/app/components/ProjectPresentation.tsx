import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { frontendPortfolio } from "../data/main";
import "../../styles/project-presentation.css";

type Case = { title: string; problem: string; check: string; action: string[]; result: string; note?: string };
type Notes = { summary: string; role: string; cases: Case[]; implementation: { title: string; reason: string; steps: string[]; note: string }[] };
const chapterPages = [0, 1, 2, 4, 6, 8];
const chapterLabels = ["서비스 소개", "아키텍처", "구조와 구현", "해결한 문제 01", "해결한 문제 02", "검증과 남은 과제"];

const emphasisPhrases = ["첫 사진 표시 p95 약 2.6초", "59.6ms에서 13.2ms", "목록에는 작은 이미지를, 상세 화면에는 큰 이미지를", "높은 요청 우선순위는 첫 사진에만", "가상화 유무만 바꿨습니다", "CSS 좌표와 SVG 선 위치만 직접 바꿉니다", "기존 시뮬레이션을 중지", "각 화면이 필요한 상태만 selector로 구독", "Zustand로 전환", "공통 TypeScript 모델로 변환", "5초 제한", "이전 응답을 경고 정보와 함께 반환"];
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
    let observer: IntersectionObserver;
    const observe = () => {
      observer?.disconnect();
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.page));
      }, { rootMargin: `-${Math.round(innerHeight * .3)}px 0px -${Math.round(innerHeight * .65)}px 0px` });
      root.current?.querySelectorAll(enhanced ? ".bin-deck-marker" : ".bin-deck-page").forEach(el => observer.observe(el));
    };
    observe(); window.addEventListener("resize", observe);
    const frame = requestAnimationFrame(() => {
      if (location.hash.startsWith(`#project-${index}-scene-`)) document.getElementById(location.hash.slice(1))?.scrollIntoView({block:"start",behavior:"instant"});
    });
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("resize", observe); };
  }, [enhanced, index]);

  const chapters = (current: number) => <nav className="bin-deck-chapters" aria-label={`${project.title} 목차`}>{chapterLabels.map((label, i) => <a key={label} href={`#${id(chapterPages[i])}`} aria-current={current >= chapterPages[i] && current < (chapterPages[i + 1] ?? total) ? "step" : undefined}><span>0{i + 1}</span>{label}</a>)}</nav>;
  const links = <div className="bin-work-links"><a href={project.links.github} target="_blank" rel="noreferrer"><Github size={15} />소스 코드</a>{project.links.live && <a href={project.links.live} target="_blank" rel="noreferrer">서비스 열기 <ArrowUpRight size={15} /></a>}</div>;
  const pages: { kind: string; label: string; content: ReactNode }[] = [
    { kind: "overview", label: "서비스 소개", content: <>
      <div className="bin-deck-overview-heading"><div><p className="bin-work-eyebrow">프로젝트 0{index + 1} · {photo ? "PhotoMap" : "GameInfo"}</p><h2>{photo ? <>사진을 지도와<br />시간순으로.</> : <>게임을 찾고,<br />가격을 비교합니다.</>}</h2></div><div><p>{notes.summary}</p><p className="bin-deck-role">{notes.role}</p>{links}</div></div>
      <figure className="bin-deck-product"><img src={main.src} alt={photo ? "PhotoMap 지도에서 사진을 찾는 화면" : "GameInfo 게임 검색 화면"} width="1440" height="960" /><figcaption>{photo ? "지도에서 위치를 확인하고, 앨범과 타임라인에서 사진을 다시 찾습니다." : "검색한 게임의 상점별 가격과 구매 링크를 한곳에서 비교합니다."}</figcaption></figure>
    </> },
    { kind: "architecture", label: "아키텍처", content: <>
      <div className="bin-deck-architecture-heading"><p className="bin-work-eyebrow">02 · 아키텍처</p><h2>{photo ? "사진 상태가 화면으로 이어지는 구조" : "검색 요청이 가격 정보가 되기까지"}</h2></div>
      <div className="bin-deck-architecture-layout"><aside><span>{photo ? "함께 쓰는 사진 상태" : "화면과 서버의 역할"}</span><p>{photo ? "Zustand에 있는 사진·분류·선택 상태를 목록, 지도, 관계 그래프에서 필요한 만큼 읽습니다." : "화면은 검색 조건을 전달합니다. 서버는 저장된 응답을 확인하고, 필요하면 ITAD에 가격 정보를 요청합니다."}</p></aside><figure><img src={`/architecture/${slug}-dark-preview.png`} alt={photo ? "기존 PhotoMap 아키텍처: 사진 상태, PhotoFeed, 이미지 주소 선택, 지도 iframe, D3, Supabase 관계도" : "기존 GameInfo 아키텍처: 검색 API, 캐시, ITAD, 가격 변환, 관심 목록 관계도"} width="2448" height="1516" /><figcaption>{photo ? "PhotoMap · 화면과 상태 갱신" : "GameInfo · 검색과 데이터 처리"}</figcaption></figure><aside><span>{photo ? "갱신 방식은 각각" : "받은 데이터는 정리해서"}</span><p>{photo ? "사진 목록은 보이는 구간만 그립니다. 지도에는 준비가 끝난 뒤 메시지를 보내고, D3 좌표는 React 상태와 나눠 갱신합니다." : "가격 변환 함수가 상점·금액·구매 링크를 공통 형태로 바꿉니다. 관심 목록은 인증을 확인한 뒤 별도로 저장합니다."}</p></aside></div>
    </> },
    ...notes.implementation.map((part, i) => ({ kind: "story", label: "구조와 구현", content: <><p className="bin-work-eyebrow">구조와 구현 · 0{i + 1}</p><h2>{part.title}</h2><p className="bin-deck-story-lead"><HighlightedCopy text={part.reason} /></p><ol className="bin-deck-process">{part.steps.map((step, n) => <li key={step}><span>0{n + 1}</span><p><HighlightedCopy text={step} /></p></li>)}</ol><p className="bin-deck-context">{photo ? ["계속 움직이는 좌표와 사용자가 고른 사진 상태는 바뀌는 속도가 다릅니다. 같은 갱신 흐름에 넣지 않도록 나눴습니다.", "라이브러리 이름보다 어떤 상태 변경이 어느 화면을 갱신해야 하는지를 기준으로 선택했습니다."][i] : ["가격이 비어 있는 경우도 정상적인 입력으로 보고, 화면에 보여줄 가격을 고르는 기준을 코드에 모았습니다.", "외부 서비스의 실제 응답에만 기대지 않고, 반환값을 정한 테스트로 같은 예외 상황을 반복해서 확인했습니다."][i]}</p></> })),
    ...notes.cases.flatMap((item, i) => [
      { kind: "story", label: `해결한 문제 0${i + 1} · 판단`, content: <><p className="bin-work-eyebrow">해결한 문제 0{i + 1} · 무엇을 확인했나</p><h2>{item.title}</h2><div className="bin-deck-narrative"><span>겪었던 문제</span><p><HighlightedCopy text={item.problem} /></p></div><div className="bin-deck-narrative"><span>확인과 판단</span><p><HighlightedCopy text={item.check} /></p></div><p className="bin-deck-continue">다음 장에서 바꾼 코드와 결과를 설명합니다.<ArrowRight size={16} /></p></> },
      { kind: "story", label: `해결한 문제 0${i + 1} · 변경`, content: <><p className="bin-work-eyebrow">해결한 문제 0{i + 1} · 어떻게 바꿨나</p><h2>{photo ? ["크기에 맞게 요청하고,\n먼저 볼 사진부터.", "렌더링 범위를 줄여\n선택 반응을 확인했습니다."][i] : ["다른 응답을\n하나의 형태로.", "같은 검색은 재사용하고,\n실패에는 다음 처리를."][i]}</h2><ol className="bin-deck-process">{item.action.map((step, n) => <li key={step}><span>0{n + 1}</span><p><HighlightedCopy text={step} /></p></li>)}</ol><div className="bin-deck-result"><span>결과</span><p><HighlightedCopy text={item.result} /></p></div></> },
    ]),
    { kind: "evidence", label: "검증과 남은 과제", content: <><p className="bin-work-eyebrow">검증과 남은 과제</p><h2>{photo ? "확인한 조건까지 함께 남겼습니다." : "동작하는 경우와, 더 다듬을 경우."}</h2><div className="bin-deck-evidence">{notes.cases.map((item, i) => <article key={item.title}><span>0{i + 1} · {photo ? ["이미지 측정", "목록 렌더링"][i] : ["가격 변환", "API 실패 처리"][i]}</span><p>{item.note}</p></article>)}{notes.implementation.map((part, i) => <article key={part.title}><span>0{i + 3} · {photo ? ["좌표 갱신", "상태 관리의 변화"][i] : ["가격 후보 규칙", "실패 상황을 재현한 검사"][i]}</span><p>{part.note}</p></article>)}</div></> },
  ];
  return <section ref={root} id={`project-${index}`} className={`bin-work-project bin-deck ${enhanced ? "is-enhanced" : ""}`} aria-label={`${project.title} 프로젝트`}>
    <div className="bin-deck-track" style={enhanced ? {height:`${(total - 1) * scrollStep + 100}svh`} : undefined}>
      {enhanced && pages.map((page, i) => <div className="bin-deck-marker" key={i} id={id(i)} data-page={i} style={{top:`${i * scrollStep}svh`,height:`${scrollStep}svh`}} aria-hidden="true" />)}
      <div className="bin-deck-frame">
        {pages.map((page, i) => <section key={i} id={enhanced ? undefined : id(i)} data-page={i} data-kind={page.kind} aria-label={page.label} aria-hidden={enhanced && active !== i ? true : undefined} ref={el => { if(el) el.inert = enhanced && active !== i; }} className={`bin-deck-page bin-deck-${page.kind} ${active === i ? "is-active" : active > i ? "is-before" : "is-after"}`}>
          <div className="bin-deck-page-body">
            {page.kind === "story" && <aside className="bin-deck-sidebar"><div className="bin-deck-project-name"><span>0{index + 1}</span>{photo ? "PhotoMap" : "GameInfo"}</div><figure><img src={(i === 2 && photo ? project.imageGallery.main : i === 3 && photo ? stills[1] ?? main : !photo && i >= 4 ? stills[Math.min(i >= 6 ? 1 : 0,stills.length - 1)] ?? main : main).src} alt={photo ? (i === 2 ? "PhotoMap 사진 관계 그래프" : "PhotoMap 지도와 사진 탐색") : "GameInfo 게임 가격 비교와 검색"} width="1440" height="960" loading="lazy" /></figure>{chapters(i)}{links}</aside>}
            <div className="bin-deck-copy">{page.content}</div>
          </div>
          <nav className="bin-deck-controls" aria-label={`${project.title} ${i + 1}장 이동`}><span>{String(i + 1).padStart(2,"0")} <span>/ {String(total).padStart(2,"0")}</span> · {page.label}</span><div>{i > 0 && <a href={`#${id(i - 1)}`} aria-label="이전 슬라이드"><ArrowLeft size={17} /></a>}<a href={i < total - 1 ? `#${id(i + 1)}` : photo ? "#project-1" : "#method-title"}>{i < total - 1 ? "다음 장" : photo ? "다음 프로젝트" : "개발 과정"}<ArrowRight size={17} /></a></div></nav>
        </section>)}
      </div>
    </div>
  </section>;
}