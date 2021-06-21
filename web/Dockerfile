FROM node:latest as build

WORKDIR /opt/playlistory/web

COPY package.json .

RUN yarn install

COPY . .

RUN yarn build

FROM nginx:stable-alpine

COPY --from=build /opt/playlistory/web/build /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]