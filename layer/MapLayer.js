//
//
// MapLayer.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define('MapLayer', {
	superClass: 'Layer',

	init: function(){
		this.superInit();
	},

	setMapDataToLayer: function(map){
		this.map  = map;
	},

	///getMap: function(map){
		//return this.map;
	//},

	getTileList: function(){
		return this.map.getTileList();
	},

	getTileLength: function(){
		return this.map.getTileLength();
	},
});
