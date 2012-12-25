var StudentsList = {
	users : {},
	add : function(nickname, socketid, role){
		var element = $("#students ul").append('<li class="teacher"><a><video id="you" class="flip" autoplay></video><span>Teacher: ' + nickname + '</span></a></li>');	
		if( role != "teacher"){
			element = $("#students ul").append('<li class="' + role + '"><a><video id="vid_' + socketid + '" class="flip" autoplay></video><span>' + nickname + '</span></a></li>');
		}
		this.users[socketid] = {"nickname" : nickname , "element" : element, "role" : role } ;
	},
	remove : function(socketid){
		var user = this.users[socketid];
		if (user.role == "teacher"){
			//TODO: Close room
			alert("teacher terminates lesson");
		}
		$(user.element).remove();
		this.users[socketid] = null;
	}

};
