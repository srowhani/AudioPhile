define(function(require){
	'use strict';
	var _util   = require('Utils');
	var _player = require('Player');
	var _canvas = require('Canvas');
	return {
		init: function(){
			_util.init(_player.init(), _canvas.init(_player));
		}		
	}
})