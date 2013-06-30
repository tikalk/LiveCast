angular.module('myApp').
factory("ApiService", function() {
	// initialize socket service
	var socket = io.connect();

	// define service
	var service = {
		subscribe: function (event, callback) {
			socket.on(event, callback);
		},

		emit: function (event, data) {
			socket.emit(event, data);
		}
	};

	return service;

});