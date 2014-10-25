define(function(){
	
    return {
    	init : function(_player, _canvas){
	        ['over', 'end', ''].forEach(function(e){
	        	songlist['ondrag' + e] = function(){
	        		return false
	        	}
	        });
	        songlist.ondrop = function(e){
		        e.preventDefault(); 
		       	_player.loadTracks(e.dataTransfer.files);
	        };

	        document.addEventListener('keydown', function(e){
	            switch(e.which){
	                case 32:
	                    _player.isPlaying ? player.pause() : player.play();
	                    break;
	                default:
	                    break;
	            }
	        }, false);

	        player.addEventListener('play', function(){
	            isPlaying = true;
	            _canvas.update(_player.getAnalyser());
	        }, false);
	        ['ended', 'pause'].forEach(function(e){
	            player.addEventListener(e, function(){
	                isPlaying = false;
	            }, false);
	        });
	        console.log("Events properly attatched");
	    }
    };
});