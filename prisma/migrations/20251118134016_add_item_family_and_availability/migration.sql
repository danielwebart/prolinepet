-- AlterTable
ALTER TABLE "InventoryItem" ADD COLUMN     "commercialFamilyId" INTEGER;

-- CreateTable
CREATE TABLE "EntityModuleItem" (
    "id" SERIAL NOT NULL,
    "entityModuleId" INTEGER NOT NULL,
    "inventoryItemId" INTEGER NOT NULL,
    "allowed" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EntityModuleItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EntityModuleItem_entityModuleId_inventoryItemId_key" ON "EntityModuleItem"("entityModuleId", "inventoryItemId");

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_commercialFamilyId_fkey" FOREIGN KEY ("commercialFamilyId") REFERENCES "CommercialFamily"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityModuleItem" ADD CONSTRAINT "EntityModuleItem_entityModuleId_fkey" FOREIGN KEY ("entityModuleId") REFERENCES "EntityModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityModuleItem" ADD CONSTRAINT "EntityModuleItem_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
