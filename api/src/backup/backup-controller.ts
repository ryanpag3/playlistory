import { FastifyRequest, FastifyReply } from 'fastify';
import logger from '../util/logger';
import * as BackupService from './backup-service';
import * as MusicService from '../music/music-service';
import Platforms from '../util/Platforms';
import prisma from '../util/prisma';

export const backup = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        // @ts-ignore
        let { playlistId, backupName, platform, cronSchedule } = request.body;

        if (!backupName) {
            backupName = `Playlistory Backup | ${new Date().toLocaleDateString()}`;
        }

        // @ts-ignore
        const isBackupPermitted = await BackupService.isBackupPermitted(request.user, playlistId);
        if (!isBackupPermitted) {
            return reply.code(403).send(`You are not permitted to create a backup. Please consider upgrading to premium to remove this limit.`);
        }

        const mostRecentBackup = await BackupService.getMostRecentBackup(playlistId);
        // @ts-ignore
        const playlist = await MusicService.getPlaylist(request.user, platform, playlistId);

        if (!playlist)
            throw new Error(`Playlist not found.`);
        
        if (cronSchedule) {
            BackupService.validateCronSchedule(cronSchedule);
        }

        // @ts-ignore
        let currentBackup = await BackupService.createBackup(request.user, {
            name: backupName,
            playlistId: playlist.id,
            playlistName: playlist.name,
            playlistDescription: playlist.description,
            imageUrl: playlist.imageUrl as any,
            contentHash: playlist.snapshotId,
            followers: playlist.followers as any,
            tracks: playlist.tracks.items.map(i => {
                return {
                    id: i.id,
                    uri: i.uri
                }
            }),
            // @ts-ignore
            platform: Platforms.SPOTIFY,
            // @ts-ignore
            createdById: request.user.id,
            scheduled: cronSchedule ? true : false,
            cronSchedule
        });

        if (mostRecentBackup?.playlist.contentHash === currentBackup.playlist.contentHash) {
            logger.debug(`skipping diff generation as the contents of the playlist [${playlist.id}] hasn't changed.`);
            currentBackup = await prisma.backup.update({
                where: {
                    id: currentBackup.id
                },
                data: {
                    manifest: {
                        added: [],
                        removed: []
                    }
                },
                include: {
                    playlist: true,
                    createdBy: true
                }
            });
            return reply.send(JSON.stringify(currentBackup));
        }

        const withManifest = await BackupService.generateManifest(mostRecentBackup, currentBackup);

        reply.send(JSON.stringify(withManifest));
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
        const res = await BackupService.deleteBackup(request.query.id);
        reply.send(JSON.stringify(res));
    } catch (e) {
        logger.error(e);
        reply.code(500).send();
    }
}

export const createScheduledBackup = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        // @ts-ignore
        const { cronSchedule, playlistId } = request.query;
        // @ts-ignore
        const res = await BackupService.createScheduledBackup(request.user);
        reply.send(JSON.stringify(res));
    } catch (e) {
        logger.error(`Error occured while creating scheduled backup.`, e);
        reply.code(500).send();
    }
}