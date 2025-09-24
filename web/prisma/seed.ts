import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// IDs are strings in your schema (cuid)
type CourseId = string;

async function main() {
  // Detect whether Course.credits exists
  const hasCredits =
    Prisma.dmmf.datamodel.models
      .find((m) => m.name === "Course")
      ?.fields.some((f) => f.name === "credits") ?? false;

  const courses = [
    { code: "CS101", title: "Intro to CS", credits: 4 },
    { code: "CS201", title: "Data Structures", credits: 4 },
    { code: "CS301", title: "Algorithms", credits: 4 },
  ];

  // Upsert by unique code
  const byCode: Record<string, { id: CourseId }> = {};

  for (const c of courses) {
    const createBase = { code: c.code, title: c.title } as Record<string, unknown>;
    const updateBase = { title: c.title } as Record<string, unknown>;
    if (hasCredits) {
      createBase["credits"] = c.credits;
      updateBase["credits"] = c.credits;
    }

    const course = await prisma.course.upsert({
      where: { code: c.code },
      update: updateBase as Prisma.CourseUpdateInput,
      create: createBase as Prisma.CourseCreateInput,
    });

    byCode[c.code] = { id: course.id as CourseId };
  }

  // Prereq edges (from -> to)
  const pairs: Array<[string, string]> = [
    ["CS101", "CS201"],
    ["CS201", "CS301"],
  ];

  const edgeRows: Prisma.PrereqCreateManyInput[] = [];
  for (const [from, to] of pairs) {
    const fromId = byCode[from]?.id;
    const toId = byCode[to]?.id;
    if (!fromId || !toId) continue;
    edgeRows.push({ fromCourseId: fromId, toCourseId: toId });
  }

  if (edgeRows.length) {
    await prisma.prereq.createMany({ data: edgeRows, skipDuplicates: true });
  }

  console.log("Seeded courses:", Object.keys(byCode).join(", "));
  console.log("Seeded edges:", pairs.map(([a, b]) => `${a}→${b}`).join(", "));
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
