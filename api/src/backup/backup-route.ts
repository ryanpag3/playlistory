import { server } from '../index';
import * as BackupController from './backup-controller';

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
                    platform: {
                        type: 'string',
                    },
                    backupName: {
                        type: 'string',
                        require: false
                    },
                    interval: {
                        type: 'string',
                        require: false
                    }
                }
            },
            response: {
                200: {
                    type: 'string',
                    description: 'Backup has been created and optionally started depending on if scheduled.'
                }
            }
        },
        // @ts-ignore
        preHandler: server.auth([
            // @ts-ignore
            server.validateJWT
        ]),
        handler: BackupController.backup
    },
    {
        method: 'GET',
        url: '/backup',
        schema: {
            description: 'Get a list of backups for a particular id.',
            querystring: {
                id: {
                    type: 'string',
                    description: 'ID of the entity the backup was created for.'
                }
            },
            response: {
                200: {
                    type: 'object',
                    description: 'An array of backups.'
                }
            }
        },
        // @ts-ignore
        preHandler: server.auth([
            // @ts-ignore
            server.validateJWT
        ]),
        handler: BackupController.getBackups
    },
    {
        method: 'DELETE',
        url: '/backup',
        schema: {
            description: 'Delete a backup.',
            querystring: {
                id: {
                    type: 'string',
                    description: 'ID of backup to be deleted.'
                }
            },
            response: {
                200: {
                    type: 'boolean',
                    description: 'Backup was deleted'
                }
            }
        },
        // @ts-ignore
        preHandler: server.auth([
            // @ts-ignore
            server.validateJWT
        ]),
        handler: BackupController.deleteBackup
    },
    {
        method: 'DELETE',
        url: '/backup/scheduled',
        schema: {
            description: 'Delete a scheduled backup or backups.',
            querystring: {
                playlistId: {
                    type: 'string',
                    description: 'playlist ID of backup to be deleted.'
                }
            },
            response: {
                200: {
                    type: 'boolean',
                    description: 'Backup(s) were deleted'
                }
            }
        },
        // @ts-ignore
        preHandler: server.auth([
            // @ts-ignore
            server.validateJWT
        ]),
        handler: BackupController.deleteScheduledBackup
    },
    {
        method: 'GET',
        url: '/backup/scheduled',
        schema: {
            description: 'Get a list of past, present, and future scheduled backups.',
            querystring: {
                id: {
                    type: 'string',
                    description: 'ID of the entity the backup was created for.'
                }
            },
            response: {
                200: {
                    type: 'object',
                    description: 'An array of backups.'
                }
            }
        },
        // @ts-ignore
        preHandler: server.auth([
            // @ts-ignore
            server.validateJWT
        ]),
        handler: BackupController.getScheduledBackupEvents
    }
];

export default routes;