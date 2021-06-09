require('dotenv').config();

import Fastify from 'fastify';
import setup from './setup';
import logger from './util/logger';

process.on('SIGTERM', () => process.exit())

export const server = Fastify({});
const port = process.env.API_PORT || 3000;

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
    logger.info(`API server has been started on port ${port}`);
});