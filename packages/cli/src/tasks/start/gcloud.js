const chalk = require("chalk");
const spawn = require("../../lib/spawn");

module.exports = (services, port) => {
    const GRAPHLESS_LOCAL_GRAPHS_MAP = [];

    let cmd = `export NODE_ENV='development'`

    for (const service of services) {
        port += 1
        cmd += ` & functions-framework --target=${service.name} --port=${port}`

        GRAPHLESS_LOCAL_GRAPHS_MAP.push({
            name: service.name,
            url: `http://localhost:${port}`
        })

    }

    process.env.GRAPHLESS_LOCAL_GRAPHS_MAP = JSON.stringify(GRAPHLESS_LOCAL_GRAPHS_MAP);
    console.log({GRAPHLESS_LOCAL_GRAPHS_MAP: process.env.GRAPHLESS_LOCAL_GRAPHS_MAP})

    let resource = ''
    GRAPHLESS_LOCAL_GRAPHS_MAP.forEach(({ url }) => resource += " " + url.replace("http://", ""))
    cmd += `&  (  await tcp ${resource}  &&  echo '\n✅ Starting up Gateway on http://localhost:${process.env.PORT || 8080}\n\n' &&  export GRAPHLESS_LOAD_GATEWAY=true && functions-framework --target=gateway --port=${process.env.PORT || 8080}  )`

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
}