/*
  Warnings:

  - A unique constraint covering the columns `[fromCourseId,toCourseId]` on the table `Prereq` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Prereq_fromCourseId_idx" ON "public"."Prereq"("fromCourseId");

-- CreateIndex
CREATE INDEX "Prereq_toCourseId_idx" ON "public"."Prereq"("toCourseId");

-- CreateIndex
CREATE UNIQUE INDEX "Prereq_fromCourseId_toCourseId_key" ON "public"."Prereq"("fromCourseId", "toCourseId");
