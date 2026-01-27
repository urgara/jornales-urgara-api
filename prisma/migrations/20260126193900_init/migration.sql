-- CreateEnum
CREATE TYPE "Role" AS ENUM ('1', '5');

-- CreateTable
CREATE TABLE "Admin" (
    "id" UUID NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "surname" VARCHAR(30) NOT NULL,
    "dni" VARCHAR(9) NOT NULL,
    "password" VARCHAR NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ,
    "role" "Role" NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "adminId" UUID NOT NULL,
    "ip" TEXT NOT NULL,
    "agent" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_dni_key" ON "Admin"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
