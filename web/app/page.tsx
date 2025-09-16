export const dynamic = "force-static";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100">
      {/* Top nav */}
      <header className="max-w-6xl mx-auto flex items-center justify-between px-4 py-6">
        <a href="/" className="flex items-center gap-2 font-semibold">
          <span className="h-6 w-6 rounded-lg bg-emerald-500 inline-block" />
          CourseGraph
        </a>
        <nav className="hidden md:flex items-center gap-6 text-slate-300">
          <a href="/courses" className="hover:text-white">Courses</a>
          <a href="/api/courses" className="hover:text-white">API</a>
          <a
            href="https://github.com/cbitti/CourseGraph"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white"
          >
            GitHub
          </a>
        </nav>
        <a
          href="/courses"
          className="px-4 py-2 rounded-xl bg-emerald-500/90 hover:bg-emerald-400 text-slate-900 font-medium"
        >
          Open demo
        </a>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Plan your degree with confidence
        </h1>
        <p className="mt-4 text-lg text-slate-300">
          Visualize prerequisites, build term-by-term plans, and get smart suggestions.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <a
            href="/courses"
            className="px-5 py-3 rounded-xl bg-white text-slate-900 font-semibold shadow"
          >
            Try the demo
          </a>
          <a
            href="https://github.com/cbitti/CourseGraph"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-xl border border-slate-700 hover:border-slate-500"
          >
            View source
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 pb-16 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h3 className="text-xl font-semibold mb-2">Prereq graph</h3>
          <p className="text-slate-300">
            Understand dependencies at a glance with a directed graph of your courses.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h3 className="text-xl font-semibold mb-2">Planner</h3>
          <p className="text-slate-300">
            Drag courses into semesters and get warned when prerequisites aren’t met.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h3 className="text-xl font-semibold mb-2">API-first</h3>
          <p className="text-slate-300">
            Typed Prisma models, Next.js API routes, and Postgres for persistence.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 pb-10 text-slate-400 text-sm">
        © {new Date().getFullYear()} CourseGraph. Built with Next.js, TypeScript, Prisma, Postgres.
      </footer>
    </main>
  );
}
