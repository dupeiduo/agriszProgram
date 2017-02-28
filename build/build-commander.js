// define build.js's arguments
var commander = require('commander')

commander
    .version('1.0.0')
    .option('-E, --env [value]', 'build enviroment', '')
    .parse(process.argv);

module.exports = {
    env: commander.env
};
