/**
 * Require this module to access environment-dependent configurations.
 *
 * To use this module, please set process.env, choose whichever environment by
 * assigning enviroment variable named 'ENV_KEY_NAME' to the name of the envi-
 * ronment that you want.
 *
 * All available environment-names are listed below as properties of the vari-
 * able:CONFIG, which is required form environments.js placed in the same fol-
 * der of this file.
 *
 * To add more environments, just modify environments.js file.
 *
 * WITHOUT setting a available process.evn[EVN_KEY_NAME] value, this module w-
 * on't work, and will end up error.
 */
var environments = require('./environments');
var colors = require('colors');

var envKey = process.env.BUILD_ENV;

// look for default environment set if it is not set
if (!envKey) {
    envKey = environments.DEFAULT_ENV;
}

if (!envKey) {
    console.log("Cannot find process.env.BUILD_ENV or DEFAULT_ENV, this module thus cannot be used!");
    throw new Error(`Please set BUILD_ENV before import this module!`);
}

if (!environments.CONFIG.hasOwnProperty(envKey)) {
    console.log("Cannot find environment named ["+envKey+"]!");
    throw new Error(`Cannot find environment named ${envKey}!`);
}

console.warn('[NOTICE]'.red.inverse + '[Environment Setting] Current environment is '.yellow + ('\"' + envKey + '\"').underline.magenta.italic + '.'.yellow);

module.exports = environments.CONFIG[envKey];

