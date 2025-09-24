'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

// Create or update a course by unique code
export async function createCourse(formData: FormData) {
  const rawCode = String(formData.get('code') ?? '').trim();
  const code = rawCode.toUpperCase();
  const title = String(formData.get('title') ?? '').trim();
  const credits = Number(formData.get('credits') ?? 0);

  if (!code) return;

  await prisma.course.upsert({
    where: { code },
    update: { title, credits },
    create: { code, title, credits },
  });

  revalidatePath('/courses');
  revalidatePath('/graph');
}

// Delete a course (and dependent edges/items)
export async function deleteCourse(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;

  await prisma.$transaction([
    prisma.prereq.deleteMany({ where: { OR: [{ fromCourseId: id }, { toCourseId: id }] } }),
    prisma.planItem.deleteMany({ where: { courseId: id } }),
    prisma.course.delete({ where: { id } }),
  ]);

  revalidatePath('/courses');
  revalidatePath('/graph');
}

// Add a prerequisite edge: fromCourseId -> toCourseId
export async function addPrereq(formData: FormData) {
  const fromCourseId = String(formData.get('fromCourseId') ?? '');
  const toCourseId = String(formData.get('toCourseId') ?? '');
  if (!fromCourseId || !toCourseId || fromCourseId === toCourseId) return;

  try {
    await prisma.prereq.create({ data: { fromCourseId, toCourseId } });
  } catch {
    // ignore duplicates due to unique(fromCourseId,toCourseId)
  }

  revalidatePath('/courses');
  revalidatePath('/graph');
}

// Remove a prerequisite edge by id
export async function deletePrereq(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;

  await prisma.prereq.delete({ where: { id } });

  revalidatePath('/courses');
  revalidatePath('/graph');
}
