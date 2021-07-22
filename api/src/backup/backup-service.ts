import { Backup, Platform, Playlist, User } from '@prisma/client';
import { chunk } from '../util/array';
import logger from '../util/logger';
import { getNormSpotifyTrack } from '../util/normalizer';
import prisma from '../util/prisma';
import SpotifyApi from '../util/spotify-api';

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
    // @ts-ignore
    const diffAdded = currentBackup.playlist.tracks.filter(x => !mostRecentBackup?.playlist.tracks.includes(x));

    // @ts-ignore
    const diffRemoved = mostRecentBackup?.playlist.tracks.filter(x => !currentBackup.playlist.tracks.includes(x));

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

export const getMostRecentBackup = async (playlistId: string) => {
    return prisma.backup.findFirst({
        where: {
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
        const newTracks = await await spotifyApi.getTracks(chunk.map(c => c.id));
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
    const backup = await prisma.backup.findUnique({
        where: {
            id
        }
    });
    
    const res = await prisma.$transaction([
        prisma.backup.delete({
            where: {
                id: backup?.id
            }
        }),
        prisma.playlist.delete({
            where: {
                id: backup?.playlistId
            }
        })
    ]);

    return res;
}

export const deleteScheduledBackupsByPlaylistId = async (playlistId: string) => {
    logger.debug(`deleting scheduled backups by playlist id ${playlistId}`);
    const backups = await prisma.backup.findMany({
        where: {
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

export const isBackupPermitted = async (user: User, playlistId: string) => {
    if (user.isSubscribed) {
        logger.debug(`user is premium tier, backup is permitted.`);
        return true;
    }

    const backupAmt = await prisma.backup.count({
        where: {
            playlist: {
                playlistId 
            }
        }
    });

    return backupAmt < 3;
}

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
    const ONCE_PER_HOUR  = '0 * * * *';
    const ONCE_PER_DAY   = '0 0 * * *';
    const ONCE_PER_WEEK  = '0 0 0 * *';
    const ONCE_PER_MONTH = '0 0 0 0 *';
    const ONCE_PER_YEAR  = '0 0 0 0 0';

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