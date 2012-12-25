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
    var style = colorPicker.selectedColor || "#ff0080";
    var old_x;
    var old_y;
    var mouse_is_down = false;

    canvas.addEventListener("mousemove", cursorMove, false);
    canvas.addEventListener("mousedown", cursorDown, false);
    document.addEventListener("mouseup", cursorUp, false);

    canvas.width = 800;
    canvas.height = 400;

    $("canvas_wrapper").appendChild(canvas);

    var ROOM = 1, TOOL = "Line";

    /* Line */

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

    /* Erase */

    function drawErase(x, y) {
        ctx.fillStyle = "#fff";
        ctx.arc(x, y, 20, 0, Math.PI + Math.PI, false);
        ctx.fill();
    }

    function sendErase(x, y) {
        rtc._socket.send(JSON.stringify({
            eventName: "canvas_erase",
            data: {
                point: [x, y],
                room: ROOM
            }
        }), function(err) { if (err) console.log(err) })
    }

    /* Cursor */

    function cursorMove(e) {
        if (!mouse_is_down) return;

        style = colorPicker.app.selectedColor || style;
        
        var mouse_pos = getMousePos(canvas, e)

        if (TOOL == "Line") {
            var args = [old_x, old_y, mouse_pos.x, mouse_pos.y, style]

            drawLine.apply(this, args)
            sendLine.apply(this, args)
        }
        else if (TOOL == "Erase") {
            var args = [mouse_pos.x, mouse_pos.y]

            drawErase.apply(this, args)
            sendErase.apply(this, args)
        }

        old_x = mouse_pos.x;
        old_y = mouse_pos.y;
    }

    function cursorDown(e) {
        mouse_is_down = true;
        var mouse_pos = getMousePos(canvas, e);

        if (TOOL == "Erase") {
            var args = [mouse_pos.x, mouse_pos.y]

            drawErase.apply(this, args)
            sendErase.apply(this, args)
        }

        old_x = mouse_pos.x;
        old_y = mouse_pos.y;
    }

    function cursorUp(e) {
        mouse_is_down = false;
    }

    function changeTool(event) {
        if (event.srcElement.checked) TOOL = event.srcElement.value
        console.log("Change tool:", TOOL)
    }

    function initialize() {
        console.log("Initialize")

        rtc.connect("ws://" + location.host, ROOM)

        rtc.on("receive_canvas_line", function(obj) {
            // console.log("Receive canvas line", obj)
            drawLine(obj.start_point[0], obj.start_point[1], obj.end_point[0], obj.end_point[1], obj.color)
        })

        rtc.on("receive_canvas_erase", function(obj) {
            // console.log("Receive canvas erase", obj)
            drawErase(obj.point[0], obj.point[1])
        })

        for (var radio in {line_tool:0, erase_tool:0}) {
            $(radio).addEventListener("change", changeTool, false)
        }
    }

    this.canvasMod = {
        initialize: initialize,
        getMousePos: getMousePos
    };
})();
