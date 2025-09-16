import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const cs101 = await prisma.course.upsert({
    where: { code: "CS101" },
    update: {},
    create: { code: "CS101", title: "Intro to CS", credits: 4 },
  });

  const cs201 = await prisma.course.upsert({
    where: { code: "CS201" },
    update: {},
    create: { code: "CS201", title: "Data Structures", credits: 4 },
  });

  await prisma.prereq.upsert({
    where: { id: "seed-cs101-cs201" },
    update: {},
    create: { id: "seed-cs101-cs201", fromCourseId: cs101.id, toCourseId: cs201.id },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
