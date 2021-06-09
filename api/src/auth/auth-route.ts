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
                    username: {
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
    }
];

export default routes;