import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Prisma } from "@prisma/client";

type FieldErrors = Record<string, string[]>;

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
    return { ok: false as const, errors: parsed.error.flatten().fieldErrors as FieldErrors };
  }

  const { code, title, credits } = parsed.data;

  try {
    await prisma.course.create({ data: { code, title, credits } });
    revalidatePath("/courses");
    return { ok: true as const };
  } catch (e: unknown) {
    // Use Prisma's typed error instead of "any"
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: false as const, errors: { code: ["Course code already exists"] } };
    }
    console.error(e);
    return { ok: false as const, errors: { _form: ["Unexpected error creating course"] } };
  }
}

export async function deleteCourse(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false as const };

  try {
    await prisma.course.delete({ where: { id } });
    revalidatePath("/courses");
    return { ok: true as const };
  } catch (e: unknown) {
    console.error(e);
    return { ok: false as const };
  }
}
