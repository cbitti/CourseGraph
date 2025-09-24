import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type CourseRow = { id: string; code: string; title: string | null };
type PrereqRow = { fromCourseId: string; toCourseId: string };

export async function GET() {
  try {
    const [courses, prereqs] = await Promise.all([
      prisma.course.findMany({ select: { id: true, code: true, title: true } }),
      prisma.prereq.findMany({ select: { fromCourseId: true, toCourseId: true } }),
    ]);

    const nodes = (courses as CourseRow[]).map((c) => ({
      id: String(c.id),
      label: `${c.code} — ${c.title ?? ''}`.trim(),
    }));

    // Dedup edges defensively
    const seen = new Set<string>();
    const edges = (prereqs as PrereqRow[]).flatMap((e) => {
      const key = `${e.fromCourseId}->${e.toCourseId}`;
      if (seen.has(key)) return [];
      seen.add(key);
      return [{ from: String(e.fromCourseId), to: String(e.toCourseId) }];
    });

    return NextResponse.json({ nodes, edges });
  } catch (err) {
    console.error('GET /api/courses/graph failed:', err);
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({ nodes: [], edges: [], _devError: String((err as Error)?.message ?? err) });
    }
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  }
}
