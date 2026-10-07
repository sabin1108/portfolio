import { ProjectPresentation } from "./ProjectPresentation";
import { useEffect } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { frontendPortfolio } from "../data/main";
import "../../styles/bin-portfolio.css";

const projectNotes: Record<string, {
  summary: string;
  role: string;
  cases: { title: string; problem: string; check: string; action: string[]; result: string; metric?: { label: string; value: string; change: string }; note?: string }[];
  implementation: { title: string; reason: string; steps: { title: string; body: string }[]; note: string }[];
}> = {
  PhotoMap: {
    summary: "지도·앨범·타임라인으로 사진을 찾는 서비스입니다. 사진 상세·좋아요와 화면 이동 후 탐색 복원을 구현했습니다.",
    role: "3인 팀(FE·BE·Unity 각 1명) · 프론트엔드 담당 · 사진 탐색 UI · Mapbox 연동 · 공통 컴포넌트 · 반응형",
    cases: [
      {
        title: "작은 사진 카드에 큰 이미지가 필요할까",
        metric: { label: "사진 16장 · 이미지 응답 본문", value: "4.22MB → 237KB", change: "94.4% 감소 · 동일 사진 비교" },
        problem: "작은 목록 카드에 상세용 큰 이미지를 쓰면 필요한 크기보다 많은 데이터를 받습니다.",
        check: "같은 배포·사진 16장·요청 정책을 유지하고, 큰 이미지와 썸네일 조건을 비교했습니다.",
        action: [
          "사진을 목록용 썸네일과 상세용 큰 이미지로 나눴습니다. 작은 카드에서는 썸네일 주소를 선택하도록 이미지 주소 처리를 한곳에 모았습니다.",
          "두 이미지 모두 WebP를 사용하되, 표시 크기에 맞춰 이미지 크기·품질을 달리했습니다. 비교할 때 지연 로딩과 요청 우선순위는 동일하게 유지했습니다.",
        ],
        result: "",
        note: "2026-10-03 · 동일 배포·사진 16장·조건별 5회\n상세용 큰 이미지 / 목록용 썸네일 비교 · 모두 WebP\n390×844·DPR 2 · 1.6Mbps·지연 150ms·CPU 4배 감속\n사진 응답 본문 감소율. 과거 운영 배포·전체 트래픽 대비 아님.",
      },
      {
        title: "화면 밖 사진까지 렌더링하던 목록",
        metric: { label: "합성 항목 3,000개 · 최대 렌더링 카드", value: "3,000개 → 57개", change: "행 단위 가상화 · 모바일 크기 PC" },
        problem: "사진을 모두 렌더링하면 화면 밖 카드까지 DOM에 남고, 목록이 커질수록 처리량이 늘어납니다.",
        check: "동일 빌드·SVG 반복 항목으로 전체 렌더링과 가상화를 비교했습니다. 목록·화면 크기별 카드 수를 관찰했습니다.",
        action: [
          "화면 너비에 따라 열 수를 계산해 사진을 행으로 묶고, 보이는 구간과 앞뒤 여유 행만 렌더링합니다.",
          "스크롤 위치에 맞춰 렌더링할 행을 교체합니다. 필터·열 계산의 useMemo와 사진 ID key는 유지하고, 비교에서는 가상화만 켜고 껐습니다.",
        ],
        result: "화면 밖 카드의 DOM 생성을 줄여, 목록이 커져도 렌더링 범위를 화면 주변으로 제한했습니다.",
        note: "2026-10-04 · 동일 로컬 빌드·SVG URL 1개 반복\n1,000/3,000개 × 가상화 유무 × 화면별 3회\n최대 카드: 390×844·DPR 2에서 57개 / 1440×900·DPR 1에서 136개\n카드 수 관찰. 실제 스마트폰 속도·FPS 측정 아님.",
      },
    ],
    implementation: [
  {
    "title": "화면 로딩과\n공통 UI의 경계를 나눴습니다.",
    "reason": "화면 코드는 필요한 시점에 불러오고, 검색·사진 상세의 공통 동작은 함께 씁니다.",
    "steps": [
      { "title": "화면별 코드 분할", "body": "지도·앨범·타임라인은 React.lazy로 불러오고, Suspense로 대기 UI를 표시합니다." },
      { "title": "검색 입력 공유", "body": "value/onChange 기반 입력·초기화는 공통화하고, 장소 검색·앨범 필터는 화면에 남겼습니다." },
      { "title": "사진 상세 조합", "body": "PhotoModal의 선택 사진은 Context로 공유합니다. 화면별 액션을 조합하고 키보드·포커스 복귀를 공통 처리합니다." }
    ],
    "note": "React.lazy + Suspense로 화면 코드 분할\n좋아요 화면도 공통 PhotoFeed·PhotoModal 사용\nRadix Dialog · 390px/1280px 배치 확인\n키보드 열기·닫기·포커스 복귀 확인",
  },
  {
    "title": "탐색은 이어가고,\n입력과 요청은 따로 처리합니다.",
    "reason": "다시 찾을 조건은 보존하고, 업로드 장소 검색은 입력이 멈춘 뒤 요청합니다.",
    "steps": [
      { "title": "공유 데이터 · Zustand", "body": "사진·좋아요는 필요한 값만 구독합니다. 필터 결과는 원본에서 계산합니다." },
      { "title": "탐색 조건 · URL", "body": "검색·태그·앨범을 보존합니다. 입력은 replace, 화면 전환은 push, 목록 위치는 별도 hook으로 복원합니다." },
      { "title": "장소 검색 · 400ms 디바운스", "body": "입력은 즉시 표시합니다. 2자 이상이면 대기 후 검색·부모 상태에 반영하고, 새 입력은 타이머를 갱신합니다." }
    ],
    "note": "장소 입력은 local state에 즉시 표시\n2자 미만: 조회 생략·부모에 즉시 반영 / 2자 이상: 400ms 대기\n로컬 Chrome에서 지도·좋아요 화면 간 탐색 복원 확인\nURL 조건은 새로고침에도, 목록 위치는 현재 세션에서 유지",
  }
],
  },
  "Game Information Platform": {
    summary: "게임 검색·상점별 가격 비교·관심 목록을 제공하는 Next.js 개인 프로젝트입니다. 카드 반복 호출과 제목 후보의 중복 조회를 줄였습니다.",
    role: "개인 프로젝트 · 검색·가격 비교·관심 목록 UI · API 연동 · 렌더링 경계·검색 캐시 설계 · 테스트",
    cases: [
      {
        title: "재시도할 때\n기존 카드까지 다시 호출됐습니다.",
        metric: { label: "고정 시나리오 · mock 카드 호출", value: "6회 → 2회", change: "호출 수 약 67% 감소" },
        problem: "부모가 매번 새 액션 JSX를 전달해, 가격이 같은 기존 카드도 memo로 반복 호출을 막지 못했습니다.",
        check: "고정 데이터로 실패·재시도·추가 로딩을 재현하고, 기존 카드와 새 카드의 호출을 나눠 셌습니다.",
        action: [
          "관심 목록 액션을 FeedGameCard 안으로 옮겨 카드와 같은 memo 경계에 뒀습니다.",
          "목록 병합 시 기존 게임 객체의 참조를 유지해 불필요한 카드 호출을 줄였습니다.",
        ],
        result: "기존 카드의 추가 호출 4회 → 0회 · Vitest/jsdom",
        note: "실제 DealFeed + mock GameCard · Vitest/jsdom\n실패·재시도·추가 로딩 시나리오\n누적 호출 6회 → 2회 / 기존 카드 추가 호출 4회 → 0회\n호출 수 측정. 브라우저 표시 속도 개선율 아님.",
      },
      {
        title: "필터가 달라도\n먼저 찾는 제목은 같습니다.",
        metric: { label: "동일 제목 · 동시 필터 요청 4건", value: "후보 조회 1회 공유", change: "진행 중 조회를 함께 기다림" },
        problem: "같은 제목으로 여러 필터 요청이 들어오면, 동일한 제목 후보를 중복 조회할 수 있었습니다.",
        check: "제목 후보 조회와 필터 적용을 나누고, 동시 요청이 후보를 공유하는지 확인했습니다.",
        action: [
          "정규화한 제목으로 후보를 캐시하고, 진행 중인 조회 Promise를 공유합니다.",
          "태그·스토어·가격 필터는 조회한 후보에 적용합니다.",
        ],
        result: "모의 공급자 테스트 · 캐시 유지 중 필터 변경에도 재사용",
        note: "모의 공급자 · 같은 제목의 동시 필터 요청 4건\n제목 후보 조회 함수 1회 공유\n캐시 유지 중 필터 변경에도 후보 재사용\n전체 HTTP 요청 수 감소를 측정한 값은 아님.",
      },
    ],
    implementation: [
  {
    "title": "카드와 액션을\n같은 경계에서 갱신합니다.",
    "reason": "카드의 참조를 유지하고, 첫 화면에 필요한 표지부터 요청합니다.",
    "steps": [
      { "title": "카드 + 액션 · memo", "body": "FeedGameCard 안에서 함께 생성하고, game.id key로 기존 카드를 구분합니다." },
      { "title": "첫 표지부터 요청", "body": "첫 이미지는 eager/high priority, 후속 이미지는 lazy로 불러옵니다." }
    ],
    "note": "가격 변환·API 실패: 단위 테스트\n주요 화면: Playwright smoke\nGitHub Actions: 타입 검사·린트·테스트·빌드·smoke\n모의 응답 검증과 실제 외부 API 운영 상태는 별개",
  },
  {
    "title": "검색 조건을 먼저,\n결과는 준비되는 대로.",
    "reason": "입력 UI와 결과 조회의 렌더링 경계를 분리했습니다.",
    "steps": [
      { "title": "입력 · GET form", "body": "uncontrolled form과 URL query로 입력을 결과 목록의 React state에서 분리했습니다." },
      { "title": "결과 · 서버 스트리밍", "body": "서버 Suspense 경계로 홈·검색의 각 영역을 준비되는 대로 표시합니다." },
      { "title": "후보 · 캐시 공유", "body": "같은 제목은 캐시와 진행 중 Promise를 공유하고 필터만 따로 적용합니다." }
    ],
    "note": "공급자 응답을 보류한 조건으로 확인\n홈 소개·탐색을 먼저 전송\n인사이트보다 할인 목록을 먼저 제공\n검색 조건 폼·결과 영역도 서버 경계 분리",
  }
],
  },
};

export function BinTossPortfolio() {
  useEffect(() => {
    document.documentElement.classList.add("bin-presentation-page");
    return () => document.documentElement.classList.remove("bin-presentation-page");
  }, []);
  const data = frontendPortfolio;
  return (
    <main className="bin-work" id="top">
      <nav className="bin-work-nav" aria-label="포트폴리오 메뉴">
        <a className="bin-work-name" href="#top">{data.profile.name}</a>
        <div><a href="#projects">프로젝트</a><a href="#profile">소개</a><a href="/resume/bin_resume">이력서 <ArrowUpRight size={14} /></a></div>
      </nav>
      <header className="bin-work-hero bin-work-editorial bin-work-container">
        <div>
          <p className="bin-work-eyebrow">MIN SABIN · PORTFOLIO</p>
          <h1>{data.profile.name}<span>프론트엔드 개발자</span></h1>
          <p className="bin-work-lead">사용자의 불편을 살피고,<br />원인을 찾아 고치는 개발자입니다.</p>
          <p>사진 탐색·게임 가격 비교 화면을 개선하고, AI 서비스 구현·논문 발표·공동 특허 출원에 참여했습니다.</p>
          <a className="bin-work-button" href="#projects">프로젝트 살펴보기 <ArrowDown size={17} /></a>
        </div>
        <div className="bin-work-selected">
          <p>SELECTED WORK · 2025—2026</p>
          <a href="#project-0"><span>01 · 팀 프로젝트 / 프론트엔드</span><h2>PhotoMap</h2><p>사진을 장소와 시간으로 탐색하는 화면.<br />공통 UI·탐색 상태를 설계하고 로딩을 개선한 과정.</p><ArrowUpRight size={28} /></a>
          <a href="#project-1"><span>02 · 개인 프로젝트</span><h2>GameInfo</h2><p>재시도 중 기존 카드의 반복 호출을 줄이고,<br />같은 제목의 검색 후보를 공유한 과정.</p><ArrowUpRight size={28} /></a>
        </div>
        <nav className="bin-work-hero-index" aria-label="포트폴리오 읽기 안내"><span>서비스 소개 · 아키텍처 · 구현 과정 · 문제 해결 · 검증</span><a href="#projects">스크롤해서 한 장씩 읽기 <ArrowDown size={14} /></a></nav>
      </header>
      <div className="bin-work-projects" id="projects"><div className="bin-work-container">
        {data.projects.map((project, index) => <ProjectPresentation key={project.title} project={project} index={index} notes={projectNotes[project.title]} />)}
      </div></div>
      <section className="bin-work-activities bin-work-container" aria-labelledby="activities-title">
        <p className="bin-work-eyebrow">특허·발표와 연구</p><h2 id="activities-title">프로젝트 외 활동</h2>
        <div>{data.activities.map((activity) => (
          <article key={activity.title}><p className="bin-work-date">{activity.date}</p><h3>{activity.title}</h3><p>{activity.description}</p>
            {activity.pdf && <a href={activity.pdf.href} target="_blank" rel="noreferrer">{activity.pdf.label} <ArrowUpRight size={15} /></a>}
          </article>
        ))}</div>
      </section>
      <footer className="bin-work-footer" id="profile"><div className="bin-work-container">
        <div><h2>{data.profile.name}</h2><p>{data.education.school} · {data.education.degree}</p></div>
        <div className="bin-work-footer-links">
          <a href={`mailto:${data.profile.contacts.email}`}>{data.profile.contacts.email}</a>
          <a href={data.profile.contacts.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} /></a>
          <a href="/resume/bin_resume">이력서 <ArrowUpRight size={15} /></a>
        </div>
      </div></footer>
    </main>
  );
}
