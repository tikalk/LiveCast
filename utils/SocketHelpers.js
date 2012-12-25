/**
 * Created with JetBrains WebStorm.
 * User: Naor
 * Date: 25/12/12
 * Time: 2:26 PM
 * Socket messaging helper functions
 */

var webRTC; // A reference to the application's webRTC service

exports.emitEventToPeer =  function (socketId, eventName, data){
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
};

exports.doForCurrentRoomPeers = function (fn){
//    var roomList = webRTC.rtc.rooms[data.room] || [];
    var roomList = webRTC.rtc.sockets;

    for (var i = 0; i < roomList.length; i++) {
        var socketId = roomList[i].id;
        fn(socketId);
    }
};
exports.setWebRTC = function(rtc){
  webRTC = rtc;
};

