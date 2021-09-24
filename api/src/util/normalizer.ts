import { Platform } from '@prisma/client'
import { Playlist, Track } from '../music/music-types'
import logger from './logger'
import Platforms from './Platforms'
import { SpotifyPlaylist } from './spotify-api-types'


export const getNormSpotifyPlaylist = (spotifyPlaylist: SpotifyPlaylist): Playlist => {
    return {
        platform: Platform.SPOTIFY,
        id: spotifyPlaylist.id,
        name: spotifyPlaylist.name,
        description: spotifyPlaylist.description,
        url: spotifyPlaylist.external_urls.spotify,
        uri: spotifyPlaylist.uri,
        imageUrl: spotifyPlaylist.images.length > 0 ? spotifyPlaylist.images[0].url : '',
        owner: {
            id: spotifyPlaylist.owner.id,
            name: spotifyPlaylist.owner.display_name as any,
        },
        snapshotId: spotifyPlaylist.snapshot_id,
        tracks: {
            items: [] as any,
            total: spotifyPlaylist.tracks.total
        }
    }
}

/**
 * Dupe of music-service.ts:normalizeSpotifyTrack()
 * 
 * TODO: remove dupe
 */
export const getNormSpotifyTrack = (spotifyTrack: any): Track|undefined => {

    if (!spotifyTrack) {
        return undefined;
    }

    return {
        platform: Platforms.SPOTIFY,
        id: spotifyTrack.id,
        name: spotifyTrack.name,
        artists: spotifyTrack.artists.map((a: any) => {
            return {
                id: a.id as any,
                name: a.display_name as any || a.name as any,
                uri: a.uri as any,
                url: a.external_urls.spotify as any,
            }
        }),
        uri: spotifyTrack.uri,
        url: spotifyTrack.external_urls.spotify,
        imageUrl: spotifyTrack.album?.images[0]?.url,
        albumName: spotifyTrack.album.name
    }
}