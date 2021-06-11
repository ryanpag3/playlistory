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
    }
];

export default routes;