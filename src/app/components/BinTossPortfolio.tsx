import { ProjectPresentation } from "./ProjectPresentation";
import { useEffect } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
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
        note: "사진 목록에서는 작은 이미지를 먼저 보여주고, 상세 화면을 열 때 큰 이미지를 요청합니다. 첫 사진이 보이는 시점을 390×844 화면·느린 4G·CPU 4배 감속 조건에서 측정했습니다. p95 약 2.6초는 100회 측정 중 95% 지점의 값입니다.",
      },
      {
        title: "사진이 많은 목록에서 선택 반응 개선",
        problem: "사진 목록의 모든 항목을 한꺼번에 렌더링하면 화면 밖 카드까지 처리해야 했습니다. 초기 이미지 로딩 이후, 목록을 탐색하고 사진을 선택할 때의 반응을 별도로 확인했습니다.",
        check: "같은 카드·상태 관리·이미지 정책을 유지하고 가상화 유무만 바꿨습니다. 스크롤 직후 클릭부터 올바른 모달 이미지가 준비될 때까지를 비교해, 렌더링 범위의 영향을 확인했습니다.",
        action: [
          "사진 목록을 행 단위로 가상화했습니다. 현재 보이는 구간 주변도 미리 그려 스크롤할 때 다음 사진을 준비합니다.",
          "사진 목록이나 선택한 분류가 바뀔 때만 표시할 사진을 다시 고릅니다. 같은 조건에서는 이전 계산 결과를 재사용합니다.",
          "목록에 필요한 상태만 읽고, 선택한 값이 달라졌는지 비교해 다시 처리할 범위를 줄였습니다. 사진 ID로 항목을 구분해 같은 사진의 화면을 유지합니다.",
        ],
        result: "배포 환경에서 동일 SVG를 사용하는 합성 항목 1,000개·모바일 화면 조건으로 30쌍 비교했습니다. 클릭부터 모달 이미지 준비까지 지연 중앙값을 59.6ms에서 13.2ms로 줄였습니다.",
        note: "별도 배포 환경의 목록 단독 실험입니다. 동일 SVG·합성 항목 1,000개·390×844(DPR 2) 조건에서 A/B 각 30회 비교했습니다. 30쌍 모두 가상화의 모달 준비 지연이 짧았습니다.",
      },
    ],
    implementation: [
      {
        title: "사진 사이의 관계를 움직이는 그래프로 보여주기",
        reason: "사진을 노드와 연결선으로 보여주는 관계 그래프를 구현했습니다. 사진들이 자리를 잡는 동안 위치가 계속 바뀌기 때문에, 움직일 때마다 화면 구성 전체를 다시 계산하지 않도록 했습니다.",
        steps: [
          "React는 노드와 연결선 구성을 관리하고, D3의 반복 계산에서는 CSS 좌표와 SVG 선 위치만 직접 바꿉니다.",
          "사진이나 선택 조건이 바뀌어 계산을 다시 시작할 때는 기존 시뮬레이션을 중지합니다. 화면을 벗어날 때도 같은 정리 작업을 수행합니다.",
        ],
        note: "선택 조건이 바뀌면 그래프에 보여줄 사진과 연결선을 다시 구성합니다. 움직이는 동안에는 위치만 갱신하고, 다른 화면으로 이동하면 계산을 멈춥니다. 이전 그래프의 계산이 새 화면에서도 계속 실행되지 않도록 정리했습니다.",
      },
      {
        title: "Context API에서 Zustand로 구독 범위를 바꾸기",
        reason: "Context API로 공유 상태를 관리하던 중 불필요한 화면 갱신을 줄이기 위해 Zustand로 전환했습니다. 화면마다 필요한 상태와 갱신 조건이 달라, 구독 범위를 나누는 것이 중요했습니다.",
        steps: [
          "각 화면이 필요한 상태만 selector로 구독하도록 바꾸고, 함께 읽는 값에는 useShallow를 적용했습니다.",
          "사진 목록의 필터 계산은 useMemo로 재사용하고, 상태 구독 범위와 화면에 그리는 카드 수는 서로 다른 문제로 구분해 처리했습니다.",
        ],
        note: "라이브러리 교체 자체보다 어떤 상태 변경이 어느 화면을 갱신해야 하는지를 기준으로 구독 범위를 정리했습니다. Context API의 일반적인 성능 한계라고 단정하지 않으며, 가상화 A/B에서는 두 모드의 상태 관리 방식을 동일하게 유지했습니다.",
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
        title: "가격이 없는 상품의 처리 기준",
        reason: "가격을 알 수 없는 상품이 최저가나 목표가 달성으로 판단되지 않도록 가격 후보를 고르는 조건을 분리했습니다.",
        steps: [
          "현재 가격 변환에서는 0보다 큰 금액만 가격 후보로 남깁니다. 남은 후보가 없으면 가격을 알 수 없는 항목으로 처리합니다.",
          "정상 가격 변환과 0원 항목 제외를 테스트로 확인합니다. 이미지가 없을 때 Steam 상품 이미지로 대체하는 경우도 포함했습니다.",
        ],
        note: "현재 규칙은 실제 무료 상품도 제외할 수 있습니다. 무료 상품과 가격 결측을 별도로 구분하는 것은 남은 개선 항목입니다.",
      },
      {
        title: "검색이 실패하면 어떤 응답을 돌려줄까",
        reason: "외부 서비스가 우연히 정상 응답한 것만으로 실패 처리가 맞는지는 알 수 없습니다. 테스트에서는 성공한 응답을 먼저 저장한 뒤 다음 요청을 실패하게 만들어, 이전 응답을 돌려주는 분기가 작동하는지 확인했습니다.",
        steps: [
          "같은 조건으로 다시 검색하면 저장된 응답을 재사용하는지 확인합니다. 요청이 실패하는 경우에는 허용 기간 안의 이전 응답이 경고 정보와 함께 반환되는지 확인합니다.",
          "호출 한도를 넘긴 경우에는 일반 검색 결과 대신 429 응답과 재시도 시간을 반환하는지 확인합니다. 결과가 없는 검색과 요청을 처리하지 못한 상황을 구분하기 위한 검사입니다.",
        ],
        note: "검색 API 테스트는 같은 조건의 응답 재사용, 외부 API 실패 후 이전 응답 반환, 호출 한도 초과 시 재시도 안내를 확인합니다. 테스트가 깨지면 단순히 성공 여부를 보는 것이 아니라, 어느 조건에서 반환값이 달라졌는지 추적할 수 있습니다.",
      },
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
          <p>사진을 탐색하는 화면과 게임 가격을 비교하는 서비스를 만들었습니다. 사용자가 기다리는 순간과 데이터가 어긋나는 지점을 찾아, 코드를 바꾸고 결과를 확인했습니다.</p>
          <a className="bin-work-button" href="#projects">프로젝트 살펴보기 <ArrowDown size={17} /></a>
        </div>
        <div className="bin-work-selected">
          <p>SELECTED WORK · 2025—2026</p>
          <a href="#project-0"><span>01 · 팀 프로젝트 / 프론트엔드</span><h2>PhotoMap</h2><p>사진을 장소와 시간으로 탐색하는 화면.<br />이미지 로딩과 긴 목록을 개선한 과정.</p><ArrowUpRight size={28} /></a>
          <a href="#project-1"><span>02 · 개인 프로젝트</span><h2>GameInfo</h2><p>여러 상점의 게임 가격을 비교하는 서비스.<br />다른 데이터와 실패한 요청을 다룬 과정.</p><ArrowUpRight size={28} /></a>
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
