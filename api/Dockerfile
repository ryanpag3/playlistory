FROM node:alpine

ENV NODE_ENV production

WORKDIR /opt/playlistory/api

COPY package.json .

RUN yarn install

COPY . .

RUN npx prisma generate \
 && npx tsc -p tsconfig.production.json

CMD ["yarn", "migrate", "&&", "node", "./dist/index.js"]

ENTRYPOINT ["/bin/sh", "-c" , "yarn migrate && node ./dist/index.js"]