import { prisma } from "@/lib/db";
import { createCourse, deleteCourse } from "./actions";

type UICourse = {
  id: string;
  code: string;
  title: string;
  credits: number;
  prereqs: { id: string }[]; // minimal shape—we only read .length
  reqfor: { id: string }[];
};

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = (await prisma.course.findMany({
    orderBy: { code: "asc" },
    include: { prereqs: true, reqfor: true },
  })) as unknown as UICourse[];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Courses</h1>
        <p className="text-slate-600 mt-1">
          Add a course, then delete it to test server actions. Codes are unique.
        </p>

        {/* Add form */}
        <form
          action={createCourse}
          className="mt-6 grid gap-4 sm:grid-cols-[160px_minmax(0,1fr)_120px_auto] items-end bg-white p-4 rounded-xl border"
        >
          <label className="grid text-sm">
            <span className="mb-1 text-slate-600">Code</span>
            <input
              name="code"
              required
              placeholder="CS101"
              className="w-full rounded-lg border px-3 py-2"
            />
          </label>

          <label className="grid text-sm">
            <span className="mb-1 text-slate-600">Title</span>
            <input
              name="title"
              required
              placeholder="Intro to CS"
              className="w-full rounded-lg border px-3 py-2"
            />
          </label>

          <label className="grid text-sm">
            <span className="mb-1 text-slate-600">Credits</span>
            <input
              name="credits"
              type="number"
              min={0}
              max={10}
              defaultValue={4}
              className="w-full rounded-lg border px-3 py-2"
            />
          </label>

          <button
            type="submit"
            className="h-10 rounded-lg bg-emerald-600 text-white px-4 font-semibold hover:bg-emerald-500"
          >
            Add course
          </button>
        </form>

        {/* Table */}
        <div className="mt-6 overflow-x-auto rounded-xl border">
          <table className="w-full bg-white">
            <thead className="text-left text-sm text-slate-600">
              <tr>
                <th className="p-3">Code</th>
                <th className="p-3">Title</th>
                <th className="p-3">Credits</th>
                <th className="p-3">Prereqs</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {courses.map((c) => (
                <tr key={c.id} className="align-middle">
                  <td className="p-3 font-mono">{c.code}</td>
                  <td className="p-3">{c.title}</td>
                  <td className="p-3">{c.credits}</td>
                  <td className="p-3">{c.prereqs.length}</td>
                  <td className="p-3">
                    <form action={deleteCourse} className="inline">
                      <input type="hidden" name="id" value={c.id} />
                      <button
                        className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50"
                        aria-label={`Delete ${c.code}`}
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {!courses.length && (
                <tr>
                  <td className="p-4 text-slate-500" colSpan={5}>
                    No courses yet. Add one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
