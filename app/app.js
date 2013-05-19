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

// Shachar: this method will work fine, until users opens another browser,
// TODO: implement handshake
var adminName, users = [], socketByUserName = {}, userNameBySocket = {};
socketsManager.init(server, function(socket, lectureEmit) {
	socket.on('connect-user', function(userName) {
		room = room || '';
		var isAdmin  = !users.length; // you admin if the room is empty
		adminName = isAdmin ? userName : adminName;
		
		var pos = users.indexOf(userName);
		if (pos !== -1) {
			socket.emit('join-failed', 'nickname exists');
			return;
		}
		
		// it's not duplicate! object literal cant assure the order of elements this why i'm using array of 
		// user to keep the order, pos 0 is the admin
		users.push(userName);
		socketByUserName[userName] = socket.id;
		userNameBySocket[socket.id] = userName;
		socket.join('Lecture');
		socket.emit('joined', isAdmin);
	});

	socket.on('users-list', function() {
		usersList();
	});
	
	socket.on('chat-message', function(msg) {
		msg.userName = userNameBySocket[socket.id];
		msg.datetime = (new Date()).format('YmdHi');
		lectureEmit('chat-message', msg);
	});
	
	socket.on('texteditor', function(keys) {
		if (users.indexOf(userNameBySocket[socket.id]) !== 0) {
			socket.emit('texteditor-failed', 'not admin');
			return;
		}
		
		lectureEmit('texteditor', keys);
	});
	
	socket.on('canvas', function(trail) {
		if (users.indexOf(userNameBySocket[socket.id]) !== 0) {
			socket.emit('canvas-failed', 'not admin');
			return;
		}
		
		lectureEmit('canvas', trail);
	});
	
	socket.on('disconnect', function() {
		var userName = userNameBySocket[socket.id];
		delete userNameBySocket[socket.id];
		delete socketByUserName[userName];
		
		var pos = users.indexOf(userName);
		users.splice(pos,1);
		if (pos === 0) {
			lectureEmit('end', 'admin left');
			return;
		}
		
		usersList();
	});
	
	function usersList() {
		lectureEmit('uses-list', users);
	}
});

app.get('/', routes.index);

server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
