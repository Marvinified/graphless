const fs = require("fs");
const chalk = require("chalk");
const { getGraphlessConfig } = require("@graphless/core");

module.exports = (args) => {
  const provider = getProvider();
  if (provider) {
    return handleByProvider(provider);
  }
  console.log("Unsupported serverless provider");
};

function handleByProvider(provider) {
  try {
    const config = getGraphlessConfig();
    const services = config.app.graphs;
    let port = config.app.port || 8080;

    switch (provider) {
      case "gcloud":
        require("./gcloud")(services, port);
        break;
      default:
        console.log(chalk.red("Unsupported serverless provider"));
        break;
    }
  } catch (error) {
    console.log(chalk.red(error.message));
  }
}

function getProvider() {
  const configurations = getGraphlessConfig();
  return configurations.app.provider;
}
