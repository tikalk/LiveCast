$(function() {
	
	window.myCodeMirror = CodeMirror(document.getElementById('editor'), {
		value: "// start session here :-)",
		mode: "javascript",
		theme: "monokai",
		lineNumbers: true
	});

	function setTeacherState() {

		myCodeMirror.on('change', function(instance) {
			LiveCast.send( LiveCast.SendEvents.CODE, {
				value: instance.getValue()
			});
		});

	}


	function setStudentState(){
		
		myCodeMirror.setOption('readOnly', true);
		rtc.on(LiveCast.RecieveEvents.CODE_CHANGED, function(data){
			console.log(data);
			if(data && data.value)
				myCodeMirror.setOption('value', data.value);
		});

	}
	// listen to events
	Backbone.on('theme-changed', function(theme){
		myCodeMirror.setOption('theme', theme);
	});

	Backbone.on('user-connected', function(data){
		var isStudent = data.role === 'student' ? true : false;

		if (!isStudent) {
			setTeacherState();
		} else {
			setStudentState();
		}
	});
});