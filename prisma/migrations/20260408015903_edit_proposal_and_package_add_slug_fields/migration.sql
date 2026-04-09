/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Package` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Proposal` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Proposal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `package` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `proposal` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Package_slug_key` ON `Package`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `Proposal_slug_key` ON `Proposal`(`slug`);
