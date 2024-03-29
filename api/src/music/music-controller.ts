import { FastifyReply, FastifyRequest } from 'fastify';
import logger from '../util/logger';
import * as MusicService from './music-service';

export const getMyPlaylists = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        // @ts-ignore
        const { offset, limit, platform } = request.query;
        // @ts-ignore
        const playlists = await MusicService.getMyPlaylists(request.user, offset, limit, platform);
        reply.code(200).send(JSON.stringify(playlists));
    } catch (e) {
        logger.error(e);
        reply.code(500).send();
    }
}

export const revertAddedToBackup = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        // @ts-ignore
        const { backupId } = request.query;
        // @ts-ignore
        const result = await MusicService.revertAddedToBackup(request.user, backupId);
        reply.code(200).send(JSON.stringify(result));
    } catch (e) {
        logger.error(e);
        reply.code(500).send();   
    }
}

export const revertRemovedFromBackup = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        // @ts-ignore
        const { backupId } = request.query;
        // @ts-ignore
        const result = await MusicService.revertRemovedFromBackup(request.user, backupId);
        reply.code(200).send(JSON.stringify(result));
    } catch (e) {
        logger.error(e);
        reply.code(500).send();   
    }
}

export const restoreToBackup = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        // @ts-ignore
        const { backupId } = request.query;
        if (!backupId)
            throw new Error(`Backup ID is required.`);
        // @ts-ignore
        const result = await MusicService.restoreToBackup(request.user, backupId);
        reply.code(200).send();
    } catch (e) {
        logger.error(e);
        reply.code(500).send();   
    }
}

export const getSongs = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        // @ts-ignore
        const { songIds, platform, offset, limit } = request.query;
        const result = await MusicService.getSongs(songIds.split(','), platform, offset, limit);
        reply.code(200).send(JSON.stringify(result));
    } catch (e) {
        logger.error(e);
        reply.code(500).send();   
    }
}