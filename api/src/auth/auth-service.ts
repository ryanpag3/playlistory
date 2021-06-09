import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const createJWT = (username: string): string => {
    return jwt.sign({ username }, process.env.JWT_SECRET as any);
}

export const validateJWT = (token: string) => {
    const { username }: any = jwt.verify(token, process.env.JWT_SECRET as any);
    return username;
}

export const validatePassword = async (hash: string, password: string) => {
    return bcrypt.compare(password, hash);
}