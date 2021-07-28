import { server } from '../index';
import * as UserController from './user-controller';

const routes = [
    {
        method: 'POST',
        url: '/user',
        schema: {
            description: 'Create a user.',
            tags: [ 'user' ],
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
                    description: 'Created a user.'
                },
                409: {
                    type: 'string',
                    description: 'User not created because a unique field already exists.'
                },
                500: {
                    type: 'string',
                    description: 'An internal server error occured.'
                }
            }
        },
        handler: UserController.createUser
    },
    {
        method: 'POST',
        url: '/user/subscribe',
        schema: {
            description: 'Subscribe to premium access.',
            response: {
                200: {
                    type: 'string',
                    description: 'User has been subscribed.'
                }
            }
        },
        // @ts-ignore
        preHandler: server.auth([
            // @ts-ignore
            server.validateJWT
        ]),
        handler: UserController.subscribeUser
    },
    {
        method: 'POST',
        url: '/user/unsubscribe',
        schema: {
            description: 'Unsubscribe to premium access.',
            response: {
                200: {
                    type: 'string',
                    description: 'User has been unsubscribed.'
                }
            }
        },
        // @ts-ignore
        preHandler: server.auth([
            // @ts-ignore
            server.validateJWT
        ]),
        handler: UserController.unsubscribeUser
    },
    {
        method: 'GET',
        url: '/user/me',
        schema: {
            description: 'Get metadata about the currently authenticated user.',
            response: {
                200: {
                    type: 'object',
                    description: 'The user metadata object.'
                }
            }
        },
        // @ts-ignore
        preHandler: server.auth([
            // @ts-ignore
            server.validateJWT
        ]),
        handler: UserController.getMe
    }
];

export default routes;