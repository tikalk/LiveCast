/**
 * Created with JetBrains WebStorm.
 * User: naor
 * Date: 6/30/13
 * Time: 1:18 AM
 * To change this template use File | Settings | File Templates.
 */
module.exports = [
    {
        packagePath: "./plugins/server",
        rootDir: __dirname + "/",
        port: process.env.PORT || 3000
    },
    "./plugins/real-time",
    "./plugins/messages"
];