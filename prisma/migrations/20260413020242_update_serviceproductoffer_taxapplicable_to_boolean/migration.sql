/*
  Warnings:

  - You are about to alter the column `taxApplicable` on the `serviceproductoffer` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `serviceproductoffer` MODIFY `taxApplicable` BOOLEAN NOT NULL;
