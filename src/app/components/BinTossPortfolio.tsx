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
    summary: "사진을 장소와 시간에 따라 찾아보는 서비스입니다. 지도에서 사진을 찾고 상세 확인·좋아요 등록 후 이전 탐색으로 돌아오는 흐름을 구현했습니다. 지도·앨범·타임라인에서 같은 사진을 다루도록 UI와 상태를 연결했습니다.",
    role: "3인 팀(FE·BE·Unity 각 1명) · 프론트엔드 담당 · 사진 탐색 UI · Mapbox 연동 · 공통 컴포넌트 · 반응형",
    cases: [
      {
        title: "작은 사진 카드에 큰 이미지가 필요할까",
        metric: { label: "사진 16장 · 이미지 응답 본문", value: "4.22MB → 237KB", change: "94.4% 감소 · 동일 사진 비교" },
        problem: "목록에서는 사진을 작은 카드로 보여주지만, 상세 화면에서는 크게 볼 수 있어야 했습니다. 두 화면에 같은 큰 이미지를 쓰면 목록에서도 필요 이상의 데이터를 내려받게 됩니다.",
        check: "같은 사진 16장을 큰 이미지로 전달하는 조건을 재현해 썸네일 방식과 비교했습니다. 배포 버전·사진 순서·요청 정책을 고정하고 이미지 크기와 품질만 바꿔, 파일 선택에 따른 차이를 확인했습니다.",
        action: [
          "목록에는 썸네일을, 상세 화면에는 큰 이미지를 요청합니다. 화면마다 주소 선택 코드가 흩어지지 않도록 한곳에서 처리했습니다.",
          "첫 줄은 바로 불러오고 나머지는 화면에 가까워질 때 요청합니다. 첫 사진에만 높은 우선순위를 줬으며, 비교 실험에서는 이 정책을 같게 유지했습니다.",
        ],
        result: "동일 Vercel 배포에서 큰 이미지와 썸네일을 각각 5회 비교했습니다. 사진 16장의 응답 본문 합계가 4.22MB에서 237KB로 줄었습니다.",
        note: "2026-10-03 · 같은 사진 16장·같은 배포·조건별 5회. 큰 display WebP와 작은 thumb WebP를 비교했습니다. 390×844/DPR 2, 다운로드 1.6Mbps·지연 150ms·CPU 4배 감속 조건입니다. 94.4%는 사진 응답 본문 감소율이며, 과거 운영 배포나 서비스 전체 트래픽과의 비교는 아닙니다.",
      },
      {
        title: "화면 밖 사진까지 렌더링하던 목록",
        metric: { label: "합성 항목 3,000개 · 최대 렌더링 카드", value: "3,000개 → 57개", change: "행 단위 가상화 · 모바일 크기 PC" },
        problem: "사진 목록을 한꺼번에 렌더링하면 사용자가 보지 않는 카드까지 DOM에 남습니다. 사진이 늘수록 화면 밖에서 처리하는 항목도 많아졌습니다.",
        check: "같은 빌드에서 전체 렌더링과 가상화를 비교했습니다. 이미지 다운로드 영향을 줄이려고 동일 SVG를 반복한 합성 항목을 사용하고, 목록 크기와 화면 크기를 나눠 카드 수를 관찰했습니다.",
        action: [
          "사진 목록을 행 단위로 가상화해 보이는 구간과 주변 행만 렌더링합니다. 화면 너비에 따라 열 수가 달라져도 행 단위로 표시 범위를 계산합니다.",
          "필터 결과와 열 배치 계산은 useMemo로 재사용하고, 사진 ID로 카드를 구분했습니다. 카드 수 비교에서는 이 조건을 유지한 채 가상화만 켜고 껐습니다.",
        ],
        result: "모바일 크기 PC 화면에서 3,000개 합성 항목을 비교했을 때 최대 렌더링 카드는 57개였습니다. 같은 화면의 1,000개 항목 실험에서도 최대 57개를 유지했습니다.",
        note: "2026-10-04 · 동일 로컬 빌드·SVG URL 1개 반복. 1,000/3,000개 항목과 가상화 유무를 화면별로 3회씩 비교했습니다. 최대 카드는 390×844/DPR 2에서 57개, 1440×900/DPR 1에서 136개였습니다. 카드 수 관찰 결과이며 실제 스마트폰 속도나 FPS를 측정한 값은 아닙니다.",
      },
    ],
    implementation: [
  {
    "title": "검색창과 사진 상세 UI를\n여러 화면에서 함께 씁니다.",
    "reason": "지도·앨범의 검색창과 좋아요 화면의 피드·모달이 각각 구현돼 있었습니다. 장소 검색과 앨범 필터는 규칙이 달랐습니다. 입력·초기화와 상세 표시는 공유하고 검색 조건·액션은 화면에 남겼습니다.",
    "steps": [
      "검색창은 value/onChange 기반 제어 컴포넌트로 통합했습니다. 입력·초기화 UI는 공유하고 장소 검색과 앨범 필터링은 각 화면에서 처리합니다.",
      "PhotoModal을 이미지·메타데이터·액션 영역으로 나누고 Context로 선택 사진을 공유했습니다. 지도·피드·관계 그래프는 필요한 액션을 조합합니다.",
      "좋아요 화면도 공통 PhotoFeed·PhotoModal을 사용하도록 통합했습니다. 키보드 조작과 닫기 후 포커스 복귀는 공통 모달에서 처리합니다."
    ],
    "note": "PhotoSearch는 지도·앨범에서, PhotoModal은 지도·피드·관계 그래프에서 사용합니다. 공통 모달에 Radix Dialog를 적용하고 모바일에서는 메타데이터 영역만 스크롤하도록 조정했습니다. 390px·1280px 배치와 키보드 열기·닫기·포커스 복귀를 확인했습니다."
  },
  {
    "title": "다시 찾을 탐색 조건은\nURL에 남겼습니다.",
    "reason": "사진에 좋아요를 누르고 다른 화면을 다녀와도 이전 탐색을 이어갈 수 있어야 했습니다. 공유할 사진 데이터, 다시 방문할 검색 조건, 닫으면 끝나는 모달을 나눠 저장 위치를 정했습니다.",
    "steps": [
      "사진·좋아요는 Zustand에 두고 각 화면이 필요한 값만 selector로 구독합니다. 필터 결과는 원본에서 계산하고 중복 저장하지 않습니다.",
      "검색·태그·앨범 조건은 URL에 반영합니다. 검색어 입력은 history replace, 화면 전환은 push로 처리해 입력마다 뒤로가기 기록이 쌓이지 않도록 했습니다.",
      "모달·편집 입력은 local state로 관리합니다. 목록 위치는 별도 hook에 저장해 다른 화면을 다녀온 뒤 같은 탐색 위치로 돌아가도록 했습니다."
    ],
    "note": "지도에서 태그 선택, 사진 상세·좋아요, 좋아요 화면 이동 후 뒤로가기로 이전 조건을 복원하는 흐름을 로컬 Chrome에서 확인했습니다. URL의 탐색 조건은 새로고침에도 복원하며, 목록 위치는 현재 페이지 세션에서만 유지합니다."
  }
],
  },
  "Game Information Platform": {
    summary: "게임을 검색하고 상점별 가격을 비교한 뒤 관심 목록에 저장하는 Next.js 개인 프로젝트입니다. 추가 로딩을 재시도할 때 기존 카드가 다시 호출되던 문제를 고쳤습니다. 필터가 다른 검색 요청도 같은 제목의 후보를 공유하도록 했습니다.",
    role: "개인 프로젝트 · 검색·가격 비교·관심 목록 UI · API 연동 · 렌더링 경계·검색 캐시 설계 · 테스트",
    cases: [
      {
        title: "재시도할 때 기존 카드까지 갱신되던 문제",
        metric: { label: "고정 시나리오 · mock 카드 호출", value: "6회 → 2회", change: "호출 수 약 67% 감소" },
        problem: "추가 로딩과 재시도 중 가격이 바뀌지 않은 기존 카드까지 다시 호출됐습니다. 부모가 매번 만드는 관심 목록 액션 JSX의 참조가 달라, 카드에 memo만 적용해도 반복 호출이 남았습니다.",
        check: "고정 데이터로 실패·재시도·추가 로딩을 재현하고 기존 카드와 새 카드의 호출을 나눠 셌습니다. 데이터가 같아도 액션의 참조가 바뀌면 memo가 카드 호출을 건너뛰지 못했습니다.",
        action: [
          "부모에서 매번 만들던 관심 목록 액션을 FeedGameCard 안으로 옮겨, 카드와 액션을 함께 memo로 감쌌습니다.",
          "목록을 병합할 때 기존 게임 객체의 참조를 유지해 변경된 데이터와 새 카드만 갱신하도록 했습니다.",
        ],
        result: "할인 피드 실패·재시도·추가 로딩 실험에서 누적 카드 호출이 6회 → 2회로 줄었습니다. 기존 카드의 반복 호출은 4회 → 0회로 사라졌습니다.",
        note: "Vitest/jsdom에서 실제 DealFeed와 mock GameCard로 실패·재시도·추가 로딩을 재현했습니다. 누적 호출 6회 → 2회, 기존 카드의 추가 호출 4회 → 0회를 확인했습니다.",
      },
      {
        title: "필터가 달라도 같은 제목 후보를 공유하도록",
        metric: { label: "동일 제목 · 동시 필터 요청 4건", value: "후보 조회 1회 공유", change: "진행 중 조회를 함께 기다림" },
        problem: "같은 게임 제목으로 필터 조건 요청이 동시에 들어오면 제목 후보 조회가 반복될 수 있었습니다. 같은 후보를 기다리는 요청끼리는 결과를 공유하는 편이 효율적이었습니다.",
        check: "필터가 달라도 먼저 가져올 제목 후보는 같았습니다. 제목 후보 조회와 필터 적용을 나누고, 같은 제목의 동시 요청이 후보 조회를 몇 번 실행하는지 확인했습니다.",
        action: [
          "정규화한 제목을 기준으로 후보 캐시를 두고, 진행 중인 동일 제목 조회 Promise를 함께 사용하도록 분리했습니다.",
          "태그·스토어·가격 조건은 가져온 후보에 적용해, 필터가 달라져도 제목 후보를 재사용하도록 했습니다.",
        ],
        result: "모의 공급자 테스트에서 동일 제목의 동시 필터 요청 4건이 후보 조회 1회를 공유했습니다. 캐시가 유지되는 동안 이후 필터 변경에도 후보를 재사용합니다.",
        note: "모의 공급자 테스트에서 동일 제목의 동시 필터 요청 4건이 후보 조회 1회를 공유하는지 확인했습니다. 측정 대상은 제목 후보 조회 함수이며 전체 HTTP 요청 수가 아닙니다. 캐시가 유지되는 동안 추가 필터 변경에도 후보를 재사용합니다.",
      },
    ],
    implementation: [
  {
    "title": "카드 데이터와 액션을\n같은 컴포넌트에서 다룹니다.",
    "reason": "게임 정보와 화면별 액션을 공통 카드로 조합했습니다. 피드에서는 바뀌지 않은 카드의 재호출을 줄이고 첫 화면에 필요한 표지부터 요청하도록 했습니다.",
    "steps": [
      "공통 GameCard는 게임 정보를 표시하고, FeedGameCard는 카드와 관심 목록 액션을 같은 memo 경계 안에서 생성합니다.",
      "game.id를 key로 사용해 기존 카드의 identity를 유지했습니다. 첫 표지 이미지는 eager/high priority, 후속 이미지는 lazy로 나눴습니다."
    ],
    "note": "가격 변환과 API 실패 처리는 단위 테스트로 확인합니다. 주요 화면은 Playwright smoke로 검사하고 GitHub Actions에서 타입 검사·린트·테스트·production build·smoke를 실행합니다. 모의 응답 테스트와 실제 외부 API의 운영 상태는 구분했습니다."
  },
  {
    "title": "검색 결과를 기다리는 동안에도\n조건을 입력할 수 있습니다.",
    "reason": "검색 조건을 먼저 제공하고 가격·태그 조회 결과는 준비되는 대로 표시합니다. 입력 중에는 결과 목록의 React state를 갱신하지 않도록 분리했습니다.",
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
          <p className="bin-work-lead">사진 탐색과 게임 가격 비교.<br />직접 만든 화면을 소개합니다.</p>
          <p>사진 탐색과 게임 가격 비교 서비스를 만들었습니다. 공통 컴포넌트와 상태의 역할을 설계하고, 화면 조작과 로딩 성능을 코드·테스트·측정으로 확인했습니다.</p>
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
