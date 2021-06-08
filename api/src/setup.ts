import { FastifyInstance } from 'fastify';
import SwaggerConfig from './constant/openapi';


export default async (server: FastifyInstance) => {
    // @ts-ignore
    server.register(require('fastify-swagger'), SwaggerConfig);

    // this must be called locally to ensure the server instance is properly decorated
    const routes = require('./route').default;

    // instantiate routes
    // @ts-ignore
    routes.forEach((route) => server.route(route));
}