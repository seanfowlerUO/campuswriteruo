//	henlin@uoregon.edu 
//	action.js - action recorder for video grip, and helper methods
//	dependencies - jquery.js, backbone.js
//

// globals
var video;		
var canvas;		
var actionArray;

function setupAction() {
	video		=	document.getElementById("v"); // needs to be set to the video object
	canvas		=	document.getElementById("videoDrawingCanvas");
	actionArray	=	new Array();
	
	
	/*

		VIDEO related methods
	
		requires:
			nothing

	*/

	// return timestamp of video
	video.getTimeStamp	=	function() {
		return video.currentTime;
	}

	// restart video
	video.restart	=	function() {
		video.currentTime	=	0;
		canvas.clear();
		video.play();
		setTimelineInterval();
	}

	/*

		VIDEO related methods
	
		requires:
			nothing

	*/

	canvas.clear	=	function() {
		canvas.width	=	canvas.width;
	
		console.log("canvas cleared");
	}
}

/* usage:	actionArray.push(newAction(,));

	explanation:
		this is a set of methods and objects for recording and playing back events on an html5 canvas
		while at the same time playing an html5 video such that the video appears editted.
	
		this is the main object:
			var action = {	type				:	draw, clear, text, (future: zoom, pause for time, reversefortime),
							timeStamp			:	a timestamp for where the video is at,
							actionStopOffset	:	end time for actions which require an end	}
						
		important sections are marked in this fashion:
		
				VIDEO related methods
	
				requires:
					nothing
					
		and such sections contain only the code important to themselves.
		
		the following sections are implemented:
			video		-	for the html5 video helper methods
			canvas		- 	canvas helper methods
			timer		-	runs the playback of canvas over video
			text input	-	handles text input related methods for canvas
			clear		- 	handles clear related methods for the canvas
					
*/

// creates and returns a new action object
function newAction(type, actionStopOffset) {
	var timeStamp 	= 	video.getTimeStamp();	
	var action		=	{	type			:	type,
							timeStamp		: 	timeStamp,	
							actionStopTime	:	(timeStamp + actionStopOffset)	}
					
	return action;
}

// order actionarray
function orderActionArray() {

}

/*

	TIMER related methods
	
	requires:
		should be started with start button for video

*/

var timer	=	{	videoTimeline	:	null,
					timerInterval	:	10,
					actionIndex		:	0,
					nextTimeStamp	:	null	}


// start playing the video
function setTimelineInterval() {
	if (typeof(actionArray[0]) != "undefined") { 
		timer.nextTimeStamp	=	actionArray[timer.actionIndex].timeStamp;
		timer.videoTimeline = 	setInterval(
			function() {
				timelineTick()
			},	timer.timerInterval
		);
	}
}

// update the interval for the next event and increment actionindex counter
function updateIntervals() {
	if (typeof(actionArray[timer.actionIndex + 1].timeStamp) != "undefined") { // look to see if there is a next event
		timer.actionIndex++;
		timer.nextTimeStamp	=	actionArray[timer.actionIndex].timeStamp;
	} else {
		timer.actionIndex	=	null;
		timer.nextTimeStamp	=	null;
	}
}

// the timeline ticks forward
function timelineTick() {
	if (video.getTimeStamp() - timer.nextTimeStamp <= 0.1	&&
		video.getTimeStamp() - timer.nextTimeStamp >= -0.1 	&&
		timer.nextTimeStamp != null) {
		
		console.log("event fired! video timestamp: " + video.getTimeStamp() + ", timer timestamp: " + timer.nextTimeStamp + ", delta: " + (video.getTimeStamp() - timer.nextTimeStamp));
		
		timer.nextTimeStamp	=	null;
		actionArray[timer.actionIndex].type.action();
		updateIntervals();
	}
}

/*

	TEXT INPUT related methods
	
	requires:
		text field with id set to textInput
		text field with id set to textInputLength
		canvas with id set to drawingCanvas

*/

// constructor method
function newText(textInput) {
	var text	=	{	actionType	:	"text",
						action		:	function() {	
											writeText(textInput)	
										}	}
	
	return text;						
}

// event listener for textInput button click
function textInputAction() {
	video.pause();					
	// new pauseButtonView({});		// needs to be implemented
}

// event listener for after modal window for text entry has quit
function textInputFinishedAction() {
	var text	=	$('#textInput').val();
	var length	=	$('#textInputLength').val();
	
	writeText(text);
	actionArray.push(newAction(newText(text), length));
	video.play();
	
	console.log("text input added to action array");
}

// the actual function
function writeText(text) {
	var context    		= 	canvas.getContext('2d');
	context.font 		=	"20pt Calibri";
	context.fillStyle 	= 	"red";
	context.fillText(text, 50, 50);
	context.strokeText(text, 50, 50);
	
	console.log("text drawn to canvas");
}

/*

	TEXT LINK related methods
	
	requires:
		text field with id set to textLinkInput
		text field with id set to textLinkInputLength
		canvas with id set to drawingCanvas

*/

// constructor method
function newTextLink(textInput) {
	var text	=	{	actionType	:	"text",
						action		:	function() {	
											writeTextLink(textInput)	
										}	}
	
	return text;						
}

// event listener for textInput button click
function textLinkInputAction() {
	video.pause();					
	// new pauseButtonView({});		// needs to be implemented
}

// event listener for after modal window for text entry has quit
function textLinkInputFinishedAction() {
	var text	=	$('#textLinkInput').val();
	var length	=	$('#textLinkInputLength').val();
	
	writeTextLink(text);
	actionArray.push(newAction(newTextLink(text), length));
	video.play();
	
	console.log("text input added to action array");
}

// the actual function
function writeTextLink(text) {
	var context    		= 	canvas.getContext('2d');
	context.font 		=	"20pt Calibri";
	context.fillStyle 	= 	"red";
	context.fillText(text, 50, 150);
	context.strokeText(text, 50, 150);
	
	$('#' + canvas.id).dblclick(function () {
		switchVisibility('articleWindow');
		console.log("double clicked");
	});
	
	console.log("text drawn to canvas");
}

/*

	CLEAR related methods
	
	requires:
		nothing

*/

// constructor method
function newClear() {
	var clear	=	{	actionType	:	"clear",
						action		:	function() {
											canvas.clear();
										}	}
	
	return clear;						
}

// event listener for clear
function clearAction() {
	canvas.clear();
	actionArray.push(newAction(newClear(), 0));
	
	console.log("clear added to action array");
}





