import { server } from '..';
import * as SpotifyController from './spotify-controller';

const routes = [
    {
        method: 'GET',
        url: '/spotify/credentials',
        schema: {
            description: 'Retrieve the client ID of the application.',
            response: {
                200: {
                    type: 'object',
                    description: 'The client ID of the application.'
                },
                500: {
                    type: 'string',
                    description: 'An internal server error occured.'
                }
            }
        },
        handler: SpotifyController.getCredentials,
        // @ts-ignore
        preHandler: server.auth([
            // @ts-ignore
            server.validateJWT
        ])
    },
    {
        method: 'POST',
        url: '/spotify',
        schema: {
            description: 'Finalize Spotify user authentication & authorization.',
            response: {
                200: {
                    type: 'string',
                    description: 'success'
                }
            }
        },
        handler: SpotifyController.finalizeAuth,
        // @ts-ignore
        preHandler: server.auth([
            // @ts-ignore
            server.validateJWT
        ])
    },
    {
        method: 'DELETE',
        url: '/spotify',
        schema: {
            description: 'De-authenticate a spotify user.',
            response: {
                200: {
                    type: 'boolean',
                    descript: 'User has been de-authenticated.'
                }
            }
        },
        handler: SpotifyController.logoutSpotifyUser,
        // @ts-ignore
        preHandler: server.auth([
            // @ts-ignore
            server.validateJWT
        ])
    },
    {
        method: 'GET',
        url: '/spotify/is-auth',
        schema: {
            description: 'Get if user is authenticated with Spotify.',
            response: {
                200: {
                    type: 'boolean',
                    description: 'User is authenticated.'
                }
            }
        },
        handler: SpotifyController.isAuthenticated,
        // @ts-ignore
        preHandler: server.auth([
            // @ts-ignore
            server.validateJWT
        ])
    }
];

export default routes;
