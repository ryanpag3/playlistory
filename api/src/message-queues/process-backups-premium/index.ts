import logger from '../../util/logger';
import prisma from '../../util/prisma';
import { getBullQueue } from '../util';
import * as BackupService from '../../backup/backup-service';

export const name = 'process-backups-premium';

const queueRef = getBullQueue(name);

queueRef.process(async (job) => {
    try {
        const { data } = job;
        const user = await prisma.user.findUnique({
            where: {
                id: data.createdById
            }
        });
        // @ts-ignore
        await BackupService.runBackup(user, data.playlist.playlistId, `Playlistory Scheduled Backup | ${new Date().toLocaleDateString()}`, data.playlist.platform);
        logger.debug(`ran scheduled backup for user ${user?.id} and playlist ${data.playlist.playlistId} for platform ${data.playlist.platform}`);
    } catch (e) {
        logger.error(`Error while running scheduled backup.`, e);
    }
});

export default queueRef;