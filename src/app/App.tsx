import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { Timeline } from "./components/Timeline";
import { Education } from "./components/Education";
import { Resume } from "./components/Resume";
import { Printer } from "lucide-react";
import { portfolio } from "./data/portfolio";
import { fullstackPortfolio } from "./data/portfolio_fullstack";

function TopNav({
  showResumeLink = false,
  showPrintButton = false,
}: {
  showResumeLink?: boolean;
  showPrintButton?: boolean;
}) {
  return (
    <nav className="print:hidden sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 sm:px-8">
        <a href="/" className="text-sm font-bold text-slate-900">
          민사빈
        </a>
        <div className="flex items-center gap-2">
          <a
            href="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Portfolio
          </a>
          {showResumeLink ? (
            <a
              href="/resume"
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

function PortfolioPage({ data = portfolio }: { data?: typeof portfolio }) {
  return (
    <>
      <TopNav showPrintButton />
      <main className="portfolio-page min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
        <div className="portfolio-sheet mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
          <Hero data={data} />
          <Projects data={data} />
          <Timeline />
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

  const isResumePage =
    currentPath === "/resume" ||
    currentPath.startsWith("/resume/") ||
    currentPath.startsWith("/resume-");

  if (isResumePage) {
    return (
      <>
        <TopNav />
        <Resume />
      </>
    );
  }

  return (
    <>
      <TopNav showPrintButton />
      <main className="portfolio-page min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
        <div className="portfolio-sheet mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
          <Hero />
          <Projects />
          <Timeline />
          <Education />
        </div>
      </main>
    </>
  );
}