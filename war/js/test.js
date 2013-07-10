		<script type="text/template" id="buttonTemplate">
			<div class="button" id="{targetWindow}_button" onclick="switchVisibility('{targetWindow}')">
				<br>{buttonText}
			</div>
			<br>
		</script>



			ButtonView = Backbone.View.extend({
				initialize: function() {
					this.render();
				},
				render: function() {
					var questionTemplate = _.template( 
						$("#buttonTemplate").html().replace(/{targetWindow}/g, this.options.windowName
						).replace(/{buttonText}/g, this.options.windowName.replace(/Window/g, '')), {} 
						);
					this.$el.append(questionTemplate);
				}
			});