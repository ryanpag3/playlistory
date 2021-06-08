require('dotenv').config();

import Fastify from 'fastify';
import logger from './util/logger';

export const server = Fastify({});
const port = process.env.API_PORT || 3000;
let isInit = false;

const startServer = async () => {
    await server.listen(port);
};

startServer();

server.ready(err => {
    if (err) throw err;
    // TODO: swagger
    const address = server.server.address();
    const host = typeof address === 'string' ? address : address?.address;
    logger.info(`API server has been started on address ${host} and port ${port}`);
    isInit = true;
});

export const isServerReady = () => {
    return isInit;
}