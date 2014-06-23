var MusicPlayer = function(){
    var self = this;
    var songQueue = [];
    var isPlaying = false;
    //Audio Utilities
    var context, source, analyser, freq;
    //Canvas utilities
    var canvas,ctx,g1,g2;

    /**
    * Anonymous Functions
    */
    var update = function(){
        var WIDTH = canvas.width,
            HEIGHT = canvas.height;
        analyser.getByteFrequencyData(freq);
        var count = 0;
        for(var i = 0 ; i < 10 ; i++) 
            count += freq[i];
        ctx.fillStyle = count < 2200 ? g1 : g2
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        for(var i = 0 ; i < freq.length ; i++) 
            ctx.fillRect(i*5+2, HEIGHT , 3, (HEIGHT - (freq[i]+40))); // x pos, y pos, width, height
        if(isPlaying) window.requestAnimationFrame(update) //animate that shit
    }

    var loadTracks = function(songs){
        var reader = new FileReader();
        var index = 0;
        app.songs = songs;
        reader.addEventListener('loadend', function(e){
            songQueue.push(e.target.result);
            index < songs.length ? reader.readAsDataURL(songs[index++]) : self.play(songQueue.length-1);
        }, false);
        reader.readAsDataURL(songs[index++]);

    }

    var attachListeners = function(){
        ['over', 'end', ''].forEach(function(e){document['ondrag' + e] = function(){return false}});
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
        ['ended', 'pause'].forEach(function(e){
            player.addEventListener(e, function(){
                isPlaying = false;
            }, false);
        });
    }
    
    MusicPlayer.prototype.queue = function(index){
        player.src = index === undefined ? songQueue[0] : songQueue[index];
    }
    MusicPlayer.prototype.play = function(index){
        if(!songQueue.length) 
            throw new Error('No song available');
        this.queue(index);
        player.play();
        update();
    }
    MusicPlayer.prototype.shuffle = function(){
        this.play(Math.floor(Math.random()*songQueue.length));
        player.onended = function(){self.shuffle()};
    }
    MusicPlayer.prototype.pause = function(){
        player.pause();
    }
    MusicPlayer.prototype.init = function(){
        //--> Audio Components
        context =   new window.AudioContext()       || 
                    new window.webkitAudioContext() || 
                    new window.mozAudioContext()    || 
                    new window.oAudioContext()      || 
                    new window.msAudioContext();

        source = context.createMediaElementSource(player);
        analyser = context.createAnalyser();
        freq = new Uint8Array(64);
        source.connect(analyser); 
        analyser.connect(context.destination); // connect the freq analyzer to the output

        //--> Canvas Components
        canvas = document.getElementById('visualize');
        ctx = canvas.getContext('2d');
        g1= ctx.createLinearGradient(0,0,0,canvas.height);

        for(var i = 1, j = 0 ; i >= 0 && j < 5; i-=.25, j++)
            g1.addColorStop(i, '#000000,#ff0000,#fff000,#ffff00,#ffff00'.split(',')[j])
        g2= ctx.createLinearGradient(0,0,0,canvas.height);
        for(var i = 1, j = 0 ; i >= 0 && j < 5; i-=.25, j++)
            g2.addColorStop(i, '#000000,#0000ff,#000fff,#00ffff,#0fffff'.split(',')[j])
   
        attachListeners();
        return this;
    }
    MusicPlayer.prototype.getContext = function(){return context};
    MusicPlayer.prototype.getSource = function(){return source};
    MusicPlayer.prototype.getQueue = function(){return songQueue};

}//END AUDIOAPP

var music;
window.addEventListener('load', function(){
    music = new MusicPlayer().init();
}, false);
