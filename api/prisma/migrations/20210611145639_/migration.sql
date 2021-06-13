/*
  Warnings:

  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User.username_unique";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username";
