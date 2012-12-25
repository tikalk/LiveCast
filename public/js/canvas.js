(function() {
    function $(id) { return document.getElementById(id); }

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    var old_x;
    var old_y;
    var mouse_is_down = false;

    canvas.addEventListener("mousemove", cursorMove, false);
    canvas.addEventListener("mousedown", cursorDown, false);
    document.addEventListener("mouseup", cursorUp, false);

    canvas.width = 800;
    canvas.height = 400;

    $("canvas_wrapper").appendChild(canvas);

    var ROOM = 1;

    function drawLine(x1, y1, x2, y2, style) {
        ctx.strokeStyle = style;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    function sendLine(x1, y1, x2, y2, style) {
        rtc._socket.send(JSON.stringify({
            eventName: "canvas_line",
            data: {
                color: style,
                start_point: [x1, y1],
                end_point: [x2, y2],
                room: ROOM
            }
        }), function(err) { if (err) console.log(err) })
    }

    function cursorMove(e) {
        if (!mouse_is_down) return;

        var mouse_pos = getMousePos(canvas, e),
            args = [old_x, old_y, mouse_pos.x, mouse_pos.y, "green"];

        drawLine.apply(this, args);
        sendLine.apply(this, args);

        old_x = mouse_pos.x;
        old_y = mouse_pos.y;
    }

    function cursorDown(e) {
        mouse_is_down = true;
        var mouse_pos = getMousePos(canvas, e);
        old_x = mouse_pos.x;
        old_y = mouse_pos.y;
    }

    function cursorUp(e) {
        mouse_is_down = false;
    }

    function initialize() {
        console.log("Initialize")

        rtc.connect("ws://" + location.host, ROOM)

        /*
        rtc.on("add remote stream", function(stream, socket) {
            console.log("Add remote stream")
        })

        rtc.on("disconnect stream", function(stream, socket) {
            console.log("Disconnect stream")
        })
        */

        rtc.on("receive_canvas_line", function(obj) {
            console.log("Receive canvas line", obj)
            drawLine(obj.start_point[0], obj.start_point[1], obj.end_point[0], obj.end_point[1], obj.color)
        })
    }

    this.canvasMod = {
        initialize: initialize
    };
})();
