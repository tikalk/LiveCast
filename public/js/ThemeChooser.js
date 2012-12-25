// Allows to switch color themes to code mirror editor
var ThemeChooser = Backbone.View.extend({

	el: '#theme-chooser',

	events: {
		'click .dropdown-menu a' : 'chooseTheme'
	},

	chooseTheme: function(ev) {
		ev.preventDefault();
		var theme = $(ev.target).html();
		Backbone.trigger('theme-changed', theme);
	} 

});
var themeChooser = new ThemeChooser();