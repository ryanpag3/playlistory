import { FastifyInstance } from 'fastify';
import { FastifyCookieOptions } from 'fastify-cookie';
import SwaggerConfig from './util/openapi';


export default async (server: FastifyInstance) => {
    // @ts-ignore
    server.register(require('fastify-swagger'), SwaggerConfig);

    server.register(require('fastify-cookie'), {
        secret: process.env.COOKIE_SECRET,
        parseOptions: {}
    } as FastifyCookieOptions);

    // this must be called locally to ensure the server instance is properly decorated
    const routes = require('./route').default;

    // instantiate routes
    // @ts-ignore
    routes.forEach((route) => server.route(route));
}