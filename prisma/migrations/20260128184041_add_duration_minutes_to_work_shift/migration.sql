/*
  Warnings:

  - Added the required column `durationMinutes` to the `WorkShift` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkShift" ADD COLUMN     "durationMinutes" INTEGER NOT NULL;
