var QuotesView = Backbone.View.extend({
    initialize: function () {
        this.render();
    },
	
	render: function() {
		var quoteTemplate = _.template( 
			$("#quoteTemplate").html().replace(/{quote}/g, this.options.quotesName
			).replace(/{quoteName}/g, this.options.quotesName).replace(/{quoteText}/g, this.options.text), {} 
			);
		this.$el.append(quoteTemplate);
	}
});

$(document).ready(function(){
	var quotes = new Backbone.Model({
		data: [ {text:"However many holy words you read, however many you speak, what good will they do you if you do not act on upon them?",name:"Buddha"},
				{text:"The whole secret of existence is to have no fear. Never fear what will become of you, depend on no one. Only the moment you reject all help are you freed.",name:"Buddha"},
				{text:"Just as a candle cannot burn without fire, men cannot live without a spiritual life.",name:"Buddha"},
				{text:"The mind is everything. What you think you become.",name:"Buddha"} ]
	});
	
	console.log(quotes.get("data").length);
	
	for (i=0;i< quotes.get("data").length;i++){
		console.log(quotes.get("data")[i].name);
		console.log(quotes.get("data")[i].text);
		new QuotesView({ el: $("#right"), quotesName:  quotes.get("data")[i].name, text: quotes.get("data")[i].text});
	}
	

	
	$(function() {
		$( "#right" ).accordion();
	});

});

