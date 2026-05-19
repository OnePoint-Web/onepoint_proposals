/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `ClientProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ClientProfile_userId_key` ON `ClientProfile`(`userId`);
