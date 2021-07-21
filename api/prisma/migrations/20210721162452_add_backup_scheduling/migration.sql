-- AlterTable
ALTER TABLE "Backup" ADD COLUMN     "cronSchedule" TEXT,
ADD COLUMN     "scheduled" BOOLEAN NOT NULL DEFAULT false;
