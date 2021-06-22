import { Platform } from '@prisma/client'
import { Playlist, Track } from '../music/music-types'
import logger from './logger'
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

export const getNormSpotifyTrack = (spotifyTrack: any): Track|undefined => {
    if (!spotifyTrack) {
        return undefined;
    }
    
    return {
        platform: Platform.SPOTIFY,
        id: spotifyTrack.id,
        name: spotifyTrack.name,
        url: spotifyTrack.external_urls.spotify,
        uri: spotifyTrack.uri
    }
}