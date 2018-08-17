//
//
// ViewPort.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define('ViewPort', {

	visibleTileList: [],

	init: function(SCREEN_CENTER_X, SCREEN_CENTER_Y, VIEWPORT_PADDING, mapLayer, mapTileList){
		this.SCREEN_CENTER_X = SCREEN_CENTER_X;
		this.SCREEN_CENTER_Y = SCREEN_CENTER_Y;
		this.VIEWPORT_PADDING = VIEWPORT_PADDING;
		this.mapLayer = mapLayer;
		this.mapTileList = mapTileList;
	},

	updateViewport: function(){
		let absCenterTile = this._calcAbsCenterTile();
		let tileWidth = absCenterTile.getWidth();
		let tileHeight = absCenterTile.getHeight();
		let verticalEdgeTileList = this._calcVerticalEdgeTileList(absCenterTile, tileWidth, tileHeight); // {top:tile, bottom:tile}
		let cornerTileList = this._calcCornerTileList(verticalEdgeTileList, tileWidth, tileHeight); // {leftOfTop:tile, rightOfTop:tile,	leftOfBottom:tile, rightOfBottom:tile}
		let newVisibleTileList = this._calcNewVisibleTileList(cornerTileList);
		this._updateTileVisibility(newVisibleTileList);
	},

	_calcAbsCenterTile: function(){
		let result = null;
		(this.mapTileList.length).times(function(y){
			(this.mapTileList[y].length).times(function(x){
				let tile = this.mapTileList[y][x];
				let tileAp = this.mapLayer.getRelPos().clone().add(tile.getRelPos());
				let tileWidth = tile.getWidth();
				let tileHeight = tile.getHeight();
				let linearFunctionList = this._calcLinearFunctions(tileAp.x, tileAp.y, tileWidth, tileHeight);
		    if(this.SCREEN_CENTER_Y >= linearFunctionList.leftTop
					&& this.SCREEN_CENTER_Y >= linearFunctionList.rightTop
					&& this.SCREEN_CENTER_Y <= linearFunctionList.leftBottom
					&& this.SCREEN_CENTER_Y <= linearFunctionList.rightBottom){
						result = tile;
				}
			}.bind(this));
		}.bind(this));
		return result;
  },

	_calcLinearFunctions: function(apX, apY, width, height){
		let a = height / width;
		let x = this.SCREEN_CENTER_X - apX;
		let y = height / 2;
		let b = apY;
		let leftTop = (-a*x) - y + b; // 4 type of linear function
		let rightTop = (a*x) - y + b;
		let leftBottom = (a*x) + y + b;
		let rightBottom = (-a*x) + y + b;
		return {leftTop:leftTop, rightTop:rightTop, leftBottom:leftBottom, rightBottom:rightBottom};
	},

	_calcVerticalEdgeTileList: function(absCenterTile, tileWidth, tileHeight){
		let result = {top:null, bottom:null};
		let dirList = ["up", "down"];
		for(let i in dirList){
			absCenterTile.ap = this.mapLayer.getRelPos().clone().add(absCenterTile.getRelPos());
			let tempTile = this._duplicateTile(absCenterTile);
			let dir = dirList[i];
			switch(dir){
				case "up":
					while(tempTile.ap.y > this.VIEWPORT_PADDING){
						tempTile.ap.y -= tileHeight;
						tempTile.tp.add(Vector2.UP);
					}
					result.top = tempTile;
					break;
				case "down":
					while(tempTile.ap.y < SCREEN_HEIGHT - this.VIEWPORT_PADDING){
						tempTile.ap.y += tileHeight;
						tempTile.tp.add(Vector2.DOWN);
					}
					result.bottom = tempTile;
					break;
			}
		}
		return result;
	},

	_duplicateTile: function(tile){
		//tile pos, rel pos & abs pos only
		let result = DisplayElement();
		result.tp = tile.tp.clone();
		result.ap = tile.ap.clone();
		result.x = tile.x;
		result.y = tile.y;
		return result;
	},

	_calcCornerTileList: function(verticalEdgeTileList, tileWidth, tileHeight){
		// verticalEdgeTileList {top:tile, bottom:tile}
		let result = {leftOfTop:null, rightOfTop:null, leftOfBottom:null, rightOfBottom:null};
		let dirList = ["top", "bottom"];
		for(let i in dirList){
			let dir = dirList[i];
			let tempTileLeft = this._duplicateTile(verticalEdgeTileList[dir]);
			let tempTileRight = this._duplicateTile(verticalEdgeTileList[dir]);
			while(tempTileLeft.ap.x > this.VIEWPORT_PADDING){
				tempTileLeft.ap.x -= tileWidth;
				tempTileLeft.tp.add(Vector2.LEFT);
			}
			while(tempTileRight.ap.x < SCREEN_WIDTH - this.VIEWPORT_PADDING){
				tempTileRight.ap.x += tileWidth;
				tempTileRight.tp.add(Vector2.RIGHT);
			}
			switch(dir){
				case "top":
					result.leftOfTop = tempTileLeft;
					result.rightOfTop = tempTileRight;
					break;
				case "bottom":
					result.leftOfBottom = tempTileLeft;
					result.rightOfBottom = tempTileRight;
					break;
			}
		}
		return result;
	},

	_calcNewVisibleTileList: function(cornerTileList){
		let result = [];
		let leftTopX = cornerTileList.leftOfTop.tp.x;
		let leftTopY = cornerTileList.leftOfTop.tp.y;
		let rightTopX = cornerTileList.rightOfTop.tp.x;
		let leftBottomX = cornerTileList.leftOfBottom.tp.x;
		let rightBottomX = cornerTileList.rightOfBottom.tp.x;
		// [doesn't use] let leftBottomY = cornerTileList.leftOfBottom.tp.y;
		// [doesn't use] let rightTopY = cornerTileList.rightOfTop.tp.y;
		// [doesn't use] let rightBottomY = cornerTileList.rightOfBottom.tp.y;
		let yMin = leftTopY;
		let yMax = leftTopY;
		let tileLength = this.mapTileList.length;

		for(let x=leftTopX; x<=rightBottomX; x++){
			for(let y=yMin; y<=yMax; y++){
				if(y<0 || x<0 || x>=tileLength || y>=tileLength) continue;

				let tile = this.mapTileList[y][x];

				if(tile.x-tile.getWidth()/2 < SCREEN_WIDTH ||
					tile.x+tile.getWidth()/2 > 0 ||
					tile.y-tile.getHeight()/2 < SCREEN_HEIGHT ||
					tile.y+tile.getHeight()/2 > 0){
						result.push(tile);
					}
			}
			if(x < rightTopX) yMin--; else yMin++;
			if(x < leftBottomX) yMax++; else yMax--;
		}
		return result;
	},

	_updateTileVisibility: function(newVisibleTileList){ //もっと上手くできないか
		let dupOfNewList = [];
		let dupOfOldList = [];
		newVisibleTileList.filter(function(newTile, i){
			this.visibleTileList.filter(function(oldTile, j){
				if(newTile.tp == oldTile.tp){
					dupOfNewList.push(newVisibleTileList[i]);
					dupOfOldList.push(this.visibleTileList[j]);
				}
			}.bind(this));
		}.bind(this));

		let addList = [];
		(newVisibleTileList.length).times(function(i){
			let newTile = newVisibleTileList[i];
			if(!dupOfNewList.contains(newTile)){
				this.mapLayer.child(newTile);
			}
		}.bind(this));

		let removeList = [];
		(this.visibleTileList.length).times(function(i){
			let oldTile = this.visibleTileList[i];
			if(!dupOfOldList.contains(oldTile)){
				this.mapLayer.remove(oldTile);
			}
		}.bind(this));

		this.visibleTileList = newVisibleTileList.clone();
	},
});
