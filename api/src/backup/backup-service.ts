import { Backup, Platform, Playlist, User } from '@prisma/client';
import { chunk } from '../util/array';
import logger from '../util/logger';
import { getNormSpotifyTrack } from '../util/normalizer';
import prisma from '../util/prisma';
import { scheduleJobs } from '../util/scheduler';
import SpotifyApi from '../util/spotify-api';
import * as MusicService from '../music/music-service';
import Platforms from '../util/Platforms';
import ProcessBackupsPremiumQueue from '../message-queues/process-backups-premium';

export const runBackup = async (user: User, playlistId: string, backupName: string, platform: string, interval?: string) => {
    const mostRecentBackup = await getMostRecentBackup(user.id, playlistId);
        // @ts-ignore
        const playlist = await MusicService.getPlaylist(user, platform, playlistId);

        if (!playlist)
            throw new Error(`Playlist not found.`);
        
        let cronSchedule;
        if (interval) {
            cronSchedule = getCronSchedule(interval);
            const existingScheduledBackup = await prisma.backup.findMany({
                where: {
                    createdById: user.id,
                    playlist: {
                        playlistId
                    },
                    scheduled: true
                },
                include: {
                    playlist: true
                }
            });
            if (existingScheduledBackup) {
                logger.debug(`deleting existing scheduled backups for playlist.`);
                for (const bu of existingScheduledBackup) {
                    await deleteBackup(bu.id);
                }
            }
        }

        // @ts-ignore
        let currentBackup = await createBackup(user, {
            name: backupName,
            playlistId: playlist.id,
            playlistName: playlist.name,
            playlistDescription: playlist.description,
            imageUrl: playlist.imageUrl as any,
            contentHash: playlist.snapshotId,
            followers: playlist.followers as any,
            // @ts-ignore
            tracks: playlist.tracks.items.map(i => {
                return {
                    id: i.id,
                    uri: i.uri
                }
            }),
            // @ts-ignore
            platform: Platforms.SPOTIFY,
            // @ts-ignore
            createdById: user.id,
            scheduled: cronSchedule ? true : false,
            cronSchedule
        });

        if (interval) {
            scheduleJobs();
        }


        if (mostRecentBackup?.playlist.contentHash === currentBackup.playlist.contentHash || cronSchedule !== undefined) {
            logger.debug(`skipping diff generation as the contents of the playlist [${playlist.id}] hasn't changed.`);
            currentBackup = await prisma.backup.update({
                where: {
                    id: currentBackup.id
                },
                data: {
                    manifest: {
                        added: [],
                        removed: []
                    }
                },
                include: {
                    playlist: true,
                    createdBy: true
                }
            });
            
            return currentBackup;
        }

        return generateManifest(mostRecentBackup, currentBackup);
}

export const createBackup = async (user: User, opts: {
    platform: string;
    playlistId: string;
    name: string;
    playlistName: string;
    playlistDescription: string;
    contentHash: string;
    tracks: any[];
    followers: number;
    imageUrl: string;
    createdById: string;
    scheduled: boolean;
    cronSchedule?: string;
}) => {
    const playlist = await prisma.playlist.create({
        data: {
            platform: Platform.SPOTIFY,
            playlistId: opts.playlistId,
            name: opts.playlistName,
            description: opts.playlistDescription,
            imageUrl: opts.imageUrl,
            contentHash: opts.contentHash,
            followers: opts.followers,
            tracks: opts.tracks,
            createdById: user.id
        },
        include: {
            createdBy: true
        }
    })

    return prisma.backup.create({
        data: {
            createdById: user.id,
            name: opts.name,
            playlistId: playlist.id,
            scheduled: opts.scheduled,
            cronSchedule: opts.cronSchedule || null
        },
        include: {
            playlist: true,
            createdBy: true
        }
    });
}

export const generateManifest = async (mostRecentBackup: (Backup & { playlist: Playlist; }) | null, 
                                            currentBackup: (Backup & { playlist: Playlist; }) | null) => {

    const isFirstBackup = !mostRecentBackup;

    // @ts-ignore
    let diffAdded = currentBackup.playlist.tracks.filter(x => !mostRecentBackup?.playlist.tracks.some((t) => {
        return x.id === t.id;
    }));

    // @ts-ignore
    let diffRemoved = mostRecentBackup?.playlist.tracks.filter(x => !currentBackup.playlist.tracks.some((t) => {
        return x.id === t.id;
    }));

    /**
     * This is zeroed out to avoid giving the implication that
     * the application is creating a backup against an existing
     * playlist with 0 songs in it.
     */
    if (isFirstBackup) {
        diffAdded = [];
        diffRemoved = [];
    }

    // @ts-ignore
    const backup = await prisma.backup.update({
        where: {
            // @ts-ignore
            id: currentBackup.id
        },
        data: {
            manifest: {
                added: diffAdded || [],
                removed: diffRemoved || []
            }
        },
        include: {
            playlist: true
        }
    });

    return backup;
}

export const getMostRecentBackup = async (createdById: string, playlistId: string) => {
    return prisma.backup.findFirst({
        where: {
            createdById,
            playlist: {
                playlistId
            }
        },
        include: {
            playlist: true
        },
        orderBy: [
            {
                createdAt: 'desc'
            }
        ]
    })
};

export const getBackups = async (user: User, playlistId: string) => {
    logger.debug(`getting backups for playlist ${playlistId}`);
    if (!playlistId)
        throw new Error(`playlist ID is required.`);
    
    const backups = await prisma.backup.findMany({
        where: {
            playlist: {
                playlistId
            },
            createdById: user.id,
            // we want backups that have been executed, not scheduled
            scheduled: false
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            playlist: true
        }
    });

    const resolved = [];
    for (const b of backups) {
        if (b.manifest)
            b.manifest = await resolveManifest(user, b.playlist.platform, b.manifest);
        resolved.push(b);
    }

    return resolved;
}

const resolveManifest = async (user: User, platform: string|Platform, manifest: any) => {
    switch(platform) {
        case Platform.SPOTIFY:
            return resolveManifestSpotify(user, manifest);
        default:
            throw new Error(`Invalid platform provided.`);
    }
}

const resolveManifestSpotify = async (user: User, manifest: any) => {
    logger.debug(`resolving spotify manifest`);
    // lets query as one to save API calls
    let trackIds = [...(manifest.added || []), ...(manifest.removed || [])];

    if (trackIds.length === 0)
        return manifest;

    const spotifyApi = new SpotifyApi(user.spotifyRefreshToken);
    const chunks = chunk(trackIds, 50);
    let tracks: any[] = [];
    for (const chunk of chunks) {
        const newTracks = await spotifyApi.getTracks(chunk.map(c => c.id));
        tracks = [...tracks, ...newTracks];
    }

    logger.debug(`${tracks.length} tracks to resolve.`);

    for (let i = 0; i < (manifest.added?.length || 0); i++) {
        manifest.added[i] = getNormSpotifyTrack(tracks.filter((t: any) => t.id === manifest.added[i].id)[0]);
    }

    for (let i = 0; i < (manifest.removed?.length || 0); i++) {
        manifest.removed[i] = getNormSpotifyTrack(tracks.filter((t: any) => t.id === manifest.removed[i].id)[0]);
    }

    return manifest;
}

export const deleteBackup = async (id: string) => {
    logger.debug(`deleting backup ${id}`);
    return prisma.backup.delete({
        where: {
            id
        }
    });
}

export const deleteScheduledBackupsByPlaylistId = async (createdById: string, playlistId: string) => {
    logger.debug(`deleting scheduled backups by playlist id ${playlistId}`);
    const backups = await prisma.backup.findMany({
        where: {
            createdById,
            playlist: {
                playlistId
            },
            scheduled: true
        }
    });
    
    const promises = [];
    for (const backup of backups) {
        promises.push(deleteBackup(backup.id));
    }

    return Promise.all(promises);
}

export const isBackupPermitted = async (user: User, playlistId: string, interval?: string) => {
    if (user.isSubscribed) {
        logger.debug(`user is premium tier, backup is permitted.`);
        return true;
    }

    const uniquePlaylists = await prisma.playlist.findMany({
        where: {
            createdById: user.id
        },
        distinct: [ 'playlistId' ]
    });

    const backupEventAmt = await prisma.backupEvent.count({
        where: {
            createdById: user.id,
            playlistId
        }
    });

    return backupEventAmt < 3 && uniquePlaylists.length < 3 && interval === undefined;
}

const ONCE_PER_HOUR  = '0 * * * *';
const ONCE_PER_DAY   = '0 0 * * *';
const ONCE_PER_WEEK  = '0 0 * * 0';
const ONCE_PER_MONTH = '0 0 1 * *';
const ONCE_PER_YEAR  = '0 0 1 1 *';

/**
 * This is very rudimentary but our choices for scheduling are also rudimentary.
 * We support:
 * Once per hour
 * Once per day
 * Once per week
 * Once per month
 * Once per year
 * 
 * Times are hardcoded and cannot be changed, jobs are buffered using a queue so no point allowing scheduled times.
 */
export const getCronSchedule = (interval: string) => {

    switch (interval) {
        case 'hour':
            return ONCE_PER_HOUR;
        case 'day':
            return ONCE_PER_DAY;
        case 'week':
            return ONCE_PER_WEEK;
        case 'month':
            return ONCE_PER_MONTH;
        case 'year':
            return ONCE_PER_YEAR;
        default:
            throw new Error(`Invalid cron expression provided.`);
    }
}

export const getIntervalFromCronSchedule = (schedule: string) => {
    switch(schedule) {
        case ONCE_PER_HOUR:
            return 'hour';
        case ONCE_PER_DAY:
            return 'day';
        case ONCE_PER_WEEK:
            return 'week';
        case ONCE_PER_MONTH:
            return 'month';
        case ONCE_PER_YEAR:
            return 'year';
    }
}


export const getBackupEvents = async (user: User, offset: number = 0, limit: number = 30) => {
    logger.debug(`getting backup events for ${user.id}`);
    // TODO: get upcoming events as well
    let backupEvents = await prisma.backupEvent.findMany({
        orderBy: [
            {
                status: 'asc'
            },
            {
                createdAt: 'desc'
            }
        ],
        skip: offset,
        // take: limit,
        include: {
            backup: true
        },
        where: {
            createdById: user.id
        }
    });

    backupEvents = await resolveQueueMetaData(backupEvents);

    return backupEvents;
}

export const resolveQueueMetaData = async (backupEvents: any[]) => {

    for (let i = 0; i < backupEvents.length; i++) {
        let event: any = backupEvents[i];

        if (event.status !== 'PENDING')
            continue;

        const waitingJobs = await ProcessBackupsPremiumQueue.getWaiting();

        const foundJobIndex = waitingJobs.findIndex((j) => {
            return j.id === event.jobId
        });

        event.jobPosition = foundJobIndex+1; // queue position is not 0 based
        event.totalJobs = waitingJobs.length;

        backupEvents[i] = event;
    }

    return backupEvents;
}

export const createBackupEvent = async (userId: string, playlistId: string, playlistName: string ) => {
    logger.debug(`creating backup event for playlist ${playlistId} for user ${userId}`);
    return prisma.backupEvent.create({
        data: {
            createdById: userId,
            playlistId,
            playlistName
        }
    });
}

export const setBackupEventInProgress = async (backupEventId: string) => {
    logger.debug(`setting backup event to in-progress ${backupEventId}`);
    return prisma.backupEvent.update({
        where: {
            id: backupEventId
        },
        data: {
            status: 'STARTED'
        }
    });
}

export const setBackupEventCompleted = async (backupId: string, backupEventId: string) => {
    logger.debug(`setting backup event to completed ${backupEventId}`);
    return prisma.backupEvent.update({
        where: {
            id: backupEventId
        },
        data: {
            status: 'COMPLETED',
            finishedAt: new Date(),
            backupId
        }
    });
}

export const setBackupEventError = async (backupEventId: string) => {
    return prisma.backupEvent.update({
        where: {
            id: backupEventId
        },
        data: {
            status: 'ERROR'
        }
    });
}

