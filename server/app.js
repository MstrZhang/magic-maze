const express = require('express');
const morgan = require('morgan');
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const logger = require('./utils/logger');

const schema = require('./schema');
const resolvers = require('./resolvers');

const PORT = process.env.PORT || 8000;

const app = express();
const ws = createServer(app);

app.use(morgan('combined', { stream: { write: (message) => { logger.info(message); } } }));

const server = new ApolloServer({
  schema,
  resolvers,
});

server.applyMiddleware({ app, path: '/server/graphql' });
server.installSubscriptionHandlers(ws);

app.get('/', (req, res) => {
  res.send('hi');
});

ws.listen(PORT, () => {
  logger.info(`🚀 Server ready at port ${PORT}`);
  logger.info(`🚀 Subscriptions ready at port ${PORT}`);
});
