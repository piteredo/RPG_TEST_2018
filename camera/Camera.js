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
	VIEWPORT_PADDING: 100,

	init: function(layerSet, targetObj){
		this.superInit();
		this._initLayerData(layerSet);
		this._initTargetObj(targetObj);
		this._initPosition();

		this.viewPort = ViewPort(
			this.mapLayer,
			this.SCREEN_CENTER_X,
			this.SCREEN_CENTER_Y,
			this.VIEWPORT_PADDING
		);
		this.viewPort.updateViewport();

		this._watchTargetPosition();
		this._createViewportFrameForDebug();
	},


	//暫定
	update: function(){
		(this.mainLayer.children.length).times(function(i){
			let obj = this.mainLayer.children[i];
			let tileVisible = this.mapLayer.getTile(obj.tp.x, obj.tp.y).visible;
			if(tileVisible != obj.visible) this.mapLayer.updateChildVisibility(obj, tileVisible);
		}.bind(this));
	},



	_initLayerData: function(layerSet){
		this.mapLayer = layerSet.getMapLayer();
		this.mainLayer = layerSet.getMainLayer();
		this.uiLayer = layerSet.getUiLayer();
	},

	_initTargetObj: function(targetObj){
		this.targetObj = targetObj; // target obj to focus
	},

	_initPosition: function(){
		let targetRp = this.targetObj.getRelPos();
		this._setPosition(targetRp.x, targetRp.y);
	},

	_setPosition: function(targetRpX, targetRpY){
		let parentRp = this._calcParentRelPosToTargetRelPosCenter(targetRpX, targetRpY);
		this.mapLayer.setPosition(parentRp.x, parentRp.y);
		this.mainLayer.setPosition(parentRp.x, parentRp.y);
	},

	_setX: function(targetRpX){
		let parentRpX = this._calcParentRelPosXToTargetRelPosXCenter(targetRpX);
		this.mapLayer.x = parentRpX;
		this.mainLayer.x = parentRpX;
	},

	_setY: function(targetRpY){
		let parentRpY = this._calcParentRelPosYToTargetRelPosYCenter(targetRpY);
		this.mapLayer.y = parentRpY;
		this.mainLayer.y = parentRpY;
	},

	_calcParentRelPosToTargetRelPosCenter: function(targetRpX, targetRpY){
		let parentRpX = this.SCREEN_CENTER_X - targetRpX;
		let parentRpY = this.SCREEN_CENTER_Y - targetRpY;
		return Vector2(parentRpX, parentRpY);
	},

	_calcParentRelPosXToTargetRelPosXCenter: function(targetRpX){
		return parentRpX = this.SCREEN_CENTER_X - targetRpX;
	},

	_calcParentRelPosYToTargetRelPosYCenter: function(targetRpY){
		return parentRpY = this.SCREEN_CENTER_Y - targetRpY;
	},

	_watchTargetPosition: function(){
		this.targetObj.$watch("x", function(newRpX, oldRpX){
			this._setX(newRpX);
			this.viewPort.updateViewport();
		}.bind(this));
		this.targetObj.$watch("y", function(newRpY, oldRpY){
			this._setY(newRpY);
			this.viewPort.updateViewport();
		}.bind(this));
	},

	_createViewportFrameForDebug: function(){
		let viewport = PathShape({strokeWidth:1, stroke:"white"})
			.addPath(this.VIEWPORT_PADDING, this.VIEWPORT_PADDING)
			.addPath(SCREEN_WIDTH-this.VIEWPORT_PADDING, this.VIEWPORT_PADDING)
			.addPath(SCREEN_WIDTH-this.VIEWPORT_PADDING, SCREEN_HEIGHT-this.VIEWPORT_PADDING)
			.addPath(this.VIEWPORT_PADDING, SCREEN_HEIGHT-this.VIEWPORT_PADDING)
			.addPath(this.VIEWPORT_PADDING, this.VIEWPORT_PADDING)
			.addChildTo(this.uiLayer);
	},
});
