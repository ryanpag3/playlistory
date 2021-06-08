import { FastifyReply, FastifyRequest } from 'fastify';
import logger from '../util/logger';

/**
 * Sign up a new user.
 */
export const createUser = async (request: FastifyRequest, reply: FastifyReply) => {
    logger.info('yo');
    reply.send(200);
}