//
//
// Character.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define('Character', {
	superClass: 'Sprite',

	WALK_SPEED: 300, // ms
	isWalkable: false,
	isWalking: false,
	isAnimating: false,
	dir: "down", //default

	init: function(map, relPosX, relPosY, dir){
		this.superInit("tomapiko", 64, 64);
		this.setOrigin(0.5, 0.96);
		this.map = map;
		this._setDirection(dir || this.dir); //receive or default
		this._setPosition(relPosX, relPosY);
		this._setAnimation();
	},

	update: function(){
		if(this.isWalkable) this._walkLoop();
		if(!this.isWalking && !this.isWalkable && this.isAnimating) this.animationEnd();
	},

	_setDirection: function(dir){
		this.dir = dir;
	},

	_setPosition: function(relPosX, relPosY){
		this.relPos = Vector2(relPosX, relPosY);
		let absPos = this._getAbsPosition(this.relPos.x, this.relPos.y);
		this.setPosition(absPos.x, absPos.y);
	},

	_setAnimation: function(){
		this.anim = FrameAnimation("tomapiko_ss").attachTo(this);
		this.anim.gotoAndStop(this.dir);
	},

	_getAbsPosition: function(relPosX, relPosY){
		return this.map.getAbsPosition(relPosX, relPosY);
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
			let nextRelPos = this.calcNextRelPosition(this.relPos, this.dir);
			//this.nextRelPosX = nextRelPos.x;
			//this.nextRelPosY = nextRelPos.y;
			if(this._checkPosIsWalkable(nextRelPos)) this.walk(nextRelPos.x, nextRelPos.y);
		}
	},

	walk: function(x, y){
		this.isWalking = true;
		let speed = this.WALK_SPEED;
		if(this.dir == "right" || this.dir == "left") speed *= 2;
		let nextAbsPos = this._getAbsPosition(x, y);
		this.tweener.clear()
			.to({
				x: nextAbsPos.x,
				y: nextAbsPos.y
			}, speed )
			.call(function(){
				this.relPos = Vector2(x,y);
				this.isWalking = false;
				//tell new pos
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
		else if(!this._checkMapChipIsWalkable(nextRelPos)) return false;
		return true;
	},

	_checkMapRange: function(nextRelPos){
		let p = nextRelPos;
		let len = this.map.getMapChipLength();
		if(p.x<0 || p.y<0 || p.x>=len || p.y>=len) return false;
		return true;
	},

	_checkMapChipIsWalkable: function(nextRelPos){
		return this.map.getMapChipIsWalkable(nextRelPos.x, nextRelPos.y);
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
		return this.relPos;
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
