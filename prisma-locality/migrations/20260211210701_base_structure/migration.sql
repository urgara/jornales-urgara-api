-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('M', 'T', 'W', 'Th', 'F', 'S', 'Su');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('IDONEO', 'PERITO');

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
CREATE TABLE "WorkShiftBaseValue" (
    "id" UUID NOT NULL,
    "remunerated" DECIMAL(8,2) NOT NULL,
    "notRemunerated" DECIMAL(8,2) NOT NULL,
    "startDate" TIMESTAMPTZ NOT NULL,
    "endDate" TIMESTAMPTZ NOT NULL,
    "category" "Category" NOT NULL,

    CONSTRAINT "WorkShiftBaseValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkShiftCalculatedValue" (
    "workShiftBaseValueId" UUID NOT NULL,
    "coefficient" DECIMAL(5,2) NOT NULL,
    "remunerated" DECIMAL(8,2) NOT NULL,
    "notRemunerated" DECIMAL(8,2) NOT NULL,

    CONSTRAINT "WorkShiftCalculatedValue_pkey" PRIMARY KEY ("coefficient","workShiftBaseValueId")
);

-- CreateTable
CREATE TABLE "Worker" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "surname" VARCHAR(100) NOT NULL,
    "dni" VARCHAR(10) NOT NULL,
    "localityId" UUID NOT NULL,
    "category" "Category" NOT NULL,
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
    "category" "Category" NOT NULL,
    "workShiftBaseValueId" UUID NOT NULL,
    "coefficient" DECIMAL(5,2) NOT NULL,
    "baseValue" DECIMAL(10,2) NOT NULL,
    "additionalPercent" DECIMAL(5,2),
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" UUID NOT NULL,
    "localityId" UUID NOT NULL,
    "agencyId" UUID NOT NULL,
    "terminalId" UUID NOT NULL,
    "productId" UUID NOT NULL,

    CONSTRAINT "WorkerAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Terminal" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Terminal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Worker_dni_key" ON "Worker"("dni");

-- AddForeignKey
ALTER TABLE "WorkShiftCalculatedValue" ADD CONSTRAINT "WorkShiftCalculatedValue_workShiftBaseValueId_fkey" FOREIGN KEY ("workShiftBaseValueId") REFERENCES "WorkShiftBaseValue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerAssignment" ADD CONSTRAINT "WorkerAssignment_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerAssignment" ADD CONSTRAINT "WorkerAssignment_workShiftId_fkey" FOREIGN KEY ("workShiftId") REFERENCES "WorkShift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerAssignment" ADD CONSTRAINT "WorkerAssignment_terminalId_fkey" FOREIGN KEY ("terminalId") REFERENCES "Terminal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
