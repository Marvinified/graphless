const chalk = require("chalk");
const mkdir = require("mkdirp");
const fs = require("fs");
const spawn = require("../utils/spawn");
const files = require("../utils/files");
const mark = chalk.green("✔︎ ");
var inquirer = require("inquirer");

module.exports = async (args) => {
  console.log(`\nInitiating project`);

  const dir = args._[1];

  //check if dir argument was pass
  if (!dir) {
    console.log(chalk.red("\nWrong Format!! Use Like this:"));
    console.log("\n $ graphless init " + chalk.italic("PROJECT_NAME") + "\n");
    return;
  }

  //check if the specidied directory exist or created it
  if (!files.directoryExists(dir)) {
    try {
      const created = await mkdir(dir);
      console.log(`Created Directory ${created}`);
    } catch (error) {
      console.log(chalk.red("Failed to Initiate project \n\n" + error.message));
      return;
    }
  } else {
    console.log(
      chalk.red(
        "Failed to Initiate project \n" + `Directory ${dir} is not empty`
      )
    );
    return;
  }

  try {
    //copy template
    // const projectType = "gcloud";

    const { projectType } = await inquirer.prompt([
      {
        type: "list",
        name: "projectType",
        message: "Choose your cloud provider?",
        choices: [
          { name: "Google Cloud Functions", value: "gcloud" },
          { name: "Azure - In Development", value: "azure", disabled: true },
          { name: "Lambda - In Development", value: "lambda", disabled: true },
        ],
      },
      /* Pass your questions in here */
    ]);

    const templatePath = `${__dirname}/../templates/${projectType}`;
    console.log(`\n${mark} Creating a Graphless app in  ${dir} \n`);
    bootstrap(templatePath, dir);

    spawn.spawn(
      "yarn",
      ["install"],
      {
        cwd: process.cwd() + "/" + dir,
        stdio: "inherit",
        encoding: "utf8",
      },
      (error) => {
        if (error) {
          console.log(chalk.red(error));
          revert();
          return;
        }

        spawn.spawn(
          "git",
          ["init"],
          {
            cwd: process.cwd() + "/" + dir,
            stdio: "inherit",
            encoding: "utf8",
          },
          (error) => {
            if (error) {
              console.log(chalk.red(error));
              revert(dir);
              return;
            }
            success(dir);
          }
        );
      }
    );
    // end
  } catch (error) {
    console.log(chalk.red(error));
    revert(dir);
  }
};

function success(dir) {
  const info = `\n${mark}Success! Created ${dir}

  You can run the following command to get started!

    $ ${chalk.magenta("cd")} ${dir}
    $ ${chalk.magenta("yarn")} start
  `;

  console.log(info);
}

function revert(dir) {
  spawn.spawn(
    "rm",
    ["-rf", dir],
    {
      cwd: process.cwd(),
      stdio: "inherit",
      encoding: "utf8",
    },
    (error) => {
      if (error) {
        console.log(chalk.red(error));
      }
      console.log(chalk.red("Failed to Initiate project \n\n"));
    }
  );
}

function bootstrap(templatePath, distinationPath) {
  const CWD = process.cwd();
  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach((file) => {
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
