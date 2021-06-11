import { FastifyReply, FastifyRequest } from 'fastify';
import logger from '../util/logger';
import * as UserService from './user-service';
import * as AuthService from '../auth/auth-service';

/**
 * Sign up a new user.
 */
export const createUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { body } = request;
        const user = await UserService.create(body as any);
        const token = AuthService.createJWT(user.email);
        reply
            .cookie('playlistory-token', token, { httpOnly: true })
            .send();
    } catch (e) {
        logger.error(`An error occured while creating user.`, e);
        throw e;
    }
}