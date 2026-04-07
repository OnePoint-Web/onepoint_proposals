/*
  Warnings:

  - Added the required column `displayOrder` to the `DealItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dealitem` ADD COLUMN `displayOrder` INTEGER NOT NULL;
