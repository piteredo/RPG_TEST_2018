//
//
// Tile.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define('Tile', {
	superClass: 'DisplayElement',

	init: function(width, height, padding, tp, isWalkable, color){
		this.superInit();

		this.width = width;
		this.height = height;
		this.tp = tp;
		this.isWalkable = isWalkable;
		this._createTile(color, padding).addChildTo(this);
	},

	_createTile: function(color, padding){
		let tile = this._createShape(padding);
		this._attachColor(tile, color);
		return tile;
	},

	_createShape: function(padding){
		let w = this.width;
		let h = this.height;
		let p = padding;
		return PathShape({  // origin: 0.5, 0.5
			stroke: null
		})
    .addPath(0 , (-h/2)+p)
    .addPath((w/2)-p , 0)
    .addPath(0 , (h/2)-p)
    .addPath((-w/2)+p , 0)
    .addPath(0 , (-h/2)+p);
	},

	_attachColor: function(tile, color){
		tile.fill = color;
	},

	getWidth: function(){
		return this.width;
	},

	getHeight: function(){
		return this.height;
	},

	getRelPos: function(){
		return this.position;
	}
});
