/*
  Warnings:

  - You are about to drop the `TowFactorToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."TowFactorToken" DROP CONSTRAINT "TowFactorToken_userId_fkey";

-- DropTable
DROP TABLE "public"."TowFactorToken";

-- CreateTable
CREATE TABLE "public"."TwoFactorToken" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TwoFactorToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TowFactorConfirmation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "TowFactorConfirmation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TwoFactorToken_email_code_key" ON "public"."TwoFactorToken"("email", "code");

-- CreateIndex
CREATE UNIQUE INDEX "TowFactorConfirmation_userId_key" ON "public"."TowFactorConfirmation"("userId");

-- AddForeignKey
ALTER TABLE "public"."TowFactorConfirmation" ADD CONSTRAINT "TowFactorConfirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
