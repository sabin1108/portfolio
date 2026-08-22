import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { Timeline } from "./components/Timeline";
import { Education } from "./components/Education";
import { Resume } from "./components/Resume";
import { FullstackPdfPortfolio } from "./components/FullstackPdfPortfolio";
import { Printer } from "lucide-react";
import { portfolio, frontendPortfolio, fullstackPortfolio, axPortfolio } from "./data/main";

function TopNav({
  showResumeLink = false,
  showPrintButton = false,
  portfolioHref = "/",
  resumeHref = "/resume",
}: {
  showResumeLink?: boolean;
  showPrintButton?: boolean;
  portfolioHref?: string;
  resumeHref?: string;
}) {
  return (
    <nav className="print:hidden sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 sm:px-8">
        <a href={portfolioHref} className="text-sm font-bold text-slate-900">
          민사빈
        </a>
        <div className="flex items-center gap-2">
          <a
            href={portfolioHref}
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Portfolio
          </a>
          {showResumeLink ? (
            <a
              href={resumeHref}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              Resume
            </a>
          ) : null}
          {showPrintButton ? (
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
            >
              <Printer className="h-4 w-4" />
              PDF 저장
            </button>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

function PortfolioPage({
  data,
  isAx = false,
}: {
  data: typeof portfolio;
  isAx?: boolean;
}) {
  return (
    <>
      <TopNav
        showPrintButton
        showResumeLink={isAx}
        portfolioHref={isAx ? "/ax" : "/"}
        resumeHref={isAx ? "/resume/ax_ai_native" : "/resume"}
      />
      <main className="portfolio-page min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
        <div className="portfolio-sheet mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
          <Hero data={data} />
          {isAx ? (
            <section className="mb-14 grid gap-4 md:grid-cols-3" aria-label="AX 대표 성과">
              {[
                ["문제 정의", "가격 비교 제품 목표를 issue #15~#25로 나눠 구현·검증 단위를 명확히 했습니다."],
                ["AI 활용과 책임", "AI는 조사·구현을 돕고, 가격 규칙·보안 경계·결과 채택은 사람이 결정했습니다."],
                ["측정 결과", "lab LCP p75 2.50초 · 첫 사진 p95 2.62초(optimized cold 100회) · 중복 코드 9.4%에서 2.9%"],
              ].map(([title, description]) => (
                <article key={title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-bold text-blue-700">{title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{description}</p>
                </article>
              ))}
            </section>
          ) : null}
          <Projects data={data} />
          <Timeline data={data} />
          <Education />
        </div>
      </main>
    </>
  );
}

export default function App() {
  const currentPath = window.location.pathname;

  if (currentPath === "/en") {
    window.location.replace("/");
    return null;
  }

  if (currentPath === "/fullstack") {
    return <PortfolioPage data={fullstackPortfolio} />;
  }

  if (currentPath === "/fullstack/pdf") {
    return <FullstackPdfPortfolio />;
  }

  if (currentPath === "/frontend" || currentPath === "/portfolio_frontend") {
    return <PortfolioPage data={frontendPortfolio} />;
  }

  if (currentPath === "/ax" || currentPath === "/portfolio_ax") {
    return <PortfolioPage data={axPortfolio} isAx />;
  }

  const isResumePage =
    currentPath === "/resume" ||
    currentPath.startsWith("/resume/") ||
    currentPath.startsWith("/resume-") ||
    currentPath === "/resume_ax";

  if (isResumePage) {
    return (
      <>
        <TopNav portfolioHref={currentPath.toLowerCase().includes("ax_ai_native") || currentPath.toLowerCase() === "/resume_ax" ? "/ax" : "/"} />
        <Resume />
      </>
    );
  }

  return <PortfolioPage data={frontendPortfolio} />;
}
