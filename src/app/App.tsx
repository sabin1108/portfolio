import { Hero } from "./components/Hero";
import { TechStack } from "./components/TechStack";
import { Projects } from "./components/Projects";
import { Timeline } from "./components/Timeline";
import { Education } from "./components/Education";
import { Resume } from "./components/Resume";

function TopNav({ showResumeLink = false, isEn = false }: { showResumeLink?: boolean; isEn?: boolean }) {
  const currentPath = window.location.pathname;
  const isResumePath = currentPath.startsWith("/resume");

  const toggleLanguage = () => {
    if (isResumePath) {
      window.location.pathname = isEn ? "/resume" : "/resume/en";
    } else {
      window.location.pathname = isEn ? "/" : "/en";
    }
  };

  return (
    <nav className="print:hidden sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 sm:px-8">
        <a href={isEn ? "/en" : "/"} className="text-sm font-bold text-slate-900">
          {isEn ? "Sabin Min" : "민사빈"}
        </a>
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-indigo-600 border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 transition-colors cursor-pointer"
          >
            {isEn ? "KO" : "EN"}
          </button>

          <a
            href={isEn ? "/en" : "/"}
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Portfolio
          </a>
          {showResumeLink ? (
            <a
              href={isEn ? "/resume/en" : "/resume"}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              Resume
            </a>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  const currentPath = window.location.pathname;
  const isResumePage =
    currentPath === "/resume" ||
    currentPath === "/resume/en" ||
    currentPath === "/resume-en";
  const isEn =
    currentPath === "/en" ||
    currentPath === "/resume/en" ||
    currentPath === "/resume-en";

  if (isResumePage) {
    return (
      <>
        <TopNav isEn={isEn} />
        <Resume />
      </>
    );
  }

  return (
    <>
      <TopNav isEn={isEn} />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
          <Hero />
          <TechStack />
          <Projects />
          <Timeline />
          <Education />
        </div>
      </main>
    </>
  );
}
