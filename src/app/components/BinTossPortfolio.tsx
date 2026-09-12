import { ProjectPresentation } from "./ProjectPresentation";
import { useEffect } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { frontendPortfolio } from "../data/main";
import "../../styles/bin-portfolio.css";

const projectNotes: Record<string, {
  summary: string;
  role: string;
  cases: { title: string; problem: string; check: string; action: string[]; result: string; metric?: { label: string; value: string; change: string }; note?: string }[];
  implementation: { title: string; reason: string; steps: string[]; note: string }[];
}> = {
  PhotoMap: {
    summary: "사진을 장소와 시간에 따라 찾아보는 서비스입니다. 3인 팀에서 지도·사진 목록·앨범·타임라인 UI를 구현했습니다. 검색·상세 컴포넌트를 공통화하고 화면 이동 후 탐색 조건을 복원하며, 모바일 조작과 사진 로딩을 개선했습니다.",
    role: "3인 팀 프론트엔드 담당 · 사진 탐색 UI · 공통 컴포넌트 · 상태 관리 · 지도 연동 · 반응형",
    cases: [
      {
        title: "작은 사진 카드에 원본을 불러오던 문제",
        metric: { label: "첫 사진 표시 · p95", value: "17.552초 → 2.615초", change: "85.1% 감소" },
        problem: "모바일에서 화면이 열린 뒤에도 첫 사진을 기다려야 했습니다. 네트워크 요청을 확인하니 작은 카드에도 원본 이미지를 내려받고 있었습니다.",
        check: "화면이 열리는 시간과 사진이 보이는 시간을 따로 확인했습니다. 첫 사진뿐 아니라 다른 원본 요청도 함께 진행되고 있어, 파일 크기와 요청 순서를 함께 바꿔야 했습니다.",
        action: [
          "목록에는 작은 이미지를, 상세 화면에는 큰 이미지를 요청하도록 이미지 주소 선택을 한곳에 모았습니다.",
          "첫 줄은 바로 불러오고 나머지는 화면에 가까워질 때 요청합니다. 높은 요청 우선순위는 첫 사진에만 지정했습니다.",
        ],
        result: "동일 Vercel Preview·모바일 4G 합성 환경에서 JPEG 기준 30회와 WebP 최적화 100회를 비교했습니다. 각 실행은 새 브라우저 컨텍스트에서 측정했습니다.",
        note: "2026-08-14 동일 Preview의 JPEG 기준 30회·WebP 최적화 100회 합성 실험입니다. 390×844·4G·CPU 4배 감속 조건에서 첫 사진 p95 17.552초 → 2.615초(85.1% 감소)를 확인했습니다. 이미지 파생본 비교이며, 이번 UI 공통화의 성능 개선율과는 구분합니다.",
      },
      {
        title: "사진이 많은 목록에서 선택 반응 개선",
        metric: { label: "클릭 → 모달 이미지 준비 · 중앙값", value: "59.6ms → 13.2ms", change: "77.9% 감소" },
        problem: "사진 목록의 모든 항목을 한꺼번에 렌더링하면 화면 밖 카드까지 처리해야 했습니다. 초기 이미지 로딩 이후, 목록을 탐색하고 사진을 선택할 때의 반응을 별도로 확인했습니다.",
        check: "같은 카드·상태 관리·이미지 정책을 유지하고 가상화 유무만 바꿨습니다. 스크롤 직후 클릭부터 올바른 모달 이미지가 준비될 때까지를 비교해, 렌더링 범위의 영향을 확인했습니다.",
        action: [
          "사진 목록을 행 단위로 가상화했습니다. 현재 보이는 구간 주변도 미리 그려 스크롤할 때 다음 사진을 준비합니다.",
          "사진 목록이나 선택한 분류가 바뀔 때만 표시할 사진을 다시 고릅니다. 같은 조건에서는 이전 계산 결과를 재사용합니다.",
          "목록에 필요한 상태만 읽고, 선택한 값이 달라졌는지 비교해 다시 처리할 범위를 줄였습니다. 사진 ID로 항목을 구분해 같은 사진의 화면을 유지합니다.",
        ],
        result: "동일 SVG·합성 항목 1,000개·모바일 화면의 목록 단독 실험에서 가상화 유무를 30쌍 비교했습니다. 클릭부터 모달 이미지 준비까지 측정했습니다.",
        note: "2026-09-09 동일 SVG·합성 항목 1,000개·390×844(DPR 2)의 목록 단독 A/B 각 30회 결과입니다. 모달 준비 지연 중앙값은 59.6ms → 13.2ms(77.9% 감소), p95는 68.9ms → 16.0ms였습니다. 30쌍 모두 가상화가 짧았으며 스크롤 프리즈 감소는 입증하지 못했습니다.",
      },
    ],
    implementation: [
  {
    "title": "같은 동작은 공유하고,\n화면별 기능은 조합했습니다.",
    "reason": "지도·앨범의 검색창과 좋아요 화면의 피드·모달이 각각 구현돼 있었습니다. 같은 입력·상세 동작은 함께 수정하되, 화면마다 다른 검색 조건과 버튼은 유지할 수 있어야 했습니다.",
    "steps": [
      "검색창은 value/onChange 기반 제어 컴포넌트로 통합했습니다. 입력·초기화 UI는 공유하고, 장소 검색과 앨범 필터링은 각 화면에서 처리합니다.",
      "PhotoModal을 이미지·메타데이터·액션 영역으로 나누고 Context로 선택 사진을 공유했습니다. 지도·피드·관계 그래프는 필요한 액션을 조합합니다.",
      "좋아요 화면도 공통 PhotoFeed·PhotoModal을 사용하도록 통합했습니다. 키보드 조작과 닫기 후 포커스 복귀는 공통 모달에서 처리합니다."
    ],
    "note": "PhotoSearch는 지도·앨범에서, PhotoModal은 지도·피드·관계 그래프에서 사용합니다. 공통 모달에 Radix Dialog를 적용하고 모바일에서는 메타데이터 영역만 스크롤하도록 조정했습니다. 390px·1280px 배치와 키보드 열기·닫기·포커스 복귀를 확인했습니다."
  },
  {
    "title": "어디서 공유하고,\n언제까지 남길 상태인가.",
    "reason": "화면을 오가면 검색 조건과 목록 위치를 다시 찾아야 했습니다. 여러 화면이 공유할 사진 데이터, 복원할 탐색 조건, 잠깐 열리는 모달을 같은 수명으로 관리하지 않도록 나눴습니다.",
    "steps": [
      "사진·좋아요는 Zustand에 두고 각 화면이 필요한 값만 selector로 구독합니다. 필터 결과는 원본에서 계산하고 중복 저장하지 않습니다.",
      "검색·태그·앨범 조건은 URL에 반영합니다. 검색어 입력은 history replace, 화면 전환은 push로 처리해 입력마다 뒤로가기 기록이 쌓이지 않도록 했습니다.",
      "모달·편집 입력은 local state로 관리합니다. 목록 위치는 별도 hook에 저장해 다른 화면을 다녀온 뒤 같은 탐색 위치로 돌아가도록 했습니다."
    ],
    "note": "지도에서 태그 선택 → 사진 상세·좋아요 → 좋아요 화면 → 뒤로가기로 이전 조건 복원의 흐름을 확인했습니다. URL의 탐색 조건은 새로고침에도 복원하며, 스크롤은 현재 페이지 세션에서만 유지합니다. 복원·좋아요·키보드 조작 등 Chrome 회귀 19개는 로컬 검증 기록입니다."
  }
],
  },
  "Game Information Platform": {
    summary: "여러 상점의 게임 가격을 비교하고 관심 있는 게임을 모아보는 개인 프로젝트입니다. 검색·필터에서 상세 정보 확인과 관심 목록 관리로 이어지는 화면을 구현했습니다. 화면 크기에 맞춘 레이아웃과 모바일 하단 메뉴를 구성하고, 검색 결과가 없거나 가격을 불러오지 못한 상황도 구분해 안내했습니다.",
    role: "개인 프로젝트 · 검색·가격 비교·관심 목록 UI · 반응형 레이아웃 · 모바일 메뉴 · 빈 결과·오류 안내",
    cases: [
      {
        title: "상점마다 달랐던 가격 데이터",
        problem: "상점별로 가격과 상품 링크의 응답 형식이 달랐습니다. 화면이 응답을 직접 처리하면 같은 예외 조건을 여러 곳에 작성해야 했습니다.",
        check: "화면에 필요한 게임명, 이미지, 상점명, 가격, 구매 링크를 먼저 정했습니다. 검색 결과에서 상점별 응답을 해석하지 않고 같은 필드를 읽게 하는 것이 목표였습니다.",
        action: [
          "ITAD로 받은 게임·상점 가격 정보를 공통 TypeScript 모델로 변환했습니다. 검색 화면은 변환된 모델을 사용합니다.",
          "가격 단위와 상점 코드를 정리하고 같은 상점의 중복 항목을 줄였습니다. 표시할 가격이 없을 때도 공통 형태를 반환합니다.",
          "외부 API 요청은 서버에서 실행하고 응답에는 화면에 필요한 정보만 담았습니다.",
        ],
        result: "상점별 응답을 해석하는 코드를 변환 계층에 모았습니다. 검색과 상세 화면은 각 상점의 원본 형식 대신 공통 모델을 사용합니다.",
        note: "상점마다 다른 가격과 구매 링크를 같은 항목으로 정리해 검색·상세 화면에서 비교할 수 있게 했습니다. 같은 상점의 중복 항목과 가격이 없는 경우도 처리합니다. 검사는 가격 변환 결과와 서버용 API 키가 응답에 섞이지 않는지를 확인합니다.",
      },
      {
        title: "외부 API가 실패했을 때의 화면",
        problem: "외부 API의 응답이 늦거나 실패하면 로딩만 남거나 화면이 비었습니다. 기다리는 중인지 다시 시도해야 하는지 구분할 필요가 있었습니다.",
        check: "검색 결과가 없는 경우와 요청 자체가 실패한 경우를 구분했습니다. 같은 검색을 반복할 때의 응답 재사용과, 실패했을 때 사용할 이전 응답도 따로 처리했습니다.",
        action: [
          "검색어, 국가, 상점, 태그 등 검색 조건을 캐시 키에 포함했습니다. 대소문자와 연속 공백은 정리해 같은 조건의 응답을 재사용합니다.",
          "검색 요청에는 5초 제한을 두었습니다. 요청이 실패하면 허용 기간 안에 저장된 이전 응답을 경고 정보와 함께 반환합니다.",
          "화면에서는 불러오는 중, 빈 결과, 요청 실패 안내를 구분합니다. 목록을 추가로 불러오다 실패해도 이미 표시된 항목은 유지합니다.",
        ],
        result: "검색 요청을 계속 기다리지 않도록 제한 시간을 두고, API 실패 시 이전 응답을 반환하는 분기를 만들었습니다. 캐시 재사용과 실패 시 이전 응답 반환은 검색 API 테스트에 포함했습니다.",
        note: "검색이 실패하면 허용 기간 안의 이전 결과를 경고 정보와 함께 반환합니다. 이전 결과도 없을 때는 데모 데이터를 반환하는데, 실제 검색 결과와 구분하는 화면 표시는 보완이 필요합니다. 저장된 응답은 서버를 재시작하면 사라집니다.",
      },
    ],
    implementation: [
  {
    "title": "게임 정보는 공통 카드로,\n액션은 화면에 맞게.",
    "reason": "할인 목록에서는 가격·리뷰를 비교하고 관심 목록에서는 저장한 게임을 관리합니다. 같은 게임 정보의 표시와 화면마다 달라지는 버튼을 분리해 카드 전체를 복제하지 않도록 구성했습니다.",
    "steps": [
      "GameCard는 공통 GameSummary 모델로 제목·이미지·가격을 표시합니다. action 슬롯으로 관심 목록 버튼을 전달하고 compactMeta로 표시할 정보량을 조절합니다.",
      "스토어·태그·최소 할인율·최대 가격·정렬은 이름과 라벨을 가진 폼 입력으로 구성했습니다. 필터를 제출하면 해당 조건으로 할인 목록을 조회합니다."
    ],
    "note": "GameCard는 action: ReactNode와 compactMeta props를 받습니다. 이미지 로딩 실패 시 대체 표시를 제공하고, 사진 URL이 바뀌면 실패 상태를 초기화합니다. 가격 후보는 0보다 큰 값으로 제한해 실제 무료 상품도 제외될 수 있습니다."
  },
  {
    "title": "스크롤에 따라 이어지는 목록,\n실패해도 남는 기존 항목.",
    "reason": "할인 목록을 추가로 불러올 때 기존 항목을 유지하면서 로딩·종료·실패를 구분해야 했습니다. 데이터 병합과 요청 상태는 피드가, 화면 진입 감지는 hook이 담당하도록 나눴습니다.",
    "steps": [
      "IntersectionObserver로 목록 끝에 가까워지면 다음 offset을 요청합니다. 로딩 중이거나 다음 데이터가 없으면 요청을 건너뛰고, observer는 effect 정리 시 해제합니다.",
      "응답은 게임 ID를 기준으로 중복 없이 합칩니다. 추가 요청이 실패하면 기존 카드는 유지하고 경고를 표시하며, 로딩 중·추가 가능·목록 종료 문구를 구분합니다."
    ],
    "note": "DealFeed의 목록·로딩·다음 offset·경고 상태와 useIntersectionLoader의 observer 정리를 코드에서 확인했습니다. 현재 실패 후에는 추가 로딩을 중단합니다. 자동 재시도나 이전 스크롤 위치 복원까지 구현한 것으로 설명하지 않습니다."
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
          <p className="bin-work-lead">화면을 만든 과정부터,<br />동작을 다듬은 이유까지.</p>
          <p>사진 탐색과 게임 가격 비교 서비스를 만들었습니다. 공통 컴포넌트와 상태의 역할을 설계하고, 화면 조작과 로딩 성능을 코드·테스트·측정으로 확인했습니다.</p>
          <a className="bin-work-button" href="#projects">프로젝트 살펴보기 <ArrowDown size={17} /></a>
        </div>
        <div className="bin-work-selected">
          <p>SELECTED WORK · 2025—2026</p>
          <a href="#project-0"><span>01 · 팀 프로젝트 / 프론트엔드</span><h2>PhotoMap</h2><p>사진을 장소와 시간으로 탐색하는 화면.<br />공통 UI·탐색 상태를 설계하고 로딩을 개선한 과정.</p><ArrowUpRight size={28} /></a>
          <a href="#project-1"><span>02 · 개인 프로젝트</span><h2>GameInfo</h2><p>여러 상점의 게임 가격을 비교하는 서비스.<br />공통 카드·무한 스크롤과 API 응답을 연결한 과정.</p><ArrowUpRight size={28} /></a>
        </div>
        <nav className="bin-work-hero-index" aria-label="포트폴리오 읽기 안내"><span>서비스 소개 · 아키텍처 · 구현 과정 · 문제 해결 · 검증</span><a href="#projects">스크롤해서 한 장씩 읽기 <ArrowDown size={14} /></a></nav>
      </header>
      <div className="bin-work-projects" id="projects"><div className="bin-work-container">
        {data.projects.map((project, index) => <ProjectPresentation key={project.title} project={project} index={index} notes={projectNotes[project.title]} />)}
      </div></div>
      <section className="bin-work-method bin-work-container" aria-labelledby="method-title">
        <div><p className="bin-work-eyebrow">개발 과정</p><h2 id="method-title">AI에 맡긴 작업과<br />직접 확인한 기준</h2></div>
        <div>
          <p>AI는 병목 원인 후보를 정리하고 측정 스크립트와 테스트 초안을 작성하는 데 사용했습니다. 제안은 코드와 실행 결과를 확인한 뒤 반영했습니다.</p>
          <p>PhotoMap에서는 이미지 완료 시점과 측정 기록이 어긋난 실행을 발견해 수집 기준을 고치고 다시 측정했습니다. Game Information Platform에서는 가격 판단 조건과 API 실패 상황을 테스트로 확인했습니다.</p>
        </div>
      </section>
      <section className="bin-work-activities bin-work-container" aria-labelledby="activities-title">
        <p className="bin-work-eyebrow">발표와 연구</p><h2 id="activities-title">프로젝트 외 활동</h2>
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
