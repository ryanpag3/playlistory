import { FastifyRequest, FastifyReply } from 'fastify';
import { Playlist } from '@prisma/client';
import logger from '../util/logger';
import SpotifyApi from '../util/spotify-api';
import * as BackupService from './backup-service';
import * as MusicService from '../music/music-service';
import prisma from '../util/prisma';
import Platforms from '../../../shared/src/Platforms';

export const backup = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        // @ts-ignore
        const { playlistId, backupName, platform } = request.body;
        const mostRecentBackup = await BackupService.getMostRecentBackup(playlistId);
        // @ts-ignore
        const playlist = await MusicService.getPlaylist(request.user, platform, playlistId);

        const cachedPlaylist = await prisma.playlist.create({
            data :{
                playlistId: playlist.id,
                name: playlist.name,
                description: playlist.description,
                imageUrl: playlist.imageUrl,
                contentHash: playlist.snapshotId,
                followers: playlist.followers,
                tracks: playlist.tracks.items.map(i => {
                    return {
                        id: i.track.id,
                        uri: i.track.uri
                    }
                }),
                // @ts-ignore
                platform: Platforms.SPOTIFY,
                // @ts-ignore
                createdById: request.user.id
            },
            include: {
                createdBy: true
            }
        });

        let currentBackup = await prisma.backup.create({
            data: {
                name: backupName,
                // @ts-ignore
                createdById: request.user.id,
                playlistId: cachedPlaylist.id,
            },
            include: {
                playlist: true
            }
        });

        if (mostRecentBackup?.playlist.contentHash === currentBackup.playlist.contentHash) {
            logger.debug(`skipping diff generation as the contents of the playlist [${playlist.id}] hasn't changed.`);
            return reply.send(JSON.stringify(currentBackup));
        }

        // @ts-ignore
        const diffAdded = currentBackup.playlist.tracks.filter(x => !mostRecentBackup?.playlist.tracks.includes(x));

        // @ts-ignore
        const diffRemoved = mostRecentBackup?.playlist.tracks.filter(x => !currentBackup.playlist.tracks.includes(x));

        currentBackup = await prisma.backup.update({
            where: {
                id: currentBackup.id
            },
            data: {
                manifest: {
                    added: diffAdded,
                    removed: diffRemoved
                }
            },
            include: {
                playlist: true
            }
        });

        reply.send(JSON.stringify(currentBackup));
    } catch (e) {
        logger.error(e);
        reply.code(500).send();
    }
}