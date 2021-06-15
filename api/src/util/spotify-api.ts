import axios from 'axios';
import moment from 'moment';
import logger from './logger';
import { GetMyPlaylistsResult, Me } from './spotify-api-types';

export default class SpotifyApi {
    private refreshToken: string;
    private accessToken?: string;
    private expiresOn?: moment.Moment;

    constructor(refreshToken: string, accessToken?: string) {
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
        logger.info(`offset ${offset} limit ${limit}`);
        await this.refreshAccessToken();
        const { data } = await axios(
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
        return data;
    }
}

