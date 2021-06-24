/**
 * Setup environment variables
 */
import './util/dotenv';

import Fastify from 'fastify';
import { setupServer } from './setup';
import logger from './util/logger';

export const server = Fastify({});

const port = process.env.NODE_ENV === 'test' ? 0 : process.env.API_PORT || 3001;

setupServer(server)
    .then(() => server.listen(port, (err, address) => {
        logger.info(`Playlistory premium API has been started on ${address}`);
    }));
