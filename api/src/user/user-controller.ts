import { FastifyReply, FastifyRequest } from 'fastify';
import logger from '../util/logger';
import * as UserService from './user-service';
import * as AuthService from '../auth/auth-service';
import CookieNames from '../util/CookieNames';

/**
 * Sign up a new user.
 */
export const createUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { body } = request;
        const user = await UserService.create(body as any);
        const token = AuthService.createJWT(user.email);
        reply
            .cookie(CookieNames.PLAYLISTORY_TOKEN, token, { httpOnly: true })
            .cookie(CookieNames.TOKEN_EXISTS, 'true', { httpOnly: false })
            .send();
    } catch (e) {
        if (e.message.toLowerCase().includes('unique constraint')) {
            reply.code(409).send(`User already exists.`);
            return;
        }
        logger.error(`An error occured while creating user.`, e);
        reply.code(500).send();
    }
}

export const subscribeUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        // @ts-ignore
        const { user } = request;
        if (!user)
            throw new Error(`Cannot subscribe user without valid authenticated user.`);
        await UserService.subscribeUser(user);
        reply.code(200).send();
    } catch (e) {
        logger.error(`Error while subscribing user.`, e);
        reply.code(500).send();
    }
}

export const unsubscribeUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        // @ts-ignore
        const { user } = request;
        if (!user)
            throw new Error(`Cannot unsubscribe user without valid authenticated user.`);
        await UserService.unsubscribeUser(user);
        reply.code(200).send();
    } catch (e) {
        logger.error(`Error while unsubscribing user.`, e);
        reply.code(500).send();
    }
}

export const getMe = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        // @ts-ignore
        const metadata = UserService.getMe(request.user);
        reply.code(200).send(JSON.stringify(metadata));
    } catch (e) {
        logger.error(`Error while getting current user metadata.`, e);
        reply.code(500).send();
    }
}