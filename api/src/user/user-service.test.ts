import logger from '../util/logger';
import { getRandomString } from '../util/test-helper'
import { create } from './user-service';

it('should create a user', async () => {
    const password = getRandomString();
    const email = getRandomString();
    const user = await create({
        password,
        email
    });
    expect(user.email).toBe(email);
});

it('should throw an error if a user already exists', async () => {
    const password = getRandomString();
    const email = getRandomString();
    await create({
        password,
        email
    });
    await expect(create({
        password,
        email
    })).rejects.toThrow();
});
it('should throw an error if an email is already in use.', async () => {
    const password = getRandomString();
    const email = getRandomString();
    const first = await create({
        password,
        email
    });
    await expect(create({
        password,
        email
    })).rejects.toThrow();
})