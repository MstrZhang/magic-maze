const path = require('path');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');

const PORT = process.env.PORT || 8000;

const app = express();
const ws = createServer(app);

// const server = new ApolloServer({});

// server.applyMiddleware({ app, path: '/server/graphql' });
// server.installSubscriptionHandlers(ws);

app.get('/', (req, res) => {
  res.send('hi');
});

ws.listen(PORT, () => {
  console.log(`🚀 Server ready at port ${PORT}`);
  console.log(`🚀 Subscriptions ready at port ${PORT}`);
});
