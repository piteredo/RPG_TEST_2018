//
//
// Enemy.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define('Enemy', {
	superClass: 'Character',

  isInChaseMode: false,
  isInBattleMode: false,
  areaMin: 0,
  areaMax: 10,
	TIMER_RANGE_MIN: 2,
	TIMER_RANGE_MAX: 7,
	WALK_SPEED: 700, // ms
	CHASE_SPEED: 400,
	SEARCH_AREA_RANGE: 5,

	init: function(map, tpX, tpY, dir){
		this.superInit(map, tpX, tpY, dir);

    this.astar = Astar();
    this._setRandomTimer();
	},

	_setPositions: function(tpX, tpY){
		this._setTilePos(tpX, tpY);
		this._setRelPos(tpX, tpY);
	},

  _setRandomTimer: function(){
		let randomMS = Math.randint(this.TIMER_RANGE_MIN, this.TIMER_RANGE_MAX) * 1000;
    setTimeout(this._startAction.bind(this), randomMS);
  },

  _startAction: function(){
		if(!this.isInChaseMode && !this.isInBattleMode) this._actWalkMode();
		else if(this.isInChaseMode) this._actChaseMode();
		else if(this.isInBattleMode) this._actBattleMode();
  },

	_actWalkMode: function(){
		let speed = this.WALK_SPEED;
		let goalTp = this._calcRandomGoalTilePos(this.areaMin, this.areaMax);
		let isGoalTileValid = this._calcIsGoalTileValid(goalTp.x, goalTp.y);
		if(!isGoalTileValid){
			this._actWalkMode();
			return;
		}
		let routeList = this._calcRouteList(goalTp.x, goalTp.y);
		let dir = routeList[0].parentObj.dir; // なぜ parentObj?
		this.animation(dir);
		this.isWalking = true;
    this.walk(routeList, speed);
	},

	_calcRandomGoalTilePos: function(min, max){
		let goalTpX = Math.randint(min, max);
    let goalTpY = Math.randint(min, max);
		return Vector2(goalTpX, goalTpY);
	},

	_calcIsGoalTileValid: function(goalTpX, goalTpY){
		let isWalkable = this.map.getTileIsWalkable(goalTpX, goalTpY);
    if(!isWalkable) return false;
		else if(goalTpX == this.tp.x && goalTpY == this.tp.y) return false;
		return true;
	},

	_actChaseMode: function(){
		let speed = this.CHASE_SPEED;
		let goalTp = this.target.tp;
		let routeList = this._calcRouteList(goalTp.x, goalTp.y);
		let dir = routeList[0].parentObj.dir; // なぜ parentObj?
		this.animation(dir);
		this.isWalking = true;
    this.walk(routeList, speed);
	},

	_actBattleMode: function(){
		console.log("attack!");
		setTimeout(this._startAction.bind(this), 1000);
	},

	_calcRouteList: function(goalTpX, goalTpY){
    let startTp = this.tp;
		let goalTp = Vector2(goalTpX, goalTpY);
		let mapTileList = this.map.getIsWalkableTileList();
		let tileLength = this.map.getTileLength();
    let routeList = this.astar.calcAStar(startTp, goalTp, mapTileList, tileLength);
		return routeList;
	},

	walk: function(routeList, speed){
		this.isWalking = true;
		let x = routeList[0].x;
		let y = routeList[0].y;
		let speedPerDir = this._calcSpeedPerDir(speed);
		let nextRp = this._calcTilePosToRelPos(x, y);
		this.tweener.clear()
			.to({
				x: nextRp.x,
				y: nextRp.y
			}, speedPerDir )
			.call(function(){
				this.tp = Vector2(x, y);
				this.isWalking = false;
				routeList.shift();
				if(routeList.length > 0){
					let dir = routeList[0].parentObj.dir; // なぜ parentObj?
					this.animation(dir);
					this.walk(routeList, speed);
				}
				else{
					this.animationEnd(this.dir);
					if(this.isInChaseMode || this.isInBattleMode) this._startAction();
					else this._setRandomTimer();
				}
			}.bind(this));
	},

	_calcSpeedPerDir: function(speed){
		if(this.dir == "right" || this.dir == "left") return speed * 2;
		return speed;
	},

	_calcTilePosToRelPos: function(tpX, tpY){
		return this.map.getRelPosOfTile(tpX, tpY);
	},

	update: function(){
    if(!this.isInChaseMode && !this.isInBattleMode){
			let seachAreaYMin = this.tp.y - this.SEARCH_AREA_RANGE;
			let seachAreaYMax = this.tp.y + this.SEARCH_AREA_RANGE;
			let seachAreaXMin = this.tp.x - this.SEARCH_AREA_RANGE;
			let seachAreaXMax = this.tp.x + this.SEARCH_AREA_RANGE;
      for(let y=seachAreaYMin; y<=seachAreaYMax; y++){
        for(let x=seachAreaXMin; x<=seachAreaXMax; x++){
          if(y<this.areaMin || x<this.areaMin || y>this.areaMax || x>this.areaMax) continue;

					let tile = this.map.getTile(x, y);
					let player = tile.searchExistPlayerList(x, y);
					if(player){
						console.log("chase mode");
						this.target = player;
						this.isInBattleMode = false;
						this.isInChaseMode = true;
					}
        }
      }
    }
    else if(!this.isInBattleMode){
      for(let y=this.tp.y-1; y<=this.tp.y+1; y++){
        for(let x=this.tp.x-1; x<=this.tp.x+1; x++){
          if(y<this.areaMin || x<this.areaMin || y>this.areaMax || x>this.areaMax) continue;

					let tile = this.map.getTile(x, y);
					let player = tile.searchExistPlayerList(x, y);
					if(player){
						console.log("battle mode");
						//this.target = player;
						this.isInBattleMode = true;
						this.isInChaseMode = false;
					}
        }
      }
    }
	}
});
