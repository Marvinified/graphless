const chalk = require("chalk");
const { directoryExists } = require("../../utils/files");
const mkdir = require("mkdirp");
const fs = require("fs");

module.exports = async (graphqlFunctionPath) => {
  console.log(
    `✨Creating new graphql function in ${chalk.cyan(graphqlFunctionPath)}`
  );

  const fullPath = process.cwd() + "/src/" + graphqlFunctionPath;

  // check if dir exist
  if (directoryExists(fullPath)) {
    console.log(`\n\t${graphqlFunctionPath} already exists\n`);
    return;
  }

  // create directory
  await mkdir(fullPath);

  fs.writeFileSync(
    fullPath + "/index.js",
    `
const {
    ApolloServer,
    gql,
    buildFederatedSchema,
} = require("@graphless/gcloud");

// Construct a schema, using GraphQL schema language
const typeDefs = gql\`
type Query {
    hello: String
}
\`;

// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        posts: () => "Hello Functions!",
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
  `
  );
};
