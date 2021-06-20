-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('SPOTIFY');

-- CreateTable
CREATE TABLE "Backup" (
    "id" TEXT NOT NULL,
    "manifest" JSONB NOT NULL,
    "createdById" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "playlistId" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "contentHash" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,
    "trackIds" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Backup_playlistId_unique" ON "Backup"("playlistId");

-- AddForeignKey
ALTER TABLE "Backup" ADD FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Backup" ADD FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
