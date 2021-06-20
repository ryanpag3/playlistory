import { delay } from 'bluebird';
import Platforms from '../../../shared/src/Platforms';
import { create } from '../user/user-service'
import logger from '../util/logger';
import { getRandomString } from '../util/test-helper';
import { createBackup, generateManifest, getMostRecentBackup } from './backup-service'

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
});

it('should generate a manifest for two backups', async () => {
    // these are randomly generated so should give a high probability of diff
    // **technically** they have different owners but its irrelevant for this
    const backup1 = await generateBackup();
    const backup2 = await generateBackup();
    const withManifest = await generateManifest(backup1, backup2);
    expect(withManifest.manifest).not.toBeNull();
})

const generateBackup = async () => {
    const user = await create({
        email: getRandomString(),
        password: getRandomString()
    });

    const backup = await createBackup(user, {
        platform: Platforms.SPOTIFY,
        playlistId: getRandomString(),
        imageUrl: getRandomString(),
        name: getRandomString(),
        playlistName: getRandomString(),
        playlistDescription: getRandomString(),
        contentHash: getRandomString(),
        tracks: [getRandomString()],
        followers: 0,
        createdById: user.id
    });

    return backup;
}