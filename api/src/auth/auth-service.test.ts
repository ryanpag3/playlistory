import { createJWT, validateJWT } from './auth-service';

it ('should create and validate a valid JWT', async () => {
    const username = 'ryan';
    const token = createJWT(username);
    const resolvedUsername = validateJWT(token);
    expect(username).toBe(resolvedUsername);
});

it('should throw an error when an invalid JWT is provided', () => {
    expect(() => validateJWT('abcd')).toThrow();
})