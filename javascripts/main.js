/**
 * Description
 * @method MusicPlayer
 * @return 
 */
var MusicPlayer = function(){
    /*==============================================================
    * Anonymous Variables
    ==============================================================*/
    var songList = [];
    var isPlaying = false;
    //Audio Utilities
    var Song = function(file, dataurl,el){
        this.file = file;
        this.name = file.name;
        this.dataurl = dataurl;
        this.el = el;
        this.playing = false;
    }
    var context, source, analyser, freq;
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
        !isPlaying || window.requestAnimationFrame(update) //animate that shit
    }

    /**
     * Description
     * @method loadTracks
     * @param {} songs
     * @return 
     */
    var i = 0;
    var loadTracks = function(songs){
        var reader = new FileReader();
        var song;
        reader.addEventListener('loadend', function(e){
            if(player.canPlayType(songs[i].type)){
                song = new Song(songs[i], e.target.result, document.createElement('li'));
                if(addToLibrary(song) && ++i < songs.length){
                    console.log(i);
                    reader.readAsDataURL(songs[i]);}
                }
                else i = 0;
            }

        }, false);
        reader.readAsDataURL(songs[0]);

    }
    var addToLibrary = function(song){
        console.log(song);
        for(var s in songList)
            if(song.name == s.name) return false;
        songList.push(song);
        song.el.setAttribute('data-index', songList.length);
        song.el.addEventListener('click', function(){
            music.play(song.el.getAttribute('data-index')-1);
        })
        var title = "<h4>".concat(song.name).concat("</h4>")
        var size = "<small>Size: ".concat(Math.floor(song.file.size/1048576)).concat("mb</small>")
        song.el.innerHTML =  title.concat(size);
        songlist.appendChild(song.el);
        return true;

       
    }
    /**
     * Description
     * @method attachListeners
     * @return 
     */
    var attachListeners = function(){
        ['over', 'end', ''].forEach(function(e){
        songlist['ondrag' + e] = function(){return false}});
        songlist.ondrop = function(e){
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
        player.src = index === undefined ? songList[0].dataurl : songList[index].dataurl;
    }
    /**
     * Plays a song, and updates canvas
     * @method play
     * @param {} index
     * @return 
     */
    this.play = function(index){
        if(!songList.length) throw new Error('No songs available');
        this.queue(index);
        player.pause();
        window.setTimeout(2500, player.play());
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
        attachListeners();
        return this;
    }
    this.getQueue = function(){return songList};

    /*==============================================================
    * Leftovers
    ==============================================================*/
    /*
    this.getContext = function(){return context};
    this.getSource = function(){return source};
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

