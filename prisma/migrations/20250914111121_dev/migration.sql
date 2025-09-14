-- CreateEnum
CREATE TYPE "public"."AuthProvider" AS ENUM ('CREDENTIALS', 'GOOGLE', 'FACEBOOK');

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "provider" "public"."AuthProvider" DEFAULT 'CREDENTIALS',
ADD COLUMN     "providerId" TEXT DEFAULT '';
