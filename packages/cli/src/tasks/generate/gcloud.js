const chalk = require("chalk");
const { directoryExists } = require("../../utils/files");
const mkdir = require("mkdirp");
const fs = require("fs");
const ora = require("ora");
const writeYaml = require("write-yaml");

module.exports = async (graphqlFunctionPath) => {
  const spinner = ora(
    `✨Creating new graphql function in ${chalk.cyan(graphqlFunctionPath)}`
  ).start();

  const fullPath = process.cwd() + "/src/" + graphqlFunctionPath;
  const key = graphqlFunctionPath.substr(
    graphqlFunctionPath.lastIndexOf("/") + 1
  );

  // check if dir exist
  if (directoryExists(fullPath)) {
    console.log(`\n\n\t"${graphqlFunctionPath}" already exists\n`);
    spinner.fail(
      `Creating new graphql function in ${chalk.cyan(
        graphqlFunctionPath
      )} failed`
    );
    return;
  }

  // create directory
  await mkdir(fullPath);

  // Create function file and write starter code
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
    ${key}: String
}
\`;

// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        ${key}: () => "Hello ${key}!",
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

  //   Register function in graphless.yml
  var read = require("read-yaml");
  var config = read.sync(process.cwd() + "/graphless.yml");

  config.app.graphs[key] = { path: `/src/${graphqlFunctionPath}` };

  writeYaml.sync(process.cwd() + "/graphless.yml", config);

  spinner.succeed(
    `Created new graphql function in ${chalk.cyan(graphqlFunctionPath)}`
  );
};
