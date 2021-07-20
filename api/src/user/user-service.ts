import { User } from '.prisma/client';
import bcrypt from 'bcryptjs';
import { encryptValue } from '../util/encrypt';
import logger from '../util/logger';
import prisma from '../util/prisma';

export const create = async (body: {
    password: string;
    email: string;
}): Promise<User> => {
    body.password = await encryptValue(body.password);
    const user = await prisma.user.create({
        data: {
            password: body.password,
            email: body.email
        }
    });
    logger.info(`created new user with email ${user.email}`);
    return user;
}

/**
 * TODO: this is a temporary stub to validate 
 * premium-gated functionality before the stripe
 * integration is complete.
 */
export const subscribeUser = async (user: User) => {
    logger.debug(`subscribing user`);
    return await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            isSubscribed: true
        }
    });
}

/**
 * TODO: this is a temporary stub to validate 
 * premium-gated functionality before the stripe
 * integration is complete.
 */
export const unsubscribeUser = async (user: User) => {
    logger.debug(`unsubscribing user`);
    return await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            isSubscribed: true
        }
    });
}

/**
 * TODO: this is a temporary stub to validate 
 * premium-gated functionality before the stripe
 * integration is complete.
 */
export const isUserSubscribed = async (user: User) => {
    return user.isSubscribed === true;
}