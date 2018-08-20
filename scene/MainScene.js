//
//
// MainScene.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define('MainScene', {
	superClass: 'DisplayScene',

	init: function(){
		this.superInit({
			backgroundColor: BACKGROUND_COLOR
		});

		this.map = Map();
		this.mapLayer = MapLayer().addChildTo(this);

		let mainLayerChildrenList = [];
		let myPlayerTp = this.map.calcRandomWalkableTilePos();
		let myPlayer = Player(this.map, myPlayerTp.x, myPlayerTp.y);
		mainLayerChildrenList.push(myPlayer);
		this.mainLayer = MainLayer(this.map).addChildTo(this);
		this._initEnemys(mainLayerChildrenList);
		this.mainLayer.attachChildrenList(mainLayerChildrenList);

		this.uiSet = UiSet(myPlayer);
		this.uiLayer = UiLayer(this.uiSet).addChildTo(this);

		let mapTileList = this.map.getTileList();
		this.camera = Camera(this.mapLayer,	this.mainLayer,	mapTileList, myPlayer).addChildTo(this);
	},

	_initEnemys: function(mainLayerChildrenList){ // 暫定
		const ENEMY_AREA_LENGTH = 2; // x y same
		const ENEMY_AREA_SIZE = Math.floor(this.map.getTileLength()/ENEMY_AREA_LENGTH);
		for(let x=0; x<ENEMY_AREA_LENGTH; x++){
			for(let y=0; y<ENEMY_AREA_LENGTH; y++){
				let areaMinX = x * ENEMY_AREA_SIZE;
				let areaMaxX = areaMinX + ENEMY_AREA_SIZE - 1;
				let areaMinY = y * ENEMY_AREA_SIZE;
				let areaMaxY = areaMinY + ENEMY_AREA_SIZE - 1;
				let enemyTp = this.map.calcRandomWalkableTilePos(areaMinX, areaMaxX, areaMinY, areaMaxY);
				let enemy = Enemy(this.map, this.mainLayer, enemyTp.x, enemyTp.y, areaMinX, areaMaxX, areaMinY, areaMaxY);
				mainLayerChildrenList.push(enemy);
			}
		}
	},

	/*_initNetConnection: function(){
		this.nc = NetConnection(this.map, this.myPlayer, this.layerSet);
	}*/
});
