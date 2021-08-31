/*
  Warnings:

  - Added the required column `createdById` to the `BackupEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BackupEvent" ADD COLUMN     "createdById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "BackupEvent" ADD FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
