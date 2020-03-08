const fs = require("fs");
const chalk = require("chalk");
const spawn = require("../lib/spawn");

module.exports = args => {
  const provider = args._[1];
  console.log(provider);
  console.log(getGraphsConfig());
  // export CLOUD_URL='https://example.com' && functions-framework --target=users
  spawn(
    "export CLOUD_URL='https://example.com' && functions-framework --target=users",
    [],
    {
      cwd: process.cwd(),
      stdio: "inherit",
      encoding: "utf8",
      shell: true
    },
    err => {
      console.log(err);
    }
  );
  console.log(chalk.magenta("Oops! This feature is still in development!"));
};

function getGraphsConfig() {
  var source = fs.readFileSync(process.cwd() + "/graphs.json");
  return JSON.parse(source);
}
