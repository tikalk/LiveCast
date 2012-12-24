/* 
 * Copyright (c) 2011 Patrick Quinn-Graham
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var nodeStatic = require('./node-static'),
    util = require('util'),
    http = require('http'),
		io = require('./socket.io'),
		file, server, socket, touches = {}, channelListeners = {};
fileServer = new(nodeStatic.Server)('./public');
server = http.createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response);
    });
});
server.listen(process.env.PORT || 8080);
socket = io.listen(server);
socket.on('connection', function(client){
	var myChosenChannel = null;
	util.log("Connected! :)");
	client.send({ e: 'welcome' });
  client.on('message', function(m){
		if(m.e == "canvas") {
			myChosenChannel = m.c;
			if(touches[myChosenChannel]) {
				touches[myChosenChannel].forEach(function(t){
					client.send(t);
				});				
			} else {
				touches[myChosenChannel] = [];
			}
			if(!channelListeners[myChosenChannel]) {
				channelListeners[myChosenChannel] = [];
			}
			channelListeners[myChosenChannel].push(client);
			return;
		}
		channelListeners[myChosenChannel].forEach(function(c){
			if(c != client) {
				c.send(m);				
			}
		});
		if(m.e == "clear") {
			util.log("Clearing all touches on channel " + myChosenChannel);
			touches[myChosenChannel] = [];
		} else {
			util.log("Touch " + m.e + ' on channel ' + myChosenChannel);
			touches[myChosenChannel].push(m);			
		}
	}) 
  client.on('disconnect', function(){
		util.log("Disconnect :(")
	}) 
});
 