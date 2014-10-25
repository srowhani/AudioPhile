define(function(){
	'use strict';
	var NUMGRADIENTS = 2;

    var _canvas,
    	_context,
    	_gradients=[],
    	_isPlaying=false;
	(function init(){
			_canvas  = document.getElementById('visualize');
        	_context = _canvas.getContext('2d');
        	_isPlaying = false;
        	for(var i = 0 ; i < NUMGRADIENTS; i++){
         		_gradients[i] = _context.createLinearGradient(0,0,0,_canvas.height);
        		for(var k = 1, j = 0, m = 4; j < 5; k-=.25, j++, m--)
            		_gradients[i].addColorStop(k, ["#000000", "#ff0000", "#fff000", "#ffff00", "#fffff0"][(i===0) ? j : m])
        	}
	})();	 
    
    return {

    	getContext: function(){
    		return _context;
    	},
    	stopPlayback : function(){
    		_isPlaying = false;
    	},
    	startPlayback : function(){
    		_isPlaying = true;
    	},
    	update : function(_freq){
	        _analyser.getByteFrequencyData(_freq);
	        var count = 0;
	        for(var i = 0 ; i < 10 ; i++) 
	            count += _freq[i];
	        _context.fillStyle = count < 2200 ? g1 : g2
	        _context.clearRect(0, 0, _canvas.width, _canvas.height);

	        for(var i = 0 ; i < freq.length ; i++) 
	            _context.fillRect(i*5, 
	            				  _canvas.height,
	            				  3,
	            				  (_canvas.height - (freq[i]))
	            				 ); // x pos, y pos, width, height
	        if(_isPlaying)
	        	window.requestAnimationFrame(this.update) //animate that shit
    	}
    }
});