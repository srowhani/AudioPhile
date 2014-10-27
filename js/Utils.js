define(function(){
	
    return {
    	init : function(_player, _canvas){
	        ['over', 'end', ''].forEach(function(e){
	        	songlist['ondrag' + e] = function(){
	        		this.setAttribute('class', 'drag');
	        		return false
	        	}
	        });
	        songlist['ondragleave'] = function(){
	        	this.removeAttribute('class');
	        }
	        songlist['ondrop'] = function(e){
	        	this.removeAttribute('class');
		        e.preventDefault(); 
		       	_player.loadTracks(e.dataTransfer.files);
	        };

	        document.addEventListener('keydown', function(e){
	            switch(e.which){
	                case 32:
	                    _player.isPlaying ? document.getElementById('player').pause() : 
	                    					document.getElementById('player').play();

	                    break;
	                default:
	                    break;
	            }
	        }, false);

	        player.addEventListener('play', function(){
	            _player.isPlaying = true;
	            _canvas.update(_player.getAnalyser());
	        }, false);

	        ['ended', 'pause'].forEach(function(e){
	            player.addEventListener(e, function(){
	                _player.isPlaying = false;
	            }, false);
	        });
	    }
    };
});