const chalk = require("chalk");
const spawn = require("../../utils/spawn");

module.exports = (services, port) => {
  const GRAPHLESS_LOCAL_GRAPHS_MAP = [];
  let dynamicport = port;
  // Set Environment as Development
  let cmd = `export NODE_ENV='development'`;

  // Setup each graph function
  for (const key in services) {
    // a graph funtion
    const service = services[key];
    // increase port by one for each function
    dynamicport += 1;
    // start each function
    cmd += ` & functions-framework --target=${key} --port=${dynamicport}`;
    // SAve graph config for later use
    GRAPHLESS_LOCAL_GRAPHS_MAP.push({
      name: key,
      url: `http://localhost:${dynamicport}`,
    });
  }

  // Save All graph config in enviroment
  process.env.GRAPHLESS_LOCAL_GRAPHS_MAP = JSON.stringify(
    GRAPHLESS_LOCAL_GRAPHS_MAP
  );

  // Bootstrap resource to await before spinning up gateway
  let resource = "";
  GRAPHLESS_LOCAL_GRAPHS_MAP.forEach(({ url }) => {
    resource += " " + url.replace("http://", "");
  });

  // Await resources to boot up then start gateway
  cmd += `&  (  graphless-wait tcp ${resource} `;
  // Print information
  cmd += ` &&  echo ${chalk.cyanBright(
    `'\n🔥 Starting up Gateway on http://localhost:${port}\n\n'`
  )}`;
  // Start Gateway
  cmd += ` &&  export GRAPHLESS_LOAD_GATEWAY=true && functions-framework --target=gateway --port=${port})`;

  spawn.sync(
    cmd,
    [],
    {
      cwd: process.cwd(),
      stdio: "inherit",
      encoding: "utf8",
      shell: true,
    },
    (error) => {
      console.log(chalk.red(error));
      console.log(chalk.red("Couldn't start gateeway"));
      process.exit();
    }
  );
};
