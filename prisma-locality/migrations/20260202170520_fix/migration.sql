/*
  Warnings:

  - You are about to drop the column `companyId` on the `Worker` table. All the data in the column will be lost.
  - Added the required column `category` to the `Worker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `agencyId` to the `WorkerAssignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `WorkerAssignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `localityId` to the `WorkerAssignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `WorkerAssignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `terminalId` to the `WorkerAssignment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('IDONEO', 'PERITO');

-- AlterTable
ALTER TABLE "Worker" DROP COLUMN "companyId",
ADD COLUMN     "category" "Category" NOT NULL;

-- AlterTable
ALTER TABLE "WorkerAssignment" ADD COLUMN     "agencyId" UUID NOT NULL,
ADD COLUMN     "companyId" UUID NOT NULL,
ADD COLUMN     "localityId" UUID NOT NULL,
ADD COLUMN     "productId" UUID NOT NULL,
ADD COLUMN     "terminalId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "Terminal" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Terminal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkerAssignment" ADD CONSTRAINT "WorkerAssignment_terminalId_fkey" FOREIGN KEY ("terminalId") REFERENCES "Terminal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
