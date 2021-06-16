import { FastifyRequest, FastifyReply } from 'fastify';
import logger from '../util/logger';
import * as BackupService from './backup-service';

export const backup = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        // @ts-ignore
        const { playlistId, backupName } = request.body;
        const getMostRecentBackup = await BackupService.getMostRecentBackup(playlistId);
        
    } catch (e) {
        logger.error(e);
        reply.code(500).send();
    }
}