const { ApolloServer, gql } = require("apollo-server-cloud-functions");
const { buildFederatedSchema } = require("@apollo/federation");
// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    post: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    post: () => "New Post!"
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ]),
  playground: true,
  introspection: true
});

module.exports = server.createHandler();
