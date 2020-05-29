const { ApolloServer, gql } = require("apollo-server-cloud-functions");
const { registerGraphFunctions } = require("@graphless/core");
const federation = require("@apollo/federation");
const gateway = require("./gateway");

module.exports = {
  registerGraphFunctions: registerGraphFunctions(gateway()),
  ApolloServer: ApolloServer,
  gql: gql,
  ...federation,
};
