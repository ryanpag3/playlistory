import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { FastifyRequest } from 'fastify';
import CookieNames from '../util/CookieNames';
import logger from '../util/logger';

export const createJWT = (email: string): string => {
    return jwt.sign({ email }, process.env.JWT_SECRET as any);
}

export const validateJWT = (token: string) => {
    const { email }: any = jwt.verify(token, process.env.JWT_SECRET as any);
    return email;
}

export const validatePassword = async (hash: string, password: string) => {
    return bcrypt.compare(password, hash);
}

export const parseEmailFromJWT = async (request: FastifyRequest) => {
    let token = request.cookies[CookieNames.PLAYLISTORY_TOKEN];
    if (!token) throw new Error(`Token not provided`);
    return validateJWT(token);
}