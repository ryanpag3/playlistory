import Platforms from '../../../shared/src/Platforms';
import { createUser } from '../user/user-controller'
import { create } from '../user/user-service'
import { createBackup, getMostRecentBackup } from './backup-service'

it('should create a backup', async () => {
    const user = await create({
        password: '1234',
        email: '1234'
    });
    const backup = await createBackup(user, {
        platform: Platforms.SPOTIFY,
        playlistId: '1234',
        imageUrl: '123',
        name: '11234',
        playlistName: '1',
        playlistDescription: '1',
        contentHash: '1',
        tracks: ['1'],
        followers: 1,
        createdById: user.id
    });
    expect(backup).not.toBeNull();
    expect(backup.playlist).not.toBeNull();
});

it('should get the most recent backup', async () => {
    const user = await create({
        password: '1234',
        email: '1234'
    });
    await createBackup(user, {
        platform: Platforms.SPOTIFY,
        playlistId: '1234',
        imageUrl: '123',
        name: '11234',
        playlistName: '1',
        playlistDescription: '1',
        contentHash: '1',
        tracks: ['1'],
        followers: 1,
        createdById: user.id
    });
    const backup = await createBackup(user, {
        platform: Platforms.SPOTIFY,
        playlistId: '1234',
        imageUrl: '123',
        name: '11234',
        playlistName: '1',
        playlistDescription: '1',
        contentHash: '1',
        tracks: ['1'],
        followers: 1,
        createdById: user.id
    });
    const recent = await getMostRecentBackup('1234');
    expect(recent?.id).toBe(backup.id);
})