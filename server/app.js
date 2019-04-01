require('dotenv').config();

const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const _ = require('lodash');
const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');
const logger = require('./common/logger');
const { firebaseApp } = require('./config/firebase');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const models = require('./models');

const PORT = process.env.PORT || 8000;

const app = express();
// const ws = http.createServer(app);

const ws = https.createServer(
  {
    cert: fs.readFileSync('./keys/server.crt'),
    key: fs.readFileSync('./keys/server.key'),
  },
  app,
);

app.use(morgan('combined', { stream: { write: (message) => { logger.info(message); } } }));
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200,
}));
app.use(bodyParser.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    if (!req || !req.headers) {
      return {}; // websockets
    }

    let token;
    if (req && req.headers && req.headers.authorization) {
      logger.info('req header auth', req.headers.authorization);
      token = req.headers.authorization;
    } else {
      throw new AuthenticationError('Authorization token not provided');
    }
    token = _.replace(token, 'Bearer ', '');
    logger.info('Token', token);
    const decodedToken = await firebaseApp
      .auth()
      .verifyIdToken(token);

    logger.info(decodedToken);

    // user should be signed up
    const user = await models.User.findOne({ uid: decodedToken.uid });
    if (!user) throw new AuthenticationError('User does not exist');

    return {
      user,
      models,
    };
  },
  subscriptions: {
    keepAlive: true,
    path: '/server/graphql',
    onConnect: async (connectionParams) => {
      logger.info('connection param', connectionParams.authToken);
      if (!connectionParams.authToken) throw new AuthenticationError('Missing auth token');
      const decodedToken = await firebaseApp
        .auth()
        .verifyIdToken(connectionParams.authToken);
      logger.info('decodedToeken', decodedToken);

      // equivalent atomic findOneOrCreate action in mongo
      const user = await models.User.findOne({ uid: decodedToken.uid });
      logger.info('user', user);
      return {
        user: user.value,
      };
    },
  },
});

app.post('/server/adduser/', async (req, res) => {
  const { uid, username, email } = req.body;
  if (!uid || !username || !email) return res.status(400).end('Missing required params');

  const insertResult = await models.User.insertOne({
    uid,
    username,
    email,
  });

  if (insertResult.insertedCount === 1) {
    return res.status(201).end('Created user');
  }

  return res.status(400).end('Can\'t insert user');
});

server.applyMiddleware({ app, path: '/server/graphql' });
server.installSubscriptionHandlers(ws);

ws.listen(PORT, () => {
  logger.info(`🚀 Server ready at port ${PORT} in ${server.graphqlPath}`);
  logger.info(`🚀 Subscriptions ready at port ${PORT} in ${server.subscriptionsPath}`);
  logger.info('🏥 Healthcheck in /.well-known/apollo/server-health/');
});
