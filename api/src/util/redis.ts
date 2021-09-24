import Redis from 'redis';

// @ts-ignore
const client = Redis.createClient(process.env.REDIS_PORT || 6379, process.env.REDIS_HOST || '127.0.0.1');

export const get = async (key: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        client.get(key, (err, reply: string| null) => {
            if (err) {
                return reject(err);
            }
            return resolve(reply as any);
        });
    });
}

export const set = async (key: string, value: any): Promise<void> => {
    return new Promise((resolve, reject) => {
        client.set(key, value, (err, reply) => {
            if (err) {
                return reject(err);
            }

            return resolve(reply as any);
        });
    });
}

export const expire = async (key: string, ttlSecs: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        client.expire(key, ttlSecs, (err, reply) => {
            if (err)
                return reject(err);
            return resolve(reply as any);
        })
    });
}

export const del = async (key: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        client.del(key, (err, reply) => {
            if (err) {
                return reject(err);
            }

            return resolve(reply as any);
        });
    });
}