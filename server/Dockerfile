FROM node:dubnium

WORKDIR /usr/src/app

COPY [ "package*.json", "app.js", "/usr/src/app/" ]
COPY "schema/" "/usr/src/app/schema/"
COPY "resolvers/" "/usr/src/app/resolvers/"
COPY "models/" "/usr/src/app/models/"
COPY "common/" "/usr/src/app/common/"
COPY "config/" "/usr/src/app/config/"
COPY "keys/" "/usr/src/app/keys/"

RUN npm install \
  && npm install -g nodemon

CMD [ "nodemon", "app.js" ]
