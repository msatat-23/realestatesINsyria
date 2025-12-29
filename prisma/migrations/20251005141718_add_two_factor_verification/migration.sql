-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "isTwoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."TowFactorToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "TowFactorToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TowFactorToken_userId_key" ON "public"."TowFactorToken"("userId");

-- AddForeignKey
ALTER TABLE "public"."TowFactorToken" ADD CONSTRAINT "TowFactorToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
