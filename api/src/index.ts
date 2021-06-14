const dotenv = require('dotenv');
dotenv.config();
dotenv.config({
    path: '.env.private'
});

import Fastify from 'fastify';
import setup from './setup';
import logger from './util/logger';

export const server = Fastify({});
// we spawn instances of the server for testing, setting to 0 avoids port collissions on concurrency
const port = process.env.NODE_ENV === 'test' ? 0 : process.env.API_PORT || 3000;

const startServer = async () => {
    await setup(server);
    await server.listen(port);
};

startServer();

server.ready(err => {
    if (err) throw err;
    // TODO: swagger
    const address = server.server.address();
    const host = typeof address === 'string' ? address : address?.address;
    logger.info(`API server has been started on port ${server.server.address()}`);
});

process.on('SIGTERM', async () => {
    logger.info('shutting down');
    await server.close();
    process.exit();
})