//
//
// Player.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define('Player', {
	superClass: 'Character',

	SPRITE_NAME: "tomapiko",
	SPRITE_SHEET_NAME: "tomapiko_ss",
	WIDTH: 64,
	HEIGHT: 64,
	ORIGIN_X: 0.5,
	ORIGIN_Y: 0.96,
	WALK_SPEED: 300, // ms

	init: function(map, tpX, tpY, dir){
		this.superInit(
			map,
			tpX,
			tpY,
			this.SPRITE_NAME,
			this.SPRITE_SHEET_NAME,
			this.WIDTH, this.HEIGHT,
			this.ORIGIN_X,
			this.ORIGIN_Y
		);
	},

	// LOOP
	update: function(){
		if(this.isWalkable) this._walkLoop();
		if(!this.isWalking && !this.isWalkable && this.isAnimating) this.animationEnd();
	},

	pointStart: function(dir){
		this.animation(dir);
		this.isAnimating = true;
		this.isWalkable = true;
	},

	pointMove: function(dir){
		this.dir = dir;
		this.animation(dir);
	},

	pointEnd: function(dir){
		this.isWalkable = false;
	},

	_walkLoop: function(){
		if(!this.isWalking){
			this.animation(this.dir);
			let nextTp = this._calcNextRelPosition(this.tp, this.dir);
			if(this._checkPosIsWalkable(nextTp.x, nextTp.y)) this.walk(nextTp.x, nextTp.y);
		}
	},

	_calcNextRelPosition: function(oldPos, dir){
		let addPos = this._getAddPosition(dir);
		return oldPos.clone().add(addPos);
	},

	_getAddPosition: function(dir){
		let addPos = Vector2.ZERO;
		switch(dir){
			case "right_down": addPos = Vector2.RIGHT_DOWN; break;
			case "down": addPos = Vector2.DOWN; break;
			case "left_down":	addPos = Vector2.LEFT_DOWN;	break;
			case "left": addPos = Vector2.LEFT; break;
			case "left_up":	addPos = Vector2.LEFT_UP; break;
			case "up": addPos = Vector2.UP;	break;
			case "right_up": addPos = Vector2.RIGHT_UP;	break;
			case "right": addPos = Vector2.RIGHT; break;
		}
		return addPos;
	},

	walk: function(tpX, tpY){
		this.isWalking = true;
		let speed = this.WALK_SPEED;
		let speedPerDir = this._calcSpeedPerDir(speed);
		let nextRp = this.map.getRelPosOfTile(tpX, tpY);
		this.tweener
			.clear()
			.to({x: nextRp.x, y: nextRp.y}, speedPerDir )
			.call(this._walkTweenEndCallback.bind(this, tpX, tpY));
	},

	_walkTweenEndCallback: function(tpX, tpY){
		this.tp = Vector2(tpX, tpY);
		this.isWalking = false;
	},

	getRelPos: function(){
		return Vector2(this.x , this.y);
	},
});
