Communication API
=================

All the traffic trandfered over sockets, we're using socket.io as our lib.  
every call is async.  

**Joining Lecture**  
OUT: `connect-user(userName)`  
IN: `joined(isAdmin)`  
Example:  

	socket.emit('connect-user', 'Shachar');
	socket.on('joined', function(isAdmin) {
	});



**List users**  
You can ask for user list manualy, but on every user joined or left you'll also recieve updates to 'users-list'  
Out: `users-list`  
IN: `users-list(list)`  
Example:

	socket.emit('users-list');
	socket.on('users-list', function(users) {
		// users = ['Shachar', ....]
	});
Note: first user in the list is the admin  


**Chat send message**  
OUT: `chat-message(userName, msg)`  
Example:  

	socket.emit('chat-message', {userName: 'Shachar', msg: 'Great lecture, thank you'}); 


**Chat messages list update**  
everytime someone push message to chat all the clients will get update  
IN: `chat-message(msg)`  
Example:  

	socket.on('chat-message', function(msg) {
		// msg = {userName: 'Shachar', msg: 'Great lecture, thank you', datetime: '20130519T142100'}
	});


**For Text Editor, Canvas, Presentation**  
The admin can use the OUT commands and others will only recieve notification on changes  

**Text Editor**  
we'll want to send on the writing process including deleteing and cursor movement, this why on the admin side we need to
save in array all the keystrokes and push them to the server once every 1s to be replayed by the cliets  

**Canvas**  
we'll want that drawing process be both fluent and mimic every admin movement to the clients, this is the implementation that should work fine: On admin side we need to sample mouse position on the canvas while mouse button clicked, and every 50ms, save the X,Y position of the mouse inside the canvas, every 1s push the array of mouse track to the server and clients should replay the drawing on thier canvas (interval could be adjust to best achieve performace)  

**Presentation**  
to be decided  

## API for the above ^^  

**TextEditor**
assume start position of the cursor in in the top left corner  
IN: `texteditor(userName, keys)`  
OUT: `texteditor(keys)`  
Example:
	
	// 1. only admin cam emit this event, 2. keystokes passed as ascii codes
	socket.emit('texteditor', {userName: 'Shachar', keys: [13, 13, 9, 72, 105, 32, 97, 108, 108]})
	socket.on('texteditor', function(keys) {
		// keys = [13, 13, 9, 72, 105, 32, 97, 108, 108]; // "CR CR TAB Hi All"
	});

**Canvas**  
assumptions: top-left corner is 0,0, bottom-right corner is MAX _ W, MAX _ H, only one color supported, no erease feature.  
IN: `canvas(userName, trail)`  
OUT: `canvas(trail)`  
Example:

	// only admin can emit this event
	var points = [], i=100;
	while(i--) {
		// line
		points.push([10, i]);
	}
	socket.emit('canvas', {userName: 'Shachar', trail: points})
	socket.on('canvas', function(trail) {
		// trail = [ [10,100], [10, 99] .. [10,1], [10,0] ]
		//http://hacks.mozilla.org/2009/06/pushing-pixels-with-canvas/
	});


**Presentation**  
