const fs = require("fs");
const chalk = require("chalk");
const spawn = require("../lib/spawn");

module.exports = args => {
  const provider = args._[1];
  const services = getGraphsConfig();
  let port = process.env.PORT || 8080;
  const GRAPHLESS_LOCAL_GRAPHS_MAP = [];

  let cmd = `export NODE_ENV='development'`

  for (const service of services) {
    port += 1
    cmd += ` & functions-framework --target=${service.name} --port=${port}`

    GRAPHLESS_LOCAL_GRAPHS_MAP.push({
      name: [service.name],
      url: `http://localhost:${port}`
    })

  }

  process.env.GRAPHLESS_LOCAL_GRAPHS_MAP = JSON.stringify(GRAPHLESS_LOCAL_GRAPHS_MAP);

  let resource = ''
  GRAPHLESS_LOCAL_GRAPHS_MAP.forEach(({ url }) => resource += " " + url.replace("http://", ""))
  console.log(resource)
  cmd += "&  (  await tcp " + resource + " &&  echo '\n✅ Starting up Gateway on http://localhost:" + process.env.PORT || 8080 + "\n\n'" + ` &&  export GRAPHLESS_LOAD_GATEWAY=true && functions-framework --target=gateway --port=${process.env.PORT || 8080}  )`

  spawn.sync(
    cmd,
    [],
    {
      cwd: process.cwd(),
      stdio: "inherit",
      encoding: "utf8",
      shell: true
    }, (error) => {
      console.log(chalk.red(error));
      console.log(chalk.red("Couldn't start gateeway"));
      process.exit()
    }
  );


  console.log(chalk.magenta("Oops! This feature is still in development!"));
};

function getGraphsConfig() {
  var source = fs.readFileSync(process.cwd() + "/graphs.json");
  return JSON.parse(source);
}