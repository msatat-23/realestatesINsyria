-- AlterTable
ALTER TABLE "SubscriptionRequest" ADD COLUMN     "confirmedByAdmin" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "confirmedByAdmin" BOOLEAN NOT NULL DEFAULT false;
