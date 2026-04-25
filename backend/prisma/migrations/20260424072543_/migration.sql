/*
  Warnings:

  - Changed the type of `resourceType` on the `Referral` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Referral" DROP COLUMN "resourceType",
ADD COLUMN     "resourceType" "public"."ResourceType" NOT NULL;
