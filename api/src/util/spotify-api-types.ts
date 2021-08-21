
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

export interface SpotifyPlaylist {
    collaborative: boolean;
    description:   string;
    external_urls: ExternalUrls;
    followers:     Followers;
    href:          string;
    id:            string;
    images:        Image[];
    name:          string;
    owner:         Owner;
    primary_color: null;
    public:        boolean;
    snapshot_id:   string;
    tracks:        Tracks;
    type:          string;
    uri:           string;
}

export interface ExternalUrls {
    spotify: string;
}

export interface Followers {
    href:  null;
    total: number;
}

export interface Image {
    height: number | null;
    url:    string;
    width:  number | null;
}

export enum OwnerType {
    Artist = "artist",
    User = "user",
}

export interface Owner {
    display_name?: string;
    external_urls: ExternalUrls;
    href:          string;
    id:            string;
    type:          OwnerType;
    uri:           string;
    name?:         string;
}

export interface Tracks {
    href:     string;
    items:    Item[];
    limit:    number;
    next:     null;
    offset:   number;
    previous: null;
    total:    number;
}

export interface Item {
    added_at:        string;
    added_by:        Owner;
    is_local:        boolean;
    primary_color:   null;
    track:           SpotifyTrack;
    video_thumbnail: VideoThumbnail;
}

export interface SpotifyTrack {
    album:             Album;
    artists:           Owner[];
    available_markets: string[];
    disc_number:       number;
    duration_ms:       number;
    episode:           boolean;
    explicit:          boolean;
    external_ids:      ExternalIDS;
    external_urls:     ExternalUrls;
    href:              string;
    id:                string;
    is_local:          boolean;
    name:              string;
    popularity:        number;
    preview_url:       string;
    track:             boolean;
    track_number:      number;
    type:              TrackType;
    uri:               string;
    images:            any[];
}

export interface Album {
    album_type:             AlbumTypeEnum;
    artists:                Owner[];
    available_markets:      string[];
    external_urls:          ExternalUrls;
    href:                   string;
    id:                     string;
    images:                 Image[];
    name:                   string;
    release_date:           string;
    release_date_precision: ReleaseDatePrecision;
    total_tracks:           number;
    type:                   AlbumTypeEnum;
    uri:                    string;
}

export enum AlbumTypeEnum {
    Album = "album",
    Single = "single",
}

export enum ReleaseDatePrecision {
    Day = "day",
}

export interface ExternalIDS {
    isrc: string;
}

export enum TrackType {
    Track = "track",
}

export interface VideoThumbnail {
    url: null;
}
