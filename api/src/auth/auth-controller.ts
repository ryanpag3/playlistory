import { FastifyReply, FastifyRequest } from 'fastify';
import logger from '../util/logger';
import prisma from '../util/prisma';
import { createJWT, validatePassword } from './auth-service';

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
    reply.cookie('playlistory-token', token, { httpOnly: true }).send();
}