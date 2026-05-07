/*
  Warnings:

  - You are about to drop the `serviceproductoffer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `serviceproductoffer` DROP FOREIGN KEY `ServiceProductOffer_proposalId_fkey`;

-- DropIndex
DROP INDEX `OfferEntry_serviceProductOfferId_fkey` ON `OfferEntry`;

-- DropTable
DROP TABLE `serviceproductoffer`;

-- CreateTable
CREATE TABLE `ServiceProductOffer` (
    `serviceProductOfferId` INTEGER NOT NULL AUTO_INCREMENT,
    `proposalId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `isMultipleChoice` BOOLEAN NOT NULL DEFAULT false,
    `subTotal` DECIMAL(10, 2) NOT NULL,
    `discountType` VARCHAR(191) NOT NULL,
    `discountValue` DECIMAL(10, 2) NULL,
    `discountDescription` VARCHAR(191) NULL,
    `taxableAmount` DECIMAL(10, 2) NOT NULL,
    `taxApplicable` BOOLEAN NOT NULL,
    `taxRate` DECIMAL(10, 2) NULL,
    `taxAmount` DECIMAL(10, 2) NULL,
    `taxReason` VARCHAR(191) NULL,
    `finalPrice` DECIMAL(10, 2) NOT NULL,
    `paymentTerms` VARCHAR(191) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`serviceProductOfferId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ServiceProductOffer` ADD CONSTRAINT `ServiceProductOffer_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `Proposal`(`proposalId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OfferEntry` ADD CONSTRAINT `OfferEntry_serviceProductOfferId_fkey` FOREIGN KEY (`serviceProductOfferId`) REFERENCES `ServiceProductOffer`(`serviceProductOfferId`) ON DELETE CASCADE ON UPDATE CASCADE;
