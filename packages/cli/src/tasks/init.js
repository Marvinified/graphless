const ora = require("ora");
const chalk = require("chalk");
const mkdir = require("mkdirp");
const files = require("../lib/files");
const fs = require("fs");
const spawn = require("cross-spawn");

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
    const projectType = "gcloud";

    const templatePath = `${__dirname}/../templates/${projectType}`;
    console.log("\nCreating a Graphless app in " + dir + "\n");
    bootstrap(templatePath, dir);
    spinner.succeed(`Initiated project`);

    // install packages
    const installing = ora("Installing Packages!").start();
    console.log("\n");
    spawn.sync(
      "npm",
      ["install", "--save", "--save-exact", "--loglevel", "error"],
      { cwd: process.cwd() + "/" + dir, stdio: "inherit" }
    );
    spawn.sync("git", ["init"], {
      cwd: process.cwd() + "/" + dir,
      stdio: "inherit"
    });
    installing.succeed("Packages Installed");

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

function bootstrap(templatePath, distinationPath) {
  const CWD = process.cwd();
  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach(file => {
    const origFilePath = `${templatePath}/${file}`;
    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, "utf8");

      const writePath = `${CWD}/${distinationPath}/${file}`;
      fs.writeFileSync(writePath, contents, "utf8");
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${CWD}/${distinationPath}/${file}`);

      // recursive call
      bootstrap(`${templatePath}/${file}`, `${distinationPath}/${file}`);
    }
  });
}
