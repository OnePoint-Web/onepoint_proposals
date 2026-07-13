-- AlterTable
ALTER TABLE `OfferEntry` MODIFY `itemDiscountDescription` LONGTEXT NULL,
    MODIFY `description` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `PackageDealEntry` MODIFY `itemEntry` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `PackageDealItem` MODIFY `item` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `ServiceProductOffer` MODIFY `discountDescription` LONGTEXT NULL;
