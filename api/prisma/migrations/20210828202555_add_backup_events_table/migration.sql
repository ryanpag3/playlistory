-- CreateTable
CREATE TABLE "BackupEvent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "backupId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BackupEvent" ADD FOREIGN KEY ("backupId") REFERENCES "Backup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
