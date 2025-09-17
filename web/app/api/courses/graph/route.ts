import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const courses = await prisma.course.findMany({
    select: { id: true, code: true, title: true },
  });
  const prereqs = await prisma.prereq.findMany({
    select: { fromCourseId: true, toCourseId: true },
  });

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
}
