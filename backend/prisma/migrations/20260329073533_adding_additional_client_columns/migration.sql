/*
  Warnings:

  - A unique constraint covering the columns `[clientId]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Client" ADD COLUMN     "bedLabel" TEXT,
ADD COLUMN     "clientId" INTEGER,
ADD COLUMN     "gender" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Client_clientId_key" ON "public"."Client"("clientId");
