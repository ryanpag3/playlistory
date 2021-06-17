import { Platform, User } from '@prisma/client';
import prisma from '../util/prisma';

export const createBackup = async (user: User, opts: {
    platform: string;
    playlistId: string;
    name: string;
    playlistName: string;
    playlistDescription: string;
    contentHash: string;
    tracks: string[];
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
        }
    })

    return prisma.backup.create({
        data: {
            createdById: user.id,
            name: opts.name,
            playlistId: playlist.id
        },
        include: {
            playlist: true
        }
    });
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