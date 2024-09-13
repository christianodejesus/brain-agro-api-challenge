/*
  Warnings:

  - You are about to drop the `FarmProductor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "FarmProductor";

-- CreateTable
CREATE TABLE "AgriculturalProductor" (
    "id" SERIAL NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "productorName" TEXT NOT NULL,
    "farmName" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "farmTotalArea" INTEGER NOT NULL,
    "farmUsefulArea" INTEGER NOT NULL,
    "farmForestArea" INTEGER NOT NULL,
    "farmCrops" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgriculturalProductor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgriculturalProductor_documentNumber_key" ON "AgriculturalProductor"("documentNumber");
