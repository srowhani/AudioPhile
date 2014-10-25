define(function(require){
    var canvas = require('Canvas');
    var _songs = {};
    var _isPlaying = false;

    var Song = function(config){
        this.file = config.file;
        this.dataurl = config.dataurl;
        this.element = config.element;
    };
    var _source, 
        _analyser, 
        _freq,
        _context;

    (function init(){
        _context  =  new window.AudioContext();
        _source   = _context.createMediaElementSource(player);
        _analyser = _context.createAnalyser();
        _source.connect(_analyser); 
        _analyser.connect(_context.destination); // connect the freq analyzer to the output
        _freq = new Uint8Array(64);

    })();
    //Canvas utilities

    /*==============================================================
    * Anonymous Functions
    ==============================================================*/

    var populateList = function(_songs){
        for (var song in _songs){
            _songs[song].element.setAttribute('onclick', 'app.player.play(\'' + _songs[song].file.name + '\')');
            var title = "<h4>".concat(song).concat("</h4>")
            var size = "<small>Size: ".concat(Math.floor(_songs[song].file.size/1048576)).concat("mb</small>")
            _songs[song].element.innerHTML =  title.concat(size);
            songlist.appendChild(_songs[song].element);
        }
    }
    return {
        play : function(_name){
            if( !(_name in _songs) ) throw new Error("Unable to play song");
            else player.src = _songs[_name].dataurl;
            window.setTimeout(2000, player.play());
        },
        pause: function(){
            player.pause();
        },
        getSongs : function(){
            return _songs;
        },
        loadTracks : function(_files){
            var reader = new FileReader();
            var index  = 0;
            reader.addEventListener('loadend', function(e){
                var song;

                if(player.canPlayType(_files[index].type)){
                    song = new Song({
                        file    : _files[index],
                        dataurl : e.target.result, 
                        element : document.createElement('li')
                    });
                    _songs[song.file.name] = song;
                    if(++index < _files.length)
                        reader.readAsDataURL(_files[index]);
                    else{
                        populateList(_songs);
                    }
                }
            }, false);
            reader.readAsDataURL(_files[index]);
        },
        isPlaying : function(){return _isPlaying}
    }
});