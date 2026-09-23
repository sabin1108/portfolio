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
    summary: "여러 상점의 게임 가격을 비교하는 Next.js 개인 프로젝트입니다. 카드와 액션의 memo 경계, 검색 후보 캐시, 서버 스트리밍을 적용해 목록 렌더링과 검색의 반복 작업을 줄였습니다.",
    role: "개인 프로젝트 · Next.js/React · 할인 피드 성능 개선 · 검색 조건 URL 상태 · 서버 스트리밍 · 이미지 우선순위",
    cases: [
      {
        title: "카드 렌더 호출을 약 67% 줄였습니다",
        metric: { label: "할인 피드 카드 렌더 호출", value: "6회 → 2회", change: "약 67% 감소" },
        problem: "추가 로딩과 재시도 중 가격이 바뀌지 않은 기존 카드까지 다시 호출됐습니다. 부모가 매번 만드는 관심 목록 액션 JSX의 참조가 달라, 카드에 memo만 적용해도 반복 호출이 남았습니다.",
        check: "고정 데이터로 실패 → 재시도 → 추가 로딩 흐름을 재현하고, GameCard 호출 수가 기존 카드와 새 카드에서 어떻게 누적되는지 비교했습니다.",
        action: [
          "FeedGameCard 안에서 게임 카드와 관심 목록 액션을 함께 생성하도록 memo 경계를 옮겼습니다.",
          "목록을 병합할 때 기존 게임 객체의 참조를 유지해, 변경된 데이터와 새 카드만 갱신하도록 했습니다.",
        ],
        result: "할인 피드 실패·재시도·추가 로딩 실험에서 누적 카드 호출이 6회 → 2회로 줄었습니다. 기존 카드의 반복 호출은 4회 → 0회로 사라졌습니다.",
        note: "Vitest/jsdom에서 실제 DealFeed를 렌더하고 mock GameCard 호출을 계수했습니다. 고정 데이터의 실패·재시도·추가 로딩 흐름에서 누적 호출 6회 → 2회, 기존 카드의 추가 호출 4회 → 0회를 확인했습니다.",
      },
      {
        title: "동시 요청 4건을 후보 조회 1회로 묶었습니다",
        metric: { label: "동일 제목의 동시 요청", value: "4건 → 조회 1회", change: "중복 후보 조회 통합" },
        problem: "같은 게임 제목으로 필터 조건 요청이 동시에 들어오면 제목 후보 조회가 반복될 수 있었습니다. 같은 후보를 기다리는 요청끼리는 결과를 공유하는 편이 효율적이었습니다.",
        check: "동일 제목에 서로 다른 필터 조건을 동시에 전달하고, 제목 후보 조회 함수가 실행된 횟수를 확인했습니다.",
        action: [
          "정규화한 제목을 기준으로 후보 캐시를 두고, 진행 중인 동일 제목 조회 Promise를 함께 사용하도록 분리했습니다.",
          "태그·스토어·가격 조건은 가져온 후보에 적용해, 필터가 달라져도 제목 후보를 재사용하도록 했습니다.",
        ],
        result: "동일 제목의 동시 필터 요청 4건이 후보 조회 1회를 공유합니다. 이후 필터 변경에서도 저장된 후보를 재사용합니다.",
        note: "search-behavior.test.ts에서 동일 제목의 동시 필터 요청 4건이 제목 후보 조회 1회를 공유하는지 확인했습니다. 캐시가 유지되는 동안 추가 필터 변경에도 후보를 재사용합니다.",
      },
    ],
    implementation: [
  {
    "title": "공통 카드 경계를 고정하고,\n첫 화면 이미지를 먼저 보이게.",
    "reason": "게임 정보와 화면별 액션을 공통 카드로 조합하고, 피드에서는 바뀌지 않은 카드의 재호출을 줄였습니다. 이미지도 첫 화면에서 필요한 표지부터 요청하도록 나눴습니다.",
    "steps": [
      "공통 GameCard는 게임 정보를 표시하고, FeedGameCard는 카드와 관심 목록 액션을 같은 memo 경계 안에서 생성합니다.",
      "game.id를 key로 사용해 기존 카드의 identity를 유지했습니다. 첫 표지 이미지는 eager/high priority, 후속 이미지는 lazy로 나눴습니다."
    ],
    "note": "FeedGameCard의 얕은 비교로 변경된 가격·인증·액션 정보를 갱신합니다. 첫 표지는 eager/high priority, 나머지는 lazy로 요청합니다."
  },
  {
    "title": "검색 조건은 URL로,\n결과 갱신은 서버 경계로.",
    "reason": "검색 조건을 먼저 제공하고, 가격·태그 조회 결과는 준비되는 대로 표시합니다. 입력 중에는 결과 목록의 React state를 갱신하지 않도록 분리했습니다.",
    "steps": [
      "SearchControls는 uncontrolled GET form과 URL query를 사용해 입력 상태를 결과 목록 React state에서 분리했습니다.",
      "홈 화면과 검색 결과는 서버 Suspense/스트리밍 경계로 나눠 조건 UI와 결과 영역이 각각 준비되는 흐름을 만들었습니다.",
      "동일 제목 후보 조회는 캐시와 진행 중 요청 공유로 묶어, 동시 조건 요청 4건에서도 제목 후보 조회 1회를 사용했습니다."
    ],
    "note": "공급자 응답을 보류해도 홈 소개·탐색을 먼저 전송하고, 인사이트를 기다리지 않고 할인 목록을 제공하는 순서를 검증했습니다. 검색도 조건 폼과 결과 영역을 별도 서버 경계로 구성했습니다."
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
          <a href="#project-1"><span>02 · 개인 프로젝트</span><h2>GameInfo</h2><p>카드 렌더 호출 약 67% 감소.<br />동시 요청 4건을 후보 조회 1회로 통합.</p><ArrowUpRight size={28} /></a>
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
          <p>PhotoMap에서는 이미지 완료 시점과 측정 기록이 어긋난 실행을 발견해 수집 기준을 고치고 다시 측정했습니다. Game Information Platform에서는 카드 렌더 호출과 동일 제목 후보 조회가 줄었는지 고정 데이터 테스트로 확인했습니다.</p>
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
