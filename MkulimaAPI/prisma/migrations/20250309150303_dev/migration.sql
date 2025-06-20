/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Token" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "deleted_at";
