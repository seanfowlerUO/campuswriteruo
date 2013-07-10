var drawingCanvas;
var aacontext;
var aclickX = new Array();
var aclickY = new Array();
var aclickDrag = new Array();
var apaint;


function aaddClick(x, y, dragging)
{
	aclickX.push(x);
	aclickY.push(y);
	aclickDrag.push(dragging);
}

function aredraw() {
	drawingCanvas.width = drawingCanvas.width; // Clears the drawingCanvas

	acontext.strokeStyle = "red";
	acontext.lineJoin = "round";
	acontext.lineWidth = 10;
	acontext.globalAlpha = 0.1;

	for (var i=0; i < aclickX.length; i++)
	{		
		acontext.beginPath();
		if (aclickDrag[i] && i) {
			acontext.moveTo(aclickX[i-1], aclickY[i-1]);
		} else { 
			acontext.moveTo(aclickX[i]-1, aclickY[i]);
			//console.log("drawx: " + (aclickX[i]-1).toString());
		}
		acontext.lineTo(aclickX[i], aclickY[i]);
		acontext.closePath();
		acontext.stroke();
	}
}

function agetCanvas(){
	drawingCanvas = document.getElementById('drawingCanvas');
	acontext = drawingCanvas.getContext("2d");

	$('#drawingCanvas').mousedown(function(e) {
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;

		apaint = true;
		aaddClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
		aredraw();
	});

	$('#drawingCanvas').mousemove(function(e) {
		var canvasposition = $('#drawingCanvas').offset();
		if (apaint) {
			aaddClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
			aredraw();
		}
  
	});

	$('#drawingCanvas').mouseup(function(e) {
		apaint = false;

	});

	$('#drawingCanvas').mouseleave(function(e) {
		apaint = false;

	});
}




