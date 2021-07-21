import Queue from 'bull';
import logger from '../../util/logger';
import { getBullQueue } from '../util';

export const name = 'process-backups-premium';

const queueRef = getBullQueue(name);

queueRef.process((job) => {
    logger.info('testing mq functionalty');
});

export default queueRef;