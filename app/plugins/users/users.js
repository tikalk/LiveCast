var usersPerContext = {};

module.exports = function(options, imports, register){
	var message = imports.messages,
		storage = imports.storage;
		// todo add imports of chat, canvas
	
	//message.listen(event-name, fn(context, data, caller));
	//message.broadcast(event-name, context, data, [callee]);
	
	
	message.listen('connect-user', function(context, nickname, caller) {
		if (!(context in usersPerContext)) {
			usersPerContext[context][nickname] = caller;
			return;
		}
		
		if (!(nickname in usersPerContext[context])) {
			usersPerContext[context][nickname] = caller;
			// todo return the 
			message.broadcast('joined', context, {isAdmin: caller.isOwner}, caller);
			message.broadcast('users-list', context, Object.keys(usersPerContext[context]));
			return;
		} 
		
		message.broadcast('joined-failed', context, 'Nickname in use', caller);
	});
	
	
	message.listen('disconnect', function(context, data, caller) {
		if (caller.isOwner) {
			message.broadcast('end', context, 'Owner left, session is ended!');
			return;
		}
		
		//search for caller in our list
		var user;
		for (user in usersPerContext[context]) {
			if (user.socket.id === caller.socket.id) {
				delete usersPerContext[context][user];
				break;
			}
		}
		
		message.broadcast('users-list', context, Object.keys(usersPerContext[context]));
	});
	
	message.listen('users-list', function(context, data, caller) {
		message.broadcast('users-list', context, Object.keys(usersPerContext[context]));
	});
	
	register();
};