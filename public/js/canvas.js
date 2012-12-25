(function() {
	function $(id) { return document.getElementById(id) }

	function initialize() {
		console.log("Initialize")

		rtc.createStream({ video: true, audio: true }, function(stream) {
			$("you").src = URL.createObjectURL(stream)
			rtc.attachStream(stream, "you")
		})

		rtc.connect("ws://" + location.host)

		rtc.on("add remote stream", function(stream, socket) {
			console.log("Add remote stream")
		})
	}

	this.canvasMod = {
		initialize: initialize
	}
})()
