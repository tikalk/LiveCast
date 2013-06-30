/**
 * Created with JetBrains WebStorm.
 * User: naor
 * Date: 6/30/13
 * Time: 11:48 AM
 * To change this template use File | Settings | File Templates.
 */
module.exports = function(options, imports, register){

    function notifyListeners(evtType, data, caller){
        if (isEventKnown(evtType)){
            listenersMap[evtType].forEach(function(listener){
                listener("defaultRoom", data, caller);
            });
        }
    }

    function isEventKnown(evtType) {
        return listenersMap.hasOwnProperty(evtType) && typeof listenersMap[evtType] === 'array';
    }

    function listenToPeer(peer, event, callback) {
        peer.socket.on(event, function (data) {
            callback("defaultRoom", data || {}, peer);
        });
    }

    var services = imports.connectionServices,
        listenersMap = {},
        peers = [];

    var io = options['socket.io'].listen(services.server);

    var SessionSockets = options['session.socket.io']
        , sessionSockets = new SessionSockets(io, services.sessionStore, services.cookieParser);

    sessionSockets.on('connection', function (err, socket, session) {
        if (err) throw err;
        if (peers.length == 0){
            session.isOwner = true;
            session.save();
        }

        peers.push({
            isOwner: session.isOwner,
            socket: socket
        });

        for (var evtType in listenersMap){
            if (listenersMap.hasOwnProperty(evtType)){
                listenersMap[evtType].forEach(function(cb){
                    listenToPeer(peers[peers.length - 1], evtType, cb);
                });
            }
        }

        notifyListeners('connection', {}, socket);
    });


    register(null,
        {
            messages:{
                listen: function(evtType, callback){
                    var arr;
                    if (! isEventKnown(evtType)){
                        arr = listenersMap[evtType] = [];
                    } else {
                        arr = listenersMap[evtType];
                    }
                    peers.forEach(function(peer){
                        listenToPeer(peer, evtType, callback)
                    });
                    arr.push(callback);
                },
                broadcast: function(evtType, context, data, callee, excludes){
                    if (context === "defaultRoom"){
                        if (typeof callee !== 'undefined' && callee != null)
                            callee.emit(evtType,data);
                        else
//                            sessionSockets.emit(evtType, data);
                            peers.forEach(function(peer){
                                if (excludes.indexOf(peer) == -1)
                                    peer.socket.emit(evtType, data);
                            });
                    } else {
                        throw "Missing message context: " + context;
                    }
                }
            }
        }
    );
};