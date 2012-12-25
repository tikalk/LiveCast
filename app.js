var express = require('express'),
    path = require('path'),
    SocketHelpers = require('./utils/SocketHelpers');

var app = express.createServer();
app.listen(8000);
console.log('Server listening to port: '+8000);
var webRTC = require('webrtc.io').listen(app);
SocketHelpers.setWebRTC(webRTC);

var usersNum = 0;
var nicknames = {};
var lastCodeEditorData = "";
var roomAdmin;
var answeringUserId;

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
  for (var socketId in nicknames){
    var isFound = false;
    for(var j=0; j<rtc.sockets.length;j++){
      if(socketId == rtc.sockets[j].id){
        isFound = true;
        break;
      }  
    }
    if (! isFound && socketId != roomAdmin.socketId){
      console.log("Disconnected Nickname: "+nicknames[socketId]);
      delete nicknames[nicknames[socketId]];
      usersNum--;
      break;
    }
    
  }
});


webRTC.rtc.on('login', function(data, socket){
    var role;
    if (usersNum == 0){
        role = 'teacher';

        // Setting admin role
        roomAdmin = {
            'socketId' : socket.id,
            'nickname' : data.nickname
        }

        // Handling teacher event of giving the right of speech to a specific student.
        socket.on('give_ros', function(data, soc){
            answeringUserId = data.socketId;
            SocketHelpers.doForCurrentRoomPeers(function(socketId){
                SocketHelpers.emitEventToPeer(socketId, "ros_given", {"socketId": socketId} );
            });
        });

        // Handling the teacher event of taking the right of speech back from the currently privileged user
        socket.on('take_ros', function(data, soc){
            if (answeringUserId != null){
                SocketHelpers.doForCurrentRoomPeers(function(socketId){
                    SocketHelpers.emitEventToPeer(socketId, "ros_taken", {"socketId": answeringUserId} );
                });
                answeringUserId = null;
            }
        });

        // Handing the teacher event of code editor changes.
        socket.on('code_editor', function(data,soc){
            lastCodeEditorData = data;
            SocketHelpers.doForCurrentRoomPeers(function(socketId){
               if (socket.id != socketId){
                   SocketHelpers.emitEventToPeer(socket.id, "code_changed", data);
               }
            });
        });
    } else {
        role = 'student';

        console.log('Login: '+socket.id);
        console.log("Nickname: "+data.nickname);
        nicknames[socket.id] = data.nickname;

        // Giving the user the last code editor data
        if (lastCodeEditorData != null){
           SocketHelpers.emitEventToPeer(socket.id, "code_changed", data);
        }
    }

    usersNum++;

    // Notifying the new user of its metadata.
    SocketHelpers.emitEventToPeer(socket.id, "on_login", {'role': role});

    // Notifying all users of the new user's login
    SocketHelpers.doForCurrentRoomPeers(function(socketId){
       if (socketId != socket.id){
           SocketHelpers.emitEventToPeer(socketId, "user_added", {
               'socketId': socket.id,
               'nickname': data.nickname
           });
       }
    });
});

webRTC.rtc.on('chat_msg', function(data, socket) {
    console.log("Message: " + data.messages);
    SocketHelpers.doForCurrentRoomPeers(function(socketId){
        if (socketId !== socket.id) {
            SocketHelpers.emitEventToPeer(socketId, "receive_chat_msg", {
                "messages": data.messages,
                "color": data.color
              });
        }
    });
});

webRTC.rtc.on('raise_hand', function(data, socket){

    // Iterating thru the rooms has no meaning at this point. It is done only to avoid doing it later, if more than one room support is actually added.
    SocketHelpers.doForCurrentRoomPeers(function(socketId){
        SocketHelpers.emitEventToPeer(socketId, "hand_raised", {"socketId": socket.id} );
    });
});


