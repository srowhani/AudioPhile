require.config({

});
require(['app', 'Utils', 'Player'], function(app){
	app.init();
	window.app = app;
})
