require('dotenv').config({
    path: '.env.test'
});

import execa from 'execa';
import logger from './src/util/logger';
import prisma from './src/util/prisma';

/* TEST CONFIGURATION */
process.env = {
    ...process.env,
    LOG_LEVEL: 'debug',
    DATABASE_URL: 'postgresql://postgres:adminadmin@localhost:5432/test_playlistory_db?schema=public',
    COOKIE_SECRET: 'cookies make me poop'
}

beforeAll(async () => {
    const stdout = await execa.command('prisma migrate dev')
    logger.debug(stdout);
}, 10000);

afterEach(async () => {
    for (const {
        tablename,
      } of await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname='public'`) {
          if (tablename !== '_prisma_migrations') {
            await prisma.$queryRaw(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
            logger.trace(`truncated ${tablename}`);
        }
      }
      await prisma.$disconnect();
});