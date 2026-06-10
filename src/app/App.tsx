import { Hero } from "./components/Hero";
import { TechStack } from "./components/TechStack";
import { Projects } from "./components/Projects";
import { Timeline } from "./components/Timeline";
import { Education } from "./components/Education";

export default function App() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <Hero />
        <TechStack />
        <Projects />
        <Timeline />
        <Education />
      </div>
    </main>
  );
}
