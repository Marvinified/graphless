const getGraphlessConfig = require("./utils/getGraphlessConfig");

module.exports = (gateway) => () => {
  // init
  const app = {};
  const config = getGraphlessConfig();
  const graphs = config.app.graphs;
  for (const key in graphs) {
    const graph = graphs[key];
    app[key] = require(process.cwd() + graph.path);
  }
  app.gateway = gateway;

  return app;
};
