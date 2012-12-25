(function() {
    var app = app || {};

    var canvas, ctx, old_x, old_y, style,
        mouse_is_down = false, ROOM = 1, TOOL = "Line";

    function $(id) { return document.getElementById(id); }

    function buildCanvas (target) {
        var wrapper = $('#' + target);

        wrapper.appendTo('<input type="radio" name="tool" id="line_tool" value="Line" checked />');
        wrapper.appendTo('<label for="line_tool">Line</label>');
        wrapper.appendTo('<input type="radio" name="tool" id="erase_tool" value="Erase" />');
        wrapper.appendTo('<label for="erase_tool">Erase</label>');

        wrapper.appendTo('<select id="line_width">' +
            '<option value="1">1</option>' +
            '<option value="2">2</option>' +
            '<option value="3">3</option>' +
            '<option value="4">4</option>' +
            '<option value="5" selected>5</option>' +
            '<option value="8">8</option>' +
            '<option value="13">13</option>' +
            '<option value="15">15</option>' +
            '<option value="21">21</option>' +
            '<option value="34">34</option>' +
            '</select>');
        wrapper.appendTo('<div id="canvas_wrapper"></div>');
        wrapper.appendTo('<div id="color_palette"></div>');
        wrapper.appendTo('<div id="color_picked"></div>');

        app.colors  = document.createElement("canvas");
        app.colors.width = 300;
        app.colors.height = 200;
        $('#color_palette').appendChild(app.colors);

        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");
        style = this.colorPicker.selectedColor || "#ff0080";
        mouse_is_down = false;
        line_width = 5;
    
        canvas.addEventListener("mousemove", cursorMove, false);
        canvas.addEventListener("mousedown", cursorDown, false);
        document.addEventListener("mouseup", cursorUp, false);

        canvas.width = 800;
        canvas.height = 400;

        $("#canvas").appendChild(canvas);

        document.getElementById("line_width").addEventListener("change", function() {
            line_width = this.value;
        }, false);
    }

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }
    
    /* Line */

    function drawLine(x1, y1, x2, y2, style, line_width) {
        ctx.strokeStyle = style;
        ctx.lineWidth = line_width;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    function sendLine(x1, y1, x2, y2, style, line_width) {
        rtc._socket.send(JSON.stringify({
            eventName: "canvas_line",
            data: {
                color: style,
                line_width: line_width,
                start_point: [x1, y1],
                end_point: [x2, y2],
                room: ROOM
            }
        }), function(err) { if (err) console.log(err) });
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
        }), function(err) { if (err) console.log(err) });
    }

    /* Cursor */

    function cursorMove(e) {
        if (!mouse_is_down) return;

        style = colorPicker.app.selectedColor || style;
        
        var mouse_pos = getMousePos(canvas, e), args;

        if (TOOL == "Line") {
            args = [old_x, old_y, mouse_pos.x, mouse_pos.y, style, line_width];

            drawLine.apply(this, args);
            sendLine.apply(this, args);
        }
        else if (TOOL == "Erase") {
            args = [mouse_pos.x, mouse_pos.y];

            drawErase.apply(this, args);
            sendErase.apply(this, args);
        }

        old_x = mouse_pos.x;
        old_y = mouse_pos.y;
    }

    function cursorDown(e) {
        mouse_is_down = true;
        var mouse_pos = getMousePos(canvas, e), args;

        if (TOOL == "Erase") {
            args = [mouse_pos.x, mouse_pos.y];

            drawErase.apply(this, args);
            sendErase.apply(this, args);
        }

        old_x = mouse_pos.x;
        old_y = mouse_pos.y;

        e.preventDefault(); // fixes bug with mouse pointer changing to text
    }

    function cursorUp(e) {
        mouse_is_down = false;
    }

    function changeTool(event) {
        if (event.srcElement.checked)  {
            TOOL = event.srcElement.value;
        }

        console.log("Change tool:", TOOL);
    }

    function initialize() {
        console.log("Initialize");

        rtc.connect("ws://" + location.host, ROOM);

        rtc.on("receive_canvas_line", function(obj) {
            // console.log("Receive canvas line", obj)
            drawLine(obj.start_point[0], obj.start_point[1], obj.end_point[0], obj.end_point[1], obj.color, obj.line_width)
        });

        rtc.on("receive_canvas_erase", function(obj) {
            // console.log("Receive canvas erase", obj)
            drawErase(obj.point[0], obj.point[1]);
        });

        for (var radio in {line_tool:0, erase_tool:0}) {
            $(radio).addEventListener("change", changeTool, false);
        }
    }

    this.canvasMod = {
        buildCanvas: buildCanvas,
        initialize: initialize,
        getMousePos: getMousePos
    };
})();