import './util/dotenv';
import Fastify from 'fastify';
import { setupServer } from './setup';
import logger from './util/logger';

export const server = Fastify({});

setupServer(server)
    .then(() => server.listen(process.env.PORT || 3000, (err, address) => {
        logger.info(`Playlistory API server has been started on ${address}`);
    }));

process.on('SIGTERM', async () => {
    logger.info('shutting down Playlistory API server');
    await server.close();
    process.exit();
});