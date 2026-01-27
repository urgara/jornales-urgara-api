/*
  Warnings:

  - You are about to drop the column `portId` on the `BaseValueWorkShift` table. All the data in the column will be lost.
  - You are about to drop the `Port` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `localityId` to the `BaseValueWorkShift` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BaseValueWorkShift" DROP CONSTRAINT "BaseValueWorkShift_portId_fkey";

-- AlterTable
ALTER TABLE "BaseValueWorkShift" DROP COLUMN "portId",
ADD COLUMN     "localityId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Port";

-- AddForeignKey
ALTER TABLE "BaseValueWorkShift" ADD CONSTRAINT "BaseValueWorkShift_localityId_fkey" FOREIGN KEY ("localityId") REFERENCES "Locality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
