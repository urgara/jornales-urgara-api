-- CreateTable
CREATE TABLE "Locality" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "province" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "Locality_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "localityId" INTEGER;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_localityId_fkey" FOREIGN KEY ("localityId") REFERENCES "Locality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
