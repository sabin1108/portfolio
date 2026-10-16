import { useEffect } from "react";
import { ArrowDown, ArrowUpRight, Printer } from "lucide-react";
import { ProjectPresentation, type PresentationSlide } from "./ProjectPresentation";
import { aiApplication as data } from "../data/aiApplication";
import "../../styles/bin-portfolio.css";
import "../../styles/ai-research-portfolio.css";

const paperUrl = "https://doi.org/10.5573/ieie.2026.63.9.61";
const chatbotUrl = "https://github.com/sabin1108/graduation-project";
const chapters = [
  { page: 0, label: "서비스 소개" }, { page: 1, label: "구조와 담당 범위" },
  { page: 2, label: "직접 구현한 기능" }, { page: 4, label: "문제와 처리 과정" },
  { page: 6, label: "답변 품질과 상태 관리" }, { page: 8, label: "근거와 직무 연결" },
];

function Flow({ compact = false, chat = false }: { compact?: boolean; chat?: boolean }) {
  const items = chat ? [
    ["대화 화면", "질문 입력 · 메시지 표시"], ["Next.js API", "입력 확인 · 요청 전달"],
    ["외부 백엔드", "학교 정보 조회 · AI 응답"], ["대화 기록", "브라우저 저장 · txt 내보내기"],
  ] : [
    ["입력 정제", "웹 문서에서 텍스트 추출"], ["AI 요약", "GPT-4o-mini · 스트리밍"],
    ["기술정보 검증", "지식정보와 비교 · 명칭 정리"], ["결과 확인", "저장 · 시각화 · 사용자 수정"],
  ];
  return <ol className={`ai-research-flow ${compact ? "is-compact" : ""}`} aria-label={chat ? "챗봇 처리 흐름" : "논문에 정리한 처리 흐름"}>{items.map(([title, detail], i) => <li key={title}><span>0{i + 1}</span><div><strong>{title}</strong><p>{detail}</p></div></li>)}</ol>;
}

function Story({ eyebrow, title, lead, points }: { eyebrow: string; title: string; lead?: string; points: [string, string][] }) {
  return <><p className="bin-work-eyebrow">{eyebrow}</p><h2>{title}</h2>{lead && <p className="bin-deck-story-lead">{lead}</p>}
    <ol className="bin-deck-process bin-deck-key-points">{points.map(([heading, body], i) => <li key={heading}><span>0{i + 1}</span><div><h3>{heading}</h3><p>{body}</p></div></li>)}</ol></>;
}

const paperSlides: PresentationSlide[] = [
  { kind: "overview", label: "서비스 소개", content: <>
    <div className="bin-deck-overview-heading"><div><p className="bin-work-eyebrow">프로젝트 01 · 생성형 AI 요약 플랫폼</p><h2>긴 포트폴리오에서<br />핵심을 찾도록.</h2></div><div><p>{data.projects[0].summary}</p><p className="bin-deck-role">{data.projects[0].role}</p><div className="bin-work-links"><a href={paperUrl} target="_blank" rel="noreferrer">게재 논문 <ArrowUpRight size={15} /></a></div></div></div>
    <Flow /><p className="ai-research-caption">공동 연구의 서비스 흐름 · 대한전자공학회논문지 63(9), 2026.09</p>
  </> },
  { kind: "architecture", label: "구조와 담당 범위", content: <>
    <div className="bin-deck-architecture-heading"><p className="bin-work-eyebrow">구조와 담당 범위</p><h2>생성된 답변을<br />검증하고 화면에 보여주기까지</h2></div><Flow />
    <div className="bin-deck-evidence"><article><h3>제가 수행한 일</h3><p>스트리밍 결과 표시, 첫 토큰 수신 시간 측정, 요약·검증 구조 연구와 논문 작성에 참여했습니다.</p></article><article><h3>공동 연구의 전체 구조</h3><p>문서 수집·정제, GPT-4o-mini 요약, 지식 기반 검증, Neon PostgreSQL 저장과 React 시각화로 구성했습니다.</p></article></div>
  </> },
  { kind: "story", label: "스트리밍 결과 표시", content: <Story eyebrow="직접 수행 · 스트리밍 적용" title={"완성된 답변을 기다리지 않고,\n먼저 나온 결과부터."} lead="AI 요약이 끝날 때까지 화면이 기다리는 구간을 줄이고자 했습니다." points={[
    ["생성과 표시를 연결", "Vercel AI SDK의 스트리밍 응답을 사용해 생성된 내용을 순차적으로 화면에 표시했습니다."],
    ["측정 기준 구분", "첫 결과를 보기까지의 TTFT와 전체 답변 완료 시간을 구분해, 무엇을 개선했는지 설명했습니다."],
  ]} /> },
  { kind: "story", label: "성능 평가 설계", content: <Story eyebrow="직접 수행 · 성능 평가" title={"같은 입력으로,\n첫 토큰까지의 시간을 측정."} points={[
    ["모델과 입력 고정", "GPT-4o-mini에 약 800자의 동일한 포트폴리오 크롤링 텍스트를 입력했습니다."],
    ["방식별 5회 반복", "비스트리밍과 SSE 스트리밍을 각각 5회 실행하고, 요청부터 첫 토큰 수신까지 기록했습니다."],
    ["측정 범위를 결과 옆에", "논문 표 4에 개별 측정값과 평균을 남겼습니다. 실사용자 평균이나 전체 생성 속도로 확대하지 않았습니다."],
  ]} /> },
  { kind: "story", label: "대기 구간의 문제", content: <>
    <p className="bin-work-eyebrow">문제와 확인</p><h2>첫 결과를 보는 시점과<br />요약이 끝나는 시점은 다릅니다.</h2>
    <div className="bin-deck-narrative"><span>문제</span><p>전체 요약을 한 번에 받으면, 사용자는 생성이 끝나기 전까지 결과를 읽을 수 없습니다.</p></div>
    <div className="bin-deck-narrative"><span>판단</span><p>전체 생성 시간이 짧아졌다는 주장보다, 첫 토큰을 전달하는 시점과 순차 표시 동작을 따로 확인했습니다.</p></div>
  </> },
  { kind: "story", label: "스트리밍 측정 결과", content: <>
    <p className="bin-work-eyebrow">확인한 결과 · 논문 표 4</p><h2>첫 결과를 먼저 보여주는<br />스트리밍 흐름.</h2>
    <div className="bin-deck-result"><span>첫 토큰 수신까지 · 5회 평균</span><div className="bin-deck-metric"><strong>607ms</strong><span>GPT-4o-mini · 동일 약 800자 입력</span></div><p>448 · 1,007 · 539 · 566 · 477ms</p></div>
    <ol className="bin-deck-process"><li><span>01</span><p>응답 전체가 완성되기 전부터 내용을 순차적으로 확인하도록 구현했습니다.</p></li><li><span>02</span><p>공동 연구의 소규모 반복 측정입니다. 답변의 정확도나 전체 요약 완료 시간을 측정한 값은 아닙니다.</p></li></ol>
  </> },
  { kind: "story", label: "생성 결과의 신뢰성", content: <>
    <p className="bin-work-eyebrow">답변 품질 · 연구한 문제</p><h2>읽기 좋은 요약이<br />정확한 기술정보일까요?</h2>
    <div className="bin-deck-narrative"><span>문제</span><p>생성된 요약에 기술 명칭이 다르게 표현되거나 확인되지 않은 정보가 들어가면, 평가자가 지원자의 역량을 잘못 이해할 수 있습니다.</p></div>
    <div className="bin-deck-narrative"><span>접근</span><p>모델의 생성 결과를 그대로 확정하지 않고, 기술정보를 지식정보와 비교하는 검증 단계를 연구했습니다.</p></div>
  </> },
  { kind: "story", label: "요약·검증과 공동 특허", content: <Story eyebrow="연구·공동 발명 · 특허 출원" title={"요약과 검증의\n역할을 나눴습니다."} points={[
    ["기술정보 비교", "요약에서 얻은 기술정보를 지식정보와 대조하고 명칭을 표준화하는 구조를 다뤘습니다."],
    ["확인되지 않은 정보 처리", "근거를 확인하지 못한 정보를 제외하거나 보정하는 요약·검증 방식의 공동 발명에 참여했습니다."],
    ["결과 확인과 수정", "사용자가 요약 결과를 확인하고 필요한 내용을 수정하는 서비스 흐름을 논문에 정리했습니다."],
  ]} /> },
  { kind: "evidence", label: "근거와 직무 연결", content: <>
    <p className="bin-work-eyebrow">근거와 직무 연결</p><h2>LLM 연동에서<br />응답 표시와 검증까지.</h2>
    <div className="bin-deck-evidence"><article><h3>LLM·서비스 연동</h3><ul><li>GPT-4o-mini · Vercel AI SDK · SSE</li><li>정제한 문서 입력과 구조화된 요약 결과</li><li>화면에서 생성 결과를 순차적으로 표시</li></ul></article><article><h3>측정과 한계</h3><ul><li>동일 약 800자 입력 · 방식별 5회</li><li>스트리밍 TTFT 평균 607ms</li><li>답변 정확도의 정량 개선율은 주장하지 않음</li></ul></article><article><h3>연구 산출물</h3><ul><li>민사빈 · 이민규 · 심규성 / 제1저자</li><li>대한전자공학회논문지 63(9), 61–73</li><li>관련 특허 공동 출원 · 10-2026-0186451</li></ul></article><article><h3>교원 업무와 연결</h3><ul><li>LLM 결과를 사용하는 화면·API 흐름</li><li>답변 품질을 별도 단계로 확인하는 관점</li><li>변경한 동작을 같은 조건에서 측정</li></ul></article></div>
  </> },
];

const chatbotSlides: PresentationSlide[] = [
  { kind: "overview", label: "서비스 소개", content: <>
    <div className="bin-deck-overview-heading"><div><p className="bin-work-eyebrow">프로젝트 02 · AI ChatBot</p><h2>학교 정보를<br />대화로 찾습니다.</h2></div><div><p>{data.projects[1].summary}</p><p className="bin-deck-role">{data.projects[1].role}</p><div className="bin-work-links"><a href={chatbotUrl} target="_blank" rel="noreferrer">소스 코드 <ArrowUpRight size={15} /></a></div></div></div>
    <figure className="bin-deck-product"><img src="/3_project/aichat_1.png" alt="학교 정보 챗봇의 실제 채팅·공지 화면" width="1440" height="960" /><figcaption>직접 구현한 채팅 UI · 학교 공지·학식·일정 안내</figcaption></figure>
  </> },
  { kind: "architecture", label: "구조와 담당 범위", content: <>
    <div className="bin-deck-architecture-heading"><p className="bin-work-eyebrow">구조와 담당 범위</p><h2>대화 UI와 외부 AI 백엔드를<br />API Route로 연결했습니다.</h2></div><Flow chat />
    <div className="bin-deck-evidence"><article><h3>제가 구현한 영역</h3><p>채팅·가이드·캘린더 화면, 응답 렌더링, Next.js API Route, 대화 기록과 파일 내보내기입니다.</p></article><article><h3>팀원과 나눈 영역</h3><p>학교 데이터 수집과 AI 응답 생성은 외부 백엔드 담당입니다. 현재 채팅 전송은 fetch와 JSON 응답 방식입니다.</p></article></div>
  </> },
  { kind: "story", label: "대화 화면 구현", content: <Story eyebrow="직접 구현 · 사용자 대화 흐름" title={"질문 입력부터\n답변 확인까지 연결."} points={[
    ["질문을 시작하는 화면", "채팅 UI와 사이드바·가이드·캘린더를 구성하고, 사용자가 질문할 수 있는 학교 정보와 예시를 안내했습니다."],
    ["대화 상태 반영", "입력 메시지를 전송하고 assistant 응답을 메시지 목록에 추가했습니다. 현재 대화와 채팅 목록을 함께 관리했습니다."],
    ["외부 응답 연결", "클라이언트는 내부 API를 호출하고, Next.js API Route가 외부 백엔드와 통신하도록 분리했습니다."],
  ]} /> },
  { kind: "story", label: "API 입력과 응답 처리", content: <Story eyebrow="직접 구현 · API 경계" title={"입력은 확인하고,\n실패는 화면에 남깁니다."} points={[
    ["필수 입력 확인", "API Route에서 message와 userId가 없으면 각각 400 응답을 반환합니다."],
    ["외부 API 호출", "외부 /api/chat/intent에 질문을 전달하고 응답 상태를 확인한 뒤 JSON을 UI로 반환합니다."],
    ["오류 안내", "외부 호출이 실패하면 API에서 500을 반환하고, 화면에는 ‘메시지 전송 중 오류가 발생했습니다.’를 표시합니다."],
  ]} /> },
  { kind: "story", label: "답변 가독성 문제", content: <>
    <p className="bin-work-eyebrow">문제와 확인 · 응답 표시</p><h2>답변은 왔는데,<br />한눈에 읽기 어려웠습니다.</h2>
    <div className="bin-deck-narrative"><span>문제</span><p>학교 공지의 긴 URL, 날짜, 목록이 섞인 응답을 단순 텍스트로 표시하면 핵심 정보를 구분하기 어렵고 모바일 너비를 밀어낼 수 있었습니다.</p></div>
    <div className="bin-deck-narrative"><span>담당한 개선</span><p>모델을 바꾸기보다, 응답을 사용자가 읽는 메시지 단위와 문서 구조로 표시하는 프론트엔드 문제부터 다뤘습니다.</p></div>
  </> },
  { kind: "story", label: "읽기 쉬운 메시지", content: <Story eyebrow="직접 구현 · 답변 표시" title={"문장·목록·링크를\n구분해서 보여줍니다."} points={[
    ["Markdown 렌더링", "ReactMarkdown으로 응답의 문장과 목록, 링크를 구조에 맞게 표시했습니다."],
    ["긴 내용 처리", "긴 URL과 비정형 응답의 줄바꿈을 다루고, 새 메시지가 추가되면 대화 흐름을 따라 확인하도록 구성했습니다."],
    ["검증 범위", "이 개선은 답변의 표시와 가독성에 대한 것입니다. 모델 답변의 사실 정확도가 높아졌다는 성과로 바꾸지 않았습니다."],
  ]} /> },
  { kind: "story", label: "대화 상태 관리", content: <Story eyebrow="직접 구현 · 대화 상태" title={"지난 대화를\n다시 이어볼 수 있도록."} points={[
    ["채팅 목록과 활성 대화", "useChatHistory에서 새 대화 생성, 선택, 이름 변경, 삭제와 메시지를 관리했습니다."],
    ["저장과 복원", "localStorage에 기록을 저장하고 새로고침 뒤 복원했습니다. 같은 오리진의 다른 탭 변경은 storage 이벤트로 반영합니다."],
    ["저장 범위", "해당 브라우저의 로컬 기록입니다. 계정 기반 서버 저장이나 기기 간 동기화 기능은 아닙니다."],
  ]} /> },
  { kind: "story", label: "대화 기록 내보내기", content: <Story eyebrow="직접 구현 · 기록 활용" title={"필요한 대화는\n텍스트 파일로 보관."} points={[
    ["기록을 파일로 구성", "대화 내용을 텍스트로 정리하고 브라우저 Blob API로 txt 파일을 만들었습니다."],
    ["다운로드 흐름", "객체 URL을 사용해 파일을 내려받도록 연결했습니다. 내보내기를 위해 별도 서버 전송을 추가하지 않았습니다."],
    ["공고와 맞닿는 경험", "단순 답변 표시를 넘어 대화 상태와 사용자의 후속 작업까지 화면 기능으로 연결했습니다."],
  ]} /> },
  { kind: "evidence", label: "근거와 직무 연결", content: <>
    <p className="bin-work-eyebrow">근거와 직무 연결</p><h2>대화 흐름·화면·API를<br />직접 연결한 경험.</h2>
    <div className="bin-deck-evidence"><article><h3>화면과 상태</h3><ul><li>채팅 UI · ReactMarkdown 응답 표시</li><li>채팅 목록·활성 대화·저장과 복원</li><li>localStorage · Blob 파일 내보내기</li></ul></article><article><h3>오류 처리</h3><ul><li>message·userId 누락: 400</li><li>외부 응답 실패: API 500</li><li>클라이언트: 전송 실패 메시지 표시</li></ul></article><article><h3>확인할 수 있는 근거</h3><ul><li><a href={`${chatbotUrl}/blob/main/components/enhanced-chat-interface.tsx`} target="_blank" rel="noreferrer">채팅 화면 소스 ↗</a></li><li><a href={`${chatbotUrl}/blob/main/app/api/chat/route.ts`} target="_blank" rel="noreferrer">API Route 소스 ↗</a></li><li>관련 학술대회 논문 발표</li></ul></article><article><h3>구현 범위</h3><ul><li>2인 팀의 프론트엔드·API 연동</li><li>AI 응답 생성·크롤러는 팀 백엔드</li><li>실패 경로는 소스로 확인, 외부 운영 API 재검증과는 구분</li></ul></article></div>
  </> },
];

export function AiResearchPortfolio() {
  useEffect(() => {
    const title = document.title;
    document.title = "민사빈 | AI Portfolio";
    document.documentElement.classList.add("bin-presentation-page");
    return () => { document.title = title; document.documentElement.classList.remove("bin-presentation-page"); };
  }, []);
  return <main className="bin-work ai-research-portfolio" id="top">
    <nav className="bin-work-nav" aria-label="포트폴리오 메뉴"><a className="bin-work-name" href="#top">민사빈</a><div><a href="#projects">프로젝트</a><a href="#profile">소개</a><a href="/ai-resume">이력서 <ArrowUpRight size={14} /></a><button onClick={() => window.print()} aria-label="PDF 저장"><Printer size={16} /></button></div></nav>
    <header className="bin-work-hero bin-work-editorial bin-work-container"><div><p className="bin-work-eyebrow">MIN SABIN · AI PORTFOLIO</p><h1>민사빈<span>AI 서비스 개발자</span></h1><p className="bin-work-lead">AI의 답변을,<br />사용할 수 있는 서비스로.</p><p>생성형 AI 요약 플랫폼에서 스트리밍 결과 표시와 성능 평가를 수행했습니다. 학교 정보 챗봇에서는 대화 화면, 기록 관리, 외부 API 연동과 실패 안내를 구현했습니다.</p><a className="bin-work-button" href="/ai-resume">이력서 보기 <ArrowUpRight size={17} /></a></div>
      <div className="bin-work-selected"><p>SELECTED PROJECTS</p><a href="#project-0"><span>01 · 공동 연구 · 제1저자</span><h2>AI 요약 플랫폼</h2><p>요약 결과를 스트리밍으로 표시하고, 생성·검증·저장·시각화 구조를 연구했습니다.</p><div className="bin-work-selected-evidence"><strong>평균 TTFT 607ms</strong><small>동일 약 800자 입력 · 5회 측정 · 논문 표 4</small></div><ArrowUpRight size={28} /></a><a href="#project-1"><span>02 · 2인 팀 · 프론트엔드</span><h2>AI ChatBot</h2><p>학교 정보 API와 채팅 화면을 연결하고, 응답 표시·대화 기록·오류 처리를 구현했습니다.</p><div className="bin-work-selected-evidence"><strong>대화 UI부터 API 연동까지</strong><small>Next.js · ReactMarkdown · localStorage</small></div><ArrowUpRight size={28} /></a></div>
      <nav className="bin-work-hero-index" aria-label="포트폴리오 읽기 안내"><span>서비스 소개 · 담당 범위 · 구현 과정 · 문제 해결 · 근거</span><a href="#projects">스크롤해서 한 장씩 읽기 <ArrowDown size={14} /></a></nav>
    </header>
    <div className="bin-work-projects" id="projects"><div className="bin-work-container">{data.projects.map((project, index) => <ProjectPresentation key={project.id} index={index} project={{ title: project.title, links: {}, imageGallery: { main: { src: index ? "/3_project/aichat_1.png" : "", alt: project.title }, supporting: [] } }} presentation={{
      pages: index ? chatbotSlides : paperSlides, chapters,
      sidebar: index ? <figure><img src="/3_project/aichat_1.png" alt="직접 구현한 학교 정보 챗봇 화면" width="1440" height="960" loading="lazy" /></figure> : <Flow compact />,
      links: <div className="bin-work-links"><a href={index ? chatbotUrl : paperUrl} target="_blank" rel="noreferrer">{index ? "소스 코드" : "게재 논문"}<ArrowUpRight size={15} /></a></div>,
      nextHref: index ? "#activities-title" : "#project-1", nextLabel: index ? "논문·특허" : "다음 프로젝트",
    }} />)}</div></div>
    <section className="bin-work-activities bin-work-container" aria-labelledby="activities-title"><p className="bin-work-eyebrow">논문·특허</p><h2 id="activities-title">연구로 남긴 근거</h2><div>{data.research.map(item => <article key={item.title}><p className="bin-work-date">{item.status}</p><h3>{item.title}</h3><p>{item.description}</p><a href={item.href} target="_blank" rel="noreferrer">{item.linkLabel}<ArrowUpRight size={15} /></a></article>)}</div></section>
    <footer className="bin-work-footer" id="profile"><div className="bin-work-container"><div><h2>민사빈</h2><p>{data.education.school} · {data.education.degree}</p></div><div className="bin-work-footer-links"><a href={`mailto:${data.profile.email}`}>{data.profile.email}</a><a href={data.profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} /></a><a href="/ai-resume">이력서 <ArrowUpRight size={15} /></a></div></div></footer>
  </main>;
}
