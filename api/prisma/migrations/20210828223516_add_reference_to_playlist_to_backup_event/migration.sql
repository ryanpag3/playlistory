/*
  Warnings:

  - Added the required column `playlistId` to the `BackupEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BackupEvent" ADD COLUMN     "playlistId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "BackupEvent" ADD FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
