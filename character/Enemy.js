//
//
// Enemy.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define('Enemy', {
	superClass: 'Character',

	SPRITE_NAME: "nasupiyo",
	SPRITE_SHEET_NAME: "nasupiyo_ss",
	WIDTH: 64,
	HEIGHT: 64,
	ORIGIN_X: 0.5,
	ORIGIN_Y: 0.96,
	WALK_SPEED: 900, // ms

	//isInWalkMode: true,
  isInChaseMode: false,
  isInBattleMode: false,
  //TIMER_RANGE_MIN: 2,
	//TIMER_RANGE_MAX: 7,
	CHASE_SPEED: 400,
	CHASE_AREA_RANGE: 3,
	BATTLE_AREA_RANGE: 1,

	WAIT_SECOND_RANGE_MIN: 2,
	WAIT_SECOND_RANGE_MAX: 7,
	BATTLE_WAIT_SECOND: 1,

	hp: 100,
	str: 10,
	def: 10,

	init: function(map, mainLayer, tpX, tpY, areaMinX, areaMaxX, areaMinY, areaMaxY, dir){
		this.superInit(
			map,
			tpX,
			tpY,
			this.SPRITE_NAME,
			this.SPRITE_SHEET_NAME,
			this.WIDTH,
			this.HEIGHT,
			this.ORIGIN_X,
			this.ORIGIN_Y
		);
		this.mainLayer = mainLayer;
		this.walkArea = {min: Vector2(areaMinX, areaMinY), max: Vector2(areaMaxX, areaMaxY)};
		this.targetObj = null;
    this.astar = Astar();

		//let result = function(){console.log(1);}
    //this.tt = setTimeout(result, 2000);
		//let s = setTimeout(function(){clearTimeout(this.tt);}.bind(this), 1000);

		this.walkModeTimer = null;
		this._startWalkMode();
	},

	update: function(){
		if(!this.isInBattleMode && !this.isInChaseMode && !this.isDead) this._searchChaseArea();
		if(!this.isInBattleMode && !this.isDead) this._searchBattleArea();
	},

	_searchBattleArea: function(){
		let attackRp = null;
		let rangeMinX = this.tp.x - this.BATTLE_AREA_RANGE;
		let rangeMinY = this.tp.y - this.BATTLE_AREA_RANGE;
		let rangeMaxX = this.tp.x + this.BATTLE_AREA_RANGE;
		let rangeMaxY = this.tp.y + this.BATTLE_AREA_RANGE;
		for(let x=rangeMinX; x<=rangeMaxX; x++){
			for(let y=rangeMinY; y<=rangeMaxY; y++){
				if(x == this.tp.x && y == this.tp.y) continue;
				let tileTpX = x;
				let tileTpY = y;
				let result = this.mainLayer.searchChildExistance(tileTpX, tileTpY);
				if(result == this.targetObj){
					if(!result.isDead){
						this.isInBattleMode = true;
						attackRp = result.position;
						if(!this.isWalking){
							this._startBattle(attackRp.x, attackRp.y);
							return;
						}
					}
				}
			}
		}
		if(attackRp == null){
			this.isInBattleMode = false;
			this._searchChaseArea();
		}
	},

	_searchChaseArea: function(){
		let objList = [];
		let rangeMinX = this.tp.x - this.CHASE_AREA_RANGE;
		let rangeMinY = this.tp.y - this.CHASE_AREA_RANGE;
		let rangeMaxX = this.tp.x + this.CHASE_AREA_RANGE;
		let rangeMaxY = this.tp.y + this.CHASE_AREA_RANGE;
		for(let x=rangeMinX; x<=rangeMaxX; x++){
			for(let y=rangeMinY; y<=rangeMaxY; y++){
				let tileTpX = x;
				let tileTpY = y;
				let result = this.mainLayer.searchChildExistance(tileTpX, tileTpY);
				/*if(result == this.targetObj && result != this){
					//console.log("1");
					//this._startChasing();
					//return;
				}
				else */if(result && result != this){
					if(!result.isDead) objList.push(result);
				}
			}
		}
		if(objList.length > 0){
			this.targetObj = objList[0];
			this.isInChaseMode = true;
			if(!this.isWalking){
				clearTimeout(this.walkModeTimer);
				this._startChasing();
			}
		}
		else if(this.isInChaseMode){
			this.isInChaseMode = false;
			this.targetObj = null;
			this._startWalkMode();
		}
	},

	_startWalkMode: function(){
		if(this.isDead) return;

		let randomWaitSecond = Math.randint(this.WAIT_SECOND_RANGE_MIN, this.WAIT_SECOND_RANGE_MAX)
		this.walkModeTimer = setTimeout(this._waitEndCallBack.bind(this), randomWaitSecond);
	},

	_waitEndCallBack: function(){
		let mode = ["move", "move", "move", "move", "stay"].random(); // 20% stay
		if(mode == "stay") this._startWalkMode();
		else this._startWalking();
	},

	_startWalking: function(){
		let speed = this.WALK_SPEED;
		let goalTp = this._calcRandomGoalTilePos();
		let isGoalTileWalkable = this._checkPosIsWalkable(goalTp.x, goalTp.y);
		if(!isGoalTileWalkable) this._startWalking();
		else{
			let routeList = this._calcRouteList(goalTp.x, goalTp.y);
			let dir = routeList[0].parentObj.dir; // なぜ parentObj?
			this.animation(dir);
			this.isWalking = true;
	    this.walk(routeList, speed);
		}
	},

	_startChasing: function(){
		if(this.isDead) return;

		let speed = this.CHASE_SPEED;
		let goalTp = this.targetObj.tp;
		if(this.tp.equals(goalTp)){
			let dirList = [];
			let dirX = [-1,-1,-1,0,0,1,1,1];
			let dirY = [-1,0,1,-1,1,-1,0,1];
			for(let x=0; x<dirX.length; x++){
				let newGoal = goalTp.clone().add(Vector2(dirX[x], dirY[x]));
				let isGoalTileWalkable = this._checkPosIsWalkable(newGoal.x, newGoal.y);
				if(isGoalTileWalkable) dirList.push(newGoal);
			}
			goalTp = dirList.random();
		}
		let routeList = this._calcRouteList(goalTp.x, goalTp.y);
		let dir = routeList[0].parentObj.dir; // なぜ parentObj?
		this.animation(dir);
		this.isChasing = true;
		this.isWalking = true;
		this.walk(routeList, speed);
	},

	_startBattle: function(rpX, rpY){
		if(this.isDead) return;

		this.tweener
			.clear()
			.to({x: rpX, y: rpY}, 80)
			.to({x: this.x, y: this.y}, 80)
			.call(this._damageTest.bind(this, this.targetObj))
			.wait(this.BATTLE_WAIT_SECOND * 1000)
			.call(this._searchBattleArea.bind(this));
	},

	_damageTest: function(targetObj){
		targetObj.hp -= this.str - targetObj.def/2;
		//console.log(this.uuid + "attaked to" + targetObj.uuid + targetObj.hp);
		if(targetObj.hp<=0){
			targetObj.isDead = true;
			targetObj.isInBattleMode = false;
			targetObj.isInChaseMode = false;
			targetObj.animationEnd(targetObj.dir);
			targetObj.setFrameIndex(5);
			targetObj._respawnTimerTest();
			//targetObj.alpha = 0.5;
			this.isInBattleMode = false;
			this.isInChaseMode = false;
			this.targetObj = null;
			this._startWalkMode();
		}
	},

	_respawnTimerTest: function(){
		setTimeout(this._respawn.bind(this), 15000);
	},

	_respawn: function(){
		this.hp = 100;
		this.isDead = false;
		this._startWalkMode();
	},

	_calcRandomGoalTilePos: function(){
		let goalTpX = Math.randint(this.walkArea.min.x, this.walkArea.max.x);
    let goalTpY = Math.randint(this.walkArea.min.y, this.walkArea.max.y);
		return Vector2(goalTpX, goalTpY);
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
		this.tweener
			.clear()
			.to({x: nextRp.x, y: nextRp.y}, speedPerDir)
			.call(this._walkTweenEndCallback.bind(this, x, y, routeList, speed));
	},

	_calcTilePosToRelPos: function(tpX, tpY){
		return this.map.getRelPosOfTile(tpX, tpY);
	},

	_walkTweenEndCallback: function(x, y, routeList, speed){

		this.tp = Vector2(x, y);
		this.isWalking = false;

		if(this.isInBattleMode){
			this._searchBattleArea();
			return;
		}
		else if(this.isInChaseMode && !this.isChasing){
			this._searchChaseArea();
			return;
		}

		routeList.shift();
		if(routeList.length > 1){
			let dir = routeList[0].parentObj.dir; // なぜ parentObj?
			this.animation(dir);
			this.walk(routeList, speed);
		}
		else if(routeList.length == 1 && this.isInChaseMode){
			this.animationEnd(this.dir);
			this.isChasing = false;
			this._searchBattleArea();
		}
		else if(routeList.length == 1){
			let dir = routeList[0].parentObj.dir; // なぜ parentObj?
			this.animation(dir);
			this.walk(routeList, speed);
		}
		else{
			this.animationEnd(this.dir);
			if(!this.isDead) this._startWalkMode();
		}
	},






	/*
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
		let goalTp = this._calcRandomGoalTilePos();
		let isGoalTileValid = this._checkPosIsWalkable(goalTp.x, goalTp.y);
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

	_calcRandomGoalTilePos: function(){
		let goalTpX = Math.randint(this.areaMinX, this.areaMaxX);
    let goalTpY = Math.randint(this.areaMinY, this.areaMaxY);
		return Vector2(goalTpX, goalTpY);
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


		this.isInBattleMode = false; //暫定
		this.isInChaseMode = true;


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
		this.tweener
			.clear()
			.to({x: nextRp.x, y: nextRp.y}, speedPerDir)
			.call(this._walkTweenEndCallback.bind(this, x, y, routeList, speed));
	},

	_walkTweenEndCallback: function(x, y, routeList, speed){
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
			//if(this.isInChaseMode || this.isInBattleMode) this._startAction();
			/*else this._setRandomTimer();
		}
	},

	_calcTilePosToRelPos: function(tpX, tpY){
		return this.map.getRelPosOfTile(tpX, tpY);
	}
	*/
});
