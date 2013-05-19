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
The admin can use the OUT commands or others will only recieve notification on changes  

**Text Editor**  
we'll want to send on the writing process including deleteing and cursor movement, this why on the admin side we need to
save in array all the keystrokes and push them to the server once every 1s to be replayed by the cliets  

**Canvas**  
we'll want that drawing process be both fluent and mimic every admin movement to the clients, this is the implementation that should work  
fine: On admin side we need to sample mouse position on the canvas while mouse button clicked, and every 50ms, save the X,Y position  
of the mouse inside the canvas, every 1s push the array of mouse track to the server and clients should replay the drawing on thier canvas  

**Presentation**  
to be decided  

$# API for the above ^^  

**TextEditor**  

**Canvas**  

**Presentation**  
