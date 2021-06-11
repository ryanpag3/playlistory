import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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