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

    } catch (e) {
        logger.error(e);
        reply.code(500).send();   
    }
}