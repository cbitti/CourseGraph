export const dynamic = "force-dynamic"; // always fetch fresh in dev

type Course = {
  id: string;
  code: string;
  title: string;
  credits: number;
};

export default async function CoursesPage() {
  const res = await fetch("http://localhost:3000/api/courses", { cache: "no-store" });
  const data = (await res.json()) as Course[];

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Courses</h1>
      <ul className="space-y-2">
        {data.map((c) => (
          <li key={c.id} className="rounded-xl border p-3">
            <span className="font-mono">{c.code}</span> — {c.title} ({c.credits} cr)
          </li>
        ))}
      </ul>
    </main>
  );
}
