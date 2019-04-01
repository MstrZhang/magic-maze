const { gql } = require('apollo-server-express');

module.exports = gql`
  type Lobby {
    _id: ID!
    users: [User]
  }
`;
