/*
  Warnings:

  - Added the required column `updatedAt` to the `Conversa` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ConversaStatus" AS ENUM ('open', 'closed');

-- AlterTable
ALTER TABLE "Conversa" ADD COLUMN     "status" "ConversaStatus" NOT NULL DEFAULT 'open',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
