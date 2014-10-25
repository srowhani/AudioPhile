
require.config({

});
require(['app', "lib/angular.min", 'Utils', 'Player'], function(app){
	app.init();
	window.app = app;
})