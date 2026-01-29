/*
  Warnings:

  - Added the required column `baseHourlyRate` to the `Worker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Worker" ADD COLUMN     "baseHourlyRate" DECIMAL(10,2) NOT NULL;
