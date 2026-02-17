/*
  Warnings:

  - You are about to drop the column `additionalPercent` on the `WorkerAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `baseValue` on the `WorkerAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `WorkerAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `coefficient` on the `WorkerAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `WorkerAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `workShiftBaseValueId` on the `WorkerAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `workerId` on the `WorkerAssignment` table. All the data in the column will be lost.
  - Added the required column `gross` to the `WorkShiftCalculatedValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `net` to the `WorkShiftCalculatedValue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WorkerAssignment" DROP CONSTRAINT "WorkerAssignment_workerId_fkey";

-- AlterTable
ALTER TABLE "WorkShiftCalculatedValue" ADD COLUMN     "gross" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "net" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "WorkerAssignment" DROP COLUMN "additionalPercent",
DROP COLUMN "baseValue",
DROP COLUMN "category",
DROP COLUMN "coefficient",
DROP COLUMN "totalAmount",
DROP COLUMN "workShiftBaseValueId",
DROP COLUMN "workerId";

-- CreateTable
CREATE TABLE "WorkerAssignmentDetail" (
    "id" UUID NOT NULL,
    "workerAssignmentId" UUID NOT NULL,
    "workerId" UUID NOT NULL,
    "category" "Category" NOT NULL,
    "workShiftBaseValueId" UUID NOT NULL,
    "coefficient" DECIMAL(5,2) NOT NULL,
    "baseValue" DECIMAL(10,2) NOT NULL,
    "additionalPercent" DECIMAL(5,2),
    "totalAmount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "WorkerAssignmentDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkerAssignmentDetail" ADD CONSTRAINT "WorkerAssignmentDetail_workerAssignmentId_fkey" FOREIGN KEY ("workerAssignmentId") REFERENCES "WorkerAssignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerAssignmentDetail" ADD CONSTRAINT "WorkerAssignmentDetail_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
