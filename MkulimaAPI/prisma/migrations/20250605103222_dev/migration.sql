/*
  Warnings:

  - You are about to drop the column `meters` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `signature` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Card` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Jobs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Majis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Manager` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Meter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MeterReading` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `POS` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscriber` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubscriberLoan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Token` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Wakala` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Meter" DROP CONSTRAINT "Meter_location_id_fkey";

-- DropForeignKey
ALTER TABLE "Meter" DROP CONSTRAINT "Meter_manager_id_fkey";

-- DropForeignKey
ALTER TABLE "POS" DROP CONSTRAINT "POS_sales_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "meters",
DROP COLUMN "signature";

-- DropTable
DROP TABLE "Card";

-- DropTable
DROP TABLE "Jobs";

-- DropTable
DROP TABLE "Location";

-- DropTable
DROP TABLE "Majis";

-- DropTable
DROP TABLE "Manager";

-- DropTable
DROP TABLE "Meter";

-- DropTable
DROP TABLE "MeterReading";

-- DropTable
DROP TABLE "POS";

-- DropTable
DROP TABLE "Settings";

-- DropTable
DROP TABLE "Subscriber";

-- DropTable
DROP TABLE "SubscriberLoan";

-- DropTable
DROP TABLE "Token";

-- DropTable
DROP TABLE "Transaction";

-- DropTable
DROP TABLE "Wakala";

-- DropEnum
DROP TYPE "MeterStatus";

-- DropEnum
DROP TYPE "MeterType";

-- DropEnum
DROP TYPE "ReadingStatus";

-- DropEnum
DROP TYPE "Role";
