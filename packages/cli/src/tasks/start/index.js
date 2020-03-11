const fs = require("fs");
const chalk = require("chalk");
const config = require("../../lib/config");

module.exports = args => {
    const provider = getProvider()
    if (provider) {
        return handleByProvider(provider)   
    }
    console.log("Unsupported serverless provider")
};


function handleByProvider(provider) {
    try {
        const services = getGraphsConfig();
        let port = process.env.PORT || 8080;

        switch (provider) {
            case 'gcloud':
                require('./gcloud')(services, port);
                break;
            default:
                console.log(chalk.red("Unsupported serverless provider"))
                break;
        }

    } catch (error) {
        console.log(chalk.red(error.message))
    }

}


function getProvider() {
    const configurations = config()
    return configurations.app.provider
}


function getGraphsConfig() {
    try {
        var source = fs.readFileSync(process.cwd() + "/graphs.json");
        return JSON.parse(source);
    } catch (error) {
        throw Error('No graphs.json file found in this directory!!!')
        console.log(chalk.red("This is not a Graphless Project:\nNo graphs.json file found in this directory!!!"))
        console.log(`\n\nYou can run the following command to initiate a Graphless Project
        
    ${chalk.magenta("graphless init PROJECT_NAME")}
        `)
    }
}