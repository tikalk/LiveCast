/**
 * Created with JetBrains WebStorm.
 * User: naor
 * Date: 6/30/13
 * Time: 11:48 AM
 * To change this template use File | Settings | File Templates.
 */
module.exports = function(options, imports, register){
    var services = imports.connectionServices;


    var io = require('socket.io').listen(services.server);

    var SessionSockets = require('session.socket.io')
        , sessionSockets = new SessionSockets(io, services.sessionStore, services.cookieParser);

    sessionSockets.on('connection', function (err, socket, session) {
//        socket.emit('session', session);
//
//        socket.on('refresh', function () {
//            socket.emit('serverTime', {time:new Date()});
//        });

    });

    register(
        {
            messages:{
                listen: function(){},
                broadcast: function(){}
            }
        }
    );
};