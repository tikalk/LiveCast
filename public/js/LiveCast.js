var LiveCast = {
  Views: {}
};


//- send data to server
LiveCast.send = function(eventName, data, callback) {
  rtc._socket.send(JSON.stringify({
    "eventName": eventName,
    "data": data
  }), callback);
};

// events to communicate with server nodejs
LiveCast.SendEvents = {
  CHAT: 'chat_msg',
  CODE: 'code_editor',
  QUESTION: 'raise_hand',
  LOGIN: 'login',
  DISCONNECT: 'logout'
};

LiveCast.RecieveEvents = {
  QUESTION: 'hand_raised',
  CHAT: 'chat_msg',
  CODE_CHANGED: 'code_changed',
  CONNECTED: 'on_login',
  DISCONNECTED: 'on_logout'
};