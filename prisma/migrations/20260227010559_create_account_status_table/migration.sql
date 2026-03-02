/*
  Warnings:

  - You are about to alter the column `accountStatus` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `accountStatus` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `AccountStatus` (
    `statusId` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`statusId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO Accountstatus (statusId, status) VALUES
(1, 'Active'),
(2, 'Inactive'),
(3, 'Suspended');

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_accountStatus_fkey` FOREIGN KEY (`accountStatus`) REFERENCES `AccountStatus`(`statusId`) ON DELETE RESTRICT ON UPDATE CASCADE;
