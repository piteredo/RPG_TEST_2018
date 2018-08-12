//
//
// LayerSet.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define('LayerSet', {
	superClass: 'DisplayElement',

	init: function(){
		this.superInit();
		this._initLayers();
	},

	_initLayers: function(){
		this.mapLayer = MapLayer().addChildTo(this);
		this.mainLayer = MainLayer().addChildTo(this);
		this.uiLayer = UiLayer().addChildTo(this);
	},

	setMapDataToLayer: function(mapObj){
		this.mapLayer.setMapDataToLayer(mapObj);
	},

	childToMainLayer: function(obj){
		//obj = character or building
		this.mainLayer.child(obj);
	},

	childToUiLayer: function(uiObj){
		this.uiLayer.child(uiObj);
	},

	getMapLayer: function(){
		return this.mapLayer;
	},

	getMainLayer: function(){
		return this.mainLayer;
	},

	getUiLayer: function(){
		return this.uiLayer;
	}
});
