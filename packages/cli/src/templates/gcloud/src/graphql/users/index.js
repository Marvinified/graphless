const { ApolloServer, gql } = require("@graphless/gcloud");
const { buildFederatedSchema } = require("@apollo/federation");
// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => "Hello world!"
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
