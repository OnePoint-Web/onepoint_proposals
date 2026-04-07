/*
  Warnings:

  - You are about to drop the column `selectedPackageId` on the `slaoffer` table. All the data in the column will be lost.
  - Added the required column `slaPackage` to the `SlaOffer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `slaoffer` DROP FOREIGN KEY `SlaOffer_selectedPackageId_fkey`;

-- DropIndex
DROP INDEX `SlaOffer_selectedPackageId_fkey` ON `slaoffer`;

-- AlterTable
ALTER TABLE `package` MODIFY `proposedSolution` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `slaoffer` DROP COLUMN `selectedPackageId`,
    ADD COLUMN `slaPackage` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `accountStatus` INTEGER NOT NULL DEFAULT 1;
