-- AlterTable
ALTER TABLE "public"."Note" ADD COLUMN     "title" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "content" SET DEFAULT '';
