
function sendAjax() {
$.ajax({
	type: 'POST',
	url: 'http://campuswriteruo.appspot.com/campuswriteruo',
	data: { "variable" : cache.note},
	dataType: "json",
	crossDomain: true,
	cache: false,
	success: function (data) {
		console.log(data.variable + " SUCCESS ");
		//$("#output").text( data.variable );
	},
	fail: function (){console.log("FAILURE")}
});}

