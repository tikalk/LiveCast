$(function() {
	
	window.myCodeMirror = CodeMirror(document.getElementById('editor'), {
		value: "// start session here :-)",
		mode: "javascript",
		theme: "monokai",
		lineNumbers: true
	});

	myCodeMirror.on('change', function(instance) {
		LiveCast.send( LiveCast.SendEvents.CODE, {
			value: instance.getValue()
		});
	});

	// listen to events
	Backbone.on('theme-changed', function(theme){
		myCodeMirror.setOption('theme', theme);
	});

	Backbone.on('user-connected', function(data){
		var readOnly = data.user === 'teacher' ? true : false;
		myCodeMirror.setOption('readOnly', readOnly);
	});
});