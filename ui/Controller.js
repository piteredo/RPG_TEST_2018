//
//
// Controller.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define("Controller", {
	superClass: "CircleShape",

	RADIUS: 187.5 / 2,
	FRAME_COLOR: "rgb(200, 200, 190)",
	FRAME_WIDTH: 10,

	init: function(targetObj) {
		this.superInit({
			radius: this.RADIUS,
			stroke: this.FRAME_COLOR,
			strokeWidth: this.FRAME_WIDTH,
			fill: null
		});
		this.targetObj = targetObj; //targetObj for send point msg.

		this.setInteractive(true);
		this.on('pointstart', function(e){ this._pointStart(e) }.bind(this));
		this.on('pointmove', function(e){	this._pointMove(e)	}.bind(this));
		this.on('pointend', function(e){ this._pointEnd(e) }.bind(this));
	},

	_pointStart: function(e){
		let dir = this._getDirString(e);
		this.targetObj.pointStart(dir);
	},

	_pointMove: function(e){
		let dir = this._getDirString(e);
		this.targetObj.pointMove(dir);
	},

	_pointEnd: function(e){
		let dir = this._getDirString(e);
		this.targetObj.pointEnd(dir);
	},

	_getDirString: function(e){
		let controllerCenterPos = Vector2(this.x, this.y);
		let pointedPos = Vector2(e.pointer.x, e.pointer.y);
		let pointedVector = pointedPos.sub(controllerCenterPos);
		return pointedVector.getDirection(); // 8 way
	}
});
