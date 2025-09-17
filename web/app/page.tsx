import Link from "next/link";

export default function HomePage() {
  const year = new Date().getFullYear();

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100 px-6 py-14">
        {/* Brand chip (not a nav) */}
        <div className="max-w-6xl mx-auto flex items-center gap-2 font-semibold">
          <span className="h-6 w-6 rounded-lg bg-emerald-500 inline-block" />
          <span>CourseGraph</span>
        </div>

        <div className="max-w-6xl mx-auto text-center mt-10">
          <h1 className="text-5xl font-extrabold tracking-tight">
            Plan your degree with confidence
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            Visualize prerequisites, build term-by-term plans, and get smart suggestions.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/courses"
              className="px-5 py-3 rounded-xl bg-white text-slate-900 font-semibold shadow"
            >
              Try the demo
            </Link>
            <a
              href="https://github.com/cbitti/CourseGraph"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-xl border border-slate-700 hover:border-slate-500"
            >
              View source
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 p-6">
          <h3 className="text-xl font-semibold mb-2">Prereq graph</h3>
          <p className="text-slate-600">
            Understand dependencies at a glance with a directed graph of your courses.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-6">
          <h3 className="text-xl font-semibold mb-2">Planner</h3>
          <p className="text-slate-600">
            Drag courses into semesters and get warned when prerequisites aren’t met.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-6">
          <h3 className="text-xl font-semibold mb-2">API-first</h3>
          <p className="text-slate-600">
            Typed Prisma models, Next.js API routes, and Postgres for persistence.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-slate-500 text-sm">
        © {year} CourseGraph. Built with Next.js, TypeScript, Prisma, Postgres.
      </footer>
    </div>
  );
}
