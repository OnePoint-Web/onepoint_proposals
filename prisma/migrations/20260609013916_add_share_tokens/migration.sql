/*
  Warnings:

  - Added the required column `proposalId` to the `ProposalSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ProposalSession` ADD COLUMN `proposalId` INTEGER NOT NULL,
    ADD COLUMN `tokenId` INTEGER NULL,
    MODIFY `clientId` INTEGER NULL,
    MODIFY `durationSeconds` INTEGER NULL;

-- AlterTable
ALTER TABLE `ProposalView` ADD COLUMN `tokenId` INTEGER NULL,
    MODIFY `clientId` INTEGER NULL;

-- CreateTable
CREATE TABLE `ProposalShareToken` (
    `tokenId` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,
    `proposalId` INTEGER NOT NULL,
    `recipientEmail` VARCHAR(191) NOT NULL,
    `isPortalUser` BOOLEAN NOT NULL DEFAULT false,
    `portalUserId` INTEGER NULL,
    `usedAt` DATETIME(3) NULL,
    `expiresAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ProposalShareToken_token_key`(`token`),
    PRIMARY KEY (`tokenId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProposalShareToken` ADD CONSTRAINT `ProposalShareToken_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `Proposal`(`proposalId`) ON DELETE CASCADE ON UPDATE CASCADE;
