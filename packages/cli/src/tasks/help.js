const chalk = require("chalk");
const figlet = require("figlet");

const menus = {
  main: `
      graphless [command] <options>
  
      commands: 
        init .............. initialize project
        version ............ show package version
        help ............... show help menu for a command`,

  init: `
    ${chalk.magenta("graphless init " + chalk.italic("PROJECT_NAME"))}
        Initialises new Graphless project

    `
};

module.exports = args => {
  const subCmd = args._[0] === "help" ? args._[1] : args._[0];

  console.log(menus[subCmd] || menus.main);
};
