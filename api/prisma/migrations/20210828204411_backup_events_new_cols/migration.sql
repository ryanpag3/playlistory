-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'STARTED', 'COMPLETED');

-- AlterTable
ALTER TABLE "BackupEvent" ADD COLUMN     "finishedAt" TIMESTAMP(3),
ADD COLUMN     "progress" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT E'PENDING';
