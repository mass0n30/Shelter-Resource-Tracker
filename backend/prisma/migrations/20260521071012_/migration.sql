-- DropForeignKey
ALTER TABLE "public"."EnrollmentDates" DROP CONSTRAINT "EnrollmentDates_clientId_fkey";

-- AddForeignKey
ALTER TABLE "public"."EnrollmentDates" ADD CONSTRAINT "EnrollmentDates_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
