-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "salesRepAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastEntityId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "location" TEXT,
    "description" TEXT,
    "manufacturer" TEXT,
    "model" TEXT,
    "year" INTEGER,
    "criticality" TEXT,
    "parentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "unit" TEXT,
    "minStock" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workOrderId" INTEGER NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetAttachment" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assetId" INTEGER NOT NULL,

    CONSTRAINT "AssetAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkOrder" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "assetId" INTEGER,
    "rootAssetId" INTEGER,
    "scheduledAt" TIMESTAMP(3),
    "sector" TEXT,
    "maintenanceType" TEXT,
    "openedAt" TIMESTAMP(3),
    "assetCondition" TEXT,
    "personnelCount" INTEGER,
    "estimatedDurationMinutes" INTEGER,
    "tasks" TEXT,
    "materials" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "mttr" INTEGER,
    "assignedUserId" INTEGER,
    "usedEquipment" TEXT,
    "maintainedComponents" TEXT,
    "executionDescription" TEXT,
    "observations" TEXT,
    "technicianSignature" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entity" (
    "id" SERIAL NOT NULL,
    "cnpj" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "parentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" SERIAL NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityModule" (
    "id" SERIAL NOT NULL,
    "entityId" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL,

    CONSTRAINT "EntityModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityModuleProgram" (
    "id" SERIAL NOT NULL,
    "entityModuleId" INTEGER NOT NULL,
    "programId" INTEGER NOT NULL,
    "allowed" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EntityModuleProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserEntity" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "entityId" INTEGER NOT NULL,

    CONSTRAINT "UserEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserEntityModule" (
    "id" SERIAL NOT NULL,
    "userEntityId" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "allowed" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserEntityModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserEntityModuleProgram" (
    "id" SERIAL NOT NULL,
    "userEntityModuleId" INTEGER NOT NULL,
    "programId" INTEGER NOT NULL,
    "allowed" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserEntityModuleProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesOrder" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerName" TEXT NOT NULL,
    "customerDoc" TEXT,
    "paymentTerms" TEXT,
    "carrier" TEXT,
    "deliveryDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdById" INTEGER,
    "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesOrderItem" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "inventoryItemId" INTEGER,
    "sku" TEXT,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit" TEXT,
    "unitPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountPct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lineTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "SalesOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "doc" TEXT,
    "name" TEXT NOT NULL,
    "cep" TEXT,
    "logradouro" TEXT,
    "numero" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserClientRep" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserClientRep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Complaint" (
    "id" SERIAL NOT NULL,
    "code" TEXT,
    "entityId" INTEGER NOT NULL,
    "createdById" INTEGER,
    "division" TEXT,
    "type" TEXT,
    "phase" TEXT,
    "dueDate" TIMESTAMP(3),
    "canceled" BOOLEAN NOT NULL DEFAULT false,
    "cancelReason" TEXT,
    "dateSac" TIMESTAMP(3),
    "dateReceived" TIMESTAMP(3),
    "counterpartyType" TEXT,
    "counterpartyCode" TEXT,
    "counterpartyName" TEXT,
    "city" TEXT,
    "uf" TEXT,
    "contactName" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "representativeName" TEXT,
    "representativeEmail" TEXT,
    "carrier" TEXT,
    "freightType" TEXT,
    "attendant" TEXT,
    "reference" TEXT,
    "classification" TEXT,
    "occurrencePattern" TEXT,
    "occurrenceCode" TEXT,
    "occurrenceText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplaintItem" (
    "id" SERIAL NOT NULL,
    "complaintId" INTEGER NOT NULL,
    "invoiceNumber" TEXT,
    "sft" TEXT,
    "orderNumber" TEXT,
    "spd" TEXT,
    "emissionDate" TIMESTAMP(3),
    "description" TEXT,
    "uom" TEXT,
    "unitPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "qtyInvoiced" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "divergenceQty" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "divergenceValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "divergencePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "ComplaintItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommercialFamily" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "CommercialFamily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentTerm" (
    "id" SERIAL NOT NULL,
    "code" INTEGER,
    "description" TEXT NOT NULL,
    "installments" INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "PaymentTerm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "token" VARCHAR(64) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "expires" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_code_key" ON "Asset"("code");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryItem_sku_key" ON "InventoryItem"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Entity_cnpj_key" ON "Entity"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Module_code_key" ON "Module"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Program_code_key" ON "Program"("code");

-- CreateIndex
CREATE UNIQUE INDEX "EntityModule_entityId_moduleId_key" ON "EntityModule"("entityId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "EntityModuleProgram_entityModuleId_programId_key" ON "EntityModuleProgram"("entityModuleId", "programId");

-- CreateIndex
CREATE UNIQUE INDEX "UserEntity_userId_entityId_key" ON "UserEntity"("userId", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "UserEntityModule_userEntityId_moduleId_key" ON "UserEntityModule"("userEntityId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserEntityModuleProgram_userEntityModuleId_programId_key" ON "UserEntityModuleProgram"("userEntityModuleId", "programId");

-- CreateIndex
CREATE UNIQUE INDEX "SalesOrder_code_key" ON "SalesOrder"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Client_doc_key" ON "Client"("doc");

-- CreateIndex
CREATE INDEX "Client_name_idx" ON "Client"("name");

-- CreateIndex
CREATE INDEX "Client_cidade_estado_idx" ON "Client"("cidade", "estado");

-- CreateIndex
CREATE UNIQUE INDEX "UserClientRep_userId_clientId_key" ON "UserClientRep"("userId", "clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Complaint_code_key" ON "Complaint"("code");

-- CreateIndex
CREATE INDEX "CommercialFamily_description_idx" ON "CommercialFamily"("description");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentTerm_code_key" ON "PaymentTerm"("code");

-- CreateIndex
CREATE INDEX "PaymentTerm_description_idx" ON "PaymentTerm"("description");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_idx" ON "users"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_lastEntityId_fkey" FOREIGN KEY ("lastEntityId") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "WorkOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAttachment" ADD CONSTRAINT "AssetAttachment_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrder" ADD CONSTRAINT "WorkOrder_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrder" ADD CONSTRAINT "WorkOrder_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityModule" ADD CONSTRAINT "EntityModule_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityModule" ADD CONSTRAINT "EntityModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityModuleProgram" ADD CONSTRAINT "EntityModuleProgram_entityModuleId_fkey" FOREIGN KEY ("entityModuleId") REFERENCES "EntityModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityModuleProgram" ADD CONSTRAINT "EntityModuleProgram_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEntity" ADD CONSTRAINT "UserEntity_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEntity" ADD CONSTRAINT "UserEntity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEntityModule" ADD CONSTRAINT "UserEntityModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEntityModule" ADD CONSTRAINT "UserEntityModule_userEntityId_fkey" FOREIGN KEY ("userEntityId") REFERENCES "UserEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEntityModuleProgram" ADD CONSTRAINT "UserEntityModuleProgram_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEntityModuleProgram" ADD CONSTRAINT "UserEntityModuleProgram_userEntityModuleId_fkey" FOREIGN KEY ("userEntityModuleId") REFERENCES "UserEntityModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesOrder" ADD CONSTRAINT "SalesOrder_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesOrderItem" ADD CONSTRAINT "SalesOrderItem_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesOrderItem" ADD CONSTRAINT "SalesOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "SalesOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserClientRep" ADD CONSTRAINT "UserClientRep_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserClientRep" ADD CONSTRAINT "UserClientRep_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintItem" ADD CONSTRAINT "ComplaintItem_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "Complaint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
