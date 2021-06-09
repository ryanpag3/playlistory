import jwt from 'jsonwebtoken';
import logger from '../util/logger';

export const createJWT = (username: string): string => {
    return jwt.sign({ username }, process.env.JWT_SECRET as any);
}

export const validateJWT = (token: string) => {
    const { username }: any = jwt.verify(token, process.env.JWT_SECRET as any);
    return username;
}