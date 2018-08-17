//
//
// UiSet.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define("UiSet", {
	superClass: "DisplayElement",

	CONTROLLER_POS_X: 130,
	CONTROLLER_POS_Y: 820,

	init: function(targetObj) {
		this.superInit();
		this._initController(targetObj);
		this._createViewportFrameForDebug();
	},

	_initController: function(targetObj){
		this.controller = Controller(targetObj).addChildTo(this);
		this.controller.setPosition(this.CONTROLLER_POS_X, this.CONTROLLER_POS_Y);
	},

	_createViewportFrameForDebug: function(){
		let vp = VIEWPORT_PADDING;
		let viewport = PathShape({
			strokeWidth: 2,
			stroke: "rgb(201, 200, 194)"
		})
		.addPath(vp, vp)
		.addPath(SCREEN_WIDTH-vp, vp)
		.addPath(SCREEN_WIDTH-vp, SCREEN_HEIGHT-vp)
		.addPath(vp, SCREEN_HEIGHT-vp)
		.addPath(vp, vp)
		.addChildTo(this);
	},
});
