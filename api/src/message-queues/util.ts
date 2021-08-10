import Queue from 'bull';

export const getBullQueue = (queueName: string): Queue.Queue<any> => {
    // @ts-ignore
    return new Queue(queueName, {
        redis: {
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASSWORD
        }
    });
}