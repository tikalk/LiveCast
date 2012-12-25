var StudentsList = {
	users : {},
	add : function(nickname, socketid, meta){
		var element = $("#students ul").append('<li><a href="#"><img src=""></img><span>' + nickname + "</span></a></li>");
		this.users[socketid] = {"nickname" : nickname , "element" : element, "meta" : meta } ;
	},
	remove : function(socketid){
		var user = this.users[socketid];
		if (user.meta.role == "teacher"){
			//TODO: Close room
			alert("teacher terminates lesson");
		}
		$(user.element).remove();
		this.users[socketid] = null;
	}

};
