-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER');

-- CreateEnum
CREATE TYPE "MeterType" AS ENUM ('TOKEN_BASED', 'DIRECT_TOPUP');

-- CreateEnum
CREATE TYPE "MeterStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DISCONNECTED');

-- CreateEnum
CREATE TYPE "ReadingStatus" AS ENUM ('NORMAL', 'ERROR', 'WARNING');

-- CreateTable
CREATE TABLE "Authentications" (
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Authentications_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '0',
    "role" TEXT NOT NULL DEFAULT 'USER',
    "full_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "signature" TEXT,
    "meters" BIGINT[],
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meter" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "serial" TEXT NOT NULL,
    "type" TEXT,
    "status" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "error" TEXT,
    "description" TEXT,
    "apiKey" TEXT,
    "price_per_unit" INTEGER,
    "calibration_factor" DOUBLE PRECISION,
    "lock_meter" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "manager_id" TEXT,
    "subscriber_id" TEXT,
    "location_id" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Meter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" TEXT NOT NULL,
    "account_no" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "balance" INTEGER DEFAULT 0,
    "ppu" INTEGER DEFAULT 0,
    "type" TEXT NOT NULL,
    "region" TEXT,
    "district" TEXT,
    "ward" TEXT,
    "street" TEXT,
    "house_no" TEXT,
    "status" TEXT NOT NULL DEFAULT 'inactive',
    "supplier" TEXT NOT NULL,
    "profile" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriberLoan" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "paid" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "rate" INTEGER NOT NULL,
    "subscriber_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SubscriberLoan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeterReading" (
    "id" TEXT NOT NULL,
    "meter" TEXT NOT NULL,
    "liters" INTEGER NOT NULL,
    "units" INTEGER NOT NULL,
    "revenue" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MeterReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "ppu" TEXT,
    "size" TEXT,
    "apiKey" TEXT,
    "cf" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "firmware" TEXT NOT NULL,
    "production" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wakala" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "imei" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "float" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Wakala_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manager" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "POS" (
    "id" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "imei" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sales_id" TEXT,

    CONSTRAINT "POS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "serial" TEXT NOT NULL,
    "unique" TEXT,
    "units" DOUBLE PRECISION,
    "amount" INTEGER NOT NULL,
    "liters" DOUBLE PRECISION NOT NULL,
    "token" TEXT,
    "status" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "supplier" TEXT,
    "phone" TEXT NOT NULL,
    "integrator_id" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Majis" (
    "id" TEXT NOT NULL,
    "paymentReceipt" TEXT NOT NULL,
    "amountPaid" INTEGER NOT NULL,
    "units" INTEGER NOT NULL,
    "token" TEXT,
    "meterNumber" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sys_id" TEXT NOT NULL,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Majis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "coordinates" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "serial" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "account_no" TEXT NOT NULL DEFAULT '',
    "units" DOUBLE PRECISION DEFAULT 0.0,
    "price" INTEGER,
    "liters" DOUBLE PRECISION,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "pin" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "serial" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jobs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tracking" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "value" TEXT NOT NULL DEFAULT '0',
    "meter" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Meter_serial_key" ON "Meter"("serial");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_account_no_key" ON "Subscriber"("account_no");

-- CreateIndex
CREATE UNIQUE INDEX "Wakala_phone_key" ON "Wakala"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Manager_email_key" ON "Manager"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_reference_key" ON "Transaction"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Token_reference_key" ON "Token"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Card_pin_key" ON "Card"("pin");

-- CreateIndex
CREATE UNIQUE INDEX "Jobs_tracking_key" ON "Jobs"("tracking");

-- AddForeignKey
ALTER TABLE "Meter" ADD CONSTRAINT "Meter_subscriber_id_fkey" FOREIGN KEY ("subscriber_id") REFERENCES "Subscriber"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meter" ADD CONSTRAINT "Meter_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meter" ADD CONSTRAINT "Meter_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "Manager"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "POS" ADD CONSTRAINT "POS_sales_id_fkey" FOREIGN KEY ("sales_id") REFERENCES "Wakala"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
