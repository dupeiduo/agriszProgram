// define build.js's arguments
var commander = require('commander')

commander
    .version('1.0.0')
    .option('-E, --env [value]', 'build enviroment', '')
    .option('-R, --robots [value]', 'robot.txt', '')
    .parse(process.argv);

module.exports = commander;
