-- CreateTable
CREATE TABLE "Ship" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "Ship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ship_name_key" ON "Ship"("name");
