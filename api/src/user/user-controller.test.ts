import { server } from '..';
it('should create a user successfully', async () => {
    const response = await server.inject({
        method: 'POST',
        url: '/user',
        payload: {
            password: 'ryan',
            email: 'ryan'
        }
    });
    expect(response.statusCode).toBe(200);
})