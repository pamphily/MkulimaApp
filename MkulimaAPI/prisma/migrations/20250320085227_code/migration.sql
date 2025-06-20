/*
  Warnings:

  - You are about to drop the column `subscriber_id` on the `Meter` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Meter" DROP CONSTRAINT "Meter_subscriber_id_fkey";

-- AlterTable
ALTER TABLE "Meter" DROP COLUMN "subscriber_id",
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "Subscriber" ADD COLUMN     "meter" TEXT[];
