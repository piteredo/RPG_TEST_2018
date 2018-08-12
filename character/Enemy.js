//
//
// Enemy.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define('Enemy', {
	superClass: 'Sprite',

	SPRITE_NAME: "tomapiko",
	WIDTH: 64,
	HEIGHT: 64,
	SPRITE_SHEET_NAME: "tomapiko_ss",
	ORIGIN_X: 0.5,
	ORIGIN_Y: 0.96,
	WALK_SPEED: 300, // ms
	isWalkable: false,
	isWalking: false,
	isAnimating: false,
	dir: "down", //default

  isInChaseMode: false,
  isInBattleMode: false,
  areaMin: 0,
  areaMax: 10,

	init: function(map, tpX, tpY, dir){
		this.superInit(this.SPRITE_NAME, this.WIDTH, this.HEIGHT);
		this.setOrigin(this.ORIGIN_X, this.ORIGIN_Y);
		this._setMapData(map);
		this._setPositions(tpX, tpY);
		this._setDirection(dir);
		this._initFrameIndex();

    this.astar = Astar(this.map.getTileLength());
    this._startTimer();
	},

  _startTimer: function(){
    let t = setTimeout(this._action, 3000, this);
  },

  _action: function(self){
    let goalX = Math.randint(self.areaMin, self.areaMax);
    let goalY = Math.randint(self.areaMin, self.areaMax);
    if(!self.map.getTileIsWalkable(goalX, goalY)){
      self._action(self);
      return;
    }
    if(goalX == self.tp.x && goalY == self.tp.y){
      self._action(self);
      return;
    }

    let mapArr = self.map.getTileList();
		let isWalkableArr = [];
		(mapArr.length).times(function(y){
			isWalkableArr.push([]);
			(mapArr[y].length).times(function(x){
				isWalkableArr[y].push(mapArr[y][x].isWalkable);
			}.bind(this));
		}.bind(this));
    let startNode = self.tp;
    let goalNode = Vector2(goalX, goalY);
    self.routeList = self.astar.calcAStar(startNode, goalNode, isWalkableArr);
    //self.animation(self.routeList[0].dir);
    ////self.dir = self.routeList[0].dir;
    self.isAnimating = true;
    self.isWalking = true;

    //console.log(self.routeList[0]);

    self.walkTest(self.routeList[0].x, self.routeList[0].y);
  },

	update: function(){
		if(this.isWalkable) this._walkLoop();
		if(!this.isWalking && !this.isWalkable && this.isAnimating) this.animationEnd();

    for(let yy=this.areaMin; yy<=this.areaMax; yy++){
      for(let xx=this.areaMin; xx<=this.areaMax; xx++){
        //this.map.children[yy].children[xx].alpha = 1;
      }

    }
    if(!this.isInChaseMode && !this.isInBattleMode){
      let range = 3;
      for(let y=this.tp.y-range; y<=this.tp.y+range; y++){
        for(let x=this.tp.x-range; x<=this.tp.x+range; x++){
          if(y<this.areaMin || x<this.areaMin || y>this.areaMax || x>this.areaMax) continue;
          //this.map.children[y].children[x].alpha = 0.7;
        }
      }
    }
    if(!this.isInBattleMode){
      for(let y=this.tp.y-1; y<=this.tp.y+1; y++){
        for(let x=this.tp.x-1; x<=this.tp.x+1; x++){
          if(y<this.areaMin || x<this.areaMin || y>this.areaMax || x>this.areaMax) continue;
          //this.map.children[y].children[x].alpha = 0.4;
        }
      }
    }
	},

	_setMapData: function(map){
		this.map = map;
	},

	_setPositions: function(tpX, tpY){
		this._setTilePos(tpX, tpY);
		this._setRelPos(tpX, tpY);
	},

	_setTilePos: function(tpX, tpY){
		this.tp = Vector2(tpX, tpY);
	},

	_setRelPos: function(tpX, tpY){
		let rp = this.map.getRelPosOfTile(this.tp.x, this.tp.y);
		this.setPosition(rp.x, rp.y);
	},

	_setDirection: function(dir){
		this.dir = dir || this.dir; // receive or default
	},

	_initFrameIndex: function(){
		this.anim = FrameAnimation(this.SPRITE_SHEET_NAME).attachTo(this);
		this.anim.gotoAndStop(this.dir);
	},

	_calcRelToAbsPosition: function(tpX, tpY){
		return this.map.getRelPosOfTile(tpX, tpY);
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
			let nextRelPos = this.calcNextRelPosition(this.tp, this.dir);
			if(this._checkPosIsWalkable(nextRelPos)) this.walk(nextRelPos.x, nextRelPos.y);
		}
	},

  walkTest: function(x, y){
		this.isWalking = true;
		let speed = this.WALK_SPEED;
		if(this.dir == "right" || this.dir == "left") speed *= 2;
		let nextAbsPos = this._calcRelToAbsPosition(x, y);
		this.tweener.clear()
			.to({
				x: nextAbsPos.x,
				y: nextAbsPos.y
			}, speed )
			.call(function(){
				this.tp = Vector2(x,y);
				this.isWalking = false;

        this.routeList.shift();
        if(this.routeList.length>0){
          //this.animation(this.routeList[0].dir);
          //this.dir = this.routeList[0].dir;
          this.walkTest(this.routeList[0].x, this.routeList[0].y);
        }
        else{
          //this.animation(this.dir);
          this._startTimer();
        }
				//tell new pos
			}.bind(this));
	},

	walk: function(x, y){
		this.isWalking = true;
		let speed = this.WALK_SPEED;
		if(this.dir == "right" || this.dir == "left") speed *= 2;
		let nextAbsPos = this._calcRelToAbsPosition(x, y);
		this.tweener.clear()
			.to({
				x: nextAbsPos.x,
				y: nextAbsPos.y
			}, speed )
			.call(function(){
				this.tp = Vector2(x,y);
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
		else if(!this._checkTileIsWalkable(nextRelPos)) return false;
		return true;
	},

	_checkMapRange: function(nextRelPos){
		let p = nextRelPos;
		let len = this.map.getTileLength();
		if(p.x<0 || p.y<0 || p.x>=len || p.y>=len) return false;
		return true;
	},

	_checkTileIsWalkable: function(nextRelPos){
		return this.map.getTileIsWalkable(nextRelPos.x, nextRelPos.y);
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
		return this.tp;
	},

	getAbsPosition: function(){
		return Vector2(this.x , this.y);
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
