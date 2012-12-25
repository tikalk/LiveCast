/*
 * Copyright (c) 2011 Patrick Quinn-Graham
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var app = app || {};
var socket = new io.Socket("");

$(document).ready(function(){

    app.selectedColor = "#000000";
    app.lineCap = 'round';
    app.lineWidth = 2.5;
    app.clickX = [];
    app.clickY = [];
    app.clickDrag = [];
    app.clickColor = [];

  var doc = $(document),
	drawingCanvas = document.createElement('canvas'),
    pickerCanvas = $('<canvas id="pickerCanvas" class="color-palette"></canvas>');

    drawingCanvas.setAttribute('width', $(document).width());
    drawingCanvas.setAttribute('height', $(document).height() - 40);

    pickerCanvas.width(284);
    pickerCanvas.height(135);

	$('body').append(drawingCanvas);
    $('.color-picker-wrapper').append(pickerCanvas);
	
    app.$colors  = $('.color-palette');
    app.colorctx = app.$colors[0].getContext('2d');

    // Init the color paleete
    app.buildColorPalette();

	// Event.observe(window, 'resize', function(){
    // document.location.reload();
	// });
  
  // Check the element is in the DOM and the browser supports canvas
  if(!drawingCanvas.getContext) {
    alert("No canvas tag :(");
    return;
  }
  var context = drawingCanvas.getContext('2d');
  
  context.lineCap = app.lineCap;
  context.lineWidth = app.lineWidth;

  app.mouseIsDown = false;
	
    app.magic = {
		context: drawingCanvas.getContext('2d'),
		touchCache: {},
		setup: function() {
            this.context.lineCap = app.lineCap;
            this.context.lineWidth = app.lineWidth;
            socket.connect();
		},
        drawResetStart: function () {
            this.context.strokeStyle = app.selectedColor;
            this.context.fillStyle = app.selectedColor;
            this.context.beginPath();
        },
        drawResetEnd: function () {
            this.context.closePath();
            this.context.stroke();
            this.context.fill();
        },
        draw: function (clickX, clickY, clickColor, clickDrag) {
            app.magic.clear();

            for (var i = 0; i < app.clickX.length; i++) {
                context.strokeStyle =clickColor[i];
                context.fillStyle = clickColor[i];
                context.beginPath();
                if (app.clickDrag[i] && i) {
                    context.moveTo(app.clickX[i - 1], app.clickY[i - 1]);
                } else {
                    context.moveTo(app.clickX[i]- 1, app.clickY[i]);
                }
                context.lineTo(app.clickX[i], app.clickY[i]);
                context.closePath();
                context.stroke();
                context.fill();
            }
        },
		drawLine: function(moveX, moveY, lineX, lineY) {
            app.magic.drawResetStart();
            this.context.moveTo(moveX, moveY);
            this.context.lineTo(lineX, lineY);
            app.magic.drawResetEnd();
		},
		clear: function() {
            this.context.fillStyle = '#ffffff';  // Workaround for Chrome
			this.context.clearRect(0,0, document.width, document.height - 40);
            this.context.width = this.context.width;
		},
        colorPicked: function (newColor) {
            app.selectedColor = newColor;
        },
		eventToProtocol: function (touch) {
			return { x: touch.pageX, y: touch.pageY, id: touch.identifier };
		}
	};
	
	app.magic.setup();

    app.addClick = function (x, y, color, dragging) {
        app.clickX.push(x);
        app.clickY.push(y);
        app.clickColor.push(color);
        app.clickDrag.push(dragging);
    };

    $(drawingCanvas).bind('touchstart', function(e) {
        var t = e.originalEvent.touches(function(touch) {
            app.magic.touchCache[touch.identifier] = { x: touch.pageX, y: touch.pageY };
            app.magic.drawLine(touch.pageX - 1, touch.pageY -1, touch.pageX, touch.pageY);
            return app.magic.eventToProtocol(touch);
        });
        socket.send({ e: "start", touches: t });
        e.preventDefault();
    });

    $(drawingCanvas).bind('mousedown', function(e) {
        app.mouseIsDown = true;
        // Mouse down location
        var mouseX = e.pageX - this.offsetLeft,
            mouseY = e.pageY - this.offsetTop;

        var t = function () {
            app.addClick(mouseX, mouseY, app.selectedColor, false);
            app.magic.draw(app.clickX, app.clickY, app.clickColor, app.clickDrag);
            return app.magic.mouseEventToProtocol(mouseX, mouseY, app.selectedColor, false);
        };
    });

    $(drawingCanvas).bind('touchmove', function(e) {
        var t = e.originalEvent.touches(function(touch) {
            var lastEvent = app.magic.touchCache[touch.identifier];
            
            app.magic.drawLine(lastEvent.x, lastEvent.y, touch.pageX, touch.pageY);
            lastEvent.x = touch.pageX;
            lastEvent.y = touch.pageY;
            return app.magic.eventToProtocol(touch);
        });
        socket.send({ e: "move", touches: t });
        e.preventDefault();
    });

    $(drawingCanvas).bind('mousemove', function(e) {
        if (app.mouseIsDown) {
            app.addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, app.selectedColor ,true);
            //app.magic.drawLine(app.clickX[app.clickX.length], app.clickY[app.clickY.length], e.pageX, e.pageY);
            app.magic.draw(app.clickX, app.clickY, app.clickColor, app.clickDrag);
        }
    });

    $(drawingCanvas).bind('touchend', function(e) {
        var t = e.originalEvent.touches(function(touch) {
            var lastEvent = app.magic.touchCache[touch.identifier];
                app.magic.drawLine(lastEvent.x, lastEvent.y, touch.pageX, touch.pageY);
            delete app.magic.touchCache[touch.identifier];
            return app.magic.eventToProtocol(touch);
        });
        socket.send({ e: "end", touches: t });
        e.preventDefault();
    });

    $(drawingCanvas).bind('mouseup', function(e) {
        app.mouseIsDown = false;
        app.magic.draw(app.clickX, app.clickY, app.clickColor, app.clickDrag);
    });

	$('.clear').bind('click', function(e){
		e.preventDefault();
        socket.send({ e: "clear" });
		magic.clear();
	});

    $('.color-pick').bind('click', function (e) {
        $('.color-picker-wrapper').toggle();
    });

  socket.on('message', function(m) {
    if(m.e == 'start') {
      m.touches.each(function(m){
        magic.touchCache[m.id] = { x: m.x, y: m.y };
				magic.drawLine(m.x - 1, m.y -1, m.x, m.y);
      });

    } else if(m.e == 'move') {
      m.touches.each(function(m){
        var lastEvent = magic.touchCache[m.id];
				magic.drawLine(lastEvent.x, lastEvent.y, m.x, m.y);
        lastEvent.x = m.x;
        lastEvent.y = m.y;
      });

    } else if(m.e == 'end') {
      m.touches.each(function(m){
        var lastEvent = magic.touchCache[m.id];
				magic.drawLine(lastEvent.x, lastEvent.y, m.x, m.y);
        delete magic.touchCache[m.id];
      });

    } else if(m.e == 'clear') {
			magic.clear();
		} else if(m.e == 'welcome') {
			var channel = document.location.search.match(/canvas=([^&]+)/);
			socket.send({ e: 'canvas', c: channel && channel[1] || 'default' });
		}

  });
});