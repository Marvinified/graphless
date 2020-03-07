const getGraphJSON = require("./utils/getGraphJSON");

module.exports = gateway => graphJSONPath => {
  // init
  const app = {};

  const graphs = getGraphJSON(graphJSONPath);
  graphs.map(graph => {
    app[graph.name] = require(process.cwd() + graph.path);
  });

  // gatewa
  app.gateway = gateway;

  return app;
};
