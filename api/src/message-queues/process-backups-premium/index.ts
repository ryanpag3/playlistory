import logger from '../../util/logger';
import prisma from '../../util/prisma';
import { getBullQueue } from '../util';
import * as BackupService from '../../backup/backup-service';

export const name = 'process-backups-premium';

const queueRef = getBullQueue(name);

queueRef.process(async (job) => {
    const { data } = job;
    try {
        logger.debug(`running backup for ${data.createdById}`);

        const user = await prisma.user.findUnique({
            where: {
                id: data.createdById
            }
        });
        // @ts-ignore
        const backup = await BackupService.runBackup(user, data.playlist.playlistId, `TODO: REMOVE THIS COLUMN | ${new Date().toLocaleDateString()}`, data.playlist.platform);
        await BackupService.setBackupEventCompleted(backup.id, data.backupEventId);
        logger.debug(`ran scheduled backup for user ${user?.id} and playlist ${data.playlist.playlistId} for platform ${data.playlist.platform}`);
    } catch (e) {
        try {
            await BackupService.setBackupEventError(data.backupEventId);
        } catch (e) {
            // noop
        }
        logger.error(`Error while running scheduled backup.`, e);
    }
});

export default queueRef;