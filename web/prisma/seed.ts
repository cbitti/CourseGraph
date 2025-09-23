import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
type CourseId = string | number;

async function main() {
  // Detect whether Course.credits exists in your Prisma schema
  const hasCredits =
    Prisma.dmmf.datamodel.models
      .find((m) => m.name === "Course")
      ?.fields.some((f) => f.name === "credits") ?? false;

  const courses = [
    { code: "CS101", title: "Intro to CS", credits: 4 },
    { code: "CS201", title: "Data Structures", credits: 4 },
    { code: "CS301", title: "Algorithms", credits: 4 },
  ];

  // Upsert courses by unique code and keep a lookup for IDs
  const byCode: Record<string, { id: CourseId }> = {};

  for (const c of courses) {
    // Build create/update objects without tripping TS if credits doesn't exist
    const createBase = { code: c.code, title: c.title } as Record<string, unknown>;
    const updateBase = { title: c.title } as Record<string, unknown>;
    if (hasCredits) {
      createBase["credits"] = c.credits;
      updateBase["credits"] = c.credits;
    }

    const course = await prisma.course.upsert({
      where: { code: c.code }, // assumes Course.code is @unique (your current code already uses this)
      update: updateBase as unknown as Prisma.CourseUpdateInput,
      create: createBase as unknown as Prisma.CourseCreateInput,
    });

    byCode[c.code] = { id: course.id as CourseId };
  }

  // Prereq edges (from -> to)
  const edges: Array<[string, string]> = [
    ["CS101", "CS201"],
    ["CS201", "CS301"],
  ];

  const edgeRows = edges
    .map(([from, to]) => {
      const fromId = byCode[from]?.id;
      const toId = byCode[to]?.id;
      if (fromId == null || toId == null) return null;
      return { fromCourseId: fromId as CourseId, toCourseId: toId as CourseId };
    })
    .filter((x): x is { fromCourseId: CourseId; toCourseId: CourseId } => !!x);

  if (edgeRows.length) {
    // skipDuplicates relies on a unique (PK or @@unique([fromCourseId, toCourseId]))
    await prisma.prereq.createMany({ data: edgeRows, skipDuplicates: true });
  }

  console.log("Seeded courses:", Object.keys(byCode).join(", "));
  console.log("Seeded edges:", edges.map(([a, b]) => `${a}→${b}`).join(", "));
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
