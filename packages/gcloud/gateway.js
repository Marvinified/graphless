const { ApolloServer } = require("apollo-server-cloud-functions");
const { ApolloGateway } = require("@apollo/gateway");
const { getGraphJSON } = require("@graphless/core");
module.exports = () => {
  const graphs = getGraphJSON();
  if (process.env.NODE_ENV === "production") {
    const serviceList = graphs.map(graph => {
      return {
        name: graph.name,
        // url: process.env.CLOUD_URL
        url: process.env.CLOUD_URL + "/" + graph.name
      };
    });

    const gateway = new ApolloGateway({
      serviceList
    });


    const server = new ApolloServer({
      gateway,
      subscriptions: false,
      playground: true,
      introspection: true,
      debug: true
    });

    return server.createHandler();

  }

  return loadDevGateway()

};


function loadDevGateway() {
  if (process.env.GRAPHLESS_LOAD_GATEWAY) {

    const GRAPHLESS_LOCAL_GRAPHS_MAP = JSON.parse(process.env.GRAPHLESS_LOCAL_GRAPHS_MAP)
    const serviceList = GRAPHLESS_LOCAL_GRAPHS_MAP.map(graph => {
      return graph;
    });

    const gateway = new ApolloGateway({
      serviceList
    });


    const server = new ApolloServer({
      gateway,
      subscriptions: false,
      playground: true,
      introspection: true,
      debug: true
    });

    return server.createHandler();

  }

  return (req, res) => {
    res.send("Not Ready")
  }
}
