import { User } from '.prisma/client';
import bcrypt from 'bcryptjs';
import { encryptValue } from '../util/encrypt';
import logger from '../util/logger';
import prisma from '../util/prisma';

export const create = async (body: {
    username: string;
    password: string;
    email: string;
}): Promise<User> => {
    body.password = await encryptValue(body.password);
    const user = await prisma.user.create({
        data: {
            username: body.username,
            password: body.password,
            email: body.email
        }
    });
    logger.info(`created new user with username ${user.username}`);
    return user;
}