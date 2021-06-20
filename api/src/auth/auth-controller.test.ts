import { server } from '../index';

it('should sign in successfully', async () => {
    let response = await server.inject({
        method: 'POST',
        url: '/user',
        payload: {
            password: 'ryan',
            email: 'ryan'
        }
    });
    expect(response.statusCode).toBe(200);
    response = await server.inject({
        method: 'POST',
        url: '/sign-in',
        payload: {
            email: 'ryan',
            password: 'ryan'
        }
    });
    expect(response.statusCode).toBe(200);
})