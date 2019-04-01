const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    _id: ID!
    uid: String!
    email: String!
    username: String!
  }

  input UserInput {
    uid: String!
    username: String!
  }
`;
