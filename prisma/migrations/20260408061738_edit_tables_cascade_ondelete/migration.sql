-- DropForeignKey
ALTER TABLE `dealentry` DROP FOREIGN KEY `DealEntry_dealItemId_fkey`;

-- DropForeignKey
ALTER TABLE `dealitem` DROP FOREIGN KEY `DealItem_packageId_fkey`;

-- DropForeignKey
ALTER TABLE `offerentry` DROP FOREIGN KEY `OfferEntry_serviceProductOfferId_fkey`;

-- DropForeignKey
ALTER TABLE `packagedealentry` DROP FOREIGN KEY `PackageDealEntry_packageDealItemId_fkey`;

-- DropForeignKey
ALTER TABLE `packagedealitem` DROP FOREIGN KEY `PackageDealItem_slaOfferId_fkey`;

-- DropForeignKey
ALTER TABLE `serviceproductoffer` DROP FOREIGN KEY `ServiceProductOffer_proposalId_fkey`;

-- DropForeignKey
ALTER TABLE `slaoffer` DROP FOREIGN KEY `SlaOffer_proposalId_fkey`;

-- DropForeignKey
ALTER TABLE `timeline` DROP FOREIGN KEY `Timeline_proposalId_fkey`;

-- DropIndex
DROP INDEX `DealEntry_dealItemId_fkey` ON `dealentry`;

-- DropIndex
DROP INDEX `DealItem_packageId_fkey` ON `dealitem`;

-- DropIndex
DROP INDEX `OfferEntry_serviceProductOfferId_fkey` ON `offerentry`;

-- DropIndex
DROP INDEX `PackageDealEntry_packageDealItemId_fkey` ON `packagedealentry`;

-- DropIndex
DROP INDEX `PackageDealItem_slaOfferId_fkey` ON `packagedealitem`;

-- DropIndex
DROP INDEX `ServiceProductOffer_proposalId_fkey` ON `serviceproductoffer`;

-- DropIndex
DROP INDEX `SlaOffer_proposalId_fkey` ON `slaoffer`;

-- DropIndex
DROP INDEX `Timeline_proposalId_fkey` ON `timeline`;

-- AddForeignKey
ALTER TABLE `Timeline` ADD CONSTRAINT `Timeline_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `Proposal`(`proposalId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SlaOffer` ADD CONSTRAINT `SlaOffer_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `Proposal`(`proposalId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DealItem` ADD CONSTRAINT `DealItem_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `Package`(`packageId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DealEntry` ADD CONSTRAINT `DealEntry_dealItemId_fkey` FOREIGN KEY (`dealItemId`) REFERENCES `DealItem`(`dealItemId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PackageDealItem` ADD CONSTRAINT `PackageDealItem_slaOfferId_fkey` FOREIGN KEY (`slaOfferId`) REFERENCES `SlaOffer`(`slaOfferId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PackageDealEntry` ADD CONSTRAINT `PackageDealEntry_packageDealItemId_fkey` FOREIGN KEY (`packageDealItemId`) REFERENCES `PackageDealItem`(`packageDealItemId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceProductOffer` ADD CONSTRAINT `ServiceProductOffer_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `Proposal`(`proposalId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OfferEntry` ADD CONSTRAINT `OfferEntry_serviceProductOfferId_fkey` FOREIGN KEY (`serviceProductOfferId`) REFERENCES `ServiceProductOffer`(`serviceProductOfferId`) ON DELETE CASCADE ON UPDATE CASCADE;
