import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

/** Simple Prisma client (good enough for SQLite in dev) */
const prisma = new PrismaClient();

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: { prereqs: true, reqfor: true },
    });
    return NextResponse.json(courses, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}
