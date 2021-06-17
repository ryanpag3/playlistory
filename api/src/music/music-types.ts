export interface Playlist {
    platform: string;
    id: string;
    name: string;
    description: string;
    url: string;
    uri?: string;
    imageUrl?: string;
    owner: {
        id: string;
        name: string;
    }
    snapshotId: string;
    tracks: {
        items: [any],
        total: number
    };
    followers?: number;
}

export interface Track {
    platform: string;
    id: string;
    name: string;
    artists: {
        id: string;
        name: string;
        uri: string;
        url: string;
    }[];
    uri: string;
    url: string;
}