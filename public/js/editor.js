$(function() {
	
	var myCodeMirror = CodeMirror(document.getElementById('editor'), {
		value: "// start session here :-)",
		mode: "javascript",
		theme: "monokai",
		lineNumbers: true
	});

	myCodeMirror.on('change', function(instance, changeObj){
		console.log('change code mirror', instance, changeObj);
	});

	Backbone.on('theme-changed', function(theme){
		myCodeMirror.setOption('theme', theme);
	});
});