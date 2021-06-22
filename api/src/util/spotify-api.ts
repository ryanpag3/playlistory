import axios from 'axios';
import moment from 'moment';
import logger from './logger';
import { GetMyPlaylistsResult, Item, Me, SpotifyPlaylist } from './spotify-api-types';

export default class SpotifyApi {
    private refreshToken: string|null;
    private accessToken?: string;
    private expiresOn?: moment.Moment;
    private me?: Me;

    constructor(refreshToken: string|null, accessToken?: string) {
        this.refreshToken = refreshToken;
        this.accessToken = accessToken;
    }

    static async exchangeAuthCodes(authCode: string): Promise<{
        accessToken: string;
        tokenType: string;
        expiresIn: number;
        refreshToken: string;
        scope: string;
    }> {
        const { data } = await axios(`https://accounts.spotify.com/api/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                ...SpotifyApi.getClientAuthHeader()
            },
            params: {
                grant_type: 'authorization_code',
                code: authCode,
                redirect_uri: process.env.SPOTIFY_REDIRECT_URI
            }
        });

        return {
            accessToken: data.access_token,
            tokenType: data.token_type,
            expiresIn: data.expires_in,
            refreshToken: data.refresh_token,
            scope: data.scope
        };
    }

    static getClientAuthHeader() {
        return {
            Authorization:
                'Basic ' +
                Buffer.from(
                    process.env.SPOTIFY_CLIENT_ID +
                    ':' +
                    process.env.SPOTIFY_CLIENT_SECRET
                ).toString('base64'),
        };
    }

    getAuthHeader() {
        return {
            Authorization: 'Bearer ' + this.accessToken,
        };
    }

    async refreshAccessToken() {
        const { data } = await axios(
            `https://accounts.spotify.com/api/token`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    ...SpotifyApi.getClientAuthHeader(),
                },
                params: {
                    grant_type: 'refresh_token',
                    refresh_token: this.refreshToken,
                },
            }
        );
        const expiresOn = moment();
        expiresOn.add(data.expires_in, 'seconds');
        this.accessToken = data.access_token;
        this.expiresOn = expiresOn;
        logger.trace('refreshed access token');
    }

    async getMe(): Promise<Me> {
        await this.refreshAccessToken();

        const { data } = await axios(
            `https://api.spotify.com/v1/me`,
            {
                method: 'GET',
                headers: {
                    ...this.getAuthHeader()
                }
            }
        );

        return data;
    }

    async getMyPlaylists(offset: number = 0, limit: number = 50): Promise<GetMyPlaylistsResult> {
        await this.refreshAccessToken();
        logger.info('getting playlists');
        if (!this.me) {
            this.me = await this.getMe();
        }

        let { data } = await axios(
            `https://api.spotify.com/v1/me/playlists`,
            {
                method: 'GET',
                headers: {
                    ...this.getAuthHeader()
                },
                params: {
                    offset,
                    limit
                }
            }
        );

        // @ts-ignore
        data.items = data.items.filter(d => {
            return d.owner.id === this.me?.id;
        })

        return data;
    }

    async getPlaylistAndTracks(id: string) {
        await this.refreshAccessToken();

        const { data }: {
            data: SpotifyPlaylist;
        } = await axios(
            `https://api.spotify.com/v1/playlists/${id}`,
            {
                headers: {
                    ...this.getAuthHeader()
                }
            }
        );

        let offset = 0;
        const limit = 100;
        let tracks: any = [];
        while (offset < data.tracks.total) {
            tracks = [...tracks, ...await this.getPlaylistTracks(id, offset, limit)];
            offset += limit;
        }
        data.tracks.items = tracks;
        return data;
    }

    async getPlaylistTracks(id: string, offset: number = 0, limit: number = 100): Promise<Item[]> {
        await this.refreshAccessToken();
        const { data } = await axios(
            `https://api.spotify.com/v1/playlists/${id}/tracks`,
            {
                headers: {
                    ...this.getAuthHeader()
                },
                params: {
                    offset,
                    limit
                }
            }
        )
        return data.items;
    }

    async getTracks(ids: string[]) {
        await this.refreshAccessToken();
        const { data } = await axios(`https://api.spotify.com/v1/tracks`, {
            method: 'GET',
            headers: {
                ...this.getAuthHeader()
            },
            params: {
                ids: ids.join(',')
            }
        });
        return data.tracks;
    }

    async addTracksToPlaylist(playlistId: string, trackUris: any[]) {
        await this.refreshAccessToken();
        const { data } = await axios(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: 'POST',
            headers: {
                ...this.getAuthHeader(),
                'Content-Type': 'application/json'
            },
            data: {
                uris: trackUris
            }
        });
        return data;
    }

    async removeTracksFromPlaylist(playlistId: string, trackUris: {
        uri: string;
    }[]) {
        await this.refreshAccessToken();
        const { data } = await axios(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: 'DELETE',
            headers: {
                ...this.getAuthHeader(),
                'Content-Type': 'application/json'
            },
            data: {
                tracks: trackUris
            }
        });
        return data;
    }

    async createPlaylist(title: string, description: string) {
        await this.refreshAccessToken();
        const me = await this.getMe();
        const { data } = await axios(`https://api.spotify.com/v1/users/${me.id}/playlists`, 
        {
            method: 'POST',
            headers: {
                ...this.getAuthHeader(),
                'Content-Type': 'application/json'
            },
            data: {
                name: title,
                description
            }
        });
        return data;
    }
}

