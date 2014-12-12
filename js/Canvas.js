define(function(){
	'use strict';
    var _canvas,
    	_context,
    	_gradient,_gradient2;

    var _player;

    var update = function(){
        if (!_player.isPlaying) return;
        _player.getAnalyser().getByteFrequencyData(_player.getFrequency());
        _context.clearRect(0, 0, _canvas.width, _canvas.height);
        var sum = 0;
	for(var i = 0  ; i < 4 ; i++, sum+= _player.getFrequency()[i])
		context.fillStyle = sum > 700 ? _gradient : _gradient2;
        for(var i = 0 ; i < _player.getFrequency().length ; i++) {
            _context.fillRect(i*5, 
            		_canvas.height,
            		3,
            		-0.5*_player.getFrequency()[i]
            		); // x pos, y pos, width, height
        }
        window.setTimeout(function(){
        	window.requestAnimationFrame(update)
        }, 1000/30)
        //animate that shit

    }
    
 
    
    return {
    	init: function(player){
    		_canvas  = document.getElementById('visualize');
        	_context = _canvas.getContext('2d');
         		_gradient = _context.createLinearGradient(0,0,0,_canvas.height);
         		_gradient2 = _context.createLinearGradient(0,0,0,_canvas.height);

        		for(var j = 0, k = 1 ; j < 5 ; k-=.25, j++){
            			_gradient.addColorStop(k, ["#000000", "#ff0000", "#fff000", "#ffff00", "#fffff0"][j])
            			_gradient2.addColorStop(k, '#000000,#0000ff,#000fff,#00ffff,#0fffff'.split(',')[j])
        		}
            _context.fillStyle = _gradient;
        	_player = player;
        	return this;
    	},
    	getContext: function(){
    		return _context;
    	},
    	update : update
    }
});
