/*
  Warnings:

  - You are about to drop the `NotificationRules` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `Notification` ADD COLUMN `readtAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Proposal` ADD COLUMN `firstViewedAt` DATETIME(3) NULL,
    ADD COLUMN `lastViewedAt` DATETIME(3) NULL,
    ADD COLUMN `viewCount` INTEGER NULL;

-- DropTable
DROP TABLE `NotificationRules`;

-- CreateTable
CREATE TABLE `ProposalSession` (
    `sessionId` INTEGER NOT NULL AUTO_INCREMENT,
    `clientId` INTEGER NOT NULL,
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastActivityAt` DATETIME(3) NULL,
    `endedAt` DATETIME(3) NULL,
    `durationSeconds` INTEGER NOT NULL,

    PRIMARY KEY (`sessionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
