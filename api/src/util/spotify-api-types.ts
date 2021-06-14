
// GET https://api.spotify.com/v1/me
export interface Me {
    country: string;
    display_name: string;
    email: string;
    external_urls: {
        spotify: string;
    };
    followers: {
        href: string;
        total: number;
    };
    href: string;
    id: string;
    images: {
        height?: number;
        url: string;
        width?: number;
    }[];
    product: string;
    type: string;
    uri: string;
}

export interface GetMyPlaylistsResult {
    href: string;
    items: {
        collaborative: boolean;
        external_urls: {
            spotify: string;
        };
        href: string;
        id: string;
        images: {
            height?: number;
            url: string;
            width?: number;
        }[];
        name: string;
        description: string;
        owner: {
            external_urls: {
                spotify: string;
            };
            href: string;
            id: string;
            type: string;
            uri: string;
            display_name: string;
        };
        public: boolean;
        snapshot_id: string;
        tracks: {
            href: string;
            total: number;
        };
        type: string;
        uri: string;
    }[];
    limit: number;
    next?: string;
    offset: number;
    previous?: string;
    total: number;
}