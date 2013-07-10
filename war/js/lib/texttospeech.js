var tts = tts || {}; // the tts namespace, following this: http://elegantcode.com/2011/01/26/basic-javascript-part-8-namespaces/

/*
 * documentId must be defined and unique for each document, in the document's individual xxxtts.js file 
 * (for instance, war/contents/chapter16/chapter16tts.js). When a new document is loaded into the reader, this var is 
 * overwritten by the new document's documentId.
 */
//tts.getTTSSentenceUrl = function() {
//	return "http://crtexttospeech.appspot.com/TTSServlet?documentid="+documentId+"&sentenceid=";
//}

tts.currPlayingClipId;		// the id of the currently playing/paused audio clip
tts.currPlayingRange;		// the Range of the currently playing/paused audio clip
tts.currPlayingClip;		// the audio clip that is currently being played or is paused
tts.doPlay;					// set to true so long as player should keep playing
						// in response to user clicking the male/female icon in the widget
tts.selectMode = false;		// clicking on sentences is disabled until selectMode is
						// activated by clicking the speaker icon in the controller widget,
						// and disabled again when stop button is pressed.
tts.textToSpeak = "";		//text that is being spoken.
tts.leftOverToSpeak = "";	//leftover text in a sentence that needs to be spoken.




/*
 * jquery selector to enable clicking on sentences to start TTS for that sentence.
 * Note that clicking only has an effect if tts.selectMode is enabled, which is only
 * true after the user clicks the speaker icon in the TTS controller widget.
 */


/*
 * Takes the mouse click in a text node and starts the TTS playback process.
 */
tts.playSelectionInSpan = function(sel, span){
	
	if (tts.currPlayingClip) {
		tts.currPlayingClip.pause();
	}
	
	if (tts.currPlayingRange)
		tts.currPlayingRange.unhighlight();
	
	containerId = $(span).attr('data-sara-original');
	
	//in case we clicked a highlight
	if(containerId === undefined){
		containerId = $(span).parent('[data-sara-original]').attr('data-sara-original');
		
	}
	
	offset = sara.getCharOffsetRelativeTo(span, sel.anchorNode, sel.anchorOffset);

	sentence = tts.getSentenceForContainerAndOffset(containerId, offset);

	if (sentence != null) {
		//Uses Jason's proxy server.
		tts.retrieveAndPlaySentence(sentence.sentenceId);
	} else {
		window.alert("not found");
	}
}

/* 
 * Given a click in a container and offset, finds the id of the sentence that that click was in.
 * This uses the fragmentArray and sentenceArray arrays defined in the document's xxxtts.js file
 * (for instance, chapter 16's is in war/contents/chapter16/js/chapter16tts.js). That file is
 * generated automatically during parsing of the chapter contents. See the TTS prep guide for
 * complete instructions.
 */
tts.getSentenceForContainerAndOffset = function(container, offset) {
	var sentence;
	var bestSoFar = null;
	for (i=0; i<fragmentArray.length; i++) {
		sentence = fragmentArray[i];
		//console.log("cont: " + sentence.container + " offset: "+sentence.offset+" para: "+sentence.paragraphId+" sent: "+sentence.sentenceId);
		if (sentence.container == container) {
			if (sentence.offset <= offset) {
				//console.log("still looking: curr offset: "+sentence.offset+" targetoffset: "+offset);
				bestSoFar = sentence;
			} else {
				//console.log("too far! curr offset: "+sentence.offset+" targetoffset: "+offset);
				return bestSoFar;
			}		
		} else {	// target is in last fragment of container
			if (bestSoFar != null) {
				//console.log("past container; cont: " + sentence.container + " offset: "+sentence.offset+" para: "+sentence.paragraphId+" sent: "+sentence.sentenceId);
				return bestSoFar;
			}
		}
	}
	return bestSoFar;
}

tts.retrieveAndPlaySentence = function(sentenceId) {

	$('#controller').show("fast");
	tts.currPlayingClipId = sentenceId;
	currentClip = new Audio();
	
	
	//Highlight:
	r = sentenceArray[sentenceId];
	tts.currPlayingRange = new ModifiedRange(false,0,"",r.startContainer, r.startOffset, r.endContainer, r.endOffset+2);
	tts.currPlayingRange.highlight("#50fc03");
	
	$("#readerPanel").scrollTop( 
			($("[data-sara-original="+r.startContainer+"]").offset().top + $("#readerPanel").scrollTop()) - ($("#readerPanel").height()/2)
	);
	
	//Piece together the text that should be spoken
	tts.textToSpeak = "";	
	$("[data-highlightgroup="+ tts.currPlayingRange.id +"]").each(function() {
	    try{	
		tts.textToSpeak += $(this).html();
	    }catch(err){}
	});
	
	console.log("SPEAK: "+tts.textToSpeak);
	
	var pieces = tts.textToSpeak.replace("iOS", "i OS").replace("\t", " ").replace("\r", " ").replace("\n", " ").replace("\0", " ").trim().split(" ");
	tts.textToSpeak = pieces[0];
	for(var i=1; i<pieces.length; i++)
		tts.textToSpeak += "+"+pieces[i].trim().replace("&gt;", "").replace("&lt;", "");
	
	//console.log(tts.textToSpeak);
	
	if( tts.textToSpeak.length > 100 ){
		var indexToSplit = 0;
		for(var i=0; i<100; i++){
			if( tts.textToSpeak.indexOf(",+", i) < 90 && tts.textToSpeak.indexOf(",+", i) > -1 )
				indexToSplit = i;
		}
		if( indexToSplit == 0 ){
			for(var i=0; i<100; i++){
				if( tts.textToSpeak.indexOf(",+", i) < 100 && tts.textToSpeak.indexOf(",+", i) > -1 )
					indexToSplit = i;
			}
		}
		if( indexToSplit == 0 ){
			for(var i=0; i<100; i++){
				if( tts.textToSpeak.indexOf(";+", i) < 100 && tts.textToSpeak.indexOf(";+", i) > -1 )
					indexToSplit = i;
			}
		}		
		if( indexToSplit == 0 ){
			for(var i=0; i<100; i++){
				if( tts.textToSpeak.indexOf(")+", i) < 100 && tts.textToSpeak.indexOf(")+", i) > -1 )
					indexToSplit = i;
			}
		}
		if( indexToSplit == 0 ){
			for(var i=0; i<100; i++){
				if( tts.textToSpeak.indexOf(":+", i) < 100 && tts.textToSpeak.indexOf(":+", i) > -1 )
					indexToSplit = i;
			}
		}		
		if( indexToSplit == 0 ){
			for(var i=0; i<100; i++){
				if( tts.textToSpeak.indexOf("+", i) < 100 && tts.textToSpeak.indexOf("+", i) > -1 )
					indexToSplit = i;
			}
		}		
		tts.leftOverToSpeak = tts.textToSpeak.substring(indexToSplit);
		tts.textToSpeak = tts.textToSpeak.substring(0,indexToSplit);
		
		//console.log("leftover: "+tts.leftOverToSpeak);
	}else{
		tts.leftOverToSpeak = "";
	}
		
	
	currentClip.src = "https://www.coglink.com:8080/CR/TTS?"+tts.textToSpeak;
	//console.log(currentClip.src);
	

	currentClip.addEventListener("loadeddata", function() {	

		//audio.stopPlaying();	// stops any playing audio notes
		currentClip.play();
		tts.doPlay = true;
		tts.currPlayingClip = currentClip;
		//console.log("Done");
	}, false);

	currentClip.load();
	
	currentClip.addEventListener("playing", function() {
		
		setTimeout("tts.checkAudio()", 1000);
		
		/* The ended event is not being called, so we loop to check fields.
		tts.currPlayingClip.addEventListener("ended", function() {
			//console.log("Ended");
			tts.currPlayingRange.unhighlight();
			tts.currPlayingClipId++;
			tts.retrieveAndPlaySentence(tts.currPlayingClipId);
		}, false);
		*/
	}, false);
	
}

tts.speakText = function(text){
	//pause what we are already playing
	if (tts.currPlayingClip) {
		tts.currPlayingClip.pause();
	}
	currentClip = new Audio();
	
	tts.textToSpeak = text;
	
	var pieces = tts.textToSpeak.replace("iOS", "i OS").replace("\t", " ").replace("\r", " ").replace("\n", " ").replace("\0", " ").trim().split(" ");
	tts.textToSpeak = pieces[0];
	for(var i=1; i<pieces.length; i++)
		tts.textToSpeak += "+"+pieces[i].trim().replace("&gt;", "").replace("&lt;", "");
	
	
	if( tts.textToSpeak.length > 100 ){
		var indexToSplit = 0;
		for(var i=0; i<100; i++){
			if( tts.textToSpeak.indexOf(",+", i) < 90 && tts.textToSpeak.indexOf(",+", i) > -1 )
				indexToSplit = i;
		}
		if( indexToSplit == 0 ){
			for(var i=0; i<100; i++){
				if( tts.textToSpeak.indexOf(",+", i) < 100 && tts.textToSpeak.indexOf(",+", i) > -1 )
					indexToSplit = i;
			}
		}
		if( indexToSplit == 0 ){
			for(var i=0; i<100; i++){
				if( tts.textToSpeak.indexOf(";+", i) < 100 && tts.textToSpeak.indexOf(";+", i) > -1 )
					indexToSplit = i;
			}
		}		
		if( indexToSplit == 0 ){
			for(var i=0; i<100; i++){
				if( tts.textToSpeak.indexOf(")+", i) < 100 && tts.textToSpeak.indexOf(")+", i) > -1 )
					indexToSplit = i;
			}
		}
		if( indexToSplit == 0 ){
			for(var i=0; i<100; i++){
				if( tts.textToSpeak.indexOf(":+", i) < 100 && tts.textToSpeak.indexOf(":+", i) > -1 )
					indexToSplit = i;
			}
		}		
		if( indexToSplit == 0 ){
			for(var i=0; i<100; i++){
				if( tts.textToSpeak.indexOf("+", i) < 100 && tts.textToSpeak.indexOf("+", i) > -1 )
					indexToSplit = i;
			}
		}		
		tts.leftOverToSpeak = tts.textToSpeak.substring(indexToSplit);
		tts.textToSpeak = tts.textToSpeak.substring(0,indexToSplit);
		
		//console.log("leftover: "+tts.leftOverToSpeak);
	}else{
		tts.leftOverToSpeak = "";
	}
	currentClip.src = "https://www.coglink.com:8080/CR/TTS?"+tts.textToSpeak;
	
	currentClip.addEventListener("loadeddata", function() {	

		//audio.stopPlaying();	// stops any playing audio notes
		currentClip.play();
		tts.doPlay = true;
		tts.currPlayingClip = currentClip;

		//console.log("Done");
	}, false);

	currentClip.load();
	
	tts.currPlayingClip = currentClip;
	// The ended event is not being called, so we loop to check fields.
	currentClip.addEventListener("playing", function() {
		
		setTimeout("tts.checkAudioForSingle()", 1000);
		
		/* The ended event is not being called, so we loop to check fields.
		tts.currPlayingClip.addEventListener("ended", function() {
			console.log("Ended");
			tts.currPlayingRange.unhighlight();
			tts.currPlayingClipId++;
			tts.retrieveAndPlaySentence(tts.currPlayingClipId);
		}, false);
		*/
	}, false);
	
}

tts.checkAudio = function(){
    
    if( tts.doPlay ){
	clip = tts.currPlayingClip;
	
	if( clip != null && clip.currentTime > 0 && clip.currentTime < 30 && !clip.paused && !clip.ended ){
		setTimeout("tts.checkAudio()", 200);
	}else{
		//console.log("Ended");
		
		if( tts.leftOverToSpeak == "" ){
			try{
				tts.currPlayingRange.unhighlight();
			}catch(err){}
			tts.currPlayingClipId++;
			tts.retrieveAndPlaySentence(tts.currPlayingClipId);
		}else{
			//console.log("Leftovers!");
		
			tts.playLeftovers();
		}
	}
    }
}
tts.checkAudioForSingle = function(){
    
    if( tts.doPlay ){
	clip = tts.currPlayingClip;
	
	if( clip != null && clip.currentTime > 0 && clip.currentTime < 30 && !clip.paused && !clip.ended ){
		setTimeout("tts.checkAudioForSingle()", 200);
	}else{
		//console.log("Ended");
		
		if( tts.leftOverToSpeak != "" ){
			tts.speakText(tts.leftOverToSpeak);
		}
	}
    }
}

tts.playLeftovers = function() {

	$('#controller').show("fast");
	currentClip = new Audio();
	
	
	//Piece together the text that should be spoken
	tts.textToSpeak = tts.leftOverToSpeak;	
	
	if( tts.textToSpeak.length > 100 ){
		var indexToSplit = 0;
		for(var i=0; i<100; i++){
			if( tts.textToSpeak.indexOf(",+", i) < 90 && tts.textToSpeak.indexOf(",+", i) > -1 )
				indexToSplit = i;
		}
		if( indexToSplit == 0 ){
			for(var i=0; i<100; i++){
				if( tts.textToSpeak.indexOf(",+", i) < 100 && tts.textToSpeak.indexOf(",+", i) > -1 )
					indexToSplit = i;
			}
		}
		if( indexToSplit == 0 ){
			for(var i=0; i<100; i++){
				if( tts.textToSpeak.indexOf(";+", i) < 100 && tts.textToSpeak.indexOf(";+", i) > -1 )
					indexToSplit = i;
			}
		}		
		if( indexToSplit == 0 ){
			for(var i=0; i<100; i++){
				if( tts.textToSpeak.indexOf(")+", i) < 100 && tts.textToSpeak.indexOf(")+", i) > -1 )
					indexToSplit = i;
			}
		}
		if( indexToSplit == 0 ){
			for(var i=0; i<100; i++){
				if( tts.textToSpeak.indexOf(":+", i) < 100 && tts.textToSpeak.indexOf(":+", i) > -1 )
					indexToSplit = i;
			}
		}			
		if( indexToSplit == 0 ){
			for(var i=0; i<100; i++){
				if( tts.textToSpeak.indexOf("+", i) < 100 && tts.textToSpeak.indexOf("+", i) > -1 )
					indexToSplit = i;
			}
		}			
		tts.leftOverToSpeak = tts.textToSpeak.substring(indexToSplit);
		tts.textToSpeak = tts.textToSpeak.substring(0,indexToSplit);
		
		//console.log("leftover: "+tts.leftOverToSpeak);
	}else{
		tts.leftOverToSpeak = "";
	}
		
	
	currentClip.src = "https://www.coglink.com:8080/CR/TTS?"+tts.textToSpeak;
	//console.log(currentClip.src);
	

	currentClip.addEventListener("loadeddata", function() {	

		currentClip.play();
		tts.doPlay = true;
		tts.currPlayingClip = currentClip;

		//console.log("Done");
	}, false);

	currentClip.load();
	
	currentClip.addEventListener("playing", function() {
		
		setTimeout("tts.checkAudio()", 1000);
		
	}, false);
	
}



/*
 * all function below are for responding to button presses in and manipulating
 * appearance of the TTS controller widget.
 */ 
 
/*
 * when the user first loads the reader, TTS is inactive. The user has to press the
 * speaker icon in the widget to enable TTS.
 */
tts.enterSelectMode = function() {
	tts.selectMode = true;
}


tts.stopPlaying = function() {
	tts.doPlay = false;
	if (tts.currPlayingClip) {
		tts.currPlayingClip.pause();
		tts.currPlayingClip = null;
	}
	if (tts.currPlayingRange) {
		tts.currPlayingRange.unhighlight();
		tts.currPlayingRange = null;
	}
	tts.selectMode = false;
}
