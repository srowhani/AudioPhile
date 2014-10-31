define(function(require){
	'use strict';
	return {
		init: function(u,p,c){
			u.init(p.init(),c.init(p));
		}		
	}
})