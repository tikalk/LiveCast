/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , socketsManager = require('./lib/sockets-manager')
    , http = require('http')
    , path = require('path')
    , connect = require('connect')
    , app = express()
	, server = http.createServer(app);

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

var adminName, users = [];
socketsManager.init(server, function(socket, emit) {
	socket.on('connect-user', function(userName, room) {
		room = room || '';
		var isAdmin  = !users.length; // you admin if the room is empty
		adminName = isAdmin ? userName : adminName;
		users.push(userName);
		socket.join('Lecture:' + room);
		emit(null, 'joined', isAdmin);
	});

	socket.on('disconnect', function() {
	});
});

app.get('/', routes.index);

server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
