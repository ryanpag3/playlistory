import { server } from '..';

it('should sign in successfully', async () => {
    let response = await server.inject({
        method: 'POST',
        url: '/user',
        payload: {
            username: 'ryan',
            password: 'ryan',
            email: 'ryan'
        }
    });
    expect(response.statusCode).toBe(200);
    response = await server.inject({
        method: 'POST',
        url: '/sign-in',
        payload: {
            username: 'ryan',
            password: 'ryan'
        }
    });
    expect(response.statusCode).toBe(200);
})