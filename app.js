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
  console.log('-> chat');
  data = { "data": data.messages, "color": data.color };
});

/* canvas */

/*  draw line */
webRTC.rtc.on('canvas_line', function (data, socket) {
  console.log('-> canvas_line');
  sendMessage('receive_canvas_line', data, socket);
});

/* erase line */
webRTC.rtc.on("canvas_erase", function(data, socket) {
  console.log("-> canvas_erase");
  sendMessage('receive_canvas_erase', data, socket);
});


function sendMessage(eventName, data, socket) {
  var roomList = webRTC.rtc.rooms[data.room] || [];

  for (var i = 0; i < roomList.length; i++) {
    var socketId = roomList[i];
    if (socketId === socket.id) continue;

    if (socketId !== socket.id) {
      var soc = webRTC.rtc.getSocket(socketId);

      if (soc) {
        soc.send(JSON.stringify({
          "eventName": eventName,
          "data": data
        }), function(error) {
          if (error) {
            console.log(error);
          }
        });
      }
    }
  }

}