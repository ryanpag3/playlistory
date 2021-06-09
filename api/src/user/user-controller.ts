import { FastifyReply, FastifyRequest } from 'fastify';
import logger from '../util/logger';
import * as UserService from './user-service';
// import * as AuthService from '../service/auth-service';

/**
 * Sign up a new user.
 */
export const createUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { body } = request;
        const user = await UserService.create(body as any);

    } catch (e) {

    }
}