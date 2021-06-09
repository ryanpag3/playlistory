import { FastifyRegisterOptions } from 'fastify';
import { SwaggerOptions } from 'fastify-swagger';

const SwaggerConfig: FastifyRegisterOptions<SwaggerOptions> = {
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: 'Playlistory API',
        description: 'Playlistory API',
        version: '1.0.0'
      },
    //   externalDocs: {
    //     url: 'https://swagger.io',
    //     description: 'Find more info here'
    //   },
      host: 'localhost',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        // { name: 'user', description: 'User related end-points' },
      ],
      definitions: {
        User: {
          type: 'object',
          required: ['id', 'email'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: {type: 'string', format: 'email' }
          }
        }
      },
      securityDefinitions: {
        apiKey: {
          type: 'apiKey',
          name: 'apiKey',
          in: 'header'
        }
      }
    },
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    staticCSP: true,
    // @ts-ignore
    transformStaticCSP: (header) => header,
    exposeRoute: true
};

export default SwaggerConfig;