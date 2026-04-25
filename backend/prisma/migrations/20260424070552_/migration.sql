/*
  Warnings:

  - You are about to drop the column `extensionDate` on the `Client` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."ResourceType" AS ENUM ('HOUSING', 'EMPLOYMENT', 'MEDICAL', 'LEGAL', 'SUBSTANCE_USE', 'FINANCIAL_ASSISTANCE', 'OTHER');

-- AlterTable
ALTER TABLE "public"."Client" DROP COLUMN "extensionDate";
