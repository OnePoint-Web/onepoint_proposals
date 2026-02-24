-- CreateTable
CREATE TABLE `User` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `userEmail` VARCHAR(191) NOT NULL,
    `userPassword` VARCHAR(191) NOT NULL,
    `accountStatus` VARCHAR(191) NOT NULL,
    `accountRole` INTEGER NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdated` DATETIME(3) NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_userEmail_key`(`userEmail`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `roleId` INTEGER NOT NULL AUTO_INCREMENT,
    `role` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientProfile` (
    `clientId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `companyEmail` VARCHAR(191) NULL,
    `companyAddress` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ClientProfile_userId_idx`(`userId`),
    PRIMARY KEY (`clientId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Proposal` (
    `proposalId` INTEGER NOT NULL AUTO_INCREMENT,
    `clientId` INTEGER NOT NULL,
    `clientType` VARCHAR(191) NOT NULL,
    `proposalTitle` VARCHAR(191) NOT NULL,
    `proposalType` VARCHAR(191) NOT NULL,
    `executiveSummary` LONGTEXT NOT NULL,
    `goalsAndObjectives` LONGTEXT NOT NULL,
    `proposedSolution` LONGTEXT NOT NULL,
    `statusId` INTEGER NOT NULL,
    `createdBy` INTEGER NOT NULL,
    `statusUpdated` DATETIME(3) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdated` DATETIME(3) NULL,

    UNIQUE INDEX `Proposal_proposalTitle_key`(`proposalTitle`),
    PRIMARY KEY (`proposalId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProposalStatus` (
    `statusId` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`statusId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProposalView` (
    `viewId` INTEGER NOT NULL AUTO_INCREMENT,
    `proposalId` INTEGER NOT NULL,
    `clientId` INTEGER NOT NULL,
    `dateViewed` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`viewId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SelectedMember` (
    `selectedMemberId` INTEGER NOT NULL AUTO_INCREMENT,
    `proposalId` INTEGER NOT NULL,
    `memberId` INTEGER NOT NULL,

    PRIMARY KEY (`selectedMemberId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeamMember` (
    `memberId` INTEGER NOT NULL AUTO_INCREMENT,
    `memberName` VARCHAR(191) NOT NULL,
    `memberRole` VARCHAR(191) NOT NULL,
    `memberImage` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdated` DATETIME(3) NULL,

    PRIMARY KEY (`memberId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Timeline` (
    `timelineId` INTEGER NOT NULL AUTO_INCREMENT,
    `proposalId` INTEGER NOT NULL,
    `timeFrame` VARCHAR(191) NOT NULL,
    `progress` INTEGER NOT NULL,
    `assignedTo` VARCHAR(191) NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdated` DATETIME(3) NULL,

    PRIMARY KEY (`timelineId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TimelineScopeItem` (
    `scopeItemId` INTEGER NOT NULL AUTO_INCREMENT,
    `timelineId` INTEGER NOT NULL,
    `scope` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`scopeItemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SlaOffer` (
    `slaOfferId` INTEGER NOT NULL AUTO_INCREMENT,
    `proposalId` INTEGER NOT NULL,
    `selectedPackageId` INTEGER NOT NULL,
    `basePrice` DECIMAL(10, 2) NOT NULL,
    `discountType` VARCHAR(191) NOT NULL,
    `discountValue` DECIMAL(10, 2) NULL,
    `discountDescription` VARCHAR(191) NULL,
    `taxableAmount` DECIMAL(10, 2) NOT NULL,
    `taxApplicable` BOOLEAN NOT NULL,
    `taxRate` DECIMAL(10, 2) NOT NULL,
    `taxAmount` DECIMAL(10, 2) NOT NULL,
    `taxReason` VARCHAR(191) NOT NULL,
    `finalPrice` DECIMAL(10, 2) NOT NULL,
    `paymentTerms` VARCHAR(191) NOT NULL,
    `dateCreate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`slaOfferId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Package` (
    `packageId` INTEGER NOT NULL AUTO_INCREMENT,
    `package` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `proposedSolution` LONGTEXT NOT NULL,
    `basePrice` DECIMAL(10, 2) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdated` DATETIME(3) NULL,

    UNIQUE INDEX `Package_package_key`(`package`),
    PRIMARY KEY (`packageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DealItem` (
    `dealItemId` INTEGER NOT NULL AUTO_INCREMENT,
    `packageId` INTEGER NOT NULL,
    `dealItem` VARCHAR(191) NOT NULL,
    `itemType` VARCHAR(191) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`dealItemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DealEntry` (
    `itemEntryId` INTEGER NOT NULL AUTO_INCREMENT,
    `dealItemId` INTEGER NOT NULL,
    `itemEntry` VARCHAR(191) NOT NULL,
    `displayOrder` INTEGER NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`itemEntryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PackageDealItem` (
    `packageDealItemId` INTEGER NOT NULL AUTO_INCREMENT,
    `slaOfferId` INTEGER NOT NULL,
    `isCustom` BOOLEAN NOT NULL DEFAULT false,
    `item` VARCHAR(191) NOT NULL,
    `itemType` VARCHAR(191) NOT NULL,
    `displayOrder` INTEGER NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`packageDealItemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PackageDealEntry` (
    `itemEntryId` INTEGER NOT NULL AUTO_INCREMENT,
    `packageDealItemId` INTEGER NOT NULL,
    `itemEntry` VARCHAR(191) NOT NULL,
    `displayOrder` INTEGER NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`itemEntryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceProductOffer` (
    `serviceProductOfferId` INTEGER NOT NULL AUTO_INCREMENT,
    `proposalId` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `isMultipleChoice` BOOLEAN NOT NULL DEFAULT false,
    `subTotal` DECIMAL(10, 2) NOT NULL,
    `discountType` VARCHAR(191) NOT NULL,
    `discountValue` DECIMAL(10, 2) NULL,
    `discountDescription` VARCHAR(191) NULL,
    `taxableAmount` DECIMAL(10, 2) NOT NULL,
    `taxApplicable` DECIMAL(10, 2) NOT NULL,
    `taxRate` DECIMAL(10, 2) NULL,
    `taxAmount` DECIMAL(10, 2) NULL,
    `taxReason` VARCHAR(191) NULL,
    `finalPrice` DECIMAL(10, 2) NOT NULL,
    `paymentTerms` VARCHAR(191) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`serviceProductOfferId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OfferEntry` (
    `offerEntryId` INTEGER NOT NULL AUTO_INCREMENT,
    `serviceProductOfferId` INTEGER NOT NULL,
    `serviceProductItem` VARCHAR(191) NOT NULL,
    `itemImage` VARCHAR(191) NULL,
    `itemPrice` DECIMAL(10, 2) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `totalPrice` DECIMAL(10, 2) NOT NULL,
    `itemDiscountType` VARCHAR(191) NULL,
    `itemDiscountValue` DECIMAL(10, 2) NULL,
    `itemDiscountDescription` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `displayOrder` INTEGER NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`offerEntryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `notificationId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `entityType` VARCHAR(191) NOT NULL,
    `entityId` INTEGER NOT NULL,
    `notificationType` VARCHAR(191) NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`notificationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActivityLogs` (
    `activityId` INTEGER NOT NULL AUTO_INCREMENT,
    `entityType` VARCHAR(191) NOT NULL,
    `entityId` INTEGER NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `performedBy` INTEGER NOT NULL,
    `performedByRole` VARCHAR(191) NOT NULL,
    `metaData` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`activityId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NotificationRules` (
    `ruleId` INTEGER NOT NULL AUTO_INCREMENT,
    `eventAction` VARCHAR(191) NOT NULL,
    `entityType` VARCHAR(191) NOT NULL,
    `notifyRole` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`ruleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_accountRole_fkey` FOREIGN KEY (`accountRole`) REFERENCES `Role`(`roleId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientProfile` ADD CONSTRAINT `ClientProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proposal` ADD CONSTRAINT `Proposal_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `ClientProfile`(`clientId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proposal` ADD CONSTRAINT `Proposal_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `ProposalStatus`(`statusId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proposal` ADD CONSTRAINT `Proposal_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProposalView` ADD CONSTRAINT `ProposalView_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `Proposal`(`proposalId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelectedMember` ADD CONSTRAINT `SelectedMember_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `Proposal`(`proposalId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelectedMember` ADD CONSTRAINT `SelectedMember_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `TeamMember`(`memberId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Timeline` ADD CONSTRAINT `Timeline_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `Proposal`(`proposalId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimelineScopeItem` ADD CONSTRAINT `TimelineScopeItem_timelineId_fkey` FOREIGN KEY (`timelineId`) REFERENCES `Timeline`(`timelineId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SlaOffer` ADD CONSTRAINT `SlaOffer_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `Proposal`(`proposalId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SlaOffer` ADD CONSTRAINT `SlaOffer_selectedPackageId_fkey` FOREIGN KEY (`selectedPackageId`) REFERENCES `Package`(`packageId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DealItem` ADD CONSTRAINT `DealItem_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `Package`(`packageId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DealEntry` ADD CONSTRAINT `DealEntry_dealItemId_fkey` FOREIGN KEY (`dealItemId`) REFERENCES `DealItem`(`dealItemId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PackageDealItem` ADD CONSTRAINT `PackageDealItem_slaOfferId_fkey` FOREIGN KEY (`slaOfferId`) REFERENCES `SlaOffer`(`slaOfferId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PackageDealEntry` ADD CONSTRAINT `PackageDealEntry_packageDealItemId_fkey` FOREIGN KEY (`packageDealItemId`) REFERENCES `PackageDealItem`(`packageDealItemId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceProductOffer` ADD CONSTRAINT `ServiceProductOffer_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `Proposal`(`proposalId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OfferEntry` ADD CONSTRAINT `OfferEntry_serviceProductOfferId_fkey` FOREIGN KEY (`serviceProductOfferId`) REFERENCES `ServiceProductOffer`(`serviceProductOfferId`) ON DELETE RESTRICT ON UPDATE CASCADE;
