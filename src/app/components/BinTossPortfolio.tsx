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
    summary: "지도·앨범·타임라인으로 사진을 찾는 서비스입니다. 사진 상세·좋아요 기능을 만들고, 다른 화면을 다녀와도 이전 검색을 이어가도록 했습니다.",
    role: "3인 팀(FE·BE·Unity 각 1명) · 프론트엔드 담당 · 사진 탐색 UI · Mapbox 연동 · 공통 컴포넌트 · 반응형",
    cases: [
      {
        title: "작은 사진 카드에 큰 이미지가 필요할까",
        metric: { label: "사진 16장 · 받아온 이미지 용량", value: "4.22MB → 237KB", change: "94.4% 감소 · 동일 사진 비교" },
        problem: "작은 목록 카드에 상세용 큰 이미지를 쓰면 필요한 크기보다 많은 데이터를 받습니다.",
        check: "같은 배포 환경에서 사진 16장과 불러오는 방식은 유지하고, 큰 이미지와 썸네일의 용량을 비교했습니다.",
        action: [
          "사용자가 사진을 더 빨리 볼 수 있도록 목록에는 썸네일, 상세에는 큰 이미지를 제공했습니다. 화면에 맞는 이미지 주소를 선택하는 코드는 한곳에 모았습니다.",
          "두 이미지 모두 WebP를 사용하되, 표시 크기에 맞춰 이미지 크기·품질을 달리했습니다. 이미지를 언제, 어떤 순서로 요청할지 정하는 설정은 유지했습니다.",
        ],
        result: "",
        note: "2026-10-03 · 동일 배포·사진 16장·조건별 5회\n상세용 큰 이미지 / 목록용 썸네일 비교 · 모두 WebP\n390×844·DPR 2 · 1.6Mbps·지연 150ms·CPU 4배 감속\n받아온 이미지 파일만 측정. 과거 운영 배포·전체 통신량 대비 아님.",
      },
      {
        title: "보이지 않는 사진 카드까지\n만들고 있었습니다.",
        metric: { label: "테스트용 항목 3,000개 · 최대 생성 카드 수", value: "3,000개 → 57개", change: "화면 주변만 생성 · 모바일 크기 PC" },
        problem: "사진 카드를 모두 만들면 화면 밖 카드도 브라우저가 처리해야 합니다. 사진이 많을수록 불필요한 작업도 늘어납니다.",
        check: "같은 SVG 이미지를 반복한 테스트용 목록에서 모든 카드를 만드는 경우와 화면 주변만 만드는 경우를 비교했습니다.",
        action: [
          "사진 탐색 중 화면 처리 부담을 줄이기 위해, 화면 너비에 맞춰 사진을 줄별로 묶고 보이는 줄과 그 앞뒤의 사진 카드만 만듭니다.",
          "스크롤하면 필요한 줄의 카드를 만듭니다. 필터 기준과 사진 ID로 카드를 구분하는 방식은 유지하고, 이 기능만 켜고 꺼 비교했습니다.",
        ],
        result: "사진이 많아져도 한 번에 만드는 카드를 화면 주변으로 제한했습니다.",
        note: "2026-10-04 · 동일 로컬 빌드·SVG URL 1개 반복\n1,000/3,000개 × 화면 주변만 생성하는 기능 유무 × 화면별 3회\n최대 카드: 390×844·DPR 2에서 57개 / 1440×900·DPR 1에서 136개\n카드 수 관찰. 실제 스마트폰 속도·FPS 측정 아님.",
      },
    ],
    implementation: [
  {
    "title": "필요할 때 화면을 불러오고,\n같은 기능은 함께 씁니다.",
    "reason": "초기에 모든 화면을 불러오는 부담을 줄이고, 화면마다 같은 기능을 따로 수정하지 않도록 검색·사진 상세의 공통 동작을 한곳에서 관리했습니다.",
    "steps": [
      { "title": "필요한 화면부터 불러오기", "body": "지도·앨범·타임라인은 React.lazy로 필요할 때 불러옵니다. 준비 중에는 Suspense로 로딩 화면을 보여줍니다." },
      { "title": "검색창 재사용", "body": "입력·초기화 기능은 함께 쓰고, 장소 검색이나 앨범 필터처럼 화면마다 다른 기능은 따로 연결했습니다." },
      { "title": "사진 상세 화면 재사용", "body": "같은 상세 화면에 필요한 버튼을 더했습니다. 키보드로 열고 닫기, 닫은 뒤 원래 버튼으로 돌아가기도 함께 처리합니다." }
    ],
    "note": "React.lazy로 필요한 화면만 불러오고 Suspense로 로딩 표시\n좋아요 화면도 같은 사진 목록·상세 화면 사용\nRadix Dialog · 390px/1280px 배치 확인\n키보드 열기·닫기·원래 버튼으로 돌아가기 확인",
  },
  {
    "title": "이전 검색은 기억하고,\n입력을 멈추면 장소를 찾습니다.",
    "reason": "화면을 다녀와도 검색 조건과 보던 위치를 다시 찾지 않도록 했습니다. 장소 입력 중에는 불필요한 검색 요청을 줄였습니다.",
    "steps": [
      { "title": "사진·좋아요 함께 관리", "body": "Zustand에서 화면에 필요한 값만 가져옵니다. 필터 결과는 별도로 저장하지 않고 원본 사진에서 찾습니다." },
      { "title": "이전 검색으로 돌아가기", "body": "검색·태그·앨범 조건은 URL에 남깁니다. 글자마다 방문 기록을 쌓지 않고 화면 이동만 기록해, 뒤로가면 이전 조건과 목록 위치로 돌아갑니다." },
      { "title": "입력을 멈춘 뒤 0.4초 후 검색", "body": "입력한 글자는 바로 보여줍니다. 2자 이상이면 입력을 멈춘 뒤 검색하고 업로드 화면에도 반영합니다. 다시 입력하면 0.4초를 새로 기다립니다." }
    ],
    "note": "장소 입력은 즉시 표시\n2자 미만: 검색 없이 업로드 화면에 바로 반영\n2자 이상: 마지막 입력 후 0.4초(400ms) 뒤 검색·반영\n로컬 Chrome에서 지도·좋아요 화면을 오가며 확인\n검색 조건은 새로고침 후에도 유지, 목록 위치는 현재 접속 중에 유지",
  }
],
  },
  "Game Information Platform": {
    summary: "게임 검색·상점별 가격 비교·관심 목록을 제공하는 Next.js 개인 프로젝트입니다. 같은 카드를 다시 처리하는 작업과 같은 제목을 반복 조회하는 일을 줄였습니다.",
    role: "개인 프로젝트 · 검색·가격 비교·관심 목록 UI · API 연동 · 중복 조회·화면 갱신 개선 · 테스트",
    cases: [
      {
        title: "재시도할 때\n같은 카드도 다시 처리됐습니다.",
        metric: { label: "모의 카드 · 표시 처리 횟수", value: "6회 → 2회", change: "처리 횟수 약 67% 감소" },
        problem: "관심 목록 버튼이 매번 새로 만들어져, 내용이 같은 카드도 다시 처리됐습니다. 같은 내용은 다시 처리하지 않도록 해도 반복 작업이 남았습니다.",
        check: "고정 데이터로 실패·재시도·추가 로딩을 재현하고, 기존 카드와 새 카드를 표시하는 함수가 각각 몇 번 실행되는지 셌습니다.",
        action: [
          "관심 목록 버튼을 카드 안에서 만들고, 내용이 같으면 카드와 버튼을 다시 처리하지 않도록 했습니다.",
          "다음 목록을 합칠 때도 기존 게임 데이터를 그대로 사용해, 바뀌지 않은 카드를 다시 처리하는 일을 줄였습니다.",
        ],
        result: "기존 카드의 추가 처리 4회 → 0회 · Vitest/jsdom",
        note: "실제 목록 + 모의 카드(mock GameCard) · Vitest/jsdom\n실패·재시도·추가 로딩 시나리오\n총 처리 6회 → 2회 / 기존 카드 추가 처리 4회 → 0회\n카드 처리 횟수 측정. 브라우저 표시 속도 개선율 아님.",
      },
      {
        title: "검색 조건만 바뀌었는데,\n같은 목록을 또 불러와야 할까?",
        metric: {
          label: "같은 제목에서 상점·태그 조건을 바꿔 다시 검색",
          value: "추가 제목 조회 0회",
          change: "받아온 게임 목록 재사용",
        },
        problem: "같은 제목에서 상점·가격 조건만 바뀌어도, 이미 받아온 게임 목록을 다시 불러오는 작업이 생길 수 있었습니다.",
        check: "받아온 목록을 저장한 뒤 상점·태그 조건을 바꿔 다시 검색했습니다. 외부에서 게임 목록을 다시 받아오는지 확인했습니다.",
        action: [
          "처음 검색해 받아온 게임 목록을 제목별로 저장했습니다. 같은 제목을 다시 검색하면 이 목록을 재사용합니다.",
          "상점·태그·가격 조건이 바뀌면 저장된 목록에서 맞는 게임만 다시 골랐습니다. 목록을 새로 받아오는 작업 없이 검색 결과를 바꿀 수 있게 했습니다.",
        ],
        result: "저장된 결과가 유효한 동안 · 테스트용 응답으로 확인",
        note: "테스트용 응답 · 같은 제목(hades)으로 검증\n동시 검색 4건: 기본 / Steam / Action·제목순 / 3만 원 이하\n외부 제목 조회 1회, 검색 정보 준비 1회\n별도 재사용 테스트: 대소문자·태그·상점 변경 후 추가 제목 조회 0회\n전체 통신 횟수나 검색 속도 개선율을 측정한 값은 아님.",
      },
    ],
    implementation: [
  {
    "title": "같은 카드의 반복 처리를 줄이고,\n첫 표지부터 불러옵니다.",
    "reason": "기존 카드 데이터를 그대로 쓰고, 첫 화면에 필요한 이미지를 먼저 요청합니다.",
    "steps": [
      { "title": "바뀐 카드만 다시 처리", "body": "카드와 관심 목록 버튼을 함께 관리하고, 게임 ID로 기존 카드를 구분합니다." },
      { "title": "첫 표지부터 불러오기", "body": "첫 이미지는 우선해서 바로 불러오고, 나머지는 화면에 가까워질 때 불러옵니다." }
    ],
    "note": "가격 변환·요청 실패 처리를 기능별로 테스트\nPlaywright로 주요 화면의 기본 동작 확인\nGitHub Actions에서 코드 검사·테스트·빌드·화면 확인 자동 실행\n테스트용 응답 검증과 실제 외부 API 운영 상태는 별개",
  },
  {
    "title": "검색 조건을 먼저,\n결과는 준비되는 대로.",
    "reason": "검색 결과를 기다리는 동안에도 검색창과 조건을 먼저 보여줍니다.",
    "steps": [
      { "title": "입력 중에는 목록 그대로", "body": "입력할 때마다 결과 목록이 갱신되지 않도록 하고, 검색한 조건은 URL에 남겼습니다." },
      { "title": "검색창 먼저, 결과는 나중에", "body": "검색창을 먼저 보여주고, 검색 결과는 불러오는 대로 표시합니다." },
      { "title": "같은 제목의 조회 결과 재사용", "body": "저장된 결과를 다시 쓰거나 조회 중인 결과를 함께 기다린 뒤, 검색 조건에 맞는 게임을 추립니다." }
    ],
    "note": "외부 응답을 늦춘 조건으로 확인\n홈 소개·탐색을 먼저 전송\n인사이트보다 할인 목록을 먼저 제공\n검색 조건과 결과도 각각 준비되는 대로 전송",
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
          <p>사진 로딩 부담을 줄이기 위해 목록에 썸네일을 사용해, 동일 사진 16장의 전송량을 94.4% 줄였습니다. 검색 조건을 바꿀 때는 받아온 목록을 재사용해, 저장된 결과가 유효한 동안 추가 제목 조회를 0회로 유지했습니다.</p>
          <a className="bin-work-button" href="#projects">프로젝트 살펴보기 <ArrowDown size={17} /></a>
        </div>
        <div className="bin-work-selected">
          <p>SELECTED WORK · 2025—2026</p>
          <a href="#project-0">
            <span>01 · 팀 프로젝트 / 프론트엔드</span><h2>PhotoMap</h2>
            <p>사진을 더 빨리 볼 수 있도록 작은 카드에 필요한 이미지 크기를 살피고, 같은 사진의 큰 이미지·썸네일을 비교했습니다.</p>
            <div className="bin-work-selected-evidence"><strong>이미지 용량 94.4% 감소</strong><small>동일 배포·사진 16장 · 4.22MB → 237KB</small></div>
            <ArrowUpRight size={28} />
          </a>
          <a href="#project-1">
            <span>02 · 개인 프로젝트</span><h2>GameInfo</h2>
            <p>조건을 바꿀 때 같은 목록을 다시 받지 않도록, 상점·태그 변경 후 제목 조회 횟수를 확인하고 받아온 목록을 재사용했습니다.</p>
            <div className="bin-work-selected-evidence"><strong>추가 제목 조회 0회</strong><small>같은 제목·저장 결과 유효 시 · 테스트용 응답</small></div>
            <ArrowUpRight size={28} />
          </a>
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
