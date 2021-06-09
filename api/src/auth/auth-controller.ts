import { FastifyReply, FastifyRequest } from 'fastify';
import logger from '../util/logger';
import prisma from '../util/prisma';

export const signIn = async (request: FastifyRequest, reply: FastifyReply) => {
    const { body: { username, password }}: any = request;
    logger.debug(`signing in user ${username}`);
    const invalidMsg = `Invalid username or password.`;
    const user = await prisma.user.findUnique({
        where: {
            username
        }
    });
    if(!user)
        return reply.code(401).send(invalidMsg);
    
}