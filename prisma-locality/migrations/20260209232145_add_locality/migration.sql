/*
  Warnings:

  - Added the required column `category` to the `WorkShiftBaseValue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkShiftBaseValue" ADD COLUMN     "category" "Category" NOT NULL;
