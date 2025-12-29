-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('أدمن', 'مستخدم عادي');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'مستخدم عادي';
