/*
* Song.js
* Author: Seena Rowhani
* Purpose:
* Object that stores song information.
*/
define(function(require){
	return function(config){
		return {
			file	: config.file,
			dataurl : config.dataurl,
			el		: config.el
			state	: false;
		}
	}
}