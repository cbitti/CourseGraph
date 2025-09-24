import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Upsert demo courses by unique code
  const cs101 = await prisma.course.upsert({
    where: { code: 'CS101' },
    update: { title: 'Intro to CS', credits: 4 },
    create: { code: 'CS101', title: 'Intro to CS', credits: 4 },
  });

  const cs201 = await prisma.course.upsert({
    where: { code: 'CS201' },
    update: { title: 'Data Structures', credits: 4 },
    create: { code: 'CS201', title: 'Data Structures', credits: 4 },
  });

  const cs301 = await prisma.course.upsert({
    where: { code: 'CS301' },
    update: { title: 'Algorithms', credits: 4 },
    create: { code: 'CS301', title: 'Algorithms', credits: 4 },
  });

  // Edges (deduped by DB unique constraint)
  await prisma.prereq.createMany({
    data: [
      { fromCourseId: cs101.id, toCourseId: cs201.id },
      { fromCourseId: cs201.id, toCourseId: cs301.id },
    ],
    skipDuplicates: true,
  });

  console.log('Seeded courses: CS101, CS201, CS301');
  console.log('Seeded edges: CS101→CS201, CS201→CS301');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
