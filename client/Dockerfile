FROM node:dubnium

WORKDIR /usr/src/app

COPY ".env.build" "/usr/src/app/"
COPY "package*.json" "/usr/src/app/"
COPY "src/" "/usr/src/app/src/"
COPY "public/" "/usr/src/app/public/"

RUN npm install \
  && sh -ac '. /usr/src/app/.env.build; npm run build' \
  && npm install -g serve

CMD [ "serve", "-s", "build" ]
