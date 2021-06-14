import { FastifyInstance } from 'fastify';
import { FastifyCookieOptions } from 'fastify-cookie';
import SwaggerConfig from './util/openapi';
import * as AuthService from './auth/auth-service';
import * as AuthController from './auth/auth-controller';


export default async (server: FastifyInstance) => {
    // @ts-ignore
    await server.register(require('fastify-swagger'), SwaggerConfig);

    /* COOKIES */
    await server.register(require('fastify-cookie'), {
        secret: process.env.COOKIE_SECRET,
        parseOptions: {}
    } as FastifyCookieOptions);

    /* CORS */
    await server.register(require('fastify-cors'), {
        credentials: true,
        exposedHeaders: true
    });

    /* AUTH */
    server.decorate('validateJWT', AuthController.verifyJWT);
    await server.register(require('fastify-auth'));

    // this must be called locally to ensure the server instance is properly decorated
    const routes = require('./route').default;

    // instantiate routes
    // @ts-ignore
    routes.forEach((route) => server.route(route));
}