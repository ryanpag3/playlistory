import * as BackupController from './backup-controller';
import { server } from '..';

const routes = [
    {
        method: 'POST',
        url: '/backup',
        schema: {
            description: 'Create a backup',
            body: {
                type: 'object',
                properties: {
                    playlistId: {
                        type: 'string'
                    },
                    backupName: {
                        type: 'string',
                        require: false
                    }
                }
            },
            response: {
                200: {
                    type: 'string',
                    description: 'Backup started.'
                }
            }
        },
        // @ts-ignore
        preHandler: server.auth([
            // @ts-ignore
            server.verifyJWT
        ]),
        handler: BackupController.backup
    },
    // {
    //     method: 'GET',
    //     url: '/backup',
    //     schema: {
    //         description: 'Get a list of backups for a particular id.',
    //         querystring: {
    //             id: {
    //                 type: 'string',
    //                 description: 'ID of the entity the backup was created for.'
    //             }
    //         },
    //         response: {
    //             200: {
    //                 type: 'object',
    //                 description: 'An array of backups.'
    //             }
    //         }
    //     },
    //     // @ts-ignore
    //     preHandler: server.auth([
    //         // @ts-ignore
    //         server.verifyJWT
    //     ]),
    //     handler: BackupController.getBackups
    // },
    // {
    //     method: 'POST',
    //     url: '/backup/revert/added',
    //     schema: {
    //         description: 'Revert songs that were added during this revision.',
    //         querystring: {
    //             id: {
    //                 type: 'string',
    //                 description: 'The ID of the backup that we are reverting additions for.'
    //             }
    //         },
    //         response: {
    //             200: {
    //                 type: 'object',
    //                 description: 'The updated backup that contains the changes in the revert.'
    //             }
    //         }
    //     },
    //     // @ts-ignore
    //     preHandler: server.auth([
    //         // @ts-ignore
    //         server.verifyJWT
    //     ]),
    //     handler: BackupController.getBackups
    // }
];

export default routes;