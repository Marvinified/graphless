const { ApolloServer } = require("apollo-server-cloud-functions");
const { ApolloGateway } = require("@apollo/gateway");
const { getGraphJSON } = require("@graphless/core");

const graphs = getGraphJSON();

const serviceList = graphs.map(graph => {
  return {
    name: graph.name,
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
  introspection: true
});

module.exports = server.createHandler();
