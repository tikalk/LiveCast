var StudentsList = {
	users : {},
	add : function(nickname, socketid, role){
		var element = '';	
		if( role != "teacher"){
			element = $("#students ul").append('<li class="' + role + '"><a><video id="vid_' + socketid + '" autoplay></video><span>' + nickname + '</span></a></li>');
			this.users[socketid] = {"nickname" : nickname , "element" : element, "role" : role } ;
		}
	},
	remove : function(socketid){
		var user = this.users[socketid];
		if (user.role == "teacher"){
			//TODO: Close room
			alert("teacher terminates lesson");
		}else{
			$(user.element).remove();
			delete this.users[socketid];	
		}
		
	}

};
