module.exports = function(options, imports, register){
	var chatMessageName = "chatMessage",
		messages = imports && imports.messages,
		storage = imports && imports.storage,
		broadcast = function(context, data, callee){
			messages.broadcast && messages.broadcast(chatMessageName, context, data, callee);
		},
		onMessageStored = function(err, ts){
			if (err) {
				console.log(err.message);
				return;
			}
			// TODO: on successful message store.
		},
		onChatMessage = function(context, data, caller){
			var callee = null;
			broadcast(context, data, callee);
			storage.add && storage.add(chatMessageName, context, data, onMessageStored);			
		},
		replayMessages = function(context, pastMessages, callee){
			console.log(pastMessages, caller);
			var replayMessage = function(message){
				broadcast(context, message, callee);
			};
			pastMessages.forEach(replayMessage);
		},
		getAndReplayPastMessages = function(context, caller){
			var replayWithCaller = function(pastMessages){
					replayMessages(context, pastMessages, caller);
				},
				messages = storage.get(chatMessageName, context, -1, replayWithCaller);
		},
		onConnectionChanged = function(context, data, caller, message) {
			var broadcastData = {
					message: (caller || "someone") + " " + message
				},
				callee = null;
			broadcast(context, broadcastData, callee);
		},
		onConnect = function(context, data, caller){
			onConnectionChanged(context, data, caller, "connected.");
			getAndReplayPastMessages(context, caller);
		},
		onDisconnect = function(context, data, caller){
			onConnectionChanged(context, data, caller, "disconnected.");
		};
	if (messages.listen) {
		messages.listen(chatMessageName, onChatMessage);
		messages.listen('connect', onConnect);
		messages.listen('disconnect', onDisconnect);
	}
	register();
};