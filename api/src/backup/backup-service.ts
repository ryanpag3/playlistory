import { Backup, Platform, Playlist, User } from '@prisma/client';
import prisma from '../util/prisma';

export const createBackup = async (user: User, opts: {
    platform: string;
    playlistId: string;
    name: string;
    playlistName: string;
    playlistDescription: string;
    contentHash: string;
    tracks: any[];
    followers: number;
    imageUrl: string;
    createdById: string;
}) => {
    const playlist = await prisma.playlist.create({
        data: {
            platform: Platform.SPOTIFY,
            playlistId: opts.playlistId,
            name: opts.name,
            description: opts.playlistDescription,
            imageUrl: opts.imageUrl,
            contentHash: opts.contentHash,
            followers: opts.followers,
            tracks: opts.tracks,
            createdById: user.id
        },
        include: {
            createdBy: true
        }
    })

    return prisma.backup.create({
        data: {
            createdById: user.id,
            name: opts.name,
            playlistId: playlist.id
        },
        include: {
            playlist: true,
            createdBy: true
        }
    });
}

export const generateManifest = async (mostRecentBackup: (Backup & { playlist: Playlist; }) | null, 
                                            currentBackup: (Backup & { playlist: Playlist; }) | null) => {
    // @ts-ignore
    const diffAdded = currentBackup.playlist.tracks.filter(x => !mostRecentBackup?.playlist.tracks.includes(x));

    // @ts-ignore
    const diffRemoved = mostRecentBackup?.playlist.tracks.filter(x => !currentBackup.playlist.tracks.includes(x));

    // @ts-ignore
    const backup = await prisma.backup.update({
        where: {
            // @ts-ignore
            id: currentBackup.id
        },
        data: {
            manifest: {
                added: diffAdded,
                removed: diffRemoved
            }
        },
        include: {
            playlist: true
        }
    });

    return backup;
}

export const getMostRecentBackup = async (playlistId: string) => {
    return prisma.backup.findFirst({
        where: {
            playlist: {
                playlistId
            }
        },
        include: {
            playlist: true
        },
        orderBy: [
            {
                createdAt: 'desc'
            }
        ]
    })
}