// Origin from http://seesparkbox.com/foundry/how_i_built_a_canvas_color_picker

(function() { 
    var app = app || {};
    function $(id) { return document.getElementById(id); }

    app.colors  = document.createElement("canvas");
    app.colors.width = 300;
    app.colors.height = 200;
    $('color_palette').appendChild(app.colors);
    app.colorctx = app.colors.getContext("2d");
 
    // Build Color palette
    app.buildColorPalette = function() {
        var gradient = app.colorctx.createLinearGradient(0, 0, app.colors.width, 0);
        
        // Create color gradient
        gradient.addColorStop(0,    "rgb(255,   0,   0)");
        gradient.addColorStop(0.15, "rgb(255,   0, 255)");
        gradient.addColorStop(0.33, "rgb(0,     0, 255)");
        gradient.addColorStop(0.49, "rgb(0,   255, 255)");
        gradient.addColorStop(0.67, "rgb(0,   255,   0)");
        gradient.addColorStop(0.84, "rgb(255, 255,   0)");
        gradient.addColorStop(1,    "rgb(255,   0,   0)");
        
        // Apply gradient to canvas
        app.colorctx.fillStyle = gradient;
        app.colorctx.fillRect(0, 0, app.colorctx.canvas.width, app.colorctx.canvas.height);
        
        // Create semi transparent gradient (white -> trans. -> black)
        gradient = app.colorctx.createLinearGradient(0, 0, 0, app.colors.height);
        gradient.addColorStop(0,   "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
        gradient.addColorStop(0.5, "rgba(0,     0,   0, 0)");
        gradient.addColorStop(1,   "rgba(0,     0,   0, 1)");
        
        // Apply gradient to canvas
        app.colorctx.fillStyle = gradient;
        app.colorctx.fillRect(0, 0, app.colorctx.canvas.width, app.colorctx.canvas.height);
    };
    
    var picked_color = document.createElement("canvas");
    picked_color.width = 20;
    picked_color.height = 20;
    
    var pc_ctx = picked_color.getContext("2d");
    document.getElementById("picked_color").appendChild(picked_color);

    pc_ctx.fillStyle = app.selectedColor || "#ff0080";
    pc_ctx.fillRect(0, 0, 20, 20);
    
    app.getColor = function(e) {
        var newColor;
        var currentPos = canvasMod.getMousePos(app.colors, e);
        var imageData = app.colorctx.getImageData(currentPos.x, currentPos.y, 1, 1);

        app.selectedColor = 'rgb(' + imageData.data[0] + ', ' + imageData.data[1] + ', ' + imageData.data[2] + ')';
        pc_ctx.fillStyle = app.selectedColor;
        pc_ctx.fillRect(0, 0, 20, 20);
    };

    app.buildColorPalette();
    app.colors.addEventListener("click", app.getColor, false);
    
    this.colorPicker = {
        app:app,
        selectedColor: app.selectedColor
    };

})();