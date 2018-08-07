//
//
// Character.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define('Character', {
	superClass: 'Sprite',

	WALK_SPEED: 300,
	isWalkable: false,
	isWalking: false,
	isAnimating: false,
	dir: "left",

	init: function(map, x, y){
		this.superInit("tomapiko", 64, 64);
		this.setOrigin(0.5, 0.96);
		this.anim = FrameAnimation("tomapiko_ss").attachTo(this);
		this.map = map;
		this.relPos = Vector2(x, y);
		let absPos = this._getAbsPosition(this.relPos.x, this.relPos.y);
		this.setPosition(absPos.x, absPos.y);
	},

	update: function(){
		if(this.isWalkable && !this.isWalking) this._walkLoop();
		if(this.isWalkable && !this.isAnimating) this._animationStart();
		else if(!this.isWalking && !this.isWalkable && this.isAnimating) this._animationEnd();
	},

	_getAbsPosition: function(posX, posY){
		return this.map.getAbsPosition(posX, posY);
	},

	pointStart: function(dir){
		this.dir = dir;
		this.isWalkable = true;
		this._animationStart();
	},

	pointMove: function(dir){
		this.dir = dir;
	},

	pointEnd: function(dir){
		this.dir = dir;
		this.isWalkable = false;
	},

	_walkLoop: function(){
		this.isWalking = true;
		let nextRelPos = this._calcNextRelPosition(this.relPos, this.dir);
		let posIsWalkable = this._checkPosIsWalkable(nextRelPos);
		this._updateAnimationDirection(this.dir);

		if(posIsWalkable){
			let speed = this.WALK_SPEED;
			if(this.dir == "right" || this.dir == "left") speed *= 2;

			let nextAbsPos = this._getAbsPosition(nextRelPos.x, nextRelPos.y);
			this.tweener.clear()
	      .to({
	        x: nextAbsPos.x,
	        y: nextAbsPos.y
	      }, speed )
	      .call(function(){
					this.relPos = nextRelPos;
	        this.isWalking = false;
	      }.bind(this));
		}
		else{
			this.isWalking = false;
		}
	},

	//他キャラ移動用暫定。自主操作と function 統合する
	walkNoLoop: function(nextRelPosX, nextRelPosY, dir){
		this.isWalking = true;
		//let nextRelPos = this._calcNextRelPosition(this.relPos, this.dir);
		//let posIsWalkable = this._checkPosIsWalkable(nextRelPos);
		this._animationStart();
		this._updateAnimationDirection(dir);
		this.dir = dir;

		//if(posIsWalkable){
			let speed = this.WALK_SPEED;
			if(this.dir == "right" || this.dir == "left") speed *= 2;

			let nextAbsPos = this._getAbsPosition(nextRelPosX, nextRelPosY);
			this.tweener.clear()
	      .to({
	        x: nextAbsPos.x,
	        y: nextAbsPos.y
	      }, speed )
	      .call(function(){
					this.relPos = Vector2(nextRelPosX, nextRelPosY);
					this._animationEnd();
	        this.isWalking = false;
	      }.bind(this));
		//}
		//else{
			//this.isWalking = false;
		//}
	},

	_calcNextRelPosition: function(oldPos, dir){
		let addPos = this._getAddPosition(dir);
		let clone = oldPos.clone();
		return clone.add(addPos);
	},

	_getAddPosition: function(dir){
		console.log(dir);
		let addPos = Vector2.ZERO;
		switch(dir){
			case "right_down":
				addPos = Vector2.RIGHT_DOWN;
				break;
			case "down":
				addPos = Vector2.DOWN;
				break;
			case "left_down":
				addPos = Vector2.LEFT_DOWN;
				break;
			case "left":
				addPos = Vector2.LEFT;
				break;
			case "left_up":
				addPos = Vector2.LEFT_UP;
				break;
			case "up":
				addPos = Vector2.UP;
				break;
			case "right_up":
				addPos = Vector2.RIGHT_UP;
				break;
			case "right":
				addPos = Vector2.RIGHT;
				break;
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
		if(p.x < 0 || p.y < 0 || p.x >= len || p.y >= len) return false;
		return true;
	},

	_checkMapChipIsWalkable: function(nextRelPos){
		let s =  this.map.getMapChipIsWalkable(nextRelPos.x, nextRelPos.y);
		return s;
	},

	_updateAnimationDirection: function(dir){
		this.anim.gotoAndPlay(dir);
	},

	_animationStart: function(){
		if(!this.isWalking)	this.isAnimating = true;
	},

	_animationEnd: function(){
		this.isAnimating = false;
		let dir = this.dir;
		this.anim.gotoAndStop(dir);
	},

	getRelPosition: function(){
		return this.relPos;
	}
});
