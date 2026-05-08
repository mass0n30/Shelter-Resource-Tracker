-- CreateTable
CREATE TABLE "public"."EnrollmentDates" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnrollmentDates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."EnrollmentDates" ADD CONSTRAINT "EnrollmentDates_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
