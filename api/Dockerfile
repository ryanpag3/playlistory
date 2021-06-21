FROM node:alpine

ENV NODE_ENV production

WORKDIR /opt/playlistory/api

COPY package.json .

RUN yarn install

COPY . .

RUN npx prisma generate \
 && npx tsc -p tsconfig.production.json

CMD ["node", "./dist/index.js"]