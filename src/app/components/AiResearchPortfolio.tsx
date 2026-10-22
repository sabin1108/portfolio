import { useEffect } from "react";
import { ArrowDown, ArrowUpRight, Printer } from "lucide-react";
import { ProjectPresentation, type PresentationSlide } from "./ProjectPresentation";
import { aiApplication as data } from "../data/aiApplication";
import "../../styles/bin-portfolio.css";
import "../../styles/ai-research-portfolio.css";

const paperUrl = "https://doi.org/10.5573/ieie.2026.63.9.61";
const chatbotUrl = "https://github.com/sabin1108/graduation-project";
const chatbotQuickReplyUrl = `${chatbotUrl}/blob/a30f053b9fa180c3068a6ddf46b47522b9bdf624/components/enhanced-chat-interface.tsx`;
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
    ["첫 응답을 받는 시간 확인", "요청을 보낸 뒤 첫 토큰이 도착할 때까지 걸린 시간(TTFT)을 측정했습니다. 첫 토큰은 AI가 생성한 답변의 첫 조각입니다."],
  ]} /> },
  { kind: "story", label: "성능 평가 설계", content: <Story eyebrow="직접 수행 · 성능 평가" title={"같은 입력으로,\n첫 토큰까지의 시간을 측정."} points={[
    ["모델과 입력 고정", "GPT-4o-mini에 약 800자의 동일한 포트폴리오 크롤링 텍스트를 입력했습니다."],
    ["방식별 5회 반복", "비스트리밍과 SSE 스트리밍을 각각 5회 실행하고, 요청부터 첫 토큰 수신까지 기록했습니다."],
    ["측정 결과 기록", "실행별 첫 토큰 수신 시간과 평균을 논문 표 4에 정리했습니다. 같은 입력으로 반복해 첫 응답이 도착하는 시간을 확인했습니다."],
  ]} /> },
  { kind: "story", label: "대기 구간의 문제", content: <>
    <p className="bin-work-eyebrow">문제와 해결 · 응답 대기</p><h2>요약이 생성되는 동안에도<br />먼저 나온 내용을 읽도록.</h2>
    <div className="bin-deck-narrative"><span>문제</span><p>전체 요약을 한 번에 받으면, 사용자는 생성이 끝나기 전까지 결과를 읽을 수 없습니다.</p></div>
    <div className="bin-deck-narrative"><span>구현</span><p>첫 토큰이 도착하면 받은 내용부터 화면에 표시하고, 이후 생성되는 내용을 이어 붙였습니다. 사용자는 요약이 만들어지는 중에도 앞부분부터 읽을 수 있습니다.</p></div>
  </> },
  { kind: "story", label: "스트리밍 측정 결과", content: <>
    <p className="bin-work-eyebrow">확인한 결과 · 논문 표 4</p><h2>첫 결과를 먼저 보여주는<br />스트리밍 흐름.</h2>
    <div className="bin-deck-result"><span>첫 응답 수신까지 · 방식별 5회 평균</span><div className="bin-deck-metric"><strong>18.28초 → 0.61초</strong><span>비스트리밍 → 스트리밍</span></div><p>18,279ms → 607ms · 첫 응답 대기 시간 약 96.7% 감소</p><p>GPT-4o-mini · 동일 약 800자 입력 · 논문 표 4</p></div>
    <ol className="bin-deck-process"><li><span>01</span><p>첫 토큰은 AI가 생성한 요약의 첫 조각입니다. 완성된 응답을 한 번에 받던 방식에서, 첫 조각부터 전달받는 방식으로 바꿨습니다.</p></li><li><span>02</span><p>받은 내용부터 화면에 순차적으로 표시해, 사용자가 전체 요약이 끝나기 전에 먼저 나온 내용을 읽을 수 있도록 했습니다.</p></li></ol>
  </> },
  { kind: "story", label: "생성 결과의 신뢰성", content: <>
    <p className="bin-work-eyebrow">답변 품질 · 연구한 문제</p><h2>읽기 좋은 요약이<br />정확한 기술정보일까요?</h2>
    <div className="bin-deck-narrative"><span>문제</span><p>생성된 요약에 기술 명칭이 다르게 표현되거나 확인되지 않은 정보가 들어가면, 평가자가 지원자의 역량을 잘못 이해할 수 있습니다.</p></div>
    <div className="bin-deck-narrative"><span>접근</span><p>요약에 담긴 기술정보를 지식정보와 비교하는 검증 단계를 연구했습니다. 기술 명칭과 근거를 확인한 뒤 결과를 정리하는 구조입니다.</p></div>
  </> },
  { kind: "story", label: "요약·검증과 공동 특허", content: <Story eyebrow="연구·공동 발명 · 특허 출원" title={"요약과 검증의\n역할을 나눴습니다."} points={[
    ["기술정보 비교", "요약에서 얻은 기술정보를 지식정보와 대조하고 명칭을 표준화하는 구조를 다뤘습니다."],
    ["확인되지 않은 정보 처리", "근거를 확인하지 못한 정보를 제외하거나 보정하는 요약·검증 방식의 공동 발명에 참여했습니다."],
    ["결과 확인과 수정", "사용자가 요약 결과를 확인하고 필요한 내용을 수정하는 서비스 흐름을 논문에 정리했습니다."],
  ]} /> },
  { kind: "evidence", label: "근거와 직무 연결", content: <>
    <p className="bin-work-eyebrow">근거와 직무 연결</p><h2>LLM 연동에서<br />응답 표시와 검증까지.</h2>
    <div className="bin-deck-evidence"><article><h3>LLM·서비스 연동</h3><ul><li>GPT-4o-mini · Vercel AI SDK · SSE</li><li>정제한 문서 입력과 구조화된 요약 결과</li><li>화면에서 생성 결과를 순차적으로 표시</li></ul></article><article><h3>첫 응답 수신 시간</h3><ul><li>GPT-4o-mini · 동일 약 800자 · 방식별 5회</li><li>비스트리밍 18.28초 → 스트리밍 0.61초</li><li>첫 응답 대기 시간 약 96.7% 감소</li></ul></article><article><h3>연구 산출물</h3><ul><li>민사빈 · 이민규 · 심규성 / 제1저자</li><li>대한전자공학회논문지 63(9), 61–73</li><li>관련 특허 공동 출원 · 10-2026-0186451</li></ul></article><article><h3>교원 업무와 연결</h3><ul><li>LLM 결과를 사용하는 화면·API 흐름</li><li>생성된 기술정보를 검증하는 구조 연구</li><li>변경한 동작을 같은 조건에서 측정</li></ul></article></div>
  </> },
];

const chatbotSlides: PresentationSlide[] = [
  { kind: "overview", label: "서비스 소개", content: <>
    <div className="bin-deck-overview-heading"><div><p className="bin-work-eyebrow">프로젝트 02 · AI ChatBot</p><h2>학교 정보를<br />대화로 찾습니다.</h2></div><div><p>{data.projects[1].summary}</p><p className="bin-deck-role">{data.projects[1].role}</p><div className="bin-work-links"><a href={chatbotUrl} target="_blank" rel="noreferrer">소스 코드 <ArrowUpRight size={15} /></a></div></div></div>
    <figure className="bin-deck-product"><img src="/3_project/aichat_1.png" alt="학교 정보 챗봇의 실제 채팅·공지 화면" width="1440" height="960" /><figcaption>직접 구현한 채팅 UI · 학교 공지·학식·일정 안내</figcaption></figure>
  </> },
  { kind: "architecture", label: "구조와 담당 범위", content: <>
    <div className="bin-deck-architecture-heading"><p className="bin-work-eyebrow">구조와 담당 범위</p><h2>대화 UI와 외부 AI 백엔드를<br />API Route로 연결했습니다.</h2></div><Flow chat />
    <div className="bin-deck-evidence"><article><h3>제가 구현한 영역</h3><p>채팅·가이드·캘린더 화면, 응답 렌더링, Next.js API Route, 대화 기록과 파일 내보내기입니다.</p></article><article><h3>팀원과 연결한 영역</h3><p>팀원이 담당한 학교 데이터 수집·AI 응답 백엔드에 질문을 전달하고, JSON으로 받은 답변을 채팅 화면에 표시했습니다.</p></article></div>
  </> },
  { kind: "story", label: "질문 안내와 빠른 질문 버튼", content: <Story eyebrow="직접 구현 · 질문을 시작하는 사용자" title={"무엇을 물어볼지,\n버튼으로 먼저 안내."} points={[
    ["질문 형식과 예시 안내", "첫 안내와 사용 가이드에 ‘10월 장학공지’처럼 월·날짜와 원하는 정보를 함께 입력하는 예시를 제시했습니다."],
    ["하단에 빠른 질문 5개 배치", "수강 신청·장학금·기숙사·도서관·학사일정 질문을 입력창 위에 배치해, 사용자가 질문할 수 있는 내용을 먼저 보여줬습니다."],
    ["선택한 질문을 바로 전송", "질문 버튼을 누르면 해당 문장을 메시지에 추가하고 API로 전송했습니다. 문장을 직접 작성하는 대신 선택만으로 대화를 시작할 수 있게 했습니다."],
  ]} /> },
  { kind: "story", label: "API 입력과 응답 처리", content: <Story eyebrow="직접 구현 · API 경계" title={"입력은 확인하고,\n실패는 화면에 남깁니다."} points={[
    ["필수 입력 확인", "API Route에서 message와 userId가 없으면 각각 400 응답을 반환합니다."],
    ["외부 API 호출", "외부 /api/chat/intent에 질문을 전달하고 응답 상태를 확인한 뒤 JSON을 UI로 반환합니다."],
    ["오류 안내", "외부 호출이 실패하면 API에서 500을 반환하고, 화면에는 ‘메시지 전송 중 오류가 발생했습니다.’를 표시합니다."],
  ]} /> },
  { kind: "story", label: "답변 가독성 문제", content: <>
    <p className="bin-work-eyebrow">문제와 확인 · 응답 표시</p><h2>답변은 왔는데,<br />한눈에 읽기 어려웠습니다.</h2>
    <div className="bin-deck-narrative"><span>문제</span><p>학교 공지의 긴 URL, 날짜, 목록이 섞인 응답을 단순 텍스트로 표시하면 핵심 정보를 구분하기 어렵고 모바일 너비를 밀어낼 수 있었습니다.</p></div>
    <div className="bin-deck-narrative"><span>담당한 개선</span><p>응답을 문장·목록·링크로 구분해 표시하고 긴 내용의 줄바꿈을 처리했습니다. 사용자가 공지 내용을 읽고 관련 링크를 찾아볼 수 있도록 구성했습니다.</p></div>
  </> },
  { kind: "story", label: "읽기 쉬운 메시지", content: <Story eyebrow="직접 구현 · 답변 표시" title={"문장·목록·링크를\n구분해서 보여줍니다."} points={[
    ["Markdown 렌더링", "ReactMarkdown으로 응답의 문장과 목록, 링크를 구조에 맞게 표시했습니다."],
    ["긴 내용 처리", "긴 URL과 비정형 응답의 줄바꿈을 다루고, 새 메시지가 추가되면 대화 흐름을 따라 확인하도록 구성했습니다."],
    ["정보 확인과 이동", "답변 속 목록을 항목별로 읽고, 링크를 눌러 관련 페이지를 확인할 수 있도록 구성했습니다."],
  ]} /> },
  { kind: "story", label: "대화 상태 관리", content: <Story eyebrow="직접 구현 · 대화 상태" title={"지난 대화를\n다시 이어볼 수 있도록."} points={[
    ["채팅 목록과 활성 대화", "useChatHistory에서 새 대화 생성, 선택, 이름 변경, 삭제와 메시지를 관리했습니다."],
    ["저장과 복원", "브라우저의 localStorage에 대화 기록을 저장하고 새로고침 뒤 복원했습니다. 같은 브라우저에서 지난 대화를 다시 확인할 수 있습니다."],
    ["탭 사이의 기록 반영", "같은 사이트를 연 다른 탭에서 기록이 바뀌면 storage 이벤트로 반영해, 대화 목록을 함께 갱신하도록 했습니다."],
  ]} /> },
  { kind: "story", label: "대화 기록 내보내기", content: <Story eyebrow="직접 구현 · 기록 활용" title={"필요한 대화는\n텍스트 파일로 보관."} points={[
    ["기록을 파일로 구성", "대화 내용을 텍스트로 정리하고 브라우저 Blob API로 txt 파일을 만들었습니다."],
    ["다운로드 흐름", "브라우저에서 만든 파일을 객체 URL로 연결해 사용자가 txt 파일로 내려받을 수 있도록 했습니다."],
    ["화면 밖에서도 기록 활용", "내려받은 파일을 텍스트 편집기로 열어 필요한 대화 내용을 다시 확인할 수 있습니다."],
  ]} /> },
  { kind: "evidence", label: "근거와 직무 연결", content: <>
    <p className="bin-work-eyebrow">근거와 직무 연결</p><h2>대화 흐름·화면·API를<br />직접 연결한 경험.</h2>
    <div className="bin-deck-evidence"><article><h3>질문 안내와 대화 흐름</h3><ul><li>질문 예시·사용 가이드로 입력 방법 안내</li><li>빠른 질문 5개 · 버튼 선택 시 바로 전송</li><li>답변 표시·대화 복원·txt 파일 저장</li></ul></article><article><h3>오류 처리</h3><ul><li>message·userId 누락: 400</li><li>외부 응답 실패: API 500</li><li>클라이언트: 전송 실패 메시지 표시</li></ul></article><article><h3>확인할 수 있는 근거</h3><ul><li><a href={chatbotQuickReplyUrl} target="_blank" rel="noreferrer">빠른 질문 버튼 구현 소스 ↗</a></li><li><a href={`${chatbotUrl}/blob/main/components/enhanced-chat-interface.tsx`} target="_blank" rel="noreferrer">질문 안내·채팅 화면 소스 ↗</a></li><li><a href={`${chatbotUrl}/blob/main/app/api/chat/route.ts`} target="_blank" rel="noreferrer">API Route 소스 ↗</a></li></ul></article><article><h3>협업과 담당 역할</h3><ul><li>2인 팀 · 프론트엔드·API 연동 담당</li><li>팀원의 정보 수집·AI 응답 백엔드 연결</li><li>질문 선택부터 답변 확인·기록 보관까지 구현</li></ul></article></div>
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
    <header className="bin-work-hero bin-work-editorial bin-work-container"><div><p className="bin-work-eyebrow">MIN SABIN · AI PORTFOLIO</p><h1>민사빈<span>AI 서비스 개발자</span></h1><p className="bin-work-lead">AI의 답변을,<br />사용할 수 있는 서비스로.</p><p>{data.intro}</p><a className="bin-work-button" href="/ai-resume">이력서 보기 <ArrowUpRight size={17} /></a></div>
      <div className="bin-work-selected"><p>SELECTED PROJECTS</p><a href="#project-0"><span>01 · 공동 연구 · 제1저자</span><h2>AI 요약 플랫폼</h2><p>요약 결과를 스트리밍으로 표시하고, 생성·검증·저장·시각화 구조를 연구했습니다.</p><div className="bin-work-selected-evidence"><strong>첫 응답 수신 18.28초 → 0.61초</strong><small>GPT-4o-mini · 동일 약 800자 · 방식별 5회 · 논문 표 4</small></div><ArrowUpRight size={28} /></a><a href="#project-1"><span>02 · 2인 팀 · 프론트엔드</span><h2>AI ChatBot</h2><p>질문 예시와 하단 버튼으로 대화를 시작하도록 안내하고, 학교 정보 API·답변 표시·대화 기록을 연결했습니다.</p><div className="bin-work-selected-evidence"><strong>빠른 질문 5개 · 선택 즉시 전송</strong><small>질문 안내 · 채팅 화면 · API 연동</small></div><ArrowUpRight size={28} /></a></div>
      <nav className="bin-work-hero-index" aria-label="포트폴리오 읽기 안내"><span>서비스 소개 · 담당 범위 · 구현 과정 · 문제 해결 · 근거</span><a href="#projects">스크롤해서 한 장씩 읽기 <ArrowDown size={14} /></a></nav>
    </header>
    <div className="bin-work-projects" id="projects"><div className="bin-work-container">{data.projects.map((project, index) => <ProjectPresentation key={project.id} index={index} project={{ title: project.title, links: {}, imageGallery: { main: { src: index ? "/3_project/aichat_1.png" : "", alt: project.title }, supporting: [] } }} presentation={{
      pages: index ? chatbotSlides : paperSlides, chapters,
      sidebar: index ? <figure><img src="/3_project/aichat_1.png" alt="직접 구현한 학교 정보 챗봇 화면" width="1440" height="960" loading="lazy" /></figure> : null,
      links: <div className="bin-work-links"><a href={index ? chatbotUrl : paperUrl} target="_blank" rel="noreferrer">{index ? "소스 코드" : "게재 논문"}<ArrowUpRight size={15} /></a></div>,
      nextHref: index ? "#activities-title" : "#project-1", nextLabel: index ? "논문·특허" : "다음 프로젝트",
    }} />)}</div></div>
    <section className="bin-work-activities bin-work-container" aria-labelledby="activities-title"><p className="bin-work-eyebrow">논문·특허</p><h2 id="activities-title">연구로 남긴 근거</h2><div>{data.research.map(item => <article key={item.title}><p className="bin-work-date">{item.status}</p><h3>{item.title}</h3><p>{item.description}</p><div className="ai-research-document-links"><a href={item.href} target="_blank" rel="noreferrer">{item.linkLabel}<ArrowUpRight size={15} /></a>{item.pdfHref && <a href={item.pdfHref} target="_blank" rel="noreferrer">{item.pdfLabel}<ArrowUpRight size={15} /></a>}</div></article>)}</div></section>
    <footer className="bin-work-footer" id="profile"><div className="bin-work-container"><div><h2>민사빈</h2><p>{data.education.school} · {data.education.degree}</p></div><div className="bin-work-footer-links"><a href={`mailto:${data.profile.email}`}>{data.profile.email}</a><a href={data.profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} /></a><a href="/ai-resume">이력서 <ArrowUpRight size={15} /></a></div></div></footer>
  </main>;
}
