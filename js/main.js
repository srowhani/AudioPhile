require(['app', 'Utils', 'Player','Canvas'], function(a,u,p,c){
	if(/chrome/.test(window.navigator.userAgent.toLowerCase())){
		a.init(u,p,c);
		window.music = p;
		return;
	}
	document.writeln("Sorry, only working in Chrome");
	document.writeln("(For now) Shh....");
	return;	
});
