$(document).ready(function() {
	var div = "#" + $('#user').text();

	$(div).css("padding", "5px");
	$(div).css("height", "auto");
	$(div).css("height", "auto");
	$(div).css("background-color", "#DDD")
	$('table').css("height", "675px"); 

	$(div).accordion();

	
	var emails = $('#emails').text().split(',');
	var emailsraw = $('#emailsraw').text().split(',');

	for (i = 0; i < emails.length; i++) {
		$('#groupusers').html($('#groupusers').html() + "<div id=" + emails[i] + "><a href=# onclick=\"hideDivs('#content_" + emails[i] + "');\">" + emailsraw[i] + "</a></div>");	
		$('#' + emails[i]).html($('#' + emails[i]).html() + "<div id=content_" + emails[i] +"></div>");
		$('#' + emails[i]).css("padding", "5px");
		$('#' + emails[i]).css("height", "auto");
		$('#content_' + emails[i]).css("height", "auto");
		$('#content_' + emails[i]).css("display", "none");
		$('#' + emails[i]).css("background-color", "#DDD");
		getUserLibrariesWithParams(emailsraw[i], '#content_' + emails[i]);
	}
});

// for replacing spelling/grammar errors and disabling the click event for them
function replaceWithCorrection(errorIndex, correctionText) {
	$('#grammar_error_' + errorIndex).text(correctionText);
	$('#grammar_error_' + errorIndex).attr('onclick','').unbind('click');
}

// hide all highlight/notes divs and show one
function hideDivs(showDiv) {
	var contentDivs = $("div[id^='content_']").css("display", "none");
	$(showDiv).css("display", "inline");
}

// strip formatting from the textarea div
function stripFormHTML(divToStrip) {
	$(divToStrip).html($(divToStrip).text()).show();
}

// strip html from selection
function stripHTML() {
	document.execCommand('removeFormat', null, false);
}

// bold selected text
function boldText() {
	document.execCommand('bold', null, false);
}

// italicize the selected text
function italicText() {
	document.execCommand('italic', null, false);
}

function submitForm() {
	$("#text_input").html($("#textinput").text()); 
	if ($("#email_input").val() != "") {
		if ($("#emailsraw").text() != "") { 
			$("#email_input").val($("#emailsraw").text() + ',' + $("#email_input").val());
		} else {
			$("#email_input").val($("#email_input").val());
		}
	} else {
		$("#email_input").val($("#emailsraw").text());
	}
		/*
	$.post("prefs", $("dataform").serialize())
			.done(function(data) {
  			alert("document saved");
		});
	*/
	 $("#dataform").submit();
}

function showGrammarCorrection(index, suggestion, event) {
	$('#grammar_check_error_' + index + '_corrections').append('<a href=# onclick=\' correctText("#grammar_error_' + index + '","' + suggestion + '","' + '#grammar_check_error_' + index + '_corrections' + '");\'>"' + suggestion + '"</a>');
	$('#grammar_check_error_' + index + '_corrections').css( { 'position': 'absolute', 'top': event.pageY, 'left': event.pageX, 'z-index': 100, 'border-style' : 'solid', 'border-width' : '1px', 'background-color' : '#c7c7c7' } ); 
}

// replace incorrect text with correction, and hide the suggestion div
function correctText(div, correction, correctionLink) {
	$(div).text(correction);
	$(correctionLink).hide(); 
}

/*
$('#grammar_check_error_" + ruleMatchCount + "_corrections').append('<br><a href=# onclick=\\' $(\\'#grammar_error_" + ruleMatchCount + "\\').text(\\'" + suggestion + "\\')\\'>" + suggestion + "</a>');

function(event) {  $('#grammar_check_error_" + ruleMatchCount + "_corrections').css( {position:\\'absolute\\', top:event.pageY, left: event.pageX}); } ";
          


*/

// function stripHTML(){
// 	selection = window.getSelection();
// 	strippedText = selection.toString.html(selection.toString.text());
// 	range = selection.getRangeAt(0);

// }

// gets the list of user libraries and displays them
function getUserLibraries(div) {
	console.log(div);
	$(div).text('');
	var email = $("#in").val(); 
	$.getJSON('http://campusreader-pilot.appspot.com/getUserLibrariesAPI?email=' + email, function(result) {
		$(div).append('<h1>User Libraries:</h1>').show();
		$.each(result, function(i, item) {
			$(div).append('<h3><a style=\'text-decoration: underline;\' onclick=\'getLibraryContent(\"' + email + '\",\"' + item.id + '\",\"' + item.title + '\",\"' + div + '\");\'>'+ item.title + "</a></h3>").show();
			/*
			$(div).append('<br>ID: <a style=\'text-decoration: underline;\' onclick=\'getLibraryContent(\"' + email + '\",' + item.id + ');\'>'+ item.id + "</a>").show();
			$(div).append('<br>Title: ' + item.title).show();
			$(div).append('<br>Description: ' + item.description).show();
			$(div).append('<br>Type: ' + item.type).show();
			*/
		});
	});
}

// gets list of user libraries for an email address
function getUserLibrariesWithParams(email, div) {
	$(div).text('');
	$.getJSON('http://campusreader-pilot.appspot.com/getUserLibrariesAPI?email=' + email, function(result) {
		$(div).append('<h1>User Libraries:</h1>').show();
		$.each(result, function(i, item) {
			$(div).append('<h3><a style=\'text-decoration: underline;\' onclick=\'getLibraryContent(\"' + email + '\",\"' + item.id + '\",\"' + item.title + '\",\"' + div + '\");\'>'+ item.title + "</a></h3>").show();
			/*
			$(div).append('<br><a style=\'text-decoration: underline;\' onclick=\'getLibraryContent(\"' + email + '\",' + item.id + ');\'>'+ item.id + "</a>").show();
			$(div).append('<br>Title: ' + item.title).show();
			$(div).append('<br>Description: ' + item.description).show();
			$(div).append('<br>Type: ' + item.type).show();
			*/
		});
	});
}

// gets the content of a selected library by email address and library id
// should probably be called from one of the getUserLibraries methods
function getLibraryContent(email, libraryId, libraryName, div) {
	$(div).text('');
	$(div).append('<a style=\'text-decoration: underline;\' onclick=\'getUserLibrariesWithParams(\"' + email + '\",\"' + div + '\");\'>'+ 'back' + "</a>").show();
	
	$.getJSON('http://campusreader-pilot.appspot.com/getLibraryContentAPI?libraryID=' + libraryId, function(result) {
		$(div).append('<h1>' + libraryName + ' </h1>').show();
		$.each(result, function(i, item) {
			$(div).append('<h3><a style=\'text-decoration: underline;\' onclick=\'getNotebookData(\"' + email + '\",' + libraryId + ',\"' + libraryName + '\",' + item.id + ',\"' + div + '\");\'>'+ item.title + "</a><br>" + item.description + "</h3>").show();
			/*
			$(div).append('<br>ID: <a style=\'text-decoration: underline;\' onclick=\'getNotebookData(\"' + email + '\",' + libraryId + ',' + item.id + ');\'>'+ item.id + "</a>").show();
			$(div).append('<br>Title: ' + item.title).show();
			$(div).append('<br>Description: ' + item.description).show();
			$(div).append('<br>Type: ' + item.type).show();
			*/
		});
	});
}

// gets a notebook by an email, libraryid, and contentid
// assumes that texttospeech.js is loaded for speaking the text in these fields
function getNotebookData(email, libraryId, libraryName, contentId, div) {
	$(div).text('');
	var url = 'http://campusreader-pilot.appspot.com/getNotebookDataAPI?email=' + email + '&libraryID=' + libraryId + '&contentID=' + contentId;
	$(div).append('<a style=\'text-decoration: underline;\' onclick=\'getLibraryContent(\"' + email + '\",\"' + libraryId + '\",\"' + libraryName + '\",\"' + div + '\");\'>'+ 'back' + "</a>").show();
			
	$.getJSON(url, function(result) {
		count = 0;
		$.each(result, function(i, item) {
			stringBuilder = "";
			displayNotebookData = false;

			// $(div).append('<br>Section summary: ' + item.secsummary).show();
			stringBuilder += '<h1>Section Name: ' + item.name + '</h1>';
			
			
			$.each(item.notes, function(j, nestedItem) {
				// stringBuilder += '<div id=\"note_' + count + '\" onclick=\"appendNoteText(note_' + count + ', ' + nestedItem.instructorNote + ', true);\">' + nestedItem.text + '</div><br>';
				// stringBuilder += '<br>&nbsp;&nbsp;Instructor note: ' + nestedItem.instructorNote;

				style = "";

				// looking at notes
				if (nestedItem.instructorNote) {
					style = 'style="background-color: #F0B2B2;"';
				}
				else {
					style = 'style="background-color: #FFFF85;"';
				}

				stringBuilder += '<div style=\"border-style: solid; border-width: 1px;\"><div ' + style + ' id=\"note_' + count + '\">' + nestedItem.text + '</div><br>';
				stringBuilder += '<a onclick=\'tts.speakText($(\"#note_' + count + '\").text());\'>Listen</a>';
				stringBuilder += '&nbsp;|&nbsp; <a onclick=\"$(\'#note_' + count + '\').attr(\'contentEditable\',\'true\');\">Edit Note</a>';
				stringBuilder += '&nbsp|&nbsp; <a onclick=\"appendNoteText(note_' + count + ', ' + nestedItem.instructorNote + ', true);\">Insert Into Text</a><br></div><br>';
				if (nestedItem.text != "") {
					displayNotebookData = true;
				}
				count++;
			});
			
			count = 0;

			// looking at highlights
			$.each(item.highlights, function(k, nestedItem) {
				// stringBuilder += '<br>&nbsp;&nbsp;Instructor highlight: ' + nestedItem.instructorHighlight).show();

				style = "";
				if (nestedItem.instructorHighlight) {
					style = 'style="background-color: #ADC2FF;"';
				}
				else {
					style = 'style="background-color: #B2FFFF;"';
				}

				stringBuilder += '<div style=\"border-style: solid; border-width: 1px;\"><div ' + style + ' id=\"highlight_' + count + '\">' + nestedItem.text + '</div><br>';
				stringBuilder += '<a onclick=\'tts.speakText($(\"#highlight_' + count + '\").text());\'>Listen</a>';
				stringBuilder += '&nbsp;|&nbsp; <a onclick=\"$(\'#highlight_' + count + '\').attr(\'contentEditable\',\'true\');\">Edit Highlight</a>';
				stringBuilder += '&nbsp|&nbsp; <a onclick=\"appendNoteText(highlight_' + count + ', ' + nestedItem.instructorHighlight + ', false);\">Insert Into Text</a><br></div><br>';
				if (nestedItem.text != "") {
					displayNotebookData = true;
				}
				count++;
			});	

			if (displayNotebookData) {
				$(div).append(stringBuilder);
			}
			

		});
	})
	.error(function(jqXHR, textStatus, errorThrown) { 
		console.log("error: " + textStatus + " error thrown: " + errorThrown + " jqXHR: " + jqXHR); 
	});
}

// appends a note or highlight to the div (first arg)
function appendNoteText(div, instructor, note) {
	text = $(div).text();
	
	if (instructor && note) { 
		text = '<p style="background-color: #F0B2B2;">' + text + '</p>';
	}
	else if (instructor && !note) {
		text = '<p style="background-color: #ADC2FF;">' + text + '</p>';
	}
	else if (!instructor && note) {
		text = '<p style="background-color: #FFFF85;">' + text + '</p>';
	}
	else if (!instructor && !note) {
		text = '<p style="background-color: #B2FFFF;">' + text + '</p>';
	}
	
	$('#textinput').append(text).show();
}





// appendNoteText("highlight_0");




