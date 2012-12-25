var express = require('express'),
    path = require('path');
var app = express.createServer();
app.listen(8000);
console.log('Server listening to port: '+8000);
var webRTC = require('webrtc.io').listen(app);


app.configure(function(){
  app.set('port', process.env.PORT || 8000);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session({ secret: "string" }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

webRTC.rtc.on('connect', function(rtc) {
  console.log('Client connected');
});

webRTC.rtc.on('send answer', function(rtc) {
  console.log('answer sent');
});

webRTC.rtc.on('disconnect', function(rtc) {
  //Client disconnect 
});

webRTC.rtc.on('chat_msg', function(data, socket) {
  var roomList = webRTC.rtc.rooms[data.room] || [];

  for (var i = 0; i < roomList.length; i++) {
    var socketId = roomList[i];

    if (socketId !== socket.id) {
      var soc = webRTC.rtc.getSocket(socketId);

      if (soc) {
        soc.send(JSON.stringify({
          "eventName": "receive_chat_msg",
          "data": {
            "messages": data.messages,
            "color": data.color
          }
        }), function(error) {
          if (error) {
            console.log(error);
          }
        });
      }
    }
  }
});

/* canvas */

webRTC.rtc.on("canvas_line", function(obj, socket) {
	console.log("-> canvas_line")

	var room = webRTC.rtc.rooms[obj.room] || []

	for (var i = 0; i < room.length; ++i) {
		var socketId = room[i]
		if (socketId === socket.id) continue

		var target = webRTC.rtc.getSocket(socketId)
		if (target) {
			console.log("<- receive_canvas_line")

			target.send(JSON.stringify({
				eventName: "receive_canvas_line",
				data: obj
			}), function(err) { if (err) console.log(err) })
		}
	}
})

/* TODO */

webRTC.rtc.on("canvas_erase", function(obj, socket) {
	console.log("-> canvas_erase")

	var room = webRTC.rtc.rooms[obj.room] || []

	for (var i = 0; i < room.length; ++i) {
		var socketId = room[i]
		if (socketId === socket.id) continue

		var target = webRTC.rtc.getSocket(socketId)
		if (target) {
			console.log("<- receive_canvas_erase")

			target.send(JSON.stringify({
				eventName: "receive_canvas_erase",
				data: obj
			}), function(err) { if (err) console.log(err) })
		}
	}
})
