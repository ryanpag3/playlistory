import { FastifyReply, FastifyRequest } from 'fastify';
import logger from '../util/logger'
import prisma from '../util/prisma';
import SpotifyApi from '../util/spotify-api';

export const getCredentials = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        if (!clientId)
            throw new Error(`No client ID found.`);
        reply.send(JSON.stringify({ clientId,
            scopes: [
                'user-library-read',
                'user-library-modify',
                'playlist-read-collaborative',
                'playlist-read-private',
                'playlist-modify-private',
                'playlist-modify-private',
                'playlist-modify-public',
                'user-read-private'
            ]
        }, null, 4));
    } catch (e) {
        logger.error(e);
        reply.code(500).send();
    }
}

export const finalizeAuth = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        // @ts-ignore
        const res = await SpotifyApi.exchangeAuthCodes(request.body.token);
        await prisma.user.update({
            where: {
                // @ts-ignore
                email: request.user.email
            },
            data: {
                spotifyRefreshToken: res.refreshToken
            }
        });
        reply.code(200).send();
    } catch (e) {
        logger.error(e);
        reply.code(500).send();
    }
}

export const isAuthenticated = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        // @ts-ignore
        const { user } = request;
        const spotifyApi = new SpotifyApi(user.spotifyRefreshToken);
        await spotifyApi.getMe();
        reply.code(200).send(true);
    } catch (e) {
        logger.error(e);
        reply.code(500).send();
    }
}

export const logoutSpotifyUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        // @ts-ignore
        const { user } = request;
        await prisma.user.update({
            where: {
                email: user.email
            },
            data: {
                spotifyRefreshToken: null
            }
        });
        logger.debug(`Spotify account removed from user ${user.email}`);
        reply.code(200).send(true);
    } catch (e) {
        logger.error(e);
        reply.code(500).send();
    }
}