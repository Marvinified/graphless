const fs = require("fs");
const chalk = require("chalk");
const config = require("../../utils/config");
const { getGraphlessConfig } = require("@graphless/core");

module.exports = (args) => {
  const config = getGraphlessConfig();
  provider = config.app.provider;

  const graphqlFunctionPath = args._[1];

  if (!graphqlFunctionPath) {
    console.error(chalk.red(`Specify graphql function name!!!`));
    console.error(`usage: \n\n  graphless generate {path/to/function}\n\n`);
    return;
  }

  if (provider) {
    return handleByProvider(provider, graphqlFunctionPath);
  }
  console.log("Unsupported serverless provider");
};

function handleByProvider(provider, graphqlFunctionPath) {
  try {
    switch (provider) {
      case "gcloud":
        require("./gcloud")(graphqlFunctionPath);
        break;
      default:
        console.log(chalk.red("Unsupported serverless provider"));
        break;
    }
  } catch (error) {
    console.log(chalk.red(error.message));
  }
}
