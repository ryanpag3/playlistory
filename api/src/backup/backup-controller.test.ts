import { server } from '..';
import CookieNames from '../../../shared/src/CookieNames';
import { createTestUser } from '../util/test-helper';

it('should create a backup for a valid user', async () => {
    const user = await createTestUser();
    const res = await server.inject({
        method: 'POST',
        url: '/backup',
        payload: {
            playlistId: '37i9dQZF1DWV7EzJMK2FUI',
            backupName: 'Test Backup',
            platform: 'SPOTIFY'
        },
        cookies: {
            [CookieNames.PLAYLISTORY_TOKEN] : user.token
        }
    });
    expect(res.statusCode).toBe(200);
});