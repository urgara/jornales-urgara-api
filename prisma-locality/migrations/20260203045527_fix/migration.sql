/*
  Warnings:

  - Changed the type of `localityId` on the `Worker` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Worker" DROP COLUMN "localityId",
ADD COLUMN     "localityId" UUID NOT NULL;
