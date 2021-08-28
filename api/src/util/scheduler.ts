import prisma from './prisma';
import Redis from 'redis';
import Redlock from 'redlock';
import { CronJob } from 'cron';
import logger from './logger';
import ProcessBackupsPremiumQueue from '../message-queues/process-backups-premium';
import { delay } from 'bluebird';
import * as BackupService from '../backup/backup-service';

// @ts-ignore
const client = Redis.createClient(process.env.REDIS_PORT || 6379, process.env.REDIS_HOST || '127.0.0.1');
const redlock = new Redlock(
    [client]
);

export const jobs = {};

export const scheduleJobs = async () => {
    stopAllJobs();

    const scheduledBackups = await prisma.backup.findMany({
        where: {
            scheduled: true
        },
        include: {
            playlist: true
        }
    });

    for (const scheduledBackup of scheduledBackups) {
        logger.debug(`creating new cron job with id ${scheduledBackup.id} and cron pattern ${scheduledBackup.cronSchedule}`);
        // @ts-ignore
        jobs[scheduledBackup.id] = new CronJob(scheduledBackup.cronSchedule, async () => {
            try {
                const lockTtl = 30000;
                const lock = await redlock.lock(scheduledBackup.id, lockTtl);
                const backupEvent = await BackupService.createBackupEvent(scheduledBackup);
                await BackupService.setBackupEventInProgress(backupEvent.id);
                await ProcessBackupsPremiumQueue.add({
                    backupEventId: backupEvent.id,
                    ...scheduledBackup
                });
                await delay(5000);
                await lock.unlock();
            } catch (e) {
                if (e instanceof Redlock.LockError) {
                    return;
                }
                logger.error(e);
            }
        }, null, true, 'America/Los_Angeles');
    }

}

const stopAllJobs = () => {
    const keys = Object.keys(jobs);

    for (const key of keys) {
        // @ts-ignore
        const job = jobs[key];
        job.stop();
    }
}