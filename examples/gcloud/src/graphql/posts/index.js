const {
  ApolloServer,
  gql,
  buildFederatedSchema,
} = require("@graphless/gcloud");
// const { buildFederatedSchema } = require("@apollo/federation");
// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    posts: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    posts: () => "Hello Posts!",
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
  playground: true,
  introspection: true,
});

module.exports = server.createHandler();
