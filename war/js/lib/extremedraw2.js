var videoDrawingCanvas;
var context;
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

var videoId = 'v';
var scaleFactor = .25;
var snapshots = [];

/**
 * Captures a image frame from the provided video element.
 *
 * @param {Video} video HTML5 video element from where the image frame will be captured.
 * @param {Number} scaleFactor Factor to scale the canvas element that will be return. This is an optional parameter.
 *
 * @return {Canvas}
 */
function capture(video, scaleFactor) {
    if(scaleFactor == null){
        scaleFactor = 1;
    }
    var w = video.videoWidth * scaleFactor;
    var h = video.videoHeight * scaleFactor;
    var canvas = document.createElement('canvas');
        canvas.width  = w;
        canvas.height = h;
    var ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, w, h);
    return canvas;
} 

/**
 * Invokes the <code>capture</code> function and attaches the canvas element to the DOM.
 */
function shoot(){
    var video  = document.getElementById(videoId);
    var output = document.getElementById('output');
    var canvas = capture(video, scaleFactor);

    snapshots.unshift(canvas);
    output.innerHTML = '';
    for(var i=0; i<4; i++){
        output.appendChild(snapshots[i]);
    }
}



function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

function clearCanvas() {

		$('#undoDiv').prepend(cloneCanvas(videoDrawingCanvas));
	
	
	var canvas = document.getElementById('imageVideo');
	var ctx    = canvas.getContext('2d');
	

		$('#videoUndoDiv').prepend(cloneCanvas(canvas));

	
	
	videoDrawingCanvas.width = videoDrawingCanvas.width; // Clears the videoDrawingCanvas 
	clickX = new Array();
	clickY = new Array();
	clickDrag = new Array();
	
	context.clearRect(0, 0, videoDrawingCanvas.width, videoDrawingCanvas.height);
}

function cloneCanvas(oldCanvas) {

    //create a new canvas
    var newCanvas = document.createElement('canvas');
    var newCanvasContext = newCanvas.getContext('2d');

	newCanvas.width = 160;
	newCanvas.height = 120;
    //apply the old canvas to the new one
    newCanvasContext.drawImage(oldCanvas, 0, 0, 160, 120);
    

	
    //return the new canvas
    return newCanvas;
}

function redraw(){
  videoDrawingCanvas.width = videoDrawingCanvas.width; // Clears the videoDrawingCanvas
  
  context.strokeStyle = "red";
  context.lineJoin = "round";
  context.lineWidth = 5;
			
  for(var i=0; i < clickX.length; i++)
  {		
    context.beginPath();
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
     }else{
       context.moveTo(clickX[i]-1, clickY[i]);
     }
     context.lineTo(clickX[i], clickY[i]);
     context.closePath();
     context.stroke();
  }
}

function getVideoDrawingCanvas() {
	videoDrawingCanvas = document.getElementById('videoDrawingCanvas');
	context = videoDrawingCanvas.getContext("2d");

	$('#videoDrawingCanvas').mousedown(function(e){
	  var mouseX = e.pageX - this.offsetLeft;
	  var mouseY = e.pageY - this.offsetTop;
		
	  paint = true;
	  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
	  redraw();
	});

	$('#videoDrawingCanvas').mousemove(function(e){
	  if(paint){
		addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
		redraw();
	  }
  
	});

	$('#videoDrawingCanvas').mouseup(function(e){
	  paint = false;
  
	});

	$('#videoDrawingCanvas').mouseleave(function(e){
	  paint = false;
  
	});
}




