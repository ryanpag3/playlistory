import { FastifyRequest, FastifyReply } from 'fastify';
import logger from '../util/logger';
import * as BackupService from './backup-service';

export const backup = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        // @ts-ignore
        let { playlistId, backupName, platform, interval } = request.body;

        if (!backupName) {
            backupName = `Playlistory Backup | ${new Date().toLocaleDateString()}`;
        }

        // @ts-ignore
        const isBackupPermitted = await BackupService.isBackupPermitted(request.user, playlistId, interval);
        if (!isBackupPermitted) {
            return reply.code(403).send(`You are not permitted to create a backup. Please consider upgrading to premium to remove this limit.`);
        }

        // @ts-ignore
        const backup = await BackupService.runBackup(request.user, playlistId, backupName, platform, interval);
        reply.send(JSON.stringify(backup));
    } catch (e) {
        logger.error(e);
        reply.code(500).send();
    }
}

export const getBackups = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        // @ts-ignore
        const backups = await BackupService.getBackups(request.user, request.query.playlistId);
        reply.send(JSON.stringify(backups));
    } catch (e) {
        logger.error(e);
        reply.code(500).send();
    }
}

export const deleteBackup = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        // @ts-ignore
        const { id } = request.query;
        const res = await BackupService.deleteBackup(id);
        reply.send(JSON.stringify(res));
    } catch (e) {
        logger.error(e);
        reply.code(500).send();
    }
}

export const deleteScheduledBackup = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        // @ts-ignore
        const { playlistId } = request.query;
        // @ts-ignore
        const res = await BackupService.deleteScheduledBackupsByPlaylistId(request.user?.id, playlistId);
        reply.send(JSON.stringify(res));
    } catch (e) {
        logger.error(e);
        reply.code(500).send();
    }
}