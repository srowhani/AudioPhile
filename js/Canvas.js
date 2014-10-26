define(function(){
	'use strict';
	var NUMGRADIENTS = 2;

    var _canvas,
    	_context,
    	_gradients=[];

    var _player;

    var update = function(){
	        _player.getAnalyser().getByteFrequencyData(_player.getFrequency());
	        var count = 0;
	        for(var i = 0 ; i < 10 ; i++) 
	            count += _player.getFrequency()[i];
	        _context.fillStyle = count < 2200 ? _gradients[0] : _gradients[1]
	        _context.clearRect(0, 0, _canvas.width, _canvas.height);

	        for(var i = 0 ; i < _player.getFrequency().length ; i++) 
	            _context.fillRect(i*5, 
	            				  _canvas.height,
	            				  3,
	            				  -0.5*_player.getFrequency()[i]
	            				 ); // x pos, y pos, width, height
	        window.requestAnimationFrame(update) //animate that shit

    }
    
 
    
    return {
    	init: function(player){
    		_canvas  = document.getElementById('visualize');
        	_context = _canvas.getContext('2d');
        	for(var i = 0 ; i < NUMGRADIENTS; i++){
         		_gradients[i] = _context.createLinearGradient(0,0,0,_canvas.height);
        		for(var k = 1, j = 0, m = 4; j < 5; k-=.25, j++, m--)
            		_gradients[i].addColorStop(k, ["#000000", "#ff0000", "#fff000", "#ffff00", "#fffff0"][(i===0) ? j : m])
        	}
        	_player = player;
        	return this;
    	},
    	getContext: function(){
    		return _context;
    	},
    	update : update
    }
});