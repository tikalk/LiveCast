(function() {
	function $(id) { return document.getElementById(id) }

	var ROOM = 1

	function initialize() {
		console.log("Initialize")

		rtc.createStream({ video: true, audio: true }, function(stream) {
			$("you").src = URL.createObjectURL(stream)
			rtc.attachStream(stream, "you")
		})

		rtc.connect("ws://" + location.host, ROOM)

		rtc.on("add remote stream", function(stream, socket) {
			console.log("Add remote stream")
		})

		rtc.on("disconnect stream", function(stream, socket) {
			console.log("Disconnect stream")
		})

		rtc.on("receive_canvas_line", function(obj) {
			console.log("Receive canvas line", obj)
		})

		$("test_button").addEventListener("click", function(event) {
			console.log("Test button click")

			rtc._socket.send(JSON.stringify({
				eventName: "canvas_line",
				data: {
					color: "#ff0080",
					start_point: [0, 0],
					end_point: [250, 0],
					room: ROOM
				}
			}), function(err) { if (err) console.log(err) })
		}, false)
	}

	this.canvasMod = {
		initialize: initialize
	}
})()
