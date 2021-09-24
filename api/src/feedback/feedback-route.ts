import { server } from '../';
import * as FeedbackController from './feedback-controller';

const routes = [
    {
        method: 'POST',
        url: '/feedback/bug',
        schema: {
            description: 'Create a bug report.',
            body: {
                type: 'object',
                properties: {
                    report: {
                        type: 'string'
                    }
                }
            },
            respone: {
                200: {
                    type: 'string',
                    description: 'Bug report has been created.'
                },
                500: {
                    type: 'string',
                    description: 'An internal server error occured.'
                }
            },
        },
        // @ts-ignore
        preHandler: server.auth([
            // @ts-ignore
            server.validateJWT
        ]),
        handler: FeedbackController.createBugReport
    },
    {
        method: 'POST',
        url: '/feedback',
        schema: {
            description: 'Create feedback.',
            body: {
                type: 'object',
                properties: {
                    report: {
                        feedback: 'string'
                    }
                }
            },
            respone: {
                200: {
                    type: 'string',
                    description: 'Feedback has been created.'
                },
                500: {
                    type: 'string',
                    description: 'An internal server error occured.'
                }
            },
        },
        // @ts-ignore
        // preHandler: server.auth([
        //     // @ts-ignore
        //     server.validateJWT
        // ]),
        handler: FeedbackController.createFeedback
    }
];

export default routes;