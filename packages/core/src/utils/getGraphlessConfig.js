const chalk = require("chalk");

module.exports = () => {
  try {
    var read = require("read-yaml");
    var config = read.sync(process.cwd() + "/graphless.yml");
    return config;
  } catch (error) {
    console.log(
      "Make sure this is a Graphless Project:\nNo graphless.yml file found in this directory!!!"
    );
  }
};
