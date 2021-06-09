import { getRandomString } from '../util/test-helper'
import { create } from './user-service';

it('should create a user', async () => {
    const username = getRandomString();
    const password = getRandomString();
    const email = getRandomString();
    const user = await create({
        username,
        password,
        email
    });
    expect(user.username).toBe(username);
});

it('should throw an error if a user already exists', async () => {
    const username = getRandomString();
    const password = getRandomString();
    const email = getRandomString();
    await create({
        username,
        password,
        email
    });
    await expect(create({
        username,
        password,
        email
    })).rejects.toThrow();
});

it('should throw an error if a username is too long', async () => {
    const username = getRandomString(36);
    const password = getRandomString();
    const email = getRandomString();
    await expect(create({
        username,
        password,
        email
    })).rejects.toThrow();
});

it('should throw an error if an email is already in use.', async () => {
    let username = getRandomString();
    const password = getRandomString();
    const email = getRandomString();
    await create({
        username,
        password,
        email
    });
    username = getRandomString();
    await expect(create({
        username,
        password,
        email
    })).rejects.toThrow();
})