-- CreateEnum
CREATE TYPE "LotStatus" AS ENUM ('CONFORME', 'EN_ALERTE', 'PERIME');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('TEMPERATURE', 'HUMIDITY', 'EXPIRED_LOT');

-- CreateTable
CREATE TABLE "CoffeeLot" (
    "id" SERIAL NOT NULL,
    "lotCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Brazil',
    "warehouseName" TEXT NOT NULL,
    "storageDate" TIMESTAMP(3) NOT NULL,
    "status" "LotStatus" NOT NULL DEFAULT 'CONFORME',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoffeeLot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SensorMeasurement" (
    "id" SERIAL NOT NULL,
    "warehouseName" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,
    "measuredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SensorMeasurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" SERIAL NOT NULL,
    "type" "AlertType" NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CoffeeLot_lotCode_key" ON "CoffeeLot"("lotCode");