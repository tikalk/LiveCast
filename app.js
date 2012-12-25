var express = require('express'),
    path = require('path');
var app = express.createServer();
app.listen(8000);
console.log('Server listening to port: '+8000);
var webRTC = require('webrtc.io').listen(app);

var usersNum = 0;
var nicknames = {};
var roomAdmin;

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

// Socket messaging helper functions
function emitPeerEvent(socketId, eventName, data){
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

function doForCurrentRoom(fn){
    var roomList = webRTC.rtc.rooms[data.room] || [];

    for (var i = 0; i < roomList.length; i++) {
        var socketId = roomList[i];
        fn(socketId);
    }
}

webRTC.rtc.on('connect', function(rtc) {
  console.log('Client connected');

});

webRTC.rtc.on('send answer', function(rtc) {
  console.log('answer sent');
});

webRTC.rtc.on('disconnect', function(rtc) {
  //Client disconnect 
  console.log('disconnect '+rtc.sockets);
  for (var socketId in nicknames){
    var isFound = false;
    for(var j=0; j<rtc.sockets.length;j++){
      if(socketId == rtc.sockets[j].id){
        isFound = true;
        break;
      }  
    }
    if (! isFound){
      console.log("Disconnected Nickname: "+nicknames[socketId]);
      delete nicknames[nicknames[socketId]];
      usersNum--;
      break;
    }
    
  }
});


webRTC.rtc.on('login', function(data, socket){
    if (usersNum == 0){

        // Setting admin role
        roomAdmin = {
            'socketId' : socket.id,
            'nickname' : data.nickname
        }

        socket.on('give_ros', function(data, socket){

        });
    } else {
        console.log('Login: '+socket.id);
        console.log("Nickname: "+data.nickname);
        nicknames[socket.id] = data.nickname;
    }

    usersNum++;
});



webRTC.rtc.on('chat_msg', function(data, socket) {
    doForCurrentRoom(function(socketId){
        if (socketId !== socket.id) {
            emitPeerEvent(socketId, "receive_chat_msg", {
                "messages": data.messages,
                "color": data.color
              });
        }
    });
});

webRTC.rtc.on('raise_hand', function(data, socket){

    // Iterating thru the rooms has no meaning at this point. It is done only to avoid doing it later, if more than one room support is actually added.
    doForCurrentRoom(function(socketId){
        emitPeerEvent(socketId, "hand_raised", {"socketId": socket.id} );
    });
});


