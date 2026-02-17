/*
  Warnings:

  - You are about to drop the column `agencyId` on the `WorkerAssignment` table. All the data in the column will be lost.
  - Added the required column `companyRole` to the `WorkerAssignment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CompanyRole" AS ENUM ('EXPORTER', 'SURVEYOR');

-- AlterTable
ALTER TABLE "WorkerAssignment" DROP COLUMN "agencyId",
ADD COLUMN     "companyRole" "CompanyRole" NOT NULL;
