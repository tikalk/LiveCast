/**
 * Created with JetBrains WebStorm.
 * User: naor
 * Date: 6/30/13
 * Time: 12:50 AM
 * To change this template use File | Settings | File Templates.
 */

var path = require('path');
var architect = require("architect");

var configPath = path.join(__dirname, "architect-config.js");
var config = architect.loadConfig(configPath);

architect.createApp(config, function (err, app) {
    if (err) throw err;
    console.log("app ready");
});
