/*
  Warnings:

  - The values [ARCHIVED] on the enum `ClientStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ClientStatus_new" AS ENUM ('ENROLLED', 'WC', 'INACTIVE');
ALTER TABLE "public"."Client" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Client" ALTER COLUMN "status" TYPE "public"."ClientStatus_new" USING ("status"::text::"public"."ClientStatus_new");
ALTER TYPE "public"."ClientStatus" RENAME TO "ClientStatus_old";
ALTER TYPE "public"."ClientStatus_new" RENAME TO "ClientStatus";
DROP TYPE "public"."ClientStatus_old";
ALTER TABLE "public"."Client" ALTER COLUMN "status" SET DEFAULT 'ENROLLED';
COMMIT;
