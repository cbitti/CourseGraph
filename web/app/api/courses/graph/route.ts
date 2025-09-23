import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [courses, prereqs] = await Promise.all([
      prisma.course.findMany({ select: { id: true, code: true, title: true } }),
      prisma.prereq.findMany({ select: { fromCourseId: true, toCourseId: true } }),
    ]);

    return NextResponse.json({
      nodes: courses.map((c) => ({
        id: String(c.id),
        label: `${c.code} — ${c.title ?? ''}`.trim(),
      })),
      edges: prereqs.map((e) => ({
        from: String(e.fromCourseId),
        to: String(e.toCourseId),
      })),
    });
  } catch (err) {
    console.error('GET /api/courses/graph failed:', err);
    // In dev, return an empty graph so pages don’t crash while you diagnose
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({ nodes: [], edges: [], _devError: String((err as Error)?.message ?? err) });
    }
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  }
}
