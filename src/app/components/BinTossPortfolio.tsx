import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ExternalLink, Github, Mail } from "lucide-react";
import { frontendPortfolio } from "../data/main";
import { binCaseNarratives } from "../data/binCaseNarratives";

const ease = [0.22, 1, 0.36, 1] as const;

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return <motion.div initial={{ opacity: 0, y: 48 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.72, delay, ease }}>{children}</motion.div>;
}

function Label({ children }: { children: React.ReactNode }) { return <p className="text-sm font-black uppercase tracking-[0.08em] text-[#3182f6]">{children}</p>; }

function ProjectSection({ project, projectIndex }: { project: typeof frontendPortfolio.projects[number]; projectIndex: number }) {
  const readableMetrics = project.title === "PhotoMap"
    ? [
        { label: "첫 사진 표시", value: "약 2.6초", basis: "같은 모바일 조건 반복 측정" },
        { label: "첫 화면 준비", value: "약 2.5초", basis: "주요 콘텐츠가 보이는 시점" },
        { label: "첫 화면 이미지", value: "1MB 이하", basis: "처음 불러오는 양을 줄임" },
        { label: "관계 보기", value: "3분의 1 수준", basis: "화면 전환 흐름 기준" },
      ]
    : [
        { label: "불필요한 코드", value: "12개 정리", basis: "사용하지 않는 파일과 코드 제거" },
        { label: "테스트", value: "60개 통과", basis: "검색·가격·관심 목록 확인" },
        { label: "오류 화면", value: "상태별 안내", basis: "현재 상황을 문장으로 안내" },
      ];
  const readableSummary = project.title === "PhotoMap"
    ? "사진을 지도와 시간 흐름으로 찾아보는 서비스입니다. 많은 사진과 여러 화면이 함께 움직일 때도 필요한 부분만 바뀌도록 정리해 첫 사진을 더 빨리 보여주는 데 집중했습니다."
    : "여러 상점의 게임 할인 정보를 한곳에서 보여주는 서비스입니다. 상점마다 다른 정보를 같은 화면에서 읽을 수 있게 정리하고, 가격이 없거나 응답이 늦을 때도 잘못된 정보가 보이지 않게 했습니다.";
  const readableArchitecture = project.title === "PhotoMap"
    ? {
        title: "사진을 찾는 흐름을 세 부분으로 나눴습니다.",
        description: "사진을 보여주는 화면, 필요한 정보, 많은 사진을 처리하는 일을 나눠 각 부분이 맡은 일에 집중하게 했습니다.",
        columns: [
          { title: "사진을 보는 화면", nodes: [{ label: "지도·앨범·타임라인", detail: "사진을 위치와 시간에 따라 찾아봅니다." }, { label: "관계 보기", detail: "사진 사이의 연결을 살펴봅니다." }] },
          { title: "필요한 정보만 전달", nodes: [{ label: "화면 상태 나누기", detail: "검색, 선택, 필터가 서로 영향을 덜 주도록 나눴습니다." }, { label: "화면에 맞게 정리", detail: "사진과 위치 정보를 필요한 곳에만 보냅니다." }] },
          { title: "많은 사진 처리", nodes: [{ label: "보이는 사진부터 표시", detail: "현재 화면에 필요한 사진부터 보여줍니다." }, { label: "화면 밖 작업 분리", detail: "지도와 그래프가 사진 전체를 다시 그리지 않게 했습니다." }] },
        ],
        flow: ["사진과 검색 조건을 받습니다", "필요한 정보만 정리합니다", "화면에 맞춰 보여줍니다", "오류가 나도 안내합니다"],
      }
    : {
        title: "상점마다 다른 정보를 한 화면에서 읽게 했습니다.",
        description: "각 상점의 정보를 같은 모양으로 정리한 뒤 검색·상세·관심 목록 화면에 전달했습니다.",
        columns: [
          { title: "사용자가 보는 화면", nodes: [{ label: "검색·할인·상세", detail: "게임과 할인 정보를 찾아봅니다." }, { label: "관심 목록", detail: "관심 상품과 목표 가격을 확인합니다." }] },
          { title: "정보를 정리하는 곳", nodes: [{ label: "상점 정보 합치기", detail: "Steam·Epic·ITAD의 항목 이름을 맞춥니다." }, { label: "가격 확인", detail: "가격이 없으면 할인으로 표시하지 않습니다." }] },
          { title: "안정적으로 보여주는 곳", nodes: [{ label: "상태별 안내", detail: "현재 어떤 상황인지 문장으로 알려줍니다." }, { label: "기존 정보 활용", detail: "상점이 늦어도 이전 정보를 활용합니다." }] },
        ],
        flow: ["게임을 검색합니다", "상점 정보를 한 모양으로 정리합니다", "가격과 상태를 확인합니다", "화면에 알맞게 보여줍니다"],
      };
  return <>
    <section className="portfolio-bin-band bg-white"><div className="portfolio-bin-container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
      <Reveal><Label>Project case study</Label><p className="mt-5 text-7xl font-black leading-none text-[#3182f6]">{String(projectIndex + 1).padStart(2, "0")}</p><h2 className="portfolio-bin-title mt-5">{project.title}</h2><p className="mt-6 text-xl font-bold leading-8 text-[#4e5968]">{project.subtitle}</p></Reveal>
      <Reveal delay={0.1}><p className="text-lg font-medium leading-8 text-[#4e5968]">{readableSummary}</p><div className="mt-8 flex flex-wrap gap-2">{project.tech.map((tag) => <span key={tag} className="rounded-full bg-[#f2f4f6] px-4 py-2 text-sm font-bold text-[#333d4b]">{tag}</span>)}</div><div className="mt-9 flex flex-wrap gap-3"><a href={project.links.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#191f28] px-5 py-3 text-sm font-bold text-white"><Github className="h-4 w-4" />소스 보기</a>{project.links.live && <a href={project.links.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#e8f3ff] px-5 py-3 text-sm font-bold text-[#2272eb]"><ExternalLink className="h-4 w-4" />서비스 보기</a>}</div></Reveal>
    </div></section>
    <section className="portfolio-bin-band bg-[#f7f9fc]"><div className="portfolio-bin-container grid gap-8 lg:grid-cols-[1.2fr_0.8fr]"><div className="grid gap-4"><Reveal><img src={project.imageGallery.main.src} alt={project.imageGallery.main.alt} className="aspect-[16/10] h-full w-full rounded-[2rem] object-cover shadow-[0_24px_80px_rgba(0,27,55,0.1)]" /></Reveal><div className="grid grid-cols-2 gap-4">{project.imageGallery.supporting.map((image, i) => <Reveal key={image.src} delay={(i + 1) * 0.06}><img src={image.src} alt={image.alt} className="aspect-[4/3] w-full rounded-[1.5rem] object-cover shadow-[0_14px_44px_rgba(0,27,55,0.07)]" /></Reveal>)}</div></div><div className="grid gap-4">{readableMetrics.map((metric, i) => <Reveal key={metric.label} delay={i * 0.06}><article className="rounded-[1.75rem] bg-white p-7 shadow-[0_14px_44px_rgba(0,27,55,0.07)]"><p className="text-sm font-bold text-[#8b95a1]">{metric.label}</p><p className="mt-4 text-4xl font-black">{metric.value}</p><p className="mt-3 text-sm leading-6 text-[#6b7684]">{metric.basis}</p></article></Reveal>)}</div></div></section>
    <section className="portfolio-bin-band bg-[#191f28] text-white"><div className="portfolio-bin-container"><Reveal><Label>Architecture</Label><h2 className="portfolio-bin-title mt-5 text-white">{readableArchitecture.title}</h2><p className="mt-6 max-w-2xl text-lg leading-8 text-[#b8c1cc]">{readableArchitecture.description}</p></Reveal><div className="mt-14 grid gap-4 lg:grid-cols-3">{readableArchitecture.columns.map((column, i) => <Reveal key={column.title} delay={i * 0.08}><article className="h-full rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-6"><p className="text-sm font-black text-[#8cc8ff]">0{i + 1}</p><h3 className="portfolio-bin-architecture-title mt-4 text-2xl font-black">{column.title}</h3><div className="mt-7 space-y-3">{column.nodes.map((node) => <div key={node.label} className="rounded-2xl bg-white/[0.06] p-4"><p className="portfolio-bin-architecture-label font-bold">{node.label}</p><p className="portfolio-bin-architecture-detail mt-2 text-sm leading-6 text-[#b8c1cc]">{node.detail}</p></div>)}</div></article></Reveal>)}</div><div className="mt-10 flex flex-wrap items-center gap-3">{readableArchitecture.flow.map((item, i) => <span key={item} className="inline-flex items-center gap-3 text-sm font-bold"><span className="rounded-full bg-[#3182f6] px-4 py-2">{item}</span>{i < readableArchitecture.flow.length - 1 && <span className="text-[#6b7684]">→</span>}</span>)}</div></div></section>
    <section className="portfolio-bin-band bg-white"><div className="portfolio-bin-container"><Reveal><Label>Decisions</Label><h2 className="portfolio-bin-title mt-5 max-w-3xl">문제가 보이면, 화면보다 먼저 흐름을 고쳤습니다.</h2></Reveal><div className="mt-14 grid gap-5 lg:grid-cols-2">{project.caseStudies.map((story, i) => <Reveal key={story.title} delay={(i % 2) * 0.08}><article className="h-full border-t border-[#e5e8eb] py-6"><p className="text-sm font-black text-[#3182f6]">{String(i + 1).padStart(2, "0")}</p><h3 className="mt-5 text-2xl font-black">{project.title === "PhotoMap" ? ["화면 전체가 다시 움직이던 문제", "많은 사진을 불러올 때 느려지는 문제", "그래프를 움직일 때 화면이 무거워지는 문제", "이미지 용량이 커지는 문제"][i] || "화면 흐름을 다듬은 사례" : ["상점마다 다른 정보를 한 화면에 보여준 문제", "잘못된 가격이 할인처럼 보이던 문제", "상점 응답이 늦을 때 화면이 비던 문제", "기능이 늘면서 확인할 곳이 많아진 문제"][i] || "서비스 흐름을 다듬은 사례"}</h3><p className="mt-5 text-base font-medium leading-8 text-[#4e5968]">{project.title === "PhotoMap" ? ["필요한 화면만 다시 움직이도록 나눠 사진을 찾는 흐름을 안정적으로 만들었습니다.", "보이는 사진부터 표시해 많은 사진을 불러와도 스크롤이 덜 끊기게 했습니다.", "그래프와 사진 화면의 작업을 나눠 지도와 앨범을 함께 사용해도 부담을 줄였습니다.", "사진을 화면 크기에 맞춰 준비해 첫 화면을 더 빨리 보여줬습니다."][i] || "화면 흐름을 더 가볍게 정리했습니다." : ["각 상점의 정보를 같은 모양으로 정리해 검색과 상세 화면을 한 흐름으로 연결했습니다.", "가격이 없거나 알 수 없는 상품은 할인으로 표시하지 않도록 막았습니다.", "사용자가 기다려야 하는지, 다시 시도해야 하는지 알 수 있도록 화면에서 현재 상황을 설명했습니다.", "60개 테스트로 주요 기능을 반복 확인해 수정 후에도 흐름이 유지되게 했습니다."][i] || "서비스 흐름을 더 안정적으로 정리했습니다."}</p><div className="mt-6 border-l-2 border-[#dce5ef] pl-5">
  {binCaseNarratives[project.title]?.[i] && <div className="space-y-3 text-sm leading-7 text-[#6b7684]">
    <p className="font-black text-[#2272eb]">발견부터 결과까지</p>
    <p><strong className="text-[#333d4b]">상황.</strong> {binCaseNarratives[project.title][i].situation}</p>
    <p><strong className="text-[#333d4b]">확인.</strong> {binCaseNarratives[project.title][i].check}</p>
    <p><strong className="text-[#333d4b]">목표.</strong> {binCaseNarratives[project.title][i].goal}</p>
    <p><strong className="text-[#333d4b]">처리.</strong> {binCaseNarratives[project.title][i].action}</p>
    <p><strong className="text-[#333d4b]">결과.</strong> {binCaseNarratives[project.title][i].result}</p>
  </div>}
</div></article></Reveal>)}</div></div></section>
  </>;
}

export function BinTossPortfolio() {
  const data = frontendPortfolio;
  const project = data.projects[0];
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  return <main className="portfolio-bin min-h-screen bg-white text-[#191f28]"><motion.div className="fixed left-0 top-0 z-50 h-1 origin-left bg-[#3182f6]" style={{ scaleX: scrollYProgress, width: "100%" }} /><nav className="portfolio-bin-nav fixed inset-x-0 top-0 z-40"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8"><a href="/" className="font-black">{data.profile.name}</a><div className="flex gap-2 text-sm font-bold"><a className="rounded-full px-4 py-2 hover:bg-[#f2f4f6]" href="#projects">Projects</a><a className="rounded-full px-4 py-2 hover:bg-[#f2f4f6]" href="#profile">Profile</a></div></div></nav><section className="portfolio-bin-hero relative min-h-screen overflow-hidden"><motion.div style={{ y: heroY }} className="portfolio-bin-container grid min-h-screen content-center gap-12 pb-24 pt-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"><Reveal><Label>Front-End Developer</Label><h1 className="mt-6 text-[3.3rem] font-black leading-[1.04] sm:text-[6.5rem]">{data.profile.name}<span className="block text-[#3182f6]">{data.profile.title}</span></h1><p className="mt-9 max-w-2xl text-xl font-medium leading-9 text-[#4e5968]">{data.profile.headline}</p><div className="mt-10 flex flex-wrap gap-3"><a href="#projects" className="inline-flex items-center gap-2 rounded-full bg-[#3182f6] px-6 py-4 text-sm font-black text-white">프로젝트 보기 <ArrowDown className="h-4 w-4" /></a><a href={"mailto:" + data.profile.contacts.email} className="inline-flex items-center gap-2 rounded-full bg-[#f2f4f6] px-5 py-4 text-sm font-black"><Mail className="h-4 w-4" />연락하기</a></div></Reveal><Reveal delay={0.1}><div className="portfolio-bin-device"><div className="portfolio-bin-device-top"><span /><span /><span /></div><div className="portfolio-bin-device-body"><p className="text-sm font-bold text-[#8b95a1]">화면을 확인한 기록</p><p className="mt-5 text-4xl font-black">문제를<br />작은 흐름으로<br /><span className="text-[#3182f6]">나눕니다.</span></p><div className="mt-10 space-y-3"><div className="h-3 w-4/5 rounded-full bg-[#3182f6]" /><div className="h-3 w-3/5 rounded-full bg-[#d1d6db]" /><div className="h-3 w-2/5 rounded-full bg-[#e5e8eb]" /></div></div></div></Reveal></motion.div></section><section className="portfolio-bin-band bg-[#f7f9fc]"><div className="portfolio-bin-container grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center"><Reveal><Label>What I bring</Label><h2 className="portfolio-bin-title mt-5">보기 좋은 화면을<br />끝까지 작동하게 만듭니다.</h2></Reveal><div className="grid gap-4 sm:grid-cols-3">{["사용자 흐름", "렌더링 안정성", "검증 가능한 결과"].map((item, i) => <Reveal key={item} delay={i * 0.08}><article className="rounded-[1.75rem] bg-white p-6 shadow-[0_14px_44px_rgba(0,27,55,0.06)]"><p className="text-4xl font-black text-[#3182f6]">0{i + 1}</p><p className="mt-8 text-lg font-black">{item}</p><p className="mt-3 text-sm leading-6 text-[#6b7684]">{["지도와 사진을 찾기 쉽게 정리", "많은 사진도 끊기지 않게 표시", "전후 변화를 숫자로 확인"][i]}</p></article></Reveal>)}</div></div></section><div id="projects">{data.projects.map((item, index) => <ProjectSection key={item.title} project={item} projectIndex={index} />)}</div><section className="portfolio-bin-band bg-[#f2f4f6]"><div className="portfolio-bin-container"><Reveal><Label>Beyond code</Label><h2 className="portfolio-bin-title mt-5 max-w-3xl">만든 결과를 설명하고, 검증하고, 남겼습니다.</h2></Reveal><div className="mt-12 grid gap-4 lg:grid-cols-2">{data.activities.map((activity, i) => <Reveal key={activity.title} delay={i * 0.05}><article className="border-t border-[#d1d6db] py-6"><p className="text-sm font-black text-[#3182f6]">{activity.date}</p><h3 className="mt-3 text-xl font-black">{activity.title}</h3><p className="mt-3 text-sm leading-7 text-[#6b7684]">{activity.description}</p>{activity.pdf && <a className="mt-3 inline-flex text-sm font-bold text-[#2272eb]" href={activity.pdf.href}>{activity.pdf.label}</a>}</article></Reveal>)}</div></div></section><section id="profile" className="portfolio-bin-band bg-[#191f28] text-white"><div className="portfolio-bin-container"><Reveal><Label>Profile</Label><h2 className="portfolio-bin-title mt-5 text-white">다음 화면을 함께 만들고 싶다면</h2></Reveal><div className="mt-12 grid gap-7 md:grid-cols-3"><div><p className="text-sm text-[#8b95a1]">Education</p><p className="mt-3 font-black">{data.education.school}</p><p className="mt-2 text-sm text-[#b8c1cc]">{data.education.degree}</p></div><div><p className="text-sm text-[#8b95a1]">Contact</p><a className="mt-3 block font-black text-[#8cc8ff]" href={"mailto:" + data.profile.contacts.email}>{data.profile.contacts.email}</a></div><div><p className="text-sm text-[#8b95a1]">Source</p><a className="mt-3 inline-flex items-center gap-2 font-black text-[#8cc8ff]" href={data.profile.contacts.github} target="_blank" rel="noreferrer"><Github className="h-5 w-5" />GitHub</a></div></div></div></section></main>;
}
