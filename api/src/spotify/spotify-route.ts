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
    }
];

export default routes;
