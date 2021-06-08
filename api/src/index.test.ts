import { delay } from 'bluebird';
import logger from './util/logger';
it('should start the server', async () => {
    try {
        const server = require('./index');
        await delay(1000);
        const isInit = server.isServerReady();
        expect(isInit).toBeTruthy();
        await server.server.close();
    } catch (e) {
        console.log(e);
        throw e;
    }
}, 5000);