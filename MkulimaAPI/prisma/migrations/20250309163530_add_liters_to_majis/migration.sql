/*
  Warnings:

  - Added the required column `liters` to the `Majis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Majis" ADD COLUMN     "liters" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "units" SET DATA TYPE DOUBLE PRECISION;
