var express = require('express'),
    path = require('path');
var app = express.createServer();
app.listen(8000);
console.log('Server listening to port: '+8000);
var webRTC = require('webrtc.io').listen(app);

var nicknames = {};

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

app.get('/users', function(req, res){
    res.send(JSON.stringify(nicknames));
});

webRTC.rtc.on('connect', function(rtc) {
  console.log('Client connected');

});

webRTC.rtc.on('send answer', function(rtc) {
  console.log('answer sent');
});

webRTC.rtc.on('disconnect', function(rtc) {
  //Client disconnect 
  console.log('disconnect '+rtc.sockets);
  for (var i in nicknames){
    var isFound = false;
    for(var j=0; j<rtc.sockets.length;j++){
      if(i == rtc.sockets[j].id){
        isFound = true;
        break;
      }  
    }
    if (! isFound){
      console.log("Disconnected Nickname: "+nicknames[i]);
      delete nicknames[nicknames[i]];
      break;
    }
    
  }
});


webRTC.rtc.on('login', function(data, socket){
  console.log('Login: '+socket.id);
  console.log("Nickname: "+data.nickname);
  nicknames[socket.id] = data.nickname;
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