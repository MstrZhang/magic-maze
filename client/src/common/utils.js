import ApolloClient from 'apollo-client';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';


const httpLink = token => (
  new HttpLink({
    uri: `https://${document.location.hostname}:8443/server/graphql`,
    headers: {
      authorization: token,
    },
  })
);

const wsLink = token => (
  new WebSocketLink({
    uri: `wss://${document.location.hostname}:8443/server/graphql`,
    options: {
      reconnect: true,
      connectionParams: {
        authToken: token,
      },
    },
  })
);

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = token => split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink(token),
  httpLink(token),
);

const client = authToken => new ApolloClient({
  link: link(authToken),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

export default client;
