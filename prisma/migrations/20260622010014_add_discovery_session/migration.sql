-- CreateTable
CREATE TABLE `DiscoverySession` (
    `sessionId` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `clientName` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NULL,
    `industry` VARCHAR(191) NULL,
    `services` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `additionalContext` TEXT NULL,
    `overview` TEXT NULL,
    `questions` TEXT NULL,
    `createdBy` INTEGER NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdated` DATETIME(3) NOT NULL,

    PRIMARY KEY (`sessionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DiscoverySession` ADD CONSTRAINT `DiscoverySession_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
