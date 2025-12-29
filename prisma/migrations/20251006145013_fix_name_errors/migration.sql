/*
  Warnings:

  - You are about to drop the `TowFactorConfirmation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."TowFactorConfirmation" DROP CONSTRAINT "TowFactorConfirmation_userId_fkey";

-- DropTable
DROP TABLE "public"."TowFactorConfirmation";

-- CreateTable
CREATE TABLE "public"."TwoFactorConfirmation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "TwoFactorConfirmation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TwoFactorConfirmation_userId_key" ON "public"."TwoFactorConfirmation"("userId");

-- AddForeignKey
ALTER TABLE "public"."TwoFactorConfirmation" ADD CONSTRAINT "TwoFactorConfirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
