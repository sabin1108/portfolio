import { ArrowDown, ArrowUpRight, Github } from "lucide-react";
import { frontendPortfolio } from "../data/main";
import "../../styles/bin-portfolio.css";

const projectNotes: Record<string, {
  summary: string;
  role: string;
  cases: { title: string; problem: string; check: string; action: string[]; result: string; note?: string }[];
  implementation: { title: string; reason: string; steps: string[]; note: string }[];
}> = {
  PhotoMap: {
    summary: "사진을 지도와 시간순으로 찾아보는 서비스입니다. 지도·앨범·타임라인 화면을 구현하고 이미지 로딩과 사진 목록의 렌더링을 개선했습니다.",
    role: "3인 팀의 프론트엔드 담당 · 사진 탐색 화면 · 지도 연동 · 이미지와 목록 렌더링 개선",
    cases: [
      {
        title: "작은 사진 카드에 원본을 불러오던 문제",
        problem: "모바일에서 화면이 열린 뒤에도 첫 사진을 기다려야 했습니다. 네트워크 요청을 확인하니 작은 카드에도 원본 이미지를 내려받고 있었습니다.",
        check: "화면이 열리는 시간과 사진이 보이는 시간을 따로 확인했습니다. 첫 사진뿐 아니라 다른 원본 요청도 함께 진행되고 있어, 파일 크기와 요청 순서를 함께 바꿔야 했습니다.",
        action: [
          "목록에는 작은 이미지를, 상세 화면에는 큰 이미지를 요청하도록 이미지 주소 선택을 한곳에 모았습니다.",
          "첫 줄은 바로 불러오고 나머지는 화면에 가까워질 때 요청합니다. 높은 요청 우선순위는 첫 사진에만 지정했습니다.",
          "작은 이미지가 없는 기존 사진은 원본 주소를 사용하도록 처리했습니다.",
        ],
        result: "고정 모바일 4G 환경에서 캐시를 비우고 최적화 버전을 100회 측정해 첫 사진 표시 p95 약 2.6초를 기록했습니다. 실제 사용자 통계가 아닌 합성 실험 결과입니다.",
        note: "측정 조건: 390×844 화면, 다운로드 1.6Mbps, 왕복 지연 150ms, CPU 4배 감속. p95는 측정값을 빠른 순서로 정렬했을 때 95% 지점의 값입니다. 이미지 선택과 로딩 우선순위는 imageUrl.ts에서 확인할 수 있습니다.",
      },
      {
        title: "사진이 많아질수록 무거워진 목록",
        problem: "사진이 늘어나면 화면 밖의 항목까지 처리하면서 스크롤이 끊겼습니다. 목록의 렌더링 범위와 상태 변경 시 다시 실행되는 작업을 확인했습니다.",
        check: "화면에 그리는 항목 수와 필터 계산을 나눠 살펴봤습니다. 항목을 적게 그리는 것과 같은 조건의 계산을 반복하지 않는 것은 다른 작업이라 각각 처리했습니다.",
        action: [
          "사진 목록을 행 단위로 가상화했습니다. 현재 보이는 구간 주변도 미리 그려 스크롤할 때 다음 사진을 준비합니다.",
          "사진 목록이나 선택한 분류가 바뀔 때만 필터를 다시 계산하도록 useMemo를 적용했습니다.",
          "Zustand selector로 필요한 상태만 구독하고 useShallow로 선택한 값들을 얕게 비교합니다. 목록의 개별 항목은 사진 ID를 key로 사용합니다.",
        ],
        result: "전체 사진을 한꺼번에 그리던 목록을 보이는 구간 중심으로 바꿨습니다. 관련 없는 상태 변경이 목록 전체의 작업으로 이어지는 범위를 줄였습니다.",
        note: "PhotoFeed.tsx에서 가상화, 필터 계산, 상태 구독을 확인할 수 있습니다. 가상화는 화면에 그리는 항목을 제한하는 방식이지, 이미 메모리에 불러온 사진 데이터까지 제거하는 방식은 아닙니다.",
      },
    ],
    implementation: [
      {
        title: "그래프 좌표와 React 상태를 따로 갱신",
        reason: "D3는 사진 사이의 위치를 계산하면서 좌표를 계속 바꿉니다. 이 좌표를 매번 React 상태에 넣지 않도록 갱신 방식을 나눴습니다.",
        steps: [
          "React는 노드와 연결선 구성을 관리하고, D3의 반복 계산에서는 CSS 좌표와 SVG 선 위치만 직접 바꿉니다.",
          "사진이나 선택 조건이 바뀌어 계산을 다시 시작할 때는 기존 시뮬레이션을 중지합니다. 화면을 벗어날 때도 같은 정리 작업을 수행합니다.",
        ],
        note: "useForceSimulation.ts · 자주 바뀌는 좌표를 React 상태 갱신과 분리했습니다. React가 관리하는 화면 구성과 D3가 수정하는 위치 속성을 구분해 유지해야 합니다.",
      },
      {
        title: "지도가 준비된 뒤 사진 선택 전달",
        reason: "React 화면과 iframe 안의 지도는 준비되는 시점이 다릅니다. 지도가 아직 준비되지 않았을 때 사진을 선택해도 요청이 사라지지 않도록 처리했습니다.",
        steps: [
          "지도 준비 메시지가 오기 전에는 사진 정보와 선택 요청을 ref에 보관하고, 준비가 끝나면 postMessage로 전달합니다.",
          "지도에서 선택한 사진은 React의 선택 상태에 반영합니다. 메시지는 해당 iframe에서 왔는지 확인하고, 화면을 벗어날 때 수신 이벤트를 해제합니다.",
        ],
        note: "Map2DView.tsx · 지도 준비 상태, 사진 정보 갱신, 사진 선택 요청을 각각 처리합니다.",
      },
    ],
  },
  "Game Information Platform": {
    summary: "여러 상점의 게임 가격을 검색하고 관심 목록을 관리하는 개인 프로젝트입니다. 상점별 응답을 화면에 맞게 변환하고 가격 결측과 API 실패를 처리했습니다.",
    role: "Next.js 화면 · 외부 API 연동 · 가격 판단 규칙 · Supabase 관심 목록 · 테스트",
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
        note: "itad-normalizers.ts · 검색 API 테스트에는 가격 변환 결과와 응답에 API 키가 포함되지 않는지 확인하는 항목이 있습니다.",
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
        note: "search.ts · 현재 검색 구현은 이전 응답도 없으면 데모 데이터를 반환합니다. 실제 검색 결과와 혼동하지 않도록 데모 데이터임을 화면에 명확히 표시하는 부분은 보완할 점입니다. 캐시는 서버 메모리에 있어 재시작하면 유지되지 않습니다.",
      },
    ],
    implementation: [
      {
        title: "가격이 없는 상품의 처리 기준",
        reason: "가격을 알 수 없는 상품이 최저가나 목표가 달성으로 판단되지 않도록 가격 후보를 고르는 조건을 분리했습니다.",
        steps: [
          "현재 가격 변환에서는 0보다 큰 금액만 가격 후보로 남깁니다. 남은 후보가 없으면 가격을 알 수 없는 항목으로 처리합니다.",
          "정상 가격 변환과 0원 항목 제외를 테스트로 확인합니다. 이미지가 없을 때 Steam 상품 이미지로 대체하는 경우도 포함했습니다.",
        ],
        note: "현재 규칙은 실제 무료 상품도 제외할 수 있습니다. 무료 상품과 가격 결측을 별도로 구분하는 것은 남은 개선 항목입니다.",
      },
      {
        title: "테스트에서 확인한 예외 조건",
        reason: "외부 API는 실행할 때마다 같은 결과를 주지 않습니다. 반환값을 정한 테스트로 정상 상황과 실패 상황을 반복 확인했습니다.",
        steps: [
          "같은 검색 조건의 캐시 재사용, API 실패 시 이전 응답 반환, 호출 한도 초과 시 429 응답과 재시도 시간을 확인합니다.",
          "상품 가격 변환과 관심 목록 입력처럼 조건이 바뀌는 부분을 별도 테스트로 남겼습니다. 화면 동작은 Playwright 테스트로 구분했습니다.",
        ],
        note: "주요 리팩터링 시점에 Vitest 60개 테스트 통과를 확인했습니다. 테스트 수는 당시 기록이며, 모든 화면과 장애 상황을 검증했다는 의미는 아닙니다.",
      },
    ],
  },
};

function ProjectSection({ project, index }: {
  project: typeof frontendPortfolio.projects[number]; index: number;
}) {
  const notes = projectNotes[project.title];
  if (!notes) return null;
  return (
    <section className="bin-work-project" id={`project-${index}`} aria-labelledby={`project-title-${index}`}>
      <div className="bin-work-project-heading">
        <div><p className="bin-work-eyebrow">PROJECT {String(index + 1).padStart(2, "0")}</p><h2 id={`project-title-${index}`}>{project.title}</h2></div>
        <div>
          <p>{notes.summary}</p>
          <p className="bin-work-role"><strong>담당</strong> {notes.role}</p>
          <div className="bin-work-links">
            <a href={project.links.github} target="_blank" rel="noreferrer"><Github size={16} /> 소스 코드</a>
            {project.links.live && <a href={project.links.live} target="_blank" rel="noreferrer">서비스 열기 <ArrowUpRight size={16} /></a>}
          </div>
        </div>
      </div>
      <div className="bin-work-gallery">
        <figure className="bin-work-main-image"><img src={project.imageGallery.main.src} alt={project.imageGallery.main.alt} loading="lazy" /><figcaption>{project.imageGallery.main.alt}</figcaption></figure>
        <div className="bin-work-thumbnails">{project.imageGallery.supporting.map((item) => (
          <figure key={item.src}><img src={item.src} alt={item.alt} loading="lazy" /><figcaption>{item.alt}</figcaption></figure>
        ))}</div>
      </div>
      <div className="bin-work-case-heading"><h3>개발 중 해결한 문제</h3><p>문제를 확인한 과정과 실제로 바꾼 부분입니다.</p></div>
      <div className="bin-work-cases">{notes.cases.map((item, i) => (
        <article className="bin-work-case" key={item.title}>
          <h4><span>{String(i + 1).padStart(2, "0")}</span>{item.title}</h4>
          <div><h5>문제</h5><p>{item.problem}</p></div>
          <div><h5>확인과 판단</h5><p>{item.check}</p></div>
          <div><h5>변경한 부분</h5><ul>{item.action.map(step => <li key={step}>{step}</li>)}</ul></div>
          <div><h5>결과</h5><p>{item.result}</p></div>
          <div className="bin-work-case-note">{item.note && <details><summary>확인한 코드와 남은 한계</summary><p>{item.note}</p></details>}</div>
        </article>
      ))}</div>
      <div className="bin-work-case-heading"><h3>함께 구현한 부분</h3><p>이력서에서 짧게 다룬 내용을 덧붙였습니다.</p></div>
      <div className="bin-work-implementation">{notes.implementation.map(item => (
        <article key={item.title}>
          <h4>{item.title}</h4>
          <p>{item.reason}</p>
          <ul>{item.steps.map(step => <li key={step}>{step}</li>)}</ul>
          <p className="bin-work-implementation-note">{item.note}</p>
        </article>
      ))}</div>
    </section>
  );
}

export function BinTossPortfolio() {
  const data = frontendPortfolio;
  return (
    <main className="bin-work" id="top">
      <nav className="bin-work-nav" aria-label="포트폴리오 메뉴">
        <a className="bin-work-name" href="#top">{data.profile.name}</a>
        <div><a href="#projects">프로젝트</a><a href="#profile">소개</a><a href="/resume/bin_resume">이력서 <ArrowUpRight size={14} /></a></div>
      </nav>
      <header className="bin-work-hero bin-work-container">
        <div>
          <h1>{data.profile.name}<span>프론트엔드 개발자</span></h1>
          <p className="bin-work-lead">사진을 탐색하는 화면과<br className="bin-work-desktop-break" /> 게임 가격을 비교하는 서비스를 만들었습니다.</p>
          <p>React와 Next.js를 사용합니다. 이미지 로딩, 목록 렌더링, 외부 API 오류를 다루며 바꾼 내용과 검증 결과를 정리했습니다.</p>
          <a className="bin-work-button" href="#projects">프로젝트 보기 <ArrowDown size={17} /></a>
        </div>
        <a className="bin-work-hero-preview" href="#project-0" aria-label="PhotoMap 프로젝트 보기">
          <img src={data.projects[0].imageGallery.main.src} alt={data.projects[0].imageGallery.main.alt} fetchPriority="high" />
          <span><strong>PhotoMap</strong>지도에서 사진 찾기 <ArrowUpRight size={18} /></span>
        </a>
      </header>
      <div className="bin-work-projects" id="projects"><div className="bin-work-container">
        {data.projects.map((project, index) => <ProjectSection key={project.title} project={project} index={index} />)}
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
