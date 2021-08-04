import { FastifyInstance } from 'fastify';
import { FastifyCookieOptions } from 'fastify-cookie';
import SwaggerConfig from './util/openapi';
import * as AuthController from './auth/auth-controller';
import logger from './util/logger';
import * as MessageQueue from './message-queues';
import * as Scheduler from './util/scheduler';

export async function setupServer(server: FastifyInstance) {
    /* SWAGGER */
    logger.debug(`setting up swagger`);
    await server.register(require('fastify-swagger'), SwaggerConfig as any);

    /* COOKIES */
    logger.debug(`setting up cookies`);
    await server.register(require('fastify-cookie'), {
        secret: process.env.COOKIE_SECRET,
        parseOptions: {}
    } as FastifyCookieOptions);

    /* CORS */
    logger.debug(`setting up cors`);
    await server.register(require('fastify-cors'), {
        credentials: true,
        origin: process.env.REACT_APP_HOST || 'http://localhost:8080',
        exposedHeaders: true
    });

    /* AUTH */
    logger.debug(`setting up auth`);
    await server.register(require('fastify-auth'));
    server.decorate('validateJWT', AuthController.verifyJWT);

    /* MESSAGE QUEUES */
    MessageQueue.setup();
    
    await Scheduler.scheduleJobs();

    /* ROUTES */

    // this must be called locally to ensure the server instance is properly decorated
    const routes = require('./route').default;

    // instantiate routes
    for (const route of routes) {
        server.route(route);
    }
}