// Origin from http://seesparkbox.com/foundry/how_i_built_a_canvas_color_picker

var app = app || {};
 
// Build Color palette
app.buildColorPalette = function() {
  var gradient = app.colorctx.createLinearGradient(0, 0, app.$colors.width(), 0);
 
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
  gradient = app.colorctx.createLinearGradient(0, 0, 0, app.$colors.height());
  gradient.addColorStop(0,   "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
  gradient.addColorStop(0.5, "rgba(0,     0,   0, 0)");
  gradient.addColorStop(1,   "rgba(0,     0,   0, 1)");
 
  // Apply gradient to canvas
  app.colorctx.fillStyle = gradient;
  app.colorctx.fillRect(0, 0, app.colorctx.canvas.width, app.colorctx.canvas.height);
 
  app.$colors.mousedown(function(e) {
      app.colorEventX = e.pageX - app.$colors.offset().left;
      app.colorEventY = e.pageY - app.$colors.offset().top;
 
    // Track mouse movement on the canvas if the mouse button is down
    $(document).mousemove(function(e) {
      app.colorEventX = e.pageX - app.$colors.offset().left;
      app.colorEventY = e.pageY - app.$colors.offset().top;
    });
  
    // Get the color at the current mouse coordinates
    app.colorTimer = setInterval(app.getColor, 50);
  })
 
  // On mouseup, clear the interval and unbind the mousemove event,
  // it should only happen if the button is down
  .mouseup(function(e) {
    clearInterval(app.colorTimer);
    $(document).unbind('mousemove');
    $('.color-picker-wrapper').toggle();
  });
};

app.getColor = function(e) {
  imageData = app.colorctx.getImageData(app.colorEventX, app.colorEventY, 1, 1);
  var newColor = 'rgb(' + imageData.data[1] + ', ' + imageData.data[2] + ', ' + imageData.data[3] + ')';
  app.magic.colorPicked(newColor);
};