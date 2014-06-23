var app = angular.module('app',[]);
	app.controller('ctrl', function($scope){
		$scope.songs = [1,2,3];
	});
app.musicPlayer = function(){
	var self = this;
	var songQueue = [];
	var isPlaying = false;

	var player = document.getElementById('player');
	
	var context = 	new window.AudioContext()		|| 
  					new	window.webkitAudioContext() || 
					new window.mozAudioContext()	|| 
					new window.oAudioContext() 		|| 
					new window.msAudioContext();

	var source = context.createMediaElementSource(player);
	var analyser = context.createAnalyser();
	var freq = new Uint8Array(64);


	var canvas  = document.getElementById('visualize');
	var ctx = canvas.getContext('2d');

	source.connect(analyser); 
	analyser.connect(context.destination); // connect the freq analyzer to the output

	var gradient1 = ctx.createLinearGradient(0,0,0,canvas.height);
    gradient1.addColorStop(1,'#000000');
    gradient1.addColorStop(0.75,'#ff0000');
    gradient1.addColorStop(0.5,'#fff000');
    gradient1.addColorStop(0.25,'#ffff00');
    gradient1.addColorStop(0,'#ffff00');

    var gradient2 = ctx.createLinearGradient(0,0,0,canvas.height);
    gradient2.addColorStop(1,'#000000');
    gradient2.addColorStop(0.75,'#0000ff');
    gradient2.addColorStop(0.5,'#000fff');
    gradient2.addColorStop(0.25,'#00ffff');
    gradient2.addColorStop(0,'#ffffff');
   
	var update = function(){
		var WIDTH = canvas.width,
			HEIGHT = canvas.height;
		analyser.getByteFrequencyData(freq);
		var count = 0;
		for(var i = 0 ; i < 10 ; i++) count += freq[i];
		
		if(count > 2200) ctx.fillStyle = gradient2; //2200 is an arbitrary number that shows bass
		else ctx.fillStyle = gradient1;    

		ctx.clearRect(0, 0, WIDTH, HEIGHT);
		for(var i = 0 ; i < freq.length ; i++){
			ctx.fillRect(i*5+2, HEIGHT , 3, (HEIGHT - (freq[i]+40))); // x pos, y pos, width, height
		}
		if(isPlaying) window.requestAnimationFrame(update) //animate that shit
	}

	var loadTracks = function(songs){
		var reader = new FileReader();
		var index = 0;
		app.songs = songs;
		reader.addEventListener('loadend', function(e){
			songQueue.push(e.target.result);
			if(index < songs.length) reader.readAsDataURL(songs[index++]);
			else self.play(songQueue.length-1);
		}, false);
		reader.readAsDataURL(songs[index++]);

	}
	MusicPlayer.prototype.queue = function(index){
		player.src = index === undefined ? songQueue[0] : songQueue[index];
	}
	MusicPlayer.prototype.play = function(index){
		if(!songQueue.length) return console.trace('No songs in queue');
		this.queue(index);
		player.play();
		isPlaying = true;
		update();
	}
	MusicPlayer.prototype.shuffle = function(){
		var self = this;
		this.play(Math.floor(Math.random()*songQueue.length));
		player.onended = function(){self.shuffle()};
	}
	MusicPlayer.prototype.pause = function(){
		player.pause();
	}
	MusicPlayer.prototype.init = function(){
		attachListeners();
		return this;
	}
	MusicPlayer.prototype.getContext = function(){return context};
	MusicPlayer.prototype.getSource = function(){return source};
	MusicPlayer.prototype.getQueue = function(){return songQueue};

	var attachListeners = function(){
		'dragover;dragend;drag'.split(';').forEach(function(e){document['on' + e] = function(){return false}});
		document.ondrop = function(e){
			e.preventDefault(); 
			loadTracks(e.dataTransfer.files);
		};

		document.addEventListener('keydown', function(e){
			switch(e.which){
				case 32:
					isPlaying ? player.pause() : player.play();
					break;
				default:
					break;
			}
			//console.log(e.which);
		}, false);

		player.addEventListener('play', function(){
			isPlaying = true;
			window.requestAnimationFrame(update);
		}, false);
		player.addEventListener('ended', function(){
			isPlaying = false;
		}, false);
		player.addEventListener('pause', function(){
			isPlaying = false;
		}, false);
	}
	

}//END AUDIOAPP