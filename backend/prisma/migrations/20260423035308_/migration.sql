-- AlterTable
ALTER TABLE "public"."Client" ADD COLUMN     "outtakeDate" TIMESTAMP(3),
ALTER COLUMN "lastStayDate" SET DEFAULT CURRENT_TIMESTAMP;
