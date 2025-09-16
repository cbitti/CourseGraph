import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CourseSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, "Code is too short")
    .max(16, "Code is too long")
    .regex(/^[A-Za-z0-9-]+$/, "Code can only have letters, numbers, and dashes")
    .transform((s) => s.toUpperCase()),
  title: z.string().trim().min(2, "Title is too short").max(100, "Title is too long"),
  credits: z.coerce.number().int().min(0).max(10),
});

/** Server action: create a course (returns void for <form action={...}>) */
export async function createCourse(formData: FormData): Promise<void> {
  "use server";

  const parsed = CourseSchema.safeParse({
    code: String(formData.get("code") ?? ""),
    title: String(formData.get("title") ?? ""),
    credits: formData.get("credits"),
  });
  if (!parsed.success) {
    // TODO: later wire useFormState to show errors
    return;
  }

  const { code, title, credits } = parsed.data;
  try {
    await prisma.course.create({ data: { code, title, credits } });
  } catch (e) {
    // Swallow duplicates for now (we’ll surface nicely with useFormState later)
    console.error(e);
  } finally {
    revalidatePath("/courses");
  }
}

/** Server action: delete a course (returns void for <form action={...}>) */
export async function deleteCourse(formData: FormData): Promise<void> {
  "use server";
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  try {
    await prisma.course.delete({ where: { id } });
  } catch (e) {
    console.error(e);
  } finally {
    revalidatePath("/courses");
  }
}
