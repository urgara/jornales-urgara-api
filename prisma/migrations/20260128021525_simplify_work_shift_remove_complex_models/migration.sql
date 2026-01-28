/*
  Warnings:

  - You are about to drop the `BaseValueWorkShift` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ValueWorkShift` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkShiftConfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BaseValueWorkShift" DROP CONSTRAINT "BaseValueWorkShift_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "BaseValueWorkShift" DROP CONSTRAINT "BaseValueWorkShift_localityId_fkey";

-- DropForeignKey
ALTER TABLE "ValueWorkShift" DROP CONSTRAINT "ValueWorkShift_baseValueWorkShiftId_fkey";

-- DropForeignKey
ALTER TABLE "ValueWorkShift" DROP CONSTRAINT "ValueWorkShift_workShiftId_fkey";

-- DropTable
DROP TABLE "BaseValueWorkShift";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "ValueWorkShift";

-- DropTable
DROP TABLE "WorkShiftConfig";

-- DropEnum
DROP TYPE "WorkShiftType";
