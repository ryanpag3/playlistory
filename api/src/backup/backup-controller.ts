import { FastifyRequest, FastifyReply } from 'fastify';
import logger from '../util/logger';
import * as BackupService from './backup-service';
import * as MusicService from '../music/music-service';
import ProcessBackupsPremiumQueue from '../message-queues/process-backups-premium';

export const backup = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        // @ts-ignore
        let { playlistId, backupName, platform, interval } = request.body;

        if (!backupName) {
            backupName = `Playlistory Backup | ${new Date().toLocaleDateString()}`;
        }

        // @ts-ignore
        const isBackupPermitted = await BackupService.isBackupPermitted(request.user, playlistId, interval);
        logger.info(`is backup permitted? ${isBackupPermitted}`);
        if (!isBackupPermitted) {
            logger.debug(`Cannot create backup. Not permitted.`);
            return reply.code(403).send(`You are not permitted to create a backup. Please consider upgrading to premium to remove this limit.`);
        }

        if (interval) {
            // @ts-ignore
            return BackupService.runBackup(request.user, playlistId, ``, platform, interval);
        }
        
        const getAllTracks = false;
        // @ts-ignore
        const playlist = await MusicService.getPlaylist(request.user, platform, playlistId, getAllTracks);
        
        // @ts-ignore
        const backupEvent = await BackupService.createBackupEvent(request.user.id, playlist.id, playlist.name);
        await BackupService.setBackupEventInProgress(backupEvent.id);
        await ProcessBackupsPremiumQueue.add({
            backupEventId: backupEvent.id,
            // @ts-ignore
            createdById: request.user.id,
            playlist: {
                playlistId,
                platform
            }
        });
        reply.send();
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
        logger.debug(`deleting scheduled backup`);
        // @ts-ignore
        const res = await BackupService.deleteScheduledBackupsByPlaylistId(request.user?.id, playlistId);
        reply.send(JSON.stringify(res));
    } catch (e) {
        logger.error(e);
        reply.code(500).send();
    }
}

export const getScheduledBackupEvents = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        // @ts-ignore
        const { user } = request;
        // @ts-ignore
        const { offset, limit } = request.query;

        const backupEvents = await BackupService.getBackupEvents(user, offset, limit);
        reply.send(JSON.stringify(backupEvents));
    } catch (e) {
        logger.error(e);
        reply.code(500).send();
    }  
}