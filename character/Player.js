//
//
// Player.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define('Player', {
	superClass: 'Sprite',

	SPRITE_NAME: "tomapiko",
	WIDTH: 64,
	HEIGHT: 64,
	SPRITE_SHEET_NAME: "tomapiko_ss",
	ORIGIN_X: 0.5,
	ORIGIN_Y: 0.96,
	WALK_SPEED: 300, // ms
	isWalkable: false,
	isWalking: false,
	isAnimating: false,
	dir: "down", // default

	init: function(map, tpX, tpY, dir){
		this.superInit(this.SPRITE_NAME, this.WIDTH, this.HEIGHT);
		this.setOrigin(this.ORIGIN_X, this.ORIGIN_Y);
		this._setMapData(map);
		this._setPositions(tpX, tpY);
		this._setDirection(dir);
		this._initFrameIndex();
	},

	_setMapData: function(map){
		this.map = map;
	},

	_setPositions: function(tpX, tpY){
		this._setTilePos(tpX, tpY);
		this._setRelPos(tpX, tpY);
	},

	_setTilePos: function(tpX, tpY){
		this.tp = Vector2(tpX, tpY);
	},

	_setRelPos: function(tpX, tpY){
		let rp = this.map.getRelPosOfTile(this.tp.x, this.tp.y);
		this.setPosition(rp.x, rp.y);
	},

	_setDirection: function(dir){
		this.dir = dir || this.dir; // receive or default
	},

	_initFrameIndex: function(){
		this.anim = FrameAnimation(this.SPRITE_SHEET_NAME).attachTo(this);
		this.anim.gotoAndStop(this.dir);
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
		this._setDirection(dir);
		this.animation(dir);
	},

	pointEnd: function(dir){
		this.isWalkable = false;
	},

	_walkLoop: function(){
		if(!this.isWalking){
			this.animation(this.dir);
			let nextTp = this.calcNextRelPosition(this.tp, this.dir);
			if(this._checkPosIsWalkable(nextTp)) this.walk(nextTp.x, nextTp.y);
		}
	},

	walk: function(tpX, tpY){
		this.isWalking = true;
		let speed = this.WALK_SPEED;
		if(this.dir == "right" || this.dir == "left") speed *= 2;
		let nextRp = this.map.getRelPosOfTile(tpX, tpY);
		this.tweener.clear()
			.to({
				x: nextRp.x,
				y: nextRp.y
			}, speed )
			.call(function(){
				this.tp = Vector2(tpX, tpY);
				this.isWalking = false;
			}.bind(this));
	},

	calcNextRelPosition: function(oldPos, dir){
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

	_checkPosIsWalkable: function(nextRelPos){
		if(!this._checkMapRange(nextRelPos)) return false;
		else if(!this._checkTileIsWalkable(nextRelPos)) return false;
		return true;
	},

	_checkMapRange: function(nextRelPos){
		let p = nextRelPos;
		let len = this.map.getTileLength();
		if(p.x<0 || p.y<0 || p.x>=len || p.y>=len) return false;
		return true;
	},

	_checkTileIsWalkable: function(nextRelPos){
		return this.map.getTileIsWalkable(nextRelPos.x, nextRelPos.y);
	},

	_updateAnimationDirection: function(dir){
		if(!this.isWalking) this.anim.gotoAndPlay(dir);
	},

	animation: function(dir){
		this._setDirection(dir);
		if(!this.isWalking){
			this.isAnimating = true;
			this.anim.gotoAndPlay(dir);
		}
	},

	animationEnd: function(){
		this.anim.gotoAndStop(this.dir);
		this.isAnimating = false;
	},

	getRelPosition: function(){
		return this.tp;
	},

	getRelPos: function(){
		return Vector2(this.x , this.y);
	},

	getDirection: function(){
		return this.dir;
	},

	getIsAnimating: function(){
		return this.isAnimating;
	},

	getIsWalking: function(){
		return this.isWalking;
	}
});
