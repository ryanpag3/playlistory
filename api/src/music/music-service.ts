import { Platform, User } from '@prisma/client';
import Platforms from 'shared/src/Platforms';
import logger from '../util/logger';
import SpotifyApi from '../util/spotify-api';
import { GetMyPlaylistsResult, SpotifyPlaylist } from '../util/spotify-api-types';
import { Playlist } from './music-types';

export const getMyPlaylists = async (user: User, offset: number = 0, limit: number = 50, platform: string): Promise<Playlist[]> => {
    let result;
    switch (platform) {
        case Platforms.SPOTIFY:
            result = await getMySpotifyPlaylists(user, offset, limit);
            result = getNormalSpotifyMyPlaylistResult(result);
            break;
        default:
            throw new Error(`Valid platform not found.`);
    }
    logger.info(JSON.stringify(result, null, 4));
    return result
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
                name: item.owner.display_name
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
            items: spotifyPlaylist.tracks.items as any,
            total: spotifyPlaylist.tracks.total
        },
        followers: spotifyPlaylist.followers.total
    }
}

