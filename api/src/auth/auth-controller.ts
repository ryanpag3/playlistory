import { FastifyReply, FastifyRequest } from 'fastify';
import CookieNames from '../util/CookieNames';
import logger from '../util/logger';
import prisma from '../util/prisma';
import { createJWT, parseEmailFromJWT, validatePassword } from './auth-service';

export const signIn = async (request: FastifyRequest, reply: FastifyReply) => {
    const { body: { email, password }}: any = request;
    logger.debug(`signing in user ${email}`);
    const invalidMsg = `Invalid username or password.`;
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });
    if(!user) {
        logger.debug(`could not find user.`);
        return reply.code(401).send(invalidMsg);
    }
    
    const res = await validatePassword(user.password, password);
    if (!res) {
        logger.debug(`could not validate password.`);
        return reply.code(401).send(invalidMsg);
    }
    const token = createJWT(user.email);
    reply.cookie(CookieNames.TOKEN_EXISTS, 'true', { httpOnly: false });
    reply.cookie(CookieNames.PLAYLISTORY_TOKEN, token, { httpOnly: true }).send();
}

export const verifyJWT = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const email = await parseEmailFromJWT(request);
        const user = await prisma.user.findUnique({
            where: {
                email
            },
            include: {
                JsonWebTokenBlacklist: { }
            }
        });
        if (!user) throw new Error(`User not found.`);
        // @ts-ignore
        request.user = user;
        logger.debug(`${user.email} validated successfully.`);
    } catch (e) {
        logger.error(e);
        reply.code(401).send();
    }
}

export const logout = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const token = request.cookies[CookieNames.PLAYLISTORY_TOKEN];
        await prisma.jsonWebTokenBlacklist.create({
            data: {
                token,
                // @ts-ignore
                createdById: request.user.id
            }
        });
        reply.clearCookie(CookieNames.PLAYLISTORY_TOKEN);
        reply.code(200).send();
    } catch (e) {
        logger.error(e);
        reply.code(500).send();
    }
}