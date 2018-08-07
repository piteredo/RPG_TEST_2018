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
			stroke: "rgb(200, 200, 190)",
			strokeWidth: 10
		});

		this.target = target; //target for send point msg.

		this.setInteractive(true);
		this.on('pointstart', function(e){ this._pointStart(e) }.bind(this));
		this.on('pointmove', function(e){	this._pointMove(e)	}.bind(this));
		this.on('pointend', function(e){ this._pointEnd(e) }.bind(this));
	},

	_pointStart: function(e){
		this.target.pointStart(this._getDirection(e));
	},

	_pointMove: function(e){
		this.target.pointMove(this._getDirection(e));
	},

	_pointEnd: function(e){
		this.target.pointEnd(this._getDirection(e));
	},

	_getDirection: function(e){
		let centerPos = Vector2(this.x, this.y);
		let pointedPos = Vector2(e.pointer.x, e.pointer.y);
		return pointedPos.sub(centerPos).getDirection(); // 8 way
	}
});


//extention of phina.js(4 way -> 8 way)
phina.geom.Vector2.prototype.getDirection = function(){
  var angle = this.toDegree();
  if(angle>=337.5 || angle<22.5) return "right";
  else if(angle<67.5) return "right_down";
  else if(angle<112.5) return "down";
  else if(angle<157.5) return "left_down";
  else if(angle<202.5) return "left";
  else if(angle<247.5) return "left_up";
  else if(angle<292.5) return "up";
  else if(angle<337.5) return "right_up";
}

phina.geom.Vector2.ZERO = phina.geom.Vector2(0, 0);
phina.geom.Vector2.RIGHT = phina.geom.Vector2(1, -1);
phina.geom.Vector2.RIGHT_DOWN = phina.geom.Vector2(1, 0);
phina.geom.Vector2.DOWN = phina.geom.Vector2(1, 1);
phina.geom.Vector2.LEFT_DOWN = phina.geom.Vector2(0, 1);
phina.geom.Vector2.LEFT = phina.geom.Vector2(-1, 1);
phina.geom.Vector2.LEFT_UP = phina.geom.Vector2(-1, 0);
phina.geom.Vector2.UP = phina.geom.Vector2(-1, -1);
phina.geom.Vector2.RIGHT_UP = phina.geom.Vector2(0, -1);
