-- AlterTable
ALTER TABLE `ActivityLogs` MODIFY `entityId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Notification` MODIFY `entityId` VARCHAR(191) NOT NULL;
