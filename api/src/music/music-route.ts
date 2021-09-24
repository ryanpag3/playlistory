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
        schema: {
            querystring: {
                type: 'object',
                required: ['backupId'],
                properties: {
                    backupId: {
                        type: 'string',
                        description: 'The backup that is being acted upon.'
                    }
                }
            },
        },
        handler: MusicController.revertAddedToBackup,
        // @ts-ignore
        preHandler: server.auth([
            // @ts-ignore
            server.validateJWT
        ]),
    },
    {
        url: '/playlist/revert/removed',
        method: 'PUT',
        schema: {
            querystring: {
                type: 'object',
                required: ['backupId'],
                properties: {
                    backupId: {
                        type: 'string',
                        description: 'The backup that is being acted upon.'
                    }
                }
            },
        },
        handler: MusicController.revertRemovedFromBackup,
        // @ts-ignore
        preHandler: server.auth([
            // @ts-ignore
            server.validateJWT
        ]),
    },
    {
        url: '/playlist/restore',
        method: 'PUT',
        schema: {
            querystring: {
                type: 'object',
                required: ['backupId'],
                properties: {
                    backupId: {
                        type: 'string',
                        description: 'The backup that is being acted upon.'
                    }
                }
            },
        },
        handler: MusicController.restoreToBackup,
        // @ts-ignore
        preHandler: server.auth([
            // @ts-ignore
            server.validateJWT
        ])
    },
    {
        url: '/songs',
        method: 'GET',
        schema: {
            querystring: {
                type: 'object',
                required: ['songIds', 'platform'],
                properties: {
                    songIds: {
                        type: 'string',
                        description: 'The backup that is being acted upon.'
                    },
                    platform: {
                        type: 'string',
                        description: 'The platform of the songs.'
                    },
                    offset: {
                        type: 'number',
                        description: 'the query offset'
                    },
                    limit: {
                        type: 'number',
                        description: 'the limit of the query results'
                    }
                }
            },
        },
        handler: MusicController.getSongs,
        // @ts-ignore
        preHandler: server.auth([
            // @ts-ignore
            server.validateJWT
        ])
    }
];

export default routes;
