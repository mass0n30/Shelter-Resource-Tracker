-- AlterTable
ALTER TABLE "public"."Client" ADD COLUMN     "hereLastNight" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Note" ADD COLUMN     "visibility" TEXT DEFAULT 'private';

-- CreateTable
CREATE TABLE "public"."UpdateData" (
    "id" SERIAL NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UpdateData_pkey" PRIMARY KEY ("id")
);
