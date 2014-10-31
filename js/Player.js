define(function(require){
    var _songs = {},
       _isPlaying = false,
       _self,
       _playing,
       _source, 
       _analyser, 
        _freq,
        _context;

    var Song = function(config){
        this.file = config.file;
        this.name = config.name;
        this.size = config.size;
        this.dataurl = config.dataurl;
        this.element = config.element;
    };
       

    var populateList = function(song){
        if(song.file.name in _songs) return;

        _songs[song.file.name] = song;
        song.element.setAttribute('class', 'song');
        song.element.setAttribute('data-id', btoa(song.name));
        song.element.addEventListener('click', function(e){
            _self.play(e.srcElement);
        }, false);
        var title = "<h4>".concat(song.name).concat("</h4>")
        var size = "<small>Size: ".concat(song.size).concat("mb</small>")
        song.element.innerHTML =  title.concat(size);
        songlist.appendChild(song.element);
    }
    return {

        init : function(){
		    _context = new AudioContext();
            _source   = _context.createMediaElementSource(player);
            _analyser = _context.createAnalyser();
            _source.connect(_analyser); 
            _analyser.connect(_context.destination); // connect the freq analyzer to the output
            _freq = new Uint8Array(64);
            _self = this;
            return this;
        },

        play : function(element){
            var _name = element['dataset'].id;
            if(!_playing) _playing = element
            if(!_name) return;

            if( !(atob(_name) in _songs)) throw new Error("Unable to play song");
            else player.src = _songs[atob(_name)].dataurl;
            
            _playing.className = "song";
            element.className  += " playing";

            _playing = element;
            _freq = new Uint8Array(64); 
            player.play();
            _isPlaying = true;

        },
        pause: function(){
            player.pause();
            _isPlaying = false;
        },
        getSongs : function(){
            a = [];
            for(var song in _songs){
                a.push(song);
            }
            return a
        },
        getPlaying : function(){
            return _playing;
        },
        getFrequency: function(){
            return _freq;
        },
        loadTracks : function(_files){
            var reader = new FileReader();
            var index  = 0;
            reader.addEventListener('loadend', function(e){
                var song;
                if(index < _files.length){
                    if(player.canPlayType(_files[index].type)){
                        song = new Song({
                            file    : _files[index],
                            name    : _files[index].name,
                            size    : Math.floor(_files[index].size / 1048576),
                            dataurl : e.target.result, 
                            element : document.createElement('li')
                        });
                        populateList(song);
                    }
                    try{
                        reader.readAsDataURL(_files[++index]);
                    }
                    catch(e){}
                }
            }, false);
            reader.readAsDataURL(_files[index]);
        },

        getAnalyser : function(){
            return _analyser
        },
        isPlaying : _isPlaying
    }
});
