/*
  Warnings:

  - A unique constraint covering the columns `[doc]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "InventoryItem" ADD COLUMN     "comprimento" DOUBLE PRECISION,
ADD COLUMN     "diametro" DOUBLE PRECISION,
ADD COLUMN     "gramatura" DOUBLE PRECISION,
ADD COLUMN     "largura" DOUBLE PRECISION,
ADD COLUMN     "tubete" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "SalesOrderItem" ADD COLUMN     "diameter" INTEGER,
ADD COLUMN     "grammage" INTEGER,
ADD COLUMN     "length" INTEGER,
ADD COLUMN     "tube" INTEGER,
ADD COLUMN     "width" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "doc" TEXT;

-- CreateTable
CREATE TABLE "SalesOrderStatusHistory" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "messages" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "SalesOrderStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SalesOrderStatusHistory_orderId_idx" ON "SalesOrderStatusHistory"("orderId");

-- CreateIndex
CREATE INDEX "SalesOrderStatusHistory_changedAt_idx" ON "SalesOrderStatusHistory"("changedAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_doc_key" ON "User"("doc");

-- AddForeignKey
ALTER TABLE "SalesOrderStatusHistory" ADD CONSTRAINT "SalesOrderStatusHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "SalesOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
