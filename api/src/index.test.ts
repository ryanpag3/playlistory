import { delay } from 'bluebird';
it('should start the server', async () => {
    const server = require('./index');
    await delay(1000);
    const isInit = server.isServerReady();
    expect(isInit).toBeTruthy();
    await server.server.close();
});