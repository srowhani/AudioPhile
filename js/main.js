require(['app', 'Utils', 'Player','Canvas'], function(a,u,p,c){
	window.addEventListener('load', function(e){
		if(/chrome/.test(window.navigator.userAgent.toLowerCase())){
			a.init(u,p,c);
			return;
		}
		document.writeln("Sorry, only working in Chrome");
		document.writeln("(For now) Shh....");
		return;	
	});
	
});
