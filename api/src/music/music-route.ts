import * as MusicController from './music-controller';
import { server } from '../index';

const routes = [
    {
        method: 'GET',
        url: '/me/playlists',
        schema: {
            description: 'Get a list of the current users playlists.',
            querystring: {
                type: 'object',
                required: ['platform'],
                properties: {
                    platform: {
                        type: 'string',
                        description: 'The supported platform to query the playlists from.',
                        enum: ['SPOTIFY']
                    },
                    offset: {
                        type: 'number',
                        description: 'offset used for pagination.',
                    },
                    limit: {
                        type: 'number',
                        description: 'limit used for pagination.',
                    }
                }
            },
            response: {
                200: {
                    description: 'An array of playlists.',
                    type: 'object'
                }
            },
        },
        handler: MusicController.getMyPlaylists,
        // @ts-ignore
        preHandler: server.auth([
            // @ts-ignore
            server.validateJWT
        ]),
    },
    {
        url: '/playlist/revert/added',
        method: 'PUT',
        handler: MusicController.revertAddedToBackup,
        // @ts-ignore
        preHandler: server.auth([
            // @ts-ignore
            server.validateJWT
        ]),
    }
];

export default routes;
