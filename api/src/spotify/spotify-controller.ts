import { FastifyReply, FastifyRequest } from 'fastify';
import logger from '../util/logger'

export const getCredentials = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        if (!clientId)
            throw new Error(`No client ID found.`);
        reply.send(JSON.stringify({ clientId }, null, 4));
    } catch (e) {
        logger.error(e);
        reply.code(500).send();
    }
}