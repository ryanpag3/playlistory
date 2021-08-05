FROM node:latest as build

WORKDIR /opt/playlistory/web

COPY package.json .

RUN yarn install

COPY . .

RUN yarn build

FROM nginx:stable-alpine

COPY --from=build /opt/playlistory/web/build /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY env.sh /usr/share/nginx/html/env.sh

RUN chmod +x /usr/share/nginx/html/env.sh

COPY .env /usr/share/nginx/html

EXPOSE 80

CMD ["/bin/sh", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]