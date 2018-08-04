//
//
// Controller.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define("Controller", {
	superClass: "CircleShape",

	init: function(target) {
		this.superInit({
			radius: 187.5/2,
			fill: null,
			stroke: "rgb(210,210,200)",
			strokeWidth: 10
		});

		this.target = target; //target for send point msg.

		this.setInteractive(true);
		this.on('pointstart', function(e){
			this._pointStart(e);
		}.bind(this));
		this.on('pointmove', function(e){
			this._pointMove(e);
		}.bind(this));
		this.on('pointend', function(e){
			this._pointEnd(e);
		}.bind(this));
	},

	_pointStart: function(e){
		let dir = this._getDirection(e);
		this.target.pointStart(dir);
	},

	_pointMove: function(e){
		let dir = this._getDirection(e);
		this.target.pointMove(dir);
	},

	_pointEnd: function(e){
		let dir = this._getDirection(e);
		this.target.pointEnd(dir);
	},

	_getDirection: function(e){
		let centerPos = Vector2(this.x , this.y);
		let pointedPos = Vector2(e.pointer.x , e.pointer.y);
		return pointedPos.sub(centerPos).getDirection(); // 4 way
	}
});
