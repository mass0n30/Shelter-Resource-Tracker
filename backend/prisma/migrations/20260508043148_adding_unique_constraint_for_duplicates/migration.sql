/*
  Warnings:

  - A unique constraint covering the columns `[clientId,date,type]` on the table `EnrollmentDates` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."EnrollmentDates" DROP CONSTRAINT "EnrollmentDates_clientId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "EnrollmentDates_clientId_date_type_key" ON "public"."EnrollmentDates"("clientId", "date", "type");

-- AddForeignKey
ALTER TABLE "public"."EnrollmentDates" ADD CONSTRAINT "EnrollmentDates_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
