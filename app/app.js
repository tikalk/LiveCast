/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path')
    , connect = require('connect')
    , app = express();

var cookieParser = express.cookieParser('secret')
    , sessionStore = new connect.middleware.session.MemoryStore();


app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(cookieParser);
    app.use(express.session({store: sessionStore}));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

var server = http.createServer(app)
    , io = require('socket.io').listen(server);

var SessionSockets = require('session.socket.io')
    , sessionSockets = new SessionSockets(io, sessionStore, cookieParser);

app.get('/', routes.index);
app.get('/users', user.list);

sessionSockets.on('connection', function (err, socket, session) {
    socket.emit('session', session);

    socket.on('refresh', function () {
        socket.emit('serverTime', {time:new Date()});
    });
});

server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
