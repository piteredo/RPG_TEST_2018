//
//
// Tile.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define('Tile', {
	superClass: 'DisplayElement',

	TILE_FLOOR_COLOR: {r:166, g:148, b:37, range:10},
	TILE_WALL_COLOR: {r:82, g:78, b:77, range:10},
	existPlayerList: [],

	init: function(width, height, padding, tp, type, isWalkable){ //type: 0 or 1
		this.superInit();
		this.width = width;
		this.height = height;
		this.padding = padding;
		this.tp = tp;
		this.isWalkable = isWalkable;
		this._createTile(type).addChildTo(this);
	},

	_createTile: function(type){
		let tile = this._createShape();
		tile.fill = this._calcColor(type);
		return tile;
	},

	_createShape: function(){
		let w = this.width;
		let h = this.height;
		let p = this.padding;
		return PathShape({ stroke: null }) // origin: 0.5, 0.5
      .addPath(0 , (-h/2)+p)
      .addPath((w/2)-p , 0)
      .addPath(0 , (h/2)-p)
      .addPath((-w/2)+p , 0)
      .addPath(0 , (-h/2)+p);
	},

	_calcColor: function(type){
		let colorDataList = null;
		switch(type){
			case 0: colorDataList = this.TILE_FLOOR_COLOR; break;
			case 1:	colorDataList = this.TILE_WALL_COLOR; break;
		}
		let range = colorDataList.range || 0;
    let r = colorDataList.r + Math.randint(-range, range);
    let g = colorDataList.g + Math.randint(-range, range);
    let b = colorDataList.b + Math.randint(-range, range);
    return "rgb({r},{g},{b})".format({r:r, g:g, b:b});
	},

	addExistPlayer: function(playerObj){
		this.existPlayerList.push(playerObj);
	},

	removeExistPlayer: function(playerObj){
		(this.existPlayerList.length).times(function(i){
			let playerOfList = this.existPlayerList[i];
			if(playerOfList.uuid == playerObj.uuid) this.existPlayerList.splice(i, 1);
		}.bind(this));
	},

	searchExistPlayerList: function(tpX, tpY){
		let playerObj = null;
		(this.existPlayerList.length).times(function(i){
			let playerOfList = this.existPlayerList[i];
			if(playerOfList.tp.equals(Vector2(tpX, tpY))) playerObj = playerOfList;
		}.bind(this));
		if(playerObj) return playerObj;
		return false;
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
