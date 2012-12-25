var myCodeMirror = CodeMirror(document.getElementById('editor'), {
  value: "// start session here :-)",
  mode:  "javascript",
  theme: "monokai",
  lineNumbers: true
});

Backbone.on('theme-changed', function(theme){
	myCodeMirror.setOption('theme', theme);
});