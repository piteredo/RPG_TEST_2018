//
//
// Character.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define('Character', {
	superClass: 'Sprite',

	init: function(map, tpX, tpY, spriteName, spriteSheetName, w, h, originX, originY, dir){
		this.superInit(spriteName, w, h);
		this.setOrigin(originX, originY);
		this.map = map;
		this.tp = Vector2(tpX, tpY);
		let rp = this.map.getRelPosOfTile(this.tp.x, this.tp.y);
		this.setPosition(rp.x, rp.y);
		this.dir = dir || "down"; // receive or default
		this.anim = FrameAnimation(spriteSheetName).attachTo(this);
		this.anim.gotoAndStop(this.dir);
		this.uuid = Random.uuid();
		this.isWalkable = false;
		this.isWalking = false;
		this.isAnimating = false;
		this.isDead = false;

		this.setVisible(false);
	},

	_checkPosIsWalkable: function(tpX, tpY){
		if(!this._checkMapRange(tpX, tpY)) return false;
		else if(tpX == this.tp.x && tpY == this.tp.y) return false;
		else if(!this._checkTileIsWalkable(tpX, tpY)) return false;
		return true;
	},

	_checkMapRange: function(tpX, tpY){
		let len = this.map.getTileLength();
		if(tpX<0 || tpY<0 || tpX>=len || tpY>=len) return false;
		return true;
	},

	_checkTileIsWalkable: function(tpX, tpY){
		return this.map.getTileIsWalkable(tpX, tpY);
	},

	_calcSpeedPerDir: function(speed){
		if(this.dir == "right" || this.dir == "left") return speed * 2;
		return speed;
	},

	animation: function(dir){
		this.dir = dir;
		if(!this.isWalking){
			this.isAnimating = true;
			this.anim.gotoAndPlay(dir);
		}
	},

	animationEnd: function(){
		this.anim.gotoAndStop(this.dir);
		this.isAnimating = false;
	}
});
