-- CreateEnum
CREATE TYPE "WorkShiftType" AS ENUM ('STANDART', 'JC');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('M', 'T', 'W', 'Th', 'F', 'S', 'Su');

-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_localityId_fkey";

-- CreateTable
CREATE TABLE "WorkShift" (
    "id" UUID NOT NULL,
    "days" "DayOfWeek"[],
    "startTime" TIME NOT NULL,
    "endTime" TIME NOT NULL,
    "description" VARCHAR(60),
    "coefficient" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "WorkShift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "isSpecial" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Port" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "Port_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BaseValueWorkShift" (
    "id" SERIAL NOT NULL,
    "remuneratedValue" DECIMAL(65,30) NOT NULL,
    "notRemuneratedValue" DECIMAL(65,30) NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "portId" INTEGER NOT NULL,
    "startDate" TIMESTAMPTZ NOT NULL,
    "endDate" TIMESTAMPTZ,

    CONSTRAINT "BaseValueWorkShift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValueWorkShift" (
    "id" SERIAL NOT NULL,
    "workShiftId" UUID,
    "baseValueWorkShiftId" INTEGER NOT NULL,
    "type" "WorkShiftType" NOT NULL,
    "calculatedRemuneratedValue" DECIMAL(65,30) NOT NULL,
    "calculatedNotRemuneratedValue" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "ValueWorkShift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkShiftConfig" (
    "id" INTEGER NOT NULL,
    "config" JSONB NOT NULL,

    CONSTRAINT "WorkShiftConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ValueWorkShift_workShiftId_baseValueWorkShiftId_type_key" ON "ValueWorkShift"("workShiftId", "baseValueWorkShiftId", "type");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_localityId_fkey" FOREIGN KEY ("localityId") REFERENCES "Locality"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BaseValueWorkShift" ADD CONSTRAINT "BaseValueWorkShift_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BaseValueWorkShift" ADD CONSTRAINT "BaseValueWorkShift_portId_fkey" FOREIGN KEY ("portId") REFERENCES "Port"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValueWorkShift" ADD CONSTRAINT "ValueWorkShift_workShiftId_fkey" FOREIGN KEY ("workShiftId") REFERENCES "WorkShift"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValueWorkShift" ADD CONSTRAINT "ValueWorkShift_baseValueWorkShiftId_fkey" FOREIGN KEY ("baseValueWorkShiftId") REFERENCES "BaseValueWorkShift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
