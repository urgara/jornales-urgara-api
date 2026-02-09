-- CreateTable
CREATE TABLE "WorkShiftBaseValue" (
    "id" UUID NOT NULL,
    "remunerated" DECIMAL(8,2) NOT NULL,
    "notRemunerated" DECIMAL(8,2) NOT NULL,
    "startDate" TIMESTAMPTZ NOT NULL,
    "endDate" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "WorkShiftBaseValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkShiftCalculatedValue" (
    "workShiftBaseValueId" UUID NOT NULL,
    "coefficient" DECIMAL(5,2) NOT NULL,

    CONSTRAINT "WorkShiftCalculatedValue_pkey" PRIMARY KEY ("coefficient","workShiftBaseValueId")
);

-- AddForeignKey
ALTER TABLE "WorkShiftCalculatedValue" ADD CONSTRAINT "WorkShiftCalculatedValue_workShiftBaseValueId_fkey" FOREIGN KEY ("workShiftBaseValueId") REFERENCES "WorkShiftBaseValue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
