/*
  Warnings:

  - The `jobId` column on the `BackupEvent` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "BackupEvent" DROP COLUMN "jobId",
ADD COLUMN     "jobId" INTEGER;
