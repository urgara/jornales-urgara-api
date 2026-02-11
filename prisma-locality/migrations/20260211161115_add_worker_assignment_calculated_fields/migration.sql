/*
  Warnings:

  - Added the required column `baseValue` to the `WorkerAssignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `WorkerAssignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coefficient` to the `WorkerAssignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workShiftBaseValueId` to the `WorkerAssignment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkerAssignment" ADD COLUMN     "baseValue" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "category" "Category" NOT NULL,
ADD COLUMN     "coefficient" DECIMAL(5,2) NOT NULL,
ADD COLUMN     "workShiftBaseValueId" UUID NOT NULL;
