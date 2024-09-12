-- CreateTable
CREATE TABLE "FarmProductor" (
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

    CONSTRAINT "FarmProductor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FarmProductor_documentNumber_key" ON "FarmProductor"("documentNumber");
