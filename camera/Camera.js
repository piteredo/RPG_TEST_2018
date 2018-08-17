//
//
// Camera.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define('Camera', {
	superClass: 'DisplayElement',

	SCREEN_CENTER_X: SCREEN_WIDTH / 2,
	SCREEN_CENTER_Y: SCREEN_HEIGHT / 2,
	VIEWPORT_PADDING: VIEWPORT_PADDING,

	init: function(mapLayer, mainLayer, mapTileList, targetObj){
		this.superInit();
		this.mapLayer = mapLayer;
		this.mainLayer = mainLayer;
		this.targetObj = targetObj; // target obj to focus
		this._initPos();

		this.viewport = ViewPort(
			this.SCREEN_CENTER_X,
			this.SCREEN_CENTER_Y,
			this.VIEWPORT_PADDING,
			this.mapLayer,
			mapTileList
		);
		this.viewport.updateViewport();
		this._startWatchTargetPosition();
	},

	_initPos: function(){
		let targetRp = this.targetObj.getRelPos();
		this._setPos(targetRp.x, targetRp.y);
	},

	_setPos: function(targetRpX, targetRpY){
		this._setPosX(targetRpX);
		this._setPosY(targetRpY);
	},

	_setPosX: function(targetRpX){
		let distFromCenterX = this._calcDistFromCenterX(targetRpX);
		this.mapLayer.setX(-distFromCenterX);
		this.mainLayer.setX(-distFromCenterX);
	},

	_setPosY: function(targetRpY){
		let distFromCenterY = this._calcDistFromCenterY(targetRpY);
		this.mapLayer.setY(-distFromCenterY);
		this.mainLayer.setY(-distFromCenterY);
	},

	_calcDistFromCenterX: function(targetRpX){
		return targetRpX - this.SCREEN_CENTER_X;
	},

	_calcDistFromCenterY: function(targetRpY){
		return targetRpY - this.SCREEN_CENTER_Y;
	},

	_startWatchTargetPosition: function(){
		this.targetObj.$watch("x", function(newRpX, oldRpX){
			this._setPosX(newRpX);
			this.viewport.updateViewport();
		}.bind(this));
		this.targetObj.$watch("y", function(newRpY, oldRpY){
			this._setPosY(newRpY);
			this.viewport.updateViewport();
		}.bind(this));
	}
});
