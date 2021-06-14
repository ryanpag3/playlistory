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