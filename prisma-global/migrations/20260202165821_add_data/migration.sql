/*
  Warnings:

  - The `localityId` column on the `Admin` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Company` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `legalEntityId` on the `Company` table. All the data in the column will be lost.
  - The primary key for the `Locality` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `LegalEntity` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `id` on the `Company` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Locality` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE '10';

-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_localityId_fkey";

-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_legalEntityId_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "localityId",
ADD COLUMN     "localityId" UUID;

-- AlterTable
ALTER TABLE "Company" DROP CONSTRAINT "Company_pkey",
DROP COLUMN "legalEntityId",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Company_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Locality" DROP CONSTRAINT "Locality_pkey",
ADD COLUMN     "isCalculateJc" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Locality_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "LegalEntity";

-- CreateTable
CREATE TABLE "Agency" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "Agency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" UUID NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_localityId_fkey" FOREIGN KEY ("localityId") REFERENCES "Locality"("id") ON DELETE SET NULL ON UPDATE CASCADE;
