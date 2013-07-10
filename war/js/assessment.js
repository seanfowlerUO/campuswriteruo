var date = new Date();

var count = 30;
var assessmentVisible = false;
var countDownView;
var assessmentView;


var countDown =
    "<div id='countdown' " +
        "style='" +
            "padding: 2px;'" +
    "></div>";
    
var moreTime = 
	"<a href='#' " +
		"onclick='addTimeBeforeAssessment();'>" +
		"Add 30 seconds" +
	"</a> &nbsp; &nbsp;";
	
Assessment = Backbone.Model.extend({
    initialize: function () {
        console.log("start self assessment at " + date.getTime());

    }
});

/*
assessmentModel = new Backbone.Model({
    data: [
        { name: "something", value: "something", text: "assessment question" },
        { name: "something1", value: "something1", text: "assessment question1" },
        { name: "something2", value: "something2", text: "assessment question2" }
    ]
});*/

var assessmentModel = new Backbone.Model({    data: [ {text:"Is this a question?"},{text:"yes",name:"yes",value:"yes"},{text:"no",name:"no",value:"no"},{text:"maybe",name:"maybe",value:"maybe"} ]});


var CountDownView = Backbone.View.extend({
    initialize: function() {
        console.log("countdown initialized");
        this.render();
    },
    el: '#count',
    render: function() {
        console.log("rendering countdown view");

        this.$el.append(countDown);
        window.setInterval(function() {
            
            if (count == 0) {
                if (!assessmentVisible) {
                	$('#countdown').html("Please complete self assessment");
                    $(":checkbox").attr("checked", false);
                    $(":checkbox").click(function() {
                    	writeToDataStoreAndHide();
                    });
                    $('#assessmentContainer').toggle();
                    assessmentVisible = true;
                    
                           PlaySound("sound1");

                }
            } else {
            	$('#countdown').html(moreTime + count + " seconds remaining before self assessment.");
                count--;
            }
        }, 1000);
        return this;
    }
});

var AssessmentView = Backbone.View.extend({
    initialize: function () {
        console.log("assessment added to page");
        this.template = $('#assessment-template').children();
        this.render();
    },
    el: '#assessmentContainer',
    model: assessmentModel,
    render: function() {
        console.log("rendering assessment view");
        var data = this.model.get('data');

        for (var i = 0; i < data.length; i++) {
        	var div = null;
        	if (data[i].name != null) {
            	div = this.template.clone().find('input').attr({
                	'name': data[i].name,
                	'value': data[i].value
            	}).end().append(data[i].text);
            } else {
            	div = "<br />" + data[i].text + "<br />";
            }
            this.$el.find('form').append(div);
        }
        return this;
    }
});

$(document).ready(function(){
    countDownView = new CountDownView({});
    assessmentView = new AssessmentView({});
});

function writeToDataStoreAndHide() {
    count = 30;
    assessmentVisible = false;

    var checkboxValue = $('input.test[type="checkbox"]:checked', this).val();

    console.log(checkboxValue);
    
    $.post('PostAssessment', { text: checkboxValue });
    $('#assessmentContainer').toggle();
}

function PlaySound(soundObj) {
    var sound = document.getElementById(soundObj);
    sound.Play();
}

function addTimeBeforeAssessment() {
	count = count + 30;
	$('#countdown').html(moreTime + count + " seconds remaining before self assessment.");
}