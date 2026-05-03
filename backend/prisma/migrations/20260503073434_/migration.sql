/*
  Warnings:

  - Made the column `content` on table `Note` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Note" ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "title" DROP NOT NULL;
