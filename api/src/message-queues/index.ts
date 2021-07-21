import logger from '../util/logger';

export const setup = () => {
    let q = require('./process-backups-free');
    logSetupMsg(q.name);
    q = require('./process-backups-premium');
    logSetupMsg(q.name);
}

const logSetupMsg = (name: string) => {
    logger.debug(`queue ${name} has been setup.`);
}
