-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('M', 'T', 'W', 'Th', 'F', 'S', 'Su');

-- CreateTable
CREATE TABLE "WorkShift" (
    "id" UUID NOT NULL,
    "days" "DayOfWeek"[],
    "startTime" TIME NOT NULL,
    "endTime" TIME NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "description" VARCHAR(60),
    "coefficient" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "WorkShift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Worker" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "surname" VARCHAR(100) NOT NULL,
    "dni" VARCHAR(10) NOT NULL,
    "companyId" INTEGER,
    "localityId" INTEGER NOT NULL,
    "baseHourlyRate" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkerAssignment" (
    "id" UUID NOT NULL,
    "workerId" UUID NOT NULL,
    "workShiftId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "additionalPercent" DECIMAL(5,2),
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkerAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Worker_dni_key" ON "Worker"("dni");

-- AddForeignKey
ALTER TABLE "WorkerAssignment" ADD CONSTRAINT "WorkerAssignment_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerAssignment" ADD CONSTRAINT "WorkerAssignment_workShiftId_fkey" FOREIGN KEY ("workShiftId") REFERENCES "WorkShift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
