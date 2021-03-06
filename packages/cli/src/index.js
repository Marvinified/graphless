#!/usr/bin/env node

const chalk = require("chalk");
var args = require("minimist")(process.argv.slice(2));
const hello = require("./tasks/hello");
// Hello
hello();

let command = args._[0] || "help";

if (args.version || args.v) {
  command = "version";
}

if (args.help || args.h) {
  command = "help";
}

switch (command) {
  case "init":
    require("./tasks/init")(args);
    break;

  case "generate":
    require("./tasks/generate")(args);
    break;

  case "serve":
    require("./tasks/serve")(args);
    break;

  case "deploy":
    require("./tasks/deploy.js")(args);
    break;

  case "version":
    require("./tasks/version")(args);
    break;

  case "help":
    require("./tasks/help")(args);
    break;

  default:
    console.error(chalk.red("\nUnknown Command!!!"));
    require("./tasks/help")(args);
    break;
}
