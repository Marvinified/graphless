#!/usr/bin/env node

const chalk = require("chalk");
var args = require("minimist")(process.argv.slice(2));
const hello = require("./tasks/hello");
const init = require("./tasks/init");
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

  case "start":
    require("./tasks/start")(args);
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
    break;
}
