import { Backup, Platform, User } from '@prisma/client';
import moment from 'moment';
import { createBackup, getIntervalFromCronSchedule } from '../backup/backup-service';
import { chunk } from '../util/array';
import logger from '../util/logger';
import { getNormSpotifyPlaylist } from '../util/normalizer';
import Platforms from '../util/Platforms';
import prisma from '../util/prisma';
import SpotifyApi from '../util/spotify-api';
import { GetMyPlaylistsResult, SpotifyPlaylist, SpotifyTrack } from '../util/spotify-api-types';
import { Playlist, Track } from './music-types';

export const getAllMyPlaylists = async (user: User, platform: Platform, includeDeleted: boolean = true) => {
    let offset = 0;
    const limit = 50;
    let playlists: any[] = [];
    while (true) {
        const p = await getMyPlaylists(user, offset, limit, platform, includeDeleted);
        if (p.length === 0)
            break;
        playlists = [...playlists, ...p];
        offset = offset + limit;
    }
    return playlists;
}

export const getMyPlaylists = async (user: User, offset: number = 0, limit: number = 50, platform: string, includeDeleted: boolean = true): Promise<Playlist[]> => {
    let result;
    switch (platform) {
        case Platforms.SPOTIFY:
            result = await getMySpotifyPlaylists(user, offset, limit);
            result = getNormalSpotifyMyPlaylistResult(result);
            break;
        default:
            throw new Error(`Valid platform not found.`);
    }

    result = result.map(async (playlist: Playlist) => {
        const [scheduledBackup] = await prisma.backup.findMany({
            where: {
                createdById: user.id,
                playlist: {
                    playlistId: playlist.id
                },
                scheduled: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                playlist: true
            },
            take: 1
        });

        if (scheduledBackup) {
            logger.debug('including scheduled  backup');
            // @ts-ignore
            scheduledBackup.interval = getIntervalFromCronSchedule(scheduledBackup.cronSchedule);
            
            logger.info(scheduledBackup);
            // @ts-ignore
            playlist.scheduledBackup = scheduledBackup;
        }

        const [backup] = await prisma.backup.findMany({
            where: {
                createdById: user.id,
                playlist: {
                    playlistId: playlist.id
                },
                scheduled: false
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                playlist: true
            },
            take: 1
        });

        if (backup) {
            // @ts-ignore
            playlist.lastBackedUp = backup.createdAt;
        }

        return playlist;
    });

    result = await Promise.all(result);

    if (offset === 0 && includeDeleted === true) { // only append deleted on first query
        const deletedPlaylistBackups = await prisma.backup.findMany({
            where: {
                createdById: user.id,
                playlist: {
                    playlistId: {
                        notIn: result.map(r => r.id)
                    }
                }
            },
            include: {
                playlist: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const deletedPlaylists = deletedPlaylistBackups.map(b => {
            //@ts-ignore
            b.playlist.lastBackedUp = b.createdAt;
            b.playlist.id = b.playlist.playlistId;
            return b.playlist;
        });

        const uniqueList = removeDuplicates(deletedPlaylists, 'id');

        result = [...result, ...uniqueList];
    }

    result = result.sort((a, b) => {

        const aM = moment(a.lastBackedUp || '1970');
        const bM = moment(b.lastBackedUp || '1970');

        if (aM.isAfter(bM))
            return -1;
        
        if (aM.isBefore(bM))
            return 1;
        
        return 0;
    })

    // @ts-ignore
    return result;
}

function removeDuplicates(originalArray: any[], prop: string) {
    var newArray = [];
    var lookupObject: any = {};

    for (var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}

const getMySpotifyPlaylists = async (user: User, offset: number = 0, limit: number = 50) => {
    // @ts-ignore
    const spotifyApi = new SpotifyApi(user.spotifyRefreshToken);
    return spotifyApi.getMyPlaylists(offset, limit);
}

const getNormalSpotifyMyPlaylistResult = (result: GetMyPlaylistsResult): Playlist[] => {
    return result.items.map(item => {
        return {
            platform: Platforms.SPOTIFY,
            id: item.id,
            name: item.name,
            description: item.description,
            url: item.external_urls.spotify,
            uri: item.uri,
            imageUrl: item.images[0]?.url,
            owner: {
                id: item.owner.id,
                name: item.owner.display_name,
                url: item.owner.external_urls.spotify
            },
            snapshotId: item.snapshot_id,
            tracks: {
                items: [] as any,
                total: item.tracks.total
            }
        }
    });
}

export const getPlaylist = async (user: User, platform: Platform, id: string) => {
    let playlist;
    switch (platform) {
        case Platform.SPOTIFY:
            const spotifyApi = new SpotifyApi(user.spotifyRefreshToken);
            playlist = normalizeSpotifyPlaylist(await spotifyApi.getPlaylistAndTracks(id))
            break;
        default:
            throw new Error(`Valid platform not found.`);
    }
    return playlist;
}

const normalizeSpotifyPlaylist = (spotifyPlaylist: SpotifyPlaylist): Playlist => {
    return {
        platform: Platforms.SPOTIFY,
        id: spotifyPlaylist.id,
        name: spotifyPlaylist.name,
        description: spotifyPlaylist.description,
        url: spotifyPlaylist.external_urls.spotify,
        uri: spotifyPlaylist.uri,
        imageUrl: spotifyPlaylist.images[0]?.url,
        owner: {
            id: spotifyPlaylist.owner.id,
            name: spotifyPlaylist.owner.display_name as any
        },
        snapshotId: spotifyPlaylist.snapshot_id,
        tracks: {
            // @ts-ignore
            items: spotifyPlaylist.tracks.items.map(i => normalizeSpotifyTrack(i.track)).filter(i => i !== undefined),
            total: spotifyPlaylist.tracks.total
        },
        followers: spotifyPlaylist.followers.total
    }
}

const normalizeSpotifyTrack = (sTrack: SpotifyTrack): Track|undefined => {
    if (!sTrack)
        return undefined;
    
    return {
        platform: Platforms.SPOTIFY,
        id: sTrack.id,
        name: sTrack.name,
        artists: sTrack.artists.map(a => {
            return {
                id: a.id as any,
                name: a.display_name as any || a.name as any,
                uri: a.uri as any,
                url: a.external_urls.spotify as any,
            }
        }),
        uri: sTrack.uri,
        url: sTrack.external_urls.spotify
    }
}

export const revertAddedToBackup = async (user: User, backupId: string) => {
    const backup = await prisma.backup.findUnique({
        where: {
            id: backupId
        },
        include: {
            playlist: true
        }
    });

    if (!backup)
        throw new Error(`Cannot find backup to revert added songs with id ${backupId}`);

    let playlist = await getPlaylist(user, backup.playlist.platform, backup.playlist.playlistId);
    const myPlaylists = await getAllMyPlaylists(user, backup.playlist.platform, false);
    const isFollowingPlaylist = myPlaylists.filter(p => p.id === playlist.id).length >= 1;
    if (!playlist || !isFollowingPlaylist) {
        playlist = await resolvePlaylistLink(user, backup);
        // @ts-ignore
        await addSongs(user, backup.playlist.platform, backup.playlist.tracks);
    }

    // @ts-ignore
    return removeSongs(user, backup.playlist.platform, playlist.id, backup.manifest?.added as any);
}

const removeSongs = async (user: User, platform: Platform, playlistId: string, toRemove: {
    uri: string;
    id: string;
}[] = []) => {
    switch (platform) {
        case Platform.SPOTIFY:
            return removeSongsFromSpotifyPlaylist(user, playlistId, toRemove);
        default:
            throw new Error(`Invalid platform provided`);
    }
}


const removeSongsFromSpotifyPlaylist = async (user: User, playlistId: string, toRemove: {
    uri: string;
    id: string;
}[]) => {
    const spotifyApi = new SpotifyApi(user.spotifyRefreshToken);
    const res = await spotifyApi.removeTracksFromPlaylist(playlistId, toRemove.map(r => {
        return { uri: r.uri }
    }));
    return res;
}

export const revertRemovedFromBackup = async (user: User, backupId: string) => {
    const backup = await prisma.backup.findUnique({
        where: {
            id: backupId
        },
        include: {
            playlist: true
        }
    });

    if (!backup)
        throw new Error(`Cannot find backup to revert added songs with id ${backupId}`);

    let playlist = await getPlaylist(user, backup.playlist.platform, backup.playlist.playlistId);
    const myPlaylists = await getAllMyPlaylists(user, backup.playlist.platform, false);
    const isFollowingPlaylist = myPlaylists.filter(p => p.id === playlist.id).length >= 1;
    if (!playlist || !isFollowingPlaylist) {
        playlist = await resolvePlaylistLink(user, backup);
        logger.info(backup.playlist);
        // @ts-ignore
        await addSongs(user, backup.playlist.platform, playlist.id, backup.playlist.tracks);
    }

    // @ts-ignore
    return addSongs(user, backup.playlist.platform, backup.playlist.playlistId, backup.manifest?.removed as any);
}

const addSongs = async (user: User, platform: Platform, playlistId: string, toAdd: {
    uri: string;
    id: string;
}[] = []) => {
    switch (platform) {
        case Platform.SPOTIFY:
            return addSongsToSpotifyPlaylist(user, playlistId, toAdd);
        default:
            throw new Error(`Invalid platform provided`);
    }
}

const addSongsToSpotifyPlaylist = async (user: User, playlistId: string, toAdd: {
    uri: string;
    id: string;
}[]) => {
    const spotifyApi = new SpotifyApi(user.spotifyRefreshToken);
    const res = await spotifyApi.addTracksToPlaylist(playlistId, toAdd.map(r => r.uri));
    return res;
}

export const restoreToBackup = async (user: User, backupId: string) => {
    const backup = await prisma.backup.findUnique({
        where: {
            id: backupId
        },
        include: {
            playlist: true
        }
    });

    if (!backup)
        throw new Error(`Backup not found.`);

    logger.info(`restoring ${backup.playlist.playlistId} from backup ${backupId}`);

    let playlist = await getPlaylist(user, backup.playlist.platform, backup.playlist.playlistId);
    const myPlaylists = await getAllMyPlaylists(user, backup.playlist.platform, false);
    const isFollowingPlaylist = myPlaylists.filter(p => p.id === playlist.id).length >= 1;

    if (!playlist || !isFollowingPlaylist) {
        playlist = await resolvePlaylistLink(user, backup);
    } else {
        await removeAddedFromBackup(user, backup, playlist);
    }

    await addRemovedFromBackup(user, backup, playlist);
}

const createPlaylist = async (user: User, platform: Platform, title: string, description: string) => {
    switch (platform) {
        case Platform.SPOTIFY:
            const playlist = await createPlaylistSpotify(user, platform, title, description);
            return getNormSpotifyPlaylist(playlist);
        default:
            throw new Error(`Invalid platform provided`);
    }
}

const createPlaylistSpotify = async (user: User, platform: Platform, title: string, description: string) => {
    const spotifyApi = new SpotifyApi(user.spotifyRefreshToken);
    return spotifyApi.createPlaylist(title, description);
}

const resolvePlaylistLink = async (user: User, backup: Backup) => {
    // re-link playlist to platform
    logger.debug('creating playlist to relink to platform');
    // @ts-ignore
    const playlist = await createPlaylist(user, backup.playlist.platform, backup.playlist.name, backup.playlist.description);
    // update all references to old playlist to use new one
    await prisma.playlist.updateMany({
        where: {
            createdById: user.id,
            // @ts-ignore
            playlistId: backup.playlist.playlistId
        },
        data: {
            // @ts-ignore
            platform: backup.playlist.platform,
            playlistId: playlist.id,
            name: playlist.name,
            description: playlist.description,
            imageUrl: playlist.imageUrl,
        }
    });
    return playlist;
}

const removeAddedFromBackup = async (user: User, backup: Backup, playlist: Playlist) => {
    logger.debug('removing existing songs');
    const removeChunks = chunk(playlist.tracks.items as any, 100);
    for (const chunk of removeChunks) {
        // @ts-ignore
        await removeSongs(user, backup.playlist.platform, backup.playlist.playlistId, chunk.map(c => {
            return c;
        }));
    }
}

const addRemovedFromBackup = async (user: User, backup: Backup, playlist: Playlist) => {
    logger.debug('adding songs from backup');
    // @ts-ignore
    const addChunks = chunk(backup.playlist.tracks as any, 100);
    for (const chunk of addChunks) {
        // @ts-ignore
        await addSongs(user, backup.playlist.platform, playlist.id, chunk);
    }
}