/*
  Warnings:

  - Added the required column `playlistName` to the `BackupEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BackupEvent" ADD COLUMN     "playlistName" TEXT NOT NULL;
