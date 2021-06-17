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