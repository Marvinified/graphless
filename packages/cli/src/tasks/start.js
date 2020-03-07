const ora = require("ora");
const chalk = require("chalk");
const mkdir = require("mkdirp");
const files = require("../lib/files");
const fs = require("fs");

module.exports = async args => {
  const spinner = ora("Initiating project").start();
  try {
    const dir = args._[1];

    //check if dir argument was pass
    if (!dir) {
      spinner.fail();
      console.log(chalk.red("\nWrong Format!! Use Like this:"));
      console.log("\n $ graphless init " + chalk.italic("PROJECT_NAME") + "\n");
      return;
    }
    //check if the specidied directory exist or created it
    if (!files.directoryExists(dir)) {
      const creatingDir = ora(`Creating Directory ${dir}`).start();
      const created = await mkdir(dir);
      creatingDir.succeed(`Created Directory ${created}`);
    }

    //copy template
    const templatePath = `${__dirname}/../templates/gcloud`;
    console.log("\nCreating a Graphless app in " + dir + "\n");
    bootstrap(templatePath, dir);
    spinner.succeed(`Initiated project`);

    const info = `\nSuccess! Created  ${chalk.magenta(dir)}

    You can run the following command to get started:

        ${chalk.magenta("cd")} ${dir}
        ${chalk.magenta("npm start")}
            Starts the development server.

    `;
    console.log(info);
  } catch (error) {
    spinner.fail("Initiating project \n\n" + error.message);
  }
};

