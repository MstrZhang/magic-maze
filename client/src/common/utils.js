import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const client = () => new ApolloClient({
  link: new HttpLink({
    uri: process.env.REACT_APP_API_DEV,
  }),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

export default client;
