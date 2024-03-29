import './util/dotenv';
import Fastify from 'fastify';
import { setupServer } from './setup';
import logger from './util/logger';

export const server = Fastify({});

const address = process.env.API_ADDRESS || '127.0.0.1';

const port = process.env.NODE_ENV === 'test' ? 0 : process.env.API_PORT || 3000;

setupServer(server)
    .then(() => server.listen(port, address, (err, address) => {
        logger.info(`Playlistory API server has been started on ${address} :)`);
    }));

process.on('SIGTERM', async () => {
    logger.debug('shutting down Playlistory API server');
    await server.close();
    process.exit();
});