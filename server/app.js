require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const logger = require('./utils/logger');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const models = require('./models');

const PORT = process.env.PORT || 8000;

const app = express();
const ws = createServer(app);

app.use(morgan('combined', { stream: { write: (message) => { logger.info(message); } } }));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    models,
  },
  subscriptions: {
    path: '/server/graphql',
  },
});

server.applyMiddleware({ app, path: '/server/graphql' });
server.installSubscriptionHandlers(ws);

ws.listen(PORT, () => {
  logger.info(`🚀 Server ready at port ${PORT} in ${server.graphqlPath}`);
  logger.info(`🚀 Subscriptions ready at port ${PORT} in ${server.subscriptionsPath}`);
  logger.info('🏥 Healthcheck in /.well-known/apollo/server-health/');
});
