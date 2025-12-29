/*
  Warnings:

  - You are about to drop the column `legalImage` on the `Image` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[public_id]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `public_id` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secure_url` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Image" DROP COLUMN "legalImage",
ADD COLUMN     "public_id" TEXT NOT NULL,
ADD COLUMN     "secure_url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Image_public_id_key" ON "public"."Image"("public_id");
