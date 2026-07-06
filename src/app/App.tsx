import { Hero } from "./components/Hero";
import { TechStack } from "./components/TechStack";
import { Projects } from "./components/Projects";
import { Timeline } from "./components/Timeline";
import { Education } from "./components/Education";
import { Resume } from "./components/Resume";

function TopNav({ showResumeLink = false }: { showResumeLink?: boolean }) {
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
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  const currentPath = window.location.pathname;

  // Redirect English portfolio path /en to Korean portfolio /
  if (currentPath === "/en") {
    window.location.replace("/");
    return null;
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
      <TopNav />
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
