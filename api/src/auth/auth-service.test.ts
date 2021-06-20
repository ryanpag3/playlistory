import { server } from '../index';
import prisma from '../util/prisma';
import { createJWT, validateJWT, validatePassword } from './auth-service';

it ('should create and validate a valid JWT', async () => {
    const email = 'ryan';
    const token = createJWT(email);
    const resolvedEmail = validateJWT(token);
    expect(email).toBe(resolvedEmail);
});

it('should throw an error when an invalid JWT is provided', () => {
    expect(() => validateJWT('abcd')).toThrow();
});

it('should return true if a valid password', async () => {
    const payload = {
        password: 'ryan',
        email: 'ryan'
    }
    const response = await server.inject({
        method: 'POST',
        url: '/user',
        payload
    });
    const user = await prisma.user.findUnique({
        where: {
            email: payload.email
        }
    });
    // @ts-ignore
    const res = await validatePassword(user?.password, payload.password);
    expect(res).toBe(true);
});

it('should return false is invalid password', async () => {
    const res = await validatePassword('1234', 'abcd');
    expect(res).toBe(false);
})