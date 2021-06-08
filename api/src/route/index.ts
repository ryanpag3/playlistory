import path from 'path';
import logger from '../util/logger';

let routes: any[] = [];

require('fs')
    .readdirSync(path.join(__dirname, '.'))
    .filter((file: string) => file !== 'index.ts')
    .forEach((file: string) => {
        logger.debug(`including routes from ${file}`);
        routes = [...routes, ...require(path.join(__dirname, './' + file)).default ]
    });

export default routes;