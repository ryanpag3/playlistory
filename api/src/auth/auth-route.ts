import { server } from '../index';
import * as AuthController from './auth-controller';

const routes = [
    {
        method: 'POST',
        url: '/sign-in',
        schema: {
            description: 'Sign-In with user credentials',
            // tags: [ 'user' ],
            body: {
                type: 'object',
                properties: {
                    email: {
                        type: 'string'
                    },
                    password: {
                        type: 'string'
                    }
                }
            },
            response: {
                200: {
                    type: 'string',
                    description: 'A JWT token.'
                }
            }
        },
        handler: AuthController.signIn
    },
    {
        method: 'POST',
        url: '/logout',
        schema: {
            description: 'Log out of the user session.',
            response: {
                200: {
                    type: 'boolean',
                    description: 'User was logged out.'
                }
            }
        },
        handler: AuthController.logout,
        // @ts-ignore
        preHandler: server.auth([
            // @ts-ignore
            server.validateJWT
        ])
    }
];

export default routes;