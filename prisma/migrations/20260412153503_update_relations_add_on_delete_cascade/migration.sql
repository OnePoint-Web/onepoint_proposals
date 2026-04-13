-- DropForeignKey
ALTER TABLE `selectedmember` DROP FOREIGN KEY `SelectedMember_proposalId_fkey`;

-- DropForeignKey
ALTER TABLE `timelinescopeitem` DROP FOREIGN KEY `TimelineScopeItem_timelineId_fkey`;

-- DropIndex
DROP INDEX `SelectedMember_proposalId_fkey` ON `selectedmember`;

-- DropIndex
DROP INDEX `TimelineScopeItem_timelineId_fkey` ON `timelinescopeitem`;

-- AddForeignKey
ALTER TABLE `SelectedMember` ADD CONSTRAINT `SelectedMember_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `Proposal`(`proposalId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimelineScopeItem` ADD CONSTRAINT `TimelineScopeItem_timelineId_fkey` FOREIGN KEY (`timelineId`) REFERENCES `Timeline`(`timelineId`) ON DELETE CASCADE ON UPDATE CASCADE;
