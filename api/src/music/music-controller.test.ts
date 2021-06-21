import { server } from '..';
import CookieNames from '../util/CookieNames';
import { createTestUser } from '../util/test-helper';

it('should get the playlists the user has tied to their account', async () => {
    const user = await createTestUser();
    const res = await server.inject({
        method: 'GET',
        url: '/me/playlists',
        query: {
            platform: 'SPOTIFY'
        },
        cookies: {
            [CookieNames.PLAYLISTORY_TOKEN] : user.token
        }
    });
    expect(res.statusCode).toBe(200);
});