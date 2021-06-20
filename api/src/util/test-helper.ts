import { createJWT } from '../auth/auth-service';
import { create } from '../user/user-service';
import prisma from './prisma';

export const getRandomString = (length: number = 10) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

export const createTestUser = async () => {
    const email = getRandomString();
    const password = getRandomString();
    
    await create({
        email,
        password
    });
    
    const user: any = await prisma.user.update({
        where: {
            email
        },
        data: {
            spotifyRefreshToken: process.env.SPOTIFY_TEST_REFRESH_TOKEN
        }
    });

    user.token = await createJWT(user.email);

    return user;
}