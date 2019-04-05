const { gql } = require('apollo-server-express');

module.exports = gql`
  """A Player"""
  type User {
    "ID of the user"
    _id: ID!
    "UID of the user"
    uid: String!
    "Email of the user"
    email: String!
    "Username of the user"
    username: String!
  }

  input UserInput {
    "UID of the user"
    uid: String!
    "Username of the user"
    username: String!
  }
`;
