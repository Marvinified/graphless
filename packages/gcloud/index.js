const { ApolloServer, gql } = require("apollo-server-cloud-functions");
const { registerGraphFunctions } = require("@graphless/core");
const gateway = require("./gateway");

exports.registerGraphFunctions = registerGraphFunctions(gateway());
exports.ApolloServer = ApolloServer;
exports.gql = gql;
