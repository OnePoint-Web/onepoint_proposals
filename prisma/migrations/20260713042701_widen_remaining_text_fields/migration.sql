-- AlterTable
ALTER TABLE `DealEntry` MODIFY `itemEntry` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `DealItem` MODIFY `dealItem` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `SlaOffer` MODIFY `discountDescription` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `TeamMember` MODIFY `description` LONGTEXT NOT NULL;
