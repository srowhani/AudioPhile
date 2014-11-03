define(function(require){
	'use strict';
	return {
		init: function(u,p,c){
			p = p.init();
			u.init(p,c.init(p));
		}		
	}
})
