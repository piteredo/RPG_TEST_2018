//
//
// Astar.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define('Astar', {

	openList : [],
	closeList : [],
	routeList : [],

	init: function(){},

	calcAStar: function(startTile, goalTile, mapArr, tileLength){
		// startTile  Vector2(int: tilePosX, int: tilePosY)
		// goalTile  Vector2(int: tilePosX, int: tilePosY)
		// mapArr  Array[boolean: isWalkable][boolean: isWalkable]
		// tileLength int (x y same)
		if(!this._checkArguments(startTile, goalTile, mapArr, tileLength)) return false;
		this._initData(mapArr);

		startTile.fStar = this._hStar(startTile, goalTile);
		this.openList.push(startTile);

		let loopCounter = 0;
		while(this.openList.length > 0){

			this.openList.sort(function(a, b){
				if(a.fStar < b.fStar) return -1;
				if(a.fStar > b.fStar) return 1;
				else return 0;
			});
			let minFStarTile = this.openList[0];

			if(minFStarTile.equals(goalTile)) break;

			this.openList.shift();
			this.closeList.push(minFStarTile);

			let walkableNeighborTileArr = this._calcWalkableNeighborTile(minFStarTile , mapArr, tileLength);

			for(let i=0; i<walkableNeighborTileArr.length; i++){

				let neighborTile = walkableNeighborTileArr[i];

				neighborTile.fStar =
					(minFStarTile.fStar - this._hStar(minFStarTile, goalTile))
					+ this._hStar(neighborTile, goalTile)
					+ this._hStar(minFStarTile , goalTile);

				let openIndex = this._inOpenList(neighborTile, this.openList);
				let closeIndex = this._inCloseList(neighborTile, this.closeList);
				let old_m;

				if(openIndex < 0 && closeIndex < 0){
					neighborTile.parentObj = minFStarTile;
					this.openList.push(neighborTile);
				}
				else if(openIndex >= 0){
					old_m = this.openList[openIndex];
					if(neighborTile.fStar < old_m.fStar) this.openList[openIndex] = neighborTile;
				}
				else if(closeIndex >= 0){
					this.closeList[closeIndex] = this.closeList[0];
					this.closeList.shift();
					this.openList.push(neighborTile);
				}
			}
			//FOR_END

			loopCounter++;
			if(loopCounter > 10000) break;
		}
		//LOOP_END


		let ret = []; //経路を並び替えてrouteListeに入れる
		let tile = this.openList[0];

		while(tile.parentObj != null){ //OPENリストの小さい順＝ゴールに近いNODEからその親を辿っていく。
			ret.push(tile);

			let dirArr = tile.clone().sub(tile.parentObj);
			if(dirArr.x==-1 && dirArr.y==-1) tile.parentObj.dir = "up";
			if(dirArr.x==0 && dirArr.y==-1) tile.parentObj.dir = "right_up";
			if(dirArr.x==1 && dirArr.y==-1) tile.parentObj.dir = "right";
			if(dirArr.x==1 && dirArr.y==0) tile.parentObj.dir = "right_down";
			if(dirArr.x==1 && dirArr.y==1) tile.parentObj.dir = "down";
			if(dirArr.x==0 && dirArr.y==1) tile.parentObj.dir = "left_down";
			if(dirArr.x==-1 && dirArr.y==1) tile.parentObj.dir = "left";
			if(dirArr.x==-1 && dirArr.y==0) tile.parentObj.dir = "left_up";

			tile = tile.parentObj;
		}
		ret.reverse();//ゴールから辿った配列を逆順＝スタートからに並び替える
		this.routeList = ret;//それをrouteListに代入。リストは初期化する。
		//console.log(this.routeList);
		this.openList = [];
		this.closeList = [];

		//計算終了
		return this.routeList;
	},

	_checkArguments: function(startTile , goalTile , mapArr, tileLength){
		if(!startTile || !goalTile || !mapArr || !tileLength) return false;
		return true;
	},

	_initData: function(mapArr){
		this.openList = [];
		this.closeList = [];
		this.routeList = [];
		for(let y=0; y<mapArr.length; y++){
			for(let x=0; x<mapArr[y].length; x++){
				mapArr[y][x].fStar = null;
				mapArr[y][x].parentObj = null;
			}
		}
	},

	_hStar: function(startTile, goalTile){
		let distX = Math.abs(goalTile.x - startTile.x);
		let distY = Math.abs(goalTile.y - startTile.y);
		return distX + distY;
	},

	_calcWalkableNeighborTile: function(minFStarTile , mapArr, tileLength){
		let walkableNeighborTileArr = [];
		let dirCount = 8; // same as neighbor list
		let neighborXArr = [-1, 0, 1, -1, 1, -1, 0, 1];
		let neighborYArr = [-1, -1, -1, 0, 0, 1, 1, 1];
		let oldX = minFStarTile.x;
		let oldY = minFStarTile.y;

		for(let i=0; i<dirCount; i++){
			let newX = oldX + neighborXArr[i];
			let newY = oldY + neighborYArr[i];
			if(newX<0 || newY<0 || newX>=tileLength || newY>=tileLength) continue;
			if(mapArr[newY][newX]) walkableNeighborTileArr.push( Vector2(newX, newY) );
		}
		return walkableNeighborTileArr;
	},

	_inOpenList: function(neighborTile, openList){
		for (let i=0; i<openList.length; i++){
			let openListTile = openList[i];
			if (openListTile.equals(neighborTile)) return i;
		}
		return -1;
	},

	_inCloseList: function(neighborTile, closeList){
		for (let i=0; i<closeList.length; i++){
			let closeListTile = closeList[i];
			if (closeListTile.equals(neighborTile))	return i;
		}
		return -1;
	},
});
