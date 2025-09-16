import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validate inputs on the server
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

export async function createCourse(formData: FormData) {
  "use server";

  const parsed = CourseSchema.safeParse({
    code: String(formData.get("code") ?? ""),
    title: String(formData.get("title") ?? ""),
    credits: formData.get("credits"),
  });
  if (!parsed.success) {
    // Minimal error surface; you can wire useFormState later to show these
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { code, title, credits } = parsed.data;

  try {
    await prisma.course.create({ data: { code, title, credits } });
    // Refresh the /courses page so the new item appears
    revalidatePath("/courses");
    return { ok: true };
  } catch (e: any) {
    // Prisma unique violation = P2002
    if (e?.code === "P2002") {
      return { ok: false, errors: { code: ["Course code already exists"] } };
    }
    console.error(e);
    return { ok: false, errors: { _form: ["Unexpected error creating course"] } };
  }
}

export async function deleteCourse(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false };
  try {
    await prisma.course.delete({ where: { id } });
    revalidatePath("/courses");
    return { ok: true };
  } catch (e) {
    console.error(e);
    return { ok: false };
  }
}
