/**
 * Created with JetBrains WebStorm.
 * User: naor
 * Date: 6/30/13
 * Time: 1:20 AM
 * To change this template use File | Settings | File Templates.
 */
/**
 * Module dependencies.
 */
module.exports = function(options, imports, register){

    var dirname = options.rootDir;

    var express = require('express')
        , routes = require(dirname +'./routes')
        , user = require(dirname +'./routes/user')
        , http = require('http')
        , path = require('path')
        , connect = require('connect')
        , app = express();

    var cookieParser = express.cookieParser('secret')
        , sessionStore = new connect.middleware.session.MemoryStore();


    app.configure(function () {
        app.set('port', options.port);
        app.set('views', dirname + '/views');
        app.set('view engine', 'ejs');
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(cookieParser);
        app.use(express.session({store: sessionStore}));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(app.router);
        app.use(express.static(path.join(dirname, 'public')));
    });

    app.configure('development', function () {
        app.use(express.errorHandler());
    });

    var server = http.createServer(app);

    app.get('/', routes.index);
    app.get('/users', user.list);


    server.listen(app.get('port'), function () {
        console.log("Express server listening on port " + app.get('port'));
        register(null, {
            connectionServices:{
                server: server,
                sessionStore: sessionStore,
                cookieParser: cookieParser
            }
        });
    });

};
