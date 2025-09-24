import { prisma } from "@/lib/db";
import { createCourse, deleteCourse, addPrereq, deletePrereq } from "./actions";

type UICourse = {
  id: string;
  code: string;
  title: string;
  credits: number;
  // prerequisites pointing *into* this course
  prereqs: { id: string; fromCourse: { id: string; code: string; title: string } }[];
};

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  // Fetch courses and include the prerequisite source course for display
  const courses = (await prisma.course.findMany({
    orderBy: { code: "asc" },
    include: { prereqs: { include: { fromCourse: { select: { id: true, code: true, title: true } } } } },
  })) as unknown as UICourse[];

  // For the "Add prereq" selects
  const allForSelect = courses.map(c => ({ id: c.id, code: c.code, title: c.title }));

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Courses</h1>
        <p className="text-slate-600 mt-1">
          Add courses and manage prerequisites. Codes are unique; graph updates automatically.
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
        <div className="mt-6 overflow-x-auto rounded-xl border bg-white">
          <table className="w-full">
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
              {courses.map((c: UICourse) => {
                const existingIds = new Set(c.prereqs.map(p => p.fromCourse.id));
                const options = allForSelect.filter(opt => opt.id !== c.id && !existingIds.has(opt.id));
                return (
                  <tr key={c.id} className="align-top">
                    <td className="p-3 font-mono">{c.code}</td>
                    <td className="p-3">{c.title}</td>
                    <td className="p-3">{c.credits}</td>
                    <td className="p-3">
                      {/* Existing prereqs */}
                      {c.prereqs.length === 0 ? (
                        <span className="text-sm text-slate-500">None</span>
                      ) : (
                        <ul className="space-y-1">
                          {c.prereqs.map((p) => (
                            <li key={p.id} className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-sm">
                                <span className="font-mono">{p.fromCourse.code}</span>
                                <span className="text-slate-500">— {p.fromCourse.title}</span>
                              </span>
                              <form action={deletePrereq}>
                                <input type="hidden" name="id" value={p.id} />
                                <button className="text-xs rounded-md border px-2 py-1 hover:bg-slate-50" aria-label="Remove prereq">
                                  Remove
                                </button>
                              </form>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Add prereq */}
                      <form action={addPrereq} className="mt-3 flex items-center gap-2">
                        <input type="hidden" name="toCourseId" value={c.id} />
                        <select
                          name="fromCourseId"
                          className="rounded-md border px-2 py-1 text-sm"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select prerequisite…
                          </option>
                          {options.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.code} — {opt.title}
                            </option>
                          ))}
                        </select>
                        <button className="text-sm rounded-md border px-3 py-1.5 hover:bg-slate-50">
                          Add
                        </button>
                      </form>
                    </td>
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
                );
              })}
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
