/*
  Warnings:

  - Added the required column `notRemunerated` to the `WorkShiftCalculatedValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remunerated` to the `WorkShiftCalculatedValue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkShiftCalculatedValue" ADD COLUMN     "notRemunerated" DECIMAL(8,2) NOT NULL,
ADD COLUMN     "remunerated" DECIMAL(8,2) NOT NULL;
