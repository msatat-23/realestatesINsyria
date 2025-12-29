/*
  Warnings:

  - A unique constraint covering the columns `[video]` on the table `Property` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[video_public_id]` on the table `Property` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "video_public_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Property_video_key" ON "Property"("video");

-- CreateIndex
CREATE UNIQUE INDEX "Property_video_public_id_key" ON "Property"("video_public_id");
