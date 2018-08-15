//
//
// Player.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define('Player', {
	superClass: 'Character',

	init: function(map, tpX, tpY, dir){
		this.superInit(map, tpX, tpY, dir);
		this._setPositions(tpX, tpY);
	},

	_setPositions: function(tpX, tpY){
		this._setTilePos(tpX, tpY);
		this._setRelPos(tpX, tpY);
		this._addMapTileExistList(tpX, tpY);
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
				this._removeMapTileExistList(this.tp.x, this.tp.y);
				this.tp = Vector2(tpX, tpY);
				this._addMapTileExistList(tpX, tpY);
				this.isWalking = false;
			}.bind(this));
	},
});
