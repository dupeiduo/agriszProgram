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

function checkObjPropConsistency(obj1, obj2) {
    if((!obj1 && obj2) || (obj1 && !obj2)) {
        return false;
    }

    if(!obj1) {
        return true;
    }

    var pl1 = [];
    for(var k in obj1) {
        pl1.push(k.toString());
    }
    pl1.sort();
    var fp1 = '';
    for(var k in pl1) {
        fp1 += pl1[k];
    }

    var pl2 = [];
    for(var k in obj2) {
        pl2.push(k.toString());
    }
    pl2.sort();
    var fp2 = '';
    for(var k in pl2) {
        fp2 += pl2[k];
    }

    return fp1 == fp2;
}

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

// consistency checking
var differentConifgs = {};
var differentConfigNum = 0;

for(var env in environments.CONFIG) {
    var cfg = environments.CONFIG[env];

    // check none
    for(var cfgKey in cfg) {
        if(!cfg[cfgKey]) {
            console.error('[ERROR]'.red.inverse + '[Environment Setting] Undefined configuration '.yellow + ('\"' + cfgKey + '\"').underline.magenta.italic + ' in '.yellow + ('\"' + env + '\"').underline.magenta.italic + '.'.yellow);
        }
    }

    // check consistence
    var diffNum = 0;
    for(var k in differentConifgs) {
        if(!checkObjPropConsistency(differentConifgs[k], cfg)) {
            diffNum += 1;
        }
    }

    // if current configuration is different to all types known, then it's a new type 
    // of configuration, record it
    if(diffNum == differentConfigNum) {
        differentConifgs[env] = cfg;
        differentConfigNum += 1;
    }
}

// there should be one(all configrations have the same properties) or zero(no config)
// configuration recorded
if(differentConfigNum > 1) {
    console.warn('[ERROR]'.red.inverse + '[Environment Setting] There\'re different configurations for each environment, they\'re:'.yellow);
    console.info(differentConifgs);
}


console.warn('[NOTICE]'.red.inverse + '[Environment Setting] Current environment is '.yellow + ('\"' + envKey + '\"').underline.magenta.italic + '.'.yellow);


module.exports = environments.CONFIG[envKey];

