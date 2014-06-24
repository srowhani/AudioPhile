/**
 * Description
 * @method MusicPlayer
 * @return 
 */
var MusicPlayer = function(){
    /*==============================================================
    * Anonymous Variables
    ==============================================================*/
    var self = this;
    var songQueue = [];
    var isPlaying = false;
    //Audio Utilities
    var context, source, analyser, freq;

    var Song = function(file, dataurl){
        this.file = file;
        this.dataurl = dataurl;
    }
    //Canvas utilities
    var canvas,ctx,g1,g2;

    /*==============================================================
    * Anonymous Functions
    ==============================================================*/

    /**
     *  Updates the canvas
     *  Sums the first 10 elements of the frequency data to determine bass levels
     *  Clears canvas, and repaints each of the 64 bars.
     * @method update
     * @return 
     */
    var update = function(){
        analyser.getByteFrequencyData(freq);
        var count = 0;
        for(var i = 0 ; i < 10 ; i++) 
            count += freq[i];
        ctx.fillStyle = count < 2200 ? g1 : g2
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(var i = 0 ; i < freq.length ; i++) 
            ctx.fillRect(i*5+2, canvas.height , 3, (canvas.height - (freq[i]+40))); // x pos, y pos, width, height
        //if(isPlaying) window.requestAnimationFrame(update) //animate that shit
    }

    /**
     * Description
     * @method loadTracks
     * @param {} songs
     * @return 
     */
    var loadTracks = function(songs){
        var reader = new FileReader();
        var index = 0;
        reader.addEventListener('loadend', function(e){
            songQueue.push(new Song(songs[index], e.target.result));
            ++index < songs.length ? reader.readAsDataURL(songs[index]) : toLibrary(songQueue);
        }, false);
        reader.readAsDataURL(songs[index]);

    }
    var toLibrary = function(songQueue){
        for(var i = 0 ; i < songQueue.length ; i++)
            songlist.innerHTML += "<div style=\"border-style='solid' border-width='1px'\" onclick='music.play(" + i + ")' >" + songQueue[i].file.name + "</div><br>" ;
    }
    /**
     * Description
     * @method attachListeners
     * @return 
     */
    var attachListeners = function(){
        ['over', 'end', ''].forEach(function(e){
        document['ondrag' + e] = function(){return false}});
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
            self.play();
        }, false);
        ['ended', 'pause'].forEach(function(e){
            player.addEventListener(e, function(){
                isPlaying = false;
            }, false);
        });
    }
     /**
     * ==============================================================
     * Object Properties
     * ==============================================================

    /*
     * @method queue
     * @param {} index
     * @return 
     */
    this.queue = function(index){
        player.src = index === undefined ? songQueue[0].dataurl : songQueue[index].dataurl;
    }
    /**
     * Plays a song, and updates canvas
     * @method play
     * @param {} index
     * @return 
     */
    this.play = function(index){
        if(!songQueue.length) throw new Error('No songs available');
        this.queue(index);
        player.play();
        player.onplaying = function(){window.requestAnimationFrame(update);}
    }
    
   /**
    * Pauses the player
    * @method pause
    * @return 
    */
   this.pause = function(){
        player.pause();
    }
    /**
     * Initiates the app
     * @method init
     * @return ThisExpression
     */
    this.init = function(){
        //--> Audio Components
        context  =  new window.AudioContext()       || 
                    new window.webkitAudioContext() || 
                    new window.mozAudioContext()    || 
                    new window.oAudioContext()      || 
                    new window.msAudioContext();

        source   = context.createMediaElementSource(player);
        analyser = context.createAnalyser();
        freq     = new Uint8Array(64);
        source.connect(analyser); 
        analyser.connect(context.destination); // connect the freq analyzer to the output

        //--> Canvas Components
        canvas = document.getElementById('visualize');
        ctx    = canvas.getContext('2d');
        g1     = ctx.createLinearGradient(0,0,0,canvas.height);
        g2     = ctx.createLinearGradient(0,0,0,canvas.height);

        for(var i = 1, j = 0 ; j < 5; i-=.25, j++){
            g1.addColorStop(i, ["#000000", "#ff0000", "#fff000", "#ffff00", "#fffff0"][j])
            g2.addColorStop(i, ["#000000", "#0000ff", "#000fff", "#00ffff", "#0fffff"][j])
        }
        attachListeners.call();
        return this;
    }

    /*==============================================================
    * Leftovers
    ==============================================================*/
    /*
    this.getContext = function(){return context};
    this.getSource = function(){return source};
    this.getQueue = function(){return songQueue};
    /**
     * Shuffles the player
     * @method shuffle
     * @return 
     *
    this.shuffle = function(){
        this.play(Math.floor(Math.random()*songQueue.length));
        player.onended = function(){self.shuffle()};
    }
    */

}//END AUDIOAPP

var music;
window.addEventListener('load', function(){
    music = new MusicPlayer().init();
}, false);

