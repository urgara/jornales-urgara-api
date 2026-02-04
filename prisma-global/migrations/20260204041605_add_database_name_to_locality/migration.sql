/*
  Warnings:

  - A unique constraint covering the columns `[databaseName]` on the table `Locality` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Locality" ADD COLUMN     "databaseName" VARCHAR(100) NOT NULL DEFAULT 'pending';

-- CreateIndex
CREATE UNIQUE INDEX "Locality_databaseName_key" ON "Locality"("databaseName");
