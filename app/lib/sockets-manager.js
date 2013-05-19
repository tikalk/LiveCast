
var socketsManager = exports,
	socketio = require('socket.io'),
	//redisStore = require('socket.io/lib/stores/redis'),
	io = null;



socketsManager.init = function(server, cb) {
	io = socketio.listen(server);

	io.set('log level', 1);

	/*io.set('store', new redisStore({
		redisPub : global.redisPublisher,
		redisSub : global.redisSubscriber,
		redisClient : global.redisClient
	}));*/

	io.enable('browser client minification');  // send minified client
	io.enable('browser client etag');          // apply etag caching logic based on version number
	io.enable('browser client gzip');          // gzip the file

	io.set('transports', [
		'websocket',
		'flashsocket',
		'htmlfile',
		'xhr-polling',
		'jsonp-polling'
	]);

	io.sockets.on('connection', function (socket) {
		if (typeof cb === 'function') {
			cb(socket, emit);
		}
	});
};

var emit = socketsManager.emit = function(event, data) {
	io.sockets.in('Lecture').emit(event, data);
};